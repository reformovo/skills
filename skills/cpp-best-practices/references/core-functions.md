---
title: Function Design (Parameters, Length, Overloading, Defaults, Trailing Return)
impact: MEDIUM
impactDescription: Well-designed functions improve readability, maintainability, and reduce bugs at call sites.
type: best-practice
tags: [cpp, functions, parameters, overloading, default-arguments, trailing-return]
---

# Functions

**Impact: MEDIUM** - Function design decisions directly affect call-site clarity, testability, and long-term maintainability.

## Task List

- Prefer return values over output parameters; use references for non-optional outputs and pointers for optional ones.
- Place all input-only parameters before output parameters.
- Keep functions small and focused (ideally under 40 lines).
- Overload functions only when call sites are unambiguous without knowing which overload is selected.
- Use default arguments only on non-virtual functions, with values that are guaranteed constant.
- Prefer trailing return type syntax only when it improves readability (lambdas, template return types dependent on parameters).

## Inputs and Outputs

Prefer return values over output parameters -- they improve readability and often perform equally well or better.

**Parameter guidelines:**

| Parameter Type | Recommended Form |
|---------------|------------------|
| Non-optional input | Value or `const` reference |
| Optional input | `std::optional<T>` (by value) or `const T*` |
| Non-optional output / in-out | Reference (`T&`) -- cannot be null |
| Optional output / in-out | Pointer (`T*`) -- can be null |

**Avoid requiring reference parameters to outlive the call.** Reference parameters can bind to temporaries, causing lifetime bugs. If a parameter must outlive the call, use a pointer and document the lifetime/non-null requirements.

### Parameter Ordering

Put all input-only parameters before any output parameters. This is not a hard rule, but it should be the default. In-out parameters blur the distinction; when in doubt, follow consistency with related functions.

**BAD:**
```cpp
// Output parameter before input -- confusing
void ParseLine(int* result, const std::string& line);
```

**GOOD:**
```cpp
// Inputs first, output last
bool ParseLine(const std::string& line, int* result);
```

```cpp
// Using return value is even better
std::optional<int> ParseLine(const std::string& line);
```

## Write Short Functions

Prefer small, focused functions. There is no hard line limit, but if a function exceeds roughly 40 lines, consider whether it can be broken up without harming program structure.

**Why:**
- Short functions are easier to read, understand, and test.
- Long functions accumulate new behaviors over time as modifications are added, creating a breeding ground for bugs.
- If a function is hard to debug or you want to reuse part of it, break it into smaller pieces.

Even if a long function works correctly now, someone modifying it later is likely to introduce bugs. Keep functions short as a defensive practice.

## Function Overloading

Overload functions (including constructors) only when a reader at a call site can understand what is happening without determining which specific overload is selected. The reader should only need to know that *something* from the overload set is being called.

**Requirements:**
- Overloads must have no semantic differences between variants.
- Variants may differ in types, qualifiers, or argument count.
- Prefer a single "umbrella" comment before the first declaration that documents the entire overload set.
- Only add per-overload comments when the reader would have difficulty connecting the umbrella comment to a specific overload.

**GOOD:**
```cpp
// Analyzes the given text for patterns.
// Overloads accept either a std::string or a raw buffer.
void Analyze(const std::string& text);
void Analyze(const char* text, size_t textlen);
```

**Consider `string_view`** as an alternative when overloading for `const char*` and `const std::string&`:
```cpp
void Analyze(std::string_view text);  // Single overload handles both
```

**Caveat:** If a derived class overrides only some overloaded variants, readers can be confused by the hiding behavior. Consider whether the overloads should be virtual or use a different design.

## Default Arguments

Default arguments are allowed only on **non-virtual** functions, when the default value is guaranteed to always be the same.

**Restrictions:**
- **Banned on virtual functions** -- the default is determined by the static type, not the dynamic type, leading to surprising behavior.
- **Banned with non-constant defaults** -- e.g., `void f(int n = counter++);` is forbidden because the value depends on evaluation timing.
- Prefer overloads when readability gains from default arguments are unclear.

**Comparison with overloads:**

| Aspect | Default Arguments | Overloads |
|--------|-----------------|-----------|
| Syntax | Cleaner, less boilerplate | More explicit |
| Required vs optional args | Clear distinction | Must check each overload |
| Virtual functions | Banned (broken semantics) | Works correctly |
| Function pointers | Confusing (signature mismatch) | Works correctly |
| Code bloat | Default re-evaluated at each call site | Standard overload resolution |

When in doubt, use overloads instead of default arguments.

## Trailing Return Type Syntax

Use trailing return types (`auto Foo() -> int`) only when the ordinary leading return type is impractical or much less readable.

**When trailing return is required or preferred:**
1. **Lambdas** -- the only way to explicitly specify a lambda return type:
   ```cpp
   auto lambda = [](int x) -> double { return x * 1.5; };
   ```
2. **Template return types depending on parameters** -- much more readable than the leading alternative:
   ```cpp
   // Trailing return (readable)
   template <typename T, typename U>
   auto Add(T t, U u) -> decltype(t + u);

   // Leading return (convoluted)
   template <typename T, typename U>
   decltype(declval<T&>() + declval<U&>()) Add(T t, U u);
   ```

**When NOT to use it:** For most ordinary functions, stick with the traditional leading return type. Mixing the two styles harms uniformity, and trailing return syntax is unfamiliar to developers coming from C, Java, or other C++-like languages.

**Decision:** Use the old style by default. Only reach for trailing return when it genuinely improves readability, which is rare outside template metaprogramming and lambdas.

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/cppguide.html
-->
