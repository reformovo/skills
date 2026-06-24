---
title: Formatting and Style Conventions
impact: LOW
impactDescription: Consistent formatting improves readability across the codebase but does not affect correctness.
type: best-practice
tags: [cpp, formatting, style, whitespace, indentation]
---

# Formatting and Style Conventions

**Impact: LOW** - Enforces consistent layout rules so all contributors can read and understand code easily.

## Task List

- Limit lines to 80 characters; exceptions for URLs, string literals, includes, header guards, and using-declarations.
- Use UTF-8 for non-ASCII characters; prefer hex or Unicode escapes over literal bytes.
- Use only spaces for indentation (2 spaces per level); never use tabs.
- Format function declarations/definitions consistently: return type on same line, parameters aligned, open brace on same line.
- Format lambda expressions like other functions; short lambdas may be inline.
- Write floating-point literals with a radix point and digits on both sides.
- Wrap function calls at the parenthesis or with a 4-space indent for wrapped arguments.
- Format braced initializer lists like function calls.
- Always use braces for controlled statements in loops and branches (except trivial single-line exceptions).
- No spaces around `.` or `->`; pointer/reference type operators attach to the type (left-aligned).
- Break long boolean expressions with operators at end of line; use `&&`/`||` punctuation operators.
- Do not parenthesize return values unnecessarily.
- Use consistent variable initialization; prefer brace initialization to prevent narrowing.
- Keep preprocessor directive `#` at column 0, even inside indented blocks.
- Order class sections: `public`, `protected`, `private`; indent access specifiers 1 space.
- Constructor initializer lists: colon on wrapped line, 4-space indent, members aligned.
- Do not indent namespace contents.
- Use horizontal whitespace consistently: around binary operators, after keywords, before braces.
- Use vertical whitespace sparingly, like paragraph breaks.

## Line Length

Each line must be at most 80 characters.

**Exceptions** (may exceed 80 chars):
- Comment lines with example commands or URLs that cannot be split.
- String literals containing URIs, embedded languages, or significant newlines (place at namespace scope near top of file; use `// clang-format off` if needed).
- Include statements, header guards, and using-declarations.

## Non-ASCII Characters

Non-ASCII characters must use UTF-8 encoding. Keep them rare -- hard-code user-facing text in source files only when necessary (e.g., unit tests, data file delimiters).

- Prefer hex or Unicode escapes (`\xEF\xBB\xBF` or `\uFEFF`) for readability.
- Avoid the `u8` prefix (semantics differ across C++17/20/23).
- Do not use `char16_t` or `char32_t`; avoid `wchar_t` except when interacting with the Windows API.

## Spaces vs. Tabs

Use only spaces. Indent 2 spaces at a time. Configure your editor to emit spaces on the tab key.

## Function Declarations and Definitions

Return type on the same line as function name; parameters on the same line if they fit within 80 characters.

```cpp
ReturnType ClassName::FunctionName(Type par_name1, Type par_name2) {
  DoSomething();
}
```

**Wrapping rules:**
- If parameters overflow, wrap with 4-space indent:

```cpp
ReturnType LongClassName::ReallyReallyReallyLongFunctionName(
    Type par_name1,  // 4 space indent
    Type par_name2,
    Type par_name3) {
  DoSomething();  // 2 space indent
}
```

- Open parenthesis always on the same line as function name.
- No space between function name and `(`.
- No space between parentheses and parameters.
- Open brace `{` on the last line of the declaration (not on its own line).
- Space between `)` and `{`.
- Break between return type and function name if they do not fit on one line; do not indent the return type.
- Wrapped parameters: 4-space indent. Default body: 2-space indent.
- Unused parameters should have their name commented out in the definition:

```cpp
void Circle::Rotate(double /*radians*/) {}
```

- Attributes/macros that expand to attributes appear before the return type:

```cpp
ABSL_ATTRIBUTE_NOINLINE void ExpensiveFunction();
[[nodiscard]] bool IsOk();
```

## Lambda Expressions

Format parameters and bodies as any other function. Capture lists follow comma-separated format.

```cpp
int x = 0;
auto x_plus_n = [&x](int n) -> int { return x + n; };
```

Short lambdas may be written inline as function arguments:

