import { json, readJson, ensureDb } from '../../../_lead-utils.js';
import { isPrivateCampaignsAuthorized } from '../../../_private-campaigns.js';
import {
  MOVESCAN_OUTREACH_CAMPAIGN,
  buildOpenPixelUrl,
  buildTrackedOutreachUrl,
  cleanHeaderText,
  ensureCampaignRecipientsTable,
  recordRecipientEvent,
  isEmail,
} from '../../../_campaign-outreach.js';

async function loadRecipient(db, id) {
  return db.prepare(`
    select id, tracking_token as trackingToken, company_name as companyName, recipient_email as recipientEmail, coalesce(nullif(trim(state), ''), 'TN') as state, campaign, status
    from campaign_recipients
    where id = ? and campaign = ?
    limit 1
  `).bind(id, MOVESCAN_OUTREACH_CAMPAIGN).first();
}

async function findRecipientByEmail(db, email) {
  return db.prepare(`
    select id, status
    from campaign_recipients
    where lower(recipient_email) = ? and campaign = ?
    order by created_at desc
    limit 1
  `).bind(email, MOVESCAN_OUTREACH_CAMPAIGN).first();
}

export async function onRequestPost({ request, env }) {
  if (!isPrivateCampaignsAuthorized(request, env)) {
    return json({ ok: false, error: 'Unauthorized.' }, { status: 401, headers: { 'cache-control': 'no-store' } });
  }

  const body = await readJson(request);
  if (!body) return json({ ok: false, error: 'Invalid request.' }, { status: 400, headers: { 'cache-control': 'no-store' } });

  const emailSubject = body.subject;
  const emailBodyText = body.bodyText || body.body;

  const db = await ensureDb(env);
  await ensureCampaignRecipientsTable(db);
  let recipient;

  if (body.recipientId) {
    recipient = await loadRecipient(db, cleanHeaderText(body.recipientId, 80));
    if (!recipient) return json({ ok: false, error: 'Recipient was not found.' }, { status: 404, headers: { 'cache-control': 'no-store' } });
    if (recipient.status === 'sent' && body.retry !== true) return json({ ok: false, error: 'This recipient has already been sent. Use the explicit retry action for a failed delivery.' }, { status: 409, headers: { 'cache-control': 'no-store' } });
  } else {
    const companyName = cleanHeaderText(body.companyName || body.company_name, 180);
    const recipientEmail = cleanHeaderText(body.recipientEmail || body.recipient_email, 240).toLowerCase();
    const state = cleanHeaderText(body.state || 'TN', 40).toUpperCase() || 'TN';
    const errors = {};
    if (!companyName) errors.companyName = 'Company name is required.';
    if (!recipientEmail || !isEmail(recipientEmail)) errors.recipientEmail = 'A valid recipient email is required.';
    if (Object.keys(errors).length) return json({ ok: false, errors }, { status: 400, headers: { 'cache-control': 'no-store' } });

    const existing = await findRecipientByEmail(db, recipientEmail);
    if (existing) return json({ ok: false, error: 'This recipient already exists. Use the existing prospect row to send it.', recipientId: existing.id }, { status: 409, headers: { 'cache-control': 'no-store' } });

    const id = crypto.randomUUID();
    const token = crypto.randomUUID();
    await db.prepare(`
      insert into campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, state, created_at, sent_at)
      values (?, ?, ?, ?, ?, 'pending', ?, ?, null)
    `).bind(id, token, companyName, recipientEmail, MOVESCAN_OUTREACH_CAMPAIGN, state, new Date().toISOString()).run();
    recipient = { id, trackingToken: token, companyName, recipientEmail, state, status: 'pending' };
  }

  const productUrl = buildTrackedOutreachUrl(request, recipient.trackingToken);
  const pixelUrl = buildOpenPixelUrl(request, recipient.trackingToken);

  try {
    const workerUrl = env.OUTREACH_WORKER_URL || new URL('/api/movescan-outreach/send', request.url).toString();
    const internalToken = env.OUTREACH_INTERNAL_TOKEN || '';
    if (!internalToken) throw new Error('OUTREACH_INTERNAL_TOKEN is not configured.');
    const workerResponse = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-outreach-token': internalToken,
      },
      body: JSON.stringify({
        companyName: recipient.companyName,
        recipientEmail: recipient.recipientEmail,
        productUrl: productUrl.toString(),
        pixelUrl: pixelUrl.toString(),
        subject: emailSubject,
        bodyText: emailBodyText,
      }),
    });
    const result = await workerResponse.json().catch(() => ({}));
    if (!workerResponse.ok || result.ok !== true) throw new Error(result.error || 'Outreach worker send failed.');

    const sentAt = new Date().toISOString();
    await db.prepare('update campaign_recipients set status = ?, delivery_status = null, sent_at = ? where id = ?').bind('sent', sentAt, recipient.id).run();
    try {
      await recordRecipientEvent(env, request, {
        token: recipient.trackingToken,
        eventName: 'email_sent',
        sourcePath: '/private/campaigns',
        destinationPath: productUrl.pathname + productUrl.search,
        metadata: { messageId: result?.messageId || '' },
      });
    } catch (eventError) {
      console.error('MoveScan outreach email sent but event recording failed', { code: eventError?.code || 'UNKNOWN', recipientId: recipient.id });
    }
    return json({ ok: true, recipient: { id: recipient.id, companyName: recipient.companyName, recipientEmail: recipient.recipientEmail, state: recipient.state || 'TN', status: 'sent', sentAt } }, { status: 201, headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    await db.prepare('update campaign_recipients set status = ? where id = ?').bind('failed', recipient.id).run();
    console.error('Unable to send MoveScan outreach email', { code: error?.code || 'UNKNOWN', recipientId: recipient.id });
    return json({ ok: false, error: 'Unable to send the outreach email right now.' }, { status: 502, headers: { 'cache-control': 'no-store' } });
  }
}

export async function onRequestGet() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405, headers: { allow: 'POST' } });
}