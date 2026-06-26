---
name: best-practices-doc-lints
description: Enforce Rustdoc coverage and link hygiene with doc linting and docs review gates.
---

# Rustdoc Lints and Coverage

Use doc lints when public APIs must stay documented and when rendered docs need to stay accurate over time.

## Usage

- Add `#![deny(missing_docs)]` to crates or modules that expose stable public APIs.
- Enable `broken_intra_doc_links` to catch stale links when items are renamed.
- Enable `missing_errors_doc`, `missing_panics_doc`, and `missing_safety_doc` when those contracts matter.
- Use `empty_docs` to prevent blank `///` comments from bypassing coverage.
- Run `cargo doc --open` to inspect the rendered docs and verify that the structure reads well.

```rust
#![deny(missing_docs)]
#![deny(rustdoc::broken_intra_doc_links)]
#![warn(clippy::missing_errors_doc)]
#![warn(clippy::missing_panics_doc)]
#![warn(clippy::missing_safety_doc)]

pub struct Config;
pub struct ParseError;

/// Parses a config file.
///
/// # Errors
///
/// Returns [`ParseError`] when the file is missing or invalid.
pub fn parse_config(path: &std::path::Path) -> Result<Config, ParseError> {
    let _ = path;
    Ok(Config)
}
```

## Key Points

- Use `///` for item docs and `//!` for crate or module docs.
- Document `# Errors`, `# Panics`, and `# Safety` whenever the public contract depends on them.
- Keep doc examples runnable when possible so `cargo test` can validate them.
- Pair doc linting with `cargo doc --open` before treating documentation as complete.

<!--
Source references:
- https://github.com/apollographql/rust-best-practices/blob/main/book/chapter_08.md#88-documentation-in-rust-how-when-and-why
- https://github.com/apollographql/rust-best-practices/blob/main/book/chapter_08.md#89-checklist-for-documentation-coverage
-->
