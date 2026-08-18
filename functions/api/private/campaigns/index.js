import { json } from '../../_lead-utils.js';
import { loadCampaignAnalytics, isPrivateCampaignsAuthorized } from '../../_private-campaigns.js';

export async function onRequestGet({ request, env }) {
  if (!isPrivateCampaignsAuthorized(request, env)) {
    return json({ ok: false, error: 'Unauthorized.' }, { status: 401, headers: { 'cache-control': 'no-store' } });
  }

  try {
    const data = await loadCampaignAnalytics(env, request);
    return json({ ok: true, ...data }, { headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    console.error('Unable to load private campaign analytics', {
      code: error?.code || 'UNKNOWN',
      message: error?.message || 'unknown',
    });
    return json({ ok: false, error: 'Unable to load campaign analytics.' }, { status: 502, headers: { 'cache-control': 'no-store' } });
  }
}

export async function onRequestPost() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405, headers: { allow: 'GET', 'cache-control': 'no-store' } });
}