```cpp
digits.erase(std::remove_if(digits.begin(), digits.end(), [&to_remove](int i) {
               return to_remove.contains(i);
             }),
             digits.end());
```

- No space between `&` and the captured variable name in by-reference captures.

## Floating-point Literals

Always include a radix point with digits on both sides, even in exponential notation.

```cpp
float f = 1.0f;       // GOOD: radix point with digits both sides
double d = 1248.0e6;  // GOOD
long double ld = -0.5L;  // GOOD

float f = 1.f;        // BAD: no digit after '.'
double d = 1248e6;    // BAD: no radix point
long double ld = -.5L; // BAD: no digit before '.'
```

- Initializing with an integer literal is fine when the type can represent it exactly (`float f3 = 1;`).

## Function Calls

Single-line call if it fits:

```cpp
bool result = DoSomething(argument1, argument2, argument3);
```

When wrapping, align subsequent arguments with the first argument:

```cpp
bool result = DoSomething(averyveryveryverylongargument1,
                          argument2, argument3);
```

Alternatively, place all arguments on subsequent lines indented 4 spaces:

```cpp
bool result = DoSomething(
    argument1, argument2,  // 4 space indent
    argument3, argument4);
```

Group multiple arguments per line to reduce line count, unless readability suffers. For complex arguments, extract a named variable or add an inline comment.

Structure-related arguments may be formatted to match their logical structure:

```cpp
my_widget.Transform(x1, x2, x3,
                    y1, y2, y3,
                    z1, z2, z3);
```

## Braced Initializer List Format

Format like a function call in the same position. If the braced list follows a name, treat `{}` as `()` of a function call with that name. If there is no name, assume a zero-length name.

```cpp
return {foo, bar};
functioncall({foo, bar});
std::pair<int, int> p{foo, bar};

// Wrapped:
SomeFunction(
    {"assume a zero-length name before {"},
    some_other_function_parameter);
```

## Looping and Branching Statements

Components separated by single spaces. No spaces inside condition parentheses.

```cpp
if (condition) {
  DoOneThing();
} else if (int a = f(); a != 3) {
  DoAThirdThing(a);
} else {
  DoNothing();
}

while (condition) {
  RepeatAThing();
}

for (int i = 0; i < 10; ++i) {
  RepeatAThing();
}
```

**Braces:** Always use braces for controlled statements.

**Discouraged exception** (single-line or two-line trivial bodies only):

```cpp
if (x == kFoo) { return new Foo(); }  // OK: single-line
if (x == kFoo) return new Foo();       // OK: single-line, no braces
if (x == kBar)                          // OK: two-line, no braces
  Bar(arg1, arg2, arg3);
```

This exception does NOT apply to `if...else` or `do...while` -- those always require braces.

`switch` case blocks use 2-space indent for `case`, 4-space for body:

```cpp
switch (var) {
  case 0: {  // 2 space indent
    Foo();   // 4 space indent
    break;
  }
  default: {
    Bar();
  }
}
```

Empty loop bodies: use `{}` or `continue`, never a bare semicolon:

```cpp
while (condition) {}         // GOOD
while (condition) continue;  // GOOD
while (condition);           // BAD: looks like do-while
```

## Pointer and Reference Expressions and Types

- No spaces around `.` or `->` when accessing members.
- No space after `*` or `&` in expressions (dereference/address-of).
- In type declarations, `*`/`&` attaches to the type (no space before, space after):

```cpp
char* c;
const std::string& str;
int* GetPointer();
std::vector<char*>  // note: no space between '*' and '>'
```

- Do not declare multiple variables in the same declaration if any have pointer/reference decorations:

```cpp
int x, y;      // OK: no pointers
int x, *y;     // BAD: mixed
int* x, *y;    // BAD: multiple pointers in one declaration
char * c;      // BAD: spaces on both sides of '*'
```

## Boolean Expressions

When wrapping, keep operators at the end of the line. Either `&&` at end (preferred) or at beginning is acceptable, but be consistent.

```cpp
if (this_one_thing > this_other_thing &&
    a_third_thing == a_fourth_thing &&
    yet_another && last_one) {
  ...
}
```

