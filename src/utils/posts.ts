import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Published posts, newest first. Drafts only show up in `npm run dev`. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
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
