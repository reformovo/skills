---
name: core-imports-packages
description: Organize Go packages and imports for readable call sites, minimal renaming, and stable dependencies.
---

# Imports and Packages

Package and import choices shape every call site. Keep packages cohesive, package names informative, and imports mechanically organized.

## Usage

- Size packages around cohesive concepts. Combine types that clients must use together; split conceptually distinct responsibilities.
- Do not create many one-type files by convention; group files so maintainers can find related code.
- Import groups, in order: standard library, other/project/vendor packages, protocol buffer imports, blank side-effect imports.
- Avoid import renaming. Rename only for collisions, generated proto/stub packages, or truly uninformative third-party names.
- Proto imports get descriptive `pb` or `grpc` suffixes.
- Blank imports belong in `main` packages or tests that require side effects, with narrow exceptions such as `embed`.
- Do not use dot imports.

```go
package main

import (
    "context"
    "fmt"
    "os"

    "github.com/google/subcommands"
    "golang.org/x/sync/errgroup"

    accountpb "example.com/project/account_go_proto"
    accountgrpc "example.com/project/account_go_grpc"

    _ "example.com/project/rpc/authhooks"
)
```

```go
// Good: package and exported names compose naturally.
package ring

type Ring struct { /* ... */ }

func New(size int) *Ring { /* ... */ }

// Call site: ring.New(128), not ring.NewRing(128).
```

## Key Points

- Package names are part of identifiers at every call site; optimize for readable use.
- Avoid `util`/`common` packages; name the capability (`spannertest`, `elliptic`, `quota`).
- Rename generated package names with underscores to legal, readable Go names.
- Keep import names consistent across nearby files.
- Avoid package boundaries that create circular dependencies or require clients to import two packages to use one concept.

<!--
Source references:
- https://google.github.io/styleguide/go/decisions#package-names
- https://google.github.io/styleguide/go/decisions#imports
- https://google.github.io/styleguide/go/decisions#import-renaming
- https://google.github.io/styleguide/go/decisions#import-grouping
- https://google.github.io/styleguide/go/decisions#import-blank
- https://google.github.io/styleguide/go/decisions#import-dot
- https://google.github.io/styleguide/go/best-practices#package-size
- https://google.github.io/styleguide/go/best-practices#import-protos
-->
