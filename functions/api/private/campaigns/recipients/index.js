import { json, readJson } from '../../../_lead-utils.js';
import { isPrivateCampaignsAuthorized } from '../../../_private-campaigns.js';
import {
  MOVESCAN_OUTREACH_CAMPAIGN,
  buildOpenPixelUrl,

  buildTrackedProductUrl,
  cleanHeaderText,
  ensureCampaignRecipientsTable,
  recordRecipientEvent,
  isEmail,
} from '../../../_campaign-outreach.js';
import { ensureDb } from '../../../_lead-utils.js';



export async function onRequestPost({ request, env }) {
  if (!isPrivateCampaignsAuthorized(request, env)) {
    return json({ ok: false, error: 'Unauthorized.' }, { status: 401, headers: { 'cache-control': 'no-store' } });
  }

  const body = await readJson(request);
  const companyName = cleanHeaderText(body?.companyName || body?.company_name, 180);
  const recipientEmail = cleanHeaderText(body?.recipientEmail || body?.recipient_email, 240).toLowerCase();
  const errors = {};
  if (!companyName) errors.companyName = 'Company name is required.';
  if (!recipientEmail || !isEmail(recipientEmail)) errors.recipientEmail = 'A valid recipient email is required.';
  if (Object.keys(errors).length) return json({ ok: false, errors }, { status: 400, headers: { 'cache-control': 'no-store' } });

  const db = await ensureDb(env);
  await ensureCampaignRecipientsTable(db);
  const id = crypto.randomUUID();
  const token = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const productUrl = buildTrackedProductUrl(request, token);
  const pixelUrl = buildOpenPixelUrl(request, token);

  await db.prepare(`
    insert into campaign_recipients (id, tracking_token, company_name, recipient_email, campaign, status, created_at, sent_at)
    values (?, ?, ?, ?, ?, 'pending', ?, null)
  `).bind(id, token, companyName, recipientEmail, MOVESCAN_OUTREACH_CAMPAIGN, createdAt).run();

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
        companyName,
        recipientEmail,
        productUrl: productUrl.toString(),
        pixelUrl: pixelUrl.toString(),
      }),
    });
    const result = await workerResponse.json().catch(() => ({}));
    if (!workerResponse.ok || result.ok !== true) throw new Error(result.error || 'Outreach worker send failed.');
    const sentAt = new Date().toISOString();
    await db.prepare('update campaign_recipients set status = ?, sent_at = ? where id = ?').bind('sent', sentAt, id).run();
    try {
      await recordRecipientEvent(env, request, {
        token,
        eventName: 'email_sent',
        sourcePath: '/private/campaigns',
        destinationPath: productUrl.pathname + productUrl.search,
        metadata: { messageId: result?.messageId || '' },
      });
    } catch (eventError) {
      console.error('MoveScan outreach email sent but event recording failed', { code: eventError?.code || 'UNKNOWN', recipientId: id });
    }
    return json({ ok: true, recipient: { id, companyName, recipientEmail, status: 'sent', sentAt } }, { status: 201, headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    await db.prepare('update campaign_recipients set status = ? where id = ?').bind('failed', id).run();
    console.error('Unable to send MoveScan outreach email', { code: error?.code || 'UNKNOWN', recipientId: id });
    return json({ ok: false, error: 'Unable to send the outreach email right now.' }, { status: 502, headers: { 'cache-control': 'no-store' } });
  }
}

export async function onRequestGet() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405, headers: { allow: 'POST' } });
}
