// Colour presets. A theme ONLY changes the "atmosphere" role (lasers, sigil, tags,
// highlights, dividers) — never layout, fonts, logo, nav, background or CTA position.
// Themes are colours only: never recreate event logos or artwork.

export type ThemePreset = {
  label: string;
  kind: 'genre' | 'event';
  /** Atmosphere colour (hex). Used for lines, lasers, sigil, large text. */
  atmosphere: string;
  /** Optional CTA colour when the atmosphere clashes with the red CTA (e.g. a red event). Buttons only. */
  ctaOverride?: string;
  /** Optional second event colour for the whole action role (links + buttons) when the atmosphere sits too close to red.
   *  Must reach 4.5:1 on the background. Use it instead of ctaOverride, never both. */
  actionOverride?: string;
  /** Optional third event colour, ONLY for review scores (verdict bars + overall score). Must reach 4.5:1 on the background. */
  highlight?: string;
  /** Optional colour per tag on the post page (tag name → hex, each ≥ 4.5:1 on the background). Other tags use the atmosphere. */
  tagColors?: Record<string, string>;
};

export const THEMES = {
  // Genres
  default: { label: 'Default (UV)', kind: 'genre', atmosphere: '#7a3cff' },
  uptempo: { label: 'Uptempo', kind: 'genre', atmosphere: '#c6ff1a' },
  rawstyle: { label: 'Rawstyle', kind: 'genre', atmosphere: '#1ec8ff' },
  rawtempo: { label: 'Rawtempo', kind: 'genre', atmosphere: '#ff9f1a' },
  // Events (placeholders unless noted — edit colours/names freely)
  // REBiRTH: magenta + cyan from rebirth-festival.nl (their site CSS + logo). Magenta is too close to the red links,
  // so cyan takes over links and buttons on REBiRTH posts. Their neon green is the highlight (scores, secondary button).
  'event-rebirth': {
    label: 'REBiRTH', kind: 'event', atmosphere: '#fe0ac0', actionOverride: '#4ffff7', highlight: '#18ff52',
    tagColors: { rebirth: '#fe0ac0', festival: '#4ffff7', review: '#18ff52' },
  },
  'event-dominator': { label: 'Dominator (placeholder)', kind: 'event', atmosphere: '#e01e1e', ctaOverride: '#f2efe8' },
  'event-intents': { label: 'Intents (placeholder)', kind: 'event', atmosphere: '#ff3fb4' },
} satisfies Record<string, ThemePreset>;

export type ThemeKey = keyof typeof THEMES;
export const THEME_KEYS = Object.keys(THEMES) as [ThemeKey, ...ThemeKey[]];
export const GENRES = ['uptempo', 'rawstyle', 'rawtempo'] as const;
export type Genre = (typeof GENRES)[number];

const BG = '#060606';
const CTA_INK = '#060606';

// --- tiny colour helpers (WCAG relative luminance) ---
const toRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const toHex = (rgb: number[]) => '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const lum = (hex: string) => {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrast = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** Text-safe tint: mixes the colour toward white until it reaches 5:1 on the background (WCAG AA is 4.5; the margin helps thin mono text). */
export function textSafeTint(hex: string, min = 5): string {
  const rgb = toRgb(hex);
  for (let t = 0; t <= 1; t += 0.02) {
    const mixed = toHex(rgb.map((v) => v + (255 - v) * t));
    if (contrast(mixed, BG) >= min) return mixed;
  }
  return '#ffffff';
}

/** Inline CSS variables that give one element (e.g. a tag) its own atmosphere colour. */
export const colorStyle = (hex: string) => `--atmo:${hex};--atmo-text:${textSafeTint(hex)}`;

/** Inline CSS variables for a theme. Tailwind tokens (bg-atmo, text-atmo-text, …) read these. */
export function themeStyle(key: ThemeKey = 'default'): string {
  const t: ThemePreset = THEMES[key] ?? THEMES.default;
  const vars = [`--atmo:${t.atmosphere}`, `--atmo-text:${textSafeTint(t.atmosphere)}`];
  if (t.ctaOverride) vars.push(`--cta:${t.ctaOverride}`, `--cta-ink:${CTA_INK}`);
  if (t.highlight) vars.push(`--highlight:${t.highlight}`);
  if (t.actionOverride) {
    const hover = toHex(toRgb(t.actionOverride).map((v) => v + (255 - v) * 0.5));
    vars.push(`--action:${t.actionOverride}`, `--action-hover:${hover}`, `--cta:${t.actionOverride}`, `--cta-ink:${CTA_INK}`);
  }
  return vars.join(';');
}
