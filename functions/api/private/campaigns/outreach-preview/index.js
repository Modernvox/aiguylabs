import { json } from '../../../_lead-utils.js';
import { isPrivateCampaignsAuthorized } from '../../../_private-campaigns.js';
import { buildOutreachPreview } from '../../../_campaign-outreach-preview.js';

export async function onRequestGet({ request, env }) {
  if (!isPrivateCampaignsAuthorized(request, env)) {
    return json({ ok: false, error: 'Unauthorized.' }, { status: 401, headers: { 'cache-control': 'no-store' } });
  }

  const email = buildOutreachPreview(request);
  return json({ ok: true, subject: email.subject, from: email.from, replyTo: email.replyTo, html: email.html }, { headers: { 'cache-control': 'no-store' } });
}

export async function onRequestPost() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405, headers: { allow: 'GET' } });
}
