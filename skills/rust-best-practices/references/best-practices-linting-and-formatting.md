---
name: best-practices-linting-and-formatting
description: Run and configure Rust formatting and Clippy checks while fixing warnings locally instead of suppressing them.
---

# Linting and Formatting

Use rustfmt and Clippy as correctness and maintainability gates, not cosmetic afterthoughts. Prefer changing the code over suppressing lints.

## Usage

Run the strongest gate that fits the repository:

```sh
cargo fmt --all --check
cargo clippy --workspace --all-targets --all-features -- -D warnings
cargo test --workspace --all-features
```

When the repository uses `--locked` or an xtask/justfile wrapper, follow the local command:

```sh
cargo clippy --all-targets --all-features --locked -- -D warnings
```

Respect high-signal Clippy feedback:

- `redundant_clone`, `clone_on_copy`: remove unnecessary ownership work.
- `needless_borrow`: simplify references.
- `manual_ok_or`, `map_unwrap_or`, `unnecessary_map_or`: clarify `Option`/`Result` transforms.
- `needless_collect`: avoid temporary allocation.
- `large_enum_variant`: consider boxing unusually large enum variants.
- `unnecessary_wraps`: remove `Option`/`Result` from APIs that cannot fail or be absent.

Configure lints at the workspace/package level when policy should be shared:

```toml
[workspace.lints.rust]
future-incompatible = "warn"
nonstandard_style = "deny"

[workspace.lints.clippy]
all = { level = "deny", priority = 10 }
redundant_clone = { level = "deny", priority = 9 }
pedantic = { level = "warn", priority = 3 }
```

Use local `#[expect]` only when the code is intentionally better than Clippy's suggestion:

```rust
// PERF: Keeping the large inline variant avoids an allocation in the hot parser path.
#[expect(clippy::large_enum_variant)]
enum Token {
    Small(u8),
    InlineBuffer([u8; 1024]),
}
```

## Key Points

- Use `#[expect(...)]` rather than `#[allow(...)]`; it warns when the suppression is no longer needed.
- Keep lint exceptions local and explain the invariant, performance reason, or design tradeoff.
- Avoid global lint overrides unless the repository has a documented crate-wide reason.
- Sort imports as `std`/`core`/`alloc`, external crates, workspace crates, `super::`, then `crate::`; let rustfmt handle this where configured.
- Add lint commands to CI, Makefile, Justfile, or xtask when the repository lacks an obvious quality gate.

<!--
Source references:
- https://github.com/apollographql/rust-best-practices/blob/main/book/chapter_01.md#17-use-declarations---imports
- https://github.com/apollographql/rust-best-practices/blob/main/book/chapter_02.md
-->
