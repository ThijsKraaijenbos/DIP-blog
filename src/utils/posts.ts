import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Published posts, newest first. Drafts only show up in `npm run dev`. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Drafts, only in a production build (they get a "not written yet" page). Empty in dev, where drafts show for real. */
export async function getDrafts(): Promise<Post[]> {
  if (import.meta.env.DEV) return [];
  return getCollection('blog', ({ data }) => data.draft);
}

export const postUrl = (post: Post) => `/blog/${post.id}/`;

/** Rough read time at 220 words per minute. */
export function readTime(body = ''): string {
  const words = body.replace(/<[^>]+>|[#>*_`\-[\]()!]/g, ' ').split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

export const formatDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

/**
 * "Read next" posts: the ones picked in `related`, then posts sharing the category,
 * genre or tags, then the newest posts. Never the post itself.
 */
export function relatedPosts(post: Post, all: Post[], count = 3): Post[] {
  const others = all.filter((p) => p.id !== post.id);
  const picked = post.data.related.map((id) => others.find((p) => p.id === id)).filter((p): p is Post => !!p);
  const score = (p: Post) =>
    (p.data.category === post.data.category ? 2 : 0) +
    (post.data.genre && p.data.genre === post.data.genre ? 2 : 0) +
    p.data.tags.filter((t) => post.data.tags.includes(t)).length;
  const rest = others.filter((p) => !picked.includes(p)).sort((a, b) => score(b) - score(a)); // stable: newest first on ties
  return [...picked, ...rest].slice(0, count);
}

/**
 * Splits the title into plain and accented parts (frontmatter `titleAccent`: one phrase or a list, in title order).
 * Used by the post header and the social preview image, so both colour the same words.
 */
export function titleParts(post: Post): { text: string; accent: boolean }[] {
  const parts: { text: string; accent: boolean }[] = [];
  let rest = post.data.title;
  for (const phrase of [post.data.titleAccent ?? []].flat()) {
    const at = rest.indexOf(phrase);
    if (at < 0) throw new Error(`titleAccent "${phrase}" is not in the title of "${post.id}" (or not in title order).`);
    if (at > 0) parts.push({ text: rest.slice(0, at), accent: false });
    parts.push({ text: phrase, accent: true });
    rest = rest.slice(at + phrase.length);
  }
  if (rest) parts.push({ text: rest, accent: false });
  return parts;
}

/**
 * Social preview image for a post (made by src/pages/og/[slug].jpg.ts).
 * `?v=` changes whenever something on the card changes, so Discord, WhatsApp etc. fetch the new picture
 * instead of their cached copy. Bump OG_VERSION after changing the card design itself.
 */
const OG_VERSION = 1;
export function ogImagePath(post: Post): string {
  const d = post.data;
  const key = JSON.stringify([OG_VERSION, d.title, d.titleAccent, d.theme, d.category, d.pubDate, d.heroImage.src.src]);
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return `/og/${post.id}.jpg?v=${h.toString(36)}`;
}