- Use punctuation operators (`&&`, `||`, `~`) not word operators (`and`, `or`, `compl`).
- Add parentheses judiciously for readability.

## Return Values

Do not parenthesize unnecessarily:

```cpp
return result;                  // GOOD
return (some_long_condition &&  // OK: complex expression
        another_condition);

return (value);    // BAD: no reason for parens
return(result);    // BAD: return is not a function
```

## Variable and Array Initialization

`=`, `()`, and `{}` are all acceptable:

```cpp
int x = 3;
int x(3);
int x{3};
std::string name = "Some Name";
std::string name("Some Name");
std::string name{"Some Name"};
```

Beware of `std::initializer_list` constructors -- a non-empty braced-init-list prefers that constructor:

```cpp
std::vector<int> v(100, 1);  // 100 elements: all 1s
std::vector<int> v{100, 1};  // 2 elements: 100 and 1
```

Brace initialization prevents narrowing conversions:

```cpp
int pi(3.14);    // OK: pi == 3 (narrowing allowed)
int pi{3.14};    // Compile error: narrowing conversion
```

## Preprocessor Directives

The `#` must always be at column 0, even inside indented blocks:

```cpp
  if (lopsided_score) {
#if DISASTER_PENDING      // Correct: at column 0
    DropEverything();
# if NOTIFY               // OK: spaces after # are allowed
    NotifyClient();
# endif
#endif
    BackToNormal();
  }
```

## Class Format

Sections in `public`, `protected`, `private` order. Access specifiers indented 1 space.

```cpp
class MyClass : public OtherClass {
 public:      // 1 space indent
  MyClass();  // 2 space indent (regular)
  explicit MyClass(int var);
  ~MyClass() {}

  void SomeFunction();

 private:
  bool SomeInternalFunction();

  int some_var_;
  int some_other_var_;
};
```

- Base class name on same line as subclass name.
- Access specifiers preceded by a blank line (optional in small classes).
- No blank line after access specifiers.
- `public` first, then `protected`, then `private`.

## Constructor Initializer Lists

All on one line if it fits:

```cpp
MyClass::MyClass(int var) : some_var_(var) {
  DoSomething();
}
```

If wrapping, colon goes on the new line with a 4-space indent:

```cpp
MyClass::MyClass(int var)
    : some_var_(var), some_other_var_(var + 1) {
  DoSomething();
}
```

Multiple initializer lines should align:

```cpp
MyClass::MyClass(int var)
    : some_var_(var),             // 4 space indent
      some_other_var_(var + 1) {  // aligned
  DoSomething();
}
```

## Namespace Formatting

Namespace contents are NOT indented:

```cpp
namespace {

void foo() {  // Correct: no extra indentation
  ...
}

}  // namespace
```

## Horizontal Whitespace

**General rules:**
- Two spaces before end-of-line comments.
- Space before `{` (open brace).
- No space before `;`.
- Spaces inside braced-init-list `{ }` is optional; be consistent on both sides.
- No trailing whitespace at end of line.

**Loops and conditionals:**
- Space after keyword: `if (b) {`, `while (test)`, `for (int i = 0; ...)`.
- Space around `else`.
- No spaces inside parentheses by default; spaces inside are rare but allowed if consistent.
- Space after semicolons in `for`.
- Space before and after colon in range-based `for: `for (auto x : counts)`.
- No space before colon in `case`. Space after colon if code follows: `case 2: break;`.

**Operators:**
- Spaces around assignment operators: `x = 0`.
- Spaces around binary operators (optional around multiplicative factors): `v = w * x + y / z`.
- No spaces between unary operators and their arguments: `x = -5; ++x;`.
- No spaces inside parentheses for grouping: `v = w * (x + z)`.

**Templates and casts:**
- No spaces inside angle brackets: `std::vector<std::string>`.
- No space before `<`: `std::vector<std::string>`.
- No space between `>` and `(` in a cast: `static_cast<char*>(x)`.
- No space between type and pointer in template parameters: `std::vector<char*>`.

## Vertical Whitespace

Use blank lines sparingly -- like paragraph breaks in prose. Do not add blank lines where indentation already provides clear structure (e.g., at start or end of a code block). Use them to separate closely related chunks of code.

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/cppguide.html
-->
