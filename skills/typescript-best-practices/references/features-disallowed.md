---
title: Disallowed Features and Patterns
impact: HIGH
impactDescription: Several TypeScript/JavaScript features are banned outright due to safety, compatibility, or correctness concerns; violating these rules causes hard-to-debug failures.
type: best-practice
tags: [typescript, disallowed, decorators, const-enum, eval, toolchain, ts-ignore]
---

# Disallowed Features and Patterns

**Impact: HIGH** - These patterns are banned because they cause correctness bugs, security vulnerabilities, or prevent build tools from working reliably.

## Task List

- Only use framework-defined decorators (Angular, Polymer); never define new ones
- Never instantiate `String`, `Boolean`, or `Number` with `new`
- Never use `const enum`; use plain `enum` instead
- Never include `debugger` statements in production code
- Never use `with`, `eval`, or `Function(...string)` constructor
- Never modify builtin prototypes or constructors
- Never use `@ts-ignore`, `@ts-expect-error`, or `@ts-nocheck` (except `@ts-expect-error` rarely in tests)

## Decorators

Do not define new decorators. Only use decorators supplied by frameworks (Angular's `@Component`, `@NgModule`, `@Input`, Polymer's `@property`). Decorators were experimental, have diverged from TC39, and have known bugs that will not be fixed.

```typescript
// Good: framework-defined decorators
/** JSDoc comments go before decorators */
@Component({...})
class MyComp {
  @Input() myField: string;

  @Input()
  myOtherField: string;
}
```

```typescript
// Bad: defining custom decorators
function MyDecorator() { ... }  // Not allowed

// Bad: decorator not immediately preceding symbol (no blank lines between)
@Component({...})

class MyComp { ... }
```

The decorator must immediately precede the decorated symbol with no empty lines. JSDoc goes before the decorator.

## Wrapper Objects for Primitive Types

Never instantiate `String`, `Boolean`, or `Number` with `new`. These wrapper classes have surprising behavior (e.g., `new Boolean(false)` is truthy). They may be called as functions for coercion.

```typescript
// Good: calling as functions for coercion
const str = String(123);
const bool = Boolean(0);
```

```typescript
// Bad: instantiation with new
const s = new String('hello');
const b = new Boolean(false);  // truthy! evaluates to true
const n = new Number(5);
```

## Const Enums

Must not use `const enum`. TypeScript enums already cannot be mutated; `const enum` is an optimization that makes the enum invisible to JavaScript users of the module.

```typescript
// Good: plain enum
enum Color { RED, GREEN, BLUE }
```

```typescript
// Bad: const enum
const enum Color { RED, GREEN, BLUE }
```

## Debugger Statements, with, Dynamic Code Evaluation

```typescript
// Bad: debugger in production code
function debugMe() {
  debugger;
}
```

`with` is banned (hard to understand, illegal in strict mode since ES5).

`eval` and `new Function(...string)` are banned except for code loaders. They are dangerous and incompatible with strict Content Security Policies (CSP).

## Non-Standard Features

Do not use deprecated ECMAScript features, non-standard proposals, or transpiler extensions. Only use features defined in the current ECMA-262 specification. APIs specific to a target runtime (Chrome extensions, Node.js, Electron) are fine.

## Modifying Builtin Objects

Never modify builtin types by adding methods to their constructors or prototypes. Avoid libraries that do this. Do not add symbols to the global object unless absolutely necessary.

```typescript
// Bad: modifying builtins
Array.prototype.myMethod = function() { ... };
String.prototype.reverse = function() { ... };
```

## Toolchain Requirements

All TypeScript files must pass type checking. Do not use `@ts-ignore`, `@ts-expect-error`, or `@ts-nocheck`.

```typescript
// Bad: suppressing type errors hides real problems
// @ts-ignore
const x: number = 'not a number';

// Bad
// @ts-nocheck
// entire file loses type checking
```

`@ts-expect-error` may be used rarely in unit tests, though you should generally avoid it. Prefer casting to the expected type (or `any`) with an explanatory comment instead.

```typescript
// Prefer this over @ts-expect-error in tests
const input = { value: 'test' } as any;
```

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/tsguide.html
-->
