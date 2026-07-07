---
name: core-configuration-secrets
description: Kubernetes ConfigMaps, Secrets, environment variables, mounted files, immutable configuration, rollout behavior, and secret handling.
---

# Configuration and Secrets

Use this reference when adding environment variables, mounted configuration, Secret references, or application configuration rollout behavior.

## ConfigMap Usage

Use ConfigMaps for non-sensitive configuration:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: payments-api
  namespace: payments
immutable: true
data:
  LOG_LEVEL: info
  FEATURE_REFUNDS: "true"
```

Reference it from a pod:

```yaml
envFrom:
  - configMapRef:
      name: payments-api
```

Use mounted files when config is structured or large:

```yaml
volumeMounts:
  - name: app-config
    mountPath: /etc/payments
    readOnly: true
volumes:
  - name: app-config
    configMap:
      name: payments-api
```

## Secret Usage

Use Secrets or an external secret integration for sensitive values:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: payments-api
  namespace: payments
type: Opaque
stringData:
  DATABASE_URL: "replace-with-secret-manager-sync"
```

Reference Secrets without printing values:

```yaml
env:
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: payments-api
        key: DATABASE_URL
```

Prefer external secret managers, CSI drivers, or sealed/encrypted GitOps secrets for production. Do not commit real Secret manifests with cleartext `stringData` or reversible `data` values.

## Rollout Behavior

Kubernetes does not automatically restart pods when referenced ConfigMaps or Secrets change. Use one of these patterns:

- Change an annotation on the pod template with a config checksum.
- Let GitOps or a controller restart affected workloads.
- Use immutable ConfigMaps/Secrets with versioned names and update references.

Example checksum annotation in a Helm template:

```yaml
spec:
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
```

## Key Points

- Keep config small and purpose-specific.
- Avoid putting secrets in command-line args; they can appear in process listings and logs.
- Mount secret volumes read-only.
- Use least-privilege RBAC because reading Secrets is equivalent to credential access.
- Avoid environment-wide ConfigMaps that couple unrelated applications.

<!--
Source references:
- https://github.com/Jeffallan/claude-skills/blob/main/skills/kubernetes-specialist/SKILL.md
- https://kubernetes.io/docs/concepts/configuration/configmap/
- https://kubernetes.io/docs/concepts/configuration/secret/
- https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/
-->
