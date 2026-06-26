---
name: rust-best-practices
description: MUST be used for Rust tasks. Based on Apollo GraphQL Rust Best Practices. Covers ownership and borrowing, maybe-owned Cow APIs, avoiding redundant clones, Copy/value passing, Option and Result control flow, lazy allocation, iterators vs for loops, import organization, Clippy lint discipline, error modeling with thiserror/anyhow, panic and unwrap policy, tests, doc tests, snapshots, documentation comments, rustdoc lint coverage, performance measurement, dispatch choices, type-state APIs, pointers, Send/Sync, and interior mutability. Load for any Rust code writing, reviewing, testing, or refactoring work.
license: Apache-2.0
metadata:
  author: reformovo
  version: "2026-06-26"
  source: Generated from https://github.com/apollographql/rust-best-practices, scripts located at https://github.com/reformovo/skills
---

> The skill is based on Apollo GraphQL Rust Best Practices at commit `8425b336d368edaddbab8a5339030c677d63dc5d`, generated at 2026-06-26.

Apollo's Rust best practices emphasize correctness, intent clarity, maintainability, and evidence-based performance work. Apply this skill to produce Rust that uses ownership deliberately, keeps errors visible, avoids unnecessary allocation, and validates behavior with focused tests.

## Core Principles

- **Prefer borrowing first:** accept `&str`, `&[T]`, `&T`, or `&mut T` unless ownership is part of the API contract.
- **Make fallibility explicit:** return `Result` for runtime failure; use `?`, `map_err`, and typed errors instead of panics or `unwrap`.
- **Delay allocation and boxing:** use `_or_else` variants, iterator pipelines, slices, and references before cloning, collecting, or heap allocation.
- **Measure performance claims:** use release builds, Clippy perf lints, benchmarks, and profiling before changing code for speed.
- **Choose simple APIs:** use static dispatch and ordinary runtime checks by default; reach for dynamic dispatch or type-state only when the design need is real.
- **Document public contracts:** use `///` and `//!` for public behavior, errors, panics, safety, and examples; keep `//` comments for non-obvious rationale; enforce docs with rustdoc lints when the crate exposes a stable API.

## Required Usage Workflow

1. **Confirm the Rust baseline.** Use this skill for Rust work unless the repository has a stronger local Rust standard.
2. **Start with ownership and control flow.** Apply [core-ownership-and-idioms](references/core-ownership-and-idioms.md) before changing signatures, clones, iterators, `Cow`, or `Option`/`Result` handling.
3. **Model errors intentionally.** Apply [core-errors-and-results](references/core-errors-and-results.md) for any fallible function, public API, binary entrypoint, or error test.
4. **Run lint and formatting gates when feasible.** Apply [best-practices-linting-and-formatting](references/best-practices-linting-and-formatting.md) and prefer local fixes over lint suppression.
5. **Add tests and docs proportional to the change.** Apply [best-practices-testing-and-docs](references/best-practices-testing-and-docs.md) for behavioral paths, public APIs, doc examples, snapshots, and doc-comment shape.
6. **Use advanced patterns only when justified.** Apply dispatch, type-state, pointer, and performance references when the task touches polymorphism, state machines, shared ownership, interior mutability, unsafe, or hot paths.

## Final Self-Check

- Public APIs accept borrowed data unless they need ownership; clones are delayed and justified.
- `Copy` is used only for small plain-data types whose fields are all `Copy`; iterator types are not `Copy`.
- `Option`/`Result` flow uses `?`, `let PATTERN = expr else`, `ok_or_else`, `map_err`, and `inspect_err` where they clarify intent.
- Production paths avoid new `panic!`, `unwrap`, and `expect` unless the invariant is impossible by design and documented.
- Libraries expose typed errors, commonly with `thiserror`; binaries may use `anyhow` with clear context.
- Iterator chains are readable and avoid needless intermediate collections; `for` loops are used for early exit or complex side effects.
- Public items have useful Rustdoc with `# Errors`, `# Panics`, `# Safety`, and examples where relevant.
- Tests cover success and error behavior with descriptive names and actionable assertion messages.
- Dynamic dispatch, `Arc`/`Rc`, `Cell`/`RefCell`, `Mutex`/`RwLock`, raw pointers, and type-state are used only for matching design constraints.
- Quality gates have been run or explicitly reported: `cargo fmt --all --check`, `cargo clippy --workspace --all-targets --all-features -- -D warnings`, and `cargo test --workspace --all-features`.

## Core References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Ownership and Idioms | Borrowing, cloning, `Copy`, `Option`/`Result`, lazy defaults, iterators, imports | [core-ownership-and-idioms](references/core-ownership-and-idioms.md) |
| Maybe-Owned Data | `Cow` for APIs that may borrow or own without forcing allocation | [core-maybe-owned-data](references/core-maybe-owned-data.md) |
| Errors and Results | `Result`, panic policy, `unwrap`/`expect`, `thiserror`, `anyhow`, error tests | [core-errors-and-results](references/core-errors-and-results.md) |

## Best Practices

| Topic | Description | Reference |
|-------|-------------|-----------|
| Linting and Formatting | Clippy gates, lint configuration, local `#[expect]`, import grouping | [best-practices-linting-and-formatting](references/best-practices-linting-and-formatting.md) |
| Testing and Documentation | Unit/integration/doc tests, assertions, snapshots, comments, Rustdoc coverage | [best-practices-testing-and-docs](references/best-practices-testing-and-docs.md) |
| Rustdoc Lints and Coverage | `missing_docs`, `broken_intra_doc_links`, `missing_errors_doc`, `missing_panics_doc`, `missing_safety_doc`, and `cargo doc --open` | [best-practices-doc-lints](references/best-practices-doc-lints.md) |

## Advanced References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Dispatch and Type-State | Generics, `impl Trait`, `dyn Trait`, object safety, type-state builders and state machines | [advanced-dispatch-and-type-state](references/advanced-dispatch-and-type-state.md) |
| Pointers and Performance | `Send`/`Sync`, pointer selection, interior mutability, lazy globals, profiling, stack vs heap | [advanced-pointers-and-performance](references/advanced-pointers-and-performance.md) |
