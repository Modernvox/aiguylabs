import { json } from '../../../_lead-utils.js';
import { isPrivateCampaignsAuthorized } from '../../../_private-campaigns.js';
import { OUTREACH_TEST_EMAIL, getOutreachPreviewUrls } from '../../../_campaign-outreach-preview.js';

export async function onRequestPost({ request, env }) {
  if (!isPrivateCampaignsAuthorized(request, env)) {
    return json({ ok: false, error: 'Unauthorized.' }, { status: 401, headers: { 'cache-control': 'no-store' } });
  }

  const workerUrl = env.OUTREACH_WORKER_URL || new URL('/api/movescan-outreach/send', request.url).toString();
  const internalToken = env.OUTREACH_INTERNAL_TOKEN || '';
  if (!internalToken) return json({ ok: false, error: 'Test email is not configured.' }, { status: 503, headers: { 'cache-control': 'no-store' } });

  const { productUrl, pixelUrl } = getOutreachPreviewUrls(request);
  try {
    const workerResponse = await fetch(workerUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-outreach-token': internalToken },
      body: JSON.stringify({
        companyName: 'AI Guy Labs test recipient',
        recipientEmail: OUTREACH_TEST_EMAIL,
        productUrl: productUrl.toString(),
        pixelUrl: pixelUrl.toString(),
      }),
    });
    const result = await workerResponse.json().catch(() => ({}));
    if (!workerResponse.ok || result.ok !== true) {
      const reason = typeof result.error === 'string' ? result.error : 'The email worker rejected the request.';
      console.error('MoveScan test email rejected', { status: workerResponse.status, reason });
      return json({ ok: false, error: 'Test email failed: ' + reason }, { status: 502, headers: { 'cache-control': 'no-store' } });
    }
    return json({ ok: true }, { status: 202, headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    const reason = typeof error?.message === 'string' ? error.message.slice(0, 180) : 'The email request could not be completed.';
    console.error('Unable to send MoveScan test email', { code: error?.code || 'UNKNOWN', reason });
    return json({ ok: false, error: 'Test email failed: ' + reason }, { status: 502, headers: { 'cache-control': 'no-store' } });
  }
}

export async function onRequestGet() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405, headers: { allow: 'POST' } });
}
