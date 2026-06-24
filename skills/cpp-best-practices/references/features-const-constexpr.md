---
title: Use of const, constexpr, constinit, and consteval
impact: HIGH
impactDescription: Const correctness prevents bugs, enables compiler optimizations, and is critical for thread-safe code.
type: best-practice
tags: [cpp, const-correctness, compile-time, constants]
---

# Use of const, constexpr, constinit, and consteval

**Impact: HIGH** - Using const and constexpr correctly prevents accidental mutations, enables compiler optimizations, documents invariants, and is essential for thread safety.

## Task List

- Mark function parameters as `const T&` or `const T*` when the function does not modify the argument.
- Declare member functions `const` unless they alter the logical state of the object or cannot safely be invoked concurrently.
- Use `constexpr` for true compile-time constants and functions that support their definitions.
- Use `consteval` for code that must never be invoked at runtime.
- Use `constinit` to guarantee constant initialization for non-const variables.
- Do NOT use `const` on by-value function parameters in declarations (it has no effect on the caller).
- Do NOT use `constexpr` or `consteval` to force inlining.
- Avoid complexifying function definitions solely to enable `constexpr` usage.

## const in APIs

**Rule:** Use `const` whenever it makes sense in APIs — on function parameters, methods, and non-local variables. This provides compiler-verified documentation of what an operation can mutate.

- If a function guarantees it will not modify a reference or pointer parameter, use `const T&` or `const T*`.
- For by-value parameters, `const` has no effect on the caller and is not recommended in function declarations.
- Declare methods `const` unless they alter logical state or cannot safely be invoked concurrently.

All `const` operations on a class should be safe to invoke concurrently. If that is not feasible, document the class as "thread-unsafe".

**const on local variables** is neither encouraged nor discouraged — use judgment.

### const Placement

Putting `const` first (e.g., `const int*`) is encouraged for readability (adjective before noun), but not required. Be consistent with surrounding code.

```cpp
// GOOD: const reference documents non-mutation intent
void Process(const std::string& input);

// GOOD: const member function
class Foo {
  int Bar(char c) const;
};

// NOT RECOMMENDED: const on by-value param in declaration
void f(const int x);  // No effect on caller
```

## constexpr for Compile-Time Constants

Use `constexpr` to define true constants — values fixed at compilation/link time. This enables:
- Floating-point constant expressions beyond literals.
- Constants of user-defined types.
- Constants defined via function calls.

```cpp
constexpr int kBufferSize = 4096;
constexpr double kEpsilon = 1e-9;
constexpr int Factorial(int n) {
  return (n <= 1) ? 1 : n * Factorial(n - 1);
}
```

Do NOT prematurely mark something as `constexpr` if it may need to be downgraded later. Avoid obscure workarounds to satisfy `constexpr` restrictions.

## consteval for Mandatory Compile-Time Evaluation

Use `consteval` to declare functions that must only be invoked at compile time. They cannot be called at runtime.

```cpp
consteval int CompileOnly(int x) {
  return x * 2;
}
```

## constinit for Constant Initialization

Use `constinit` to ensure a non-const variable has constant initialization (no dynamic initialization order issues).

```cpp
constinit int kGlobalCounter = 0;  // Constant init, but mutable
```

## Summary

| Specifier   | Mutability | Evaluation Time     | Use Case                            |
|-------------|------------|---------------------|-------------------------------------|
| `const`     | Immutable  | Runtime             | API contracts, non-modifying params |
| `constexpr` | Immutable  | Compile or runtime  | True constants, compile-time funcs  |
| `consteval` | Immutable  | Compile only        | Must-not-run-at-runtime functions   |
| `constinit` | Mutable    | Compile (init only) | Global vars needing constant init   |

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/cppguide.html#Use_of_const
- https://github.com/google/styleguide/blob/HEAD/cppguide.html#Use_of_constexpr
-->
