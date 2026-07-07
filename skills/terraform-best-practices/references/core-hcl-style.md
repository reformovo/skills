---
name: core-hcl-style
description: Terraform HCL style, file organization, naming, version constraints, variables, outputs, dynamic resources, and identity-preserving refactors.
---

# HCL Style and Resource Identity

Apply this reference for Terraform/OpenTofu HCL generation, review, and refactoring.

## File Layout

Use conventional files unless the existing module has a stronger local pattern:

```text
terraform.tf   # required_version and required_providers
providers.tf   # provider configuration
main.tf        # primary resources and data sources
variables.tf   # input variables, alphabetized when practical
locals.tf      # shared derived values
outputs.tf     # output values, alphabetized when practical
```

For reusable modules, many projects use `versions.tf` instead of `terraform.tf`; follow local convention.

## Block Shape

Keep block ordering predictable:

```hcl
resource "aws_instance" "web" {
  for_each = var.instances

  ami           = each.value.ami_id
  instance_type = each.value.instance_type
  subnet_id     = each.value.subnet_id

  tags = merge(var.tags, {
    Name = each.key
  })

  lifecycle {
    create_before_destroy = true
  }
}
```

Rules:

- Use two-space indentation and `terraform fmt`; do not hand-align beyond what fmt produces.
- Put meta-arguments (`count`, `for_each`, `provider`, `depends_on`) where they are easy to see.
- Put arguments before nested blocks; put `lifecycle` near the end.
- Avoid comments that restate the argument name; comment only non-obvious tradeoffs.

## Naming

- Use lowercase with underscores for resource names, variables, locals, and outputs.
- Use descriptive nouns without repeating the provider type: `aws_instance.web_api`, not `aws_instance.web_api_instance`.
- Use `this` only for a true singleton inside a reusable module.
- Prefer contextual variable names: `vpc_cidr_block`, `bucket_name`, `environment`.
- Avoid generic inputs such as `name`, `config`, or `settings` when the module exposes multiple concepts.

## Version Constraints

```hcl
terraform {
  required_version = "~> 1.9"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
```

Guidelines:

- Pin the runtime minor version for applications and CI reproducibility.
- Pin provider major versions; use separate PRs for provider upgrades.
- Pin production registry modules exactly where reproducibility matters.
- Commit `.terraform.lock.hcl` intentionally.
- Check the runtime floor before using modern features: native tests require Terraform 1.6+, mock providers 1.7+, `removed` blocks 1.7+, cross-variable validation 1.9+, S3 `use_lockfile` 1.10+, write-only arguments 1.11+, Terraform Search bulk import 1.14+ with provider support.

## Variables and Outputs

Every input needs a description and explicit type:

```hcl
variable "environment" {
  description = "Deployment environment name."
  type        = string
  nullable    = false

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "environment must be one of dev, staging, or prod."
  }
}

variable "database_password" {
  description = "Database administrator password."
  type        = string
  sensitive   = true
}
```

Prefer typed objects with optional attributes over `map(any)`:

```hcl
variable "instances" {
  description = "EC2 instances keyed by stable logical name."
  type = map(object({
    ami_id        = string
    instance_type = optional(string, "t3.micro")
    subnet_id     = string
  }))
  default = {}
}
```

Outputs should expose minimal stable values, not entire provider objects:

```hcl
output "instance_ids" {
  description = "EC2 instance IDs keyed by logical name."
  value       = { for name, instance in aws_instance.web : name => instance.id }
}
```

## `for_each` vs `count`

Use `count` only for optional singleton resources:

```hcl
resource "aws_cloudwatch_metric_alarm" "cpu" {
  count = var.enable_alarm ? 1 : 0

  alarm_name = "${var.name}-cpu"
}
```

Use `for_each` for collections whose members may be added, removed, or reordered:

```hcl
resource "aws_security_group_rule" "ingress" {
  for_each = var.ingress_rules

  security_group_id = aws_security_group.this.id
  type              = "ingress"
  from_port         = each.value.from_port
  to_port           = each.value.to_port
  protocol          = each.value.protocol
  cidr_blocks       = each.value.cidr_blocks
}
```

Avoid list index identity for long-lived infrastructure. Removing the middle of a list with `count` can shift every later address.

## Identity-Preserving Refactors

When renaming resources, modules, or changing from `count` to `for_each`, add `moved` blocks:

```hcl
moved {
  from = aws_instance.web[0]
  to   = aws_instance.web["blue"]
}
```

Then run:

```bash
terraform plan -out=tfplan
terraform show tfplan
```

The plan should show address moves, not destroy/create, unless replacement is intentional and approved.

## Version Control Rules

Commit:

- `*.tf`, `*.tftest.hcl`, examples, module docs
- `.terraform.lock.hcl`

Do not commit:

- `.terraform/`
- `terraform.tfstate` or backups
- `*.tfplan`
- `.tfvars` containing sensitive or environment-private values

<!--
Source references:
- https://developer.hashicorp.com/terraform/language/style
- https://github.com/hashicorp/agent-skills/tree/main/terraform
- https://github.com/antonbabenko/terraform-skill/blob/master/skills/terraform-skill/SKILL.md
-->
