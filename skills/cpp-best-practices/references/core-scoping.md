---
title: Scoping (Namespaces, Linkage, Variables)
impact: HIGH
impactDescription: Scoping rules prevent linkage errors, name collisions, undefined behavior, and subtle lifetime bugs.
type: best-practice
tags: [cpp, namespaces, scoping, linkage, globals, thread-local]
---

# Scoping

**Impact: HIGH** - Incorrect scoping leads to ODR violations, ambiguous names, static initialization order fiascos, and use-after-free bugs.

## Task List

- Place all code in a project-named namespace; never use `using namespace` directives.
- Use unnamed namespaces or `static` for file-local definitions in `.cc` files; never in `.h` files.
- Prefer nonmember functions in a namespace over global functions; do not use classes just to group static members.
- Declare variables in the narrowest scope possible and initialize at the point of declaration.
- Limit static/global variables to trivially destructible types; prefer `constexpr`.
- Use `thread_local` only with `constinit` for namespace/class-scope variables; prefer function-scope `thread_local`.
- Avoid dynamic initialization of non-local static variables.

## Namespaces

With few exceptions, place code in a namespace. Namespace names should be unique based on the project name and path.

**Rules:**
- Use `namespace my_project { ... }` to wrap the entire source file after includes, gflags, and forward declarations from other namespaces.
- Terminate multi-line namespaces with a comment: `}  // namespace my_project`.
- Prefer single-line nested namespace syntax: `namespace my_project::my_component { ... }`.
- Do NOT use `using namespace foo;` (using-directive) -- it pollutes the namespace.
- Do NOT use inline namespaces (they are only for ABI versioning).
- Do NOT declare anything inside `namespace std` (undefined behavior).
- Namespace aliases in `.h` files are only allowed inside internal-only namespaces or function-local scopes.
- Use `internal` in namespace names to document non-public API parts (e.g., `namespace internal_widget`).

**GOOD:**
```cpp
// foo.h
namespace my_namespace {

class MyClass {
 public:
  void Foo();
};

}  // namespace my_namespace
```

```cpp
// foo.cc
#include "foo.h"

namespace my_namespace {

void MyClass::Foo() {
  // ...
}

}  // namespace my_namespace
```

```cpp
// Nested namespace (preferred in new code)
namespace my_project::my_component {
  // ...
}  // namespace my_project::my_component
```

**BAD:**
```cpp
// Forbidden -- pollutes the namespace
using namespace foo;

// Forbidden -- forward-declaring in std is UB
namespace std {
  class MyType;
}
```

## Internal Linkage

When definitions in a `.cc` file do not need to be referenced outside that file, give them internal linkage by placing them in an unnamed namespace. Functions and variables can also use `static` for the same purpose.

- **Unnamed namespace** is the preferred form for internal linkage in `.cc` files.
- Do NOT use unnamed namespaces or `static` at file scope in `.h` files.

**GOOD:**
```cpp
namespace {
// Only visible within this translation unit
void HelperFunction() { ... }
int kInternalConstant = 42;
}  // namespace
```

## Nonmember, Static Member, and Global Functions

- Prefer nonmember functions inside a namespace over global functions or static members used just for grouping.
- Use completely global functions rarely.
- Do NOT create a class solely to group static member functions -- that is equivalent to a namespace with a different syntax.
- If a nonmember function is only used in one `.cc` file, give it internal linkage (unnamed namespace).

**BAD:**
```cpp
// Unnecessary class for grouping
class StringUtils {
 public:
  static std::string Trim(const std::string& s);
  static std::string ToLower(const std::string& s);
};
```

**GOOD:**
```cpp
namespace string_utils {
std::string Trim(const std::string& s);
std::string ToLower(const std::string& s);
}  // namespace string_utils
```

## Local Variables

Place variables in the narrowest scope possible and initialize them at the point of declaration.

**GOOD:**
```cpp
int i = f();                          // Init at declaration
std::vector<int> v = {1, 2};          // Brace-init instead of push_back
while (const char* p = strchr(s, '/')) {
  s = p + 1;                          // Declared in while condition
}
```

