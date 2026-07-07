---
name: core-security-rbac
description: Kubernetes Pod Security Standards, runtime hardening, ServiceAccounts, RBAC least privilege, image policy, and sensitive access guardrails.
---

# Security and RBAC

Use this reference when hardening pods, creating ServiceAccounts, writing RBAC, reviewing cluster permissions, or setting namespace security posture.

## Pod Security Baseline

Prefer the Restricted Pod Security Standard for ordinary workloads:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: payments
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

Workloads should normally include:

```yaml
spec:
  securityContext:
    runAsNonRoot: true
    seccompProfile:
      type: RuntimeDefault
  containers:
    - name: api
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop: ["ALL"]
```

Only use `privileged`, `hostNetwork`, `hostPID`, `hostPath`, added capabilities, or root users for infrastructure workloads with a documented reason and namespace isolation.

## ServiceAccount and RBAC Pattern

Create a dedicated ServiceAccount per application and bind only needed verbs:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: payments-api
  namespace: payments
automountServiceAccountToken: false
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: payments-api-reader
  namespace: payments
rules:
  - apiGroups: [""]
    resources: ["configmaps"]
    resourceNames: ["payments-api"]
    verbs: ["get"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: payments-api-reader
  namespace: payments
subjects:
  - kind: ServiceAccount
    name: payments-api
    namespace: payments
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: payments-api-reader
```

Set `automountServiceAccountToken: true` only when the pod really needs Kubernetes API access.

## RBAC Rules

- Prefer `Role` and `RoleBinding` over cluster-wide permissions.
- Avoid `*` resources, verbs, and API groups.
- Avoid binding application ServiceAccounts to `cluster-admin`, `admin`, or `edit`.
- Use `resourceNames` when a controller needs one named object.
- Review impersonation, secrets access, and token creation as high-risk privileges.

## Image and Runtime Guardrails

- Use immutable image tags or digests for production.
- Pull images from trusted registries and enable admission policy for signatures or provenance where available.
- Use `imagePullPolicy: IfNotPresent` with immutable tags; use digest pinning where supply-chain risk is high.
- Keep debug images and ephemeral containers behind RBAC controls.

## Validation

```bash
kubectl auth can-i --list --as=system:serviceaccount:payments:payments-api -n payments
kubectl auth can-i get secrets --as=system:serviceaccount:payments:payments-api -n payments
kubectl apply --server-side --dry-run=server -f security.yaml
```

<!--
Source references:
- https://github.com/Jeffallan/claude-skills/blob/main/skills/kubernetes-specialist/SKILL.md
- https://kubernetes.io/docs/concepts/security/pod-security-standards/
- https://kubernetes.io/docs/reference/access-authn-authz/rbac/
- https://kubernetes.io/docs/tasks/configure-pod-container/security-context/
-->
