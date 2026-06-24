---
title: Rvalue References and Friends
impact: MEDIUM
impactDescription: Rvalue references enable move semantics and perfect forwarding but are easily misused; friends should be used sparingly to avoid breaking encapsulation.
type: best-practice
tags: [cpp, rvalue-references, move-semantics, perfect-forwarding, friends, encapsulation]
---

# Rvalue References and Friends

**Impact: MEDIUM** - Move semantics improve performance but misuse causes confusion; friends are occasionally necessary but should not be the default.

## Task List

- Use rvalue references only for move constructors/assignment, forwarding references, `&&`-qualified methods, or overload pairs (with evidence)
- Prefer pass-by-value over rvalue reference overload pairs in simple cases
- Use `std::move` to transfer ownership of movable types (e.g., `std::unique_ptr`)
- Use forwarding references with `std::forward` for perfect forwarding
- Limit `friend` declarations to the same file; prefer public API over friendship

## Rvalue References

Rvalue references (`T&&`) bind only to temporary objects. They enable:

1. **Move constructors and move assignment operators** - efficient transfer of resources instead of copying.
2. **Forwarding references** (`template <typename T> void f(T&&)`) - perfect forwarding of arguments to another function.
3. **`&&`-qualified methods** - logically "consume" `*this`, leaving it in an empty state.
4. **Overload pairs** (`Foo&&` and `const Foo&`) - performance optimization for functions that sometimes don't consume input.

### Allowed Uses

**Move constructor/move assignment:**
```cpp
class Buffer {
 public:
  // Move constructor - transfers ownership of data_
  Buffer(Buffer&& other) noexcept
      : data_(std::exchange(other.data_, nullptr)),
        size_(std::exchange(other.size_, 0)) {}

  Buffer& operator=(Buffer&& other) noexcept {
    if (this != &other) {
      delete[] data_;
      data_ = std::exchange(other.data_, nullptr);
      size_ = std::exchange(other.size_, 0);
    }
    return *this;
  }

 private:
  char* data_ = nullptr;
  size_t size_ = 0;
};
```

**Forwarding reference for perfect forwarding:**
```cpp
template <typename... Args>
std::unique_ptr<Widget> MakeWidget(Args&&... args) {
  return std::make_unique<Widget>(std::forward<Args>(args)...);
}
```

**`&&`-qualified method (consumes `*this`):**
```cpp
class Builder {
 public:
  Config Build() && {  // only callable on temporaries
    return std::move(config_);
  }
 private:
  Config config_;
};

// Usage:
Config cfg = Builder{}.Build();  // OK
// builder.Build();  // Error: cannot bind && to lvalue
```

**Overload pair (with evidence of benefit):**
```cpp
void Process(const Foo& foo);  // copies if needed
void Process(Foo&& foo);       // moves
```
Prefer pass-by-value unless profiling shows the overload pair is significantly faster.

### What to Avoid

- Do NOT use rvalue references in ordinary function signatures where a value parameter suffices.
- Do NOT use `std::move` on const objects (it silently falls back to copy).
- Do NOT use rvalue references to "consume" ordinary function parameters; pass by value instead.

**BAD:**
```cpp
void Consume(std::string&& s);  // unnecessary; use std::string by value
```

**GOOD:**
```cpp
void Consume(std::string s);  // caller can move or copy
```

## Friends

Use `friend` declarations sparingly. They extend but do not break encapsulation. Prefer interacting through public members. Common legitimate uses:

- Builder classes that construct internal state.
- Unit test classes that need access to internals.

**GOOD - Builder as friend:**
```cpp
class Foo {
  friend class FooBuilder;
 private:
  Foo() = default;
  ComplexState state_;
};

class FooBuilder {
 public:
  Foo Build() { /* constructs Foo with proper state */ }
};
```

Keep friend definitions in the same file as the class so readers can find accesses to private members easily.

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/cppguide.html
-->
