---
name: core-imports-and-modules
description: Structure Python modules with clear imports, package-qualified names, import-safe top-level code, shebangs, and main guards.
---

# Imports and Modules

Imports should make the source of every nonlocal name obvious and keep modules safe to import in tests, tools, and other programs.

## Usage

Use imports for packages and modules, not individual runtime classes or functions. Typing-related imports are an explicit exception.

```python
# Good: module/package import keeps ownership visible.
from absl import flags
from sound.effects import echo

_OUTPUT = flags.DEFINE_string('output', None, 'Destination file.')
processor = echo.EchoFilter(input_stream, output_stream)
```

```python
# Bad: imported runtime symbol hides where it came from.
from sound.effects.echo import EchoFilter

processor = EchoFilter(input_stream, output_stream)
```

Use full package paths for local code. Do not depend on the executable directory being on `sys.path`.

```python
# Good
from doctor.who import jodie

# Bad: ambiguous local-vs-top-level import.
import jodie
```

Group imports at the top after license/module docstring: future imports, standard library, third-party, repository packages. Sort lexicographically within each group.

```python
from __future__ import annotations

import collections
import sys

from absl import app
from absl import flags
import tensorflow as tf

from myproject.backend import huxley
from otherproject.ai import mind
```

Keep executable behavior under a `main` guard.

```python
from collections.abc import Sequence

from absl import app


def main(argv: Sequence[str]) -> None:
    del argv  # Unused.
    run_pipeline()


if __name__ == '__main__':
    app.run(main)
```

## Key Points

- Use `import x`, `from x import y` where `y` is a module, or aliases only for collisions, long names, standard abbreviations, or overly generic module names.
- Never use wildcard imports in normal code; they obscure ownership and defeat static checks.
- Put imports on separate lines except allowed multi-symbol imports from `typing` and `collections.abc`.
- Most `.py` files do not need a shebang; only directly executed entry points should use `#!/usr/bin/env python3` or project-approved equivalent.
- Avoid top-level calls, object creation, or I/O that should not happen during import.

<!--
Source references:
- https://google.github.io/styleguide/pyguide.html#s2.2-imports
- https://google.github.io/styleguide/pyguide.html#s2.3-packages
- https://google.github.io/styleguide/pyguide.html#s3.7-shebang-line
- https://google.github.io/styleguide/pyguide.html#s3.13-imports-formatting
- https://google.github.io/styleguide/pyguide.html#s3.17-main
-->
