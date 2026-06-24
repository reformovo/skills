---
title: Integer and Floating-Point Types
impact: HIGH
impactDescription: Wrong integer types cause overflow, portability bugs, and undefined behavior leading to security vulnerabilities.
type: best-practice
tags: [cpp, types, integers, floating-point, portability]
---

# Integer and Floating-Point Types

**Impact: HIGH** - Incorrect integer type selection causes overflow, undefined behavior, and portability bugs. Proper floating-point type selection ensures cross-platform consistency.

## Task List

- Use `int` as the default built-in integer type; do not use `short`, `long`, or `long long`.
- Use exact-width types from `<stdint.h>` (`int16_t`, `int32_t`, `int64_t`, `uint32_t`, etc.) when a specific size is required.
- Use `int64_t` for any value that could exceed 2^31 or for intermediate calculations.
- Avoid unsigned types unless representing bitfields or modular arithmetic.
- Do NOT use unsigned types to assert non-negativity; use assertions instead.
- Use `float` (IEEE-754 binary32) and `double` (IEEE-754 binary64); never use `long double`.
- Use `uintptr_t` for memory addresses stored as integers.
- Use braced-initialization for 64-bit constants.
- Avoid `printf` family; use `absl::StrCat`, `absl::StrFormat`, or `std::ostream` instead.

## Integer Types

### Default: Use `int`

Of the built-in integer types, only `int` should be used directly. Assume `int` is at least 32 bits, but not more than 32 bits.

```cpp
// GOOD: int for loop counters and known-small values
for (int i = 0; i < kLimit; ++i) { ... }
int result = ComputeSimpleValue();
```

### Exact-Width Types from <stdint.h>

Use exact-width types when you need a guaranteed size:

```cpp
#include <stdint.h>

int16_t small_val;   // Exactly 16 bits
int32_t medium_val;  // Exactly 32 bits
int64_t big_val;     // Exactly 64 bits
uint32_t mask;       // Unsigned, exactly 32 bits
```

For values that could be >= 2^31, use `int64_t`. When in doubt, choose a larger type.

```cpp
// GOOD: int64_t for large or unknown magnitudes
int64_t file_size = GetFileSize(path);
int64_t total = AccumulateLargeDataset();
```

Prefer to omit the `std::` prefix on standard integer types (e.g., `int64_t` not `std::int64_t`).

### Unsigned Integers

Avoid unsigned types except for:
- Bitfields / bit patterns
- Modular arithmetic (wrapping overflow)

**Incorrect:** Do not use unsigned to assert non-negativity.

```cpp
// BAD: unsigned to say "never negative"
unsigned int age = GetAge();  // Still wraps on underflow!
if (age < 0) { ... }         // Never true, dead code

// GOOD: signed type + assertion
int age = GetAge();
assert(age >= 0);
```

Mixing signed and unsigned types is a common source of bugs. Prefer iterators and containers over pointers and sizes. Use `size_t` and `ptrdiff_t` where appropriate.

### Integer Conversion

Integer conversions and promotions can cause undefined behavior, leading to security bugs. Use care when converting between types.

```cpp
// Risky: implicit conversion
int x = some_container.size();  // size_t to int, possible truncation

// Better: use the correct type
size_t x = some_container.size();
```

## Floating-Point Types

Only `float` and `double` should be used. Assume they represent IEEE-754 binary32 and binary64 respectively.

```cpp
float f = 3.14f;      // 32-bit IEEE-754
double d = 3.14159;   // 64-bit IEEE-754
```

**NEVER use `long double`** — it gives non-portable results across architectures and compilers.

```cpp
// BAD: non-portable
long double x = 1.0L;

// GOOD: portable
double x = 1.0;
```

## Architecture Portability

Write architecture-portable code. Do not rely on CPU-specific features.

```cpp
// GOOD: braced-initialization for 64-bit constants
int64_t my_value{0x123456789};
uint64_t my_mask{uint64_t{3} << 48};

// GOOD: uintptr_t for memory addresses as integers
uintptr_t addr = reinterpret_cast<uintptr_t>(pointer);

// GOOD: serialization for data exchange (e.g., Protocol Buffers)
// Avoid copying in-memory representation across process boundaries.

// GOOD: type-safe formatting
#include "absl/strings/str_format.h"
absl::PrintF("Value: %d\n", value);
```

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/cppguide.html#Integer_Types
- https://github.com/google/styleguide/blob/HEAD/cppguide.html#Floating-Point_Types
- https://github.com/google/styleguide/blob/HEAD/cppguide.html#Architecture_Portability
-->
