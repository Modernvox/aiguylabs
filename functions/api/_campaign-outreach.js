import { ensureDb, isEmail, safeString } from './_lead-utils.js';
import { recordCampaignEvent } from './_campaign-events.js';

const MOVESCAN_OUTREACH_CAMPAIGN = 'movescan_local_launch';
const MOVESCAN_RECIPIENT_COOKIE = 'aigl_movescan_recipient';
const TRACKING_COOKIE_MAX_AGE = 60 * 60 * 24 * 90;
const MOVESCAN_OUTREACH_PROSPECTS = [
  ['Moxa Moving', 'info@moxamoving.com'],
  ['People’s Choice Moving & Storage', 'info@peopleschoicemoving.com'],
  ['Nashville Packers and Movers', 'jmmoving84@gmail.com'],
  ['Little Guys Movers – Murfreesboro', 'murfreesboro@littleguys.com'],
  ['Next Step Moving', 'nextstepmoving2019@gmail.com'],
  ['Kincaid Moving & Storage', 'kincaidmoving@aol.com'],
  ['Boro Moving', 'Scott@BoroMoving.com'],
  ['King & Queen Movers', 'info@kingandqueenmovers.com'],
  ['JustPro Moving', 'info@justpromoving.com'],
  ['Family Movers 615', 'familymovers615@gmail.com'],
  ['Home-Aid Moving', 'william@home-aidmoving.com'],
  ['6th Man Movers', 'Jacob@6thmanmovers.com'],
  ['Tennessee Country Boys Moving', 'tennesseecountryboysmoving@gmail.com'],
  ['Dash Moving & Logistics', 'darrin@dashmovingtn.com'],
  ["Rice’s Professional Moving Services", 'RicesMovingTN@gmail.com'],
  ['JourneyMen Moving Tennessee', 'journeymanmoving.aaron@gmail.com'],
  ['ATC Moving Company', 'atcmoving401@gmail.com'],
  ['QuickSwitch Movers', 'quickswitchmoverstn@gmail.com'],
  ['Move It or Lose It', 'moveitorloseitmoves@gmail.com'],
  ['Yellowjacket Moving Service', 'info@yellowjacketmovingservice.com'],
  ['Alpha Moving & Storage', 'booking@alphamovingtn.com'],
  ['Better Day Movers', 'Betterdaymovers@gmail.com'],
  ['Daniels Moving and Logistics', 'danielslogisticsllc3@gmail.com'],
  ['Jett Moving Services', 'jettmoving@gmail.com'],
  ['Marigold Movers', 'marigoldmovers@gmail.com'],
  ['Southern Relocation Services', 'info@southernrelocationservices.com'],
  ["Hank’s Moving Service", 'info@hanksmovingservicellc.com'],
  ['At Ease Moving', 'move@ateasemoving.com'],
  ['Highbrow Moving', 'info@highbrowmoving.com'],
  ['True Friends Moving Company', 'chris@truefriendsmoving.com'],
  ['Elizabeth\u2019s Moving & Storage', 'sales@elizabethsmoving.com'],
  ['Good Guys Moving', 'info@goodguyschattanooga.com'],
  ['River City Moving', 'rivercitymovingtn@gmail.com'],
  ['All Out Moving', 'info@alloutmoving.com'],
  ['Lanigan Worldwide Moving & Warehouse', 'laniganmoving@gmail.com'],
  ['Affordable Moves', 'affordablemoves@hotmail.com'],
  ['Southern Elite Van Lines', 'southernelitevanlines@gmail.com'],
  ['Country Club Moving', 'colquettvandyke@gmail.com'],
  ['Trent Moving & Storage', 'mika@trentmoving.com'],
  ['A.M. P.M.\u2019s Professional Movers', 'customerservice@ampmmovers.com'],
  ['Brian\u2019s Moving Service', 'briansmovingservice@yahoo.com'],
  ['Still Transfer Moving & Storage', 'info@stilltransfer.net'],
  ['Morton Moving & Storage', 'edward@mortonmoving.com'],
  ['Jackson Movers', 'info@jacksonmovers.com'],
  ['865 Movers', 'info@865movers.com'],
  ['C&R Moving', 'crmovingcrew@gmail.com'],
  ['Boundless Moving & Storage', 'Matt@BoundlessMoving.com'],
  ['Big League Movers', 'sales@bigleaguemovers.com'],
  ['Midas Touch Moving', 'Mtouchmoves@gmail.com'],
  ['Grind City Moving', 'hunter.weddle@grindcitymoving.com'],
];

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
  await db.prepare(`create table if not exists campaign_recipients (id text primary key, tracking_token text not null unique, company_name text not null, recipient_email text not null, campaign text not null, status text not null default 'pending', delivery_status text, created_at text not null, sent_at text)`).run();
  try { await db.prepare('alter table campaign_recipients add column delivery_status text').run(); } catch {};
  await db.prepare('create index if not exists campaign_recipients_campaign_idx on campaign_recipients(campaign)').run();
  await db.prepare('create index if not exists campaign_recipients_token_idx on campaign_recipients(tracking_token)').run();
}