**BAD:**
```cpp
int i;                                // Separate declaration
i = f();                              // ... and assignment

int jobs = NumJobs();
// many lines of code...
f(jobs);                              // Declared far from use

std::vector<int> v;
v.push_back(1);                       // Should use brace init
v.push_back(2);
```

**Caveat:** For objects used inside a hot loop, declaring them outside the loop avoids repeated construction/destruction:
```cpp
// Inefficient -- ctor/dtor called 1M times
for (int i = 0; i < 1000000; ++i) {
  Foo f;
  f.DoSomething(i);
}

// Better -- ctor/dtor called once
Foo f;
for (int i = 0; i < 1000000; ++i) {
  f.DoSomething(i);
}
```

## Static and Global Variables

Objects with static storage duration are **forbidden unless they are trivially destructible**. A trivially destructible type has no user-defined or virtual destructor, and all bases and members are trivially destructible.

**Rule of thumb:** If the declaration could be `constexpr`, it satisfies the requirement.

### Destruction

Only trivially destructible types are allowed at static/global scope. Non-trivial destructors create ordering risks (use-after-free during program exit).

**GOOD (trivially destructible):**
```cpp
const int kNum = 10;                       // Fundamental type
struct X { int n; };
const X kX[] = {{1}, {2}, {3}};           // Trivial struct
constexpr std::array<int, 3> kArray = {1, 2, 3};  // constexpr => trivial
```

**BAD (non-trivial destructor):**
```cpp
const std::string kFoo = "foo";            // Non-trivial dtor
const std::string& kBar = StrCat("a", "b", "c");  // Same rule applies to lifetime-extended temporaries
static std::map<int, int> kData = {{1, 0}, {2, 0}};  // Non-trivial dtor
```

### Initialization

- **Constant initialization** (the initializer is a constant expression) is always allowed. Mark with `constexpr` or `constinit`.
- **Dynamic initialization** of non-local variables is discouraged and generally forbidden, except when no other variable's initialization depends on it:
  ```cpp
  int p = getpid();  // Allowed, as long as nothing else uses p during init
  ```
- **Dynamic initialization of static local variables** is allowed and common.

### Common Patterns for Static/Global Data

| Need | Recommended Approach |
|------|---------------------|
| Global string constant | `constexpr string_view`, character array, or `const char*` pointing to a string literal |
| Static lookup table / set | Plain array of trivial types (linear search is efficient for small collections); sorted array + binary search for larger sets |
| Smart pointer at static scope | Forbidden (non-trivial dtor). Use a plain pointer or a function-local static pointer: `static const auto& impl = *new T(args...);` |
| Custom type constant | Give the type a trivial destructor and `constexpr` constructor |

## thread_local Variables

Prefer `thread_local` over other thread-local storage mechanisms. But follow strict rules to avoid use-after-free and initialization-order bugs.

**Restrictions:**
- `thread_local` variables at namespace or class scope must be initialized with a true compile-time constant and annotated with `constinit`:
  ```cpp
  constinit thread_local Foo foo = ...;
  ```
- `thread_local` variables inside a function have no initialization concerns but still risk use-after-free on thread exit.
- If you need a "namespace-scope" `thread_local` with dynamic initialization, wrap it in a function:
  ```cpp
  Foo& MyThreadLocalFoo() {
    thread_local Foo result = ComplicatedInitialization();
    return result;
  }
  ```

**Destruction hazard:** During thread shutdown, `thread_local` variables are destroyed in reverse order of initialization. If any destructor references another (already-destroyed) `thread_local`, the result is a hard-to-diagnose use-after-free. Prefer trivial types for `thread_local`.

**Cons:**
- Accesses may trigger arbitrary code during thread-start or first use.
- Memory scales with the number of running threads.
- Cannot skip destructors (unlike globals which are cleaned up by the OS on exit), so resource leaks are proportional to thread count.

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/cppguide.html
-->
