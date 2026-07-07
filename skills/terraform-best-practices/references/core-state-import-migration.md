---
name: core-state-import-migration
description: Terraform remote state, locking, state boundaries, imports, moved and removed blocks, backend migration, drift recovery, and safe destroy protocol.
---

# State, Import, and Migration

State operations are high risk. Prefer declarative, reviewable HCL blocks and plan evidence over imperative state edits.

## Remote Backend Requirements

Use remote state for teams and production. A backend should provide:

- Locking
- Encryption at rest
- Version history or backup
- Access control
- Audit trail

AWS S3 example for Terraform 1.10+:

```hcl
terraform {
  backend "s3" {
    bucket       = "example-terraform-state"
    key          = "prod/networking/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
```

For older Terraform versions, S3 locking commonly used DynamoDB:

```hcl
terraform {
  backend "s3" {
    bucket         = "example-terraform-state"
    key            = "prod/networking/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

Azure Blob, GCS, and Terraform Cloud have their own locking models. Follow the backend's current official requirements.

## State Boundary Design

Split state when:

- Different teams own different components.
- Components have different apply cadence or blast radius.
- Environments must be isolated.
- State has grown large enough to make plan/apply slow or risky.

Combine state when resources are tightly coupled and always changed together.

Recommended key shape:

```text
prod/networking/terraform.tfstate
prod/compute/terraform.tfstate
staging/networking/terraform.tfstate
```

Avoid sharing one state file across prod and non-prod.

## Backend Migration

Before migration:

1. Confirm current backend, workspace, state serial, and Terraform version.
2. Ensure state backup/versioning exists.
3. Communicate an apply freeze for that state.
4. Run `terraform init -migrate-state` from the intended working directory.
5. Run `terraform plan -refresh-only` or a normal plan to verify no unexpected changes.

Do not hand-copy state files unless the backend migration path is blocked and a rollback plan exists.

## Import Existing Resources

Prefer declarative import blocks for reviewable imports:

```hcl
import {
  to = aws_s3_bucket.logs
  id = "example-prod-logs"
}
```

Then run:

```bash
terraform plan -generate-config-out=generated.tf
terraform plan -out=tfplan
```

Review generated configuration carefully. Remove provider-computed noise, keep only intended arguments, and ensure the final plan does not replace the imported object.

Terraform 1.14+ supports Search and bulk import for providers with list resource support. Before using it, verify provider support with `terraform providers schema -json` or the repository's helper script if one exists.

## Refactors with `moved`

Use `moved` blocks for address changes:

```hcl
moved {
  from = aws_iam_role.app
  to   = module.service.aws_iam_role.this
}
```

Good plan signal: Terraform reports the object moved with no destroy/create. Bad signal: replacement appears without an explicit reason.

## Removing Resources from State

Use `removed` blocks when the resource should no longer be managed but should remain real infrastructure:

```hcl
removed {
  from = aws_s3_bucket.legacy

  lifecycle {
    destroy = false
  }
}
```

Use actual destroy only when the infrastructure should be deleted and the deletion has been reviewed.

## Safe Destroy Protocol

Never proceed from an ambiguous destroy request. Require:

1. Exact target scope: whole workspace, module, or resource address.
2. `terraform plan -destroy` or targeted destroy plan.
3. Review of every deleted resource and likely dependents.
4. Backup/rollback notes and evidence retention.
5. Explicit user confirmation.

Never use `-auto-approve` for destroy.

## Recovery Patterns

- Stale lock: inspect who owns it before force-unlock; retain the lock ID and logs.
- Drift: prefer `terraform plan -refresh-only` to inspect, then either update HCL, import, remove, or accept drift through normal plan review.
- State surgery: prefer `moved`, `import`, and `removed` blocks. Use `terraform state mv/rm` only with backup and explicit resource addresses.
- Provider removal: remove managed resources or move them out of state before removing the provider configuration needed to read/destroy them.

<!--
Source references:
- https://developer.hashicorp.com/terraform/language/state
- https://developer.hashicorp.com/terraform/language/import
- https://github.com/hashicorp/agent-skills/tree/main/terraform
- https://github.com/Jeffallan/claude-skills/tree/main/skills/terraform-engineer
- https://github.com/antonbabenko/terraform-skill/blob/master/skills/terraform-skill/SKILL.md
-->
