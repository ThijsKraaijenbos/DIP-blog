# Kickback

Personal blog about the Dutch uptempo, rawstyle and rawtempo scene. Live at <https://www.kickbacknl.app>.

Astro + Tailwind, deployed on Vercel: every push to `main` goes live. See `docs/DEPLOY.md` and `docs/DESIGN-SYSTEM.md`.

```sh
npm run dev     # local preview at http://localhost:4321
npm run check   # must show 0 errors
npm run build   # must pass before every push
```

## Writing a post

1. Copy `src/content/blog/_template.mdx` to a new file. The file name becomes the URL, so use lowercase words with dashes: `rebirth-2027-review.mdx` → `/blog/rebirth-2027-review/`.
2. Put the hero image in `src/assets/images/` and point `heroImage.src` at it.
3. Fill in the frontmatter, write the text, run `npm run build`, push.

Rules for every post (they come from the rubric):

- **One H1 only.** The title is the H1, so sections start with `##` and subsections with `###`. The build fails if you use `#`.
- **SEO fields.** `metaTitle` under 60 characters (optional, falls back to `title`) and `description` 120 to 160 characters with the main keyword in it.
- **Images.** Every image needs `alt` (what is in it), a `caption` and a `credit` line: `Photo: own photo`, `Image generated with ChatGPT (OpenAI, 2026)` or `Photo: name / source`. Credit third parties with `creditUrl`.
- **Links.** At least 6 per post, internal and external mixed. Link to your other posts in the text and put sources in `sources`.
- **Scannable.** Short paragraphs, a heading every few paragraphs, bullet lists where it helps.
- **Reviews.** Add `verdict.scores` (1 to 10) for the categories you can judge: lineup, atmosphere, sound, location, facilities, logistics, decoration, price.
- **Your own voice.** Write from your own experience. AI can help you plan, never paste its text.
- The CTA block, related posts and older/newer links are added to every post automatically. Their texts live in `src/data/copy.ts`.
- `draft: true` keeps a post off the live site while you work on it.

## Open TODOs

- **About page "Start here":** once the first posts are live, add 2–3 links to your best posts (template is in a comment in `src/pages/about.mdx`), finish the unfinished sentence in "Who I am", then remove `noindex: true`.
