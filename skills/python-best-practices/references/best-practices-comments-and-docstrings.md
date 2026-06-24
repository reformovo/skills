---
name: best-practices-comments-and-docstrings
description: Write Google-style Python docstrings, comments, and TODOs that document contracts and explain non-obvious decisions.
---

# Comments and Docstrings

Documentation should help callers use APIs and help maintainers understand non-obvious decisions. Do not restate obvious Python code.

## Usage

Use triple-double-quoted docstrings. Summary lines fit on one physical line, end with punctuation, and are followed by a blank line before details.

Module docstrings describe contents and usage. Test module docstrings are optional and should add real information, not just “Tests for X.”

```python
"""Utilities for importing customer billing snapshots.

Typical usage:

  snapshot = load_snapshot(path)
  validate_snapshot(snapshot)
"""
```

Function docstrings are required for public APIs, nontrivial functions, and non-obvious logic. Document side effects, mutations, relevant exceptions, and return/yield semantics.

```python
def fetch_rows(
    table: SmallTable,
    keys: Sequence[bytes | str],
    require_all_keys: bool = False,
) -> Mapping[bytes, tuple[str, ...]]:
    """Fetches rows from a table.

    Args:
        table: An open table handle.
        keys: Keys to fetch. String keys are UTF-8 encoded.
        require_all_keys: If True, return only complete rows.

    Returns:
        A mapping from byte keys to row data.

    Raises:
        OSError: The table could not be read.
    """
```

Use `Yields:` for generator functions, not `Returns:`. A `@property` docstring should describe the attribute, not say “Returns ...”.

Class docstrings describe what instances represent and document public attributes in an `Attributes:` section.

```python
class CheeseShopAddress:
    """The address of a cheese shop.

    Attributes:
        city: City where the shop is located.
        postal_code: Postal routing code.
    """
```

Use block/inline comments for tricky or non-obvious code. Explain why, not what.

```python
# We use a weighted probe to reduce binary-search work on nearly uniform data.
probe = estimate_position(values, target)

if value & (value - 1) == 0:  # True for 0 or a power of 2.
    ...
```

TODOs need searchable context and an explanation.

```python
# TODO: crbug.com/192795 - Replace polling with event-driven updates.
```

## Key Points

- Do not document implementation details unless callers need to know them.
- Do not list exceptions raised only when callers violate the documented API.
- Overridden methods with `@override` can omit docstrings unless they change or refine the contract.
- Comments should be readable prose with consistent punctuation and grammar.
- Avoid TODOs that point only to a person or team; use an issue/link and a concrete follow-up.

<!--
Source references:
- https://google.github.io/styleguide/pyguide.html#s3.8-comments-and-docstrings
- https://google.github.io/styleguide/pyguide.html#s3.8.3-functions-and-methods
- https://google.github.io/styleguide/pyguide.html#s3.8.4-comments-in-classes
- https://google.github.io/styleguide/pyguide.html#s3.8.5-block-and-inline-comments
- https://google.github.io/styleguide/pyguide.html#s3.12-todo-comments
-->
