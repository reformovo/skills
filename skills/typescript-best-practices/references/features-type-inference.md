---
title: Type Inference and Return Types
impact: MEDIUM
impactDescription: Thoughtful use of type inference reduces boilerplate while preserving readability; misuse hides type errors or produces opaque code.
type: best-practice
tags: [typescript, type-inference, return-types]
---

# Type Inference and Return Types

**Impact: MEDIUM** - Type inference keeps code concise, but overly relying on it for complex expressions or empty collections can obscure types and delay error detection.

## Task List

- Rely on type inference for trivially inferred types (string literals, number literals, boolean literals, RegExp literals, `new` expressions)
- Add explicit type annotations for complex expressions where the type is not obvious
- Provide explicit type annotations on empty generic collections to prevent inference as `unknown`
- Include return type annotations at author's discretion; reviewers may request them for complex returns
- Projects may adopt a local policy requiring explicit return types on all functions
- Leave out annotations where the type is trivially obvious from the initializer

## Trivially Inferred Types

When a variable or parameter is initialized with a literal or `new` expression, the type is obvious. Leave the annotation out:

**GOOD - Omit annotations for trivially inferred types:**
```typescript
const x = 15;                         // Inferred as number
const name = 'Alice';                  // Inferred as string
const isReady = true;                  // Inferred as boolean
const pattern = /foo\s+/;             // Inferred as RegExp
const map = new Map<string, number>(); // Inference with generic
```

**BAD - Redundant annotations that add no information:**
```typescript
const x: boolean = true;              // 'boolean' is obvious
const x: Set<string> = new Set();     // 'Set<string>' is obvious
const name: string = 'Alice';         // 'string' is obvious
```

## Preventing `unknown` Inference

For generic types initialized with no values (empty arrays, maps, sets), TypeScript may infer type parameters as `unknown`. Provide explicit type arguments:

**GOOD - Explicit generic on empty collection:**
```typescript
const items = new Set<string>();      // Explicit <string> prevents unknown
const configs = new Map<string, Config>();
const arr: string[] = [];
```

**BAD - Empty collection without explicit type:**
```typescript
const items = new Set();              // Inferred as Set<unknown>
const configs = new Map();            // Inferred as Map<unknown, unknown>
```

## Complex Expressions

When the return type of a chain or expression is not immediately obvious, add an explicit annotation for readability:

**GOOD - Annotation clarifies complex expression type:**
```typescript
const value: string[] = await rpc.getSomeValue().transform();
```

**BAD - Reader must mentally evaluate the chain:**
```typescript
const value = await rpc.getSomeValue().transform();
// What type is 'value'?
```

## Return Type Annotations

Return type annotations are optional at the author's discretion. They provide two benefits:

1. **Documentation**: readers can see the contract at a glance.
2. **Error surfacing**: if a code change accidentally alters the return type, TypeScript flags it at the function definition rather than at call sites.

**GOOD - Return type documents intent:**
```typescript
function calculateTax(amount: number): number {
  return amount * 0.08;
}

async function fetchUser(id: string): Promise<User> {
  const response = await api.get(`/users/${id}`);
  return response.data;
}
```

**BAD - Complex return type hidden from readers:**
```typescript
async function fetchUser(id: string) {
  // What type does this return? Reader must trace the chain.
  const response = await api.get(`/users/${id}`);
  return response.data;
}
```

Projects may choose to require return types on all functions as a local policy, but this is not a universal requirement. Reviewers may request annotations for complex or non-obvious return types.

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/tsguide.html#type-inference
-->
