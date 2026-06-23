---
name: guardrails
description: Mechanical guardrails checklist for vibe coding and common failure modes with countermeasures. Use as a pre-flight checklist and troubleshooting reference.
---

# Guardrails

## Pre-Flight Checklist

Verify each item before starting a vibe coding session.

- [ ] `AGENTS.md` exists, is concise (<200 lines), loads every session
- [ ] Stack-relevant skills installed and listed in AGENTS.md with trigger conditions
- [ ] ESLint/Biome + type-check run in pre-commit **and** CI
- [ ] Tests are mandatory; run after every AI change
- [ ] PR template includes "I read every line, can explain, wrote this myself" checkbox
- [ ] Direct push to main is blocked; review gate enforced
- [ ] Scope lock: agent declares file list before editing
- [ ] Destructive command deny-list (`rm -rf /`, `DROP TABLE`, `DELETE` without WHERE, reading `.env`)
- [ ] File size budget enforced (prevents god-files)
- [ ] CI scans full git history for secrets
- [ ] Quarterly AGENTS.md audit scheduled

## Failure Modes and Countermeasures

| Failure Mode | Countermeasure |
|---|---|
| Agent edits undeclared files | P2 scope lock — require file declaration, reject out-of-scope edits |
| AGENTS.md drifts from code reality | P6 same-PR update + quarterly audit |
| Skill should activate but doesn't | List skill + trigger conditions in AGENTS.md |
| Human review is rubber-stamping | P4 explain-back test + PR checkbox + tiered review |
| Context window overflow from skills | On-demand loading, control skill count, keep AGENTS.md <200 lines |
| Rules are unfalsifiable ("write clean code") | Only write verifiable rules ("functions < 50 lines") |
| AGENTS.md used as lint replacement | Ensure mechanical constraints (lint/test/CI) exist independently |

## Destructive Command Deny-List

Block these patterns in agent permissions. OpenCode example (`opencode.json`):

```json
{
  "permission": {
    "bash": {
      "*": "ask",
      "rm -rf /*": "deny",
      "git push --force*": "deny",
      "git push origin main*": "deny",
      "git push origin master*": "deny"
    },
    "read": {
      "*": "allow",
      ".env": "deny",
      ".env.*": "deny"
    }
  }
}
```

> OpenCode evaluates the **last matching rule**, so put broad rules first (`"*": "ask"`) and narrow deny rules after.

For SQL-based tools, block via MCP server config or database user permissions:

```sql
-- Grant read-only to the agent's DB user, never write access
GRANT SELECT ON database.* TO 'agent_readonly'@'%';
```

<!--
Source references:
- GitGuardian vibe-coding guardrails: https://blog.gitguardian.com/automated-guard-rails-for-vibe-coding/
- vibe-coding-template (scope lock): https://github.com/azizakmal97/vibe-coding-template
- Daniel Roe "Using AI in open source": https://roe.dev/blog/using-ai-in-open-source
-->
