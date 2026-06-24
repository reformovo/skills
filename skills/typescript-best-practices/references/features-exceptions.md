---
title: Exception Handling
impact: MEDIUM
impactDescription: Incorrect exception patterns lose stack traces, hide errors, and harm debuggability across async and sync code paths.
type: best-practice
tags: [typescript, exceptions, error-handling, promises, try-catch]
---

# Exception Handling

**Impact: MEDIUM** - Exception handling affects debuggability, correctness, and code clarity. Proper patterns ensure stack traces are preserved and errors are not silently swallowed.

## Task List

- Use exceptions for exceptional cases; define custom errors when `Error` is insufficient
- Always use `new Error()` when instantiating exceptions (never bare `Error()`)
- Only throw `Error` instances or subclasses (never strings or plain objects)
- Assume all caught errors are `Error` instances (use `assertIsError` pattern)
- Comment empty catch blocks explaining why no action is taken
- Use `assertThrows()` instead of empty catch for expected errors in tests

## Basic Usage

Exceptions are an important part of the language and should be used whenever exceptional cases occur. Prefer throwing exceptions over ad-hoc approaches like passing error-container references or returning objects with error properties.

```typescript
// Good: custom exceptions for rich error information
class ValidationError extends Error {
  constructor(message: string, public readonly field: string) {
    super(message);
  }
}
```

### Instantiate errors using `new`

Always use `new Error()` instead of bare `Error()`. Both produce the same result, but `new` is consistent with how other objects are instantiated.

```typescript
// Good
throw new Error('Foo is not a valid bar.');
```

```typescript
// Bad
throw Error('Foo is not a valid bar.');
```

### Only throw Error instances

Throwing or rejecting with non-`Error` values loses stack trace information, making debugging difficult. This applies to both `throw` and `Promise.reject()`.

```typescript
// Good: only throw Error or subclasses
throw new Error('oh noes!');
throw new MyError('my oh noes!');
Promise.reject(new Error('oh noes!'));
```

```typescript
// Bad: non-Error throws lose stack traces
throw 'oh noes!';
Promise.reject('oh noes!');
Promise.reject();            // undefined rejection value
```

### Catching and rethrowing

Assume all thrown errors are `Error` instances. Do not defensively handle non-`Error` types unless the called API is known to throw them (and comment this). Use `assertIsError` to narrow in catch blocks.

```typescript
// Good: assume Error instances
function assertIsError(e: unknown): asserts e is Error {
  if (!(e instanceof Error)) throw new Error("e is not an Error");
}

try {
  doSomething();
} catch (e: unknown) {
  assertIsError(e);
  displayError(e.message);
  throw e;  // rethrow
}
```

```typescript
// Good: documented exception for known non-Error-throwing API
try {
  badApiThrowingStrings();
} catch (e: unknown) {
  // Note: bad API throws strings instead of errors.
  if (typeof e === 'string') { ... }
}
```

### Empty catch blocks

It is very rarely correct to do nothing in a catch block. When it is, explain why in a comment.

```typescript
// Good: documented intentional no-op
try {
  return handleNumericResponse(response);
} catch (e: unknown) {
  // Response is not numeric. Continue to handle as text.
}
return handleTextResponse(response);
```

```typescript
// Bad: empty catch without explanation
try {
  shouldFail();
  fail('expected an error');
} catch (expected: unknown) {
  // Empty -- use assertThrows() instead
}
```

### Keep try blocks focused

Minimize code inside try blocks to make it obvious which operations may throw. An exception: widening try blocks inside loops is acceptable for performance.

```typescript
// Good: only the throwing operation inside try
let result;
try {
  result = methodThatMayThrow();
} catch (error: unknown) {
  // handle error
}
use(result);
```

```typescript
// Less clear: non-throwing code mixed into try
try {
  const result = methodThatMayThrow();
  use(result);               // use() probably does not throw
} catch (error: unknown) {
  // ...
}
```

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/tsguide.html
-->
