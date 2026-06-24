---
name: features-functions-values
description: Use Go literals, zero values, slices, copying rules, receiver types, aliases, any, and string construction idiomatically.
---

# Functions and Values

Prefer direct, idiomatic values. Use Go's zero values, composite literals, and receiver rules to make data ownership and mutability clear.

## Usage

- Struct literals for external package types should use field names; package-local positional literals are allowed only when clear.
- Omit zero-value fields when doing so improves clarity; use explicit field names in table tests and larger structs.
- Prefer `var s []T` for an empty local slice that may be returned. APIs should not distinguish nil and empty slices.
- Declare zero values when you want an empty value ready for use; use composite literals when you know initial contents.
- Do not copy types with pointer receiver methods or uncopyable fields (`sync.Mutex`, `bytes.Buffer`). Pass/return pointers for such types.
- Do not pass pointers to small values just to avoid copying (`*string`, `*io.Reader` are usually wrong).
- Receiver type: pointer for mutation, uncopyable fields, large/future-growing structs; value for maps, chans, funcs, small immutable values, and non-reslicing slices.
- Use type definitions normally; type aliases are rare and mainly for package migrations.
- Prefer `any` over `interface{}` in new code.
- Use `+` for a few strings, `fmt.Sprintf` for formatted strings, `fmt.Fprintf` for writers, and `strings.Builder` for piecemeal construction.

```go
// Good: external type uses field names.
r := csv.Reader{
    Comma:            ',',
    Comment:          '#',
    FieldsPerRecord: 4,
}
```

```go
// Good: nil slice is a valid empty result; caller checks len.
func MatchingNames(users []User, prefix string) []string {
    var names []string
    for _, u := range users {
        if strings.HasPrefix(u.Name, prefix) {
            names = append(names, u.Name)
        }
    }
    return names
}
```

```go
type Counter struct {
    mu    sync.Mutex
    total int
}

// Good: pointer receiver avoids copying the mutex and permits mutation.
func (c *Counter) Add(n int) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.total += n
}
```

```go
func BuildReport(rows []Row) string {
    b := new(strings.Builder)
    for _, row := range rows {
        fmt.Fprintf(b, "%s: %d\n", row.Name, row.Count)
    }
    return b.String()
}
```

## Key Points

- Let `gofmt -s` simplify repeated type names in composite literals.
- Use `len(s) == 0`, not `s == nil`, unless nil is intentionally semantic and documented.
- Correctness and readability outweigh speculative pointer performance; benchmark only when performance matters.
- Keep receiver style mostly consistent for a type.
- Do not introduce type aliases, size hints, or builders when simpler constructs are sufficient.

<!--
Source references:
- https://google.github.io/styleguide/go/decisions#literal-formatting
- https://google.github.io/styleguide/go/decisions#nil-slices
- https://google.github.io/styleguide/go/decisions#copying
- https://google.github.io/styleguide/go/decisions#pass-values
- https://google.github.io/styleguide/go/decisions#receiver-type
- https://google.github.io/styleguide/go/decisions#type-aliases
- https://google.github.io/styleguide/go/decisions#use-any
- https://google.github.io/styleguide/go/best-practices#vardecls
- https://google.github.io/styleguide/go/best-practices#vardeclzero
- https://google.github.io/styleguide/go/best-practices#vardeclcomposite
- https://google.github.io/styleguide/go/best-practices#string-concat
-->
