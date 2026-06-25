---
name: best-practices-testing-and-docs
description: Write focused Rust tests, doc tests, snapshots, comments, and Rustdoc that explain public behavior and error contracts.
---

# Testing and Documentation

Tests should explain behavior while protecting correctness. Documentation should describe public contracts; implementation comments should explain non-obvious rationale.

## Usage

- Name tests as behavior statements. Group many tests for one function in a module named after that function.
- Test one behavior per test and keep assertions few, ideally one primary assertion.
- Cover success and error behavior for behavioral changes.
- Use unit tests near implementation for private edge cases, integration tests under `tests/` for public API behavior, and doc tests for public examples.
- Add assertion messages that show actual state or mismatch context.
- Use snapshots for stable complex structured output, not simple values or critical path logic.
- Redact unstable snapshot fields such as timestamps, UUIDs, random values, and external resource data.

```rust
#[cfg(test)]
mod parse_user {
    use super::*;

    #[test]
    fn returns_invalid_email_when_email_has_no_at_sign() {
        let err = parse_user("ana.example.com").unwrap_err();

        assert!(
            matches!(err, ParseUserError::InvalidEmail(_)),
            "expected invalid email error, got {err:?}",
        );
    }
}
```

```rust
/// Parses a user email address.
///
/// # Errors
///
/// Returns [`ParseUserError::InvalidEmail`] when `raw` is not a valid email.
///
/// # Examples
///
/// ```
/// # use my_crate::parse_user;
/// let user = parse_user("ana@example.com").unwrap();
/// assert_eq!(user.domain(), "example.com");
/// ```
pub fn parse_user(raw: &str) -> Result<User, ParseUserError> {
    // ...
}
```

```rust
#[test]
fn rendered_config_matches_expected_shape() {
    let rendered = render_config(example_config());

    insta::assert_yaml_snapshot!(
        "config/rendered-basic",
        rendered,
        ".generated_at" => "[timestamp]",
    );
}
```

## Comments and Rustdoc

- Use `//` for local rationale: safety invariants, performance quirks, platform workarounds, ADR/design links, and non-obvious assumptions.
- Prefer named comment prefixes such as `// SAFETY:`, `// PERF:`, or `// CONTEXT:` when they clarify why the comment exists.
- Do not write comments that restate code. Replace long "what/how" comments with named helpers and tests.
- Convert lingering TODOs into tracked issue references such as `// TODO(issue #42): remove workaround after hyper upgrade`.
- Use `///` for public items and `//!` for module/crate documentation.
- Include `# Errors`, `# Panics`, and `# Safety` sections whenever the public contract includes those behaviors.

## Key Points

- Doc examples can be executable tests; hide setup lines with `#` when needed.
- `cargo test` runs doc tests, but `cargo nextest run` does not; run `cargo test --doc` separately when using nextest.
- Use `compile_fail`, `no_run`, and `should_panic` doc attributes only when they match the example's purpose.
- Snapshot files should be committed and reviewed carefully.
- Comments can rot; verify existing comments against current code before trusting or extending them.

<!--
Source references:
- https://github.com/apollographql/rust-best-practices/blob/main/book/chapter_05.md
- https://github.com/apollographql/rust-best-practices/blob/main/book/chapter_08.md
-->