async function ensureCampaignEmailTemplatesTable(db) {
  await db.prepare(`create table if not exists campaign_email_templates (campaign text primary key, subject text not null, body_text text not null, updated_at text not null)`).run();
}

async function loadCampaignEmailTemplate(env) {
  const db = await ensureDb(env);
  await ensureCampaignEmailTemplatesTable(db);
  const row = await db.prepare(`
    select subject, body_text as bodyText, updated_at as updatedAt
    from campaign_email_templates
    where campaign = ?
    limit 1
  `).bind(MOVESCAN_OUTREACH_CAMPAIGN).first();
  return {
    subject: normalizeOutreachSubject(row?.subject),
    bodyText: normalizeOutreachBody(row?.bodyText),
    updatedAt: row?.updatedAt || '',
    isDefault: !row,
  };
}

async function saveCampaignEmailTemplate(env, { subject, bodyText }) {
  const db = await ensureDb(env);
  await ensureCampaignEmailTemplatesTable(db);
  const normalizedSubject = normalizeOutreachSubject(subject);
  const normalizedBody = normalizeOutreachBody(bodyText);
  const updatedAt = new Date().toISOString();
  await db.prepare(`
    insert into campaign_email_templates (campaign, subject, body_text, updated_at)
    values (?, ?, ?, ?)
    on conflict(campaign) do update set subject = excluded.subject, body_text = excluded.body_text, updated_at = excluded.updated_at
  `).bind(MOVESCAN_OUTREACH_CAMPAIGN, normalizedSubject, normalizedBody, updatedAt).run();
  return { subject: normalizedSubject, bodyText: normalizedBody, updatedAt, isDefault: false };
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
  if (isTrackingToken(token)) url.searchParams.set('ms_recipient', token);
  return url;
}

