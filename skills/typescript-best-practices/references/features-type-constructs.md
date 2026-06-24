---
title: Type Constructs (Array Types, Index Signatures, Mapped/Conditional Types, Tuples)
impact: MEDIUM
impactDescription: Choosing the wrong array type syntax, overusing complex mapped/conditional types, or misusing index signatures reduces readability and tooling support.
type: best-practice
tags: [typescript, array-types, index-signatures, mapped-types, conditional-types, tuples]
---

# Type Constructs (Array Types, Index Signatures, Mapped/Conditional Types, Tuples)

**Impact: MEDIUM** - Consistent array syntax, appropriate use of indexable types, and restraint with advanced type operators keep code readable and maintainable.

## Task List

- Use `T[]` or `readonly T[]` for simple element types (alphanumeric + dot); use `Array<T>` for complex types
- For multi-dimensional arrays, use `T[][]` syntax (not `Array<Array<T>>`)
- Provide meaningful label names in index signatures (e.g., `{[fileName: string]: number}`)
- Consider ES6 `Map`/`Set` instead of objects as associative arrays
- Use `Record<Keys, ValueType>` for statically known keys, not index signatures
- Prefer interface extension over `Pick<T, Keys>` and similar type operators
- Use tuple types instead of hand-rolled Pair interfaces; consider named properties for clarity

## Array Types

**GOOD - Use `T[]` for simple types at each nesting level:**
```typescript
let a: string[];                           // Simple type
let b: readonly string[];                  // Readonly simple type
let c: ns.MyObj[];                         // Namespaced type
let d: string[][];                         // Multi-dimensional
let h: InjectionToken<string[]>;           // Sugar inside generic
let i: ReadonlyArray<string[]>;            // Readonly with sugar for nesting
```

**GOOD - Use `Array<T>` for complex element types:**
```typescript
let e: Array<{n: number, s: string}>;     // Object literal element
let f: Array<string | number>;            // Union element
let g: ReadonlyArray<string | number>;    // Readonly complex
let j: Array<readonly string[]>;          // Mixed: complex outer, sugar inner
```

**BAD - Using `Array<T>` when sugar is clearer:**
```typescript
let a: Array<string>;                     // string[] is shorter
let b: ReadonlyArray<string>;             // readonly string[] is clearer
let d: Array<string[]>;                   // T[][] is more idiomatic
let e: {n: number, s: string}[];          // Hard to read with braces
let f: (string | number)[];               // Parens needed, less clear
```

## Index Signatures

**BAD - Non-descriptive key label:**
```typescript
const users: {[key: string]: number} = ...;
```

**GOOD - Meaningful key label:**
```typescript
const users: {[userName: string]: number} = ...;
```

**CONSIDER - Using `Map` and `Set` instead of objects:**
```typescript
// Instead of {[fileName: string]: number}
const fileSizes = new Map<string, number>();
fileSizes.set('readme.txt', 541);
```

ES6 `Map` and `Set` avoid surprising behaviors of JavaScript objects (inherited keys, `toString` coercion, etc.) and support keys other than `string`.

**Use `Record<Keys, ValueType>` for statically known keys:**
```typescript
type UserRoles = Record<'admin' | 'editor' | 'viewer', boolean>;
// Equivalent to: { admin: boolean; editor: boolean; viewer: boolean; }
```

## Mapped and Conditional Types

These are powerful but come with trade-offs: harder to read, underspecified evaluation model, and tooling limitations (find references won't see properties in `Pick<T, Keys>`).

**PREFER - Simple interface extension over `Pick`:**
```typescript
interface User {
  shoeSize: number;
  favoriteIcecream: string;
  favoriteChocolate: string;
}

// Instead of:
type FoodPreferences = Pick<User, 'favoriteIcecream' | 'favoriteChocolate'>;

// Use:
interface FoodPreferences {
  favoriteIcecream: string;
  favoriteChocolate: string;
}
```

**BETTER - Use nesting or extension to avoid duplication:**
```typescript
interface FoodPreferences {
  favoriteIcecream: string;
  favoriteChocolate: string;
}

interface User extends FoodPreferences {
  shoeSize: number;
}
```

This improves IDE support, enables find-references on properties, and is easier to understand.

## Tuple Types

Use tuple types instead of custom Pair interfaces. However, named properties are often clearer.

**BAD - Hand-rolled Pair interface:**
```typescript
interface Pair {
  first: string;
  second: string;
}

function splitInHalf(input: string): Pair {
  return {first: x, second: y};
}
```

**GOOD - Tuple type:**
```typescript
function splitInHalf(input: string): [string, string] {
  return [x, y];
}

const [leftHalf, rightHalf] = splitInHalf('my string');
```

**BETTER - Named properties when the meaning matters:**
```typescript
function splitHostPort(address: string): {host: string, port: number} {
  // ...
}

const {host, port} = splitHostPort(userAddress);
```

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/tsguide.html#array-type
- https://github.com/google/styleguide/blob/HEAD/tsguide.html#indexable-types-index-signatures
- https://github.com/google/styleguide/blob/HEAD/tsguide.html#mapped-and-conditional-types
- https://github.com/google/styleguide/blob/HEAD/tsguide.html#tuple-types
-->
