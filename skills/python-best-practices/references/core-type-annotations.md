---
name: core-type-annotations
description: Apply Google Python typing rules for public APIs, Any, None, aliases, generics, imports, forward references, and suppressions.
---

# Type Annotations

Annotate public APIs and type-sensitive code to improve readability and catch errors before runtime. Do not force annotations where they make immature or highly dynamic code harder to evolve.

## Usage

Annotate new or changed public APIs. Add annotations to code that is stable, complex, hard to understand, or prone to type bugs.

```python
from collections.abc import Mapping, Sequence


def fetch_scores(user_ids: Sequence[int]) -> Mapping[int, float]:
    ...
```

Use `Any` explicitly when a type cannot or should not be expressed. Prefer a `TypeVar` when input and output types are related.

```python
from collections.abc import Sequence
from typing import Any, TypeVar

_T = TypeVar('_T')


def first(values: Sequence[_T]) -> _T:
    return values[0]


def decode_dynamic(payload: bytes) -> dict[str, Any]:
    return json.loads(payload)
```

Declare `None` explicitly with `X | None`; do not rely on `default=None` implying optional.

```python
# Good
def normalize(name: str | None = None) -> str:
    return '' if name is None else name.strip()

# Bad
def normalize(name: str = None) -> str:
    ...
```

Import typing symbols directly from `typing` and abstract containers from `collections.abc`. Prefer abstract containers in signatures unless concrete behavior matters.

```python
from collections.abc import Iterable, Mapping, Sequence
from typing import Any, TypeAlias

UserScores: TypeAlias = Mapping[int, Sequence[float]]
```

Use `from __future__ import annotations` or strings for forward references.

```python
from __future__ import annotations

class Node:
    def __init__(self, children: Sequence[Node] = ()) -> None:
        self.children = children
```

Keep type ignores narrow and searchable.

```python
value = dynamic_lib.load()  # type: ignore[attr-defined]
# pytype: disable=attribute-error
```

## Key Points

- Do not annotate `self`, `cls`, or `__init__ -> None` unless needed by the type checker.
- Use annotated assignments for hard-to-infer variables: `cache: dict[str, User] = {}`.
- Do not add old-style `# type: Foo` comments in new code.
- Type aliases use `CapWords`; private aliases use `_CapWords`.
- For tuples: `tuple[int, ...]` means homogeneous variable length; `tuple[int, str]` means fixed shape.
- TypeVars need descriptive names unless private, unconstrained, and not externally visible (`_T`, `_P`).
- Conditional imports under `if TYPE_CHECKING:` are exceptional; prefer refactoring to normal top-level imports.
- Circular dependencies from typing are a smell; refactor or use a documented `Any` alias as a last resort.

<!--
Source references:
- https://google.github.io/styleguide/pyguide.html#s2.21-type-annotated-code
- https://google.github.io/styleguide/pyguide.html#s3.19-type-annotations
- https://google.github.io/styleguide/pyguide.html#s3.19.3-forward-declarations
- https://google.github.io/styleguide/pyguide.html#s3.19.5-nonetype
- https://google.github.io/styleguide/pyguide.html#s3.19.6-type-aliases
- https://google.github.io/styleguide/pyguide.html#s3.19.12-imports-for-typing
- https://google.github.io/styleguide/pyguide.html#s3.19.15-generics
-->
