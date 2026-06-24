---
name: best-practices-naming
description: Apply Google Python naming conventions for files, packages, modules, classes, exceptions, functions, variables, constants, tests, and type variables.
---

# Naming

Names should be descriptive and proportional to scope. Prefer names that explain role over abbreviations or embedded implementation types.

## Usage

Use the standard casing patterns.

```python
# Packages/modules/files
import payment_processor
from customer_tools import invoice_loader


class InvoiceParser:
    pass


class InvalidInvoiceError(Exception):
    """The invoice is structurally invalid."""


MAX_RETRIES = 3
_DEFAULT_BATCH_SIZE = 100


def parse_invoice(raw_invoice: bytes) -> Invoice:
    local_name = 'invoice'
    return Invoice(local_name)
```

Use a single leading underscore for internal module names, functions, variables, attributes, and methods. Avoid double-leading dunder names except Python-defined special methods.

```python
def _parse_header(line: str) -> Header:
    ...

class Parser:
    def __init__(self) -> None:
        self._cache: dict[str, Result] = {}
```

Name tests descriptively with PEP 8 style in new code.

```python
def test_parse_invoice_missing_total_raises_error() -> None:
    ...
```

Use descriptive type variable names when visible, constrained, or bound; reserve `_T`, `_P` for private unconstrained variables.

```python
_T = TypeVar('_T')
AddableType = TypeVar('AddableType', int, float, str)
AnyFunction = TypeVar('AnyFunction', bound=Callable)
```

## Key Points

- Files use `.py` and never contain dashes; use lower_with_under for modules.
- Classes and exceptions use `CapWords`; exceptions end in `Error`.
- Functions, methods, parameters, locals, global variables, and instance variables use `lower_with_under`.
- Constants use `CAPS_WITH_UNDER`.
- Avoid ambiguous abbreviations and names that delete letters from words.
- Avoid single-character names except narrow counters/iterators, `e` for exceptions, `f` for file handles, private type vars, or documented mathematical notation.
- Do not include the variable type unnecessarily in the name, such as `id_to_name_dict`.
- Mathematical notation is acceptable in math-heavy code when documented and narrowly lint-suppressed if necessary.

<!--
Source references:
- https://google.github.io/styleguide/pyguide.html#s3.16-naming
- https://google.github.io/styleguide/pyguide.html#s3.16.1-names-to-avoid
- https://google.github.io/styleguide/pyguide.html#s3.16.2-naming-conventions
- https://google.github.io/styleguide/pyguide.html#s3.16.3-file-naming
- https://google.github.io/styleguide/pyguide.html#s3.16.4-guidelines-derived-from-guidos-recommendations
- https://google.github.io/styleguide/pyguide.html#math-notation
-->
