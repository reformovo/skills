---
title: Casting - Type Conversions Done Safely
impact: MEDIUM
impactDescription: Wrong casts silently produce undefined behavior; C++ casts make intent explicit and catch errors at compile time.
type: best-practice
tags: [cpp, casting, type-conversion, static_cast, reinterpret_cast, const_cast]
---

# Casting: Type Conversions Done Safely

**Impact: MEDIUM** - Incorrect casting can silently produce undefined behavior; using the right cast documents intent and enables compiler checks.

## Task List

- Never use C-style casts (`(int)x`) except for casting to `void`
- Use brace initialization for arithmetic type conversions (prevents narrowing)
- Use `static_cast` for value conversions and up-casting
- Use `absl::down_cast` for down-casting when the type is guaranteed
- Use `const_cast` only to remove `const` (requires justification)
- Use `reinterpret_cast` only when you fully understand aliasing rules
- Use `std::bit_cast` for type-punning (reinterpret raw bits)

## Casting Rules (in order of preference)

### 1. Brace initialization (for arithmetic types)

Safest approach: code will not compile if conversion loses information.

```cpp
int64_t x = int64_t{1} << 42;
double d{3.14};
```

### 2. Function-style cast (for class types)

When converting to a class type, use `T(value)` syntax instead of `static_cast<T>(value)`.

```cpp
std::string s = std::string(some_cord);
```

### 3. `absl::implicit_cast` (safe up-cast)

For casting up the type hierarchy (derived to base) or adding `const`. C++ usually does this automatically, but some contexts (e.g., ternary `?:`) need explicit annotations.

```cpp
const Foo* const_foo = absl::implicit_cast<const Foo*>(foo);
```

### 4. `static_cast` (value conversion, up-cast, and down-cast)

Use as the equivalent of a C-style cast for value conversion, or for explicitly converting pointer types within a class hierarchy. When down-casting, you must be certain the object is actually an instance of the target type.

```cpp
float f = static_cast<float>(double_value);
Base* base = static_cast<Base*>(derived);            // up-cast (safe)
Derived* derived = static_cast<Derived*>(base);       // down-cast (unsafe if wrong type)
```

### 5. `absl::down_cast` (safe down-cast with DCHECK)

Use instead of `static_cast<Derived*>(base)` when you know the type is correct. Includes a `DCHECK` in debug builds.

```cpp
Derived* derived = absl::down_cast<Derived*>(base);  // DCHECKs type in debug
```

### 6. `const_cast` (remove const)

Use only to remove `const` from a pointer/reference. You must be sure the original object is not actually `const` (otherwise modifying it is undefined behavior).

```cpp
// Only valid if the underlying object is non-const
Foo* mutable_foo = const_cast<Foo*>(const_foo);
```

### 7. `reinterpret_cast` (unsafe pointer/integer conversion)

For unsafe conversions of pointer types to/from integers and other pointer types (including `void*`). Use only when you fully understand aliasing rules. Consider `std::bit_cast` as a safer alternative.

```cpp
uintptr_t addr = reinterpret_cast<uintptr_t>(ptr);
```

### 8. `std::bit_cast` (type-punning)

Interpret the raw bits of a value as a different type of the same size. Safe alternative to `reinterpret_cast` for type-punning because it respects strict aliasing rules.

```cpp
double d = 3.14;
int64_t bits = std::bit_cast<int64_t>(d);  // same size, same bits
```

### 9. `dynamic_cast` (runtime-checked down-cast)

See [RTTI section](./features-exceptions.md) for guidance. Use only when you need runtime type checking and cannot redesign.

**Summary decision tree:**

| Goal | What to use |
|------|-------------|
| Convert arithmetic types | Brace init `int64_t{x}` |
| Convert to class type | Function-style `T(x)` |
| Up-cast (derived to base) | `implicit_cast` or nothing |
| Value conversion / safe down-cast | `static_cast` |
| Down-cast (guaranteed correct) | `absl::down_cast` |
| Remove `const` | `const_cast` |
| Unsafe pointer conversion | `reinterpret_cast` |
| Reinterpret bits (type pun) | `std::bit_cast` |
| Runtime-checked down-cast | `dynamic_cast` (avoid in production) |

**BAD - C-style casts:**
```cpp
int x = (int)3.5;           // ambiguous: conversion? cast?
void* p = (void*)&x;        // hard to search for in codebase
```

**GOOD - C++ casts:**
```cpp
int x = static_cast<int>(3.5);  // clear intent
void* p = static_cast<void*>(&x);
```

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/cppguide.html
-->
