---
name: advanced-decorators-and-properties
description: Use Python decorators, properties, classmethods, and accessors only when they make APIs clearer without hiding surprising work.
---

# Decorators and Properties

Decorators and properties can make APIs elegant, but they also hide execution and can run at import time. Use them when they clearly simplify the contract.

## Usage

Use decorators judiciously and test them. Decorators should have docstrings saying they are decorators, follow normal import/naming rules, and avoid external dependencies at decoration time.

```python
def requires_permission(permission: str) -> Callable[[Handler], Handler]:
    """Returns a decorator that enforces a permission check."""
    def decorator(handler: Handler) -> Handler:
        @functools.wraps(handler)
        def wrapper(request: Request) -> Response:
            if not request.user.has_permission(permission):
                raise PermissionError(permission)
            return handler(request)
        return wrapper
    return decorator
```

Avoid decorators that do I/O, open sockets, query databases, or depend on runtime services while the module is imported.

Prefer module-level functions over `staticmethod`. Use `classmethod` only for named constructors or class-specific operations that must modify required class/global state.

```python
# Good: module-level helper.
def normalize_email(email: str) -> str:
    return email.strip().lower()


class User:
    @classmethod
    def from_row(cls, row: Mapping[str, str]) -> Self:
        return cls(email=normalize_email(row['email']))
```

Use `@property` for cheap, straightforward, unsurprising attribute-like access. Do not use properties for expensive work, side effects, or simple pass-through getters/setters.

```python
class Rectangle:
    def __init__(self, width: float, height: float) -> None:
        self.width = width
        self.height = height

    @property
    def area(self) -> float:
        """The rectangle area."""
        return self.width * self.height
```

```python
# Bad: property hides network I/O.
@property
def profile(self) -> Profile:
    return profile_service.fetch(self.user_id)
```

## Key Points

- Decorators execute when functions/classes are defined, often during import.
- Avoid `staticmethod` unless required by an existing external API.
- Do not use properties for computations a subclass may need to override and extend.
- For complex or costly get/set behavior, use explicit `get_foo()`/`set_foo()` methods.
- Avoid power features such as custom metaclasses, bytecode access, dynamic inheritance, import hacks, broad reflection, runtime system modification, and `__del__` cleanup hooks.
- Standard library APIs that use power features internally, such as `abc.ABCMeta`, `dataclasses`, and `enum`, are fine to use.

<!--
Source references:
- https://google.github.io/styleguide/pyguide.html#s2.13-properties
- https://google.github.io/styleguide/pyguide.html#s2.17-function-and-method-decorators
- https://google.github.io/styleguide/pyguide.html#s2.19-power-features
- https://google.github.io/styleguide/pyguide.html#s3.15-accessors
-->
