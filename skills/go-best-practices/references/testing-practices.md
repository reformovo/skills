---
name: testing-practices
description: Write idiomatic Go tests with useful failures, table-driven structure, helpers, setup scoping, real transports, and safe fatal behavior.
---

# Testing Practices

Go tests should be diagnosable from failure output. Keep validation visible in `Test` functions, use standard `testing`, and prefer simple, explicit structure.

## Usage

- Use package `testing`; do not introduce assertion libraries or third-party test frameworks.
- Failure messages identify the function, inputs, got value, and want value: `Func(%q) = %v, want %v`.
- Print got before want. For diffs, include direction such as `(-want +got)`.
- Prefer `cmp.Equal`/`cmp.Diff` for complex values; avoid `reflect.DeepEqual` in new tests. Use `protocmp.Transform()` for protobufs.
- Test error semantics with `err != nil`, `errors.Is`, or `cmpopts.EquateErrors`; avoid brittle full error string comparisons.
- Use table-driven tests when cases share logic; use field names for non-trivial test rows.
- Use subtests when they improve filtering, setup/cleanup, or table readability; choose names that are readable and shell-friendly.
- Test helpers that take `*testing.T` should call `t.Helper()` and perform setup/cleanup, not hide assertions.
- Use `t.Fatal` only when continuing would be meaningless; never call `t.Fatal` from a separate goroutine.
- Scope setup to tests that need it; use `TestMain` only when all tests need common setup with teardown.
- For HTTP/RPC integrations, prefer real clients/transports connected to test servers over hand-written client interfaces.

```go
func TestDivide(t *testing.T) {
    tests := []struct {
        name     string
        dividend int
        divisor  int
        want     int
        wantErr  bool
    }{
        {name: "positive", dividend: 10, divisor: 2, want: 5},
        {name: "divide_by_zero", dividend: 1, divisor: 0, wantErr: true},
    }

    for _, tc := range tests {
        t.Run(tc.name, func(t *testing.T) {
            got, err := Divide(tc.dividend, tc.divisor)
            if gotErr := err != nil; gotErr != tc.wantErr {
                t.Fatalf("Divide(%d, %d) error = %v, want error presence = %t", tc.dividend, tc.divisor, err, tc.wantErr)
            }
            if err != nil {
                return
            }
            if got != tc.want {
                t.Errorf("Divide(%d, %d) = %d, want %d", tc.dividend, tc.divisor, got, tc.want)
            }
        })
    }
}
```

```go
func TestBuildReport(t *testing.T) {
    got := BuildReport([]Row{{Name: "a", Count: 1}})
    want := "a: 1\n"
    if diff := cmp.Diff(want, got); diff != "" {
        t.Errorf("BuildReport() returned unexpected diff (-want +got):\n%s", diff)
    }
}
```

```go
func mustWriteFile(t *testing.T, dir, name string, data []byte) string {
    t.Helper()
    path := filepath.Join(dir, name)
    if err := os.WriteFile(path, data, 0o644); err != nil {
        t.Fatalf("Setup failed: write %q: %v", path, err)
    }
    return path
}
```

## Key Points

- A maintainer should diagnose failures without opening the test source.
- Keep assertion logic in tests; helpers return values/errors or perform setup/cleanup.
- Prefer `t.Error` to keep going after independent mismatches; use `t.Fatal` for failed preconditions.
- Field names in test case literals reduce mistakes and make omitted zero values intentional.
- Tests should be hermetic, filterable, and not order-dependent through global state.

<!--
Source references:
- https://google.github.io/styleguide/go/decisions#useful-test-failures
- https://google.github.io/styleguide/go/decisions#assert
- https://google.github.io/styleguide/go/decisions#got-before-want
- https://google.github.io/styleguide/go/decisions#types-of-equality
- https://google.github.io/styleguide/go/decisions#print-diffs
- https://google.github.io/styleguide/go/decisions#test-error-semantics
- https://google.github.io/styleguide/go/decisions#subtests
- https://google.github.io/styleguide/go/decisions#table-driven-tests
- https://google.github.io/styleguide/go/decisions#mark-test-helpers
- https://google.github.io/styleguide/go/decisions#use-package-testing
- https://google.github.io/styleguide/go/best-practices#test-functions
- https://google.github.io/styleguide/go/best-practices#use-real-transports
- https://google.github.io/styleguide/go/best-practices#t-fatal
- https://google.github.io/styleguide/go/best-practices#test-helper-error-handling
- https://google.github.io/styleguide/go/best-practices#t-fatal-goroutine
- https://google.github.io/styleguide/go/best-practices#t-field-names
- https://google.github.io/styleguide/go/best-practices#t-custom-main
-->
