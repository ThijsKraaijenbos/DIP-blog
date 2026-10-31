# Post 1 (REBiRTH 2026 review): changes made in the build chat

File: `src/content/blog/rebirth-festival-2026-review.mdx` (branch `preview/post-1-rebirth`).
Everything else in the post text is unchanged.

## Text changes

1. **Hero image caption**
   - Before: `AI generated recreation of REBiRTH 2026's mainstage. (This is NOT an official REBiRTH photo. Based on a picture I took of the stage)`
   - After: `AI generated recreation of REBiRTH 2026's mainstage. (Disclaimer: this is NOT an official REBiRTH photo. It's based on a picture I took of the stage)`

2. **"in this post" link** (section "The lineup and the sound"), post 2 was renamed:
   - Before: `/blog/uptempo-vs-rawstyle-vs-frenchcore/`
   - After: `/blog/uptempo-vs-rawstyle-vs-zaag/`

## Technical changes (keep these when editing the file)

3. Frontmatter:
   - New line under `title`: `titleAccent: 'REBiRTH 2026'` (shows that phrase in cyan)
   - `related: ['uptempo-vs-rawstyle-vs-zaag']` (was `...-frenchcore`)
   - `draft: false` (preview branch only)
4. New import under the VideoClip import:
   `import MediaSection from '@/components/post/MediaSection.astro';`
5. The section "The lineup and the sound" is wrapped in `<MediaSection>` … `</MediaSection>`
   (opening tag above `## The lineup and the sound`, closing tag below the "Pretty much every stage…"
   paragraph, blank lines around both). This puts the video next to the text on desktop.
   The `<VideoClip>` block stays in its original spot, after the DJ list.
