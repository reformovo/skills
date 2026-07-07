---
name: core-modules-composition
description: Terraform module boundaries, interface contracts, composition structure, examples, versioning, and refactoring monolithic configurations into reusable modules.
---

# Modules and Composition

Use modules to encapsulate tightly related resources with one lifecycle and a clear interface. Avoid creating modules only to hide a single argument or to mirror every provider resource one-for-one.

## Module Layers

| Layer | Purpose | Example |
|-------|---------|---------|
| Resource module | One logical infrastructure unit | VPC with subnets and route tables |
| Infrastructure module | A service or platform slice | API service with compute, IAM, and alarms |
| Composition | Environment/account/region assembly | `prod/us-east-1` stack using several modules |

Keep environment configuration outside reusable modules:

```text
environments/
  prod/
  staging/
modules/
  networking/
  compute/
examples/
  minimal/
  complete/
```

## Module Layout

```text
modules/vpc/
  main.tf
  variables.tf
  outputs.tf
  versions.tf
  README.md
  examples/
    complete/
  tests/
    vpc.tftest.hcl
```

## Interface Contract

Inputs should be typed, validated, and stable:

```hcl
variable "private_subnets" {
  description = "Private subnet definitions keyed by logical subnet name."
  type = map(object({
    cidr_block        = string
    availability_zone = string
  }))
  default = {}
}
```

Outputs should return stable identifiers that consumers actually need:

```hcl
output "private_subnet_ids" {
  description = "Private subnet IDs keyed by logical subnet name."
  value       = { for name, subnet in aws_subnet.private : name => subnet.id }
}
```

Do not output whole resource objects; it couples consumers to provider implementation details and increases downstream churn.

## Encapsulation Rules

Put resources in the same module when they:

- Share a lifecycle and ownership boundary.
- Are always created and destroyed together.
- Have tight dependency and naming relationships.

Keep resources separate when they:

- Are managed by different teams.
- Need independent releases or applies.
- Cross account, region, or environment boundaries.
- Represent cross-cutting concerns such as monitoring, policy, or shared IAM.

## Composition Pattern

```hcl
module "network" {
  source  = "../../modules/vpc"
  version = "1.4.2"

  name               = local.name
  cidr_block         = var.vpc_cidr_block
  private_subnets    = var.private_subnets
  tags               = local.tags
}

module "service" {
  source = "../../modules/service"

  name               = local.name
  vpc_id             = module.network.vpc_id
  private_subnet_ids = module.network.private_subnet_ids
  tags               = local.tags
}
```

Dependencies should usually flow through inputs and outputs. Add `depends_on` only for dependencies Terraform cannot infer.

## Dynamic Blocks

Use dynamic blocks when provider schema requires nested blocks and the collection is naturally configurable:

```hcl
resource "aws_security_group" "this" {
  name   = var.name
  vpc_id = var.vpc_id

  dynamic "ingress" {
    for_each = var.ingress_rules
    content {
      description = ingress.value.description
      from_port   = ingress.value.from_port
      to_port     = ingress.value.to_port
      protocol    = ingress.value.protocol
      cidr_blocks = ingress.value.cidr_blocks
    }
  }
}
```

If a dynamic block becomes hard to read, prefer separate resources keyed with `for_each`.

## Refactoring a Monolith

1. Group resources by lifecycle and ownership.
2. Design module inputs from values that should vary; keep derived values in `locals`.
3. Design outputs from real consumer needs.
4. Move resources into the module without changing logical names where practical.
5. Add `moved` blocks from old addresses to new module addresses.
6. Run a plan and require zero unapproved destroys.

Example:

```hcl
moved {
  from = aws_vpc.main
  to   = module.network.aws_vpc.this
}
```

## Release and Upgrade Discipline

- Use semantic versioning for published modules.
- Include a minimal example and a complete example.
- Keep breaking changes in a major release and document required `moved` blocks or state operations.
- Pin module versions in production compositions.
- Test examples; examples are both documentation and fixtures.

<!--
Source references:
- https://developer.hashicorp.com/terraform/language/modules/develop
- https://github.com/hashicorp/agent-skills/tree/main/terraform
- https://github.com/Jeffallan/claude-skills/tree/main/skills/terraform-engineer
- https://github.com/antonbabenko/terraform-skill/blob/master/skills/terraform-skill/SKILL.md
-->
