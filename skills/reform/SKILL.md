---
name: reform
description: Reform's efficient vibe coding workflow for target projects. Use when setting up AI coding constraints (AGENTS.md, skills, mechanical gates), scoping AI-generated tasks to prevent scope creep, verifying AI output through lint/type/test/CI gates, reviewing AI-generated diffs with understanding, or maintaining AI coding contracts over time.
metadata:
  author: reformovo
  version: "2026.06.23"
---

> Efficient vibe coding = AI-generated code meets project requirements (code standards + tool best practices) without rework.

## Two Inviolable Principles

1. **Never let an LLM speak for you** — comments, issues, PR descriptions in your own words, reflecting your own understanding.
2. **Never let an LLM think for you** — only commit contributions you fully understand and can explain clearly.

## Three-Layer Constraint Model

| Layer | File | Loaded | Purpose |
|-------|------|--------|---------|
| Always-on | `AGENTS.md` | Every session | Mechanical contract: build/test/lint commands, style rules, boundaries, definition of done. Keep <200 lines. |
| On-demand | Agent Skills | When domain is touched | Deep, shareable knowledge base (`SKILL.md` + `references/`). Extends beyond context window. |
| Human-facing | `CONTRIBUTING.md` | By humans | PR process, community norms, AI use policy. Not replaced by AGENTS.md. |

## Workflow

### Per-Task Loop (every task)

| Step | Practice | Key Action |
|------|----------|------------|
| P2 | Scope Lock (highest leverage) | Agent declares file list before editing. Reject undeclared edits. Target ≤5 files, ≤200 lines per task. |
| P3 | Verify, Don't Trust | Run type-check → lint → test → build after every AI change. Pre-commit + CI double execution. |
| P4 | Review with Understanding | Explain-back test. Rewrite LLM comments. PR checkbox: "I read every line, can explain, wrote this myself." |
| P5 | Tight Loops | Fast fail, structured feedback, small steps. Avoid speculative bulk generation. |

### Contract Lifecycle (periodic)

| Step | Practice | Key Action |
|------|----------|------------|
| P1 | One-Time Setup | Write AGENTS.md, install skills, list skill triggers in AGENTS.md. |
| P6 | Maintain Contract (highest leverage) | Update AGENTS.md in same PR as code changes. Add violated rules, remove unused ones. Quarterly audit. |

## Guardrails

Mechanical checklist + common failure modes with countermeasures: [guardrails](references/guardrails.md)

## References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Constraint Model | Three-layer system, AGENTS.md template, layer relationships | [core-constraints](references/core-constraints.md) |
| Per-Task Workflow | Scope lock, verify gates, explain-back review, tight loops | [workflow-per-task](references/workflow-per-task.md) |
| Contract Lifecycle | One-time setup, ongoing maintenance, quarterly audit | [workflow-lifecycle](references/workflow-lifecycle.md) |
| Guardrails | Mechanical checklist, failure modes and countermeasures | [guardrails](references/guardrails.md) |

<!--
Source references:
- Daniel Roe "Using AI in open source": https://roe.dev/blog/using-ai-in-open-source
- AGENTS.md spec: https://agents.md/
- Agent Skills spec: https://agentskills.io
- ETH Zurich study on AGENTS.md length (via addyosmani.com/agents/15-agents-md)
- GitGuardian vibe-coding guardrails: https://blog.gitguardian.com/automated-guard-rails-for-vibe-coding/
-->
