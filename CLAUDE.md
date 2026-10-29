# Kickback — project rules for Claude

Personal blog about the Dutch hardcore scene (uptempo, rawstyle / Xtra raw, rawtempo; no terror).
School assignment (Digital Individual Portfolio "Blog"), deadline ~1 Nov 2026. Semi-working prototype, not a product.
Audience: ravers 18–30. Language: English. The owner is new to Astro: explain things in `docs/`, not in long chat messages.

## Keep it simple (YAGNI)
- Build only what a phase asks for. No speculative abstractions, no extra libraries.
- **Approved, not over-engineering:** Base UI, Fontsource, the theming system (`src/themes.ts`) and the design details below.
- Prefer plain `.astro` components (zero JS). Use a React island only when something is truly interactive.
- Prefer native HTML (`<details>`, `<dialog>`) over a Base UI component when it's enough.

## Stack
- Astro 7 + TypeScript (strict), static output, deployed on Vercel (no adapter).
- Tailwind CSS v4 via `@tailwindcss/vite`. Tokens live in `src/styles/global.css` under `@theme`.
- MDX + content collections (`src/content.config.ts`, Zod schema).
- `@astrojs/sitemap`, `@astrojs/rss`, `@astrojs/react` (islands only).
- Base UI (`@base-ui/react`, headless) for mobile nav, share popover, optional lightbox. Style with our tokens. **Never** shadcn/ui or any pre-styled library.
- Fonts via Fontsource: Anton (display), Space Mono (metadata/labels), Source Serif 4 (body).
- TypeScript is pinned to v6 because `astro check` does not support TS 7 yet.

## Commands
- `npm run dev` — local dev server (http://localhost:4321)
- `npm run build` — production build into `dist/` (must pass before every push)
- `npm run check` — type-check `.astro`/`.ts` files (must have 0 errors)

## Folder map
```
src/
  consts.ts            site name, URL, analytics IDs, community links (single source of truth)
  themes.ts            genre + event colour presets
  content.config.ts    content collection schema
  content/blog/        posts (.mdx); files starting with _ are ignored
  components/ui/       small presentational pieces (Sigil, Logo, Tag, Button…)
  components/layout/   header, footer, hero, dividers
  components/post/     post-only pieces (TOC, author box, related posts…)
  components/islands/  React islands (the only place with client JS)
  layouts/             BaseLayout, PostLayout
  pages/               file-based routes
  styles/global.css    Tailwind import + @theme tokens
  assets/images/       images processed by astro:assets
  data/                JSON/TS data (rave log)
docs/                  beginner docs (DEPLOY, DESIGN-SYSTEM, NEWSLETTER; email/ holds the Resend template HTML). Writing a post: README.md
```

## Skills — when to use which (in `.claude/skills/`)
- **ui-ux-pro-max**: refine/validate the design system (contrast, type scale, spacing). Never replace the decided direction.
- **frontend-design**: whenever building UI.
- **impeccable**: audit every page after building it; fix what it flags.
- **web-design-guidelines**: final accessibility/UX review.

## Design rules
- Dark rave-flyer / industrial look, kept simple. Signatures: **lasers** and a **spiky sigil** ornament.
- Base: near-black bg, off-white text, greys for secondary text.
- **Action** role = red: buttons, links, primary CTA. Constant site-wide.
- **Atmosphere** role = UV violet by default: lasers, sigil highlights, tags, highlights, dividers. The only themeable role.
- Flat colours only: no purple/blue gradients, no glow, no neon blur, no glassmorphism, no drop shadows.
- Sharp corners (0–2px), hard 1px borders. WCAG AA contrast (use the light tint for small text on black).
- Type: huge uppercase Anton headlines; Space Mono for dates/venue/genre/read time/tags; Source Serif 4 for body.
- Lasers only in home/post hero (SVG, one slow sweep disabled under `prefers-reduced-motion`) and as 1px dividers.
- Sigil: symmetrical, thin tapered thorns. Never demonic/occult (no pentagrams, inverted crosses, horns, goats, skulls, runes).
- Logo: custom KICKBACK wordmark (`public/brand/kickback-logo.svg`) and KB icon (`kickback-icon.svg`), fixed UV violet `#7a3cff`. Only used through `Logo.astro` (site) and the PNGs in `public/brand/` (emails). Themes never recolor it.
- Themes change **only** the atmosphere colour. Never layout, fonts, logo, nav, background or CTA position. Never recreate event logos/artwork.
- Avoid AI-slop tells: gradients, Inter, emoji icons, identical rounded card grids, centred hero with two buttons, shadows everywhere.

## Content rules (graded)
- SEO per page, 6+ internal/external links per post, clear community CTAs, credited images with captions, scannable posts.

## Secrets
- Never print, log, commit or write `VERCEL_TOKEN`. Always pass it as `--token "$VERCEL_TOKEN"`.
