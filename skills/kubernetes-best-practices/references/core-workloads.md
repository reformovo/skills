---
name: core-workloads
description: Kubernetes workload selection, metadata, selectors, pod templates, probes, resources, rollouts, and common manifest patterns.
---

# Workloads

Use this reference when creating or reviewing Deployments, StatefulSets, DaemonSets, Jobs, CronJobs, or raw Pod templates.

## Workload Choice

| Need | Use |
|------|-----|
| Stateless replicated service | `Deployment` |
| Stable network identity or persistent per-replica storage | `StatefulSet` |
| One pod on each selected node | `DaemonSet` |
| Finite batch work | `Job` |
| Scheduled batch work | `CronJob` |

Avoid raw Pods for application delivery. Controllers provide replacement, rollout, and status semantics.

## Metadata and Selectors

Use stable labels and never change selectors unless planning a migration:

```yaml
metadata:
  labels:
    app.kubernetes.io/name: payments
    app.kubernetes.io/component: api
    app.kubernetes.io/part-of: commerce
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: payments
      app.kubernetes.io/component: api
```

Selectors should be narrow enough to avoid adopting unrelated pods. Do not include changing values such as image versions in selectors.

## Production Deployment Pattern

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payments-api
  namespace: payments
  labels:
    app.kubernetes.io/name: payments
    app.kubernetes.io/component: api
spec:
  replicas: 3
  revisionHistoryLimit: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0
      maxSurge: 1
  selector:
    matchLabels:
      app.kubernetes.io/name: payments
      app.kubernetes.io/component: api
  template:
    metadata:
      labels:
        app.kubernetes.io/name: payments
        app.kubernetes.io/component: api
    spec:
      serviceAccountName: payments-api
      securityContext:
        runAsNonRoot: true
        seccompProfile:
          type: RuntimeDefault
      containers:
        - name: api
          image: registry.example.com/payments-api:1.8.3
          ports:
            - name: http
              containerPort: 8080
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              memory: 256Mi
          startupProbe:
            httpGet:
              path: /healthz
              port: http
            failureThreshold: 30
            periodSeconds: 2
          readinessProbe:
            httpGet:
              path: /readyz
              port: http
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /healthz
              port: http
            periodSeconds: 10
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop: ["ALL"]
```

## Probe Rules

- Use readiness probes to remove unavailable pods from Service endpoints.
- Use startup probes for slow-starting processes before liveness probes begin.
- Use liveness probes only for failures that a restart can fix.
- Prefer named ports so probe and Service references survive container port changes.
- Keep probe timeouts and failure thresholds realistic for the application and network.

## Resource Rules

- Set CPU and memory requests for every container.
- Set memory limits for most application containers to bound node impact.
- Be careful with CPU limits for latency-sensitive services; throttling may be worse than contention. Follow local policy.
- Include sidecar and init container resources, not just the main container.

## Validation

```bash
kubectl apply --server-side --dry-run=server -f k8s/
kubectl diff -f k8s/
kubectl rollout status deployment/payments-api -n payments
kubectl describe deployment/payments-api -n payments
```

<!--
Source references:
- https://github.com/Jeffallan/claude-skills/blob/main/skills/kubernetes-specialist/SKILL.md
- https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
- https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-probes
- https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
-->
