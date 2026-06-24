---
name: best-practices-mutability-and-state
description: Avoid mutable global state, use constants and explicit resource ownership, and choose simple access patterns over hidden state.
---

# Mutability and State

State should be owned by objects, passed explicitly, or made immutable. Hidden mutable module/class state makes tests, imports, concurrency, and multi-instance use harder.

## Usage

Prefer constants to mutable globals. Constants use all caps with underscores and may be public or private.

```python
_MAX_RETRIES = 3
DEFAULT_TIMEOUT_SECONDS = 30
```

Avoid global registries, caches, clients, and configuration unless there is a strong design reason. If mutable global state is necessary, keep it internal and explain why.

```python
# Good: instance-owned state.
class UserRepository:
    def __init__(self, db: Database) -> None:
        self._db = db


# Acceptable only with justification.
_PROCESS_CACHE: dict[str, User] = {}
# Used to share expensive process-wide lookups across short-lived handlers.
```

Use simple public attributes when reading/writing is simple. Add getters/setters only when access has meaningful behavior or cost.

```python
# Good: simple data is a public attribute.
class User:
    def __init__(self, email: str) -> None:
        self.email = email


# Good: setter indicates nontrivial invalidation.
class Index:
    def set_documents(self, documents: Sequence[Document]) -> None:
        self._documents = tuple(documents)
        self._search_cache.clear()
```

Always close stateful resources with `with` or `contextlib.closing` rather than relying on finalizers.

```python
import contextlib

with open(path) as stream:
    process(stream)

with contextlib.closing(legacy_open(url)) as stream:
    process(stream)
```

## Key Points

- Mutable globals break encapsulation and can change behavior during import.
- Class attributes are also global-ish state when mutated; keep them constants or carefully controlled internals.
- Do not use `__del__` for important cleanup; lifetime is not predictable.
- Document rare stateful designs with the reason, owner, and synchronization/lifetime rules.
- Do not bind a new complex getter/setter back to an old property; let callers notice the API changed.

<!--
Source references:
- https://google.github.io/styleguide/pyguide.html#s2.5-global-variables
- https://google.github.io/styleguide/pyguide.html#s2.13-properties
- https://google.github.io/styleguide/pyguide.html#s3.11-files-sockets-closeables
- https://google.github.io/styleguide/pyguide.html#s3.15-accessors
- https://google.github.io/styleguide/pyguide.html#s3.16-naming
-->
