---
title: Classes (Declarations, Members, Visibility, Accessors)
impact: HIGH
impactDescription: Class design rules prevent subtle bugs caused by incorrect visibility, mutable state exposure, and prototype manipulation.
type: best-practice
tags: [typescript, classes, constructors, visibility, accessors]
---

# Classes

**Impact: HIGH** - Class conventions directly affect correctness, encapsulation, and the safety of shared mutable state.

## Task List

- No semicolons after class declarations; semicolons required for class expressions.
- No `#private` fields; use TypeScript `private` visibility annotations.
- Mark properties `readonly` when never reassigned outside the constructor.
- Use parameter properties to avoid manual field plumbing.
- Initialize fields at declaration site; never add/remove properties after construction.
- Use getters/setters for computed or restricted properties; getters must be pure.
- Limit visibility as much as possible; never use `public` modifier (except non-readonly parameter properties).
- Only use `Symbol` for computed properties in classes.

## Class Declarations

Class declarations must not be terminated with semicolons. Class expressions (in statements) must be terminated with semicolons:

```typescript
// Good: declaration, no semicolon
class Foo {
}

// Good: expression in statement, semicolon required
export const Baz = class extends Bar {
  method(): number {
    return this.x;
  }
};
```

```typescript
// Bad: unnecessary semicolon on declaration
class Foo {
};

// Bad: missing semicolon on expression statement
export const Baz = class extends Bar {
  method(): number {
    return this.x;
  }
}
```

## Class Method Declarations

No semicolons between methods. Separate methods with a single blank line:

```typescript
// Good
class Foo {
  doThing() {
    console.log('A');
  }

  getOtherThing(): number {
    return 4;
  }
}
```

```typescript
// Bad: semicolon between methods
class Foo {
  doThing() {
    console.log('A');
  }; // unnecessary
  getOtherThing(): number {
    return 4;
  }
}
```

### Overriding toString

May be overridden but must always succeed and never have visible side effects. Avoid calling methods from toString that could throw or cause infinite loops.

## Static Methods

### Avoid Private Static Methods

Prefer module-local functions over private static methods where readability allows:

```typescript
// Good: module-local function
function calculateTax(amount: number): number {
  return amount * 0.12;
}

class Order {
  process() {
    return calculateTax(this.total);
  }
}
```

### No Dynamic Dispatch on Static Methods

Static methods should only be called on the defining base class, not on subclasses or dynamic instances:

```typescript
// Bad: calling static method on a subclass
class Base { static foo() {} }
class Sub extends Base {}
Sub.foo();

// Bad: accessing this in static context
class MyClass {
  static foo() {
    return this.staticField; // surprising behavior with inheritance
  }
}
```

### No `this` in Static Context

Do not use `this` in static methods. Static fields can be overridden by subclasses, making `this` references surprising:

```typescript
// Bad: this in static context
class ShoeStore {
  static storage: Storage = ...;
  static isAvailable(s: Shoe) {
    return this.storage.has(s.id); // 'this' could refer to a subclass
  }
}
```

## Constructors

Constructor calls must use parentheses, even with no arguments:

```typescript
const x = new Foo();    // Good
const x = new Foo;      // Bad: missing parentheses
```

Omit unnecessary empty constructors or ones that simply delegate to the parent:

```typescript
// Bad: unnecessary empty constructor
class UnnecessaryConstructor {
  constructor() {}
}

// Bad: unnecessary override
class UnnecessaryConstructorOverride extends Base {
  constructor(value: number) {
    super(value);
  }
}

// Good: no constructor needed
class DefaultConstructor {
}

// Good: constructor with parameter properties should not be omitted
class ParameterProperties {
  constructor(private myService: MyService) {}
}
```

The constructor must be separated from surrounding code by a single blank line:

```typescript
// Good
class Foo {
  myField = 10;

  constructor(private readonly ctorParam: string) {}

  doThing() { ... }
}
```

## Class Members

### No `#private` Fields

Do not use JavaScript private fields (`#ident`). Use TypeScript's `private` annotation instead:

```typescript
// Bad: #private field
class Clazz {
  #ident = 1;
}

// Good: TypeScript private
class Clazz {
  private ident = 1;
}
```

### Use `readonly`

Mark properties never reassigned outside the constructor with `readonly`:

```typescript
class Foo {
  private readonly userList: string[] = [];
  private counter = 0; // reassigned later, not readonly

  increment() { this.counter++; }
}
```

### Parameter Properties

Use parameter properties instead of manual constructor plumbing:

```typescript
// Bad: manual plumbing
class Foo {
  private readonly barService: BarService;
  constructor(barService: BarService) {
    this.barService = barService;
  }
}

// Good: parameter property
class Foo {
  constructor(private readonly barService: BarService) {}
}
```

### Field Initializers

Initialize fields at the declaration site rather than in the constructor body:

```typescript
// Bad: initialization in constructor
class Foo {
  private readonly userList: string[];
  constructor() {
    this.userList = [];
  }
}

// Good: field initializer
class Foo {
  private readonly userList: string[] = [];
}
```

Never add or remove properties from an instance after the constructor finishes -- this hinders VM optimization. Explicitly initialize optional fields to `undefined`.

### Properties Used Outside Class Lexical Scope

Properties accessed from outside the class (e.g., Angular/React template bindings) must not use `private`. Use `protected` or `public` as appropriate:

```typescript
// Good: template-accessible properties use protected
class Component {
  protected items: string[] = [];
  // ... used in template
}
```

Do not use `obj['foo']` to bypass visibility.

### Getters and Setters

Getters must be pure functions (no side effects, consistent results):

```typescript
// Good: pure getter
class Foo {
  constructor(private readonly someService: SomeService) {}
  get someMember(): string {
    return this.someService.someVariable;
  }
}
```

```typescript
// Bad: impure getter
class Foo {
  nextId = 0;
  get next() {
    return this.nextId++; // side effect!
  }
}
```

At least one accessor for a property must be non-trivial. Do not use `Object.defineProperty` for accessors.

### Computed Properties

Only symbols are allowed as computed property keys in classes. Define `[Symbol.iterator]` for iterable classes:

```typescript
class IterableCollection {
  [Symbol.iterator]() {
    // ...
  }
}
```

## Visibility

Restrict visibility as much as possible. Never use the `public` modifier (except on non-readonly parameter properties in constructors):

```typescript
// Bad: unnecessary public modifier
class Foo {
  public bar = new Bar();
}

// Good: public is the default, omit modifiers
class Foo {
  bar = new Bar();
}

// Exception: public on non-readonly parameter property
class Foo {
  constructor(public baz: Baz) {}
}
```

Consider converting private methods to non-exported functions outside the class for better encapsulation and testability.

## Disallowed Patterns

Do not manipulate prototypes directly. The `class` keyword provides clearer definitions:

```typescript
// Bad: prototype manipulation
Foo.prototype.bar = function() { ... };

// Good: class syntax
class Foo {
  bar() { ... }
}
```

Mixin patterns and modifying builtin object prototypes are explicitly forbidden.

<!--
Source references:
- https://github.com/google/styleguide/blob/HEAD/tsguide.html
-->
