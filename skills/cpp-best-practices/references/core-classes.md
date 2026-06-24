---
title: Classes - Constructors, Conversions, Copy/Move, Inheritance, and Layout
impact: HIGH
impactDescription: Class design decisions affect correctness, maintainability, and can introduce subtle bugs through slicing, implicit conversions, or improper ownership semantics.
type: best-practice
tags: [cpp, classes, constructors, inheritance, operator-overloading, copy-semantics, move-semantics]
---

# Classes: Constructors, Conversions, Copy/Move, Inheritance, and Layout

**Impact: HIGH** - Correct class design is foundational to C++ correctness and maintainability.

## Task List

- Avoid virtual calls and complex work in constructors
- Mark single-argument constructors and conversion operators `explicit`
- Explicitly declare or delete copy/move operations in the public interface
- Use `struct` only for passive data carriers; use `class` for everything else
- Prefer named `struct` members over `std::pair`/`std::tuple`
- Prefer composition over inheritance; mark overrides with `override`/`final`
- Overload operators only when meaning is obvious and consistent
- Keep data members `private` unless they are constants
- Order class declarations: public, protected, private; types, then data, then functions

## Doing Work in Constructors

Avoid virtual method calls in constructors and initialization that can fail without a way to signal error. Virtual calls in constructors do not dispatch to subclass implementations, even if the class is not currently subclassed (future subclassing can quietly introduce bugs). Constructors cannot signal errors except by crashing or using exceptions.

If complex initialization is needed, prefer a factory function or an explicit `Init()` method. Avoid `Init()` methods on objects with no other state that affects which public methods may be called, as semi-constructed objects are hard to work with correctly.

**BAD:**
```cpp
class Base {
 public:
  Base() { Init(); }  // virtual call in constructor
  virtual void Init() { /* ... */ }
};

class Derived : public Base {
 public:
  Derived() : Base() {}
  virtual void Init() override { /* derived init */ }
};
// Derived::Init() will NOT be called during Derived construction
```

**GOOD:**
```cpp
class Foo {
 public:
  static std::optional<Foo> Create() {
    Foo foo;
    if (!foo.Init()) return std::nullopt;
    return foo;
  }

 private:
  Foo() = default;  // private constructor forces use of factory
  bool Init() { /* ... */ return true; }
};
```

## Implicit Conversions

Mark single-argument constructors and type conversion operators with `explicit` to prevent accidental implicit conversions. Copy and move constructors are exceptions (they should not be `explicit`). Constructors taking `std::initializer_list` may also omit `explicit` to support copy-initialization (e.g., `MyType m = {1, 2};`).

Implicit conversions hide type-mismatch bugs, make code harder to read (especially with overloading), and can cause call-site ambiguities. Always prefer explicit conversions.

**BAD:**
```cpp
class Widget {
 public:
  Widget(int x);  // not explicit - allows implicit int -> Widget conversion
  operator bool() const;  // implicit conversion to bool
};

void Process(Widget w);
Process(42);  // compiles but likely unintended
if (widget) { /* ... */ }  // ambiguous: boolean check or something else?
```

**GOOD:**
```cpp
class Widget {
 public:
  explicit Widget(int x);
  explicit operator bool() const;
};

void Process(Widget w);
Process(Widget{42});  // explicit at call site
```

## Copyable and Movable Types

Every class must clearly indicate whether it is copyable, move-only, or neither. Explicitly declare or delete the appropriate operations in the `public` section:

- **Copyable**: declare copy constructor and copy-assignment operator.
- **Move-only**: declare move constructor and move-assignment operator (copy operations are implicitly deleted).
- **Non-copyable/movable**: delete copy operations; move operations are implicitly disabled.

If you provide a copy or move assignment operator, you must also provide the corresponding constructor.

**GOOD - Copyable:**
```cpp
class Copyable {
 public:
  Copyable(const Copyable& other) = default;
  Copyable& operator=(const Copyable& other) = default;
  // Move operations are implicit but suppressed; declare if more efficient:
  Copyable(Copyable&& other) = default;
  Copyable& operator=(Copyable&& other) = default;
};
```

