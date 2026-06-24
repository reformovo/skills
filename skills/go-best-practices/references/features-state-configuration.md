---
name: features-state-configuration
description: Configure Go programs with explicit APIs, option structs, variadic options, scoped state, and limited flags/global state.
---

# State and Configuration

Configuration should be explicit and testable. Avoid library flags and mutable package state that couple unrelated callers or tests.

## Usage

- Define flags only in `package main` or equivalent. Flag names use snake case; Go variables use mixed caps.
- Libraries are configured through Go APIs: arguments, options structs, constructors, methods, or struct fields.
- Use option structs when many callers specify several options, options are shared, or field documentation matters.
- Use variadic options only when most callers need few/no options or options are numerous, rare, composable, or heavily documented.
- Keep `context.Context` out of option structs; it remains the first parameter.
- Avoid global/package-level mutable state APIs. Prefer instance values and dependency passing.
- If providing a default instance, make it a thin proxy over instance APIs, limit use to binaries when possible, document invariants, and support reset for tests.
- For complex CLIs, prefer simple subcommand libraries when sufficient; keep reusable library logic separate from CLI wiring.

```go
// Good: binary flag, snake-case flag name, mixedCaps variable.
var pollInterval = flag.Duration("poll_interval", time.Minute, "Interval to use for polling.")
```

```go
// Good: option struct for a configurable exported API.
type ReplicationOptions struct {
    Config              *replicator.Config
    PrimaryRegions      []string
    ReadonlyRegions     []string
    ReplicationInterval time.Duration
    CopyWorkers         int
}

func EnableReplication(ctx context.Context, opts ReplicationOptions) error { /* ... */ }

err := storage.EnableReplication(ctx, storage.ReplicationOptions{
    Config:              cfg,
    PrimaryRegions:      []string{"us-east1", "us-west1"},
    ReplicationInterval: time.Hour,
})
```

```go
// Good: instance state is explicit and testable.
type Registry struct {
    plugins map[string]*Plugin
}

func NewRegistry() *Registry {
    return &Registry{plugins: make(map[string]*Plugin)}
}

func (r *Registry) Register(name string, p *Plugin) error { /* ... */ }
```

## Key Points

- Flags in libraries create surprising side effects at import time.
- Option structs are usually simpler than functional options; choose least mechanism.
- Variadic options need more code and documentation; process them in order with last value winning for conflicts.
- Global state causes order-dependent tests, parallelism problems, replacement ambiguity, and lifecycle questions.
- Safe global state is rare: logically constant, observably stateless, process-local, or explicitly unpredictable.

<!--
Source references:
- https://google.github.io/styleguide/go/decisions#flags
- https://google.github.io/styleguide/go/best-practices#funcargs
- https://google.github.io/styleguide/go/best-practices#option-structure
- https://google.github.io/styleguide/go/best-practices#variadic-options
- https://google.github.io/styleguide/go/best-practices#complex-clis
- https://google.github.io/styleguide/go/best-practices#globals
- https://google.github.io/styleguide/go/best-practices#globals-litmus-tests
- https://google.github.io/styleguide/go/best-practices#globals-default-instance
-->
