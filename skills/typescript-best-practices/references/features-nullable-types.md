---
title: Nullable Types (Undefined, Null, Optional Fields)
impact: MEDIUM
impactDescription: Inconsistent or deeply propagated null/undefined values cause runtime crashes; disciplined handling keeps code safe and comprehensible.
type: best-practice
tags: [typescript, nullable, undefined, null, optional]
---

# Nullable Types (Undefined, Null, Optional Fields)

**Impact: MEDIUM** - TypeScript supports both `undefined` and `null`. Choosing the right representation and avoiding deep propagation of nullable values prevents subtle runtime bugs.

## Task List

- Use either `undefined` or `null` as appropriate for the context (JS APIs: `undefined`; DOM/Google APIs: `null`)
- Do NOT include `|null` or `|undefined` in type aliases; add nullability at the use site instead
- Deal with null/undefined values close to where they arise
- Prefer optional fields/parameters (`?`) over `|undefined` types
- For class fields, initialize at declaration rather than making them optional

## Undefined vs Null

There is no general preference for one over the other. Follow the conventions of the APIs you interact with:

- JavaScript standard APIs tend to use `undefined` (e.g., `Map.get`)
- DOM and many Google APIs use `null` (e.g., `Element.getAttribute`)

**GOOD - Context-appropriate nullability:**
```typescript
const value = myMap.get(key);              // undefined if missing (JS convention)
const attr = element.getAttribute('href'); // null if missing (DOM convention)
```

## Nullable/Undefined Type Aliases

Type aliases **must not** include `|null` or `|undefined` in the union. This prevents nullability from being silently threaded through many layers. Instead, add `|undefined` or `|null` at the actual use site.

**BAD - Nullability baked into the alias, propagates everywhere:**
```typescript
type CoffeeResponse = Latte | Americano | undefined;

class CoffeeService {
  getLatte(): CoffeeResponse { ... }
  // Callers don't know if/when this might return undefined
}
```

**BETTER - Nullability at the return site, clear to callers:**
```typescript
type CoffeeResponse = Latte | Americano;

class CoffeeService {
  getLatte(): CoffeeResponse | undefined { ... }
  // The undefined is explicit and visible at the declaration
}
```

## Prefer Optional Over `|undefined`

Optional parameters and fields (using `?`) implicitly include `|undefined` but additionally allow callers to omit the value entirely. Use `?` instead of `|undefined`.

**GOOD - Optional fields and parameters:**
```typescript
interface CoffeeOrder {
  sugarCubes: number;
  milk?: Whole | LowFat | HalfHalf;  // Optional field
}

function pourCoffee(volume?: Milliliter) { ... }  // Optional parameter

// Both are valid:
pourCoffee(250);
pourCoffee();    // Omitting is allowed
```

**BAD - Using |undefined instead of optional:**
```typescript
interface CoffeeOrder {
  sugarCubes: number;
  milk: Whole | LowFat | HalfHalf | undefined;  // Must always provide key
}

function pourCoffee(volume: Milliliter | undefined) { ... }
// Caller must explicitly pass undefined: pourCoffee(undefined)
```

**GOOD - Initialize class fields to avoid optionality:**
```typescript
class MyClass {
  field = '';           // Initialized, never optional
  count = 0;            // Initialized, never optional
  items: Item[] = [];   // Initialized, never optional
}
```

**BETTER THAN:**
```typescript
class MyClass {
  field?: string;       // Could be undefined - consumers must check
  count?: number;       // Same problem
  items?: Item[];       // Same problem
}
```

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/tsguide.html#undefined-and-null
-->
