# Deploying to Vercel

The site is plain static HTML (`output: 'static'`), so Vercel just runs `npm run build` and serves the `dist/` folder. No adapter needed.

## One-time setup

1. Create a token at <https://vercel.com/account/tokens> (scope: your personal account).
2. Store it as the `VERCEL_TOKEN` environment variable. Never paste it into a file in this repo, a commit or a chat.
3. Check it works:
   ```sh
   npx vercel whoami --token "$VERCEL_TOKEN"
   ```
   It should print your Vercel username. `User not found` means the token is wrong, expired or revoked: make a new one.
4. Link this folder to a Vercel project (creates `.vercel/`, which is git-ignored):
   ```sh
   npx vercel link --yes --project dip-blog --token "$VERCEL_TOKEN"
   ```

## Every deploy

Always build locally first. If the build fails here, it fails on Vercel too.

```sh
npm run check   # 0 errors
npm run build
npx vercel deploy --token "$VERCEL_TOKEN"          # preview URL, safe to share for feedback
npx vercel deploy --prod --token "$VERCEL_TOKEN"   # live site
```

## Rolling back a change

Every push is a commit, so an older version can always come back.

- **Fastest (site only):** in Vercel, open the project, go to **Deployments**, pick an older
  deployment and choose **Instant Rollback**. The code on GitHub stays as it is.
- **Code too:** ask Claude to revert the commit, for example "revert the two-CTA home hero".

Saved versions worth knowing:

| Version | Commit |
|---|---|
| Home hero with one button + small newsletter link (before the two-CTA hero) | `a34cd15` |

## The site URL

`site` in `astro.config.mjs` and `SITE.url` in `src/consts.ts` are both `https://www.kickbacknl.app` (the custom domain; `kickbacknl.app` redirects to www). If the domain ever changes, change **both** so canonical links, the sitemap and RSS point to the right place.

## Alternative: deploy from GitHub

In the Vercel dashboard choose *Add New → Project*, import the `DIP-blog` repo and keep the detected Astro defaults. Every push to `main` then deploys to production and every other branch gets a preview URL. No token needed.
