---
name: core-error-handling
description: Handle Python errors with specific exceptions, small try blocks, correct assertions, finally/with cleanup, and precise messages.
---

# Error Handling

Exceptions are allowed, but they should make real error paths explicit without hiding unrelated failures.

## Usage

Raise specific built-in exceptions for invalid inputs and define custom exceptions only when callers need to distinguish them. Custom exception names should end in `Error` without repeating the package name.

```python
class OutOfCheeseError(Exception):
    """No more cheese is available."""


def reserve_port(minimum: int) -> int:
    if minimum < 1024:
        raise ValueError(f'Minimum port must be at least 1024: {minimum}')
    ...
```

Do not use `assert` for input validation, preconditions, or behavior required in optimized runtime mode. Use `assert` for internal invariants that code does not depend on, and freely in pytest-style tests.

```python
# Good
def connect(minimum: int) -> int:
    if minimum < 1024:
        raise ValueError(f'Minimum port must be at least 1024: {minimum}')
    port = find_open_port(minimum)
    if port is None:
        raise ConnectionError(f'Could not connect on port {minimum} or higher.')
    assert port >= minimum, f'Unexpected port {port} for minimum {minimum}'
    return port
```

```python
# Bad
def connect(minimum: int) -> int:
    assert minimum >= 1024
    port = find_open_port(minimum)
    assert port is not None
    return port
```

Catch the narrowest exception and keep `try` blocks small.

```python
# Good
try:
    payload = path.read_text()
except OSError as error:
    raise ConfigError(f'Could not read config {path!r}') from error

config = parse_config(payload)
```

```python
# Bad: catches parser bugs as file errors too.
try:
    payload = path.read_text()
    config = parse_config(payload)
except Exception:
    return default_config()
```

Use `with` for closeable resources and `finally` when cleanup must run regardless of success.

```python
with path.open() as stream:
    return parse(stream)

lock.acquire()
try:
    update_shared_state()
finally:
    lock.release()
```

Write error messages that match the actual condition, quote/interpolate values clearly, and are easy to grep. For logging APIs that accept pattern strings, pass a literal pattern and arguments rather than an f-string.

```python
if not 0 <= probability <= 1:
    raise ValueError(f'Not a probability: {probability=}')

logging.warning('Could not remove directory (reason: %r): %r', error, workdir)
```

## Key Points

- Avoid bare `except:` and broad `except Exception:` except at isolation boundaries that log/suppress or when immediately re-raising.
- Do not document API-misuse exceptions as part of a public contract unless callers should rely on them.
- Prefer context managers over finalizers/destructors for observable cleanup.
- Minimize hidden control flow in exception handling; avoid returning defaults for unexpected failures without recording context.

<!--
Source references:
- https://google.github.io/styleguide/pyguide.html#s2.4-exceptions
- https://google.github.io/styleguide/pyguide.html#s3.10.1-logging
- https://google.github.io/styleguide/pyguide.html#s3.10.2-error-messages
- https://google.github.io/styleguide/pyguide.html#s3.11-files-sockets-closeables
-->
