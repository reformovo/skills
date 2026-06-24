---
title: Preprocessor and Miscellaneous Features
impact: MEDIUM
impactDescription: Incorrect use of streams, macros, null constants, sizeof, switches, aliases, and nonstandard extensions can introduce subtle bugs, portability issues, and readability problems.
type: best-practice
tags: [cpp, streams, preprocessor, macros, naming, switch, aliases, inclusive-language]
---

# Preprocessor and Miscellaneous Features

**Impact: MEDIUM** - Guidelines across streams, macros, null pointers, sizeof, switch statements, aliases, and inclusive language prevent subtle bugs and improve code clarity.

## Task List

- Use streams only for ad-hoc, developer-facing I/O; prefer logging libraries and Abseil strings for production output
- Overload `<<` only for value-representing types and only output user-visible values
- Use prefix `++i`/`--i` unless postfix semantics are explicitly needed
- Avoid macros; prefer inline functions, enums, and const variables
- Use `nullptr` for pointers, `'\0'` for chars, never the bare `0` literal
- Prefer `sizeof(varname)` over `sizeof(type)` when tied to a variable
- Avoid `<ratio>`, `<cfenv>`, and `<filesystem>` from the standard library
- Prefer first-party/Abseil libraries over third-party; vet third-party carefully
- Do not use nonstandard compiler extensions unless wrapped in approved portability headers
- Document public aliases with intent; avoid namespace aliases in public headers
- Always annotate fallthrough in switches with `[[fallthrough]]`
- Use inclusive, gender-neutral language in all code and comments

## Streams

Use streams where appropriate, but prefer them only for ad-hoc, local, human-readable output targeted at developers (e.g., debug logging, test diagnostics). Avoid streams for external/user-facing I/O or untrusted data.

**Key restrictions:**
- Avoid stateful stream APIs: `imbue()`, `xalloc()`, `register_callback()`
- Use explicit formatting functions (e.g., `absl::StreamFormat()`) instead of stream manipulators or formatting flags
- Overload `<<` only for types that represent values, writing only the user-visible value
- For debugging internals, use named functions like `DebugString()` instead of `<<`

**Why:** Stream formatting is stateful and persistent; prior mutations affect your code. The `<<` operator overload resolution is computationally expensive and can consume significant compilation time in large codebases.

**GOOD:**
```cpp
// Logging library for diagnostics (preferred over std::cerr/std::clog)
LOG(INFO) << "Processing request: " << request_id;

// Overload << only for value types
std::ostream& operator<<(std::ostream& os, const Point& p) {
  return os << "(" << p.x << ", " << p.y << ")";
}

// Use DebugString() for internal details
std::string DebugString() const;  // exposes implementation details
```

## Preincrement and Predecrement

Use prefix form (`++i`, `--i`) unless postfix semantics are explicitly needed.

**GOOD:**
```cpp
for (int i = 0; i < n; ++i) { ... }
```

**Why:** Prefix form is never less efficient and can be more efficient because it does not require a copy of the value before modification. Postfix form evaluates to the value before modification, which can be confusing when the result is unused.

## Preprocessor Macros

Avoid defining macros, especially in headers. Prefer inline functions, enums, and `const` variables. Never use macros to define pieces of a C++ API.

**Alternatives to macros:**
- Performance-critical code: use `inline` functions
- Constants: use `const` or `constexpr` variables
- Long variable name abbreviation: use a reference
- Conditional compilation: minimize; makes testing difficult

**If macros are unavoidable, follow these rules:**
- Do not define macros in `.h` files
- `#define` right before use, `#undef` right after
- Do not `#undef` existing macros to replace them; pick a unique name
- Avoid macros that expand to unbalanced C++ constructs
- Prefer not using `##` to generate function/class/variable names
- Name with all-caps and a project-specific prefix: `MYPROJECT_MACRO_NAME`

**BAD:**
```cpp
class WOMBAT_TYPE(Foo) {   // macro defining parts of an API
  EXPAND_PUBLIC_WOMBAT_API(Foo)
};
```

## 0 and nullptr/NULL

Use `nullptr` for pointers, `'\0'` for chars. Never use the bare `0` literal for these purposes.

```cpp
int* ptr = nullptr;     // correct
char null_char = '\0';  // correct
int* ptr = NULL;        // bad
int* ptr = 0;           // bad
```

