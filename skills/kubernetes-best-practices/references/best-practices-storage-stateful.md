---
name: best-practices-storage-stateful
description: Kubernetes StatefulSets, PersistentVolumeClaims, StorageClasses, volume expansion, retention, backups, and stateful workload disruption controls.
---

# Storage and Stateful Workloads

Use this reference when workloads need durable data, stable pod identity, ordered rollout, or per-replica volumes.

## StatefulSet Pattern

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: ledger
  namespace: payments
spec:
  serviceName: ledger
  replicas: 3
  selector:
    matchLabels:
      app.kubernetes.io/name: ledger
  template:
    metadata:
      labels:
        app.kubernetes.io/name: ledger
    spec:
      terminationGracePeriodSeconds: 60
      containers:
        - name: ledger
          image: registry.example.com/ledger:4.2.1
          ports:
            - name: api
              containerPort: 8080
          volumeMounts:
            - name: data
              mountPath: /var/lib/ledger
          resources:
            requests:
              cpu: 500m
              memory: 1Gi
            limits:
              memory: 2Gi
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: ["ReadWriteOnce"]
        storageClassName: fast-retain
        resources:
          requests:
            storage: 100Gi
```

## StorageClass Choice

- Confirm reclaim policy: `Retain` for critical data, `Delete` for disposable data.
- Confirm volume binding mode; `WaitForFirstConsumer` avoids provisioning volumes in the wrong zone.
- Confirm expansion support before increasing PVC sizes.
- Match access mode to the workload. `ReadWriteOnce` is common for per-pod data; shared writes require storage that actually supports it.

## Data Safety Rules

- Document backup and restore commands before production rollout.
- Test restore into a non-production namespace or cluster.
- Do not assume deleting a StatefulSet deletes or preserves PVCs; check retention policy and reclaim policy.
- Use preStop hooks and adequate `terminationGracePeriodSeconds` for clean shutdown when the application needs it.
- Avoid hostPath for application data except local development or specialized node-level workloads.

## PDB for Stateful Workloads

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: ledger
  namespace: payments
spec:
  maxUnavailable: 1
  selector:
    matchLabels:
      app.kubernetes.io/name: ledger
```

For quorum systems, align disruption budgets with quorum math and failure-domain spread.

## Validation

```bash
kubectl get pvc,pv -n payments
kubectl describe storageclass fast-retain
kubectl rollout status statefulset/ledger -n payments
kubectl describe pod ledger-0 -n payments
```

<!--
Source references:
- https://github.com/Jeffallan/claude-skills/blob/main/skills/kubernetes-specialist/SKILL.md
- https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/
- https://kubernetes.io/docs/concepts/storage/persistent-volumes/
- https://kubernetes.io/docs/concepts/storage/storage-classes/
-->
