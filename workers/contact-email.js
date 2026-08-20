import {
  onRequestDelete,
  onRequestGet,
  onRequestPatch,
  onRequestPost,
  onRequestPut,
} from '../functions/api/contact-requests/index.js';
import { recordCampaignEvent } from '../functions/api/_campaign-events.js';
import { ensureCampaignRecipientsTable, MOVESCAN_OUTREACH_CAMPAIGN } from '../functions/api/_campaign-outreach.js';
import {
  buildOutreachEmail,
  cleanHeaderText,
  isEmail,
} from '../functions/api/_campaign-outreach.js';

const OUTREACH_FROM = 'mike@aiguylabs.com';
const OUTREACH_REPLY_TO = 'mike@aiguylabs.com';

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...(init.headers || {}),
    },
  });
}

async function handleOutreachSend(request, env) {
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed.' }, { status: 405, headers: { allow: 'POST' } });
  }

  const expectedToken = env.OUTREACH_INTERNAL_TOKEN || '';
  const providedToken = request.headers.get('x-outreach-token') || '';
  if (!expectedToken || providedToken !== expectedToken) {
    return json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  const companyName = cleanHeaderText(body?.companyName, 180);
  const recipientEmail = cleanHeaderText(body?.recipientEmail, 240).toLowerCase();
  const productUrl = cleanHeaderText(body?.productUrl, 1000);
  const pixelUrl = cleanHeaderText(body?.pixelUrl, 1000);
  if (!companyName || !recipientEmail || !isEmail(recipientEmail) || !productUrl || !pixelUrl) {
    return json({ ok: false, error: 'Invalid outreach email request.' }, { status: 400 });
  }

  let parsedProductUrl;
  let parsedPixelUrl;
  try {
    parsedProductUrl = new URL(productUrl);
    parsedPixelUrl = new URL(pixelUrl);
  } catch {
    return json({ ok: false, error: 'Invalid tracking URLs.' }, { status: 400 });
  }

  const email = buildOutreachEmail({
    companyName,
    recipientEmail,
    productUrl: parsedProductUrl,
    pixelUrl: parsedPixelUrl,
  });

  if (body?.validateOnly === true) {
    return json({ ok: true, validated: true, from: OUTREACH_FROM, replyTo: OUTREACH_REPLY_TO });
  }

  if (!env.OUTREACH_EMAIL || typeof env.OUTREACH_EMAIL.send !== 'function') {
    console.error('OUTREACH_EMAIL binding is not configured.');
    return json({ ok: false, error: 'Outreach email is not configured.' }, { status: 502 });
  }

  try {
    const result = await env.OUTREACH_EMAIL.send({
      from: OUTREACH_FROM,
      to: recipientEmail,
      replyTo: OUTREACH_REPLY_TO,
      subject: 'Early MoveScan Network Opportunity',
      text: email.text,
      html: email.html,
    });
    return json({ ok: true, messageId: result?.messageId || '' }, { status: 202 });
  } catch (error) {
    console.error('MoveScan outreach email send failed', { code: error?.code || 'UNKNOWN' });
    return json({ ok: false, error: 'Unable to send outreach email.' }, { status: 502 });
  }
}

const DELIVERY_EVENT_NAMES = {
  'cf.email.sending.message.delivered': 'email_delivered',
  'cf.email.sending.message.deferred': 'email_deferred',
  'cf.email.sending.message.bounced': 'email_bounced',
  'cf.email.sending.message.rejected': 'email_rejected',
  'cf.email.sending.message.complained': 'email_complained',
  'cf.email.sending.message.failed': 'email_failed',
};

function parseQueueEvent(body) {
  if (typeof body === 'string') {
    try { return JSON.parse(body); } catch { return null; }
  }
  return body && typeof body === 'object' ? body : null;
}

