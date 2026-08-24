import { ensureDb } from './_lead-utils.js';
import { MOVESCAN_OUTREACH_CAMPAIGN, MOVESCAN_OUTREACH_PROSPECTS, ensureCampaignRecipientsTable } from './_campaign-outreach.js';

const UNSUCCESSFUL_DELIVERY_STATUSES = new Set(['failed', 'bounced', 'rejected', 'deferred', 'complained', 'doesnt_exist']);

async function loadOutreachRecipients(env) {
  const db = await ensureDb(env);
  await ensureCampaignRecipientsTable(db);
  const recipientResult = await db.prepare(`
    select id, company_name as companyName, recipient_email as recipientEmail, status, delivery_status as deliveryStatus, coalesce(nullif(trim(state), ''), 'TN') as state, created_at as createdAt, sent_at as sentAt
    from campaign_recipients
    where campaign = ?
    order by created_at desc
    limit 200
  `).bind(MOVESCAN_OUTREACH_CAMPAIGN).all();
  const rows = recipientResult?.results || [];
  if (!rows.length) return [];

  const eventResult = await db.prepare(`
    select event_name as eventName, created_at as createdAt, metadata
    from campaign_events
    where campaign = ? and event_name in ('email_sent', 'email_open', 'product_page_click', 'product_page_view', 'demo_click', 'demo_opened', 'video_started', 'video_25_watched', 'video_50_watched', 'video_completed', 'email_delivered', 'email_deferred', 'email_bounced', 'email_rejected', 'email_complained', 'email_failed')
    order by created_at desc
    limit 2000
  `).bind(MOVESCAN_OUTREACH_CAMPAIGN).all();
  const eventsByRecipient = new Map();
  for (const event of eventResult?.results || []) {
    try {
      const metadata = JSON.parse(event.metadata || '{}');
      if (!metadata.recipientId) continue;
      const current = eventsByRecipient.get(metadata.recipientId) || {};
      if (event.eventName.startsWith('email_') && ['email_delivered', 'email_deferred', 'email_bounced', 'email_rejected', 'email_complained', 'email_failed'].includes(event.eventName)) {
        const providerDetails = [metadata.providerStatus, metadata.smtpStatusCode, metadata.smtpEnhancedStatusCode, metadata.reason, metadata.message].filter(Boolean).join(' ');
        const explicitlyInvalidMailbox = /(?:5\.1\.1|5\.1\.10|mailbox|recipient|user).*(?:invalid|unknown|does not exist|not found|unavailable)/i.test(providerDetails);
        const candidate = { status: explicitlyInvalidMailbox ? 'doesnt_exist' : event.eventName.replace('email_', ''), at: event.createdAt };
        if (!current.delivery || candidate.at > current.delivery.at) current.delivery = candidate;
      } else if (!current[event.eventName]) {
        current[event.eventName] = event.createdAt;
      }
      eventsByRecipient.set(metadata.recipientId, current);
    } catch {}
  }

  return rows.map((row) => {
    const events = eventsByRecipient.get(row.id) || {};
    return {
      id: row.id,
      companyName: row.companyName,
      recipientEmail: row.recipientEmail,
      status: row.status,
      state: row.state || 'TN',
      createdAt: row.createdAt,
      sentAt: row.sentAt || '',
      funnel: {
        sent: Boolean(events.email_sent),
        delivered: events.delivery?.status === 'delivered',
        opened: Boolean(events.email_open),
        productPage: Boolean(events.product_page_view),
        demo: Boolean(events.demo_click || events.demo_opened),
      },
      delivery: row.deliveryStatus ? { status: row.deliveryStatus, at: events.delivery?.at || '' } : events.delivery || { status: 'pending', at: '' },
      productPageClick: events.product_page_click || '',
      demoEngagement: {
        opened: events.demo_opened || '',
        started: events.video_started || '',
        watched25: events.video_25_watched || '',
        watched50: events.video_50_watched || '',
        completed: events.video_completed || '',
      },
      lead: Boolean(events.video_started),
      hotLead: Boolean(events.video_50_watched),
      leadAt: events.video_started || '',
      hotLeadAt: events.video_50_watched || '',
      latestActivity: Object.entries(events).flatMap(([key, value]) => key === 'delivery' ? [value.at] : [value]).filter((value) => typeof value === 'string' && value).sort().at(-1) || '',
      dates: {
        sent: events.email_sent || '',
        opened: events.email_open || '',
        productPage: events.product_page_view || '',
        demo: events.demo_click || events.demo_opened || '',
      },
    };
  });
}
function emptyStateMetric(state) {
  return { state, sentCount: 0, openedCount: 0, productPageCount: 0 };
}

