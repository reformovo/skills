---
title: Functions (Declarations, Arrow Functions, This Binding, Parameters)
impact: MEDIUM
impactDescription: Consistent function patterns improve readability, prevent this-binding bugs, and clarify intent at call sites.
type: best-practice
tags: [typescript, functions, arrow-functions, this, callbacks, parameters]
---

# Functions

**Impact: MEDIUM** - Function style directly affects readability, call-site safety, and `this` binding correctness.

## Task List

- Prefer function declarations for named functions.
- Never use function expressions; use arrow functions instead (exception: rebinding `this`, generators).
- Only use concise arrow body when return value is used; prefer block body otherwise.
- Never use `this` outside class constructors/methods, explicit `this`-typed functions, or valid arrow scopes.
- Avoid `bind`, `self = this`, and passing named callbacks to higher-order functions.
- Use rest parameters instead of `arguments`; use function spread instead of `apply`.
- Parameter initializers must not have side effects; use sparingly.

## Terminology

- **Function declaration**: a declaration using the `function` keyword: `function foo() {}`
- **Function expression**: an expression using the `function` keyword: `const f = function() {};`
- **Arrow function**: an expression using `=>` syntax: `const f = () => {}`
- **Block body**: arrow with braces: `(x) => { return x * 2; }`
- **Concise body**: arrow without braces: `(x) => x * 2`

## Prefer Function Declarations

Prefer function declarations over arrow functions for named functions. Arrow functions may be used when an explicit type annotation is required:

```typescript
// Good: function declaration
function foo() {
  return 42;
}

// OK: arrow function with explicit type annotation
interface SearchFunction {
  (source: string, subString: string): boolean;
}
const fooSearch: SearchFunction = (source, subString) => { ... };
```

```typescript
// Bad: arrow function used where declaration would be clearer
const foo = () => 42;
```

## Nested Functions

Arrow functions are preferred in method bodies because they capture the outer `this`:

```typescript
class MyClass {
  values: number[] = [];
  transform() {
    // Good: arrow function preserves outer this
    return this.values.map(v => v * 2);
  }
}
```

## Do Not Use Function Expressions

Use arrow functions instead of function expressions:

```typescript
// Good: arrow function
bar(() => { this.doSomething(); });

// Bad: function expression
bar(function() { ... });
```

**Exception**: Function expressions may be used for generator functions (no arrow syntax) or when dynamically rebinding `this`.

## Arrow Function Bodies

Use concise bodies only when the return value is actually used. Use block bodies otherwise to ensure the return type is `void`:

```typescript
// Good: block body when return value is unused
myPromise.then(v => {
  console.log(v);
});

// Good: concise body when return value is used
const longThings = myValues.filter(v => v.length > 1000).map(v => String(v));

// Good: explicit void ensures no leaked return value
myPromise.then(v => void console.log(v));
```

```typescript
// Bad: concise body with unused return value
myPromise.then(v => console.log(v));
```

## Rebinding `this`

Never use `this` in function expressions or function declarations unless rebinding `this` is the explicit purpose. Prefer arrow functions over `f.bind(this)`, `goog.bind(f, this)`, or `const self = this`:

```typescript
// Bad: what's `this` in this context?
function clickHandler() {
  this.textContent = 'Hello';
}
document.body.onclick = clickHandler;

// Good: explicitly reference the object
document.body.onclick = () => { document.body.textContent = 'hello'; };
```

## Prefer Arrow Functions as Callbacks

Passing named callbacks to higher-order functions risks unintended arguments being forwarded:

```typescript
// Bad: parseInt receives array indices as radix
const numbers = ['11', '5', '10'].map(parseInt);
// Result: [11, NaN, 2]

// Good: explicit arrow forwards the intended parameter
const numbers = ['11', '5', '3'].map((n) => parseInt(n));
// Result: [11, 5, 3]
```

## Arrow Functions as Properties

Classes should not contain properties initialized to arrow functions in most cases. Use arrow functions to call instance methods instead:

```typescript
// Bad: arrow function property
class DelayHandler {
  private patienceTracker = () => {
    this.waitedPatiently = true;
  };
  constructor() {
    setTimeout(this.patienceTracker, 5000);
  }
}

// Good: anonymous arrow function wrapping method call
class DelayHandler {
  constructor() {
    setTimeout(() => {
      this.patienceTracker();
    }, 5000);
  }
  private patienceTracker() {
    this.waitedPatiently = true;
  }
}
```

## Event Handlers

Use anonymous arrow functions when no uninstall is needed. Use arrow function properties for stable references that need removal:

```typescript
class Component {
  onAttached() {
    // Anonymous arrow, no uninstall needed
    this.addEventListener('click', () => {
      this.listener();
    });
    // Arrow function property provides stable reference for removal
    window.addEventListener('onbeforeunload', this.listener);
  }
  onDetached() {
    window.removeEventListener('onbeforeunload', this.listener);
  }
  private listener = () => {
    confirm('Do you want to exit the page?');
  };
}
```

Never use `bind` in handler installation -- it creates a temporary reference that cannot be removed:

```typescript
// Bad: bind creates disposable reference
class Component {
  onAttached() {
    window.addEventListener('onbeforeunload', this.listener.bind(this));
  }
  onDetached() {
    // This does nothing -- it's a different reference
    window.removeEventListener('onbeforeunload', this.listener.bind(this));
  }
}
```

## Parameter Initializers

Optional parameters may have default initializers. Initializers must not have side effects:

```typescript
// Good: simple defaults
function process(name: string, extraContext: string[] = []) {}
function activate(index = 0) {}
```

```typescript
// Bad: side effect in initializer
let globalCounter = 0;
function newId(index = globalCounter++) {} // side effect!

// Bad: shared mutable state
class Foo {
  private readonly defaultPaths: string[];
  frobnicate(paths = defaultPaths) {} // shared reference!
}
```

Use default parameters sparingly. Prefer destructuring for APIs with many optional parameters.

## Prefer Rest and Spread

Use rest parameters instead of `arguments`. Never name a variable `arguments`:

```typescript
function variadic(array: string[], ...numbers: number[]) {}
```

Use function spread instead of `Function.prototype.apply`:

```typescript
// Good: spread syntax
const result = myFunction(...args);

// Bad: apply
const result = myFunction.apply(null, args);
```

## Formatting Functions

No blank lines at the start or end of function bodies. Generators attach `*` to `function` and `yield`:

```typescript
function* myGenerator() {
  yield* innerGenerator();
}
```

Parentheses around single-argument arrow functions are recommended. No space after `...` in rest/spread.

## The `this` Keyword

Only use `this` in:
- Class constructors and methods
- Functions with an explicit `this` type parameter: `function func(this: ThisType, ...)`
- Arrow functions defined in a scope where `this` may be used

Never use `this` to refer to the global object, the context of `eval`, an event target, or unnecessarily `call()`/`apply()`-ed functions:

```typescript
// Bad: this used outside proper scope
function handleClick() {
  this.textContent = 'Hello';
}
```

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/tsguide.html
-->