async function recordEmailDeliveryEvent(env, body) {
  const event = parseQueueEvent(body);
  const eventName = DELIVERY_EVENT_NAMES[event?.type];
  const payload = event?.payload || {};
  const messageId = cleanHeaderText(payload.messageId, 240);
  const recipientEmail = cleanHeaderText(payload.recipient, 240).toLowerCase();
  const providerEventId = cleanHeaderText(payload.eventId, 240);
  if (!eventName || !messageId || !recipientEmail || !providerEventId) return false;

  const db = env.DB;
  if (!db) throw new Error('Campaign database is not configured.');
  await ensureCampaignRecipientsTable(db);
  const recipient = await db.prepare(`
    select id, company_name as companyName, recipient_email as recipientEmail, campaign
    from campaign_recipients
    where campaign = ? and lower(recipient_email) = ?
    limit 1
  `).bind(MOVESCAN_OUTREACH_CAMPAIGN, recipientEmail).first();
  if (!recipient) return false;

  const sentEvent = await db.prepare(`
    select id from campaign_events
    where campaign = ? and event_name = 'email_sent' and instr(metadata, ?) > 0
    limit 1
  `).bind(recipient.campaign, '"messageId":"' + messageId + '"').first();
  if (!sentEvent) return false;

  const createdAt = event?.metadata?.eventTimestamp || new Date().toISOString();
  const delivery = payload.delivery || {};
  const providerDetails = [delivery.status, delivery.smtpStatusCode, delivery.smtpEnhancedStatusCode, payload.reason, payload.message].filter(Boolean).join(' ');
  const explicitlyInvalidMailbox = /(?:5\.1\.1|5\.1\.10|mailbox|recipient|user).*(?:invalid|unknown|does not exist|not found|unavailable)/i.test(providerDetails);
  const deliveryStatus = explicitlyInvalidMailbox ? 'doesnt_exist' : eventName.replace('email_', '');
  try {
    await recordCampaignEvent(env, new Request('https://aiguylabs.com/api/email-events', {
      headers: { 'user-agent': 'cloudflare-email-service-event' },
    }), {
      id: 'email-provider:' + providerEventId,
      createdAt,
      eventName,
      campaign: recipient.campaign,
      sourcePath: '/api/email-events',
      destinationPath: '/private/campaigns',
      utmSource: 'movescan_outreach',
      utmMedium: 'email',
      utmCampaign: recipient.campaign,
      metadata: {
        recipientId: recipient.id,
        companyName: recipient.companyName,
        providerEventId,
        messageId,
        providerStatus: delivery.status || eventName.replace('email_', ''),
        smtpStatusCode: delivery.smtpStatusCode || '',
        smtpEnhancedStatusCode: delivery.smtpEnhancedStatusCode || '',
      },
    });
  } catch (error) {
    if (!String(error?.message || '').toLowerCase().includes('constraint')) throw error;
  }
  await db.prepare('update campaign_recipients set delivery_status = ? where id = ?').bind(deliveryStatus, recipient.id).run();
  return true;
}
export default {

  async queue(batch, env) {
    for (const message of batch.messages) {
      try {
        await recordEmailDeliveryEvent(env, message.body);
        message.ack();
      } catch (error) {
        console.error('Unable to process Cloudflare email delivery event', { code: error?.code || 'UNKNOWN' });
        message.retry();
      }
    }
  },
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/movescan-outreach/send') return handleOutreachSend(request, env);
    if (url.pathname !== '/api/contact-requests') return new Response('Not found', { status: 404 });

    const context = { request, env, ctx, params: {} };
    if (request.method === 'POST') return onRequestPost(context);
    if (request.method === 'GET') return onRequestGet(context);
    if (request.method === 'PUT') return onRequestPut(context);
    if (request.method === 'PATCH') return onRequestPatch(context);
    if (request.method === 'DELETE') return onRequestDelete(context);

    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed.' }), {
      status: 405,
      headers: { 'content-type': 'application/json; charset=utf-8', allow: 'POST' },
    });
  },
};