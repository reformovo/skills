---
title: Source File Structure (Encoding, Imports, Exports, Modules)
impact: HIGH
impactDescription: Proper file structure and import/export hygiene prevents subtle bugs, build breaks, and maintenance issues across the codebase.
type: best-practice
tags: [typescript, imports, exports, modules, file-structure]
---

# Source File Structure

**Impact: HIGH** - File structure conventions affect readability, build correctness, and long-term maintainability across the entire codebase.

## Task List

- Encode all source files in UTF-8; use only ASCII horizontal space (0x20) for whitespace.
- Order file sections: copyright, `@fileoverview` JSDoc, imports, implementation -- each separated by exactly one blank line.
- Use named exports only; never use default exports.
- Use ES6 module syntax (`import`/`export`), never `namespace`, `require()`, or `/// <reference`.
- Prefer `import type` for type-only imports; prefer `export type` for re-exported types.
- Prefer relative imports for same-project files; prefer namespace imports for large APIs.

## File Encoding: UTF-8

All source files are encoded in UTF-8. The only whitespace character allowed outside string literals is the ASCII horizontal space (0x20). All other whitespace characters must use their special escape sequences (`\n`, `\t`, `\r`, `\b`, `\f`, `\v`). Non-ASCII characters should use the actual Unicode character rather than escapes when readability is clear:

```typescript
// Good: clear even without a comment
const units = 'μs';

// Good: use escapes for non-printable characters
const output = '\ufeff' + content;  // byte order mark
```

```typescript
// Bad: hard to read
const units = '\u03bcs';

// Bad: unclear what this is
const output = '\ufeff' + content;
```

## Source File Structure

Files must contain sections in this exact order, separated by exactly one blank line:

1. **Copyright information** (if present) -- in a JSDoc at the top
2. **`@fileoverview` JSDoc** (if present) -- provides file-level documentation
3. **Imports** (if present)
4. **File implementation**

```typescript
/**
 * Copyright 2024 The Foo Authors.
 */

/**
 * @fileoverview Description of file. Lorem ipsum dolor sit amet.
 */

import * as foo from './foo';
import {Bar} from './bar';

// Implementation
export function doSomething() { ... }
```

## Imports

There are four import variants in ES6/TypeScript:

```typescript
// Module (namespace) import
import * as ng from '@angular/core';

// Named import -- preferred for frequently-used symbols
import {Foo} from './foo';

// Default import -- only for external code that requires it
import Button from 'Button';

// Side-effect import -- only for libraries with load-time side effects
import 'jasmine';
import '@polymer/paper-button';
```

### Import Paths

Use relative imports (`./foo`) for files within the same logical project. Rooted imports (`path/from/root`) are also permitted. Prefer relative imports to allow project relocation without changes:

```typescript
import {Symbol1} from 'path/from/root';
import {Symbol2} from '../parent/file';
import {Symbol3} from './sibling';
```

### Namespace vs Named Imports

**Prefer named imports** for symbols used frequently or with clear names (e.g., `describe`, `it`). **Prefer namespace imports** when using many different symbols from large APIs to avoid long import lines:

```typescript
// Bad: overlong named imports
import {Item as TableviewItem, Header as TableviewHeader, Row as TableviewRow,
  Model as TableviewModel, Renderer as TableviewRenderer} from './tableview';

// Good: use namespace import for large APIs
import * as tableview from './tableview';
let item: tableview.Item | undefined;
```

```typescript
// Bad: namespace import obscures common functions
import * as testing from './testing';
testing.describe('foo', () => {
  testing.it('bar', () => { ... });
});

// Good: named imports for common functions
import {describe, it, expect} from './testing';
describe('foo', () => {
  it('bar', () => { ... });
});
```

### Renaming Imports

Fix name collisions with namespace imports or renaming. Use `import {SomeThing as SomeOtherThing}` when needed for clarity, generated names, or collision avoidance.

## Exports

### Named Exports Only

Always use named exports; never use default exports:

```typescript
// Good: named export
export class Foo { ... }

// Bad: default export -- no canonical name, maintenance burden
export default class Foo { ... }
```

Default exports allow inconsistent import names and hide refactoring errors:

```typescript
import Foo from './bar';  // Legal
import Bar from './bar';  // Also legal -- both refer to the same default export
```

Named exports error when attempting to import a non-existent symbol, providing earlier failure detection.

### Export Visibility

Only export symbols used outside the module. Minimize the exported API surface:

```typescript
// Good: only export what's needed externally
export function publicApi() { ... }
// Not exported: internal helper
function privateHelper() { ... }
```

### Mutable Exports

Do not use mutable exports (`export let`). Use explicit getter functions instead:

```typescript
// Bad: export let creates confusing cross-module behavior
export let foo = 3;

// Good: explicit getter
let foo = 3;
export function getFoo() { return foo; }
```

### Container Classes

Do not use container classes with static methods for namespacing. Export individual constants and functions:

```typescript
// Bad: container class as namespace
export class Container {
  static FOO = 1;
  static bar() { return 1; }
}

// Good: individual exports at module scope
export const FOO = 1;
export function bar() { return 1; }
```

## Import and Export Type

Use `import type` for symbols used only as types. Use `export type` when re-exporting types. This enables file-by-file transpilation under `isolatedModules`:

```typescript
import type {Foo} from './foo';
import {Bar} from './foo';

// Inline type import (combines type and value imports)
import {type Foo, Bar} from './foo';

// Type-only re-export
export type {AnInterface} from './foo';
```

## Use Modules, Not Namespaces

Never use `namespace`, `require()`, or `/// <reference`. Always use ES6 module syntax:

```typescript
// Bad: namespace
namespace Rocket {
  function launch() { ... }
}

// Bad: /// <reference>
/// <reference path="..."/>

// Bad: require()
import x = require('mydep');

// Good: ES6 module
import {launch} from './rocket';
```

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/tsguide.html
-->
