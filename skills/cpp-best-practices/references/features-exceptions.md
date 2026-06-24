---
title: Exceptions, noexcept, and RTTI
impact: HIGH
impactDescription: Error handling strategy affects correctness, binary size, and maintainability; exceptions and RTTI have significant design implications.
type: best-practice
tags: [cpp, exceptions, noexcept, rtti, error-handling, type-information]
---

# Exceptions, noexcept, and RTTI

**Impact: HIGH** - Exception and RTTI policies shape error handling, performance, and code maintainability.

## Task List

- Do NOT use C++ exceptions in new code (Google style) unless it is Windows code
- Use `noexcept` on move constructors for performance; use it on other functions with project lead approval
- Avoid RTTI (`typeid`, `dynamic_cast`) in production code except when logic guarantees the type
- Prefer virtual methods or Visitor pattern over type-based decision trees
- Use `absl::down_cast` instead of `dynamic_cast` when the type is guaranteed

## Exceptions

**Rule: Do not use C++ exceptions** (in Google-style projects). This prohibition also applies to `std::exception_ptr` and `std::nested_exception`.

### Why Not Exceptions

- Exception-safe code requires RAII and disciplined commit/rollback patterns throughout the call graph.
- Adding a `throw` to a function forces all transitive callers to handle exception safety.
- Exceptions make control flow non-local and hard to reason about.
- Binary size and compile time increase.
- Integrating exception-using code with exception-free code is difficult.

### Alternatives

- **Error codes** (`std::optional`, `absl::StatusOr`, `std::error_code`).
- **Assertions / `CHECK` macros** for fatal errors.
- **Factory functions** for constructor failures (returns `std::optional<T>` or `absl::StatusOr<T>`).

**GOOD - Error handling without exceptions:**
```cpp
// Instead of throwing exceptions, return a result type.
absl::StatusOr<Config> LoadConfig(std::string_view path) {
  if (path.empty()) {
    return absl::InvalidArgumentError("path must not be empty");
  }
  Config config;
  // ... parse config ...
  return config;
}

// Usage:
auto result = LoadConfig("config.json");
if (!result.ok()) {
  LOG(ERROR) << "Failed: " << result.status();
  return;
}
UseConfig(*result);
```

**Windows code** is the exception (no pun intended) to this rule, as Windows APIs heavily use COM and system exceptions.

## noexcept

Specify `noexcept` when it is useful for performance and accurately reflects the function's semantics (i.e., any exception is a fatal error).

### When to Use

- **Move constructors and move assignment operators**: mark `noexcept` for meaningful performance benefit. Containers like `std::vector` will move (instead of copy) elements during reallocation only if the move constructor is `noexcept`.
- **Other functions**: with project lead approval if significant performance benefit can be demonstrated.

### Guidelines

- Use **unconditional `noexcept`** if exceptions are disabled at compile time (most Google environments).
- Use **conditional `noexcept`** with simple conditions (e.g., `std::is_nothrow_move_constructible<T>`) only when exceptions are enabled.
- Prefer interface simplicity over supporting all possible throwing scenarios. If you decide a function should never throw, make it unconditionally `noexcept`.

**GOOD:**
```cpp
// Move constructor: noexcept enables std::vector to move instead of copy
Buffer(Buffer&& other) noexcept
    : data_(std::exchange(other.data_, nullptr)),
      size_(std::exchange(other.size_, 0)) {}

// Simple, unconditional noexcept - documents intent
int GetValue() const noexcept { return value_; }
```

**Impact:** If a `noexcept` function does throw, the program calls `std::terminate`. Only mark a function `noexcept` when you truly mean "this will never throw."

## Run-Time Type Information (RTTI)

**Rule: Avoid RTTI (`typeid` and `dynamic_cast`) in production code.**

### Problems with RTTI

- RTTI-based decision trees (`if (typeid(*data) == typeid(D1))`) are fragile and spread type knowledge throughout the codebase.
- Adding new subclasses requires finding and modifying all RTTI decision points.

### Allowed Uses

1. **Unit tests** - verifying factory output types, managing mocks.
2. **When logic guarantees the type** - if your code knows (by design) that a base pointer points to a specific derived type, `dynamic_cast` or `absl::down_cast` is acceptable.

### Alternatives

- **Virtual methods** - let the object itself decide what code to execute.
- **Visitor pattern (double dispatch)** - when the operation belongs outside the object.

**BAD - RTTI decision tree:**
```cpp
void Process(const Base* data) {
  if (typeid(*data) == typeid(Derived1)) {
    // handle Derived1
  } else if (typeid(*data) == typeid(Derived2)) {
    // handle Derived2
  }
  // Adding Derived3 requires modifying this function
}
```

**GOOD - Virtual method:**
```cpp
class Base {
 public:
  virtual void Process() = 0;
};

class Derived1 : public Base {
 public:
  void Process() override { /* handle Derived1 */ }
};

class Derived2 : public Base {
 public:
  void Process() override { /* handle Derived2 */ }
};
// Adding Derived3: just implement Process()
```

**GOOD - Guaranteed type (down_cast):**
```cpp
// When program logic guarantees the type (e.g., factory always produces Derived)
Base* base = Factory();
Derived* derived = absl::down_cast<Derived*>(base);  // faster than dynamic_cast
```

Do not hand-implement RTTI-like workarounds (type tags, enum discriminators in base classes). They have the same problems as RTTI and disguise the intent.

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/cppguide.html
-->
