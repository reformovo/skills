---
name: core-errors-and-results
description: Model Rust fallibility with Result, typed errors, anyhow boundaries, panic discipline, and useful error tests.
---

# Errors and Results

Make runtime failure visible in signatures. Libraries should expose typed errors; binaries may erase errors for ergonomic reporting at the process boundary.

## Usage

- Return `Result<T, E>` for recoverable runtime failure. Avoid `panic!` for ordinary input, I/O, network, parse, or validation errors.
- Use `?` for straight-line propagation. Use `map_err` for translation, `inspect_err` for observation/logging, and `or_else` for recovery.
- Use `thiserror` for crate/module-level error enums and structs. Prefer `#[from]` for boundary conversions that are part of the API.
- Reserve `anyhow` for binaries, command handlers, examples, or test helpers where callers do not need typed matching.
- Avoid `unwrap` and `expect` in production paths. If failure is impossible by construction, prefer `unreachable!` with a precise invariant.
- In tests, use `unwrap_err`, `to_string`, `matches!`, or `PartialEq` errors to verify error behavior.

```rust
#[derive(Debug, thiserror::Error)]
pub enum ConfigError {
    #[error("failed to read config from {path}")]
    Read {
        path: PathBuf,
        #[source]
        source: std::io::Error,
    },

    #[error("invalid config JSON")]
    Json(#[from] serde_json::Error),

    #[error("missing required field `{0}`")]
    MissingField(&'static str),
}

pub fn load_config(path: &Path) -> Result<Config, ConfigError> {
    let raw = std::fs::read_to_string(path)
        .map_err(|source| ConfigError::Read { path: path.to_owned(), source })?;

    let config = serde_json::from_str(&raw)?;
    Ok(config)
}
```

```rust
use anyhow::{Context, Result};

fn main() -> Result<()> {
    let config = load_config(Path::new("config.json"))
        .context("startup failed while loading config")?;

    run(config)
}
```

```rust
#[test]
fn load_config_returns_missing_field_for_absent_port() {
    let err = parse_config(r#"{"host":"localhost"}"#).unwrap_err();

    assert!(
        matches!(err, ConfigError::MissingField("port")),
        "expected missing port error, got {err:?}",
    );
}
```

## Key Points

- `panic!`, `todo!`, `unimplemented!`, and `unreachable!` are explicit abort paths; use them only when aborting is intentional.
- `expect` is better than `unwrap` in tests or impossible cases, but it is still a panic.
- Avoid `anyhow::Result` in libraries because it erases structure callers may need.
- Async tasks and cross-thread error paths often need errors to be `Send + Sync + 'static`.
- If an error type cannot implement `PartialEq`, assert its variant with pattern matching or its user-facing message with `to_string()`.

<!--
Source references:
- https://github.com/apollographql/rust-best-practices/blob/main/book/chapter_04.md
-->
