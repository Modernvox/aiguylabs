import { ensureDb, safeString } from './_lead-utils.js';

const EVENT_INSERT_SQL = 'insert into campaign_events (id, created_at, event_name, campaign, source_path, destination_path, utm_source, utm_medium, utm_campaign, ip_address, user_agent, referrer, metadata) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

function buildRedirectUrl(requestUrl) {
  const destination = new URL('/products/movescan', requestUrl);
  destination.searchParams.set('utm_source', 'postcard');
  destination.searchParams.set('utm_medium', 'direct_mail');
  destination.searchParams.set('utm_campaign', 'movescan_local_launch');
  return destination;
}

async function ensureCampaignEventsTable(db) {
  await db.exec("create table if not exists campaign_events (id text primary key, created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')), event_name text not null, campaign text not null, source_path text not null, destination_path text not null, utm_source text not null, utm_medium text not null, utm_campaign text not null, ip_address text, user_agent text, referrer text, metadata text not null default '{}');");
  await db.exec('create index if not exists campaign_events_created_at_idx on campaign_events(created_at desc);');
  await db.exec('create index if not exists campaign_events_event_name_idx on campaign_events(event_name);');
}

function buildMetadata(record) {
  return JSON.stringify({
    ...record,
    recordedFrom: 'first-party-go-route',
  });
}

export async function recordCampaignEvent(env, request, record) {
  const db = await ensureDb(env);
  await ensureCampaignEventsTable(db);

  const id = record.id || crypto.randomUUID();
  const createdAt = record.createdAt || new Date().toISOString();
  const ipAddress = safeString(request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '', 120);
  const userAgent = safeString(request.headers.get('user-agent') || '', 600);
  const referrer = safeString(request.headers.get('referer') || '', 500);
  const metadata = buildMetadata(record.metadata || {});

  await db.prepare(EVENT_INSERT_SQL).bind(
    id,
    createdAt,
    record.eventName,
    record.campaign,
    record.sourcePath,
    record.destinationPath,
    record.utmSource,
    record.utmMedium,
    record.utmCampaign,
    ipAddress,
    userAgent,
    referrer,
    metadata,
  ).run();

  const confirmation = await db.prepare('select id from campaign_events where id = ?').bind(id).first();
  if (!confirmation?.id) {
    throw new Error('Campaign event insert could not be verified.');
  }

  return { id, createdAt };
}

export { buildRedirectUrl };
