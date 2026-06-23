---
name: workflow-per-task
description: Per-task vibe coding execution loop — scope lock, verify gates, explain-back review, and tight feedback loops. The highest-leverage practices for preventing AI scope creep and ensuring code quality.
---

# Per-Task Workflow

Four steps executed as a tight cycle for every AI-assisted task: scope → generate → verify → review → repeat.

## P2. Scope Lock (highest leverage)

The highest-leverage constraint against the #1 failure mode: "simple fix becomes 15-file refactor."

### Rules

- Give the agent a **bounded, verifiable** task with explicit acceptance criteria (tests pass, types pass, lint passes).
- **Require the agent to declare which files it will edit before making any changes.** Reject any edits outside the declared list.
- Target: ≤5 files, ≤200 lines changed per task. One feature/fix = one PR.

### Good vs Bad Tasks

Bad: "Optimize this module"

Good: "In `src/auth/login.ts`, add retry logic to `login()`: max 3 attempts, exponential backoff. Edit only this file. Add corresponding test in `login.test.ts`. Run `pnpm test` — must pass."

### Scope Lock Dialogue

Present the task, then require a file declaration before any edit:

```
User: Add retry logic to login() in src/auth/login.ts. Max 3 attempts,
      exponential backoff. Edit only this file + login.test.ts. Run pnpm test.

Agent: I will edit these files:
  1. src/auth/login.ts — add retry loop with exponential backoff
  2. src/auth/login.test.ts — add test cases for retry behavior

User: Approved. Proceed.

// If agent later tries to edit src/auth/config.ts:
User: config.ts is not in the declared list. Why is it needed?
Agent: The retry delay needs the BACKOFF_BASE constant from config.ts.
User: Approved — add config.ts to the scope.
```

### Enforcement

When the agent proposes edits outside the declared scope:

1. Stop the edit.
2. Ask why the additional file is needed.
3. If justified, explicitly approve the scope expansion.
4. If not, redirect to the original scope.

## P3. Verify, Don't Trust

### Mandatory Gate Sequence

```
type-check → lint → test → build
```

Run **immediately after every AI change**, not at the end.

### Double Execution

- **Pre-commit hook**: catches issues before they enter git history.
- **CI**: re-runs pre-commit checks to defend against `--no-verify`.

Config with simple-git-hooks + lint-staged:

```json
{
  "simple-git-hooks": {
    "pre-commit": "pnpm i --frozen-lockfile --ignore-scripts --offline && npx lint-staged"
  },
  "lint-staged": {
    "*": "eslint --fix",
    "*.{ts,tsx}": "tsc --noEmit"
  },
  "scripts": {
    "prepare": "npx simple-git-hooks"
  }
}
```

CI re-runs the same checks to defend against `--no-verify`:

```yaml
# .github/workflows/ci.yml
- run: pnpm install --frozen-lockfile
- run: pnpm lint
- run: pnpm typecheck
- run: pnpm test
- run: pnpm build
```

### Feedback Loop

Pre-commit failure is a **learning signal** for the agent — it reveals the project's real standards. Feed structured errors back to the agent and iterate.

### Optional: LLM Diff Review

Tools like VibeGuard or Duck can review diffs for standard deviations that lint cannot catch (naming conventions, architectural patterns).

## P4. Review with Understanding

### Explain-Back Test

Before merging, explain the change from memory to a colleague (or rubber duck). **If you cannot explain it, reject it — regardless of test results.**

Good: "The retry loop wraps the fetch call. It catches network errors, waits `2^attempt * 100ms`, and re-throws after 3 failures so the caller's error handler still runs."

Bad: "It adds some retry logic with backoff... the tests pass."

### Rewrite LLM Comments

AI comments tend to over-explain and hedge ("Note that this might..."). Replace every LLM-written comment with your own:

- Explain **why**, not **what**.
- Keep it short.
- Remove hedging and uncertainty.

### PR Template

Force a checkbox:

```markdown
- [ ] I have read every line of this PR, can explain it, and wrote the description myself.
```

### Tiered Review

Avoid review bottlenecks with tiered handling:

| Change Type | Review Method |
|-------------|---------------|
| Formatting / import sorting | Auto-pass |
| Renaming / signature changes | AI review + lint |
| Logic changes | Mandatory human review |

## P5. Tight Loops

### Fast Fail

Run the gate immediately after each edit. Feed structured errors back to the agent. Re-scope if needed.

### Small Steps

Avoid large speculative generation. Make small, verifiable changes. Each step should independently pass the gate.

### Mid-Edit Validation

Use mid-edit hooks (e.g., Claude Code's PostToolUse) to validate on write, not just on commit. Catching errors at write time is cheaper than at commit time.

<!--
Source references:
- Daniel Roe "Using AI in open source": https://roe.dev/blog/using-ai-in-open-source
- vibe-coding-template (scope lock): https://github.com/azizakmal97/vibe-coding-template
- GitGuardian vibe-coding guardrails: https://blog.gitguardian.com/automated-guard-rails-for-vibe-coding/
-->
