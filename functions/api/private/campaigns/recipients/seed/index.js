import { json } from '../../../../_lead-utils.js';
import { isPrivateCampaignsAuthorized } from '../../../../_private-campaigns.js';
import { seedOutreachRecipients } from '../../../../_campaign-outreach-dashboard.js';

export async function onRequestPost({ request, env }) {
  if (!isPrivateCampaignsAuthorized(request, env)) {
    return json({ ok: false, error: 'Unauthorized.' }, { status: 401, headers: { 'cache-control': 'no-store' } });
  }

  try {
    const result = await seedOutreachRecipients(env);
    return json({ ok: true, ...result }, { status: 201, headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    console.error('Unable to seed MoveScan outreach recipients', { code: error?.code || 'UNKNOWN' });
    return json({ ok: false, error: 'Unable to load outreach prospects.' }, { status: 502, headers: { 'cache-control': 'no-store' } });
  }
}

export async function onRequestGet() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405, headers: { allow: 'POST' } });
}
