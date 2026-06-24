---
title: Header Files (Guards, Includes, Forward Declarations)
impact: HIGH
impactDescription: Header hygiene prevents ODR violations, build breaks, and costly compile-time issues.
type: best-practice
tags: [cpp, headers, includes, forward-declarations, build-system]
---

# Header Files

**Impact: HIGH** - Correct header usage directly affects readability, build speed, and correctness across translation units.

## Task List

- Ensure every header is self-contained (compiles on its own, has guards, includes all dependencies).
- Use `#define` guards following the `<PROJECT>_<PATH>_<FILE>_H_` convention.
- Include what you use -- never rely on transitive includes.
- Prefer `#include` over forward declarations for owned and external code.
- Only define short functions (<=10 lines) inline in headers; mark them `inline`.
- Order includes by: related header, C system headers, C++ standard library, other libraries, project headers.
- Separate include groups with blank lines and alphabetize within each group.

## Self-contained Headers

Every `.h` file must compile on its own. Users and tooling should not need special preconditions to include a header. This means:

- The header must have a `#define` guard.
- The header must `#include` everything it needs (no reliance on transitive includes).
- Inline functions and templates that clients instantiate must have their definitions in the header (or in headers it includes). Do NOT use separate `-inl.h` files -- that pattern is deprecated.
- If a file is deliberately *not* self-contained, name it `.inc` and use it sparingly.

## The #define Guard

All headers require a `#define` guard to prevent multiple inclusion. The guard name encodes the full project-relative path:

```
#ifndef FOO_BAR_BAZ_H_
#define FOO_BAR_BAZ_H_

// ... contents ...

#endif  // FOO_BAR_BAZ_H_
```

Format: `<PROJECT>_<PATH>_<FILE>_H_`

## Include What You Use (IWYU)

If a source or header file references a symbol defined elsewhere, it must directly `#include` the header that provides that symbol. Do not rely on transitive inclusions. This rule lets maintainers remove unused `#include`s from headers without breaking clients.

- `foo.cc` must include `bar.h` if it uses a symbol from it, even if `foo.h` already includes `bar.h`.

## Forward Declarations

Avoid forward declarations when possible. Prefer `#include` instead.

**Pros of forward declarations:** Can save compile time and reduce unnecessary recompilation.

**Cons:**
- Hide dependencies, allowing code to skip needed recompilation.
- Break automatic tooling that discovers module ownership.
- Prevent library owners from making otherwise-compatible API changes (e.g., widening a parameter type, adding a defaulted template param).
- Forward declaring symbols from `std::` is undefined behavior.
- Replacing an `#include` with a forward declaration can silently change overload resolution.
- Structuring code to enable forward declarations (e.g., pointer members instead of object members) can make code slower and more complex.

**Decision:**
- Do NOT forward-declare entities your project does not own.
- For owned entities: first try to make the header cheap enough to include directly. Only use forward declarations when justified by measurable slowdowns.

## Defining Functions in Header Files

Only define a function at its point of declaration in a header when the definition is **short** (10 lines or fewer). Longer bodies go in the `.cc` file unless performance or technical constraints force them into the header.

Even when a definition must be in the header, place it in an *internal* part of the file (e.g., a `private` section, a namespace containing `internal`, or below a `// Implementation details only below here` comment).

Any definition placed in a header must be ODR-safe:

- Use the `inline` keyword, or
- Be a function template (implicitly inline), or
- Be defined inside a class body at first declaration.

**GOOD:**
```cpp
template <typename T>
class Foo {
 public:
  int bar() { return bar_; }  // Short -- OK to define inline

  void MethodWithHugeBody();  // Declaration only

 private:
  int bar_;
};

// Implementation details only below here

template <typename T>
void Foo<T>::MethodWithHugeBody() {
  // ... long body ...
}
```

## Names and Order of Includes

Include headers in this exact order, with blank lines between groups:

1. **Related header** -- e.g., `dir2/foo2.h` for `dir/foo2.cc`
2. *(blank line)*
3. **C system headers** (angle brackets with `.h` extension) -- e.g., `<unistd.h>`, `<stdlib.h>`
4. *(blank line)*
5. **C++ standard library headers** (no extension) -- e.g., `<algorithm>`, `<string>`
6. *(blank line)*
7. **Other libraries' headers**
8. *(blank line)*
9. **Your project's headers**

Within each group, sort alphabetically. Use quoted includes for project headers (e.g., `"base/logging.h"`) and angle brackets for system/library headers.

**Example:**
```cpp
#include "foo/server/fooserver.h"

#include <sys/types.h>
#include <unistd.h>

#include <string>
#include <vector>

#include "base/basictypes.h"
#include "foo/server/bar.h"
#include "third_party/absl/flags/flag.h"
```

**Rationale:** Placing the related header first ensures that if it is missing any `#include`s, the build breaks immediately for the author, not for downstream consumers.

**Exception:** System-specific conditional includes can appear after the main block:
```cpp
#include "foo/public/fooserver.h"

#ifdef _WIN32
#include <windows.h>
#endif  // _WIN32
```

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/cppguide.html
-->
