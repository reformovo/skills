---
title: Naming Conventions
impact: MEDIUM
impactDescription: Consistent naming immediately informs readers what kind of entity a name refers to (type, variable, function, constant, macro) without requiring declaration lookup.
type: best-practice
tags: [cpp, naming, conventions]
---

# Naming Conventions

**Impact: MEDIUM** - Consistent naming is the most important consistency rule. It makes code searchable, readable, and self-documenting.

## Task List

- Name things to express purpose, not to save horizontal space
- Match naming scope to descriptiveness (local vars can be short, API names should be descriptive)
- Follow the naming convention table below for each entity type
- Avoid abbreviations that delete internal letters or would be unknown outside the project
- Use inclusive, gender-neutral language in all names
- Prefer `nullptr` for pointers, `'\0'` for chars, never bare `0` literal

## Naming Convention Summary

| Entity Type | Style | Examples |
|-------------|-------|----------|
| File names | `snake_case` or `lowercase` with `-` or `_` | `my_useful_class.cc`, `http_server_logs.h` |
| Type names (classes, structs, enums, type aliases, type template params) | `PascalCase` | `MyExcitingClass`, `UrlTableError`, `PropertiesMap` |
| Concept names | `PascalCase` (same as types) | `Hashable`, `EqualityComparable` |
| Variable names (function params, local variables) | `snake_case` | `table_name`, `num_entries` |
| Class data members | `snake_case_` (trailing underscore) | `table_name_`, `pool_` |
| Struct data members | `snake_case` (no trailing underscore) | `name`, `num_entries` |
| Constant names (`constexpr`/`const` with fixed value, static storage duration) | `k` + `PascalCase` | `kDaysInAWeek`, `kAndroid8_0_0` |
| Function names (ordinary) | `PascalCase` | `AddTableEntry()`, `DeleteUrl()` |
| Accessors/mutators | `snake_case` | `count()`, `set_count()` |
| Namespace names | `snake_case` | `my_namespace` |
| Enumerator names | `k` + `PascalCase` (like constants) | `kOk`, `kOutOfMemory` |
| Template parameter names (type) | `PascalCase` | `T`, `KeyType` |
| Template parameter names (non-type) | `snake_case` or constant style | `size`, `kDefaultSize` |
| Macro names | `ALL_CAPS` with project prefix | `MYPROJECT_ROUND(x)` |
| Aliases | Follow the convention of the aliased entity's category | `DataPoint` (type alias -> PascalCase) |

## Choosing Names

Give names that make purpose and intent understandable to a new reader, even from a different team. Descriptiveness should be proportional to scope of visibility. A free function in a header should mention the library; a local variable in a 5-line function can be short.

**GOOD:**
```cpp
class MyClass {
 public:
  int CountFooErrors(const std::vector<Foo>& foos) {
    int n = 0;  // Clear meaning given limited scope and context
    for (const auto& foo : foos) {
      ++n;
    }
    return n;
  }
  absl::Status DoSomethingImportant() {
    std::string fqdn = ...;  // Well-known abbreviation
    return absl::OkStatus();
  }
 private:
  const int kMaxAllowedConnections = ...;  // Clear meaning within context
};
```

**BAD:**
```cpp
class MyClass {
 public:
  int CountFooErrors(const std::vector<Foo>& foos) {
    int total_number_of_foo_errors = 0;  // Overly verbose for this scope
    for (int foo_index = 0; foo_index < foos.size(); ++foo_index) {  // Use idiomatic `i`
      ++total_number_of_foo_errors;
    }
    return total_number_of_foo_errors;
  }
  Result DoSomethingImportant() {  // "Result" is too generic
    int cstmr_id = ...;  // Deletes internal letters - bad abbreviation
  }
 private:
  const int kNum = ...;  // Unclear meaning at class scope
};
```

**Abbreviation rules:**
- Minimize abbreviations unknown outside the project
- Do not abbreviate by deleting letters within a word
- Capitalize abbreviations as a single word: `StartRpc()`, not `StartRPC()`
- Acceptable abbreviations exist: `i` for loop index, `T` for template parameter

## File Names