**Why:** `nullptr` provides type-safety. `'\0'` makes the intent (null character) explicit.

## sizeof

Prefer `sizeof(varname)` over `sizeof(type)` when taking the size of a particular variable.

**GOOD:**
```cpp
MyStruct data;
memset(&data, 0, sizeof(data));   // updates automatically if MyStruct changes
```

**BAD:**
```cpp
memset(&data, 0, sizeof(MyStruct));  // must be manually updated
```

**When to use `sizeof(type)`:** Only for code unrelated to any particular variable, such as managing an external data format where a C++ variable of that type is not convenient.

```cpp
if (raw_size < sizeof(int)) {
  LOG(ERROR) << "record too small for count";
  return false;
}
```

## Disallowed Standard Library Features

The following C++ standard library features may not be used:

- `<ratio>` (compile-time rational numbers) -- encourages template-heavy interface style
- `<cfenv>` and `<fenv.h>` -- not reliably supported by compilers
- `<filesystem>` -- insufficient testing support, inherent security vulnerabilities

## Third-party Libraries

When choosing a library, check for an existing solution in your codebase first. Prefer libraries in this order:

1. Abseil
2. C++ standard library (except the disallowed features above)
3. Existing first-party libraries in the codebase
4. Third-party libraries (vet carefully for license compliance, vulnerability monitoring, and breaking changes)

## Nonstandard Extensions

Do not use nonstandard compiler extensions unless they are wrapped in a designated project-wide portability header.

**Examples of disallowed extensions:**
- GCC `__attribute__`
- Intrinsics like `__builtin_prefetch`, SIMD
- `#pragma`
- Inline assembly
- `__COUNTER__`, `__PRETTY_FUNCTION__`
- Compound statement expressions: `foo = ({ int x; Bar(&x); x })`
- Variable-length arrays, `alloca()`
- Elvis operator: `a?:b`

## Aliases

Prefer `using` over `typedef` in new code. Only expose aliases in public API if they are intended for client use. Document the intent of public aliases (whether the alias is guaranteed to be identical to the aliased type, or only compatible in limited ways).

**GOOD:**
```cpp
namespace mynamespace {
// Used to store field measurements. DataPoint may change from Bar* to some internal type.
// Client code should treat it as an opaque pointer.
using DataPoint = ::foo::Bar*;

// A set of measurements. Just an alias for user convenience.
using TimeSeries = std::unordered_set<DataPoint, std::hash<DataPoint>, DataPointComparator>;
}  // namespace mynamespace
```

**BAD:**
```cpp
namespace mynamespace {
using DataPoint = ::foo::Bar*;        // no documentation of intent
using ::std::unordered_set;           // just for local convenience, pollutes API
using ::std::hash;                    // just for local convenience
}  // namespace mynamespace
```

Local convenience aliases are fine in function definitions, `private` sections of classes, internal namespaces, and `.cc` files.

Do not put namespace aliases in your public API.

## Switch Statements

Always include a `default` case in switch statements, unless switching on an enumerated value (the compiler will warn about unhandled values). If the default should never execute, treat it as an error.

**GOOD:**
```cpp
switch (var) {
  case 0: {
    ...
    break;
  }
  case 1: {
    ...
    break;
  }
  default: {
    LOG(FATAL) << "Invalid value in switch statement: " << var;
  }
}
```

**Fallthrough:** Annotate intentional fallthrough with `[[fallthrough]]`. Consecutive case labels without intervening code do not need annotation.

```cpp
switch (x) {
  case 41:
  case 43:           // consecutive labels, no annotation needed
    if (dont_be_picky) {
      [[fallthrough]];
    } else {
      CloseButNoCigar();
      break;
    }
  case 42:
    DoSomethingSpecial();
    [[fallthrough]];
  default:
    DoSomethingGeneric();
    break;
}
```

## Inclusive Language

Use inclusive language in all code, naming, and comments. Avoid terms that may be disrespectful or offensive. Use gender-neutral language unless referring to a specific person.

**Terms to avoid:**
- "master" / "slave"
- "blacklist" / "whitelist"
- "redline"

**Preferred forms:**
- Use "they"/"them"/"their" for people of unspecified gender (even when singular)
- Use "it"/"its" for software, computers, and non-human entities

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/cppguide.html
-->
