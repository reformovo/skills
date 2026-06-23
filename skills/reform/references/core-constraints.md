---
name: core-constraints
description: Three-layer constraint model for vibe coding — AGENTS.md (always-on), Skills (on-demand), CONTRIBUTING.md (human-facing). Includes AGENTS.md template and layer relationships.
---

# Three-Layer Constraint Model

## A1. Always-On — `AGENTS.md`

Loaded every session. The agent's permanent contract. **Keep <200 lines** — research shows overlong AGENTS.md drops task success ~3% and raises cost 20%+.

### Content Rules

- **Specific and falsifiable**: "Functions < 50 lines", "No `any`" — not "write clean code".
- **Copy-pasteable commands**: exact build/test/lint commands.
- **Hard style rules**: enforceable by lint or review.
- **Short architecture note + directory structure**.
- **Explicit boundaries**: Always X / Ask first Y / Never Z.
- **Definition of Done**: what "complete" means for this project.

> AGENTS.md is a **supplement to mechanical constraints (lint/test/CI), not a replacement**. Without lint backing it, AGENTS.md alone cannot constrain an agent.

### Minimal Template

```markdown
## Stack
TypeScript, React, Tailwind, Vitest

## Must always
- New code in TypeScript strict mode
- Components as functions + hooks
- New logic must have tests (vitest)

## Must never
- No `any`
- No direct DOM manipulation outside useEffect
- No commented-out code

## Commands
- Lint: `pnpm lint`
- Type-check: `pnpm typecheck`
- Test: `pnpm test`

## Skills (loaded on-demand, see triggers below)
- Editing .vue/.ts → follow skills/vue-best-practices/
- Writing tests → follow skills/vitest/
```

### Complete Example with Boundaries

```markdown
## Stack
TypeScript, React, Tailwind, Vitest

## Must always
- New code in TypeScript strict mode
- Components as functions + hooks
- New logic must have tests (vitest)

## Must never
- No `any`
- No direct DOM manipulation outside useEffect
- No commented-out code

## Boundaries
- Always: run `pnpm test` before declaring a task done
- Ask first: installing new dependencies, changing tsconfig
- Never: push to main, disable lint rules inline, commit .env

## Commands
- Lint: `pnpm lint`
- Type-check: `pnpm typecheck`
- Test: `pnpm test`
- Build: `pnpm build`

## Definition of Done
- All commands pass
- No new `any` types
- New logic has tests
- Diff is explainable line-by-line

## Skills (loaded on-demand)
- Editing .vue/.ts → follow skills/vue-best-practices/
- Writing tests → follow skills/vitest/
```

## A2. On-Demand — Agent Skills

Knowledge bases (`SKILL.md` + `references/`) loaded only when a task touches a specific domain. Cross-tool reusable, extends beyond the context window.

### Skills vs Inline Instructions

| Type | When | Example |
|------|------|---------|
| Inline (AGENTS.md) | Every session | "No `any`" |
| Skill | Specific domain only | Vue best practices, Vitest patterns |
| Tool/MCP | Execute action / fetch data | Database query, API call |

**Decision rule**: Every time → AGENTS.md. Specific task only → skill. Execute action → tool.

### Fixing the False-Negative Problem

Agents may fail to activate a skill when they should. **List skills + trigger conditions explicitly in AGENTS.md** (see template above) to turn "on-demand" into "guided on-demand".

## A3. Human-Facing — `CONTRIBUTING.md`

Process documentation for humans, not replaced by AGENTS.md. Contains PR process, community norms, and an **AI Use Policy** section.

### AI Use Policy Template

For projects accepting external contributions:

> AI assistance is allowed, but contributors are responsible for every line. PR descriptions must be human-written. Pure vibe-coded PRs may be closed without review.

<!--
Source references:
- AGENTS.md spec: https://agents.md/
- Agent Skills spec: https://agentskills.io
- Daniel Roe "Using AI in open source": https://roe.dev/blog/using-ai-in-open-source
- ETH Zurich study on AGENTS.md length (via addyosmani.com/agents/15-agents-md)
- Nuxt CONTRIBUTING.md AI policy: https://github.com/nuxt/nuxt/blob/main/CONTRIBUTING.md
- LLVM AIToolPolicy: https://github.com/llvm/llvm-project/blob/main/llvm/docs/AIToolPolicy.md
-->
