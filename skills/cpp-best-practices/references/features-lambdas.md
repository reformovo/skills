---
title: Lambda Expressions
impact: MEDIUM
impactDescription: Lambdas are powerful but easy to misuse — wrong captures cause dangling pointers and subtle lifetime bugs.
type: best-practice
tags: [cpp, lambdas, captures, functional-programming]
---

# Lambda Expressions

**Impact: MEDIUM** - Lambdas provide concise anonymous function objects but require careful capture management to avoid dangling-pointer bugs and maintain readability.

## Task List

- Use lambdas where appropriate, especially with STL algorithms.
- Prefer explicit captures when the lambda may escape the current scope.
- Use default capture by reference (`[&]`) only when the lambda's lifetime is obviously shorter than its captures.
- Use default capture by value (`[=]`) only for short lambdas with obvious captures; avoid for long/complex lambdas.
- Capture `this` explicitly when the lambda uses class members and appears in a non-static member function.
- Do NOT use init captures to introduce new names; declare a variable normally and then capture it.
- Avoid very long or deeply nested anonymous functions.
- Prefer named template parameters over `auto` in lambda parameters when you need to refer to the parameter type.

## Basic Usage

Lambdas are most useful as concise function objects passed to algorithms:

```cpp
std::sort(v.begin(), v.end(), [](int x, int y) {
  return Weight(x) < Weight(y);
});
```

## Capture Modes

### Explicit Captures (Preferred for Escaping Lambdas)

List each captured variable explicitly by name, specifying value or reference:

```cpp
int weight = 3;
int sum = 0;
std::for_each(v.begin(), v.end(), [weight, &sum](int x) {
  sum += weight * x;
});
```

### Default Capture by Reference ([&])

Use only when the lambda's lifetime is guaranteed to be shorter than all captured objects:

```cpp
// OK: lambda used immediately, within scope
std::sort(indices.begin(), indices.end(), [&](int a, int b) {
  return lookup_table[a] < lookup_table[b];
});
```

### Default Capture by Value ([=])

Use only for short lambdas where the captured set is obvious at a glance. Avoid default value capture for long lambdas.

**Important:** In a non-static member function, `[=]` captures `this` implicitly (by pointer, not by value), which can lead to dangling. Capture `this` explicitly or use `[&]`.

```cpp
// BAD: dangling reference risk
{
  Foo foo;
  executor->Schedule([&] { Frobnicate(foo); });
  // foo is destroyed when scope exits, but lambda may run later
}

// GOOD: explicit capture makes the dependency clear
{
  Foo foo;
  executor->Schedule([&foo] { Frobnicate(foo); });
  // Compiler catches if Frobnicate is a member function (needs 'this')
}
```

### Init Captures (Generalized Captures)

Init captures allow capturing move-only types or defining new lambda members. However, do NOT use them to introduce entirely new names — declare a normal variable instead.

```cpp
// GOOD: init capture to move unique_ptr into lambda
std::unique_ptr<Foo> foo = ...;
[foo = std::move(foo)]() { ... };

// BAD: using init capture to introduce a new name
[x = 42, y = "hello"]() { ... };  // Just use a regular variable

// GOOD alternative: declare outside
int x = 42;
const char* y = "hello";
[x, y]() { ... };
```

## Type Deduction in Lambdas

When you need to refer to a lambda parameter's type, prefer a named template parameter over `auto` + `decltype`:

```cpp
// BAD: awkward decltype on auto param
[](auto x) { decltype(x) y; ... }

// GOOD: named template parameter
[]<typename T>(T x) { T y; ... }
```

## Keep Lambdas Short

Long, complex, or deeply nested lambdas harm readability. If a lambda grows beyond a few lines, consider extracting it as a named function object.

```cpp
// AVOID: long nested lambdas
std::sort(data.begin(), data.end(), [&](const auto& a, const auto& b) {
  // ... 30 lines of complex logic ...
});

// PREFER: named comparator
struct MyComparator {
  bool operator()(const auto& a, const auto& b) const { /* ... */ }
};
std::sort(data.begin(), data.end(), MyComparator{});
```

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/cppguide.html#Lambda_expressions
-->
