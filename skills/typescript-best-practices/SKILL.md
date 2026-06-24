---
name: typescript-best-practices
description: MUST be used for TypeScript tasks. Based on the Google TypeScript Style Guide. Covers source file structure, imports/exports, modules vs namespaces, classes, constructors, visibility, accessors, functions, arrow functions, this binding, callbacks, event handlers, naming, JSDoc/comments, control flow, equality checks, switch statements, type inference, nullable types, structural typing, interfaces vs type aliases, array types, index signatures, mapped/conditional types, any/unknown, tuple types, wrapper types, variables, arrays/objects, destructuring, spread syntax, type coercion, exceptions, type assertions, disallowed features. Load for any TypeScript code writing, reviewing, or refactoring work.
license: Apache-2.0
metadata:
  author: reformovo
  version: "2026.6.24"
  source: Generated from https://github.com/google/styleguide, scripts located at https://github.com/reformovo/skills
---

> The skill is based on the Google TypeScript Style Guide (tsguide.html) at commit `1809c769de31ba388c755ad15dd057a9ba8531fd`, generated at 2026-06-24.

The Google TypeScript Style Guide is a set of conventions for writing readable, maintainable, and correct TypeScript code. It emphasizes predictability, explicit ownership of types, and leveraging TypeScript's static type system to prevent entire classes of runtime bugs.

## Core Principles

- **Prefer clarity over cleverness:** write code that is easy to read and reason about.
- **Leverage the type system:** use specific types over `any`; prefer `unknown` when type is genuinely unknown.
- **Use modules, not namespaces:** organize code with ES6 imports/exports; never use `namespace` or `require`.
- **Named exports only:** never use default exports; they lack canonical names and cause maintenance issues.
- **Const by default:** use `const` unless a variable needs reassignment; never use `var`.
- **Explicit semicolons:** never rely on automatic semicolon insertion (ASI).
- **Strict equality:** always use `===` and `!==`, except comparisons to `null` literal.

## 1) Confirm the standard before coding (required)

- Default target: TypeScript with strict type checking via the standard tool chain.
- This skill follows the Google TypeScript Style Guide. If the project uses a different style guide, do not apply these rules blindly.

### 1.1 Must-read core references (required)

- Before implementing any TypeScript task, read and apply these core references:
  - `references/core-source-file-structure.md`
  - `references/core-classes.md`
  - `references/core-functions.md`
- Keep these references in active working context for the entire task.

## 2) Apply essential TypeScript foundations (required)

### Source File Structure

- Must-read reference: [core-source-file-structure](references/core-source-file-structure.md)
- UTF-8 encoding; only ASCII horizontal space for whitespace.
- File order: copyright, `@fileoverview` JSDoc, imports, implementation.
- Use named exports only; never use default exports.
- Use ES6 modules, not namespaces; never use `require()` or `/// <reference`.
- Prefer `import type` for type-only imports; `export type` for re-exporting types.

### Classes

- Must-read reference: [core-classes](references/core-classes.md)
- No `#private` fields; use TypeScript `private` visibility annotations.
- Mark properties `readonly` when never reassigned outside constructor.
- Use parameter properties instead of manual initializer plumbing.
- Initialize fields at declaration site; never add/remove properties after constructor.
- Limit visibility as much as possible; never use `public` modifier (except non-readonly parameter properties).
- Getters must be pure functions; never use `Object.defineProperty` for accessors.

### Functions

- Must-read reference: [core-functions](references/core-functions.md)
- Prefer function declarations over arrow functions for named functions.
- Do not use function expressions; use arrow functions instead.
- Only use `this` in class constructors/methods, functions with explicit `this` type, or arrow functions in valid scope.
- Prefer arrow functions as callbacks; avoid passing named callbacks to higher-order functions.
- Use rest parameters instead of `arguments`; never name a variable `arguments`.

## 3) Apply type system rules (required)

### Type Inference

- Must-read reference: [features-type-inference](references/features-type-inference.md)
- Rely on type inference for trivially inferred types; annotate complex expressions.
- Explicit types may be required for empty collections to prevent `unknown` inference.

