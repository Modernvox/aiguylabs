import { json, readJson, safeString } from '../../_lead-utils.js';
import { getRecipientToken, recordRecipientEvent } from '../../_campaign-outreach.js';

export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  const eventName = safeString(body?.eventName || body?.event_name, 80);
  if (eventName !== 'demo_click') {
    return json({ ok: false, error: 'Invalid campaign event.' }, { status: 400, headers: { 'cache-control': 'no-store' } });
  }

  try {
    const token = getRecipientToken(request);
    const result = await recordRecipientEvent(env, request, {
      token,
      eventName,
      sourcePath: safeString(body?.sourcePath || body?.source_path || '/products/movescan', 200),
      destinationPath: '/products/movescan#demo',
      metadata: { source: 'movescan-demo-button' },
    });
    return json({ ok: true, tracked: Boolean(result) }, { status: 202, headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    console.error('Unable to record MoveScan demo click', { code: error?.code || 'UNKNOWN' });
    return json({ ok: true, tracked: false }, { status: 202, headers: { 'cache-control': 'no-store' } });
  }
}

export async function onRequestGet() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405, headers: { allow: 'POST' } });
}
