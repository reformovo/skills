---
name: advanced-provider-development
description: Terraform Plugin Framework provider development patterns for scaffolding providers, resources, data sources, actions, schemas, diagnostics, state handling, and acceptance tests.
---

# Provider Development

Use this reference for Terraform provider implementation with the Terraform Plugin Framework.

## Scaffolding

For a new provider:

1. Create a root directory named `terraform-provider-<name>`.
2. Initialize a Go module.
3. Add the Plugin Framework dependency.
4. Implement provider metadata, schema, configuration, resources, and data sources.
5. Run `go mod tidy`, `go build ./...`, and `go test ./...`.

```bash
go mod init github.com/example/terraform-provider-example
go get github.com/hashicorp/terraform-plugin-framework@latest
go mod tidy
go build ./...
go test ./...
```

## Resource Shape

Resource packages usually keep implementation, tests, finder helpers, and docs together:

```text
internal/service/example/
  example_resource.go
  example_resource_test.go
  example_data_source.go
  find.go
website/docs/r/example_thing.html.markdown
website/docs/d/example_thing.html.markdown
```

## Schema Rules

- Every user-facing attribute needs a description.
- Use framework attribute types consistently; do not mix model types from incompatible packages.
- List/map/set attributes need element types.
- Attributes with defaults are usually both optional and computed.
- Sensitive values must be marked `Sensitive: true`.
- Add validators for provider constraints.
- Use plan modifiers when replacement or unknown-value behavior matters.

Example:

```go
func (r *thingResource) Schema(ctx context.Context, req resource.SchemaRequest, resp *resource.SchemaResponse) {
    resp.Schema = schema.Schema{
        Attributes: map[string]schema.Attribute{
            "id": schema.StringAttribute{
                Computed: true,
                PlanModifiers: []planmodifier.String{
                    stringplanmodifier.UseStateForUnknown(),
                },
            },
            "name": schema.StringAttribute{
                Required: true,
                Validators: []validator.String{
                    stringvalidator.LengthBetween(1, 64),
                },
                PlanModifiers: []planmodifier.String{
                    stringplanmodifier.RequiresReplace(),
                },
            },
        },
    }
}
```

## CRUD and State Handling

Pattern:

1. Decode plan/state/config into a model.
2. Stop early on diagnostics.
3. Call provider SDK with context.
4. Map SDK errors into useful diagnostics.
5. On read not-found, remove state.
6. Set state from API result.

Read not-found behavior:

```go
if isNotFound(err) {
    resp.State.RemoveResource(ctx)
    return
}
```

Use waiters for asynchronous APIs and make timeouts configurable where operations can take minutes.

## Diagnostics

Diagnostics should tell the practitioner what failed and which object was involved:

```go
resp.Diagnostics.AddError(
    "Error creating example thing",
    fmt.Sprintf("Could not create example thing %q: %s", data.Name.ValueString(), err),
)
```

Avoid returning raw opaque SDK errors without context.

## Actions

Actions are for imperative operations tied to lifecycle events. Keep them explicit:

- Validate all parameters.
- Add meaningful progress updates for long operations.
- Use `context.WithTimeout` or framework timeout support.
- Poll async operations with clear success and failure states.
- Document side effects and failure modes.

## Acceptance Tests

Acceptance tests should cover create/read/update/delete, import, and disappearance where relevant:

```go
func TestAccThing_basic(t *testing.T) {
    resource.ParallelTest(t, resource.TestCase{
        PreCheck:                 func() { testAccPreCheck(t) },
        ProtoV5ProviderFactories: testAccProtoV5ProviderFactories,
        Steps: []resource.TestStep{
            {
                Config: testAccThingConfig("example"),
                Check: resource.ComposeTestCheckFunc(
                    resource.TestCheckResourceAttr("example_thing.test", "name", "example"),
                    resource.TestCheckResourceAttrSet("example_thing.test", "id"),
                ),
            },
            {
                ResourceName:      "example_thing.test",
                ImportState:       true,
                ImportStateVerify: true,
            },
        },
    })
}
```

Run focused tests:

```bash
TF_ACC=1 go test ./internal/service/example -run TestAccThing_basic -count=1
```

If a passing test may be weak, temporarily flip a check to prove it fails, then undo the change.

<!--
Source references:
- https://developer.hashicorp.com/terraform/plugin/framework
- https://github.com/hashicorp/agent-skills/tree/main/terraform
-->
