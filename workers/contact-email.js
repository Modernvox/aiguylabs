import {
  onRequestDelete,
  onRequestGet,
  onRequestPatch,
  onRequestPost,
  onRequestPut,
} from '../functions/api/contact-requests/index.js';
import {
  buildOutreachEmail,
  cleanHeaderText,
  isEmail,
} from '../functions/api/_campaign-outreach.js';

const OUTREACH_FROM = 'mike@aiguylabs.com';
const OUTREACH_REPLY_TO = 'mike@aiguylabs.com';

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...(init.headers || {}),
    },
  });
}

async function handleOutreachSend(request, env) {
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed.' }, { status: 405, headers: { allow: 'POST' } });
  }

  const expectedToken = env.OUTREACH_INTERNAL_TOKEN || '';
  const providedToken = request.headers.get('x-outreach-token') || '';
  if (!expectedToken || providedToken !== expectedToken) {
    return json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  const companyName = cleanHeaderText(body?.companyName, 180);
  const recipientEmail = cleanHeaderText(body?.recipientEmail, 240).toLowerCase();
  const productUrl = cleanHeaderText(body?.productUrl, 1000);
  const pixelUrl = cleanHeaderText(body?.pixelUrl, 1000);
  if (!companyName || !recipientEmail || !isEmail(recipientEmail) || !productUrl || !pixelUrl) {
    return json({ ok: false, error: 'Invalid outreach email request.' }, { status: 400 });
  }

  let parsedProductUrl;
  let parsedPixelUrl;
  try {
    parsedProductUrl = new URL(productUrl);
    parsedPixelUrl = new URL(pixelUrl);
  } catch {
    return json({ ok: false, error: 'Invalid tracking URLs.' }, { status: 400 });
  }

  const email = buildOutreachEmail({
    companyName,
    recipientEmail,
    productUrl: parsedProductUrl,
    pixelUrl: parsedPixelUrl,
  });

  if (body?.validateOnly === true) {
    return json({ ok: true, validated: true, from: OUTREACH_FROM, replyTo: OUTREACH_REPLY_TO });
  }

  if (!env.OUTREACH_EMAIL || typeof env.OUTREACH_EMAIL.send !== 'function') {
    console.error('OUTREACH_EMAIL binding is not configured.');
    return json({ ok: false, error: 'Outreach email is not configured.' }, { status: 502 });
  }

  try {
    const result = await env.OUTREACH_EMAIL.send({
      from: OUTREACH_FROM,
      to: recipientEmail,
      replyTo: OUTREACH_REPLY_TO,
      subject: 'Early MoveScan Network Opportunity',
      text: email.text,
      html: email.html,
    });
    return json({ ok: true, messageId: result?.messageId || '' }, { status: 202 });
  } catch (error) {
    console.error('MoveScan outreach email send failed', { code: error?.code || 'UNKNOWN' });
    return json({ ok: false, error: 'Unable to send outreach email.' }, { status: 502 });
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/movescan-outreach/send') return handleOutreachSend(request, env);
    if (url.pathname !== '/api/contact-requests') return new Response('Not found', { status: 404 });

    const context = { request, env, ctx, params: {} };
    if (request.method === 'POST') return onRequestPost(context);
    if (request.method === 'GET') return onRequestGet(context);
    if (request.method === 'PUT') return onRequestPut(context);
    if (request.method === 'PATCH') return onRequestPatch(context);
    if (request.method === 'DELETE') return onRequestDelete(context);

    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed.' }), {
      status: 405,
      headers: { 'content-type': 'application/json; charset=utf-8', allow: 'POST' },
    });
  },
};