---
name: core-ownership-and-idioms
description: Apply Rust ownership, borrowing, Copy, Option/Result, lazy allocation, iterator, and import practices from Apollo Rust Best Practices.
---

# Ownership and Idioms

Use Rust's type system to make ownership explicit without forcing callers to allocate or clone. Prefer simple, readable data flow before clever abstractions.

## Usage

- Accept borrowed data by default: `&str` over `String`, `&[T]` over `Vec<T>` or `&Vec<T>`, and `&T` over `T` for large or heap-backed values.
- Take ownership only when the function stores the value, consumes it semantically, transfers it across ownership boundaries, or must satisfy an owned-data API.
- Clone only when preserving a snapshot, sharing `Arc`/`Rc`, caching, or adapting to an owned API. Delay `.clone()` until the last possible point.
- Pass small `Copy` values by value. Derive `Copy` only for small plain-data structs/enums whose fields are all `Copy`; do not combine `Copy` with `Iterator`.
- Prefer `let PATTERN = expr else { ... };` for expected early exits that do not need the failed value.
- Use `match` when branches inspect inner variants, guards, or complex transformations.
- Use `.ok()`, `.ok_or_else(...)`, `.map_err(...)`, `.inspect_err(...)`, `.unwrap_or_else(...)`, and `.unwrap_or_default()` instead of verbose or eager alternatives.
- Prefer iterator pipelines for pure collection transformations; use `for` loops for early `break`/`continue`/`return`, mutation-heavy logic, I/O, or complex side effects.
- Avoid intermediate `collect()` calls unless a collection is genuinely needed.

```rust
fn find_user<'a>(users: &'a [User], id: UserId) -> Result<&'a User, LookupError> {
    users
        .iter()
        .find(|user| user.id == id)
        .ok_or_else(|| LookupError::MissingUser(id))
}

fn parse_port(raw: Option<&str>) -> Result<u16, ConfigError> {
    let Some(raw) = raw else {
        return Ok(8080);
    };

    raw.parse::<u16>()
        .map_err(|source| ConfigError::InvalidPort { raw: raw.to_owned(), source })
}
```

```rust
#[derive(Clone, Debug)]
struct Config {
    endpoints: Vec<String>,
}

impl ConfigStore {
    fn cached_config(&self) -> Config {
        self.cached_config.clone()
    }

    fn validate_endpoint(endpoint: &str) -> Result<(), ConfigError> {
        if endpoint.starts_with("https://") {
            Ok(())
        } else {
            Err(ConfigError::InvalidEndpoint(endpoint.to_owned()))
        }
    }
}
```

```rust
let total: u64 = records
    .iter()
    .filter(|record| record.enabled)
    .map(|record| record.size)
    .sum();

for record in &mut records {
    if record.is_terminal() {
        break;
    }
    record.refresh(now)?;
}
```

## Key Points

- Cloning a borrowed argument usually means the API should have accepted ownership instead.
- `_or_else` variants avoid eager allocation or computation on success paths.
- Prefer `.cloned()`/`.copied()` at the iterator boundary over ad hoc clone closures.
- Format long iterator chains one method per line so rustfmt keeps them readable.
- Import order should be `std`/`core`/`alloc`, external crates, workspace crates, `super::`, then `crate::`.

<!--
Source references:
- https://github.com/apollographql/rust-best-practices/blob/main/book/chapter_01.md
- https://github.com/apollographql/rust-best-practices/blob/main/book/chapter_03.md#32-avoid-redundant-cloning
-->
