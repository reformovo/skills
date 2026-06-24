---
name: features-errors-panics
description: Return, annotate, inspect, log, and document Go errors without using panic for normal control flow.
---

# Errors and Panics

Go code should make failures explicit with `error` return values. Add context deliberately, expose structure only when callers need it, and reserve panics for exceptional cases.

## Usage

- Return `error` as the last result. On non-nil error, document whether other results are meaningful; otherwise callers must not rely on them.
- Error strings are lower-case and no trailing punctuation, unless starting with a proper noun/exported name/acronym.
- Handle errors immediately, return them, or terminate only in exceptional contexts. Do not discard errors without a comment.
- Avoid in-band error values; return `(value, ok)` or `(value, error)`.
- Add context that the callee does not already provide. Do not write `failed: %v` or duplicate path details from `os.PathError`.
- Use `%w` only when callers may programmatically inspect the wrapped error with `errors.Is`/`errors.As`. Prefer `%v` when translating or hiding implementation details.
- Put `%w` at the end (`"operation: %w"`) unless a sentinel category should lead the message.
- Do not log and return the same error by default; let the caller decide to log.
- Do not use `panic` for normal errors. Use `Must` functions only for startup/package-level initialization or test value construction.

```go
func LoadConfig(path string) (*Config, error) {
    f, err := os.Open(path)
    if err != nil {
        return nil, fmt.Errorf("load config: %w", err)
    }
    defer f.Close()

    cfg, err := parseConfig(f)
    if err != nil {
        return nil, fmt.Errorf("parse config %q: %w", path, err)
    }
    return cfg, nil
}
```

```go
var ErrQuotaExhausted = errors.New("quota exhausted")

func Reserve(project string, n int) error {
    if remaining(project) < n {
        return fmt.Errorf("%w: project %q needs %d units", ErrQuotaExhausted, project, n)
    }
    return nil
}

func Handle(project string) error {
    if err := Reserve(project, 1); errors.Is(err, ErrQuotaExhausted) {
        return status.Error(codes.ResourceExhausted, "quota exhausted")
    } else if err != nil {
        return fmt.Errorf("reserve quota: %w", err)
    }
    return nil
}
```

```go
func MustParseVersion(s string) *Version {
    v, err := ParseVersion(s)
    if err != nil {
        panic(fmt.Sprintf("MustParseVersion(%q) = _, %v", s, err))
    }
    return v
}

var DefaultVersion = MustParseVersion("1.2.3")
```

## Key Points

- Use structured sentinel values or custom types instead of string matching when callers need decisions.
- Error annotations should add operation-level context and avoid redundancy.
- `%w` is an API commitment; document wrapped sentinels/types that callers may rely on.
- Libraries return errors; `main` may convert startup/config errors to actionable process exits.
- Unexpected panics should generally crash and be fixed, not recovered far away into corrupted state.

<!--
Source references:
- https://google.github.io/styleguide/go/decisions#errors
- https://google.github.io/styleguide/go/decisions#returning-errors
- https://google.github.io/styleguide/go/decisions#error-strings
- https://google.github.io/styleguide/go/decisions#handle-errors
- https://google.github.io/styleguide/go/decisions#in-band-errors
- https://google.github.io/styleguide/go/decisions#dont-panic
- https://google.github.io/styleguide/go/decisions#must-functions
- https://google.github.io/styleguide/go/best-practices#error-handling
- https://google.github.io/styleguide/go/best-practices#error-structure
- https://google.github.io/styleguide/go/best-practices#error-extra-info
- https://google.github.io/styleguide/go/best-practices#error-percent-w
- https://google.github.io/styleguide/go/best-practices#error-logging
- https://google.github.io/styleguide/go/best-practices#checks-and-panics
- https://google.github.io/styleguide/go/best-practices#when-to-panic
-->
