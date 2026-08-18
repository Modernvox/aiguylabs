import { ensureDb, getAdminToken, json, safeString } from './_lead-utils.js';

const SESSION_COOKIE_NAME = 'aigl_campaigns_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const CAMPAIGN_SLUG = 'movescan_local_launch';
const EVENT_NAME = 'postcard_scan';
const DEFAULT_RANGE_DAYS = 30;
const RECENT_LIMIT = 20;

function parseCookies(request) {
  const header = request.headers.get('cookie') || '';
  const cookies = {};

  header.split(';').forEach((part) => {
    const index = part.indexOf('=');
    if (index < 0) return;
    const name = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (name) cookies[name] = decodeURIComponent(value);
  });

  return cookies;
}

function getPrivateToken(request, env) {
  const expected = getAdminToken(env);
  if (!expected) return '';

  const cookies = parseCookies(request);
  if (cookies[SESSION_COOKIE_NAME] === expected) return expected;

  const header = request.headers.get('authorization') || '';
  const bearer = header.match(/^Bearer\s+(.+)$/i)?.[1];
  if (bearer === expected) return expected;

  if (request.headers.get('x-admin-token') === expected) return expected;
  return '';
}

function isPrivateCampaignsAuthorized(request, env) {
  return Boolean(getPrivateToken(request, env));
}

function buildSessionCookie(request, token, maxAge = SESSION_MAX_AGE_SECONDS) {
  const secure = new URL(request.url).protocol === 'https:';
  return [
    SESSION_COOKIE_NAME + '=' + encodeURIComponent(token),
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=' + maxAge,
    'Priority=High',
    secure ? 'Secure' : null,
  ].filter(Boolean).join('; ');
}

function clearSessionCookie(request) {
  return buildSessionCookie(request, '', 0);
}

function isDateParam(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function parseRange(request) {
  const url = new URL(request.url);
  const today = new Date();
  const toCandidate = safeString(url.searchParams.get('to') || '', 20);
  const fromCandidate = safeString(url.searchParams.get('from') || '', 20);
  const to = isDateParam(toCandidate) ? toCandidate : today.toISOString().slice(0, 10);
  const fallbackFromDate = new Date(today);
  fallbackFromDate.setUTCDate(fallbackFromDate.getUTCDate() - (DEFAULT_RANGE_DAYS - 1));
  const fallbackFrom = fallbackFromDate.toISOString().slice(0, 10);
  const from = isDateParam(fromCandidate) ? fromCandidate : fallbackFrom;
  return { from, to };
}

function startOfUtcDay(dateValue) {
  return dateValue + 'T00:00:00.000Z';
}

function endExclusiveUtcDay(dateValue) {
  const next = new Date(dateValue + 'T00:00:00.000Z');
  next.setUTCDate(next.getUTCDate() + 1);
  return next.toISOString();
}

async function ensureCampaignEventsTable(db) {
  await db.exec("create table if not exists campaign_events (id text primary key, created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')), event_name text not null, campaign text not null, source_path text not null, destination_path text not null, utm_source text not null, utm_medium text not null, utm_campaign text not null, ip_address text, user_agent text, referrer text, metadata text not null default '{}');");
  await db.exec('create index if not exists campaign_events_created_at_idx on campaign_events(created_at desc);');
  await db.exec('create index if not exists campaign_events_event_name_idx on campaign_events(event_name);');
  await db.exec('create index if not exists campaign_events_campaign_idx on campaign_events(campaign);');
  await db.exec('create index if not exists campaign_events_campaign_created_at_idx on campaign_events(campaign, created_at desc);');
}

async function loadCampaignAnalytics(env, request) {
  const db = await ensureDb(env);
  await ensureCampaignEventsTable(db);

  const { from, to } = parseRange(request);
  const rangeStart = startOfUtcDay(from);
  const rangeEnd = endExclusiveUtcDay(to);

  const summaryQuery = db.prepare(`
    select
      count(*) as total_scans,
      count(distinct coalesce(nullif(ip_address, ''), nullif(user_agent, ''), id)) as unique_visitors,
      sum(case when date(created_at) = date('now') then 1 else 0 end) as scans_today,
      sum(case when created_at >= datetime('now', '-7 days') then 1 else 0 end) as scans_last_7_days,
      sum(case when created_at >= datetime('now', '-30 days') then 1 else 0 end) as scans_last_30_days,
      max(created_at) as last_scan_at
    from campaign_events
    where campaign = ? and event_name = ?
  `).bind(CAMPAIGN_SLUG, EVENT_NAME).first();

  const recentQuery = db.prepare(`
    select created_at as createdAt
    from campaign_events
    where campaign = ? and event_name = ? and created_at >= ? and created_at < ?
    order by created_at desc
    limit ?
  `).bind(CAMPAIGN_SLUG, EVENT_NAME, rangeStart, rangeEnd, RECENT_LIMIT).all();

  const [summary, recent] = await Promise.all([summaryQuery, recentQuery]);
  const totals = summary || {};

  return {
    campaign: {
      name: 'MoveScan postcard campaign',
      slug: CAMPAIGN_SLUG,
      eventName: EVENT_NAME,
    },
    range: { from, to },
    summary: {
      totalScans: Number(totals.total_scans || 0),
      uniqueVisitors: Number(totals.unique_visitors || 0),
      scansToday: Number(totals.scans_today || 0),
      scansLast7Days: Number(totals.scans_last_7_days || 0),
      scansLast30Days: Number(totals.scans_last_30_days || 0),
      lastScanAt: totals.last_scan_at || '',
    },
    recentScans: (recent?.results || []).map((row) => ({ createdAt: row.createdAt })),
  };
}

export {
  CAMPAIGN_SLUG,
  EVENT_NAME,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  buildSessionCookie,
  clearSessionCookie,
  getPrivateToken,
  isPrivateCampaignsAuthorized,
  loadCampaignAnalytics,
};