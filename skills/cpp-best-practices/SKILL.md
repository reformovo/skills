---
name: cpp-best-practices
description: MUST be used for C++ tasks. Based on the Google C++ Style Guide. Covers header hygiene, scoping, classes, functions, ownership/smart pointers, exceptions, casting, const/constexpr, integer/floating types, type deduction, lambdas, templates/concepts, modern C++ features, preprocessor macros, naming, comments, and formatting. Load for any C++ code writing, reviewing, or refactoring work.
license: Apache-2.0
metadata:
  author: reformovo
  version: "2026.6.24"
  source: Generated from https://github.com/google/styleguide, scripts located at https://github.com/reformovo/skills
---

> The skill is based on the Google C++ Style Guide (cppguide.html) at commit `1809c769de31ba388c755ad15dd057a9ba8531fd`, generated at 2026-06-24.

The Google C++ Style Guide is a set of conventions for writing readable, maintainable, and correct C++ code. It targets C++17 (with some C++20 features permitted) and emphasizes predictability, ownership clarity, and compile-time safety over cleverness.

## Core Principles

- **Prefer clarity over cleverness:** write code that is easy to read and reason about.
- **Make ownership explicit:** use smart pointers and value semantics; avoid raw `new`/`delete`.
- **Keep headers self-contained:** every header must compile on its own with proper guards and includes.
- **Minimize scope:** declare variables in the narrowest scope possible; avoid global mutable state.
- **Const correctness by default:** mark things `const` and `constexpr` whenever possible.
- **No exceptions:** use status-returning APIs (`absl::StatusOr`, `std::optional`) instead of exceptions.

## 1) Confirm the standard before coding (required)

- Default target: C++17, with C++20 features (modules, coroutines, concepts) used only where the guide explicitly permits.
- This skill follows the Google C++ Style Guide. If the project uses a different style guide (e.g., LLVM, ISO Core), do not apply these rules blindly.

### 1.1 Must-read core references (required)

- Before implementing any C++ task, read and apply these core references:
  - `references/core-header-files.md`
  - `references/core-scoping.md`
  - `references/core-classes.md`
  - `references/core-functions.md`
- Keep these references in active working context for the entire task.

## 2) Apply essential C++ foundations (required)

### Header Files

- Must-read reference: [core-header-files](references/core-header-files.md)
- Self-contained headers with `#define` guards (`PROJECT_PATH_FILE_H_`).
- Include what you use; avoid relying on transitive includes.
- Order includes: related header, C system, C++ stdlib, other libs, project.

### Scoping

- Must-read reference: [core-scoping](references/core-scoping.md)
- Use named namespaces; avoid `using namespace` in headers.
- Prefer unnamed namespaces or `static` for internal linkage over file-scope `static`.
- Keep static/global variables trivially destructible; avoid dynamic initialization order issues.

### Classes

- Must-read reference: [core-classes](references/core-classes.md)
- No virtual calls in constructors; prefer factory functions for complex setup.
- Mark single-argument constructors `explicit`.
- Explicitly declare or delete copy/move operations.
- Prefer composition over inheritance; use `override`/`final`.

### Functions

- Must-read reference: [core-functions](references/core-functions.md)
- Prefer return values over output parameters.
- Keep functions short and focused.
- Avoid default arguments on virtual functions.

## 3) Apply ownership and type-safety rules (required)

### Ownership and Smart Pointers

- Must-read reference: [features-smart-pointers](references/features-smart-pointers.md)
- Use `std::unique_ptr` for exclusive ownership; `std::shared_ptr` only when shared ownership is necessary.
- Raw pointers/references for non-owning access only.
- Never use `std::auto_ptr`.

### Exceptions and Error Handling

- Must-read reference: [features-exceptions](references/features-exceptions.md)
- No exceptions; use `absl::StatusOr` / `std::optional` / return codes.
- Mark move constructors `noexcept` for `vector` performance.
- Avoid RTTI (`typeid`, `dynamic_cast`) in production; prefer virtual methods or Visitor.

### Casting

- Must-read reference: [features-casting](references/features-casting.md)
- Use C++ casts (`static_cast`, `const_cast`, `reinterpret_cast`, `bit_cast`), never C-style casts.
- Prefer brace initialization or function-style casts for safe conversions.

### Const and constexpr

- Must-read reference: [features-const-constexpr](references/features-const-constexpr.md)
- Use `const` for things that should not change after initialization.
- Use `constexpr` for compile-time constants; `consteval` for mandatory compile-time evaluation.

### Integer and Floating-Point Types

- Must-read reference: [features-integer-floating-types](references/features-integer-floating-types.md)
- Use `int` by default; use exact-width types (`int64_t`, etc.) only when necessary.
- Avoid unsigned integers for non-bitfield quantities.
- Use `double` for floating-point; avoid `float` unless space-constrained.

## 4) Consider optional features only when requirements call for them

### Type Deduction

- Use `auto` for local variables when it improves readability; avoid for non-obvious types.
- Reference: [features-type-deduction](references/features-type-deduction.md)

