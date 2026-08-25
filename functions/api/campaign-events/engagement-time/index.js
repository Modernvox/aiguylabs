import { ensureDb, json, readJson, safeString } from '../../_lead-utils.js';
import { buildRecipientCookie, ensureCampaignRecipientEngagementTables, ensureCampaignRecipientsTable, getRecipientByToken, getRecipientToken, isTrackingToken } from '../../_campaign-outreach.js';

const EVENT_NAME = 'product_page_engaged_time';
const MIN_DELTA_MS = 1000;
const MAX_DELTA_MS = 60000;

function parseDeltaMs(value) {
  const delta = Math.round(Number(value));
  if (!Number.isFinite(delta)) return 0;
  return Math.min(Math.max(delta, 0), MAX_DELTA_MS);
}

function isFlushId(value) {
  return /^[a-z0-9._:-]{8,180}$/i.test(value);
}

export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  const eventName = safeString(body?.eventName || body?.event_name, 80);
  if (eventName !== EVENT_NAME) {
    return json({ ok: false, error: 'Invalid campaign event.' }, { status: 400, headers: { 'cache-control': 'no-store' } });
  }

  const deltaMs = parseDeltaMs(body?.deltaMs || body?.delta_ms);
  const flushId = safeString(body?.flushId || body?.flush_id, 200);
  if (deltaMs < MIN_DELTA_MS || !isFlushId(flushId)) {
    return json({ ok: true, tracked: false }, { status: 202, headers: { 'cache-control': 'no-store' } });
  }

  try {
    const cookieToken = getRecipientToken(request);
    const fallbackToken = safeString(body?.trackingToken || body?.tracking_token, 100);
    const token = cookieToken || (isTrackingToken(fallbackToken) ? fallbackToken : '');
    const recipient = await getRecipientByToken(env, token);
    if (!recipient) {
      return json({ ok: true, tracked: false }, { status: 202, headers: { 'cache-control': 'no-store' } });
    }

    const db = await ensureDb(env);
    await ensureCampaignRecipientsTable(db);
    await ensureCampaignRecipientEngagementTables(db);
    const now = new Date().toISOString();
    const inserted = await db.prepare(`
      insert or ignore into campaign_recipient_engagement_flushes (flush_id, recipient_id, campaign, delta_ms, created_at)
      values (?, ?, ?, ?, ?)
    `).bind(flushId, recipient.id, recipient.campaign, deltaMs, now).run();
    const changes = Number(inserted?.meta?.changes || 0);
    const headers = { 'cache-control': 'no-store' };
    if (!cookieToken && token) headers['set-cookie'] = buildRecipientCookie(request, token);

    if (!changes) {
      return json({ ok: true, tracked: true, duplicate: true }, { status: 202, headers });
    }

    await db.prepare(`
      insert into campaign_recipient_engagement (recipient_id, campaign, product_page_engaged_ms, last_seen_at, updated_at)
      values (?, ?, ?, ?, ?)
      on conflict(recipient_id, campaign) do update set
        product_page_engaged_ms = campaign_recipient_engagement.product_page_engaged_ms + excluded.product_page_engaged_ms,
        last_seen_at = excluded.last_seen_at,
        updated_at = excluded.updated_at
    `).bind(recipient.id, recipient.campaign, deltaMs, now, now).run();

    return json({ ok: true, tracked: true }, { status: 202, headers });
  } catch (error) {
    console.error('Unable to record MoveScan engaged time', { code: error?.code || 'UNKNOWN' });
    return json({ ok: true, tracked: false }, { status: 202, headers: { 'cache-control': 'no-store' } });
  }
}

export async function onRequestGet() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405, headers: { allow: 'POST' } });
}
