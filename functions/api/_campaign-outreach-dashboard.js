import { ensureDb } from './_lead-utils.js';
import { MOVESCAN_OUTREACH_CAMPAIGN, MOVESCAN_OUTREACH_PROSPECTS, ensureCampaignRecipientsTable } from './_campaign-outreach.js';

async function loadOutreachRecipients(env) {
  const db = await ensureDb(env);
  await ensureCampaignRecipientsTable(db);
  const result = await db.prepare(`
    select
      cr.id,
      cr.company_name as companyName,
      cr.recipient_email as recipientEmail,
      cr.status,
      cr.created_at as createdAt,
      cr.sent_at as sentAt,
      max(case when ce.event_name = 'email_sent' then ce.created_at else null end) as emailSentAt,
      max(case when ce.event_name = 'email_open' then ce.created_at else null end) as emailOpenedAt,
      max(case when ce.event_name = 'product_page_click' then ce.created_at else null end) as productPageClickedAt,
      max(case when ce.event_name = 'demo_click' then ce.created_at else null end) as demoClickedAt
    from campaign_recipients cr
    left join campaign_events ce
      on json_extract(ce.metadata, '$.recipientId') = cr.id
      and ce.campaign = cr.campaign
    where cr.campaign = ?
    group by cr.id, cr.company_name, cr.recipient_email, cr.status, cr.created_at, cr.sent_at
    order by cr.created_at desc
    limit 200
  `).bind(MOVESCAN_OUTREACH_CAMPAIGN).all();

  return (result?.results || []).map((row) => ({
    id: row.id,
    companyName: row.companyName,
    recipientEmail: row.recipientEmail,
    status: row.status,
    createdAt: row.createdAt,
    sentAt: row.sentAt || '',
    funnel: {
      sent: Boolean(row.emailSentAt),
      opened: Boolean(row.emailOpenedAt),
      productPage: Boolean(row.productPageClickedAt),
      demo: Boolean(row.demoClickedAt),
    },
    dates: {
      sent: row.emailSentAt || '',
      opened: row.emailOpenedAt || '',
      productPage: row.productPageClickedAt || '',
      demo: row.demoClickedAt || '',
    },
  }));
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