function buildTrackedOutreachUrl(request, token) {
  return new URL('/go/movescan-outreach/' + encodeURIComponent(token), request.url);
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

async function recordRecipientEvent(env, request, { token, eventName, sourcePath, destinationPath, metadata = {}, once = false }) {
  const recipient = await getRecipientByToken(env, token);
  if (!recipient) return null;

  const eventMetadata = {
    ...metadata,
    recipientId: recipient.id,
    companyName: recipient.company_name,
  };
  if (once) {
    const existing = await ensureDb(env).then((db) => db.prepare(`
      select id, created_at as createdAt
      from campaign_events
      where campaign = ? and event_name = ? and instr(metadata, ?) > 0
      order by created_at asc
      limit 1
    `).bind(recipient.campaign, eventName, '"recipientId":"' + recipient.id + '"').first());
    if (existing) return { duplicate: true, id: existing.id, createdAt: existing.createdAt };
  }

  return recordCampaignEvent(env, request, {
    eventName,
    campaign: recipient.campaign,
    sourcePath,
    destinationPath,
    utmSource: 'movescan_outreach',
    utmMedium: 'email',
    utmCampaign: recipient.campaign,
    metadata: eventMetadata,
  });
}

const DEFAULT_OUTREACH_SUBJECT = 'Turn your moving website into a 24/7 AI-powered instant estimator';
const DEFAULT_OUTREACH_BODY = `Turn your moving website into a 24/7 AI-powered instant estimator

MoveScan turns the customer’s phone into a guided moving-estimate walkthrough—and turns your website into a place where customers can actually get an estimate instead of just requesting one.

A typical two- to three-bedroom home can complete the entire walkthrough in under five minutes.

There are no furniture lists to type. No app to download. No 20-minute phone conversation just to figure out what someone owns.

The customer simply shows MoveScan their home, room by room. Most room recordings take only a few seconds, with a maximum of 20 seconds per room. MoveScan’s AI analyzes those quick recordings, builds the inventory, combines it with the customer’s move details, and applies your company’s pricing rules to produce an instant estimate.

That means your company can be generating estimates 24 hours a day—even while you’re sleeping, working another move, or helping another customer.`;

function normalizeOutreachSubject(value) {
  return cleanHeaderText(value || DEFAULT_OUTREACH_SUBJECT, 180) || DEFAULT_OUTREACH_SUBJECT;
}

function normalizeOutreachBody(value) {
  return safeString(value || DEFAULT_OUTREACH_BODY, 12000).replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim() || DEFAULT_OUTREACH_BODY;
}

function textWithTrackedLinks(bodyText, trackedProductUrl) {
  return bodyText.replace(/https:\/\/aiguylabs\.com\/products\/movescan/g, trackedProductUrl);
}

function renderEmailParagraph(paragraph, safeUrl) {
  const escaped = escapeHtml(paragraph).replace(/https:\/\/aiguylabs\.com\/products\/movescan/g, '<a href="' + safeUrl + '" style="color:#1264d8;">https://aiguylabs.com/products/movescan</a>');
  return '<p style="margin:0 0 18px;font-size:16px;line-height:1.65;white-space:pre-wrap;">' + escaped + '</p>';
}

function buildOutreachEmail({ productUrl, pixelUrl, subject, bodyText }) {
  const trackedProductUrl = productUrl.toString();
  const safeUrl = escapeHtml(trackedProductUrl);
  const safePixelUrl = escapeHtml(pixelUrl.toString());
  const normalizedSubject = normalizeOutreachSubject(subject);
  const normalizedBody = normalizeOutreachBody(bodyText);
  const paragraphs = normalizedBody.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  const textParts = paragraphs.length ? [...paragraphs] : [DEFAULT_OUTREACH_BODY];
  textParts.push('See MoveScan in Action: ' + trackedProductUrl);
  const text = textWithTrackedLinks(textParts.join('\n\n'), trackedProductUrl);
  const htmlParts = [];
  paragraphs.forEach((paragraph) => {
    htmlParts.push(renderEmailParagraph(paragraph, safeUrl));
  });
  htmlParts.push('<p style="margin:28px 0 0;text-align:center;"><a href="' + safeUrl + '" style="display:inline-block;background:#1264d8;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;line-height:1.2;padding:14px 22px;border-radius:6px;">See MoveScan in Action</a></p>');
  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f4f7fb;color:#111827;font-family:Arial,sans-serif;">
    <main style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #dbe3ef;border-radius:8px;overflow:hidden;">
      <div style="padding:28px 30px;">
        ${htmlParts.join('\n        ')}
      </div>
    </main>
    <img src="${safePixelUrl}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0;opacity:0;">
  </body>
</html>`;
  return { subject: normalizedSubject, text, html };
}

export {
  DEFAULT_OUTREACH_BODY,
  DEFAULT_OUTREACH_SUBJECT,
  MOVESCAN_OUTREACH_CAMPAIGN,
  MOVESCAN_OUTREACH_PROSPECTS,
  MOVESCAN_RECIPIENT_COOKIE,
  TRACKING_COOKIE_MAX_AGE,
  cleanHeaderText,
  ensureCampaignRecipientsTable,
  loadCampaignEmailTemplate,
  saveCampaignEmailTemplate,
  getRecipientByToken,
  getRecipientToken,
  buildTrackedProductUrl,
  buildTrackedOutreachUrl,
  buildOpenPixelUrl,
  buildRecipientCookie,
  recordRecipientEvent,
  buildOutreachEmail,
  isTrackingToken,
  isEmail,
};
