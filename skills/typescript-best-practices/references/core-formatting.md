---
title: Formatting and Control Flow (Blocks, Switch, Equality, ASI)
impact: MEDIUM
impactDescription: Consistent formatting and control flow rules prevent subtle logic errors from fallthrough, type coercion, and ASI surprises.
type: best-practice
tags: [typescript, formatting, control-flow, switch, equality, semicolons]
---

# Formatting and Control Flow

**Impact: MEDIUM** - Control flow and formatting conventions directly prevent logic errors from fallthrough, type coercion, and automatic semicolon insertion.

## Task List

- Always use braced blocks for control flow (`if`, `else`, `for`, `do`, `while`); first statement on its own line.
- Always use `===` and `!==`; exception: `== null` may be used to check both `null` and `undefined`.
- Switch statements must have a `default` case (last); non-empty groups must not fall through.
- Use `as` syntax for type assertions, never angle brackets.
- Prefer explicit runtime checks over type assertions.
- Use `unknown` as the intermediate type for double assertions.
- Prefer type annotations over assertions for object literals.
- Keep try blocks focused; move non-throwing code outside.
- End all statements with explicit semicolons; never rely on ASI.
- Prefer `for...of` for arrays; `for...in` only on dict-style objects.
- Omit grouping parentheses only when no reasonable chance of misinterpretation; never parenthesize the entire expression after `return`, `throw`, `typeof`, `void`, `delete`, `case`, `in`, `of`, or `yield`.

## Control Flow Statements and Blocks

Always use braced blocks for control flow statements, even for single-statement bodies. The first statement must begin on its own line:

```typescript
// Good: braced block
for (let i = 0; i < x; i++) {
  doSomethingWith(i);
}

if (x) {
  doSomethingWithALongMethodNameThatForcesANewLine(x);
}
```

```typescript
// Bad: unbraced, body on wrong line
if (x)
  doSomethingWithALongMethodNameThatForcesANewLine(x);

for (let i = 0; i < x; i++) doSomethingWith(i);
```

**Exception**: Single-line `if` statements may omit the block:

```typescript
if (x) x.doFoo();
```

### Assignment in Control Statements

Avoid assignments inside control statements. If unavoidable, wrap in extra parentheses:

```typescript
// Bad: assignment easily mistaken for equality
if (x = someFunction()) { ... }

// Good: separate assignment
x = someFunction();
if (x) { ... }

// Acceptable: double parens clarify intent
while ((x = someFunction())) { ... }
```

### Iterating Containers

Prefer `for...of` for arrays. `Array.prototype.forEach` and vanilla `for` loops are also allowed:

```typescript
// Preferred
for (const x of someArr) { ... }

// When index is needed
for (let i = 0; i < someArr.length; i++) {
  const x = someArr[i];
  ...
}

// Destructuring with index
for (const [i, x] of someArr.entries()) { ... }
```

`for...in` may only be used on dict-style objects, never on arrays:

```typescript
// Good: for...in on dict-style object
for (const key in obj) {
  if (!obj.hasOwnProperty(key)) continue;
  doWork(key, obj[key]);
}

// Better: prefer Object.keys/values/entries
for (const key of Object.keys(obj)) { ... }
for (const value of Object.values(obj)) { ... }
for (const [key, value] of Object.entries(obj)) { ... }
```

```typescript
// Bad: for...in on array gives indices as strings
for (const x in someArray) {
  // x is the index (string), not the value!
}
```

## Switch Statements

Every `switch` statement must contain a `default` group as the last case:

```typescript
switch (x) {
  case Y:
    doSomethingElse();
    break;
  default:
    // nothing to do.
}
```

Non-empty statement groups must not fall through. Empty groups may fall through:

```typescript
// Good: empty group falls through to non-empty group
switch (x) {
  case X:
  case Y:
    doSomething();
    break;
  default:
    // nothing to do.
}
```

```typescript
// Bad: non-empty group falls through
switch (x) {
  case X:
    doSomething();
    // fall through -- not allowed!
  case Y:
    // ...
}
```

## Equality Checks

Always use `===` and `!==`. The double equality operators cause error-prone type coercions:

```typescript
// Bad: type coercion with ==
if (foo == 'bar' || baz != bam) { ... }

// Good: strict equality
if (foo === 'bar' || baz !== bam) { ... }
```

**Exception**: Comparisons to `null` may use `==`/`!=` to cover both `null` and `undefined`:

```typescript
if (foo == null) {
  // Triggers when foo is null or undefined
}
```

## Type and Non-nullability Assertions

Type assertions (`x as SomeType`) and non-null assertions (`y!`) are unsafe. They silence the compiler without runtime checks. Prefer explicit runtime checks:

```typescript
// Bad: unsafe assertion
(x as Foo).foo();
y!.bar();

// Good: runtime check
if (x instanceof Foo) {
  x.foo();
}
if (y) {
  y.bar();
}
```

When an assertion is necessary, add a clarifying comment:

```typescript
// x is a Foo, because ...
(x as Foo).foo();
```

### Type Assertion Syntax

Must use `as` syntax, never angle brackets:

```typescript
// Good
const x = (z as Foo).length;

// Bad: angle bracket syntax
const y = (<Foo>z).length;
```

### Double Assertions

When you need to assert between unrelated types, use `unknown` as the intermediate:

```typescript
// Good: use unknown, not any or {}
(x as unknown as Foo).fooMethod();
```

### Type Assertions and Object Literals

Use type annotations instead of assertions for object literals to catch refactoring bugs:

```typescript
interface Foo {
  bar: number;
  baz?: string;
}

// Bad: assertion doesn't catch extra properties
const foo = {
  bar: 123,
  bam: 'abc', // no error!
} as Foo;

// Good: annotation catches mismatch at declaration site
const foo: Foo = {
  bar: 123,
  bam: 'abc', // error: "bam" not defined on Foo
};

// Good: return type annotation
function func(): Foo {
  return {
    bar: 123,
    bam: 'abc', // error: "bam" not defined on Foo
  };
}
```

## Keep Try Blocks Focused

Limit code inside try blocks to only the lines that may throw:

```typescript
// Good: only the throwing call is in the try block
let result;
try {
  result = methodThatMayThrow();
} catch (error: unknown) {
  // ...
}
use(result);
```

```typescript
// Less ideal: non-throwing code inside try
try {
  const result = methodThatMayThrow();
  use(result); // if use() doesn't throw, it shouldn't be in try
} catch (error: unknown) {
  // ...
}
```

**Exception**: Widening try blocks to cover a loop body is acceptable for performance.

## Automatic Semicolon Insertion (ASI)

Do not rely on ASI. Explicitly end all statements with semicolons:

```typescript
// Good: explicit semicolons
const foo = 'bar';
doSomething(foo);
return foo;

// Bad: relying on ASI
const foo = 'bar'
doSomething(foo)
return foo
```

## Grouping Parentheses

Optional grouping parentheses should be omitted only when no reasonable chance of misinterpretation exists. Do not assume readers have operator precedence memorized. Never use unnecessary parentheses around the entire expression following `delete`, `typeof`, `void`, `return`, `throw`, `case`, `in`, `of`, or `yield`:

```typescript
// Good: parentheses clarify precedence
const result = (a && b) || (c && d);

// Bad: unnecessary parentheses around entire return expression
return (foo + bar);
throw (new Error('bad'));
typeof (x);
```

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/tsguide.html
-->
