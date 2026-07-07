---
name: best-practices-helm-gitops
description: Kubernetes Helm chart and GitOps practices for chart layout, values contracts, templates, dry-run, diff, secrets, Argo CD, Flux, and progressive delivery.
---

# Helm and GitOps

Use this reference when creating Helm charts, reviewing values, or managing Kubernetes through Argo CD, Flux, or another GitOps controller.

## Chart Shape

```text
charts/payments-api/
  Chart.yaml
  values.yaml
  values.schema.json
  templates/
    _helpers.tpl
    deployment.yaml
    service.yaml
    networkpolicy.yaml
    serviceaccount.yaml
  templates/tests/
    smoke-test.yaml
```

Values should be a stable API, not a dump of Kubernetes objects. Keep environment-specific values in separate files or overlays.

## Values Contract

```yaml
image:
  repository: registry.example.com/payments-api
  tag: "1.8.3"
  pullPolicy: IfNotPresent

replicaCount: 3

resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    memory: 256Mi
```

Add `values.schema.json` for required fields and type checks:

```json
{
  "$schema": "https://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["image"],
  "properties": {
    "replicaCount": { "type": "integer", "minimum": 1 }
  }
}
```

## Template Rules

- Use helpers for names and common labels.
- Quote strings that may parse ambiguously.
- Use `required` for values with no safe default.
- Avoid `lookup` in templates unless live-cluster rendering is intentional.
- Do not put secret values in `values.yaml`; reference existing Secrets or encrypted secret workflows.

## Validation

```bash
helm lint charts/payments-api
helm template payments-api charts/payments-api -f values-prod.yaml | kubeconform -strict
helm upgrade --install payments-api charts/payments-api -n payments --dry-run=server
helm diff upgrade payments-api charts/payments-api -n payments -f values-prod.yaml
```

## GitOps Rules

- Git is the desired state; avoid manual cluster edits except emergency remediation.
- Keep app source, chart source, and environment config boundaries clear.
- Use sync waves or dependencies for CRDs before custom resources.
- Use sealed/encrypted secrets or external secret references, not cleartext Secrets.
- Prefer progressive delivery controllers for high-risk traffic shifts.
- Require drift detection, policy checks, and review before production sync.

Example Argo CD Application:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: payments-api
  namespace: argocd
spec:
  project: payments
  source:
    repoURL: https://git.example.com/platform/apps.git
    targetRevision: main
    path: charts/payments-api
    helm:
      valueFiles:
        - values-prod.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: payments
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

<!--
Source references:
- https://github.com/Jeffallan/claude-skills/blob/main/skills/kubernetes-specialist/SKILL.md
- https://helm.sh/docs/chart_best_practices/
- https://argo-cd.readthedocs.io/
- https://fluxcd.io/flux/concepts/
-->
