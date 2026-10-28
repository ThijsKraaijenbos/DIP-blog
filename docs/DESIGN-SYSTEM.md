# Design system: Kickback

See it live at **`/styleguide`**. This doc explains what each token is for and why it exists.

## Direction

A dark rave-flyer / industrial look, kept simple. Two signature elements carry the identity:

1. **Lasers**: thin, flat lines fanning from one point.
2. **The sigil**: a symmetrical, spiky ornament made of tapered thorns (inspired by death-metal logos and cyber-sigilism).

Everything else stays quiet: flat colours, sharp corners, hard 1px borders, no shadows, no gradients, no glow.

## Colour roles

There are three roles. Components use the **role names**, never raw hex values.

| Token (Tailwind class) | Value | Contrast on bg | Use |
|---|---|---|---|
| `bg` | `#060606` | – | Page background |
| `surface` | `#111112` | – | Raised blocks (CTA, callouts) |
| `line` | `#2b2a29` | 1.4:1 | Hairline borders (decorative) |
| `line-strong` | `#4a4845` | 2.2:1 | Input & secondary-button borders |
| `fg` | `#f2efe8` | 17.6:1 | Body text |
| `muted` | `#a8a49c` | 8.2:1 | Secondary text, metadata |
| `subtle` | `#85817a` | 5.2:1 | Placeholders, fine print |
| `action` | `#ff2a1a` | 5.4:1 | Links. Constant across the whole site |
| `cta` / `cta-ink` | red / `#060606` | 5.4:1 | Primary button fill + its text |
| `atmo` | theme colour | varies | Lasers, sigil, tag borders, dividers, selection |
| `atmo-text` | generated tint | ≥ 5:1 | Any *text* in the atmosphere colour |

Why some choices were made:
- **Black text on red buttons.** White on `#ff2a1a` is only 3.75:1 and fails AA. Black is 5.4:1.
- **The `atmo` / `atmo-text` split.** UV violet `#7a3cff` is only 3.8:1 on black. That's fine for lines and big shapes (non-text needs 3:1), but too low for small text. So every theme gets an automatically generated lighter tint for text.
- I bumped `subtle` from the first proposal (`#77736c`, 4.3:1) so it passes AA too.

## Type

| Role | Font | Where |
|---|---|---|
| Display | **Anton**, uppercase, line-height 0.95 | h1–h3, logo, big numbers |
| Metadata | **Space Mono**, xs, uppercase, tracked (`.meta` utility) | dates, venue, genre, read time, tags, labels |
| Body | **Source Serif 4** (variable), 17px / 1.65 | Articles and paragraphs |

Source Serif 4 was chosen for the body because long reviews read better in a sturdy serif. It also contrasts with the condensed Anton and the mono labels, and it's not Inter.

The scale (`text-xs` … `text-5xl`) uses a fixed 1.25-ish ratio for text. The top three sizes are fluid (`clamp()`), so headlines are huge on desktop without overflowing at 375px.

All fonts are self-hosted with Fontsource and imported in `src/layouts/BaseLayout.astro`. Nothing loads from Google.

## Spacing, radii, motion

- **Spacing:** Tailwind's default 4px scale (`p-2` = 8px, `gap-6` = 24px …). No custom spacing tokens, because we don't need them.
- **Radii:** `rounded-none` (0), `rounded-xs` (1px), `rounded-sm` (2px). Nothing rounder.
- **Motion:** `--duration-fast` 120ms (hovers), `--duration-base` 200ms, `--duration-sweep` 14s (laser sweep). Every animation is switched off under `prefers-reduced-motion`.

## Components

| Component | File | Notes |
|---|---|---|
| Sigil (KB icon) | `src/components/ui/Sigil.astro` | Draws the KB icon inline so it takes the theme colour. Props: `size` (height), `tone` (`atmo` / `fg` / `watermark`), `label`. Decorative by default (`aria-hidden`). |
| Logo | `src/components/ui/Logo.astro` | Custom KICKBACK wordmark in UV violet (`public/brand/kickback-logo.svg`). The KB icon (`kickback-icon.svg`) is the favicon. PNG copies in `public/brand/` are for emails, since email apps don't show SVG. |
| LaserDivider | `src/components/layout/LaserDivider.astro` | 1px atmosphere line, with an optional small sigil mark. |
| LaserHero | `src/components/layout/LaserHero.astro` | SVG laser fan behind any content (two red beams). One slow sweep. |
| FeatureHero | `src/components/layout/FeatureHero.astro` | Home/post hero: left-aligned headline, meta row, **one** CTA. |
| Button | `src/components/ui/Button.astro` | `primary` (CTA colour) or `secondary` (outline). At least 44px tall. |
| Tag | `src/components/ui/Tag.astro` | Genre tags automatically use their genre colour. |
| PostCard | `src/components/ui/PostCard.astro` | Hard-bordered teaser with a sigil watermark. The whole card is clickable. |
| Figure | `src/components/ui/Figure.astro` | Optimised image + caption + **required** credit. |
| Callout | `src/components/ui/Callout.astro` | Aside with a text label (colour is never the only cue). |
| CommunityCTA | `src/components/ui/CommunityCTA.astro` | Discord (primary), WhatsApp (secondary), small notify form. |

### Sigil rules
Spiky and sharp, **never** satanic. That means no pentagrams or 5-point stars, inverted crosses, horns, goats, skulls, runes or occult letters. The thorn count is always mirrored and even, so it can't form a pentagram. When you edit `THORNS`, check the result on `/styleguide`.

### Laser rules
Lasers appear **only** in the home/post hero and as 1px dividers. Don't use them as card backgrounds or section fills.

## Theming

File: `src/themes.ts`

```ts
uptempo: { label: 'Uptempo', kind: 'genre', atmosphere: '#c6ff1a' },
'event-dominator': { label: 'Dominator (placeholder)', kind: 'event', atmosphere: '#e01e1e', ctaOverride: '#f2efe8' },
```

How it works:
1. `global.css` defines `--atmo`, `--atmo-text`, `--cta` and `--cta-ink` on `:root` (the defaults).
2. Tailwind tokens point at those variables (`--color-atmo: var(--atmo)`, using `@theme inline`).
3. `themeStyle('uptempo')` returns an inline style string, for example `--atmo:#c6ff1a;--atmo-text:#c6ff1a`. Put it on any wrapper element and everything inside changes colour. No class changes are needed.
4. `textSafeTint()` mixes the colour toward white until it reaches **5:1** on the background (AA needs 4.5; the extra margin helps the thin mono text). This is computed in TypeScript, so the contrast is guaranteed and shown on the style guide. It isn't left to `color-mix()` in the browser.
5. `ctaOverride` is used when an event colour clashes with the red CTA. The Dominator placeholder is red itself, so its CTA becomes off-white.

What a theme may change: **only the atmosphere colour** (and the CTA colour in a clash). Layout, fonts, logo, navigation, background and CTA position never change. Themes are colours only, so never recreate event logos or artwork.

**Add a new event theme:** add one line to `THEMES` (with a key like `event-qlimax`), then check its row in the contrast table on `/styleguide`. Posts can use it once Phase 4 adds the `theme` frontmatter field.

## Anti-patterns (don't)
Purple/blue gradients, glassmorphism, glow or neon blur, drop shadows, Inter, emoji icons, identical rounded card grids, a centred hero with two buttons.
