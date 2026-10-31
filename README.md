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
- `draft: true` keeps a post off the live site while you work on it. Its URL (`/blog/<file-name>/`) already works though: it shows a "this post hasn't been written yet" page with the newsletter sign-up (not in Google or the sitemap), so you can link to planned posts safely. Any other unknown URL shows the 404 page (`src/pages/404.astro`). In `npm run dev` you see the real draft instead.

### Adding a short video

Astro does not optimize video, so put the clip and its poster image in `public/videos/` (for example `public/videos/rebirth-mainstage.mp4` and `rebirth-mainstage.jpg`). Keep each clip under about 5 MB.

In the `.mdx` post, import the component below the frontmatter and use it like `Figure`. The caption goes between the tags, so it can contain a link:

```mdx
import VideoClip from '@/components/ui/VideoClip.astro';

<VideoClip
  src="/videos/rebirth-mainstage.mp4"
  poster="/videos/rebirth-mainstage.jpg"
  label="Crowd jumping under red lasers at the Rebirth mainstage"
  credit="Video: own footage"
>
  The drop of the closing set.
</VideoClip>
```

`label` is read out by screen readers, so describe what happens in the clip. Add `creditUrl` for third-party footage. Clips keep their sound and never autoplay or loop: they start when the reader presses play. The frame is sized for portrait phone clips (540×960, shown max 360px wide); pass `width`/`height` if your clip has a different size.

**Video next to a section's text (desktop):** wrap the whole section (heading, text and the clip) in `<MediaSection>`. On desktop the text goes left and the clip right, centred against the section; on phones everything stays in the order you wrote it, so place the clip where it should appear on a phone. Leave blank lines around the markdown inside:

```mdx
import MediaSection from '@/components/post/MediaSection.astro';

<MediaSection>

## The lineup and the sound

Your text…

<VideoClip … >Caption</VideoClip>

More text…

</MediaSection>
```

Cut a clip to max 20 seconds (here starting at 1:05), scale it to 540px wide and compress it (add `-an` to drop the sound):

```sh
ffmpeg -ss 00:01:05 -i input.mov -t 20 -vf "scale=540:-2" -c:v libx264 -c:a aac -b:a 128k -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart public/videos/rebirth-mainstage.mp4
```

If the file is still over 5 MB, raise `-crf` (30 or 32) or shorten `-t`. Grab the first frame as poster image:

```sh
ffmpeg -i public/videos/rebirth-mainstage.mp4 -frames:v 1 -q:v 3 public/videos/rebirth-mainstage.jpg
```

## Open TODOs

- **About page "Start here":** once the first posts are live, add 2–3 links to your best posts (template is in a comment in `src/pages/about.mdx`), then remove `noindex: true`.
