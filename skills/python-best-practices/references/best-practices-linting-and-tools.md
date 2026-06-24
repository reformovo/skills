---
name: best-practices-linting-and-tools
description: Use pylint, pytype, formatter-aware style, and narrow suppressions for maintainable Python code.
---

# Linting and Tools

Static tools catch bugs that dynamic execution may miss. Prefer fixing tool findings; suppress only when the warning is genuinely wrong or a deliberate exception.

## Usage

Run `pylint` with the project configuration and enable type analysis such as `pytype` when adding or modifying typed code.

```shell
pylint path/to/module.py
pytype path/to/package
```

Use symbolic `pylint: disable` names and add an explanation when the reason is not obvious.

```python
def do_PUT(self) -> None:  # WSGI name, so pylint: disable=invalid-name
    ...

def run_plugin(plugin: Plugin, argv: Sequence[str]) -> int:
    del argv  # Unused by plugin protocol.
    return plugin.run()
```

Prefer deleting truly unused arguments with a comment over renaming public parameters to `_` or `unused_`, which can break named callers and does not prove the value is unused.

Use narrow type suppressions and keep them close to the problem.

```python
result = dynamic_api.load()  # type: ignore[attr-defined]
# pytype: disable=attribute-error
```

Let auto-formatters handle mechanical wrapping when the project uses Black or Pyink, but still make source readable: add locals, break at high syntactic levels, and avoid backslash continuations.

## Key Points

- Use `pylint --list-msgs` and `pylint --help-msg=<symbol>` to identify warning names.
- Prefer `pylint: disable` over deprecated `disable-msg`.
- Suppress warnings in a searchable way so later maintainers can revisit them.
- If type annotations cannot be adopted yet, leave a TODO or bug reference explaining the blocker.
- Most files do not need shebangs; directly executed programs may use `#!/usr/bin/env python3`.

<!--
Source references:
- https://google.github.io/styleguide/pyguide.html#s2.1-lint
- https://google.github.io/styleguide/pyguide.html#s2.21-type-annotated-code
- https://google.github.io/styleguide/pyguide.html#s3.2-line-length
- https://google.github.io/styleguide/pyguide.html#s3.7-shebang-line
- https://google.github.io/styleguide/pyguide.html#s3.19.7-ignoring-types
-->
