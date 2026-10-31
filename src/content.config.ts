import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { THEME_KEYS, GENRES } from '@/themes';
import { CATEGORY_KEYS, VERDICT_KEYS } from '@/consts';

// Every post is an .mdx file in src/content/blog/. The file name is the URL slug
// (lowercase-words-with-dashes.mdx → /blog/lowercase-words-with-dashes/).
// Files starting with _ are ignored. See src/content/blog/_template.mdx and README.md ("Writing a post") for every field.

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/[^_]*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      // Shown on the page (the one H1) and in post lists.
      title: z.string().max(90),
      // Optional: a phrase from the title shown in colour, e.g. 'REBiRTH 2026'. Must match the title exactly.
      titleAccent: z.string().optional(),
      // SEO: what Google shows. Falls back to title. Keep it under ~60 characters.
      metaTitle: z.string().max(60).optional(),
      // SEO: meta description + social preview text. Aim for 120–160 characters.
      description: z.string().min(50).max(170),
      // Short intro under the title (1–2 sentences, your own voice).
      intro: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.enum(CATEGORY_KEYS),
      // Which persona the post is written for (optional, shown as a tag).
      persona: z.string().optional(),
      genre: z.enum(GENRES).optional(),
      theme: z.enum(THEME_KEYS).default('default'),
      tags: z.array(z.string()).default([]),
      heroImage: z.object({
        src: image(),
        alt: z.string().min(10, 'Describe what is in the image (alt text is required).'),
        caption: z.string(),
        // Full credit line, e.g. "Photo: own photo", "Image generated with ChatGPT (OpenAI, 2026)"
        // or "Photo: Jane Doe / Q-dance".
        credit: z.string(),
        creditUrl: z.url().optional(),
      }),
      // Optional review scores (1–10). Leave out for non-review posts.
      verdict: z
        .object({
          scores: z.partialRecord(z.enum(VERDICT_KEYS), z.number().min(1).max(10)),
          summary: z.string().optional(),
        })
        .optional(),
      // External sources and links, shown at the bottom of the post.
      sources: z
        .array(z.object({ title: z.string(), url: z.url(), publisher: z.string().optional() }))
        .default([]),
      // Optional: pick the "read next" posts yourself (file names without .mdx).
      related: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
