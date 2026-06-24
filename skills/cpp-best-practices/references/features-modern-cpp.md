---
title: Modern C++ Features (Designated Initializers, Modules, Coroutines)
impact: MEDIUM
impactDescription: Modern C++20 features have specific usage restrictions and pitfalls that must be understood to avoid subtle bugs and portability issues.
type: best-practice
tags: [cpp, cpp20, designated-initializers, modules, coroutines]
---

# Modern C++ Features

**Impact: MEDIUM** - C++20 features like designated initializers, modules, and coroutines come with strict usage rules and restrictions.

## Task List

- Use designated initializers only in C++20-compliant form (field order must match struct definition)
- Do not use C++20 Modules (not yet approved for production)
- Only use coroutines through project-lead-approved libraries; do not author custom promise/awaitable types
- Ensure coroutine usage accounts for dangling references and race condition risks

## Designated Initializers

Designated initializers allow initializing an aggregate struct by naming fields explicitly. Use them only in the C++20-compliant form, where initializers must appear in the **same order** as the fields in the struct definition.

**GOOD:**
```cpp
struct Point {
  float x = 0.0;
  float y = 0.0;
  float z = 0.0;
};

// Designated initializers in field-declaration order
Point p = {
  .x = 1.0,
  .y = 2.0,
  // z will be 0.0
};
```

**Why this matters:** C++20 rules are stricter than C or compiler extensions. Fields must be initialized in declaration order. Out-of-order designated initializers that work as a compiler extension are not valid C++20 and will not compile with a standards-conforming compiler.

## C++20 Modules

**Do not use C++20 Modules.** The keywords `module`, `export`, and `import` are reserved but the feature is not yet approved for use. Modules are a fundamental shift in how C++ is written and compiled, and they are not sufficiently supported by build systems, compilers, and tooling. Best practices for writing and using modules are still under exploration.

## Coroutines

Only use C++20 coroutines via libraries that have been approved by your project leads. Do not author custom promise types or awaitable types.

C++20 coroutines introduce functions that can suspend and resume execution. Unlike other languages (Kotlin, Rust, TypeScript), C++ does not provide a concrete coroutine implementation. Users must implement a promise type that determines coroutine parameter types, execution behavior, and user-defined hooks.

**Key risks:**
- No standard coroutine promise type exists, making every implementation unique
- Coroutine semantics are extremely difficult to deduce from reading user code due to load-bearing interactions between return type, promise hooks, and compiler-generated code
- High risk of dangling references and race conditions due to the many customizable aspects
- Designing a high-quality, interoperable coroutine library requires significant effort

**Rule of thumb:** Use only approved coroutine libraries. Never roll your own promise or awaitable types.

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/cppguide.html
-->
