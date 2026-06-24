---
name: features-interfaces-generics
description: Design small Go interfaces and use generics only when they reduce real duplication or improve type safety.
---

# Interfaces and Generics

Interfaces and generics are powerful abstractions. Use them when they simplify real code, not to imitate framework patterns or pre-build speculative flexibility.

## Usage

- Do not create an interface before a concrete need exists. Avoid `Service`/`Repository` interfaces just because the domain has that noun.
- Do not wrap generated RPC clients only for tests; prefer real transports with test servers.
- Do not export test doubles or backdoor interfaces solely for testing.
- The consumer usually defines the interface, with only the methods it uses.
- Keep internal-only interfaces unexported. Export interfaces when the interface itself is the product/protocol or when it prevents harmful duplication/cycles.
- Keep interfaces small and document contracts, edge cases, expected errors, and concurrency requirements.
- Prefer accepting interfaces and returning concrete types. Return interfaces for established abstractions (`error`, `io.Reader`), multiple runtime implementations, encapsulation with real safety benefits, or cycle breaking.
- Use generics when they solve a real business problem; otherwise prefer ordinary slices, maps, functions, and small interfaces.

```go
// Good: consumer owns the minimal interface it needs.
type userLookup interface {
    User(ctx context.Context, id string) (*User, error)
}

func SendWelcome(ctx context.Context, lookup userLookup, id string, mailer *Mailer) error {
    u, err := lookup.User(ctx, id)
    if err != nil {
        return fmt.Errorf("look up user %q: %w", id, err)
    }
    return mailer.Send(ctx, u.Email, "Welcome")
}
```

```go
// Good: return a concrete type so callers keep full functionality.
type Client struct { /* ... */ }

func NewClient(endpoint string) *Client { return &Client{/* ... */} }

func (c *Client) Do(ctx context.Context, req *Request) (*Response, error) { /* ... */ }
```

```go
// Good: generic helper removes duplication across real map value types.
func Keys[K comparable, V any](m map[K]V) []K {
    keys := make([]K, 0, len(m))
    for k := range m {
        keys = append(keys, k)
    }
    return keys
}
```

## Key Points

- “Accept interfaces, return concrete types” is a default, not an absolute rule.
- Small interfaces are easier to implement, compose, document, and test.
- Interfaces should reduce coupling; if they hide essential behavior, they hurt maintainability.
- Generics should not create DSLs, assertion frameworks, or opaque error-handling mechanisms.
- If only one concrete type is used, start without generics; adding type parameters later is easier than removing them.

<!--
Source references:
- https://google.github.io/styleguide/go/decisions#interfaces
- https://google.github.io/styleguide/go/decisions#generics
- https://google.github.io/styleguide/go/best-practices#interfaces
- https://google.github.io/styleguide/go/best-practices#avoid-unnecessary-interfaces
- https://google.github.io/styleguide/go/best-practices#interface-ownership-and-visibility
- https://google.github.io/styleguide/go/best-practices#designing-effective-interfaces
-->
