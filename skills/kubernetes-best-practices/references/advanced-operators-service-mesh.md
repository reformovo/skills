---
name: advanced-operators-service-mesh
description: Kubernetes CRD, operator, controller, reconciliation, admission policy, and service mesh practices for advanced platform work.
---

# Operators and Service Mesh

Use this reference when introducing CRDs/controllers, writing operators, or enabling service mesh features such as mTLS, traffic splitting, retries, and canary routing.

## CRD and Operator Rules

- Add CRDs before custom resources and make upgrades explicit.
- Keep CRD schemas structural and validated; reject invalid states early.
- Design status fields for observed state and conditions, not desired config.
- Make reconciliation idempotent: repeated runs should converge without duplicate side effects.
- Use finalizers only when external cleanup is required, and ensure stuck finalizers can be diagnosed.
- Document ownership boundaries so users know whether to edit child resources directly.

Minimal custom resource shape:

```yaml
apiVersion: platform.example.com/v1alpha1
kind: AppDatabase
metadata:
  name: payments
  namespace: payments
spec:
  engine: postgres
  storage:
    size: 100Gi
status:
  conditions:
    - type: Ready
      status: "True"
      reason: Provisioned
```

## Admission and Policy

Use admission controls for cluster invariants:

- Require non-root pods and restricted security contexts.
- Reject `latest` tags in production namespaces.
- Require requests for all containers.
- Block wildcard RBAC and privileged pods outside platform namespaces.

State the policy engine dependency, such as ValidatingAdmissionPolicy, Gatekeeper, Kyverno, or a cloud provider policy layer.

## Service Mesh Guardrails

Use mesh features when platform benefits justify sidecar or data-plane complexity:

- mTLS between services
- canary or weighted routing
- retries, timeouts, and circuit breaking
- traffic observability
- identity-based authorization

Example traffic split shape, controller-specific:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: payments-api
  namespace: payments
spec:
  parentRefs:
    - name: public-gateway
  rules:
    - backendRefs:
        - name: payments-api-v1
          port: 80
          weight: 90
        - name: payments-api-v2
          port: 80
          weight: 10
```

## Mesh Rollout Rules

- Enable sidecar injection namespace by namespace, not cluster-wide all at once.
- Verify readiness and liveness probes still work after injection.
- Set explicit timeouts; retries without timeouts can amplify incidents.
- Do not enable strict mTLS until all clients and servers in the path are mesh-ready.
- Include rollback steps for injection labels, policies, and route changes.

## Validation

```bash
kubectl get crd | rg 'example.com|gateway.networking.k8s.io'
kubectl describe validatingadmissionpolicy
kubectl get httproute,gateway -A
kubectl get events -n payments --sort-by=.lastTimestamp
```

<!--
Source references:
- https://github.com/Jeffallan/claude-skills/blob/main/skills/kubernetes-specialist/SKILL.md
- https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/
- https://kubernetes.io/docs/reference/access-authn-authz/validating-admission-policy/
- https://gateway-api.sigs.k8s.io/
-->
