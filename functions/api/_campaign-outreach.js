import { ensureDb, isEmail, safeString } from './_lead-utils.js';
import { recordCampaignEvent } from './_campaign-events.js';

const MOVESCAN_OUTREACH_CAMPAIGN = 'movescan_local_launch';
const MOVESCAN_RECIPIENT_COOKIE = 'aigl_movescan_recipient';
const TRACKING_COOKIE_MAX_AGE = 60 * 60 * 24 * 90;

function cleanHeaderText(value, max) {
  return safeString(value, max).replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[character]));
}

function isTrackingToken(value) {
  return typeof value === 'string' && /^[a-f0-9-]{20,80}$/i.test(value);
}

async function ensureCampaignRecipientsTable(db) {
  await db.exec(`
    create table if not exists campaign_recipients (
      id text primary key,
      tracking_token text not null unique,
      company_name text not null,
      recipient_email text not null,
      campaign text not null,
      status text not null default 'pending',
      created_at text not null,
      sent_at text
    );
  `);
  await db.exec('create index if not exists campaign_recipients_campaign_idx on campaign_recipients(campaign);');
  await db.exec('create index if not exists campaign_recipients_token_idx on campaign_recipients(tracking_token);');
}

function getCookies(request) {
  const cookies = {};
  (request.headers.get('cookie') || '').split(';').forEach((part) => {
    const index = part.indexOf('=');
    if (index < 0) return;
    cookies[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim());
  });
  return cookies;
}

function getRecipientToken(request) {
  const token = getCookies(request)[MOVESCAN_RECIPIENT_COOKIE] || '';
  return isTrackingToken(token) ? token : '';
}

function buildTrackedProductUrl(request, token) {
  const url = new URL('/products/movescan', request.url);
  url.searchParams.set('utm_source', 'movescan_outreach');
  url.searchParams.set('utm_medium', 'email');
  url.searchParams.set('utm_campaign', MOVESCAN_OUTREACH_CAMPAIGN);
  return url;
}

function buildOpenPixelUrl(request, token) {
  return new URL('/api/campaign/open/' + encodeURIComponent(token), request.url);
}

function buildRecipientCookie(request, token) {
  const secure = new URL(request.url).protocol === 'https:';
  return [
    MOVESCAN_RECIPIENT_COOKIE + '=' + encodeURIComponent(token),
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=' + TRACKING_COOKIE_MAX_AGE,
    secure ? 'Secure' : null,
  ].filter(Boolean).join('; ');
}

async function getRecipientByToken(env, token) {
  if (!isTrackingToken(token)) return null;
  const db = await ensureDb(env);
  await ensureCampaignRecipientsTable(db);
  return db.prepare(`
    select id, tracking_token, company_name, recipient_email, campaign, status, created_at, sent_at
    from campaign_recipients
    where tracking_token = ? and campaign = ?
    limit 1
  `).bind(token, MOVESCAN_OUTREACH_CAMPAIGN).first();
}

async function recordRecipientEvent(env, request, { token, eventName, sourcePath, destinationPath, metadata = {} }) {
  const recipient = await getRecipientByToken(env, token);
  if (!recipient) return null;

  return recordCampaignEvent(env, request, {
    eventName,
    campaign: recipient.campaign,
    sourcePath,
    destinationPath,
    utmSource: 'movescan_outreach',
    utmMedium: 'email',
    utmCampaign: recipient.campaign,
    metadata: {
      ...metadata,
      recipientId: recipient.id,
      companyName: recipient.company_name,
    },
  });
}

function buildOutreachEmail({ companyName, recipientEmail, productUrl, pixelUrl }) {
  const safeCompany = escapeHtml(companyName);
  const safeUrl = escapeHtml(productUrl.toString());
  const text = [
    'Hello,',
    '',
    'I wanted to share MoveScan, AI instant moving estimate software for moving companies.',
    '',
    'MoveScan guides a customer through a room-by-room walkthrough, builds the inventory, estimates the move, and applies your company pricing and operating settings.',
    '',
    'See MoveScan: ' + productUrl.toString(),
    '',
    'Best,',
    'AI Guy Labs',
  ].join('\n');
  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f4f7fb;color:#111827;font-family:Arial,sans-serif;">
    <main style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #dbe3ef;border-radius:8px;overflow:hidden;">
      <div style="padding:22px 26px;background:#05070b;color:#ffffff;">
        <p style="margin:0 0 8px;color:#8ed7ff;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;">AI Guy Labs</p>
        <h1 style="margin:0;font-size:24px;line-height:1.25;">MoveScan for ${safeCompany}</h1>
      </div>
      <div style="padding:26px;">
        <p style="margin:0 0 16px;font-size:16px;line-height:1.55;">Hello,</p>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.55;">I wanted to share MoveScan, AI instant moving estimate software for moving companies.</p>
        <p style="margin:0 0 22px;font-size:16px;line-height:1.55;">MoveScan guides a customer through a room-by-room walkthrough, builds the inventory, estimates the move, and applies your company pricing and operating settings.</p>
        <p style="margin:0 0 24px;"><a href="${safeUrl}" style="display:inline-block;padding:12px 18px;border-radius:6px;background:#2d7dff;color:#ffffff;font-weight:700;text-decoration:none;">See MoveScan</a></p>
        <p style="margin:0;font-size:14px;line-height:1.5;color:#4b5563;">Best,<br>AI Guy Labs</p>
      </div>
    </main>
    <img src="${escapeHtml(pixelUrl.toString())}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0;opacity:0;">
  </body>
</html>`;
  return { text, html, recipientEmail };
}

export {
  MOVESCAN_OUTREACH_CAMPAIGN,
  MOVESCAN_RECIPIENT_COOKIE,
  TRACKING_COOKIE_MAX_AGE,
  cleanHeaderText,
  ensureCampaignRecipientsTable,
  getRecipientByToken,
  getRecipientToken,
  buildTrackedProductUrl,
  buildOpenPixelUrl,
  buildRecipientCookie,
  recordRecipientEvent,
  buildOutreachEmail,
  isTrackingToken,
  isEmail,
};
