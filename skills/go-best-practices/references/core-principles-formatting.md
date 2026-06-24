---
name: core-principles-formatting
description: Apply Google Go style principles, gofmt, MixedCaps, line length, and local consistency.
---

# Principles and Formatting

Readable Go optimizes for readers and future maintainers. Prefer clarity, simplicity, concision, maintainability, then consistency, in that order.

## Usage

- Run `gofmt` on all Go files. Use `go/format` for generated code that humans may inspect.
- Use `MixedCaps` or `mixedCaps`, not snake case, for Go identifiers.
- Do not enforce an arbitrary line length. If a line feels too long, refactor or introduce locals; do not split before an indentation change just to satisfy a column limit.
- Prefer simple core constructs before extra abstractions: slices, maps, structs, loops, channels, standard library packages.
- When the guide is silent, follow nearby package/file style unless doing so expands an existing style problem.

```go
// Good: extract meaning instead of wrapping a long conditional.
inTransaction := db.CurrentStatusIs(db.InTransaction)
keysMatch := db.ValuesEqual(db.TransactionKey(), row.Key())
if inTransaction && keysMatch {
    return db.Error(db.TransactionError, "row key does not match transaction key")
}
```

```go
// Good: gofmt-friendly MixedCaps names.
const MaxPacketSize = 512

func userCountByRegion(users []User) map[string]int {
    counts := make(map[string]int)
    for _, u := range users {
        counts[u.Region]++
    }
    return counts
}
```

## Key Points

- Clarity beats cleverness; comments should explain why, not repeat what code states.
- Simplicity means least mechanism: core language, then standard library, then other libraries.
- Concision removes noise and repetition without hiding meaningful differences.
- Maintainability requires APIs, dependencies, tests, and assumptions that survive future change.
- Consistency is a tie-breaker, not a reason to violate the guide in new or expanded code.

<!--
Source references:
- https://google.github.io/styleguide/go/guide#principles
- https://google.github.io/styleguide/go/guide#formatting
- https://google.github.io/styleguide/go/guide#mixed-caps
- https://google.github.io/styleguide/go/guide#line-length
- https://google.github.io/styleguide/go/guide#local-consistency
-->
