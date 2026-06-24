# Reform's Skills

A curated collection of [Agent Skills](https://agentskills.io/home) reflecting [reformovo](https://github.com/reformovo)'s preferences, experience, and best practices, along with usage documentation for the tools.

> [!IMPORTANT]
> This is a proof-of-concept project for generating agent skills from source documentation and keeping them in sync.
> Feedback and contributions are greatly welcome.

## Installation

```bash
pnpx skills add reformovo/skills --skill='*'
```

or to install all of them globally:

```bash
pnpx skills add reformovo/skills --skill='*' -g
```

Learn more about the CLI usage at [skills](https://github.com/vercel-labs/skills).

## Skills

### Hand-maintained Skills

> Opinionated

Manually maintained with preferred tools, setup conventions, and best practices.

| Skill | Description |
|-------|-------------|
| [reform](skills/reform) | Efficient vibe coding workflow: AI coding constraints (AGENTS.md, skills, mechanical gates), scope locking, verify-don't-trust gates, and review-with-understanding practices |

### Skills Generated from Official Documentation

> Unopinionated but with tilted focus (e.g. TypeScript, ESM, Composition API, and other modern stacks)

Generated from official documentation.

| Skill | Description | Source |
|-------|-------------|--------|
| [cpp-best-practices](skills/cpp-best-practices) | Google C++ Style Guide distilled for agents: headers, scoping, classes, ownership, error handling, type safety, naming, comments, and formatting | [google/styleguide](https://github.com/google/styleguide) |
| [typescript-best-practices](skills/typescript-best-practices) | Google TypeScript Style Guide distilled for agents: source file structure, imports/exports, classes, functions, type system, naming, JSDoc, control flow, equality, and disallowed features | [google/styleguide](https://github.com/google/styleguide) |

### Vendored Skills

Synced from external repositories that maintain their own skills.

| Skill | Description | Source |
|-------|-------------|--------|
| [vue-best-practices](skills/vue-best-practices) | Vue 3 best practices: Composition API with `<script setup>` + TypeScript, reactivity, SFC structure, component data flow, composables, and performance optimization | [vuejs-ai/skills](https://github.com/vuejs-ai/skills) |
| [react-best-practices](skills/react-best-practices) | React and Next.js performance optimization: eliminating waterfalls, bundle size, server-side rendering, re-render optimization, and JavaScript performance | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) |
| [antfu](skills/antfu) | Anthony Fu's opinionated tooling and conventions: ESLint config, project setup, Vue/Nuxt/UnoCSS app development, library publishing, and monorepos | [antfu/skills](https://github.com/antfu/skills) |
| [antfu-design](skills/antfu-design) | antfu-style design conventions: UnoCSS-first semantic tokens with dual light/dark, design-read briefs, anti-slop rules, and micro-interaction polish for tooling, devtools, and product UIs | [antfu/skills](https://github.com/antfu/skills) |

## FAQ

### What Makes This Collection Different?

This collection uses git submodules to directly reference source documentation. This provides more reliable context and allows the skills to stay up-to-date with upstream changes over time.

The project is also designed to be flexible - you can use it as a template to generate your own skills collection.

### Skills vs llms.txt vs AGENTS.md

To me, the value of skills lies in being **shareable** and **on-demand**.

Being shareable makes prompts easier to manage and reuse across projects. Being on-demand means skills can be pulled in as needed, scaling far beyond what any agent's context window could fit at once.

You might hear people say "AGENTS.md outperforms skills". I think that's true — AGENTS.md loads everything upfront, so agents always respect it, whereas skills can have false negatives where agents don't pull them in when you'd expect. That said, I see this more as a gap in tooling and integration that will improve over time. Skills are really just a standardized format for agents to consume—plain markdown files at the end of the day. Think of them as a knowledge base for agents. If you want certain skills to always apply, you can reference them directly in your AGENTS.md.

## Generate Your Own Skills

Fork this project to create your own customized skill collection.

1. Fork or clone this repository
2. Install dependencies: `pnpm install`
3. Update `meta.ts` with your own projects and skill sources
4. Run `pnpm start cleanup` to remove existing submodules and skills
5. Run `pnpm start init` to clone the submodules
6. Run `pnpm start sync` to sync vendored skills
7. Ask your agent to `Generate skills for \<project\>` (recommended one at a time to manage token usage)

See [AGENTS.md](AGENTS.md) for detailed generation guidelines.

## License

Skills and the scripts in this repository are [MIT](LICENSE.md) licensed.

Vendored skills from external repositories retain their original licenses - see each skill directory for details.
