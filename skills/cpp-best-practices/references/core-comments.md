---
title: Commenting Conventions
impact: LOW
impactDescription: Good comments improve code maintainability and readability for future contributors, including your future self.
type: best-practice
tags: [cpp, comments, documentation, style]
---

# Commenting Conventions

**Impact: LOW** - Comments are vital for readability but do not affect program correctness. The best code is self-documenting through clear naming.

## Task List

- Include license boilerplate at the top of every file
- Add file-level comments when a header declares multiple user-facing abstractions
- Document every non-obvious class or struct declaration with usage intent
- Document every non-obvious function declaration with what it does and how to use it
- Comment tricky or non-obvious implementation details at the definition site
- Use `TODO` comments for temporary or imperfect code, always with a tracking identifier
- Write comments as proper narrative text with correct punctuation, spelling, and grammar
- Avoid stating the obvious; describe *why* code exists, not *what* it literally does

## Comment Style

Use either `//` or `/* */` syntax, staying consistent. The `//` style is much more common.

## File Comments

Every file must start with the appropriate license boilerplate (Apache 2.0, BSD, LGPL, GPL, etc.).

If a `.h` file declares multiple user-facing abstractions, include a file-level comment describing what the collection is for. Detailed documentation for individual abstractions belongs with those abstractions.

File comments are not needed in `.cc` files that have an associated `.h` file. However, if a `.cc` file has no associated header (e.g., `registered_objects.cc` containing unrelated classes), it must have a file-level comment.

**Author lines:** New files should not contain copyright notice or author lines. If you make significant changes to a file with an author line, consider deleting it.

## Struct and Class Comments

Every non-obvious class or struct declaration should have a comment describing what it is for and how it should be used. Include synchronization assumptions for multithreaded use.

**GOOD:**
```cpp
// Iterates over the contents of a GargantuanTable.
// Example:
//    std::unique_ptr<GargantuanTableIterator> iter = table->NewIterator();
//    for (iter->Seek("foo"); !iter->done(); iter->Next()) {
//      process(iter->key(), iter->value());
//    }
class GargantuanTableIterator {
  ...
};
```

**Guidelines:**
- Provide enough info to know how and when to use the class
- Document any synchronization assumptions
- Include a small usage example where helpful
- Put interface comments with the declaration (`.h`), implementation comments with the definition (`.cc`)

## Function Comments

### Function Declarations

Almost every function declaration should have a comment describing what it does and how to use it. Omit only for trivially obvious functions (e.g., simple accessors). Private methods and functions in `.cc` files are not exempt.

Write comments with an implied subject of *This function* and start with a verb phrase: "Opens the file", not "Open the file".

**Things to document at declaration:**
- What the inputs and outputs are (use `backticks` around argument names for code indexing)
- For member functions: whether the object remembers pointer/reference arguments beyond the call
- For pointer arguments: whether null is allowed and what happens if it is
- For output/input-output arguments: whether state is appended or overwritten
- Performance implications of usage

**GOOD:**
```cpp
// Returns an iterator for this table, positioned at the first entry
// lexically greater than or equal to `start_word`. If there is no
// such entry, returns a null pointer. The client must not use the
// iterator after the underlying GargantuanTable has been destroyed.
//
// This method is equivalent to:
//    std::unique_ptr<Iterator> iter = table->NewIterator();
//    iter->Seek(start_word);
//    return iter;
std::unique_ptr<Iterator> GetIterator(absl::string_view start_word) const;
```

**Overrides:** Focus on specifics of the override rather than repeating the parent comment. Often no additional comment is needed.

**Constructors/destructors:** Document what constructors do with arguments (e.g., taking ownership). Skip trivial destructor comments.

### Function Definitions

Comment how a function does its job when the implementation is tricky. Describe coding tricks, steps, or explain why you chose this approach over alternatives.

Do not just repeat the declaration comment. Briefly summarize *what* but focus on *how*.

## Variable Comments

### Class Data Members

The purpose of each data member must be clear. If the type and name suffice (`int num_events_`), no comment is needed. Otherwise, document invariants, special values, and lifetime requirements.

**GOOD:**
```cpp
private:
  // Used to bounds-check table accesses. -1 means
  // that we don't yet know how many entries the table has.
  int num_total_entries_;
```

### Global Variables

All global variables must have a comment describing what they are, what they are used for, and (if unclear) why they need to be global.

```cpp
// The total number of test cases that we run through in this regression test.
const int kNumTestCases = 6;
```

## Implementation Comments

Comment tricky, non-obvious, interesting, or important parts of your code.

### What to do when function argument meanings are non-obvious

Try these remedies in order of preference:

1. Use a named constant instead of a bare literal
2. Replace `bool` arguments with `enum` arguments (self-describing values)
3. Define a configuration struct/class and pass an instance (reduces argument count, named fields)
4. Replace large/complex nested expressions with named variables
5. As a last resort, use inline comments at the call site

**BAD:**
```cpp
const DecimalNumber product = CalculateProduct(values, 7, false, nullptr);
```

**GOOD:**
```cpp
ProductOptions options;
options.set_precision_decimals(7);
options.set_use_cache(ProductOptions::kDontUseCache);
const DecimalNumber product =
    CalculateProduct(values, options, /*completion_callback=*/nullptr);
```

### Don'ts

Do not state the obvious. Provide higher-level comments that describe *why* the code does what it does, or make the code self-describing.

**BAD:**
```cpp
// Find the element in the vector.  <-- Bad: obvious!
if (std::find(v.begin(), v.end(), element) != v.end()) {
  Process(element);
}
```

**GOOD:**
```cpp
// Process "element" unless it was already processed.
if (std::find(v.begin(), v.end(), element) != v.end()) {
  Process(element);
}
```

**Even better (self-documenting):**
```cpp
if (!IsAlreadyProcessed(element)) {
  Process(element);
}
```

## Punctuation, Spelling, and Grammar

Write comments as readable narrative text with proper capitalization and punctuation. Complete sentences are more readable than sentence fragments. End-of-line comments can be less formal but should be consistent.

Proper punctuation, spelling, and grammar are enforced during code review because they directly affect code clarity.

## TODO Comments

Use `TODO` for code that is temporary, a short-term solution, or good-enough but not perfect. Include the string `TODO` in all caps followed by a tracking identifier.

**Recommended styles (in order of preference):**
```cpp
// TODO: bug 12345678 - Remove this after the 2047q4 compatibility window expires.
// TODO: example.com/my-design-doc - Manually fix up this code the next time it's touched.
// TODO(bug 12345678): Update this list after the Foo service is turned down.
// TODO(John): Use a "*" here for concatenation operator.
```

When the TODO is of the form "do something at a future date," include either a very specific date ("Fix by November 2005") or a very specific event ("Remove this code when all clients can handle XML responses.").

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/cppguide.html
-->
