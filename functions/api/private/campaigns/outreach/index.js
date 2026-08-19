import { json } from '../../../_lead-utils.js';
import { isPrivateCampaignsAuthorized } from '../../../_private-campaigns.js';
import { loadOutreachRecipients } from '../../../_campaign-outreach-dashboard.js';

export async function onRequestGet({ request, env }) {
  if (!isPrivateCampaignsAuthorized(request, env)) {
    return json({ ok: false, error: 'Unauthorized.' }, { status: 401, headers: { 'cache-control': 'no-store' } });
  }

  try {
    const recipients = await loadOutreachRecipients(env);
    return json({ ok: true, recipients }, { headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    console.error('Unable to load MoveScan outreach recipients', { code: error?.code || 'UNKNOWN' });
    return json({ ok: false, error: 'Unable to load outreach recipients.' }, { status: 502, headers: { 'cache-control': 'no-store' } });
  }
}

export async function onRequestPost() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405, headers: { allow: 'GET' } });
}
