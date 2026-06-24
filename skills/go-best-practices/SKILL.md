---
name: go-best-practices
description: MUST be used for Go tasks. Based on the Google Go Style Guide. Covers clarity, simplicity, concision, maintainability, consistency, gofmt, MixedCaps, naming, comments, Godoc, packages, imports, errors, panics, composite literals, zero values, nil slices, copying, receiver types, interfaces, generics, contexts, concurrency, flags, configuration, global state, string building, and testing practices. Load for any Go code writing, reviewing, testing, or refactoring work.
license: Apache-2.0
metadata:
  author: reformovo
  version: "2026-06-25"
  source: Generated from https://github.com/google/styleguide, scripts located at https://github.com/reformovo/skills
---

> The skill is based on the Google Go Style Guide (`go/guide`, `go/decisions`, and `go/best-practices`) at commit `1809c769de31ba388c755ad15dd057a9ba8531fd`, generated at 2026-06-25.

The Google Go Style documents define readable, idiomatic Go with a priority order: clarity, simplicity, concision, maintainability, and consistency. Apply this skill to produce code that is obvious to future maintainers and consistent with large Go codebases.

## Core Principles

- **Clarity first:** names, structure, comments, and errors should make both purpose and rationale obvious to the reader.
- **Prefer simplicity:** use core language constructs and standard libraries before custom frameworks or abstractions.
- **Be concise, not cryptic:** remove noise and repetition, but do not hide important behavior.
- **Optimize for maintenance:** APIs should evolve safely, avoid unnecessary coupling, and have useful tests.
- **Use consistency as a tie-breaker:** follow the guide first, then nearby package/file conventions where the guide is silent.

## Required Usage Workflow

1. **Confirm the style baseline.** Use this skill for Go code unless the repository explicitly adopts a conflicting Go style guide.
2. **Start with foundations.** Apply [core-principles-formatting](references/core-principles-formatting.md), [core-naming](references/core-naming.md), [core-comments-documentation](references/core-comments-documentation.md), and [core-imports-packages](references/core-imports-packages.md).
3. **Design APIs deliberately.** Choose error returns, context placement, interfaces, configuration patterns, and package state from the feature references.
4. **Keep concurrency and lifecycle explicit.** Document cancellation, goroutine lifetimes, cleanup requirements, and channel ownership.
5. **Write idiomatic tests.** Use Go `testing`, table-driven tests, clear failure messages, `cmp.Diff`, helpers, and real transports where appropriate.

## Final Self-Check

- Source is `gofmt`/`goimports` formatted; names use Go MixedCaps and avoid unnecessary repetition.
- Package boundaries, package names, and imports are concise, lowercase, and locally consistent.
- Exported APIs have useful doc comments; non-obvious behavior, errors, cleanup, concurrency, and context semantics are documented.
- Errors are returned and handled deliberately; `%w` is used only when exposing wrapped errors is part of the API contract.
- No normal control flow uses `panic`; `Must` helpers are limited to startup/package init or test setup value contexts.
- Contexts are first parameters, not stored in structs, and custom context types are not introduced.
- Goroutines have clear termination; synchronous functions are preferred; channel direction is specified where possible.
- Interfaces are small, owned by consumers when practical, and not created solely for tests or abstraction.
- Configuration avoids library flags and global mutable state; defaults and options are explicit.
- Tests identify function, input, got, and want; failures are actionable and avoid brittle string matching for errors.

## Core References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Principles and Formatting | Clarity, simplicity, concision, gofmt, MixedCaps, line length, consistency | [core-principles-formatting](references/core-principles-formatting.md) |
| Naming | Packages, functions, methods, receivers, variables, constants, initialisms, repetition | [core-naming](references/core-naming.md) |
| Comments and Documentation | Doc comments, package comments, runnable examples, Godoc, non-obvious contracts | [core-comments-documentation](references/core-comments-documentation.md) |
| Imports and Packages | Package size, package names, import grouping/renaming, blank/dot imports, protos | [core-imports-packages](references/core-imports-packages.md) |

## Features

### API and Language Design

| Topic | Description | Reference |
|-------|-------------|-----------|
| Errors and Panics | Error returns, strings, structured errors, `%v`/`%w`, logging, panics, Must functions | [features-errors-panics](references/features-errors-panics.md) |
| Functions and Values | Composite literals, zero values, nil slices, copying, receivers, aliases, `any`, strings | [features-functions-values](references/features-functions-values.md) |
| Interfaces and Generics | Interface necessity, ownership, visibility, small contracts, accepting interfaces, generics | [features-interfaces-generics](references/features-interfaces-generics.md) |

### Runtime and Configuration

| Topic | Description | Reference |
|-------|-------------|-----------|
| Contexts and Concurrency | Context parameters, no stored/custom contexts, goroutine lifetimes, channels, sync APIs | [features-contexts-concurrency](references/features-contexts-concurrency.md) |
| State and Configuration | Flags, option structs, variadic options, package/global state, default instances, CLIs | [features-state-configuration](references/features-state-configuration.md) |

## Testing

| Topic | Description | Reference |
|-------|-------------|-----------|
| Testing Practices | Failure messages, got/want, diffs, subtests, table tests, helpers, TestMain, real transports | [testing-practices](references/testing-practices.md) |
