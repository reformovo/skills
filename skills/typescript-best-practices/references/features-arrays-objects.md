---
title: Arrays and Objects (Literals, Spread, Destructuring, Iteration)
impact: MEDIUM
impactDescription: Consistent array and object patterns prevent subtle bugs from missing type checks, prototype pollution, and destructuring surprises.
type: best-practice
tags: [typescript, arrays, objects, destructuring, spread, iteration]
---

# Arrays and Objects (Literals, Spread, Destructuring, Iteration)

**Impact: MEDIUM** - Array and object patterns are used constantly; getting them wrong causes runtime errors and refactoring hazards.

## Task List

- Never use the `Array()` or `Object()` constructor; use literals or `Array.from`
- Do not define non-numeric properties on arrays; use `Map` or `Object`
- Only spread iterables into arrays, only spread objects into objects
- Use `for...of` with `Object.keys()`/`Object.entries()` instead of unfiltered `for...in`
- Keep object destructuring simple: single level, unquoted, default on left-hand side
- Optional destructured parameters must default to `{}`

## Array Literals

### Do not use the Array constructor

The `Array()` constructor has confusing behavior that varies by argument count and type. Use bracket notation or `Array.from` instead.

```typescript
// Good: bracket notation
const a = [2];
const b = [2, 3];
const c: number[] = [];
c.length = 2;             // Equivalent to Array(2)
Array.from<number>({length: 5}).fill(0);  // [0, 0, 0, 0, 0]
```

```typescript
// Bad: Array constructor is confusing
const a = new Array(2);   // [undefined, undefined]
const b = new Array(2, 3); // [2, 3]
```

### Do not define non-numeric properties on arrays

Arrays should only have numeric indices (and `length`). For key-value mappings, use `Map` or `Object`.

### Spread syntax

When using spread, the value spread must match what is being created. Only spread iterables into arrays; only objects into objects. Primitives (`null`, `undefined`, strings, numbers) must not be spread.

```typescript
// Good: spreading iterables into arrays
const foo = [7];
const bar = [5, ...foo];

// Good: guarding against undefined
const foo = shouldUseFoo ? [7] : [];
const bar = [5, ...foo];
```

```typescript
// Bad: spreading non-iterable
const bar = [5, ...(shouldUseFoo && foo)]; // might spread undefined

// Bad: spreading array into object (creates {0: 'a', 1: 'b', 2: 'c'} with no length)
const fooStrings = ['a', 'b', 'c'];
const ids = {...fooStrings};
```

### Array destructuring

Use array destructuring for unpacking values from arrays/iterables. Omit unused elements with extra commas. Use rest elements (no space between `...` and variable). Specify defaults on the left-hand side. Optional destructured array parameters must default to `[]`.

```typescript
// Good
const [a, b, c, ...rest] = generateResults();
let [, b,, d] = someArray;      // Omit unused elements
function destructured([a = 4, b = 2] = []) { ... }
```

```typescript
// Bad: defaults on the right-hand side instead of left
function badDestructuring([a, b] = [4, 2]) { ... }
```

Prefer object destructuring for function parameters or return values with more than one value, as it allows naming and different types per element.

## Object Literals

### Do not use the Object constructor

Always use object literal syntax (`{}` or `{a: 0, b: 1, c: 2}`) instead of `new Object()`.

### Iterating objects

`for...in` iterates enumerable properties including those from the prototype chain. Never use it unfiltered.

```typescript
// Good: filter with hasOwnProperty or use Object.keys/entries
for (const x in someObj) {
  if (!someObj.hasOwnProperty(x)) continue;
}

for (const x of Object.keys(someObj)) { ... }
for (const [key, value] of Object.entries(someObj)) { ... }
```

```typescript
// Bad: unfiltered for...in picks up prototype properties
for (const x in someObj) {
  // x could come from some parent prototype!
}
```

### Spread syntax

Later values in an object spread replace earlier ones at the same key. Only objects may be spread. Avoid spreading objects with prototypes other than `Object` (class instances, functions) as only enumerable own properties are copied.

```typescript
// Good: last value wins
const foo = {num: 1};
const foo2 = {...foo, num: 5};  // foo2.num === 5

// Good: guard against undefined
const foo = shouldUseFoo ? {num: 7} : {};
const bar = {num: 5, ...foo};
```

### Computed property names

Allowed, but treated as dict-style (quoted) keys unless the computed property is a `Symbol` (e.g. `[Symbol.iterator]`). Do not mix dict-style and non-quoted keys.

### Object destructuring

Keep destructured function parameters simple: single level of unquoted shorthand properties only. No deeper nesting, no computed properties. Provide defaults on the left-hand side. If the whole parameter is optional, default it to `{}`.

```typescript
// Good: simple, single-level, defaults on left, optional defaults to {}
interface Options {
  num?: number;
  str?: string;
}
function destructured({num, str = 'default'}: Options = {}) {}
```

```typescript
// Bad: nested destructuring in parameters
function nestedTooDeeply({x: {num, str}}: {x: Options}) {}
// Bad: non-trivial defaults on the right
function nontrivialDefault({num, str}: Options = {num: 42, str: 'default'}) {}
```

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/tsguide.html
-->
