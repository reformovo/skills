---
title: Type Assertions and Non-Null Assertions
impact: MEDIUM
impactDescription: Type and non-null assertions silence the compiler without adding runtime checks, leading to runtime crashes if assumptions are wrong.
type: best-practice
tags: [typescript, type-assertions, non-null, as, type-safety]
---

# Type Assertions and Non-Null Assertions

**Impact: MEDIUM** - Assertions bypass type checking at compile time without adding runtime safety. Overuse leads to brittle code that crashes in production.

## Task List

- Prefer runtime checks (`instanceof`, `if (y)`) over type assertions
- Add a comment explaining why an assertion is safe when you must use one
- Use `as` syntax for type assertions (never angle bracket `<Foo>z` syntax)
- Use `unknown` as intermediate for double assertions (not `any` or `{}`)
- Use type annotations (`: Foo`) over assertions (`as Foo`) for object literals to catch refactoring bugs

## Understanding the Risk

Type assertions (`x as SomeType`) and non-nullability assertions (`y!`) only silence the TypeScript compiler. They insert **no runtime checks**. If the assertion is wrong, the program will crash at runtime or silently operate on incorrect data.

```typescript
// Bad: no runtime check; crashes if x is not Foo
(x as Foo).foo();
y!.bar();
```

## Prefer Runtime Checks

When you need to assert a type or non-nullability, the safest approach is to write an explicit runtime check.

```typescript
// Good: runtime check via instanceof
if (x instanceof Foo) {
  x.foo();
}

// Good: runtime null check
if (y) {
  y.bar();
}
```

## Documenting Safe Assertions

Sometimes local code properties make an assertion provably safe. In those cases, add a comment explaining why.

```typescript
// Good: documented safe assertion
// x is a Foo because the factory always returns Foo instances.
(x as Foo).foo();

// y cannot be null because it was just assigned from a non-null source.
y!.bar();
```

If the reasoning is obvious from context (e.g., generated proto code where certain fields are always provided by the backend), comments may not be necessary.

## Type Assertion Syntax

Always use the `as` syntax, never angle brackets. The `as` syntax naturally enforces parentheses when accessing a member of the asserted value.

```typescript
// Good: as syntax with parentheses
const x = (z as Foo).length;
```

```typescript
// Bad: angle bracket syntax (also ambiguous in TSX)
const x = (<Foo>z).length;
const y = <Foo>z.length;   // applies assertion to z.length, not z
```

## Double Assertions

When converting between types that have no overlap, use `unknown` as the intermediate type (never `any` or `{}`).

```typescript
// Good: double assertion through unknown
(x as unknown as Foo).fooMethod();
```

```typescript
// Bad: using any as intermediate (defeats type checking)
(x as any as Foo).fooMethod();
```

## Type Assertions and Object Literals

Use type annotations (`: Foo`) instead of type assertions (`as Foo`) when specifying the type of an object literal. Annotations catch extra or renamed fields during refactoring; assertions silently ignore them.

```typescript
// Good: type annotation catches extra/renamed fields
interface Foo {
  bar: number;
  baz?: string;
}

const foo: Foo = {
  bar: 123,
  bam: 'abc',  // Type error: "bam" not defined on Foo
};

function func(): Foo {
  return {
    bar: 123,
    bam: 'abc',  // Type error: "bam" not defined on Foo
  };
}
```

```typescript
// Bad: type assertion misses refactoring bugs
interface Foo {
  bar: number;
  baz?: string;  // was "bam", but renamed to "baz"
}

const foo = {
  bar: 123,
  bam: 'abc',  // No error! Assertion skips excess property checks
} as Foo;
```

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/tsguide.html
-->
