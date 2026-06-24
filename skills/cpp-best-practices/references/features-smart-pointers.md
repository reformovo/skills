---
title: Ownership and Smart Pointers
impact: HIGH
impactDescription: Memory management bugs (leaks, double-frees, dangling pointers) are the most common and dangerous defects in C++; smart pointers eliminate entire classes of these errors.
type: best-practice
tags: [cpp, smart-pointers, memory-management, ownership, unique_ptr, shared_ptr]
---

# Ownership and Smart Pointers

**Impact: HIGH** - Correct ownership semantics prevent memory leaks, dangling pointers, and use-after-free bugs.

## Task List

- Prefer single, fixed owners for dynamically allocated objects
- Use `std::unique_ptr` for exclusive ownership and ownership transfer
- Avoid `std::shared_ptr` unless shared ownership is strictly necessary
- Never use `std::auto_ptr` (deprecated; use `std::unique_ptr` instead)
- Pass raw pointers or references for non-owning access (no ownership transfer)
- Prefer value semantics (pass/copy by value) when performance is acceptable

## Ownership Principles

"Ownership" is the responsibility for ensuring a dynamically allocated object is deleted when no longer needed. Prefer to keep ownership with the code that allocated it. If other code needs access, pass a copy, a pointer, or a reference without transferring ownership.

**GOOD - Ownership transfer via unique_ptr:**
```cpp
std::unique_ptr<Foo> FooFactory();             // producer: transfers ownership
void FooConsumer(std::unique_ptr<Foo> ptr);    // consumer: takes ownership

auto foo = FooFactory();
FooConsumer(std::move(foo));  // explicit transfer
```

**GOOD - Non-owning access via raw pointer:**
```cpp
class Observer {
 public:
  void OnEvent(const Foo* foo);  // does NOT take ownership
};
```

## Smart Pointer Types

### `std::unique_ptr`

Represents **exclusive ownership** of a dynamically allocated object. Cannot be copied; ownership is transferred via move semantics. The object is deleted when the `unique_ptr` goes out of scope.

- Use for: heap-allocated objects with a single clear owner.
- Performance: zero overhead over raw pointer (when custom deleter is stateless).
- Expresses ownership transfer explicitly in signatures.

```cpp
std::unique_ptr<Widget> MakeWidget() {
  return std::make_unique<Widget>(/* args */);
}

class Container {
  std::unique_ptr<Widget> widget_;
};
```

### `std::shared_ptr`

Represents **shared ownership**. Multiple `shared_ptr` instances can point to the same object; the object is deleted when the last `shared_ptr` is destroyed. Uses reference counting at runtime.

- Use sparingly: shared ownership often indicates a design that could be simpler.
- Acceptable for: immutable objects (`shared_ptr<const Foo>`) where copy avoidance justifies the cost.
- Risk: cyclic references can prevent deletion (use `weak_ptr` to break cycles).
- Cost: reference counting has runtime overhead.

**GOOD - shared_ptr for shared immutable state:**
```cpp
std::shared_ptr<const ExpensiveData> shared_data =
    std::make_shared<const ExpensiveData>(/* args */);
```

### `std::weak_ptr`

A non-owning observer that can check if the object managed by a `shared_ptr` still exists. Used to break cyclic references.

```cpp
std::weak_ptr<Foo> weak_foo = shared_foo;
if (auto locked = weak_foo.lock()) {
  // locked is a shared_ptr to the object (or null if deleted)
  locked->DoSomething();
}
```

### Raw Pointers

Use raw pointers or references for **non-owning access**. A raw pointer signals "I am looking at this object but do not manage its lifetime." Never use raw pointers to express ownership.

**GOOD:**
```cpp
void Process(const Widget* widget) {
  if (widget) widget->DoSomething();
}
```

## Key Rules

1. **Never use `std::auto_ptr`** - it is deprecated and has broken move semantics. Use `std::unique_ptr` instead.
2. **Prefer `std::make_unique` and `std::make_shared`** over `new` - they avoid exception-safety issues and (for shared_ptr) reduce allocations.
3. **Do not design code to use shared ownership without a very good reason** (e.g., significant performance benefit with immutable objects).
4. **Smart pointers do not replace careful ownership design** - they make ownership explicit but don't fix a bad ownership model.

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/cppguide.html
-->
