// Social preview image per post (Discord, WhatsApp, X…): looks like the post header.
// Darkened hero photo, the meta row, the title with its accent colour, and the KICKBACK logo in white.
// Built once at build time (static), served at /og/<slug>.jpg. Linked from PostLayout via ogImagePath().
import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import satori from 'satori';
import type { ReactNode } from 'react';
import sharp from 'sharp';
import { CATEGORIES } from '@/consts';
import { themeColors } from '@/themes';
import { getPosts, titleParts, formatDate, readTime, type Post } from '@/utils/posts';

const W = 1200;
const H = 630;
const PAD = 64;
const BG = '#060606';
const FG = '#f2efe8';
const MUTED = '#a8a49c';
const DARKEN = 0.8; // same 80% black layer as the post header (LaserHero)

export const getStaticPaths = (async () =>
  (await getPosts()).map((post) => ({ params: { slug: post.id }, props: { post } }))) satisfies GetStaticPaths;

// Fonts and logo are loaded once per build. Satori reads .woff (not .woff2).
const file = (p: string) => readFile(new URL(`../../../${p}`, import.meta.url));
const assets = Promise.all([
  file('node_modules/@fontsource/anton/files/anton-latin-400-normal.woff'),
  file('node_modules/@fontsource/space-mono/files/space-mono-latin-400-normal.woff'),
  file('public/brand/kickback-logo.svg'),
]);

// Picks the biggest title size that fits the space (Anton is narrow: about 0.47em per character on average).
function titleSize(words: string[], maxW: number, maxH: number): number {
  for (let size = 112; size > 48; size -= 4) {
    let lines = 1;
    let width = 0;
    for (const w of words) {
      const ww = w.length * size * 0.47;
      const add = width === 0 ? ww : width + size * 0.22 + ww;
      if (add > maxW && width > 0) { lines++; width = ww; } else width = add;
    }
    if (lines * size * 0.95 <= maxH) return size;
  }
  return 48;
}

export const GET: APIRoute = async ({ props }) => {
  const post = (props as { post: Post }).post;
  const d = post.data;
  const colors = themeColors(d.theme);
  const [anton, mono, logoSvg] = await assets;

  // Background: hero photo cropped to 1200×630 with the same darkening as the site header.
  const src = (d.heroImage.src as { fsPath?: string }).fsPath;
  if (!src) throw new Error(`og image: can't find the hero image file for "${post.id}".`);
  const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="${BG}" fill-opacity="${DARKEN}"/></svg>`);

  // Logo: the brand SVG, recoloured to the off-white text colour for this card only.
  const logoH = 72;
  const logo = await sharp(Buffer.from(logoSvg.toString().replaceAll('#7a3cff', FG)), { density: 300 })
    .resize({ height: logoH }).png().toBuffer();

  // Title, split into words; a word can mix colours ("2026:" = accent "2026" + plain ":"), so each word is a row of coloured runs.
  type Run = { text: string; accent: boolean };
  const words: Run[][] = [[]];
  for (const part of titleParts(post)) {
    part.text.toUpperCase().split(/(\s+)/).forEach((chunk) => {
      if (/^\s+$/.test(chunk)) { if (words.at(-1)!.length) words.push([]); }
      else if (chunk) words.at(-1)!.push({ text: chunk, accent: part.accent });
    });
  }
  if (!words.at(-1)!.length) words.pop();
  const size = titleSize(words.map((w) => w.map((r) => r.text).join('')), W - PAD * 2, H - PAD * 2 - logoH - 110);

  const meta = [
    { text: CATEGORIES[d.category], color: colors.atmoText },
    { text: formatDate(d.pubDate), color: MUTED },
    { text: readTime(post.body), color: MUTED },
  ];
  // Satori takes React-style elements; plain objects avoid needing JSX in a .ts file.
  const el = (type: string, style: Record<string, unknown>, children: unknown) => ({ type, props: { style, children } }) as unknown as ReactNode;
  const textLayer = await satori(
    el('div', { width: W, height: H, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: PAD }, [
      el('div', { display: 'flex', gap: 28, fontFamily: 'Space Mono', fontSize: 22, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 24 },
        meta.map((m) => el('span', { color: m.color }, m.text))),
      el('div', { display: 'flex', flexWrap: 'wrap', fontFamily: 'Anton', fontSize: size, lineHeight: 0.95, columnGap: size * 0.22 },
        words.map((w) => el('div', { display: 'flex' }, w.map((r) => el('span', { color: r.accent ? colors.action : FG }, r.text))))),
    ]),
    { width: W, height: H, fonts: [
      { name: 'Anton', data: anton, weight: 400, style: 'normal' },
      { name: 'Space Mono', data: mono, weight: 400, style: 'normal' },
    ] },
  );

  const jpg = await sharp(src)
    .resize(W, H, { fit: 'cover' })
    .composite([
      { input: overlay },
      { input: Buffer.from(textLayer) },
      { input: logo, top: PAD, left: PAD },
    ])
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(jpg), { headers: { 'Content-Type': 'image/jpeg' } });
};
