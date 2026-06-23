---
name: workflow-lifecycle
description: Contract setup and maintenance lifecycle — one-time AGENTS.md setup with skill installation, and ongoing contract maintenance to prevent drift between constraints and code reality.
---

# Contract Lifecycle

## P1. One-Time Setup

### 1. Write AGENTS.md

Create a concise (<200 line), falsifiable AGENTS.md. See core-constraints for the template.

### 2. Install Skills

Install stack-relevant skills:

```bash
pnpx skills add reformovo/skills --skill='*'
```

Or install specific skills:

```bash
pnpx skills add reformovo/skills --skill=reform
```

### 3. List Skill Triggers in AGENTS.md

Add a Skills section to AGENTS.md that maps domains to skills:

```markdown
## Skills (loaded on-demand)
- Vibe coding workflow / AI coding constraints → follow skills/reform/
- Writing tests → follow skills/vitest/
```

---

## P6. Maintain the Contract (highest leverage)

An outdated constraint file is **worse than none** — it teaches the agent wrong rules, and human reviewers may trust the file and miss drift.

### Update Triggers

| Trigger | Action |
|---------|--------|
| Code convention changes | Update AGENTS.md **in the same PR** as the code change |
| Agent repeatedly violates a rule | Add the rule to AGENTS.md or make it more explicit |
| A rule never triggers | Remove it |
| Quarterly | Audit AGENTS.md for relevance and accuracy |

### Same-PR Rule

When a convention changes, the AGENTS.md update must be in the **same PR** as the code change. Splitting them creates a window where the constraint and the code disagree.

Example: switching from CommonJS to ESM in a library:

```
PR #42: Migrate to pure ESM
├── package.json          (add "type": "module")
├── tsdown.config.ts      (format: ['esm'])
├── src/index.ts          (update imports)
└── AGENTS.md             (update: "Must always: pure ESM, no require()")
```

### Quarterly Audit Checklist

- [ ] Every rule in AGENTS.md still matches current code reality
- [ ] No rule has been silently violated for >1 month
- [ ] Commands (build/test/lint) still work and are current
- [ ] Skill triggers still point to installed, relevant skills
- [ ] Boundaries (Always/Ask/Never) still reflect project intent

### Drift Detection Signals

- Agent repeatedly "corrects" code that matches AGENTS.md → AGENTS.md is stale.
- Reviewer skips checking a rule because "it's in AGENTS.md" → dangerous trust. Verify independently.
- New team members confused by AGENTS.md vs actual code → drift has occurred.

<!--
Source references:
- Daniel Roe "Using AI in open source": https://roe.dev/blog/using-ai-in-open-source
- reformovo/skills README (skills vs AGENTS.md tradeoff): https://github.com/reformovo/skills
- ETH Zurich study on AGENTS.md length (via addyosmani.com/agents/15-agents-md)
-->
