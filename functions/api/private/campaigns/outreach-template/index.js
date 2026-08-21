import { json, readJson } from '../../../_lead-utils.js';
import { isPrivateCampaignsAuthorized } from '../../../_private-campaigns.js';
import { loadCampaignEmailTemplate, saveCampaignEmailTemplate } from '../../../_campaign-outreach.js';

export async function onRequestGet({ request, env }) {
  if (!isPrivateCampaignsAuthorized(request, env)) {
    return json({ ok: false, error: 'Unauthorized.' }, { status: 401, headers: { 'cache-control': 'no-store' } });
  }

  try {
    const template = await loadCampaignEmailTemplate(env);
    return json({ ok: true, template }, { headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    console.error('Unable to load MoveScan outreach template', { code: error?.code || 'UNKNOWN', message: error?.message || 'unknown' });
    return json({ ok: false, error: 'Unable to load outreach email template.' }, { status: 502, headers: { 'cache-control': 'no-store' } });
  }
}

export async function onRequestPut({ request, env }) {
  if (!isPrivateCampaignsAuthorized(request, env)) {
    return json({ ok: false, error: 'Unauthorized.' }, { status: 401, headers: { 'cache-control': 'no-store' } });
  }

  const body = await readJson(request);
  if (!body) return json({ ok: false, error: 'Invalid request.' }, { status: 400, headers: { 'cache-control': 'no-store' } });

  try {
    const template = await saveCampaignEmailTemplate(env, { subject: body.subject, bodyText: body.bodyText || body.body });
    return json({ ok: true, template }, { headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    console.error('Unable to save MoveScan outreach template', { code: error?.code || 'UNKNOWN', message: error?.message || 'unknown' });
    return json({ ok: false, error: 'Unable to save outreach email template.' }, { status: 502, headers: { 'cache-control': 'no-store' } });
  }
}

export async function onRequestPost() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405, headers: { allow: 'GET, PUT', 'cache-control': 'no-store' } });
}
