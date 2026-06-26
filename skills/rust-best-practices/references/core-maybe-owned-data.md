---
name: core-maybe-owned-data
description: Use `Cow` when an API may borrow on the fast path but sometimes needs owned data.
---

# Maybe-Owned Data

Use `Cow<'_, str>` or `Cow<'_, [T]>` when borrowed input is the common case, but some code paths need ownership for normalization, mutation, or storage.

## Usage

- Use `Cow` when forcing ownership would add avoidable allocation on the common path.
- Prefer `&str` or `&[T]` if the API never needs ownership.
- Prefer `String` or `Vec<T>` if the API always needs ownership.
- Convert to owned data only at the boundary that truly needs it.

```rust
use std::borrow::Cow;

fn normalize_name(name: Cow<'_, str>) -> Cow<'_, str> {
    let trimmed = name.trim();

    if trimmed == name.as_ref() {
        name
    } else {
        Cow::Owned(trimmed.to_owned())
    }
}

fn store_name(name: Cow<'_, str>) -> String {
    name.into_owned()
}
```

## Key Points

- `Cow::Borrowed` avoids allocation until ownership is required.
- `Cow::Owned` keeps the API flexible when callers already have owned data.
- Do not use `Cow` as a default replacement for `&T` versus `T`; use it only when both are valid shapes for the API.

<!--
Source references:
- https://github.com/apollographql/rust-best-practices/blob/main/book/chapter_03.md#33-stack-vs-heap-be-size-smart
- https://github.com/apollographql/rust-best-practices/blob/main/book/chapter_03.md#use-cow-for-maybe-owned-data
-->