All lowercase, with underscores or dashes. Follow project convention; prefer `_` if no established pattern.

```cpp
my_useful_class.cc      // good
my-useful-class.cc      // good (if project uses dashes)
myusefulclass.cc        // acceptable but less readable
myusefulclass_test.cc   // test files use _test suffix
```

- C++ source: `.cc` extension
- Header files: `.h` extension
- Textually included files: `.inc` extension
- Avoid names that exist in `/usr/include` (e.g., `db.h`)
- Be specific: `http_server_logs.h` not `logs.h`

## Type Names

`PascalCase` -- start with capital letter, capital for each new word, no underscores. This applies to classes, structs, type aliases, enums, and type template parameters.

```cpp
class UrlTable { ... };
struct UrlTableProperties { ... };
using PropertiesMap = hash_map<UrlTableProperties*, std::string>;
enum class UrlTableError { ... };
```

## Variable Names

`snake_case` -- all lowercase with underscores between words.

```cpp
std::string table_name;     // good
std::string tableName;      // bad - mixed case
```

**Class data members:** Append trailing underscore.
```cpp
class TableInfo {
 private:
  std::string table_name_;
  static Pool<TableInfo>* pool_;
};
```

**Struct data members:** No trailing underscore.
```cpp
struct UrlTableProperties {
  std::string name;
  int num_entries;
};
```

## Constant Names

Variables declared `constexpr` or `const` whose value is fixed for the program duration use a leading `k` followed by `PascalCase`. Use underscores as separators only when capitalization cannot separate words.

```cpp
const int kDaysInAWeek = 7;
const int kAndroid8_0_0 = 24;  // Android 8.0.0
```

This convention is mandatory for variables with static storage duration and optional for automatic (local) variables.

**BAD:**
```cpp
void ComputeFoo(absl::string_view suffix) {
  const std::string kCombined = absl::StrCat(kPrefix, suffix);  // value changes per invocation
}
```

## Function Names

Ordinarily `PascalCase` for functions.

```cpp
AddTableEntry()
DeleteUrl()
OpenFileOrDie()
```

Accessors and mutators may use `snake_case`:
```cpp
int count() const;
void set_count(int count);
```

Class- and namespace-scope constants exposed as part of an API and intended to look like functions also follow `PascalCase`.

## Namespace Names

`snake_case` -- all lowercase with underscores.

- Top-level namespaces must be globally unique, owned by a single project/team, and named after that project/team
- Code in a namespace should reside in directories matching the namespace name
- Nested namespaces should avoid names of well-known top-level namespaces (especially `std` and `absl`)

## Enumerator Names

Like constants: `k` + `PascalCase`. Do not use macro-style `ALL_CAPS`.

**GOOD:**
```cpp
enum class UrlTableError {
  kOk = 0,
  kOutOfMemory,
  kMalformedInput,
};
```

**BAD:**
```cpp
enum class AlternateUrlTableError {
  OK = 0,
  OUT_OF_MEMORY = 1,  // macro-style, collision risk
};
```

## Template Parameter Names

- Type template parameters: follow type naming rules (`PascalCase`)
- Non-type template parameters: follow variable or constant naming rules

```cpp
template <typename T, typename KeyType>
class MyContainer { ... };

template <int kBufferSize>
class FixedBuffer { ... };
```

## Macro Names

`ALL_CAPS_WITH_UNDERSCORES` with a project-specific prefix. Preferably, do not use macros at all.

```cpp
#define MYPROJECT_ROUND(x) ...
```

## Aliases

The name for an alias follows the naming convention of the aliased entity's category (type alias -> `PascalCase`, variable alias -> `snake_case`).

## Exceptions to Naming Rules

When naming something analogous to an existing C or C++ entity, follow the existing convention:

| Name | Convention Followed |
|------|-------------------|
| `bigopen()` | follows form of `open()` |
| `uint` | follows `typedef` convention |
| `bigpos` | follows form of `pos` |
| `sparse_hash_map` | STL-like entity, STL naming |
| `LONGLONG_MAX` | follows `INT_MAX` convention |

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/cppguide.html
-->
