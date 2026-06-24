---
name: core-comments-documentation
description: Write Go doc comments, package comments, examples, and API contracts that help readers use code correctly.
---

# Comments and Documentation

Go comments should clarify purpose, rationale, and API contracts. Avoid comments that restate obvious code; document non-obvious behavior that affects correct use.

## Usage

- Every exported top-level name needs a doc comment that is a complete sentence and usually starts with the name.
- Put one package comment immediately before the `package` clause; use `doc.go` when documentation is long.
- Provide runnable `Example` functions in `_test.go` when usage is important.
- Preview Godoc when writing public APIs; keep formatting simple.
- Document non-obvious parameters, configuration fields, context behavior, concurrency guarantees, cleanup duties, and significant returned error values/types.
- Use signal-boosting comments when common-looking code does the uncommon thing.

```go
// Package quota manages per-project request quotas.
//
// Errors returned by this package wrap ErrExhausted when a request is rejected
// because no quota remains.
package quota
```

```go
// Limiter rejects requests that exceed a quota.
//
// Limiter methods are safe for simultaneous use by multiple goroutines.
type Limiter struct { /* ... */ }

// Allow reports whether projectID may consume n units.
//
// If the context is canceled after quota has been reserved, Allow returns a nil
// error and the reservation remains consumed.
func (l *Limiter) Allow(ctx context.Context, projectID string, n int) (bool, error) { /* ... */ }
```

```go
func ExampleLimiter_Allow() {
    l := quota.NewLimiter(10)
    ok, err := l.Allow(context.Background(), "proj", 1)
    fmt.Println(ok, err == nil)
    // Output: true true
}
```

```go
// Good: boost uncommon condition.
if err := cache.Refresh(ctx); err == nil { // if refresh succeeded
    metrics.RecordFresh()
}
```

## Key Points

- Comments serve readers of Godoc, IDEs, code search, and future maintainers.
- Document “why” and surprising contracts; do not enumerate obvious parameters.
- Cleanup requirements must tell callers what to close/stop and when.
- Error documentation should name sentinel errors or concrete types callers can inspect.
- Concurrency docs are needed when safety is non-obvious or part of an interface contract.

<!--
Source references:
- https://google.github.io/styleguide/go/decisions#commentary
- https://google.github.io/styleguide/go/decisions#doc-comments
- https://google.github.io/styleguide/go/decisions#examples
- https://google.github.io/styleguide/go/decisions#package-comments
- https://google.github.io/styleguide/go/best-practices#documentation-conventions
- https://google.github.io/styleguide/go/best-practices#documentation-conventions-contexts
- https://google.github.io/styleguide/go/best-practices#documentation-conventions-concurrency
- https://google.github.io/styleguide/go/best-practices#documentation-conventions-cleanup
- https://google.github.io/styleguide/go/best-practices#documentation-conventions-errors
- https://google.github.io/styleguide/go/best-practices#signal-boost
-->