### Nullable Types

- Must-read reference: [features-nullable-types](references/features-nullable-types.md)
- Do not include `|null` or `|undefined` in type aliases unless actually used.
- Prefer optional fields/parameters (`?`) over `|undefined`.

### Structural Types

- Must-read reference: [features-structural-types](references/features-structural-types.md)
- Use interfaces to define structural types, not classes.
- Prefer interfaces over type literal aliases for object type declarations.

### Type Constructs

- Must-read reference: [features-type-constructs](references/features-type-constructs.md)
- Use `T[]` for simple types, `Array<T>` for complex types.
- Use `Record<Keys, ValueType>` for statically known keys; consider `Map`/`Set` for dynamic keys.
- Use the simplest type construct possible; prefer interface extension over `Pick<T, Keys>`.

### Any and Unknown

- Must-read reference: [features-any-unknown](references/features-any-unknown.md)
- Avoid `any`; prefer specific types, then `unknown`, then suppressed lint with comment.
- Use `unknown` over `any` for genuinely unknown types.
- Do not use `{}` type; prefer `unknown`, `Record<string, T>`, or `object`.
- Do not use wrapper types (`String`, `Boolean`, `Number`) as types; use lowercase primitives.

## 4) Apply language feature rules (required)

### Variables

- Must-read reference: [features-variables](references/features-variables.md)
- Always use `const` or `let`; never use `var`.
- One variable per declaration; no `let a = 1, b = 2`.
- Variables must not be used before declaration.

### Arrays and Objects

- Must-read reference: [features-arrays-objects](references/features-arrays-objects.md)
- Do not use `Array()` or `Object()` constructors; use literals.
- Do not define non-numeric properties on arrays.
- Do not use unfiltered `for...in`; use `for...of` with `Object.keys()`/`Object.entries()`.
- Spread values must match what is being created (arrays: iterables; objects: objects only).

### Type Coercion

- Must-read reference: [features-type-coercion](references/features-type-coercion.md)
- Use `String()`, `Boolean()`, `!!`, or template literals for coercion.
- Use `Number()` to parse numbers; check for `NaN` explicitly.
- Never use unary plus (`+`) to coerce strings to numbers.
- Never use `parseInt`/`parseFloat` except for non-base-10 strings.
- Enum values must not be coerced to booleans; use explicit comparison.

### Exceptions

- Must-read reference: [features-exceptions](references/features-exceptions.md)
- Use `new Error()`, not bare `Error()`.
- Only throw `Error` or subclasses; never throw non-`Error` values.
- Assume all caught errors are `Error` instances unless API is known to throw otherwise.
- Keep try blocks focused; move non-throwing code outside try/catch.

### Type Assertions

- Must-read reference: [features-type-assertions](references/features-type-assertions.md)
- Use `as` syntax, never angle brackets `<Foo>z`.
- Avoid assertions without obvious reason; prefer explicit runtime checks.
- Prefer type annotations (`: Foo`) over assertions (`as Foo`) for object literals.
- Use `unknown` as intermediate type for double assertions.

### Disallowed Features

- Must-read reference: [features-disallowed](references/features-disallowed.md)
- No `const enum`; use plain `enum`.
- No `debugger` statements in production.
- No `with`, `eval`, or `Function(...string)` constructor.
- No modifying builtin objects (prototypes, constructors).
- No `@ts-ignore`/`@ts-expect-error`/`@ts-nocheck`.
- Do not define new decorators; only use framework-provided ones.

## 5) Apply naming and commenting conventions (required)

### Naming

- Must-read reference: [core-naming](references/core-naming.md)
- `UpperCamelCase`: classes, interfaces, types, enums, type parameters.
- `lowerCamelCase`: variables, parameters, functions, methods, properties.
- `CONSTANT_CASE`: global constants, enum values.
- No `_` prefix/suffix on identifiers; no `I` prefix on interfaces.
- Treat abbreviations as whole words: `loadHttpUrl`, not `loadHTTPURL`.

### Comments

