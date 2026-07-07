---
name: kubernetes-best-practices
description: MUST be used for Kubernetes and K8s tasks. Covers workload manifests, Deployments, StatefulSets, Jobs, probes, requests and limits, Pod Security Standards, service accounts, RBAC, NetworkPolicies, Services, Ingress and Gateway API, ConfigMaps, Secrets, persistent storage, autoscaling, disruption budgets, topology spread, Helm charts, GitOps, operators, service mesh, kubectl validation, and troubleshooting. Load for any Kubernetes YAML writing, reviewing, debugging, hardening, scaling, charting, or platform operation work.
metadata:
  author: reformovo
  version: "2026.07.07"
  source: Synthesized from Jeffallan kubernetes-specialist, Microsoft azure-kubernetes, and Kubernetes official documentation
---

> This skill synthesizes Kubernetes best-practice guidance from Jeffallan's Kubernetes specialist skill, Microsoft's Azure Kubernetes skill, and Kubernetes official documentation, rewritten for generic Kubernetes agent use.

Use this skill to produce Kubernetes changes that are declarative, least-privilege, observable, resilient to disruption, and reviewable before they reach a cluster. Do not include AKS-only guidance unless the user explicitly asks for Azure.

## Core Principles

- **Design before YAML:** identify workload type, lifecycle, traffic shape, state, scaling model, security boundary, and rollout risk before writing manifests.
- **Prefer declarative control:** produce manifests, Helm templates, Kustomize overlays, or GitOps changes; use imperative `kubectl` only for inspection, debugging, or emergency rollback.
- **Make failure explicit:** configure probes, requests, limits, disruption budgets, topology spread, and rollout commands based on the workload's real behavior.
- **Default to least privilege:** use dedicated ServiceAccounts, scoped RBAC, Pod Security Standards, image provenance, and NetworkPolicies.
- **Separate config from secrets:** keep non-sensitive config in ConfigMaps, sensitive values in Secrets or an external secret manager, and avoid logging or embedding credentials.
- **Validate against the live API when possible:** use server-side dry-run, schema-aware tools, policy checks, and rollout evidence.

## Required Usage Workflow

1. **Capture context.** Determine cluster version, namespace, workload kind, container image/tag, ports, replicas, resource profile, storage needs, security constraints, ingress requirements, and whether production is involved. If unknown, state assumptions.
2. **Select references by task.** Start with [core-workloads](references/core-workloads.md), [core-security-rbac](references/core-security-rbac.md), and [core-networking](references/core-networking.md). Load storage, scaling, Helm/GitOps, troubleshooting, or advanced references only when relevant.
3. **Generate reviewable manifests.** Include stable labels/selectors, namespace placement, resource requests, probes, security contexts, explicit ServiceAccounts, and NetworkPolicies where appropriate.
4. **Call out cluster dependencies.** Name required CRDs, ingress controllers, CSI drivers, policy engines, service mesh sidecars, metrics adapters, or autoscaler components.
5. **Validate before finalizing.** Prefer `kubectl apply --server-side --dry-run=server -f`, `kubectl diff -f`, `kubeconform`, `kubectl rollout status`, `kubectl describe`, events, and logs as applicable.
6. **Report rollback and risk.** For production changes, include rollout status checks, rollback command, and specific risks such as selector changes, PVC retention, PDB deadlocks, or policy denials.

## Hard Safety Rules

- Do not use `:latest` image tags for production manifests.
- Do not rely on the `default` ServiceAccount for application pods.
- Do not run containers as root, privileged, or with privilege escalation unless the workload requires it and the reason is documented.
- Do not store secrets in ConfigMaps, plain text examples, committed values files, annotations, logs, or generated output.
- Do not change Deployment or Service selectors casually; selector changes can orphan or replace traffic paths.
- Do not add a liveness probe that can kill slow-starting workloads before a startup probe or realistic initial delay exists.
- Do not create unrestricted ClusterRoles, wildcard verbs/resources, hostPath mounts, host networking, or broad egress without an explicit justification.
- Do not promise zero downtime; require replicas, readiness gates, PDBs, compatible rollouts, and capacity headroom.

## Final Self-Check

- Manifests are declarative, namespaced where possible, and have stable `app.kubernetes.io/*` labels.
- Workloads include requests, sensible limits, readiness probes, and liveness or startup probes when safe.
- Pods run as non-root, drop Linux capabilities, deny privilege escalation, and use a read-only root filesystem when feasible.
- Each application has a dedicated ServiceAccount with scoped Role/RoleBinding or justified ClusterRoleBinding.
- NetworkPolicies implement default-deny plus explicit ingress and required egress in namespaces that support policy enforcement.
- ConfigMaps and Secrets are separated; sensitive values are referenced, not printed.
- Stateful workloads use StatefulSets, PVCs, backup/restore notes, and ordered disruption controls.
- Production workloads have multiple replicas when supported, PDBs, topology spread, and rollout/rollback validation.
- Helm/GitOps output avoids environment-specific secrets and supports dry-run, diff, and policy validation.

## Core References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Workloads | Deployments, StatefulSets, Jobs, probes, selectors, labels, resource requests | [core-workloads](references/core-workloads.md) |
| Security and RBAC | Pod Security Standards, ServiceAccounts, RBAC, image and runtime hardening | [core-security-rbac](references/core-security-rbac.md) |
| Networking | Services, Ingress, Gateway API, DNS, NetworkPolicies, egress control | [core-networking](references/core-networking.md) |
| Configuration and Secrets | ConfigMaps, Secrets, env vars, mounted config, immutable config, external secrets | [core-configuration-secrets](references/core-configuration-secrets.md) |

## Best Practices

| Topic | Description | Reference |
|-------|-------------|-----------|
| Reliability and Scaling | Requests, limits, HPA/VPA, PDBs, topology spread, quotas, node disruption | [best-practices-reliability-scaling](references/best-practices-reliability-scaling.md) |
| Storage and Stateful Workloads | StatefulSets, PVCs, StorageClasses, data safety, backups, volume expansion | [best-practices-storage-stateful](references/best-practices-storage-stateful.md) |
| Observability and Troubleshooting | Events, logs, rollout checks, debugging, metrics, common failure diagnosis | [best-practices-observability-troubleshooting](references/best-practices-observability-troubleshooting.md) |
| Helm and GitOps | Chart structure, values contracts, dry-run, diff, Argo CD/Flux style workflows | [best-practices-helm-gitops](references/best-practices-helm-gitops.md) |

## Advanced References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Operators and Service Mesh | CRDs, controllers, reconciliation, admission, mesh rollout and mTLS guardrails | [advanced-operators-service-mesh](references/advanced-operators-service-mesh.md) |

<!--
Source references:
- Jeffallan kubernetes-specialist: https://github.com/Jeffallan/claude-skills/blob/main/skills/kubernetes-specialist/SKILL.md
- Microsoft azure-kubernetes: https://github.com/microsoft/azure-skills/blob/main/skills/azure-kubernetes/SKILL.md
- Kubernetes documentation: https://kubernetes.io/docs/
-->
