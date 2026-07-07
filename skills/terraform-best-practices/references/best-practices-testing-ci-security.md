---
name: best-practices-testing-ci-security
description: Terraform validation, native tests, CI plan/apply pipelines, policy and security scanning, secret handling, and acceptance-test cost control.
---

# Testing, CI, and Security

Apply this reference when adding tests, setting up CI, reviewing plans, or hardening Terraform/OpenTofu workflows.

## Validation Ladder

Run the cheapest checks first:

```bash
terraform fmt -check -recursive
terraform init -backend=false
terraform validate
tflint --recursive
trivy config .
checkov -d .
```

For real workspaces:

```bash
terraform init
terraform plan -out=tfplan
terraform show -no-color tfplan
```

Use `tofu` equivalents for OpenTofu.

## Native `terraform test`

Terraform 1.6+ includes native tests in `*.tftest.hcl` files:

```text
tests/
  defaults_unit.tftest.hcl
  full_integration.tftest.hcl
```

Plan-mode tests are fast and useful for input-derived behavior:

```hcl
run "default_tags" {
  command = plan

  assert {
    condition     = aws_s3_bucket.this.tags["ManagedBy"] == "Terraform"
    error_message = "Bucket must include the ManagedBy tag."
  }
}
```

Apply-mode tests are required when assertions depend on provider-computed values:

```hcl
run "bucket_created" {
  command = apply

  assert {
    condition     = output.bucket_id != ""
    error_message = "bucket_id output must be populated after apply."
  }
}
```

Use mock providers on Terraform 1.7+ for cost-free unit tests when the behavior does not require real cloud APIs.

## Test Selection

| Need | Preferred check |
|------|-----------------|
| Formatting and syntax | `fmt`, `validate` |
| Provider-specific lint | `tflint` |
| Security posture | `trivy config`, `checkov` |
| Module logic | `terraform test` plan mode |
| Provider-computed values | `terraform test` apply mode or Terratest |
| Complex lifecycle integration | Terratest or real integration environment |
| Compliance gate | Sentinel, OPA/Conftest, or platform policy |

## CI Pipeline Shape

Use separate plan and apply stages:

```text
validate -> test -> security/policy -> plan -> approval -> apply reviewed plan
```

Rules:

- CI and local development must use the same pinned runtime and provider lock file.
- Store the binary plan artifact securely between plan and apply.
- Apply the reviewed `tfplan`; do not re-run plan in the apply job.
- Protect production applies with environment approvals.
- Do not print sensitive variables, plan JSON, or state in logs.
- Tag test resources and clean them up automatically.

## Secrets

Bad:

```hcl
variable "password" {
  type    = string
  default = "change-me"
}
```

Better display handling:

```hcl
variable "password" {
  description = "Database password supplied by the deployment environment."
  type        = string
  sensitive   = true
}
```

Best when available:

- Keep secrets out of Terraform and resolve them at runtime from a secret manager.
- Use provider write-only arguments on Terraform versions that support them.
- Use ephemeral/OIDC credentials in CI and Terraform Cloud/Enterprise.

Remember: `sensitive = true` masks CLI/UI output; it does not prevent state storage.

## Security Defaults

Check for:

- Encryption at rest and TLS in transit.
- Dedicated VPC/networking rather than default networks for production.
- Least-privilege IAM and security group rules.
- No `0.0.0.0/0` ingress unless explicitly justified.
- Provider-specific safer resources, such as standalone security group rule resources where the provider recommends them.
- No committed `.tfvars` with secrets.

## Provider Acceptance Tests

Terraform provider acceptance tests are Go tests named `TestAcc...`. Run focused tests with:

```bash
TF_ACC=1 go test ./internal/service/example -run TestAccExample_basic -count=1
```

Escalate diagnostics incrementally:

```bash
TF_ACC=1 go test ./internal/service/example -run TestAccExample_basic -count=1 -v
TF_LOG=debug TF_ACC=1 go test ./internal/service/example -run TestAccExample_basic -count=1 -v
```

Persist temporary workspaces only when needed for diagnosis and clean them up afterward.

<!--
Source references:
- https://developer.hashicorp.com/terraform/cli/test
- https://github.com/hashicorp/agent-skills/tree/main/terraform
- https://github.com/Jeffallan/claude-skills/tree/main/skills/terraform-engineer
- https://github.com/antonbabenko/terraform-skill/blob/master/skills/terraform-skill/SKILL.md
-->
