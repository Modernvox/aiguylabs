import { json, readJson, safeString } from '../../_lead-utils.js';
import { buildRecipientCookie, getRecipientToken, isTrackingToken, recordRecipientEvent } from '../../_campaign-outreach.js';

export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  const eventName = safeString(body?.eventName || body?.event_name, 80);
  const allowedEvents = new Set(['demo_click', 'demo_opened', 'video_started', 'video_25_watched', 'video_50_watched', 'video_completed', 'product_page_view']);
  if (!allowedEvents.has(eventName)) {
    return json({ ok: false, error: 'Invalid campaign event.' }, { status: 400, headers: { 'cache-control': 'no-store' } });
  }

  try {
    const cookieToken = getRecipientToken(request);
    const queryToken = safeString(body?.trackingToken || body?.tracking_token, 100);
    const clientActivity = safeString(body?.clientActivity || body?.client_activity, 80);
    if (eventName === 'product_page_view' && clientActivity !== 'react-page-rendered') {
      return json({ ok: true, tracked: false }, { status: 202, headers: { 'cache-control': 'no-store' } });
    }
    const token = cookieToken || (isTrackingToken(queryToken) ? queryToken : '');
    const result = await recordRecipientEvent(env, request, {
      token,
      eventName,
      sourcePath: safeString(body?.sourcePath || body?.source_path || '/products/movescan', 200),
      destinationPath: eventName === 'product_page_view' ? '/products/movescan' : '/products/movescan#demo',
      metadata: {
        source: eventName === 'product_page_view' ? 'movescan-product-page' : 'movescan-demo-video',
        clientActivity: eventName === 'product_page_view' ? clientActivity : '',
        visibilityState: eventName === 'product_page_view' ? safeString(body?.visibilityState || body?.visibility_state, 40) : '',
      },
      once: eventName !== 'demo_click',
    });
    const headers = { 'cache-control': 'no-store' };
    if (!cookieToken && token) headers['set-cookie'] = buildRecipientCookie(request, token);
    return json({ ok: true, tracked: Boolean(result) }, { status: 202, headers });
  } catch (error) {
    console.error('Unable to record MoveScan engagement event', { code: error?.code || 'UNKNOWN' });
    return json({ ok: true, tracked: false }, { status: 202, headers: { 'cache-control': 'no-store' } });
  }
}

export async function onRequestGet() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405, headers: { allow: 'POST' } });
}
