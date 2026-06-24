---
name: core-naming
description: Choose concise Go names for packages, functions, methods, receivers, variables, constants, and initialisms.
---

# Naming

Good Go names are short where context is strong, descriptive where scope is large, and never repetitive at the call site.

## Usage

- Package names: short, lowercase, no underscores or capitals; avoid `util`, `common`, `helper`, `model`, and names likely to collide with common locals.
- Exported symbols are read with the package name: prefer `widget.New`, not `widget.NewWidget`.
- Function/method names should not repeat receiver, package, parameter, or return type context.
- Receiver names are short, usually one or two letters, consistent for the type, and never `this` or `self`.
- Variables get longer names as scope grows; omit type words (`userCount`, not `numUsers`; `users`, not `userSlice`).
- Constants use MixedCaps and name their role, not their literal value. Do not use `MAX_VALUE` or `kMaxValue`.
- Initialisms keep consistent case: `URL`/`url`, `ID`/`id`, `DB`/`db`, not `Url` or `Id`.
- Watch shadowing with `:=`, especially for `ctx`, `err`, and package names like `url`.

```go
// Good: package and symbol names compose without repetition.
package yamlconfig

func Parse(input string) (*Config, error) { /* ... */ }

type Config struct{}

func (c *Config) WriteTo(w io.Writer) (int64, error) { /* ... */ }
```

```go
// Good: receiver and local names match scope and context.
func (s *Server) UserCount(ctx context.Context, projectID string) (int, error) {
    var count int64
    if err := s.db.QueryRowContext(ctx, countUsersSQL, projectID).Scan(&count); err != nil {
        return 0, fmt.Errorf("query user count for project %q: %w", projectID, err)
    }
    return int(count), nil
}
```

```go
// Good: avoid accidental shadowing when updating an existing context.
var cancel context.CancelFunc
if shortenDeadlines {
    ctx, cancel = context.WithTimeout(ctx, 3*time.Second)
    defer cancel()
}
```

## Key Points

- Evaluate repetition from the caller's perspective: `db.Load`, not `db.LoadFromDatabase`.
- Avoid `Get` unless the domain word is literally “get” (for example HTTP GET).
- Single-letter names are fine for tight scopes and familiar roles (`i`, `r`, `w`, receiver abbreviations).
- Test names and `_test` packages are the main underscore exceptions.
- Use new names instead of shadowing when clarity is at risk.

<!--
Source references:
- https://google.github.io/styleguide/go/guide#naming
- https://google.github.io/styleguide/go/decisions#naming
- https://google.github.io/styleguide/go/decisions#package-names
- https://google.github.io/styleguide/go/decisions#receiver-names
- https://google.github.io/styleguide/go/decisions#initialisms
- https://google.github.io/styleguide/go/best-practices#function-names
- https://google.github.io/styleguide/go/best-practices#shadowing
- https://google.github.io/styleguide/go/best-practices#util-packages
-->
