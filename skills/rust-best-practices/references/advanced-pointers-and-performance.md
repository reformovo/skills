---
name: advanced-pointers-and-performance
description: Select Rust pointer, sharing, interior mutability, lazy initialization, and performance tools deliberately.
---

# Pointers and Performance

Rust pointer choices encode ownership, mutability, allocation, and thread-safety. Pick the smallest capability that matches the data flow, and measure before optimizing.

## Pointer Selection

- Use `&T` for shared read-only access and `&mut T` for exclusive mutation.
- Use `Box<T>` for recursive types, large values that should move cheaply, or single-owner heap allocation.
- Use `Rc<T>` only for single-thread shared ownership.
- Use `Arc<T>` for cross-thread shared ownership; combine with `Mutex<T>`/`RwLock<T>` only when shared mutation is required.
- Use `Cell<T>` for copy-only interior mutability and `RefCell<T>` only when runtime borrow checking is the right local tradeoff.
- Use raw pointers only for FFI or low-level unsafe boundaries, and document invariants with `// SAFETY:`.
- Use `OnceCell`/`LazyCell` for single-thread one-time or lazy initialization; use `OnceLock`/`LazyLock` for thread-safe static/lazy values.

```rust
use std::sync::{Arc, RwLock};

#[derive(Clone)]
struct Registry {
    routes: Arc<RwLock<Vec<Route>>>,
}

impl Registry {
    fn routes(&self) -> Result<Vec<Route>, RegistryError> {
        let routes = self
            .routes
            .read()
            .map_err(|_| RegistryError::RoutesLockPoisoned)?;

        Ok(routes.clone())
    }
}
```

```rust
use std::sync::LazyLock;

static DEFAULT_HEADERS: LazyLock<Vec<Header>> = LazyLock::new(|| {
    vec![
        Header::new("content-type", "application/json"),
        Header::new("cache-control", "no-store"),
    ]
});
```

## Thread Safety

- `Send` means a value can move across threads.
- `Sync` means shared references to a value can be used across threads.
- A smart pointer is thread-safe only when the data behind it is thread-safe.
- `Rc`, `Cell`, and `RefCell` are not thread-safe; use `Arc`, `Mutex`, `RwLock`, `OnceLock`, or `LazyLock` for multi-threaded sharing.

## Performance Workflow

1. Reproduce the behavior in a release build.
2. Run Clippy perf lints: `cargo clippy -- -D clippy::perf`.
3. Add a benchmark when comparing two implementations.
4. Profile the real path with `cargo flamegraph`, `samply`, or the repository's profiling tools.
5. Accept performance changes only when measurements show meaningful improvement and readability remains acceptable.

```sh
cargo bench
cargo flamegraph --bin my-service
cargo flamegraph --test parser_regression
```

## Allocation and Size Rules

- Keep small `Copy` values on the stack and pass them by value.
- Avoid passing large values, roughly hundreds of bytes or more, by value unless ownership transfer is the point.
- Heap-allocate recursive structures with `Box`.
- Avoid boxing too early inside structs; box at design boundaries.
- Avoid large stack allocations. Build large boxed slices through `Vec` when needed:

```rust
let buffer: Box<[u8]> = vec![0; 65_536].into_boxed_slice();
```

## Key Points

- `RefCell` borrow violations panic at runtime; prefer ordinary borrowing unless runtime borrowing is truly needed.
- `Arc<Mutex<T>>` is a design signal: verify shared mutation is necessary and lock scope is small.
- Do not add `#[inline]` unless benchmarks prove it matters.
- Iterator chains are usually zero-cost after optimization, but needless `collect()` still allocates.
- Flamegraph width shows time spent; optimize the wide boxes, not guessed bottlenecks.

<!--
Source references:
- https://github.com/apollographql/rust-best-practices/blob/main/book/chapter_03.md
- https://github.com/apollographql/rust-best-practices/blob/main/book/chapter_09.md
-->
