---
name: python-best-practices
description: MUST be used for Python tasks. Based on the Google Python Style Guide. Covers imports, packages, main guards, Pythonic idioms, comprehensions, generators, function design, type annotations, exceptions, assertions, mutable state, resources, formatting, strings, logging, comments, docstrings, naming, decorators, properties, threading, and power-feature avoidance. Load for any Python code writing, reviewing, testing, or refactoring work.
license: Apache-2.0
metadata:
  author: reformovo
  version: "2026.6.25"
  source: Generated from https://github.com/google/styleguide, scripts located at https://github.com/reformovo/skills
---

> The skill is based on the Google Python Style Guide (`pyguide.md`) at commit `1809c769de31ba388c755ad15dd057a9ba8531fd`, generated at 2026-06-25.

The Google Python Style Guide emphasizes readable, maintainable Python that is import-safe, explicit about public APIs, type-checkable where useful, and idiomatic without becoming clever.

## Core Principles

- **Prefer clarity over cleverness:** use Python idioms when they read directly; expand complex expressions into named steps.
- **Keep modules import-safe:** top-level code should define constants, classes, and functions, not perform program work.
- **Type public APIs:** annotate new or modified public functions and stable complex code; use type checking where feasible.
- **Handle errors deliberately:** raise specific exceptions, keep `try` blocks small, and never use `assert` for required runtime validation.
- **Avoid hidden state and magic:** minimize mutable globals, power features, import-time work, and surprising properties/decorators.

## Required Usage Workflow

1. **Confirm the style baseline.** Use this skill for Python code unless the repository explicitly adopts a conflicting style.
2. **Start with core references.** Apply [core-imports-and-modules](references/core-imports-and-modules.md), [core-pythonic-code](references/core-pythonic-code.md), [core-function-design](references/core-function-design.md), and [core-type-annotations](references/core-type-annotations.md).
3. **Make behavior explicit.** Use [core-error-handling](references/core-error-handling.md), state/resource rules, and docstrings for public contracts.
4. **Apply style last.** Format, name, and document consistently with existing nearby code and the Google rules.
5. **Use advanced features only with clear payoff.** Decorators, properties, threading, reflection, and metaprogramming must simplify the caller-visible design.

## Final Self-Check

- Imports are top-level, sorted by group, full-package where appropriate, and do not import functions/classes except typing exemptions.
- Executable work is under `main()` and `if __name__ == '__main__':`; modules remain importable by tests and documentation tools.
- Public APIs and type-sensitive code are annotated; `Any`, ignores, and conditional imports are justified and narrow.
- Functions are small, focused, and avoid mutable/default-time values; generators document `Yields:` and clean up resources.
- Exceptions are specific; `assert` is only for internal invariants or tests, not user input or required runtime checks.
- Mutable globals, hidden class state, and resource lifetimes are avoided or documented.
- Formatting follows 4-space indentation, no semicolons, sensible 80-column wrapping, and no backslash continuations.
- Docstrings document public/non-obvious APIs; comments explain why, not what; TODOs include searchable context.
- Names are descriptive `lower_with_under`/`CapWords`/`CAPS_WITH_UNDER`; dashes and unnecessary dunder/private tricks are avoided.

## Core References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Imports and Modules | Import forms, package imports, ordering, shebangs, main guard, import-safe modules | [core-imports-and-modules](references/core-imports-and-modules.md) |
| Pythonic Code | Truthiness, comprehensions, generators, iterators/operators, conditionals, modern syntax | [core-pythonic-code](references/core-pythonic-code.md) |
| Function Design | Small functions, nested functions, lambdas, generators, default arguments, lexical scoping | [core-function-design](references/core-function-design.md) |
| Type Annotations | Public API typing, Any, None, aliases, TypeVars, imports, forward refs, ignores | [core-type-annotations](references/core-type-annotations.md) |
| Error Handling | Exceptions, assertions, try/except scope, finally, resources, logging and error messages | [core-error-handling](references/core-error-handling.md) |

## Best Practices

| Topic | Description | Reference |
|-------|-------------|-----------|
| Linting and Tools | pylint, pytype, suppressions, unused args, formatter-aware style | [best-practices-linting-and-tools](references/best-practices-linting-and-tools.md) |
| Mutability and State | Mutable globals, constants, class attributes, getters/setters, resource ownership | [best-practices-mutability-and-state](references/best-practices-mutability-and-state.md) |
| Formatting | Line length, parentheses, indentation, whitespace, blank lines, statements, strings | [best-practices-formatting](references/best-practices-formatting.md) |
| Comments and Docstrings | Module/class/function docstrings, block comments, inline comments, TODOs | [best-practices-comments-and-docstrings](references/best-practices-comments-and-docstrings.md) |
| Naming | File, package, module, class, function, variable, constant, test, and type variable names | [best-practices-naming](references/best-practices-naming.md) |

## Advanced Features

| Topic | Description | Reference |
|-------|-------------|-----------|
| Decorators and Properties | Judicious decorators, `staticmethod`/`classmethod`, properties, accessors | [advanced-decorators-and-properties](references/advanced-decorators-and-properties.md) |
| Concurrency | Threading cautions, queues, locks, condition variables, shared-state discipline | [advanced-concurrency](references/advanced-concurrency.md) |