**GOOD - Move-only:**
```cpp
class MoveOnly {
 public:
  MoveOnly(MoveOnly&& other) = default;
  MoveOnly& operator=(MoveOnly&& other) = default;
  MoveOnly(const MoveOnly&) = delete;
  MoveOnly& operator=(const MoveOnly&) = delete;
};
```

**GOOD - Non-copyable/non-movable:**
```cpp
class NotCopyableOrMovable {
 public:
  NotCopyableOrMovable(const NotCopyableOrMovable&) = delete;
  NotCopyableOrMovable& operator=(const NotCopyableOrMovable&) = delete;
  NotCopyableOrMovable(NotCopyableOrMovable&&) = delete;
  NotCopyableOrMovable& operator=(NotCopyableOrMovable&&) = delete;
};
```

To eliminate slicing risk, make base classes abstract: protected constructors/destructors or pure virtual functions.

## Structs vs. Classes

Use `struct` only for passive data carriers with all public fields, no invariants, and no relationships between fields. Use `class` for everything else. If in doubt, use `class`.

**GOOD - struct:**
```cpp
struct Point {
  double x;
  double y;
};
```

**GOOD - class:**
```cpp
class Rectangle {
 public:
  Rectangle(double w, double h) : width_(w), height_(h) {}
  double Area() const { return width_ * height_; }
 private:
  double width_;
  double height_;
};
```

Stateless types like traits and template metafunctions may use `struct` for consistency with STL.

## Structs vs. Pairs and Tuples

Prefer named structs over `std::pair` or `std::tuple` when elements have meaningful names. Named fields are substantially clearer at read sites than `.first`, `.second`, or `std::get<N>()`.

**BAD:**
```cpp
std::pair<std::string, int> employee;  // what is first? what is second?
```

**GOOD:**
```cpp
struct Employee {
  std::string name;
  int id;
};
```

Pairs and tuples are acceptable in generic code with no specific meaning for elements, or when interoperating with existing APIs.

## Inheritance

Prefer composition over inheritance. When using inheritance, use `public` inheritance only. Multiple implementation inheritance is strongly discouraged.

- Use `override` or `final` (not `virtual`) on all overridden virtual functions.
- Limit `protected` to member functions that subclasses need; data members should remain `private`.
- Use `final` on classes not intended as base classes.

**GOOD:**
```cpp
class Base {
 public:
  virtual ~Base() = default;
  virtual void DoSomething();
};

class Derived final : public Base {
 public:
  void DoSomething() override;  // 'override' not 'virtual'
};
```

## Operator Overloading

Overload operators only when their meaning is obvious, unsurprising, and consistent with built-in operators. Define operators in the same file, `.cc` file, and namespace as the type they operate on.

- Prefer non-member functions for non-modifying binary operators to support implicit conversions on both sides.
- Define `operator==` for equality-comparable types; optionally define `operator<=>`.
- Do NOT overload `&&`, `||`, `,` (comma), unary `&`, or `operator""` (user-defined literals).

**GOOD:**
```cpp
class MyType {
 public:
  // ...
};

bool operator==(const MyType& a, const MyType& b);
std::ostream& operator<<(std::ostream& os, const MyType& obj);
```

## Access Control

**Rule: Data members should be `private`** (unless they are constants). This simplifies reasoning about invariants. Use `const` accessor methods when necessary.

Test fixture classes defined in `.cc` files may use `protected` data members for Google Test compatibility.

## Declaration Order

Within a class definition, use this order:

1. `public:` section first, then `protected:`, then `private:`. Omit empty sections.
2. Within each section, group declarations in this order:
   - Types and type aliases (`typedef`, `using`, `enum`, nested structs/classes, `friend` types)
   - (For structs only) non-static data members
   - Static constants
   - Factory functions
   - Constructors and assignment operators
   - Destructor
   - All other functions (static and non-static member functions, friend functions)
   - All other data members (static and non-static)

Do not put large method definitions inline in the class definition. Only trivial, short, or performance-critical methods should be defined inline.

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/cppguide.html
-->
