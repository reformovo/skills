---
title: Template Metaprogramming and Concepts
impact: MEDIUM
impactDescription: Overuse of template metaprogramming and concepts makes code unreadable, hard to debug, and difficult to refactor.
type: best-practice
tags: [cpp, templates, metaprogramming, concepts, constraints, SFINAE]
---

# Template Metaprogramming and Concepts

**Impact: MEDIUM** - Template metaprogramming enables powerful type-safe interfaces but is often overused, leading to unreadable code and poor error messages. Concepts improve error quality but add complexity.

## Task List

- Avoid complicated template metaprogramming; reserve it for low-level components with broad usage.
- Prefer constraint-based approaches over legacy SFINAE (`std::enable_if`).
- Use `requires(Condition<Args...>)` syntax instead of `template<Concept T>`.
- Prefer standard library predefined concepts (e.g., `std::integral`) over type traits.
- Define new concepts only internally within a library, never in public API headers.
- Do NOT define concepts that duplicate the function body or impose trivial requirements.
- Use only concepts that are statically verifiable by the compiler.
- Avoid recursive template instantiations, type lists, expression templates, and `sizeof` tricks.

## Template Metaprogramming

### Core Principle: Avoid Complexity

Complicated template metaprogramming is obscure, hard to debug, and produces terrible error messages. Think twice before using techniques like:
- Recursive template instantiations
- Type lists and metafunctions
- Expression templates
- SFINAE (Substitution Failure Is Not An Error)
- `sizeof` tricks for detecting function overload resolution

If you do use these techniques:
- Hide metaprogramming as an implementation detail.
- Comment thoroughly, including what the generated code looks like.
- Ensure error messages are understandable and actionable.

### Prefer Constraints over SFINAE

Replace legacy `std::enable_if` with modern `requires` constraints:

```cpp
// BAD: legacy SFINAE
template <typename T,
          std::enable_if_t<std::is_integral_v<T>, int> = 0>
T Increment(T val) { return val + 1; }

// GOOD: concise requires clause
template <typename T>
  requires std::integral<T>
T Increment(T val) { return val + 1; }

// ALSO GOOD: requires expression
template <typename T>
T Increment(T val) requires std::integral<T> { return val + 1; }
```

## Concepts and Constraints

### Use Concepts Sparingly

Only use concepts where templates would have been used in C++17. Do not introduce concepts to solve problems that did not previously exist.

### Prefer `requires(Condition)` Syntax

Avoid the `template<Concept T>` shorthand; use `requires(Concept<T>)` for clarity:

```cpp
// AVOID: shorthand hides that T is constrained
template <std::integral T>
T Double(T x) { return x * 2; }

// PREFER: requires clause is more explicit
template <typename T>
  requires std::integral<T>
T Double(T x) { return x * 2; }
```

### Use Standard Concepts Over Type Traits

Prefer C++20 standard concepts (e.g., `std::integral`, `std::default_initializable`) over equivalent type traits:

```cpp
// BAD: type trait
template <typename T>
  requires std::is_integral_v<T>
void Process(T val);

// GOOD: standard concept
template <typename T>
  requires std::integral<T>
void Process(T val);
```

### Do Not Redefine Existing Concepts

Use standard concepts instead of reimplementing them:

```cpp
// BAD: manual reimplementation
requires(requires { T v; })  // same as std::default_initializable<T>

// GOOD: use the standard concept
requires std::default_initializable<T>
```

### Avoid Concepts at API Boundaries

New `concept` declarations should be rare and internal — never exposed in public API headers. Concepts increase coupling and ossification.

### Avoid Trivial Concepts

Do not define concepts that merely duplicate the function body or impose obvious requirements:

```cpp
// BAD: trivial concept with negligible benefit
template <typename T>
concept Addable = std::copyable<T> && requires(T a, T b) { a + b; };

template <Addable T>
T Add(T x, T y, T z) { return x + y + z; }

// GOOD: just use an ordinary template
template <typename T>
T Add(T x, T y, T z) { return x + y + z; }
```

Only use concepts when they provide significant improvement, such as much better error messages for deeply nested requirements.

### Concepts Must Be Statically Enforceable

Do not define concepts whose primary benefit comes from semantic (unenforced) constraints. Unenforceable requirements belong in comments, assertions, or tests.

```cpp
// BAD: semantic concept (unenforceable)
template <typename T>
concept FastContainer = requires(T& c) { c.size(); };
// "Fast" is a semantic property, not statically verifiable

// GOOD: statically verifiable
template <typename T>
concept Reservable = requires(T& c) {
  c.reserve(decltype(c)::size_type{});
};
```

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/cppguide.html#Template_metaprogramming
- https://github.com/google/styleguide/blob/HEAD/cppguide.html#Concepts
-->
