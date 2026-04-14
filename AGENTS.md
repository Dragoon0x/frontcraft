# frontcraft — Agent Instructions

This repository contains the **frontcraft** skill — the definitive frontend craft specification with 324 rules across 20 categories.

## Repository Structure

```
frontcraft/
├── skills/frontcraft/
│   ├── SKILL.md          # The skill file (324 rules, 20 categories)
│   └── metadata.json     # Skill metadata
├── src/                  # npm package source (TypeScript utilities)
│   ├── core/             # Utility modules
│   ├── types.ts          # Type definitions
│   └── index.ts          # Main export
├── test/                 # Test suite (86 tests)
├── docs/                 # Landing page (GitHub Pages)
├── AGENTS.md             # This file
├── package.json
├── tsconfig.json
└── README.md
```

## Key Rules

- The SKILL.md is the primary product. Every rule must have a unique kebab-case name, a priority (CRITICAL/HIGH/MEDIUM/LOW), and a measurable threshold with production code.
- Rule names follow the pattern: `category-specific-detail` (e.g., `motion-duration-cap`, `a11y-contrast-aa`).
- Never add rules without thresholds. "Make it good" is not a rule. "Transitions under 500ms" is.
- When adding new rules, update the Rule Index and Priority Distribution tables at the bottom of SKILL.md.
- The npm package in `src/` provides utility functions that validate rules programmatically. Every utility must have tests.

## Install

```bash
npx skills add Dragoon0x/frontcraft
```
