# Newsletter (Resend)

## How sign-up works

1. A reader enters their email in the form under a post. It posts to `api/subscribe.ts`.
2. That sends a confirmation email from **newsletter@kickbacknl.app**, using the Resend template **confirmation-mail** (see below).
3. The reader clicks the button. `api/confirm.ts` checks the signed link (valid 7 days) and adds them in Resend as a subscribed contact in the **Newsletter** segment.
4. Nobody is added without clicking, so the list only holds people who really signed up (double opt-in).

Setup that lives outside the code:

- Resend domain `kickbacknl.app` (EU region, sending only; receiving stays **off** so info@/newsletter@ keep forwarding to Gmail via Name.com).
- Vercel environment variable `RESEND_API_KEY` (full access). Never commit or paste it anywhere.
- The form shows only when `NEWSLETTER_ENABLED` is `true` in `src/consts.ts`.
- Free plan: 100 emails a day, 3,000 a month. Confirmation emails count too.

## The confirmation email (Resend template)

The text and design of the confirmation email live in Resend, not in the code. Change them in
Resend → **Templates** → **confirmation-mail**, then publish again. A copy of the HTML is in
`docs/email/confirmation-mail.html` (update it too if you change the template, so there's a backup).

The template needs:
- **Alias:** `confirmation-mail` (the code looks it up by this name).
- **Subject:** `Confirm your Kickback subscription`.
- **Variable:** `CONFIRM_URL`, type string, no fallback. It's the personal confirm link; the button uses `{{{CONFIRM_URL}}}`.
- **Published.** Drafts can't send. If the template is missing or unpublished, sign-ups go to the error page and the reason shows in Vercel → Logs.

## Sending a newsletter

1. Resend → **Broadcasts** → **Create broadcast**.
2. From: `Kickback <newsletter@kickbacknl.app>`. Reply-to: `info@kickbacknl.app`. To: segment **Newsletter**.
3. Subject: the post title or a short hook.
4. Content: logo on top (image URL `https://www.kickbacknl.app/brand/kickback-logo-email.png`), a few lines in your own voice, and a button linking to the post.
5. Footer: always add an unsubscribe link with `{{{RESEND_UNSUBSCRIBE_URL}}}` as the link target. Resend then unsubscribes people automatically.
6. Send a test to yourself first, then send or schedule.

Evidence for the report: Resend → **Metrics** and the broadcast's stats (delivered, opened, clicked), and **Audience** for subscriber count.

## Checking things

- Resend → **Emails**: every confirmation email and its status.
- Resend → **Audience** → segment **Newsletter**: confirmed subscribers.
- Vercel → dip-blog → **Logs**: errors from `api/subscribe` or `api/confirm`.
