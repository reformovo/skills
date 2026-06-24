---
title: Naming Conventions
impact: MEDIUM
impactDescription: Consistent naming immediately communicates what kind of entity an identifier represents without requiring declaration lookup.
type: best-practice
tags: [typescript, naming, conventions]
---

# Naming Conventions

**Impact: MEDIUM** - Consistent naming is the most important consistency rule. It makes code searchable, readable, and self-documenting.

## Task List

- Use only ASCII letters, digits, underscores (constants/test names), and rarely `$`.
- No `_` prefix/suffix for private identifiers; no `I` prefix on interfaces.
- `UpperCamelCase`: classes, interfaces, types, enums, decorators, type parameters.
- `lowerCamelCase`: variables, parameters, functions, methods, properties, module aliases.
- `CONSTANT_CASE`: module-level constants, static readonly, enum values.
- Treat abbreviations as whole words: `loadHttpUrl`, not `loadHTTPURL`.
- Names must be descriptive to a new reader; short names only in limited scope (<=10 lines).
- Module namespace imports use `lowerCamelCase`; file names use `snake_case`.

## Identifiers

Identifiers must use only ASCII letters, digits, underscores (for constants and structured test method names), and rarely `$`.

### Naming Style

TypeScript expresses information in types, so names should not repeat type information:

- No trailing or leading underscores for private properties/methods.
- No `opt_` prefix for optional parameters.
- No `I` prefix or `Interface` suffix on interfaces.
- `$` suffix for Observables is a common convention (consistent within projects):

```typescript
// Good: clear, no decoration
errorCount       // No abbreviation
dnsConnectionIndex  // "DNS" is well-known
referrerUrl      // "URL" is well-known
customerId       // "Id" is ubiquitous

// Observable convention (team-dependent)
const user$: Observable<User> = ...;
```

```typescript
// Bad: meaningless, ambiguous, or decorated
n                // Meaningless
nErr             // Ambiguous abbreviation
cstmrId          // Deletes internal letters
customerID       // Incorrect camelCase of "ID"
```

### Camel Case

Treat abbreviations as whole words: `loadHttpUrl`, not `loadHTTPURL`. Exception for platform names like `XMLHttpRequest`.

### Dollar Sign

Identifiers should not generally use `$`, except for framework conventions and Observable `$` suffix.

## Rules by Identifier Type

| Style | Categories |
|-------|-----------|
| `UpperCamelCase` | class / interface / type / enum / decorator / type parameters / component functions in TSX |
| `lowerCamelCase` | variable / parameter / function / method / property / module alias |
| `CONSTANT_CASE` | global constant values, including enum values |
| `#ident` | never used |

### UpperCamelCase Examples

```typescript
class UrlTable { ... }
interface UserRepository { ... }
type PropertiesMap = Record<string, string>;
enum Color { RED, GREEN, BLUE }
```

### lowerCamelCase Examples

```typescript
const errorCount = 0;
function processData(input: string) { ... }
class Foo {
  private myProperty = '';
  doSomething() { ... }
}
import * as fooBar from './foo_bar';
```

### Type Parameters

Single uppercase character (`T`) or `UpperCamelCase`:

```typescript
function identity<T>(value: T): T { return value; }
class Container<KeyType, ValueType> { ... }
```

### Test Names

Use `_` separators in xUnit-style test frameworks:

```typescript
// xUnit-style
describe('Calculator', () => {
  it('testAdd_whenPositiveNumbers_returnsSum', () => { ... });
  it('testSubtract_whenNegativeResult_throwsError', () => { ... });
});
```

### `_` Prefix/Suffix

Identifiers must not use `_` as a prefix or suffix. The `_` identifier itself must not be used. Use extra commas in destructuring instead:

```typescript
// Good: skip unused elements with commas
const [a, , b] = [1, 5, 10];  // a=1, b=10

// Bad: using _ as identifier
const [a, _] = [1, 5];
```

## Constants

`CONSTANT_CASE` indicates a value is intended never to be changed. Use for module-level constants, `static readonly` class properties, and enum values:

```typescript
// Module-level constant
const UNIT_SUFFIXES = {
  milliseconds: 'ms',
  seconds: 's',
};

// Static readonly in class
class Foo {
  private static readonly MY_SPECIAL_NUMBER = 5;
}

// Enum values
enum Color {
  RED = '#FF0000',
  GREEN = '#00FF00',
  BLUE = '#0000FF',
}
```

Use `lowerCamelCase` if a value can be instantiated more than once (e.g., a local variable within a function):

```typescript
function process() {
  // Bad: this is not a module-level constant
  const MAX_SIZE = 100;

  // Good: local variable uses lowerCamelCase
  const maxSize = 100;
}
```

## Aliases

Local aliases must match the naming format of the source identifier. Use `const` for local aliases, `readonly` for class fields:

```typescript
const {BrewStateEnum} = SomeType;
const CAPACITY = 5;

class Teapot {
  readonly BrewStateEnum = BrewStateEnum;
  readonly CAPACITY = CAPACITY;
}
```

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/tsguide.html
-->
