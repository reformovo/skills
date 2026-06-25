---
name: advanced-dispatch-and-type-state
description: Choose static dispatch, dynamic dispatch, and type-state patterns for Rust APIs only when the design constraints justify them.
---

# Dispatch and Type-State

Use compile-time polymorphism first when concrete types are known. Use runtime polymorphism or type-state only when they simplify real API constraints.

## Contents

- [Static vs Dynamic Dispatch](#static-vs-dynamic-dispatch)
- [Type-State](#type-state)
- [Key Points](#key-points)

## Static vs Dynamic Dispatch

- Prefer generics, trait bounds, and `impl Trait` for performance-sensitive code and call sites where the concrete type is known.
- Use dynamic dispatch (`&dyn Trait`, `Box<dyn Trait>`, `Arc<dyn Trait + Send + Sync>`) for plugin architectures, mixed-type collections, or stable abstraction boundaries.
- Prefer `&dyn Trait` when borrowing is enough; use `Box<dyn Trait>` only when ownership/type erasure is required.
- Use `Arc<dyn Trait + Send + Sync>` for shared trait objects across threads.
- Delay boxing until the boundary that needs it.

```rust
fn encode_all<W>(items: &[Item], writer: &mut W) -> Result<(), EncodeError>
where
    W: std::io::Write,
{
    for item in items {
        item.encode(writer)?;
    }
    Ok(())
}
```

```rust
trait Handler: Send + Sync {
    fn handle(&self, request: Request) -> Result<Response, HandlerError>;
}

struct Router {
    handlers: Vec<Arc<dyn Handler>>,
}
```

Object-safe traits cannot require `Self: Sized`, have generic methods, or expose `Self` in unsupported return positions:

```rust
trait Runnable {
    fn run(&self);
}

trait Factory {
    fn create<T>(&self) -> T;
}
```

## Type-State

Use type-state when illegal states or transitions should be compile errors: required-field builders, protocol states, validated vs unvalidated input, or APIs where reaching a state proves an invariant.

```rust
use std::marker::PhantomData;

struct MissingName;
struct NameSet;

struct UserBuilder<State> {
    name: Option<String>,
    email: Option<String>,
    _state: PhantomData<State>,
}

impl UserBuilder<MissingName> {
    fn new() -> Self {
        Self { name: None, email: None, _state: PhantomData }
    }

    fn name(self, name: String) -> UserBuilder<NameSet> {
        UserBuilder { name: Some(name), email: self.email, _state: PhantomData }
    }
}

impl UserBuilder<NameSet> {
    fn email(mut self, email: String) -> Self {
        self.email = Some(email);
        self
    }

    fn build(self) -> User {
        User {
            name: self.name.unwrap_or_else(|| unreachable!("name set by type state")),
            email: self.email,
        }
    }
}
```

## Key Points

- Static dispatch has no runtime vtable cost but can increase compile time and binary size through monomorphization.
- Dynamic dispatch reduces code duplication and enables mixed implementations but adds indirection and object-safety constraints.
- Avoid dynamic dispatch when you control all concrete types and performance matters.
- Avoid type-state for trivial states, simple enums, or designs where generics make the API harder to use than runtime checks.
- `PhantomData` is compile-time state; use it when it removes runtime checks or prevents misuse, not for novelty.

<!--
Source references:
- https://github.com/apollographql/rust-best-practices/blob/main/book/chapter_06.md
- https://github.com/apollographql/rust-best-practices/blob/main/book/chapter_07.md
- https://github.com/apollographql/rust-best-practices/tree/main/examples/simple-type-state
- https://github.com/apollographql/rust-best-practices/tree/main/examples/type-state-builder
-->
