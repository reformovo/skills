---
name: core-pythonic-code
description: Use readable Python idioms for truthiness, comprehensions, iterators, operators, conditional expressions, and modern syntax.
---

# Pythonic Code

Use Python idioms when they express intent directly. If an idiom becomes dense, expand it into named intermediate values or a loop.

## Usage

Prefer implicit truthiness for containers, explicit `is None` for sentinel defaults, and explicit numeric comparisons when zero has meaning.

```python
# Good
if users:
    send_digest(users)

if config is None:
    config = load_default_config()

if retry_count == 0:
    start_timer()
```

```python
# Bad
if len(users) > 0:
    send_digest(users)

config = config or load_default_config()  # Breaks for valid falsey configs.

if not retry_count:
    start_timer()  # Confuses 0 with None/False.
```

Use default iteration and membership operators instead of list-producing methods.

```python
# Good
for key in settings:
    validate(key, settings[key])

if user_id in active_users:
    grant_access(user_id)

for path, metadata in files.items():
    index(path, metadata)
```

```python
# Bad
for key in settings.keys():
    validate(key, settings[key])

for line in open_file.readlines():
    process(line)
```

Use comprehensions for one `for` clause plus optional filters. Switch to loops when there are multiple `for` clauses, multiple filters, or non-obvious transformations.

```python
# Good
valid_names = [user.name for user in users if user.is_active]
score_by_id = {row.user_id: row.score for row in rows if row.score is not None}
unique_regions = {user.region for user in users if user.region}
```

```python
# Good: loop is clearer for cross-product and nested conditions.
pairs: list[tuple[int, int]] = []
for x in range(10):
    for y in range(5):
        if x * y > 10:
            pairs.append((x, y))
```

Use conditional expressions only when each part is simple and readable.

```python
# Good
label = 'enabled' if feature.enabled else 'disabled'

# Bad: split into if/else with named conditions.
label = ('enabled' if config.features.evaluate_for_user(user, request)
         else 'disabled')
```

## Key Points

- Optimize for readability, not minimum lines.
- Never compare booleans to `False`; use `if not enabled:` or distinguish `None` explicitly.
- For NumPy arrays, avoid implicit boolean context; test `.size` or use explicit array APIs.
- Prefer generator expressions when a full list is not needed.
- `from __future__ import annotations` is encouraged when useful for modern annotations and forward references.

<!--
Source references:
- https://google.github.io/styleguide/pyguide.html#s2.7-comprehensions
- https://google.github.io/styleguide/pyguide.html#s2.8-default-iterators-and-operators
- https://google.github.io/styleguide/pyguide.html#s2.11-conditional-expressions
- https://google.github.io/styleguide/pyguide.html#s2.14-truefalse-evaluations
- https://google.github.io/styleguide/pyguide.html#s2.20-modern-python
-->
