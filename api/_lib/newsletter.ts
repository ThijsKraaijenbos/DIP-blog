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
export const SEGMENT_ID = '4db4d0da-f35f-470c-9f3b-bb09e3678b2a';
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

// The confirmation email is a Resend template (Resend → Templates), so its text and design can be
// changed there without touching code. A copy of its HTML lives in docs/email/confirmation-mail.html.
// The template must be published, have this alias, a subject, and one variable: CONFIRM_URL.
export const CONFIRM_TEMPLATE = 'confirmation-mail';
