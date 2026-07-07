---
name: best-practices-observability-troubleshooting
description: Kubernetes validation, rollout checks, logs, events, metrics, kubectl debugging, and common failure diagnosis workflows.
---

# Observability and Troubleshooting

Use this reference when validating a deployment, debugging failures, or adding operational signals.

## Rollout Validation

```bash
kubectl apply --server-side --dry-run=server -f k8s/
kubectl diff -f k8s/
kubectl apply -f k8s/
kubectl rollout status deployment/payments-api -n payments
kubectl get pods -n payments -l app.kubernetes.io/name=payments -w
```

Rollback when a Deployment rollout is bad:

```bash
kubectl rollout undo deployment/payments-api -n payments
kubectl rollout status deployment/payments-api -n payments
```

## Failure Triage

Use the cheapest evidence first:

```bash
kubectl get pod -n payments
kubectl describe pod <pod> -n payments
kubectl logs <pod> -n payments --all-containers
kubectl logs <pod> -n payments --previous
kubectl get events -n payments --sort-by=.lastTimestamp
```

Common signals:

| Symptom | Likely area | First checks |
|---------|-------------|--------------|
| `ImagePullBackOff` | Registry, tag, credentials | image name, pull secret, registry auth |
| `CrashLoopBackOff` | App crash or bad probe | previous logs, env, config, liveness probe |
| `Pending` | Scheduling | requests, taints, PVC binding, quotas |
| No Service endpoints | Labels or readiness | selector labels, readiness probe |
| 403 from Kubernetes API | RBAC | `kubectl auth can-i`, ServiceAccount |
| DNS/connect timeout | NetworkPolicy or DNS | egress policy, CoreDNS, EndpointSlices |

## Debugging

Use ephemeral debug containers only when RBAC and cluster version allow it:

```bash
kubectl debug -n payments -it <pod> --image=nicolaka/netshoot --target=api
```

For network checks without modifying the target pod:

```bash
kubectl run netcheck -n payments --rm -it --image=curlimages/curl:8.8.0 -- sh
```

## Observability Contract

Application manifests should make signals discoverable:

```yaml
metadata:
  labels:
    app.kubernetes.io/name: payments
    app.kubernetes.io/component: api
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "8080"
    prometheus.io/path: /metrics
```

Prefer platform-standard ServiceMonitor/PodMonitor CRDs when the cluster uses Prometheus Operator. State the CRD dependency instead of emitting custom resources blindly.

## Key Points

- Logs should go to stdout/stderr and avoid secrets.
- Events are short-lived; collect them quickly during incident diagnosis.
- Metrics pipelines, log aggregation, tracing, and alerting are cluster-specific dependencies.
- Include dashboards and alerts for SLO-bearing workloads, not just manifests.

<!--
Source references:
- https://github.com/Jeffallan/claude-skills/blob/main/skills/kubernetes-specialist/SKILL.md
- https://kubernetes.io/docs/reference/kubectl/
- https://kubernetes.io/docs/tasks/debug/debug-application/
- https://kubernetes.io/docs/concepts/cluster-administration/logging/
-->
