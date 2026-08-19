import { ensureDb } from './_lead-utils.js';
import { MOVESCAN_OUTREACH_CAMPAIGN, ensureCampaignRecipientsTable } from './_campaign-outreach.js';

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

export { loadOutreachRecipients };
