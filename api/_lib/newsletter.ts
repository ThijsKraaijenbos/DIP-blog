// Shared code for the newsletter sign-up (double opt-in) via Resend.
// Files in api/ starting with _ are helpers, not public endpoints.
//
// Needs one environment variable in Vercel (Settings → Environment Variables):
//   RESEND_API_KEY   a Resend API key with full access (contacts need it). Never commit it.
import { createHmac, timingSafeEqual } from 'node:crypto';

export const SITE_URL = 'https://www.kickbacknl.app';
export const FROM = 'Kickback <newsletter@kickbacknl.app>';
export const REPLY_TO = 'info@kickbacknl.app';
// Resend segment that holds confirmed subscribers (not a secret). Set after creating it in Resend.
export const SEGMENT_ID = '';
// Confirmation links stop working after 7 days.
export const LINK_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const apiKey = () => {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');
  return key;
};

export const isEmail = (v: unknown): v is string =>
  typeof v === 'string' && v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

const b64url = (s: string | Buffer) => Buffer.from(s).toString('base64url');

/** Signed, expiring token so only the owner of the inbox can confirm. */
export function sign(email: string, ts: number): string {
  return b64url(createHmac('sha256', apiKey()).update(`${email.toLowerCase()}|${ts}`).digest());
}

export function verify(email: string, ts: number, token: string): boolean {
  if (!Number.isFinite(ts) || Date.now() - ts > LINK_MAX_AGE_MS || ts > Date.now() + 60_000) return false;
  const a = Buffer.from(sign(email, ts));
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function confirmUrl(email: string): string {
  const ts = Date.now();
  const q = new URLSearchParams({ e: b64url(email.toLowerCase()), ts: String(ts), t: sign(email, ts) });
  return `${SITE_URL}/api/confirm?${q}`;
}

export const decodeEmail = (e: string | null) => (e ? Buffer.from(e, 'base64url').toString('utf8') : '');

/** Call the Resend REST API. Returns the parsed JSON body and status. */
export async function resend(path: string, init: { method: string; body?: unknown; idempotencyKey?: string }) {
  const headers: Record<string, string> = { Authorization: `Bearer ${apiKey()}`, 'Content-Type': 'application/json' };
  if (init.idempotencyKey) headers['Idempotency-Key'] = init.idempotencyKey;
  const res = await fetch(`https://api.resend.com${path}`, {
    method: init.method,
    headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export function redirect(path: string, status = 303): Response {
  return new Response(null, { status, headers: { Location: `${SITE_URL}${path}`, 'Cache-Control': 'no-store' } });
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** The confirmation email, in the Kickback style (inline styles: email apps ignore stylesheets). */
export function confirmEmail(link: string) {
  const subject = 'Confirm your Kickback subscription';
  const text = [
    'Hey,',
    '',
    'Someone (hopefully you) signed up for the Kickback newsletter with this address.',
    'Confirm here to start getting new rave reviews:',
    link,
    '',
    "Didn't sign up? Ignore this email and nothing happens.",
    '',
    'Kickback · kickbacknl.app',
  ].join('\n');
  const html = `<!doctype html><html><body style="margin:0;background:#060606;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;color:#f2efe8">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;border:1px solid #2b2a29;background:#111112">
<tr><td style="padding:28px 28px 8px;border-bottom:2px solid #7a3cff" align="center">
<a href="${SITE_URL}"><img src="${SITE_URL}/brand/kickback-logo-email.png" alt="Kickback" width="220" style="width:220px;max-width:100%;height:auto;border:0;display:block"></a>
</td></tr>
<tr><td style="padding:28px">
<p style="margin:0 0 16px;font-size:17px;line-height:1.6">Hey,</p>
<p style="margin:0 0 24px;font-size:17px;line-height:1.6">Someone (hopefully you) signed up for the Kickback newsletter with this address. Confirm to start getting new rave reviews.</p>
<p style="margin:0 0 24px"><a href="${esc(link)}" style="display:inline-block;background:#ff2a1a;color:#060606;font-family:'Courier New',monospace;font-weight:bold;font-size:14px;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:14px 22px">Confirm subscription</a></p>
<p style="margin:0;font-size:14px;line-height:1.6;color:#a8a49c">Didn't sign up? Ignore this email and nothing happens. The link works for 7 days.</p>
</td></tr>
<tr><td style="padding:16px 28px;border-top:1px solid #2b2a29;font-family:'Courier New',monospace;font-size:12px;color:#85817a">Kickback · <a href="${SITE_URL}" style="color:#ff5a4d">kickbacknl.app</a></td></tr>
</table></td></tr></table></body></html>`;
  return { subject, text, html };
}