### Lambda Expressions

- Use explicit captures; avoid default captures (`[=]`, `[&]`) unless scope is tiny.
- Reference: [features-lambdas](references/features-lambdas.md)

### Templates and Concepts

- Avoid complex template metaprogramming; prefer concepts and `requires` over SFINAE.
- Reference: [features-templates-concepts](references/features-templates-concepts.md)

### Rvalue References and Friends

- Use rvalue references only for move constructors/assignment and forwarding.
- Reference: [features-rvalue-references](references/features-rvalue-references.md)

### Modern C++ Features

- Designated initializers (C++20) allowed; modules and coroutines restricted.
- Reference: [features-modern-cpp](references/features-modern-cpp.md)

### Preprocessor and Miscellaneous

- Avoid macros; prefer `constexpr` and inline functions. Use `nullptr` over `NULL`/`0`.
- Reference: [features-preprocessor-misc](references/features-preprocessor-misc.md)

## 5) Apply naming and commenting conventions (required)

### Naming

- Must-read reference: [core-naming](references/core-naming.md)
- Type names: `PascalCase`. Variable/function names: `snake_case`. Class member variables: trailing `_`.
- Constants: `kPascalCase`. Macros: `ALL_CAPS`. File names: `snake_case.h`.

### Comments

- Must-read reference: [core-comments](references/core-comments.md)
- Use `//` comments. Document every file, class, and function with a clear description.
- Use `TODO` comments with context (name, email, bug ID).

## 6) Apply formatting rules (required)

### Formatting

- Must-read reference: [core-formatting](references/core-formatting.md)
- 80-column line limit. 2-space indentation, no tabs.
- Open braces on the same line. One statement per line.
- Pointer/reference type operators attach to the type (`int* p`, not `int *p`).

## 7) Final self-check before finishing

- Headers are self-contained with proper guards and includes.
- Scoping is minimal; no unnecessary global mutable state.
- Class design is explicit (copy/move declared or deleted, `explicit` on single-arg ctors).
- Ownership is clear (smart pointers for owning, raw for non-owning).
- No exceptions; error handling uses status returns.
- Const correctness applied throughout.
- Naming and formatting follow the conventions.
- No C-style casts; no `auto_ptr`; no `using namespace` in headers.

## Core References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Header Files | Guards, includes, forward declarations, include ordering | [core-header-files](references/core-header-files.md) |
| Scoping | Namespaces, internal linkage, static/global variables, thread_local | [core-scoping](references/core-scoping.md) |
| Classes | Constructors, implicit conversions, copy/move, inheritance, access control | [core-classes](references/core-classes.md) |
| Functions | Inputs/outputs, short functions, overloading, default arguments | [core-functions](references/core-functions.md) |
| Naming | File, type, variable, function, namespace, macro naming conventions | [core-naming](references/core-naming.md) |
| Comments | Comment style, file/class/function/variable comments, TODOs | [core-comments](references/core-comments.md) |
| Formatting | Line length, indentation, braces, whitespace, class/namespace format | [core-formatting](references/core-formatting.md) |

## Features

### Ownership and Error Handling

| Topic | Description | Reference |
|-------|-------------|-----------|
| Smart Pointers | unique_ptr, shared_ptr, weak_ptr, ownership semantics | [features-smart-pointers](references/features-smart-pointers.md) |
| Exceptions | No exceptions, noexcept, RTTI avoidance | [features-exceptions](references/features-exceptions.md) |
| Casting | static_cast, const_cast, reinterpret_cast, bit_cast, no C-style casts | [features-casting](references/features-casting.md) |

### Type Safety

| Topic | Description | Reference |
|-------|-------------|-----------|
| Const and constexpr | const correctness, constexpr, consteval, constinit | [features-const-constexpr](references/features-const-constexpr.md) |
| Integer and Floating Types | int defaults, exact-width types, unsigned pitfalls, portability | [features-integer-floating-types](references/features-integer-floating-types.md) |
| Type Deduction | auto, decltype, CTAD, structured bindings | [features-type-deduction](references/features-type-deduction.md) |

### Modern C++ Features

| Topic | Description | Reference |
|-------|-------------|-----------|
| Lambda Expressions | Captures, init captures, lifetime, default capture guidelines | [features-lambdas](references/features-lambdas.md) |
| Templates and Concepts | Template metaprogramming limits, concepts, requires, SFINAE avoidance | [features-templates-concepts](references/features-templates-concepts.md) |
| Rvalue References and Friends | Move semantics, forwarding references, friend access | [features-rvalue-references](references/features-rvalue-references.md) |
| Modern C++ | Designated initializers, C++20 modules, coroutines | [features-modern-cpp](references/features-modern-cpp.md) |

### Preprocessor and Miscellaneous

| Topic | Description | Reference |
|-------|-------------|-----------|
| Preprocessor and Misc | Streams, macros, nullptr, sizeof, disallowed stdlib, switch statements | [features-preprocessor-misc](references/features-preprocessor-misc.md) |