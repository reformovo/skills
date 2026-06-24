---
name: best-practices-formatting
description: Apply Google Python formatting for line length, indentation, parentheses, whitespace, blank lines, statements, and strings.
---

# Formatting

Formatting should make structure obvious and minimize reader effort. Prefer formatter-compatible code, but refactor code that remains hard to read after formatting.

## Usage

Use 4-space indentation and no tabs. Prefer implicit line joining inside parentheses, brackets, and braces; do not use backslash continuations.

```python
# Good
if (
    config is None
    or 'editor.language' not in config
    or config['editor.language'].use_spaces is False
):
    use_tabs()

result = long_function_name(
    first_argument,
    second_argument,
    third_argument,
)
```

```python
# Bad
if config is None or 'editor.language' not in config or config[ \
    'editor.language'].use_spaces is False:
    use_tabs()
```

Use parentheses sparingly: for tuples, grouping, or line continuation; not around simple conditions or return values.

```python
# Good
if enabled:
    run()
return spam, beans
single_item = (spam,)

# Bad
if (enabled):
    run()
return (spam)
```

Use blank lines deliberately: two between top-level definitions, one between methods, none immediately after `def`.

Follow whitespace rules: no spaces inside brackets, no trailing whitespace, spaces around comparisons/assignments, no spaces around keyword/default `=` unless an annotation is present.

```python
# Good
def scale(value: float = 1.0) -> float:
    return value * 2

def complex(real, imag=0.0):
    return Magic(r=real, i=imag)
```

Use one statement per line. A one-line `if` body is allowed only when the entire statement fits and has no `else`; avoid it when clarity suffers.

For strings, use f-strings, `%`, or `.format()` for formatting; do not concatenate pieces with `+` for formatting. Accumulate many substrings with a list plus `''.join()` or `io.StringIO`.

```python
# Good
message = f'name: {name}; score: {score}'
rows = []
for user in users:
    rows.append(f'<tr><td>{user.name}</td></tr>')
html = ''.join(rows)

# Bad
message = 'name: ' + name + '; score: ' + str(score)
```

## Key Points

- Aim for 80 columns; allowed exceptions include long imports, URLs, paths, long flag names, and pylint disables.
- Break lines at the highest practical syntactic level and consistently across similar breaks.
- Use trailing commas when a multi-line container closes on a later line.
- Do not align tokens vertically with extra spaces; it creates maintenance churn.
- Use consistent quote style within a file; docstrings always use triple double quotes.

<!--
Source references:
- https://google.github.io/styleguide/pyguide.html#s3.1-semicolons
- https://google.github.io/styleguide/pyguide.html#s3.2-line-length
- https://google.github.io/styleguide/pyguide.html#s3.3-parentheses
- https://google.github.io/styleguide/pyguide.html#s3.4-indentation
- https://google.github.io/styleguide/pyguide.html#s3.5-blank-lines
- https://google.github.io/styleguide/pyguide.html#s3.6-whitespace
- https://google.github.io/styleguide/pyguide.html#s3.10-strings
- https://google.github.io/styleguide/pyguide.html#s3.14-statements
-->
