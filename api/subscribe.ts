// POST /api/subscribe  (form field: email; "website" is a hidden spam trap)
// Sends a confirmation email. Nobody is added to the list until they click the link.
import { isEmail, confirmUrl, resend, redirect, FROM, REPLY_TO, CONFIRM_TEMPLATE } from './_lib/newsletter.js';

export async function POST(request: Request): Promise<Response> {
  let email = '';
  let trap = '';
  try {
    const form = await request.formData();
    email = String(form.get('email') ?? '').trim();
    trap = String(form.get('website') ?? '');
  } catch {
    return redirect('/subscribe/error/');
  }
  // Bots fill every field: pretend it worked, send nothing.
  if (trap) return redirect('/subscribe/check-email/');
  if (!isEmail(email)) return redirect('/subscribe/error/?reason=email');

  // Same address within the same hour = one email (protects against double clicks).
  const hour = Math.floor(Date.now() / 3_600_000);
  const sent = await resend('/emails', {
    method: 'POST',
    idempotencyKey: `confirm-${email.toLowerCase()}-${hour}`,
    // Subject and content come from the Resend template.
    body: { from: FROM, to: [email], reply_to: REPLY_TO, template: { id: CONFIRM_TEMPLATE, variables: { CONFIRM_URL: confirmUrl(email) } } },
  }).catch((err) => {
    console.error('subscribe: send failed', err);
    return { ok: false, status: 0, data: {} };
  });

  if (!sent.ok) {
    console.error('subscribe: Resend error', sent.status, JSON.stringify(sent.data));
    return redirect('/subscribe/error/');
  }
  return redirect('/subscribe/check-email/');
}

export function GET(): Response {
  return redirect('/', 302);
}