- Must-read reference: [core-comments](references/core-comments.md)
- Use `/** JSDoc */` for user-facing documentation; `//` for implementation comments.
- Do not declare types in `@param` or `@return` (redundant in TypeScript).
- Document all top-level exports with JSDoc.
- Place JSDoc before decorators, not between decorator and declaration.

## 6) Apply formatting and control flow rules (required)

### Formatting and Control Flow

- Must-read reference: [core-formatting](references/core-formatting.md)
- Always use braced blocks for control flow, even for single statements.
- Always use `===` and `!==`; exception: comparisons to `null` may use `==`/`!=`.
- Switch statements must have a `default` case (last); non-empty groups must not fall through.
- Explicitly end all statements with semicolons; never rely on ASI.
- Prefer `for...of` for arrays; use `for...in` only on dict-style objects.

## 7) Final self-check before finishing

- Source files use UTF-8 with proper structure (copyright, fileoverview, imports, implementation).
- Named exports only; no default exports; no namespaces; no `require()`.
- Classes use `private`/`readonly` properly; no `#private` fields; no `public` modifier.
- Functions use declarations or arrow functions; no function expressions; no `var`.
- Type system: no `any` without justification; no `{}` type; no wrapper types as types.
- No `const enum`; no `debugger`; no `with`; no `eval`; no `@ts-ignore`.
- Naming follows casing conventions; no `_` prefix/suffix; no `I` interface prefix.
- Strict equality throughout; switch statements have `default`; semicolons are explicit.
- JSDoc on top-level exports; no redundant type annotations in JSDoc.

## Core References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Source File Structure | File encoding, UTF-8, imports, exports, modules vs namespaces, import/export type | [core-source-file-structure](references/core-source-file-structure.md) |
| Classes | Class declarations, methods, constructors, members, visibility, accessors, static methods | [core-classes](references/core-classes.md) |
| Functions | Function declarations, arrow functions, this binding, callbacks, event handlers, parameters | [core-functions](references/core-functions.md) |
| Naming | Identifier casing, descriptive names, constants, aliases, test names | [core-naming](references/core-naming.md) |
| Comments | JSDoc style, tags, documenting exports, parameter comments, documentation before decorators | [core-comments](references/core-comments.md) |
| Formatting | Control flow blocks, switch statements, equality checks, ASI, grouping parentheses | [core-formatting](references/core-formatting.md) |

## Features

### Type System

| Topic | Description | Reference |
|-------|-------------|-----------|
| Type Inference | Type inference guidelines, return type annotations | [features-type-inference](references/features-type-inference.md) |
| Nullable Types | Undefined vs null, nullable type aliases, optional over \|undefined | [features-nullable-types](references/features-nullable-types.md) |
| Structural Types | Structural typing, interfaces vs type literal aliases | [features-structural-types](references/features-structural-types.md) |
| Type Constructs | Array type syntax, index signatures, mapped/conditional types, tuple types | [features-type-constructs](references/features-type-constructs.md) |
| Any and Unknown | any avoidance, unknown over any, {} type, wrapper types, return type only generics | [features-any-unknown](references/features-any-unknown.md) |

### Language Features

| Topic | Description | Reference |
|-------|-------------|-----------|
| Variables | const/let, one variable per declaration, this keyword usage | [features-variables](references/features-variables.md) |
| Arrays and Objects | Array/object literals, spread syntax, destructuring, computed properties, iterating | [features-arrays-objects](references/features-arrays-objects.md) |
| Type Coercion | String/number literals, type coercion, implicit coercion, enum boolean rules | [features-type-coercion](references/features-type-coercion.md) |
| Exceptions | Error instantiation, throwing errors, catching/rethrowing, empty catch, try blocks | [features-exceptions](references/features-exceptions.md) |
| Type Assertions | Type assertions, non-null assertions, double assertions, assertion syntax | [features-type-assertions](references/features-type-assertions.md) |
| Disallowed Features | const enum, debugger, with, eval, non-standard features, modifying builtins, decorators, ts-ignore | [features-disallowed](references/features-disallowed.md) |