async function loadOutreachStateMetrics(env) {
  const db = await ensureDb(env);
  await ensureCampaignRecipientsTable(db);
  const recipientResult = await db.prepare(`
    select id, lower(trim(recipient_email)) as recipientEmail, coalesce(nullif(trim(state), ''), 'TN') as state, status, delivery_status as deliveryStatus, sent_at as sentAt
    from campaign_recipients
    where campaign = ?
  `).bind(MOVESCAN_OUTREACH_CAMPAIGN).all();
  const recipients = recipientResult?.results || [];
  const recipientsById = new Map();
  const recipientsByEmail = new Map();
  const metricsByState = new Map();

  for (const recipient of recipients) {
    const state = recipient.state || 'TN';
    if (!metricsByState.has(state)) metricsByState.set(state, emptyStateMetric(state));
    recipientsById.set(recipient.id, recipient);
    if (recipient.recipientEmail) recipientsByEmail.set(recipient.recipientEmail, recipient);
  }

  const openedRecipientIds = new Set();
  const productPageRecipientIds = new Set();
  const eventResult = await db.prepare(`
    select event_name as eventName, metadata
    from campaign_events
    where campaign = ? and event_name in ('email_open', 'product_page_view')
  `).bind(MOVESCAN_OUTREACH_CAMPAIGN).all();

  for (const event of eventResult?.results || []) {
    try {
      const metadata = JSON.parse(event.metadata || '{}');
      const recipientId = metadata.recipientId || '';
      const recipientEmail = String(metadata.recipientEmail || metadata.email || '').trim().toLowerCase();
      const recipient = recipientsById.get(recipientId) || (recipientEmail ? recipientsByEmail.get(recipientEmail) : null);
      if (!recipient) continue;
      if (event.eventName === 'email_open') openedRecipientIds.add(recipient.id);
      if (event.eventName === 'product_page_view') productPageRecipientIds.add(recipient.id);
    } catch {}
  }

  for (const recipient of recipients) {
    const state = recipient.state || 'TN';
    const metric = metricsByState.get(state) || emptyStateMetric(state);
    const deliveryStatus = recipient.deliveryStatus || 'pending';
    const successfulSend = recipient.status === 'sent' && Boolean(recipient.sentAt) && !UNSUCCESSFUL_DELIVERY_STATUSES.has(deliveryStatus);
    if (successfulSend) {
      metric.sentCount += 1;
      if (openedRecipientIds.has(recipient.id)) metric.openedCount += 1;
      if (productPageRecipientIds.has(recipient.id)) metric.productPageCount += 1;
    }
    metricsByState.set(state, metric);
  }

  return Array.from(metricsByState.values()).sort((a, b) => a.state.localeCompare(b.state));
}

async function seedOutreachRecipients(env) {
  const db = await ensureDb(env);
  await ensureCampaignRecipientsTable(db);
  let added = 0;
  let existing = 0;

  for (const [companyName, recipientEmail, state = 'TN'] of MOVESCAN_OUTREACH_PROSPECTS) {
    const normalizedEmail = recipientEmail.toLowerCase();
    const match = await db.prepare(`
      select id
      from campaign_recipients
      where campaign = ? and lower(recipient_email) = ?
      limit 1
    `).bind(MOVESCAN_OUTREACH_CAMPAIGN, normalizedEmail).first();

    if (match) {
      existing += 1;
      continue;
    }

    await db.prepare(`
      insert into campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
      values (?, ?, ?, ?, ?, 'unsent', ?, ?, null)
    `).bind(
      crypto.randomUUID(),
      crypto.randomUUID(),
      companyName,
      recipientEmail,
      MOVESCAN_OUTREACH_CAMPAIGN,
      state,
      new Date().toISOString(),
    ).run();
    added += 1;
  }

  return { added, existing, total: MOVESCAN_OUTREACH_PROSPECTS.length };
}

export { loadOutreachRecipients, loadOutreachStateMetrics, seedOutreachRecipients };
