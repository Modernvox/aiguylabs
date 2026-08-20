import { ensureDb } from './_lead-utils.js';
import { MOVESCAN_OUTREACH_CAMPAIGN, MOVESCAN_OUTREACH_PROSPECTS, ensureCampaignRecipientsTable } from './_campaign-outreach.js';

async function loadOutreachRecipients(env) {
  const db = await ensureDb(env);
  await ensureCampaignRecipientsTable(db);
  const recipientResult = await db.prepare(`
    select id, company_name as companyName, recipient_email as recipientEmail, status, created_at as createdAt, sent_at as sentAt
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
    where campaign = ? and event_name in ('email_sent', 'email_open', 'product_page_click', 'demo_click', 'demo_opened', 'video_started', 'video_25_watched', 'video_50_watched', 'video_completed')
    order by created_at desc
    limit 2000
  `).bind(MOVESCAN_OUTREACH_CAMPAIGN).all();
  const eventsByRecipient = new Map();
  for (const event of eventResult?.results || []) {
    try {
      const metadata = JSON.parse(event.metadata || '{}');
      if (!metadata.recipientId) continue;
      const current = eventsByRecipient.get(metadata.recipientId) || {};
      if (!current[event.eventName]) current[event.eventName] = event.createdAt;
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
      createdAt: row.createdAt,
      sentAt: row.sentAt || '',
      funnel: {
        sent: Boolean(events.email_sent),
        opened: Boolean(events.email_open),
        productPage: Boolean(events.product_page_click),
        demo: Boolean(events.demo_click || events.demo_opened),
      },
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
      latestActivity: Object.values(events).filter(Boolean).sort().at(-1) || '',
      dates: {
        sent: events.email_sent || '',
        opened: events.email_open || '',
        productPage: events.product_page_click || '',
        demo: events.demo_click || events.demo_opened || '',
      },
    };
  });
}
async function seedOutreachRecipients(env) {
  const db = await ensureDb(env);
  await ensureCampaignRecipientsTable(db);
  let added = 0;
  let existing = 0;

  for (const [companyName, recipientEmail] of MOVESCAN_OUTREACH_PROSPECTS) {
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
      insert into campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, created_at, sent_at)
      values (?, ?, ?, ?, ?, 'unsent', ?, null)
    `).bind(
      crypto.randomUUID(),
      crypto.randomUUID(),
      companyName,
      recipientEmail,
      MOVESCAN_OUTREACH_CAMPAIGN,
      new Date().toISOString(),
    ).run();
    added += 1;
  }

  return { added, existing, total: MOVESCAN_OUTREACH_PROSPECTS.length };
}

export { loadOutreachRecipients, seedOutreachRecipients };
