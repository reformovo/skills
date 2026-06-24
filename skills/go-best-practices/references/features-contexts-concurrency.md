---
name: features-contexts-concurrency
description: Pass contexts explicitly and write concurrent Go with clear goroutine lifetimes, channel ownership, and cancellation behavior.
---

# Contexts and Concurrency

Contexts carry deadlines, cancellation, credentials, and trace data across API boundaries. Concurrent code must make ownership and termination obvious.

## Usage

- `context.Context` is the first parameter of functions/methods that need it: `func F(ctx context.Context, ...)`.
- Exceptions: HTTP handlers obtain `req.Context()`, streaming RPCs obtain stream context, tests may use `t.Context()`, and true entry points use `context.Background()`.
- Do not store contexts in structs. Pass a context to each method that needs it.
- Do not define custom context types or context-like interfaces.
- Do not create `context.Background()` mid-callchain unless implementing an entry point/framework or intentionally detaching work.
- Document non-standard cancellation behavior, lifetime requirements, or context values.
- Prefer synchronous functions. If you start goroutines, make their exit conditions clear and wait/cancel as appropriate.
- Specify channel direction (`<-chan T`, `chan<- T`) where possible to express ownership and let the compiler catch misuse.

```go
type Worker struct {
    q <-chan Item
}

func (w *Worker) Run(ctx context.Context) error {
    var wg sync.WaitGroup
    for {
        select {
        case <-ctx.Done():
            wg.Wait()
            return ctx.Err()
        case item, ok := <-w.q:
            if !ok {
                wg.Wait()
                return nil
            }
            wg.Add(1)
            go func(item Item) {
                defer wg.Done()
                process(ctx, item)
            }(item)
        }
    }
}
```

```go
// Good: direction documents that sum only receives values.
func sum(values <-chan int) int {
    total := 0
    for v := range values {
        total += v
    }
    return total
}
```

```go
// Good: test helper accepts context first, then testing.TB.
func readFixture(ctx context.Context, t *testing.T, name string) []byte {
    t.Helper()
    data, err := storage.Read(ctx, name)
    if err != nil {
        t.Fatalf("read fixture %q: %v", name, err)
    }
    return data
}
```

## Key Points

- Context cancellation conventionally interrupts work and returns `ctx.Err()`; document deviations.
- Background goroutines that outlive their caller are suspect; document and test lifecycle explicitly.
- Synchronous APIs are easier to test and compose; callers can add goroutines if needed.
- A goroutine blocked on a channel can leak forever; garbage collection will not stop it.
- Directional channels communicate ownership: receivers should not close channels they do not own.

<!--
Source references:
- https://google.github.io/styleguide/go/decisions#contexts
- https://google.github.io/styleguide/go/decisions#custom-contexts
- https://google.github.io/styleguide/go/decisions#goroutine-lifetimes
- https://google.github.io/styleguide/go/decisions#synchronous-functions
- https://google.github.io/styleguide/go/best-practices#documentation-conventions-contexts
- https://google.github.io/styleguide/go/best-practices#decl-chan
-->
