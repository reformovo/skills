---
title: Commenting and JSDoc Conventions
impact: LOW
impactDescription: Consistent commenting practices improve API documentation clarity and prevent stale or misleading annotations.
type: best-practice
tags: [typescript, comments, jsdoc, documentation]
---

# Commenting and JSDoc Conventions

**Impact: LOW** - While important, commenting style rarely causes bugs. Consistency helps tooling and readability.

## Task List

- Use `/** JSDoc */` for user-facing documentation; use `//` for implementation comments.
- Never use `/* */` block comments or boxes drawn with asterisks.
- Use multi-line JSDoc form when content exceeds one line.
- Write JSDoc in Markdown; use proper Markdown formatting for lists, code, etc.
- Do not declare types in `@param` or `@return` (redundant with TypeScript types).
- Do not write `@implements`, `@enum`, `@private`, `@override` when TS keywords are used.
- Document all top-level exports; document non-obvious properties and methods.
- Place JSDoc before decorators, never between decorator and declaration.
- Use `/* paramName= */ value` for parameter name comments at call sites.
- Mark deprecated APIs with `@deprecated` JSDoc; include clear migration directions.

## JSDoc vs Ordinary Comments

- `/** JSDoc */` for documentation users of the code should read (APIs, exported symbols).
- `// line comments` for implementation details only relevant within the code.
- Never use `/* */` block style comments. Multi-line comments must use multiple `//` lines:

```typescript
// Good: implementation comment
// This handles the edge case where the input is empty.
if (input.length === 0) { ... }

// Good: JSDoc for user-facing documentation
/** Returns the user display name. */
export function getDisplayName(user: User): string { ... }
```

```typescript
// Bad: block comment style
/* This should use // instead */

// Bad: boxed comments
/***********
 * bad     *
 ***********/
```

## JSDoc General Form

Multi-line form (content on own lines):

```typescript
/**
 * Multiple lines of JSDoc text are written here,
 * wrapped normally.
 * @param arg A number to do something to.
 */
function doSomething(arg: number) { ... }
```

Single-line form (when it fits):

```typescript
/** This short jsdoc describes the function. */
function doSomething(arg: number) { ... }
```

If a single-line comment overflows, it must use the multi-line form.

## Markdown in JSDoc

JSDoc is written in Markdown and may include HTML when necessary. Use proper Markdown lists instead of relying on visual formatting:

```typescript
/**
 * Computes weight based on three factors:
 *
 * - items sent
 * - items received
 * - last timestamp
 */
function computeWeight() { ... }
```

## JSDoc Tags

Use allowed tags, each on its own line at the beginning of the line:

```typescript
/**
 * The "param" tag must occupy its own line.
 * @param left A description of the left param.
 * @param right A description of the right param.
 */
function add(left: number, right: number) { ... }
```

### Line Wrapping

Wrapped block tags are indented four spaces. Do not indent `@desc` or `@fileoverview` descriptions:

```typescript
/**
 * @param foo This is a param with a particularly long description that just
 *     doesn't fit on one line.
 * @return This returns something with a lengthy description too long to fit
 *     in one line.
 */
```

## Document All Top-Level Exports

Use JSDoc to communicate information to API consumers. Avoid merely restating the property name:

```typescript
// Good: informative
/** The number of milliseconds to wait before retrying. */
export const RETRY_DELAY_MS = 1000;

// Bad: restating the obvious
/** Delay for retry. */
export const RETRY_DELAY_MS = 1000;
```

Document non-obvious properties and methods even if not exported.

## Method and Function Comments

Method descriptions begin with a verb phrase in third person (as if preceded by "This method ..."):

```typescript
/**
 * Posts the request to start coffee brewing.
 * @param amountLitres The amount to brew. Must fit the pot size!
 */
brew(amountLitres: number, logger: Logger) { ... }
```

### Documenting Parameter Properties

Use `@param` JSDoc for constructor parameter properties:

```typescript
/** This class demonstrates how parameter properties are documented. */
class ParamProps {
  /**
   * @param percolator The percolator used for brewing.
   * @param beans The beans to brew.
   */
  constructor(
    private readonly percolator: Percolator,
    private readonly beans: CoffeeBean[],
  ) {}
}
```

## JSDoc Type Annotations

Do not declare types in `@param` or `@return` JSDoc (they are redundant with TypeScript). Do not write `@implements`, `@enum`, `@private`, or `@override` when the corresponding TypeScript keywords are used:

```typescript
// Good: no type in @param
/**
 * POSTs the request to start coffee brewing.
 * @param amountLitres The amount to brew. Must fit the pot size!
 */
brew(amountLitres: number) { ... }

// Bad: redundant type
/**
 * @param {number} amountLitres The amount to brew.
 */
```

## Parameter Name Comments

Use `/* paramName= */ value` format at call sites when the parameter meaning is not obvious:

```typescript
someFunction(obviousParam, /* shouldRender= */ true, /* name= */ 'hello');
```

## Place Documentation Prior to Decorators

JSDoc goes before decorators, not between the decorator and the declaration:

```typescript
// Good
/** Component that prints "bar". */
@Component({
  selector: 'foo',
  template: 'bar',
})
export class FooComponent {}
```

```typescript
// Bad: JSDoc after decorator
@Component({
  selector: 'foo',
  template: 'bar',
})
/** Component that prints "bar". */
export class FooComponent {}
```

## Deprecation

Mark deprecated methods, classes, or interfaces with the `@deprecated` JSDoc annotation. The annotation must include simple, clear directions for fixing call sites:

```typescript
/**
 * @deprecated Use `fetchUser` instead. This method will be removed in v3.
 */
export function getUser(id: string): User { ... }
```

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/tsguide.html
-->
