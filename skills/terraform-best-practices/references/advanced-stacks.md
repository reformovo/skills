---
name: advanced-stacks
description: Terraform Stacks file structure, components, deployments, provider configuration, workload identity, and validation guidance.
---

# Terraform Stacks

Use this reference for Terraform Stack configurations: `.tfcomponent.hcl` and `.tfdeploy.hcl`. Stack language is HCL-based but not identical to ordinary Terraform module HCL.

## File Structure

Stack files live at the stack root:

```text
my-stack/
  .terraform-version
  variables.tfcomponent.hcl
  providers.tfcomponent.hcl
  components.tfcomponent.hcl
  outputs.tfcomponent.hcl
  deployments.tfdeploy.hcl
  .terraform.lock.hcl
  modules/
```

Use Terraform 1.13+ for Stacks CLI support unless project tooling states otherwise.

## Core Concepts

- **Component:** wraps a Terraform module with inputs and provider references.
- **Deployment:** an instance of the Stack with environment/region/account-specific values.
- **Provider configuration:** uses aliased provider blocks and `config` blocks.
- **Stack outputs:** require explicit `type`.

## Variables

Stack variables require `type`; validation support differs from ordinary Terraform variables.

```hcl
variable "aws_region" {
  type        = string
  description = "AWS region for this deployment."
  default     = "us-west-2"
}

variable "identity_token" {
  type        = string
  description = "OIDC identity token for cloud authentication."
  ephemeral   = true
}
```

Use ephemeral variables for credentials and identity tokens so they do not persist.

## Providers

Provider aliases appear in the block header and configuration is nested under `config`:

```hcl
required_providers {
  aws = {
    source  = "hashicorp/aws"
    version = "~> 6.0"
  }
}

provider "aws" "this" {
  config {
    region = var.aws_region
  }
}
```

For multi-region deployments:

```hcl
provider "aws" "regional" {
  for_each = var.regions

  config {
    region = each.value
  }
}
```

Prefer workload identity/OIDC over long-lived static credentials.

## Components

```hcl
component "network" {
  source  = "./modules/network"

  inputs = {
    cidr_block = var.vpc_cidr_block
    name       = var.name
  }

  providers = {
    aws = provider.aws.this
  }
}
```

Reference outputs with `component.network.vpc_id`. For `for_each` components, reference a keyed instance such as `component.service["us-east-1"].url`.

## Deployments

Use deployments for environments, regions, or cloud accounts:

```hcl
deployment "prod" {
  inputs = {
    aws_region     = "us-east-1"
    vpc_cidr_block = "10.0.0.0/16"
    name           = "prod"
  }
}
```

Keep production deployment values explicit and reviewable.

## Outputs

Stack outputs require a `type`:

```hcl
output "vpc_id" {
  type        = string
  description = "VPC ID from the network component."
  value       = component.network.vpc_id
}
```

## Review Checklist

- All Stack files are at the repository root.
- `.terraform-version` and `.terraform.lock.hcl` are committed.
- Credentials use workload identity or ephemeral variables.
- Component sources and versions are pinned for registry modules.
- Dependencies are expressed through component inputs/outputs.
- Deployments cleanly separate environment/account/region values.

<!--
Source references:
- https://developer.hashicorp.com/terraform/language/stacks
- https://github.com/hashicorp/agent-skills/tree/main/terraform
-->
