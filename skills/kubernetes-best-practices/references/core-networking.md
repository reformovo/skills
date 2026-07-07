---
name: core-networking
description: Kubernetes Services, Ingress, Gateway API, DNS, NetworkPolicies, egress controls, and traffic exposure patterns.
---

# Networking

Use this reference when exposing pods, routing traffic, isolating namespaces, or debugging connectivity.

## Service Pattern

Use `ClusterIP` for internal services. Use named ports and stable selectors:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: payments-api
  namespace: payments
spec:
  type: ClusterIP
  selector:
    app.kubernetes.io/name: payments
    app.kubernetes.io/component: api
  ports:
    - name: http
      port: 80
      targetPort: http
```

Use `LoadBalancer` only when direct external exposure is intended. Prefer Ingress or Gateway API for HTTP routing when an ingress controller or gateway implementation exists.

## Ingress and Gateway

Ingress example:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: payments-api
  namespace: payments
spec:
  ingressClassName: nginx
  rules:
    - host: payments.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: payments-api
                port:
                  name: http
```

For new platform designs, consider Gateway API when the cluster has a supported controller and the team needs portable, role-oriented routing objects.

## NetworkPolicy

NetworkPolicies require a CNI plugin that enforces them. Start with default-deny, then add explicit flows:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
  namespace: payments
spec:
  podSelector: {}
  policyTypes: ["Ingress", "Egress"]
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-api
  namespace: payments
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: payments
      app.kubernetes.io/component: api
  policyTypes: ["Ingress", "Egress"]
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: frontend
          podSelector:
            matchLabels:
              app.kubernetes.io/component: web
      ports:
        - protocol: TCP
          port: 8080
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: kube-system
      ports:
        - protocol: UDP
          port: 53
```

Be explicit about required DNS, database, message broker, metrics, and external API egress.

## DNS and Connectivity Checks

```bash
kubectl get endpointslice -n payments -l kubernetes.io/service-name=payments-api
kubectl describe service payments-api -n payments
kubectl run netcheck -n payments --rm -it --image=curlimages/curl:8.8.0 -- sh
```

## Key Points

- A Service selects pods by labels; a mismatch means no endpoints.
- Readiness probes control whether pods appear behind Services.
- NetworkPolicy selectors are additive; any matching policy can allow traffic.
- Cross-namespace traffic should be intentional and label-based.
- External DNS, certificates, WAF, and load-balancer annotations are controller-specific; state the dependency.

<!--
Source references:
- https://github.com/Jeffallan/claude-skills/blob/main/skills/kubernetes-specialist/SKILL.md
- https://kubernetes.io/docs/concepts/services-networking/service/
- https://kubernetes.io/docs/concepts/services-networking/ingress/
- https://kubernetes.io/docs/concepts/services-networking/network-policies/
- https://gateway-api.sigs.k8s.io/
-->
