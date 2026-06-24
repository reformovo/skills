---
title: Type Coercion and Primitive Literals
impact: MEDIUM
impactDescription: Incorrect type coercion silently masks bugs; consistent literal and coercion rules prevent runtime surprises.
type: best-practice
tags: [typescript, coercion, type-conversion, string-literals, number-literals]
---

# Type Coercion and Primitive Literals

**Impact: MEDIUM** - Type coercion rules prevent subtle NaN bugs, enum truthiness surprises, and unreadable string concatenation patterns.

## Task List

- Use single quotes for string literals; no backslash line continuations
- Prefer template literals over complex string concatenation
- Use `String()` and `Boolean()` (no `new`) or `!!` for explicit coercion
- Never coerce enum values to booleans; use explicit comparison operators
- Use `Number()` to parse numbers and check for `NaN`; never use unary `+`
- Never use `parseInt`/`parseFloat` except for non-base-10; validate input first
- Do not use `!!` in conditional clauses that already have implicit boolean coercion

## String Literals

Delimit ordinary string literals with single quotes (`'`). If the string contains a single quote, use a template literal to avoid escaping.

```typescript
// Good: single quotes
const greeting = 'Hello, world!';
const withApostrophe = `It's done`;  // template literal avoids escaping
```

No line continuations (backslash at end of line). They silently include indentation whitespace.

```typescript
// Bad: line continuation with backslash
const LONG_STRING = 'This is a very long string. \
    It inadvertently contains long stretches of spaces.';
```

```typescript
// Good: string concatenation
const LONG_STRING = 'This is a very long string. ' +
    'It does not contain long stretches of spaces.';
```

Use template literals over complex concatenation. Template literals may span multiple lines.

```typescript
// Good: template literal for expressions
function arithmetic(a: number, b: number) {
  return `Here is a table of arithmetic operations:
${a} + ${b} = ${a + b}
${a} - ${b} = ${a - b}`;
}
```

## Number Literals

Use decimal, hex (`0x`), octal (`0o`), or binary (`0b`) with lowercase letters. No leading zero unless immediately followed by `x`, `o`, or `b`.

```typescript
const decimal = 42;
const hex = 0x1f;
const octal = 0o77;
const binary = 0b1010;
```

## Type Coercion

### Permitted coercion methods

Use `String()`, `Boolean()` (no `new`), template literals, or `!!` to coerce types. Enum values must never be coerced to booleans.

```typescript
// Good: explicit coercion
const bool = Boolean(false);
const str = String(aNumber);
const bool2 = !!str;
const str2 = `result: ${bool2}`;
```

```typescript
// Bad: enum values coerced to boolean (strikingly unintuitive)
enum SupportLevel { NONE, BASIC, ADVANCED }
const level: SupportLevel = ...;
let enabled = Boolean(level);       // false for NONE (coincidentally 0)
let enabled2 = !!level;             // same problem
```

```typescript
// Good: explicit comparison for enums
enum SupportLevel { NONE, BASIC, ADVANCED }
const level: SupportLevel = ...;
let enabled = level !== SupportLevel.NONE;
const maybeLevel: SupportLevel|undefined = ...;
enabled = level !== undefined && level !== SupportLevel.NONE;
```

### Parsing numbers

Use `Number()` to parse numeric strings. Always check for `NaN` (except when failure is impossible). `Number('')`, `Number(' ')`, and `Number('\t')` return `0`, not `NaN`. `Number('Infinity')` returns `Infinity`.

```typescript
// Good: Number() with NaN check
const aNumber = Number('123');
if (isNaN(aNumber)) throw new Error(...);

// Good: integer parsing
let f = Number(someString);
if (isNaN(f)) handleError();
f = Math.floor(f);
```

```typescript
// Bad: unary plus is easy to miss in code reviews
const x = +y;

// Bad: parseInt/parseFloat silently ignore trailing characters
const n = parseInt(someString, 10);  // parses "12 dwarves" as 12
const f = parseFloat(someString);
```

When parsing with a non-base-10 radix is required, validate the input first:

```typescript
if (!/^[a-fA-F0-9]+$/.test(someString)) throw new Error(...);
const n = parseInt(someString, 16);  // radix != 10 is allowed
```

### Implicit coercion

Do not use `!!` in conditional clauses (`if`, `for`, `while`) that already have implicit boolean coercion.

```typescript
// Good: rely on implicit coercion
const foo: MyInterface|null = ...;
if (foo) { ... }
while (foo) { ... }
```

```typescript
// Bad: unnecessary explicit coercion in conditional
const foo: MyInterface|null = ...;
if (!!foo) { ... }
while (!!foo) { ... }
```

Enum values must not be implicitly coerced to booleans either. Always use explicit comparison.

```typescript
// Good: explicit comparison in conditions
if (level !== SupportLevel.NONE) { ... }

// Bad: implicit coercion of enum
if (level) { ... }
```

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/tsguide.html
-->
