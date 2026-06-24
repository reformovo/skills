---
title: Type Deduction (auto, decltype, CTAD, Structured Bindings)
impact: MEDIUM
impactDescription: Type deduction affects readability and correctness; misuse hides types from readers or introduces unintended copies.
type: best-practice
tags: [cpp, type-deduction, auto, templates, ctad, structured-bindings]
---

# Type Deduction (auto, decltype, CTAD, Structured Bindings)

**Impact: MEDIUM** - Type deduction makes code more concise but can obscure types. Use it to improve clarity and safety, not to avoid typing.

## Task List

- Use `auto` only when it makes code clearer or safer, not to avoid writing an explicit type.
- Use `auto` for local variables where the type is obvious boilerplate (e.g., iterators, smart pointers from `make_*`).
- Use structured bindings for map/pair/tuple elements instead of explicit `.first`/`.second`.
- Restrict return type deduction to narrow-scope functions with few `return` statements.
- Avoid `decltype(auto)` unless a simpler option will not work.
- Do NOT use `auto` parameters in non-lambda functions; use named template parameters instead.
- Use CTAD only with templates that explicitly opted in via deduction guides.
- Avoid CTAD for templates whose constructors predate C++17 and may have incorrect implicit guides.

## Local Variable Type Deduction

Use `auto` to eliminate obvious or irrelevant type boilerplate, allowing readers to focus on meaningful information.

```cpp
// BAD: redundant type clutter
std::unique_ptr<WidgetWithBellsAndWhistles> widget =
    std::make_unique<WidgetWithBellsAndWhistles>(arg1, arg2);
absl::flat_hash_map<std::string, std::unique_ptr<WidgetWithBellsAndWhistles>>::const_iterator
    it = my_map_.find(key);

// GOOD: auto removes obvious boilerplate
auto widget = std::make_unique<WidgetWithBellsAndWhistles>(arg1, arg2);
auto it = my_map_.find(key);
```

When the type contains useful information mixed with boilerplate, consider an explicit type for the informative part:

```cpp
if (auto it = my_map_.find(key); it != my_map_.end()) {
  WidgetWithBellsAndWhistles& widget = *it->second;
  // Do stuff with `widget`
}
```

## Return Type Deduction

Use return type deduction only when:
- The function body has very few `return` statements and little other code.
- The function has a very narrow scope (the implementation IS the interface).

**Never use return type deduction for public functions in header files.**

```cpp
// OK: narrow scope, obvious return type
auto Square(int x) { return x * x; }

// NOT OK: public API in a header — type is not obvious
auto ComputeFrobnicatedValue(const Input& input);  // What does this return?
```

## Function Parameter Type Deduction

Avoid `auto` parameters in non-lambda functions. Use named template parameters instead to make the templated nature explicit.

```cpp
// BAD: auto parameter in non-lambda
void F(auto arg) { ... }

// GOOD: explicit template parameter
template <typename T>
void F(T arg) { ... }
```

In lambdas, if you need to refer to a parameter's type, make it a template parameter:

```cpp
// BAD: using decltype on auto param
[](auto x) { decltype(x) y; ... }

// GOOD: named template parameter
[]<typename T>(T x) { T y; ... }
```

## Structured Bindings

Use structured bindings to give meaningful names to elements of pairs, tuples, and structs. This improves readability and avoids the common bug of forgetting to `const`-qualify map key types.

```cpp
// GOOD: structured binding for map insert result
auto [iter, success] = my_map.insert({key, value});
if (!success) {
  iter->second = value;
}

// GOOD: structured binding avoids accidental copy of map key
for (const auto& [key, value] : my_map) {
  Process(key, value);
}
```

When the binding names differ from field names, use a comment:

```cpp
auto [/*field_name1=*/bound_name1, /*field_name2=*/bound_name2] = ...;
```

## Class Template Argument Deduction (CTAD)

Use CTAD only with templates that have explicitly opted in via at least one explicit deduction guide. All `std` namespace templates are presumed opted in.

```cpp
// GOOD: std::array has explicit deduction guides
std::array a = {1, 2, 3};  // a is std::array<int, 3>

// BAD: using CTAD with a template that may not support it
MyCustomContainer c = {1, 2, 3};  // Implicit guides may be incorrect
```

CTAD suffers from similar drawbacks as `auto` — it hides the type and may surprise readers. Use it sparingly.

## decltype(auto)

Avoid `decltype(auto)` unless a simpler alternative cannot work. It is obscure and harms code clarity.

```cpp
// AVOID: obscure
decltype(auto) result = some_function();

// PREFER: explicit or simple auto
auto result = some_function();
```

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/cppguide.html#Type_deduction
- https://github.com/google/styleguide/blob/HEAD/cppguide.html#CTAD
-->
