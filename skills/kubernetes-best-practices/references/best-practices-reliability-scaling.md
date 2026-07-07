---
name: best-practices-reliability-scaling
description: Kubernetes reliability and scaling patterns for requests, limits, HPA, VPA, PDBs, topology spread, quotas, priority, and disruption handling.
---

# Reliability and Scaling

Use this reference for production hardening, autoscaling, right-sizing, availability, and disruption planning.

## Requests, Limits, and Right-Sizing

- Set CPU and memory requests on every container so scheduling and autoscaling have useful signals.
- Memory limits protect nodes from runaway usage; set them with application OOM behavior in mind.
- CPU limits can cause throttling; use them when policy requires or noisy-neighbor control is more important than latency.
- Use metrics history, load tests, or VPA recommendations to choose requests instead of guessing.

```yaml
resources:
  requests:
    cpu: 250m
    memory: 256Mi
  limits:
    memory: 512Mi
```

## Horizontal Autoscaling

Use HPA for replica count:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: payments-api
  namespace: payments
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: payments-api
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 65
```

Use VPA for recommendations or controlled request updates. Avoid combining HPA on CPU utilization with VPA changing CPU requests unless the interaction is understood.

## Disruption Budgets

Use PDBs for voluntary disruptions:

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: payments-api
  namespace: payments
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app.kubernetes.io/name: payments
      app.kubernetes.io/component: api
```

Do not set `minAvailable` equal to replicas unless node drains are intentionally blocked. For single-replica workloads, a PDB cannot create availability by itself.

## Topology Spread

Distribute pods across zones or nodes:

```yaml
topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: topology.kubernetes.io/zone
    whenUnsatisfiable: ScheduleAnyway
    labelSelector:
      matchLabels:
        app.kubernetes.io/name: payments
        app.kubernetes.io/component: api
```

Use `DoNotSchedule` only when capacity is guaranteed enough to satisfy the constraint.

## Quotas and Limits

Use namespace `ResourceQuota` and `LimitRange` to prevent accidental overuse:

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-budget
  namespace: payments
spec:
  hard:
    requests.cpu: "20"
    requests.memory: 40Gi
    limits.memory: 80Gi
```

## Validation

```bash
kubectl top pods -n payments
kubectl describe hpa payments-api -n payments
kubectl describe pdb payments-api -n payments
kubectl get events -n payments --sort-by=.lastTimestamp
```

<!--
Source references:
- https://github.com/microsoft/azure-skills/blob/main/skills/azure-kubernetes/SKILL.md
- https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
- https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/
- https://kubernetes.io/docs/concepts/workloads/pods/disruptions/
- https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/
-->
