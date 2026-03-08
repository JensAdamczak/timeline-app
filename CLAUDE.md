# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server**: `npm run dev` (Vite HMR)
- **Build**: `npm run build` (runs `tsc -b && vite build`, output in `dist/`)
- **Preview production build**: `npm run preview`
- No test runner or linter is configured.

## Environment Constraints

- macOS 11.7 (Big Sur) — esbuild binaries for Vite v7+ require macOS 12+, so this project uses **Vite 5.4.x**
- **TypeScript 5.6** — `verbatimModuleSyntax` and `erasableSyntaxOnly` are unavailable; use `isolatedModules` instead
- **React 18** with `@vitejs/plugin-react` (Babel-based)

## Architecture

This is a single-page timeline visualization app. Events are defined in a markdown file, parsed at runtime, and rendered as a proportionally-positioned horizontal timeline.

### Data flow

1. `App.tsx` fetches `/events.md` on mount via `fetch()`
2. `parser.ts` parses the raw text into a sorted `TimelineEvent[]` using regex (supports single-day `YYYY-MM-DD [type] desc` and multi-day `YYYY-MM-DD to YYYY-MM-DD [type] desc` formats)
3. `colors.ts` assigns deterministic colors: unique types are sorted alphabetically and mapped to a 10-color palette
4. `Timeline.tsx` computes proportional positions from the full date range and renders events alternating above/below the axis
5. Multi-day events render as ellipse bars spanning their date range; single-day events render as dot markers

### Key patterns

- **Event positioning**: CSS custom properties (`--event-position`, `--span-width`) set as percentages based on timestamp math in `Timeline.tsx`
- **Responsive layout**: On mobile (<=768px), the entire timeline container is CSS-rotated 90deg to become vertical, with labels counter-rotated back to horizontal
- **Legend**: Shown via a hover-reveal popup (CSS `:hover` on `.legend-toggle`, no JS state)
- **Date formatting**: `formatDate()` lives in `colors.ts` (not a separate utils file) — produces "Jan 15, 2025" format

### Timeline data format (`public/events.md`)

```
2025-01-10 [personal] Adopted a rescue dog
2025-02-14 to 2025-02-21 [travel] Ski trip in the Swiss Alps
```

The parser ignores headings and blank lines. Type tags are freeform strings in brackets.
