// GET /api/confirm?e=…&ts=…&t=…  (the link in the confirmation email)
// Checks the signed link, then adds the address to Resend as a subscribed contact.
import { decodeEmail, isEmail, verify, resend, redirect, SEGMENT_ID } from './_lib/newsletter.js';

export async function GET(request: Request): Promise<Response> {
  const q = new URL(request.url).searchParams;
  const email = decodeEmail(q.get('e'));
  const ts = Number(q.get('ts'));
  const token = q.get('t') ?? '';

  if (!isEmail(email) || !verify(email, ts, token)) return redirect('/subscribe/error/?reason=link', 302);

  const segments = SEGMENT_ID ? [{ id: SEGMENT_ID }] : undefined;
  let r = await resend('/contacts', { method: 'POST', body: { email, unsubscribed: false, segments } });

  // Already a contact (e.g. unsubscribed earlier and signing up again): resubscribe and add to the segment.
  if (!r.ok) {
    r = await resend(`/contacts/${encodeURIComponent(email)}`, { method: 'PATCH', body: { unsubscribed: false } });
    if (r.ok && SEGMENT_ID) {
      await resend(`/contacts/${encodeURIComponent(email)}/segments/${SEGMENT_ID}`, { method: 'POST' });
    }
  }

  if (!r.ok) {
    console.error('confirm: Resend error', r.status, JSON.stringify(r.data));
    return redirect('/subscribe/error/', 302);
  }
  return redirect('/subscribe/confirmed/', 302);
}
