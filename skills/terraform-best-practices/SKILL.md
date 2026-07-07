---
name: terraform-best-practices
description: MUST be used for Terraform and OpenTofu tasks. Covers HCL style, module design, provider and runtime versioning, variables and outputs, count vs for_each identity stability, moved/import/removed blocks, state backends and migrations, secrets, blast-radius control, CI plan/apply workflows, native terraform test, policy/security checks, Terraform Stacks, and Terraform provider development with the Plugin Framework. Load for any Terraform code writing, reviewing, testing, refactoring, importing, state operation, CI/CD, module, Stack, or provider implementation work.
metadata:
  author: reformovo
  version: "2026.07.07"
  source: Synthesized from HashiCorp agent-skills Terraform, Anton Babenko terraform-skill, and Jeffallan terraform-engineer references
---

> This skill synthesizes Terraform best-practice guidance from HashiCorp agent skills, Anton Babenko's Terraform skill, and Jeffallan's Terraform engineer skill, rewritten for concise agent use.

Use this skill to produce Terraform/OpenTofu changes that are stable in state, reviewable in CI, explicit about risk, and validated before apply.

## Core Principles

- **Diagnose before generating:** classify the risk first: identity churn, secret exposure, blast radius, CI drift, state corruption, provider upgrade risk, testing blind spots, or compliance gap.
- **Preserve resource identity:** prefer stable keys, `for_each`, and `moved` blocks over address churn; never refactor addresses without a migration path.
- **Keep state boring:** use remote state with locking, encryption, versioning, and clear component/environment boundaries.
- **Plan before mutating:** never recommend direct production apply, state edits, import, removal, or destroy without a reviewed plan and rollback notes.
- **Pin deliberately:** constrain Terraform/OpenTofu, providers, and modules; commit `.terraform.lock.hcl`; isolate upgrade PRs from functional changes.
- **Test the right layer:** use `fmt`, `validate`, lint/security scans, native `terraform test`, policy checks, and integration tests based on risk and runtime support.

## Required Usage Workflow

1. **Capture context.** Determine runtime (`terraform` or `tofu`), version, providers, backend, execution path (local, CI, Terraform Cloud, Atlantis), workspace/environment, and production criticality. If unknown, state the assumption.
2. **Select references by task.** Start with [core-hcl-style](references/core-hcl-style.md) for HCL. Load module, state, testing, Stacks, or provider references only when relevant.
3. **Choose a risk-controlled implementation.** Explain any tradeoff that affects resource identity, secrets, state, blast radius, provider upgrades, or cost.
4. **Generate reviewable artifacts.** Prefer normal HCL, declarative `moved`/`import`/`removed` blocks, explicit variables/outputs, and small module boundaries.
5. **Validate before finalizing.** Run or recommend exact commands: `terraform fmt -check -recursive`, `terraform init`, `terraform validate`, `terraform test`, `tflint`, `trivy config .`, `checkov -d .`, and `terraform plan -out=tfplan` as applicable.
6. **Report rollback notes for mutation.** For imports, state moves, removals, applies, provider upgrades, and destroys, say how to undo and what evidence to retain.

## Hard Safety Rules

- Do not run or recommend `terraform destroy` without first running `terraform plan -destroy`, listing the resources to be deleted, and getting explicit confirmation. Never use `-auto-approve` for destroy.
- Do not use local state for team or production workflows.
- Do not place secrets in variable defaults, committed `.tfvars`, CI logs, outputs, or Terraform state when avoidable. `sensitive = true` masks UI output only; it does not remove values from state.
- Do not replace stable resource addresses through blind text edits. Use `moved` blocks for refactors and import blocks for reviewable adoption.
- Do not apply a plan in CI by re-running `plan` in the apply job; apply the reviewed plan artifact.

## Final Self-Check

- Files are organized conventionally and formatted with `terraform fmt`.
- Variables have descriptions, explicit types, validation where useful, and `sensitive = true` for sensitive display values.
- Outputs have descriptions, expose stable minimal values, and mark sensitive values.
- Runtime, providers, and modules are constrained; `.terraform.lock.hcl` is committed.
- Resource collections use stable `for_each` keys unless `count` is only a boolean singleton toggle.
- State backend provides locking, encryption, versioning, and separation by environment/component where needed.
- Refactors include `moved` blocks; imports use declarative `import` blocks or Terraform Search where supported.
- Plan/apply workflows retain reviewed plan artifacts and include policy/security gates for material infrastructure.
- Tests match risk: static checks for all changes, native tests for module behavior, real integration only where provider-computed behavior matters.

## Core References

| Topic | Description | Reference |
|-------|-------------|-----------|
| HCL Style and Resource Identity | File layout, block ordering, naming, variables, outputs, versions, `for_each`, `moved` | [core-hcl-style](references/core-hcl-style.md) |
| Modules and Composition | Module boundaries, interface contracts, examples, versioning, refactoring monoliths | [core-modules-composition](references/core-modules-composition.md) |
| State, Import, and Migration | Remote backends, locking, workspaces, state moves, imports, removals, safe destroy | [core-state-import-migration](references/core-state-import-migration.md) |

## Best Practices

| Topic | Description | Reference |
|-------|-------------|-----------|
| Testing, CI, and Security | Validation pipeline, native tests, mocks, plan artifacts, policy/security scans | [best-practices-testing-ci-security](references/best-practices-testing-ci-security.md) |

## Advanced References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Terraform Stacks | `.tfcomponent.hcl`, `.tfdeploy.hcl`, components, deployments, providers, workload identity | [advanced-stacks](references/advanced-stacks.md) |
| Provider Development | Plugin Framework provider/resource/action patterns and acceptance-test workflow | [advanced-provider-development](references/advanced-provider-development.md) |

<!--
Source references:
- HashiCorp Terraform agent skills: https://github.com/hashicorp/agent-skills/tree/main/terraform
- Anton Babenko terraform-skill: https://github.com/antonbabenko/terraform-skill/blob/master/skills/terraform-skill/SKILL.md
- Jeffallan terraform-engineer: https://github.com/Jeffallan/claude-skills/tree/main/skills/terraform-engineer
- HashiCorp Terraform style guide: https://developer.hashicorp.com/terraform/language/style
-->
