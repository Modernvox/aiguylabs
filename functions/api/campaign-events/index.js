import { json, readJson, safeString } from '../_lead-utils.js';
import { buildRedirectUrl, recordCampaignEvent } from '../_campaign-events.js';

function validateRecord(body) {
  const eventName = safeString(body?.eventName || body?.event_name, 80);
  const campaign = safeString(body?.campaign, 120);
  const sourcePath = safeString(body?.sourcePath || body?.source_path, 200);
  const destinationPath = safeString(body?.destinationPath || body?.destination_path, 300);
  const utmSource = safeString(body?.utmSource || body?.utm_source, 80);
  const utmMedium = safeString(body?.utmMedium || body?.utm_medium, 80);
  const utmCampaign = safeString(body?.utmCampaign || body?.utm_campaign, 120);

  if (eventName !== 'postcard_scan') return null;
  if (!campaign || !sourcePath || !destinationPath || !utmSource || !utmMedium || !utmCampaign) return null;

  return {
    eventName,
    campaign,
    sourcePath,
    destinationPath,
    utmSource,
    utmMedium,
    utmCampaign,
    metadata: {
      source: safeString(body?.source || '', 120),
      medium: safeString(body?.medium || '', 120),
      campaignLabel: safeString(body?.campaignLabel || '', 160),
    },
  };
}

export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  if (!body) return json({ ok: false, error: 'Invalid request.' }, { status: 400 });

  const record = validateRecord(body);
  if (!record) return json({ ok: false, error: 'Invalid campaign event.' }, { status: 400 });

  try {
    const result = await recordCampaignEvent(env, request, record);
    return json({ ok: true, id: result.id, createdAt: result.createdAt }, { status: 201 });
  } catch (error) {
    console.error('Unable to record campaign event', {
      code: error?.code || 'UNKNOWN',
      message: error?.message || 'unknown',
    });
    return json({ ok: false, error: 'Unable to record campaign event.' }, { status: 502 });
  }
}

export async function onRequestGet() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405, headers: { allow: 'POST' } });
}

export async function onRequestPut() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405, headers: { allow: 'POST' } });
}

export async function onRequestPatch() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405, headers: { allow: 'POST' } });
}

export async function onRequestDelete() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405, headers: { allow: 'POST' } });
}
