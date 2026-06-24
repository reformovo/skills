---
name: core-function-design
description: Design focused Python functions with safe defaults, useful generators, narrow lambdas, and testable structure.
---

# Function Design

Functions should be short, focused, testable, and explicit about defaults and lifetime behavior.

## Usage

Prefer small functions. Around 40 lines is a signal to look for extraction opportunities, especially when debugging or reuse is hard.

```python
# Good: separate parsing from validation and side effects.
def load_user(path: pathlib.Path) -> User:
    data = _read_json(path)
    return _parse_user(data)
```

Do not use mutable or runtime-dependent default argument values. Defaults are evaluated once at module load.

```python
# Good
def collect_names(users: Sequence[User] | None = None) -> list[str]:
    if users is None:
        users = ()
    return [user.name for user in users]

def retry(delays: Sequence[float] = ()) -> None:
    ...
```

```python
# Bad
def collect_names(users: list[User] = []) -> list[str]:
    return [user.name for user in users]

def retry(started_at: float = time.time()) -> None:
    ...
```

Use generators when streaming improves clarity or memory usage. Document yielded values with `Yields:` and ensure expensive resources are cleaned up.

```python
def read_active_users(path: pathlib.Path) -> Iterator[User]:
    """Yields active users from a JSON-lines file."""
    with path.open() as stream:
        for line in stream:
            user = parse_user(line)
            if user.is_active:
                yield user
```

Use lambdas only for simple one-line expressions. Prefer named functions or `operator` helpers when the operation needs a name, spans lines, or appears in traces.

```python
# Good
names = sorted(users, key=lambda user: user.name)
products = itertools.starmap(operator.mul, pairs)

# Bad
users = sorted(users, key=lambda user: normalize_and_validate_user_name(
    user.profile.display_name))
```

Avoid nested functions/classes unless they close over a local value or implement a decorator. To hide helpers from users, define `_helper` at module scope so tests can exercise it.

```python
# Good: closure is the point.
def make_threshold_filter(min_score: float) -> Callable[[Result], bool]:
    def accepts(result: Result) -> bool:
        return result.score >= min_score
    return accepts

# Good: testable private helper.
def _normalize_name(name: str) -> str:
    return ' '.join(name.split())
```

## Key Points

- Keep the call contract clear from the signature and docstring.
- Prefer module-level functions over nested helpers for testability.
- Be careful with lexical scoping: assignments inside a function make names local in that block.
- Use complete `if` statements instead of clever conditional expressions when logic grows.

<!--
Source references:
- https://google.github.io/styleguide/pyguide.html#s2.6-nested
- https://google.github.io/styleguide/pyguide.html#s2.9-generators
- https://google.github.io/styleguide/pyguide.html#s2.10-lambda-functions
- https://google.github.io/styleguide/pyguide.html#s2.12-default-argument-values
- https://google.github.io/styleguide/pyguide.html#s2.16-lexical-scoping
- https://google.github.io/styleguide/pyguide.html#s3.18-function-length
-->
