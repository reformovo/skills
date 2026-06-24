---
title: Any, Unknown, Wrapper Types, and Related Rules
impact: HIGH
impactDescription: Uncontrolled use of `any` bypasses the entire type system, masking bugs and undermining static analysis; disciplined handling is essential for type safety.
type: best-practice
tags: [typescript, any, unknown, type-safety, wrapper-types]
---

# Any, Unknown, Wrapper Types, and Related Rules

**Impact: HIGH** - `any` disables type checking entirely, making code prone to runtime errors that would otherwise be caught at compile time. Safer alternatives exist for every use case.

## Task List

- Avoid `any`; prefer specific types first, then `unknown`, then suppress lint with documented justification
- Use interfaces, inline object types, type aliases, or generics instead of `any`
- Use `unknown` over `any` for genuinely unknown values (safer -- requires narrowing)
- When `any` is legitimate (e.g., test mocks), suppress the lint warning with an explanatory comment
- Do NOT use the `{}` type; prefer `unknown`, `Record<string, T>`, or `object`
- Never use `String`, `Boolean`, or `Number` as types (use `string`, `boolean`, `number`)
- Never invoke wrapper types (`String`, `Boolean`, `Number`) as constructors with `new`
- Avoid creating APIs with return-type-only generics; always specify generics explicitly when calling such APIs

## The `any` Type -- Avoid

`any` is a supertype and subtype of all types, allowing arbitrary property access. This masks programming errors and undermines static typing.

**HIERARCHY OF PREFERENCES (best to worst):**

1. Provide a more specific type
2. Use `unknown`
3. Suppress the lint warning and document why

### Providing a More Specific Type

**GOOD - Specific types instead of any:**
```typescript
// Use declared interfaces for server-side JSON
declare interface MyUserJson {
  name: string;
  email: string;
}

// Use type aliases for repetitive unions
type MyType = number | string;

// Use inline object types for complex returns
function getTwoThings(): {something: number, other: string} {
  return {something, other};
}

// Use generics for type-agnostic operations
function nicestElement<T>(items: T[]): T {
  // Find the nicest element
}
```

### Using `unknown` Over `any`

`unknown` is safer because it does not allow dereferencing arbitrary properties -- you must narrow the type first.

**GOOD - `unknown` requires narrowing:**
```typescript
const val: unknown = value;

// Must narrow before use:
if (typeof val === 'string') {
  console.log(val.toUpperCase());  // OK - narrowed to string
}
```

**BAD - `any` bypasses all checks:**
```typescript
const danger: any = value;
danger.whoops();  // No type checking at all -- silent failure at runtime
```

### Suppressing `any` Lint Warnings

When `any` is legitimate (test mocks, partial implementations), suppress the warning and add a comment explaining why.

**GOOD - Documented suppression:**
```typescript
// This test only needs a partial implementation of BookService, and if
// we overlooked something the test will fail in an obvious way.
// This is an intentionally unsafe partial mock
// tslint:disable-next-line:no-any
const mockBookService = ({get() { return mockBook; }} as any) as BookService;

// Shopping cart is not used in this test
// tslint:disable-next-line:no-any
const component = new MyComponent(mockBookService, /* unused ShoppingCart */ null as any);
```

## The `{}` Type

`{}` (empty interface) represents any non-nullish value. It is rarely the right choice.

**BAD - `{}` is too unspecific:**
```typescript
function takeAnything(obj: {}) { }  // Accepts any non-null value
takeAnything({ a: 1, b: 2 });
takeAnything('hello');              // Also accepted -- probably not intended
```

**GOOD - Prefer a more specific type:**
```typescript
// Use 'unknown' for genuinely opaque values (includes null/undefined)
function takeUnknown(val: unknown) { }

// Use Record<string, T> for dictionary-like objects
function takeDict(obj: Record<string, number>) { }

// Use 'object' to exclude primitives
function takeObject(obj: object) { }  // Only functions and objects
```

## Wrapper Types

Never use uppercase `String`, `Boolean`, `Number`, or `Object` as types or constructors.

**BAD - Wrapper types in type positions:**
```typescript
let s: String = 'hello';     // Should be string
let b: Boolean = true;       // Should be boolean
let n: Number = 42;          // Should be number
let o: Object = {};          // Should be 'object' or a specific type
```

**GOOD - Lowercase primitive types:**
```typescript
let s: string = 'hello';
let b: boolean = true;
let n: number = 42;
let o: object = {};          // 'object' excludes primitives; use specific types when possible
```

**BAD - Invoking wrapper constructors:**
```typescript
const s = new String('hello');   // Creates a String object, not a primitive
const b = new Boolean(true);     // Creates a Boolean object
const n = new Number(42);        // Creates a Number object
```

**GOOD - Use primitives directly:**
```typescript
const s = 'hello';
const b = true;
const n = 42;
```

## Return Type Only Generics

Avoid designing APIs with return-type-only generics (where the generic only appears in the return type, not the parameters). When using existing APIs of this form, always specify the generic explicitly.

**BAD - Return type only generic (ambiguous inference):**
```typescript
declare function create<T>(): T;  // T cannot be inferred from arguments
const x = create();               // T is unknown
```

**GOOD - Always specify generics explicitly:**
```typescript
const x = create<string>();       // Explicit generic
```

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/tsguide.html#any-type
- https://github.com/google/styleguide/blob/HEAD/tsguide.html#empty-interface-type
- https://github.com/google/styleguide/blob/HEAD/tsguide.html#wrapper-types
- https://github.com/google/styleguide/blob/HEAD/tsguide.html#return-type-only-generics
-->
