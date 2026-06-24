---
title: Variable Declarations (const, let, var, this)
impact: MEDIUM
impactDescription: Consistent variable declaration rules prevent scoping bugs and clarify ownership of `this` context across the codebase.
type: best-practice
tags: [typescript, variables, const, let, this, scoping]
---

# Variable Declarations (const, let, var, this)

**Impact: MEDIUM** - Proper use of const/let and disciplined this management prevents a large class of bugs and improves readability.

## Task List

- Always use `const` or `let`; prefer `const` by default, never use `var`
- Declare exactly one variable per declaration statement
- Variables must not be referenced before their declaration
- Only use `this` in class constructors/methods, functions with explicit `this` type, or arrow functions in valid scope
- Never use `this` to refer to the global object, eval context, event target, or unnecessarily call/apply'd functions

## Local Variable Declarations

### Use const and let, never var

Declare all variables with `const` or `let`. Use `const` by default; switch to `let` only when reassignment is needed. `var` is function-scoped, which causes subtle bugs; `const` and `let` are block-scoped.

```typescript
// Good: const by default, let only when reassigning
const foo = otherValue;
let bar = someValue;
bar += 1;
```

```typescript
// Bad: var scoping is complex and causes bugs
var foo = someValue;
```

Variables must not be used before their declaration. Unlike `var` (which hoists), `const` and `let` produce a `ReferenceError` if accessed before initialization (temporal dead zone).

### One variable per declaration

Every declaration declares exactly one variable. Combined declarations obscure intent and make refactoring harder.

```typescript
// Good
let a = 1;
let b = 2;
```

```typescript
// Bad: multiple declarations on one line
let a = 1, b = 2;
```

## The `this` Keyword

Only use `this` in these specific contexts:
- Class constructors and methods
- Functions that have an explicit `this` type declared (`function func(this: ThisType, ...)`)
- Arrow functions defined in a scope where `this` may be used

```typescript
// Good: this in class methods
class MyClass {
  value = 42;
  method() {
    return this.value;
  }
}

// Good: explicit this type
function onClick(this: HTMLElement, event: MouseEvent) {
  console.log(this.textContent);
}

// Good: arrow function inheriting this from enclosing scope
class MyClass {
  values: string[] = [];
  init() {
    this.values.forEach((v) => {
      console.log(this);  // this refers to MyClass instance
    });
  }
}
```

Never use `this` to refer to the global object, the context of an `eval`, the target of an event handler, or unnecessarily `call()`ed or `apply()`ed functions.

```typescript
// Bad: this used outside a valid context
function standalone() {
  this.alert('Hello');  // this is the global object or undefined
}

// Bad: relying on dynamic this binding from event handlers
element.addEventListener('click', function() {
  this.innerHTML = 'clicked';  // Fragile; depends on how the function is called
});
```

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/tsguide.html
-->
