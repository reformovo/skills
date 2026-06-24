---
title: Structural Types and Interfaces vs Type Aliases
impact: MEDIUM
impactDescription: Correct use of structural typing and interfaces catches type errors at the declaration site rather than far-away call sites, improving debuggability.
type: best-practice
tags: [typescript, structural-types, interfaces, type-aliases]
---

# Structural Types and Interfaces vs Type Aliases

**Impact: MEDIUM** - TypeScript's structural type system catches mismatches at compile time, but declaring types explicitly determines where errors are reported. Using interfaces for object shapes improves error messages, tooling support, and type-checking performance.

## Task List

- When providing a structural-based implementation, explicitly annotate the type at the declaration
- Use interfaces to define structural types, not classes
- Prefer interfaces over type literal aliases for object type declarations
- Do NOT use a class solely to define a structural type
- Declare object literals with their intended type to surface errors at the declaration site

## Structural Typing Model

TypeScript has a structural (duck) type system: a value matches a type if it has at least all the required properties with matching types. This is different from nominal typing (where the name/declaration matters).

**GOOD - Explicit type annotation at declaration site catches errors early:**
```typescript
interface Animal {
  sound: string;
  name: string;
}

function makeSound(animal: Animal) {}

// Error surfaces HERE at declaration - easy to spot and fix:
const horse: Animal = {
  sound: 'neigh',
  // missing 'name' - TypeScript errors right here
};

// Error at call site instead - harder to track down:
const cat = {
  sound: 'meow',
  // missing 'name'
};
makeSound(cat);  // TypeScript error HERE, far from where 'cat' was defined
```

**BAD - Relying on inference pushes errors to call sites:**
```typescript
const badFoo = {
  a: 123,
  b: 'abc',
};
// If this is passed to a function expecting a narrower type,
// the error appears at the call site, not the definition.
```

## Use Interfaces, Not Classes, for Structural Types

Define structural types with `interface`, not with `class`. Classes have runtime cost and imply instantiation semantics, even when used purely for their shape.

**GOOD - Interface for structural type:**
```typescript
interface Foo {
  a: number;
  b: string;
}

const foo: Foo = {
  a: 123,
  b: 'abc',
};
```

**BAD - Class used as a structural type:**
```typescript
class Foo {
  readonly a: number;
  readonly b: number;
}

const foo: Foo = {
  a: 123,
  b: 'abc',
};  // Works structurally, but unnecessarily introduces a class
```

## Prefer Interfaces Over Type Literal Aliases

For declaring object types, use `interface` instead of a `type` alias with an object literal expression:

**GOOD - Interface for object types:**
```typescript
interface User {
  firstName: string;
  lastName: string;
}
```

**BAD - Type alias for object shape:**
```typescript
type User = {
  firstName: string;
  lastName: string;
};
```

**Why:** These forms are nearly equivalent, but choosing `interface` reduces variation. Interfaces also have technical advantages:
- Better error messages (TypeScript's error reporting is clearer for interfaces)
- Better type-checking performance (interfaces are cached and checked faster)
- Better IDE support (find references, rename refactoring work reliably)
- Extends/merges more naturally

> "Honestly, my take is that it should really just be interfaces for anything that they can model. There is no benefit to type aliases when there are so many issues around display/perf." -- TypeScript team lead

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/tsguide.html#use-structural-types
- https://github.com/google/styleguide/blob/HEAD/tsguide.html#prefer-interfaces-over-type-literal-aliases
-->
