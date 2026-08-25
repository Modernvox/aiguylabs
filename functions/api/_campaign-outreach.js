import { ensureDb, isEmail, safeString } from './_lead-utils.js';
import { recordCampaignEvent } from './_campaign-events.js';

const MOVESCAN_OUTREACH_CAMPAIGN = 'movescan_local_launch';
const MOVESCAN_RECIPIENT_COOKIE = 'aigl_movescan_recipient';
const TRACKING_COOKIE_MAX_AGE = 60 * 60 * 24 * 90;
const MOVESCAN_OUTREACH_PROSPECTS = [
  ['Moxa Moving', 'info@moxamoving.com', 'TN'],
  ['People’s Choice Moving & Storage', 'info@peopleschoicemoving.com', 'TN'],
  ['Nashville Packers and Movers', 'jmmoving84@gmail.com', 'TN'],
  ['Little Guys Movers – Murfreesboro', 'murfreesboro@littleguys.com', 'TN'],
  ['Next Step Moving', 'nextstepmoving2019@gmail.com', 'TN'],
  ['Kincaid Moving & Storage', 'kincaidmoving@aol.com', 'TN'],
  ['Boro Moving', 'Scott@BoroMoving.com', 'TN'],
  ['King & Queen Movers', 'info@kingandqueenmovers.com', 'TN'],
  ['JustPro Moving', 'info@justpromoving.com', 'TN'],
  ['Family Movers 615', 'familymovers615@gmail.com', 'TN'],
  ['Home-Aid Moving', 'william@home-aidmoving.com', 'TN'],
  ['6th Man Movers', 'Jacob@6thmanmovers.com', 'TN'],
  ['Tennessee Country Boys Moving', 'tennesseecountryboysmoving@gmail.com', 'TN'],
  ['Dash Moving & Logistics', 'darrin@dashmovingtn.com', 'TN'],
  ["Rice’s Professional Moving Services", 'RicesMovingTN@gmail.com', 'TN'],
  ['JourneyMen Moving Tennessee', 'journeymanmoving.aaron@gmail.com', 'TN'],
  ['ATC Moving Company', 'atcmoving401@gmail.com', 'TN'],
  ['QuickSwitch Movers', 'quickswitchmoverstn@gmail.com', 'TN'],
  ['Move It or Lose It', 'moveitorloseitmoves@gmail.com', 'TN'],
  ['Yellowjacket Moving Service', 'info@yellowjacketmovingservice.com', 'TN'],
  ['Alpha Moving & Storage', 'booking@alphamovingtn.com', 'TN'],
  ['Better Day Movers', 'Betterdaymovers@gmail.com', 'TN'],
  ['Daniels Moving and Logistics', 'danielslogisticsllc3@gmail.com', 'TN'],
  ['Jett Moving Services', 'jettmoving@gmail.com', 'TN'],
  ['Marigold Movers', 'marigoldmovers@gmail.com', 'TN'],
  ['Southern Relocation Services', 'info@southernrelocationservices.com', 'TN'],
  ["Hank’s Moving Service", 'info@hanksmovingservicellc.com', 'TN'],
  ['At Ease Moving', 'move@ateasemoving.com', 'TN'],
  ['Highbrow Moving', 'info@highbrowmoving.com', 'TN'],
  ['True Friends Moving Company', 'chris@truefriendsmoving.com', 'TN'],
  ['Elizabeth\u2019s Moving & Storage', 'sales@elizabethsmoving.com', 'TN'],
  ['Good Guys Moving', 'info@goodguyschattanooga.com', 'TN'],
  ['River City Moving', 'rivercitymovingtn@gmail.com', 'TN'],
  ['All Out Moving', 'info@alloutmoving.com', 'TN'],
  ['Lanigan Worldwide Moving & Warehouse', 'laniganmoving@gmail.com', 'TN'],
  ['Affordable Moves', 'affordablemoves@hotmail.com', 'TN'],
  ['Southern Elite Van Lines', 'southernelitevanlines@gmail.com', 'TN'],
  ['Country Club Moving', 'colquettvandyke@gmail.com', 'TN'],
  ['Trent Moving & Storage', 'mika@trentmoving.com', 'TN'],
  ['A.M. P.M.\u2019s Professional Movers', 'customerservice@ampmmovers.com', 'TN'],
  ['Brian\u2019s Moving Service', 'briansmovingservice@yahoo.com', 'TN'],
  ['Still Transfer Moving & Storage', 'info@stilltransfer.net', 'TN'],
  ['Morton Moving & Storage', 'edward@mortonmoving.com', 'TN'],
  ['Jackson Movers', 'info@jacksonmovers.com', 'TN'],
  ['865 Movers', 'info@865movers.com', 'TN'],
  ['C&R Moving', 'crmovingcrew@gmail.com', 'TN'],
  ['Boundless Moving & Storage', 'Matt@BoundlessMoving.com', 'TN'],
  ['Big League Movers', 'sales@bigleaguemovers.com', 'TN'],
  ['Midas Touch Moving', 'Mtouchmoves@gmail.com', 'TN'],
  ['Grind City Moving', 'hunter.weddle@grindcitymoving.com', 'TN'],
  ["A Cut Above Moving and Relocation Service","info@acutabovemoving.com","NC"],
  ["All American Relocation","drushing@aacorp-usa.com","NC"],
  ["All My Sons Moving & Storage of Raleigh","Raleigh@allmysons.com","NC"],
  ["All My Sons of Greensboro, LLC","greensboro@allmysons.com","NC"],
  ["American Moving & Hauling, Inc.","amy@americanmovingandhauling.com","NC"],
  ["Armstrong Transfer & Storage Co., Inc.","cjones@goarmstrong.com","NC"],
  ["Boundless Moving & Storage, LLC","info@boundlessmoving.com","NC"],
  ["Capital Moving & Storage of the Triad, LLC","triad@capitalmovingnc.com","NC"],
  ["Capital Relocation Group","eric.martin@capitalrelocationgroup.com","NC"],
  ["Carey Moving & Storage of Asheville, Inc.","jlaughter@careymoving.com","NC"],
  ["Charlotte Hunks, LLC","scott.s.whitaker@chhj.com","NC"],
  ["City Transfer & Storage Company","slassiter@ctsmoves.com","NC"],
  ["College Hunks Hauling Junk and Moving \u2013 Wilmington","jeff.moss@chhj.com","NC"],
  ["Crabtree Family Moving","cliff@crabtreefamilymoving.com","NC"],
  ["DeHaven's Transfer & Storage, Inc.","customerservice@dehavens.com","NC"],
  ["E. E. Ward Moving & Storage Co., LLC","info@eeward.com","NC"],
  ["East Coast Moving","eastcoastmvg@atmc.net","NC"],
  ["Easy Movers, Inc.","info@easymovers.com","NC"],
  ["Excel Moving & Storage","sroberts@excelms.com","NC"],
  ["Gasperson Transfer","tomjr@gaspersonmoving.com","NC"],
  ["Gentle Giant Moving Company, LLC","rfarnum@gentlegiant.com","NC"],
  ["King Moving, LLC","tylerneininger@kingmovingnc.com","NC"],
  ["Lawrence Companies, Inc.","jhobbs@lawrencecompanies.com","NC"],
  ["Lentz Moving Services","jsuggs@coreloexperts.com","NC"],
  ["Luggers of Wilmington","ian.myers@junkluggers.com","NC"],
  ["Make A Move","info@MakeAMoveToday.com","NC"],
  ["Marathon Moving Company, Inc.","tyler@marathonmovingco.com","NC"],
  ["Mather Brothers Moving Company, LLC","info@matherbrothers.com","NC"],
  ["Metrolina Relocation, LLC","steve@metro-relo.com","NC"],
  ["Miracle Movers of the Triad, LLC","jared.huffman@miraclemoverstriad.com","NC"],
  ["Move 4 Less of North Carolina, LLC","admin@move4lessmoving.com","NC"],
  ["Move and Care, LLC","artem@move-and-care.com","NC"],
  ["Movers Near Me, LLC","michael@greatmoversnearme.com","NC"],
  ["Movin' On Movers, Inc.","hannah@movinonmovers.com","NC"],
  ["Next Stop Movers, LLC","info@nextstopmoversnc.com","NC"],
  ["Easy Moving - Charlotte","support@easymoving.com","NC"],
  ["Athens Moving Experts","move@athensmovingexperts.com","NC"],
  ["TROSA Moving","moving@trosamoving.com","NC"],
  ["Two Twigs Moving","support@twotwigsmoving.com","NC"],
  ["Reign Moving Solutions","admin@reignmovingsolutions.com","NC"],
  ["Four Pillars Moving","Admin@FourPillarsMoving.com","NC"],
  ["Citywide Moving Systems","info@citywidemoving.com","NC"],
  ["Coastal Carrier Moving & Storage Company","info@coastalcarrier.com","NC"],
  ["Little Guys Movers","raleigh@littleguys.com","NC"],
  ["Junk Pros of NC","requestinfo@junkprosnc.com","NC"],
  ["UniMovers","triad@unimovers.com","NC"],
  ["MoveMates","info@themovingmates.com","NC"],
  ["NuWay Relocation","info@nuway-relocation.com","NC"],
  ["OBX Movers","matt@obxmovers.com","NC"],
  ["Moving With Purpose","support@mwpmovers.com","NC"],
  ["CJ Moving Services","info@cjmovingservicesllc.com","NC"],
  ["WellKnown Moving Company","contact@wellknownmoving.com","NC"],
  ["Red Brick Moving","info@redbrickmoving.com","NC"],
  ["Rye Moving & Packing","logan@ryemoving.com","NC"],
  ["Road Haugs Moving & Storage","moving@roadhaugs.com","NC"],
  ['Movers Chicago', 'info@moverschicago.com', 'IL'],
  ['Chicago Movers', 'mk@chicagomovers.com', 'IL'],
  ['STI Moving & Storage', 'info@stimovers.com', 'IL'],
  ['Windy City Movers', 'info@wcmoving.com', 'IL'],
  ['Lyons Moving', 'info@lyonsmoving.com', 'IL'],
  ['Chicago Movers Near Me', 'info@chicagomoversnearme.com', 'IL'],
  ['FairPlay Moving', 'info@fairplaymoving.com', 'IL'],
  ['Sweet Home Movers Chicago', 'info@shmchicago.com', 'IL'],
  ['Expert Movers', 'info@hireexpertmovers.com', 'IL'],
  ['Elite Moving & Storage', 'info@elitemover.com', 'IL'],
  ['Aaron Bros. Moving System', 'info@wemovechicago.com', 'IL'],
  ['Move-Tastic', 'info@move-tastic.com', 'IL'],
  ['H2H Movers', 'info@h2hmovers.com', 'IL'],
  ['Bernard Movers', 'info@bernardmovers.com', 'IL'],
  ['MOOvers Chicago', 'contact@mooverschicago.com', 'IL'],
  ['Move4U Movers', 'info@move4umovers.com', 'IL'],
  ['Mid-West Moving & Storage', 'info@midwestmoving.com', 'IL'],
  ['Golan’s Moving & Storage', 'sales@golansmoving.com', 'IL'],
  ['Reliable Movers LLC', 'info@reliablemovers.net', 'IL'],
  ['Ace Relocation Systems', 'kferris@acerelocation.com', 'IL'],
  ['Boerman Moving & Storage', 'info@boerman.com', 'IL'],
  ['Happ Movers', 'happmovers@happmovers.com', 'IL'],
  ['USA Moving & Storage', 'info@usamovingandstorage.com', 'IL'],
  ['Golden Eagle Movers', 'info@goldeneaglemovers.com', 'IL'],
  ['Moving Solutions', 'info@movingsolutionschicago.com', 'IL'],
  ['Chicago Best Movers', 'info@chicagobestmovers.com', 'IL'],
  ['Great Chicago Movers', 'info@greatchicagomover.com', 'IL'],
  ['Lift & Load Moving', 'contact@liftandloadmoving.com', 'IL'],
  ['3MD Relocation', 'info@3mdrelocation.com', 'IL'],
  ['LifeTime Movers', 'info@lifetimemovers.us', 'IL'],
  ['Asher Movers', 'info@ashermovers.com', 'IL'],
  ['All Seasons Mover', 'contact@allseasonsmover.com', 'IL'],
  ['A Move to Remember', 'support@amovetoremember.com', 'IL'],
  ['White Glove Moving & Storage', 'info@whiteglovetransport.com', 'IL'],
  ['AMPOL Movers', 'info@ampolmoving.com', 'IL'],
  ['Midway Moving & Storage', 'info@midwaymoving.com', 'IL'],
  ['MiniMoves', 'drusso@minimoves.com', 'IL'],
  ['Beltmann Relocation Group', 'mike.harvey@beltmann.com', 'IL'],
  ['Breda Moving Company', 'mbreda@bredamoving.com', 'IL'],
  ['Shurway Moving & Cartage', 'ericb@shurwaymovers.com', 'IL'],
  ['Federal Companies', 'joe.friedman@federalcos.com', 'IL'],
  ['New World Van Lines', 'info@nwvl.com', 'IL'],
  ['Reebie Storage & Moving', 'aburl@reebieallied.com', 'IL'],
  ['The Professionals Moving Specialists', 'info@thepromove.com', 'IL'],
  ['B12 Moving', 'info@b12moving.com', 'IL'],
  ['Coffey Bros. Moving', 'info@coffeybrosmoving.com', 'IL'],
  ['Kolovitz Movers', 'info@kolovitzmovers.com', 'IL'],
  ['Hassett Commercial Moving & Storage', 'marty.schiller@hassettmoving.com', 'IL'],
  ['Hollander International Storage & Moving', 'rob@hollandermoving.com', 'IL'],
  ['Hercules Moving LLC', 'mazzocchi@herculesmove.com', 'IL'],
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
  await db.prepare(`create table if not exists campaign_recipients (id text primary key, tracking_token text not null unique, company_name text not null, recipient_email text not null, campaign text not null, status text not null default 'pending', delivery_status text, state text, created_at text not null, sent_at text)`).run();
  try { await db.prepare('alter table campaign_recipients add column delivery_status text').run(); } catch {};
  try { await db.prepare('alter table campaign_recipients add column state text').run(); } catch {};
  await db.prepare(`update campaign_recipients set state = 'TN' where campaign = ? and (state is null or trim(state) = '')`).bind(MOVESCAN_OUTREACH_CAMPAIGN).run();
  await db.prepare('create index if not exists campaign_recipients_campaign_idx on campaign_recipients(campaign)').run();
  await db.prepare('create index if not exists campaign_recipients_token_idx on campaign_recipients(tracking_token)').run();
}

async function ensureCampaignEmailTemplatesTable(db) {
  await db.prepare(`create table if not exists campaign_email_templates (campaign text primary key, subject text not null, body_text text not null, updated_at text not null)`).run();
}

async function ensureCampaignRecipientEngagementTables(db) {
  await db.prepare(`create table if not exists campaign_recipient_engagement (recipient_id text not null, campaign text not null, product_page_engaged_ms integer not null default 0, last_seen_at text, updated_at text not null, primary key (recipient_id, campaign))`).run();
  await db.prepare(`create table if not exists campaign_recipient_engagement_flushes (flush_id text not null, recipient_id text not null, campaign text not null, delta_ms integer not null, created_at text not null, primary key (flush_id, recipient_id, campaign))`).run();
  await db.prepare('create index if not exists campaign_recipient_engagement_campaign_idx on campaign_recipient_engagement(campaign)').run();
  await db.prepare('create index if not exists campaign_recipient_engagement_updated_idx on campaign_recipient_engagement(campaign, updated_at desc)').run();
  await db.prepare('create index if not exists campaign_recipient_engagement_flushes_campaign_idx on campaign_recipient_engagement_flushes(campaign, created_at desc)').run();
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

const DEFAULT_OUTREACH_SUBJECT = 'Does this estimate look correct to you?';
const OUTREACH_PREHEADER = 'Phone scan \u2192 instant moving estimate.';
const DEFAULT_OUTREACH_BODY = `Hi,

Quick question \u2014 **does this estimate look reasonable to you?**

**Example MoveScan Instant Estimate**

**Job:** Unload Only
**Source:** 5' \u00d7 12' storage unit \u2014 100% full
**Estimated Volume:** 480 cu. ft.

**Recommended Truck:** 15 ft. truck \u2014 approx. 70% full
**Recommended Crew:** 2 movers
**Billable Labor:** 2-hour minimum

**Moving Labor:** $250.00
**Tax:** $20.63

**Estimated Total: $270.63**

*Truck recommendation only \u2014 truck charges are not included.*

What makes this different is how the estimate was created.

**MoveScan generated it automatically from the customer's move details.**

MoveScan lets moving companies give customers instant estimates from their phone while using **the moving company's own pricing rules**.

For full-service moves, customers can quickly scan their rooms and MoveScan's AI builds the inventory. For jobs like this unload, it collects the truck/storage and access details needed to produce the estimate without requiring a walkthrough.

Instead of spending 20 minutes on the phone figuring out what someone has, your website can be generating estimates **24/7**.

**See MoveScan in action:**
https://aiguylabs.com/products/movescan

You can start with **5 free estimates**.

**Mike St. Pierre**
**MoveScan Founder**`;

function normalizeOutreachSubject(value) {
  return cleanHeaderText(value || DEFAULT_OUTREACH_SUBJECT, 180) || DEFAULT_OUTREACH_SUBJECT;
}

function repairOutreachText(value) {
  return String(value || '')
    .replace(new RegExp('\u00e2\u20ac\u201d', 'g'), '\u2014')
    .replace(new RegExp('\u00e2\u20ac\u201c', 'g'), '\u2013')
    .replace(new RegExp('\u00e2\u20ac\u2122', 'g'), '\u2019')
    .replace(new RegExp('\u00e2\u20ac\u0153', 'g'), '\u201c')
    .replace(new RegExp('\u00e2\u20ac\u009d', 'g'), '\u201d')
    .replace(new RegExp('\u00c3\u2014', 'g'), '\u00d7');
}

function normalizeOutreachBody(value) {
  return repairOutreachText(safeString(value || DEFAULT_OUTREACH_BODY, 12000)).replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim() || DEFAULT_OUTREACH_BODY;
}

function textWithTrackedLinks(bodyText, trackedProductUrl) {
  return bodyText.replace(/https:\/\/aiguylabs\.com\/products\/movescan/g, trackedProductUrl);
}

function stripEmailMarkdown(value) {
  return String(value || '')
    .replace(/\*\*([^*]+?)\*\*/g, '$1')
    .replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, '$1$2');
}

function renderEmailInline(value, safeUrl) {
  return escapeHtml(value)
    .replace(/\*\*([^*]+?)\*\*/g, '<strong style="font-weight:700;color:#111827;">$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, '$1<em style="font-style:italic;color:#4b5563;">$2</em>')
    .replace(/https:\/\/aiguylabs\.com\/products\/movescan/g, '<a href="' + safeUrl + '" style="color:#1264d8;text-decoration:underline;">https://aiguylabs.com/products/movescan</a>');
}

function renderEmailParagraph(paragraph, safeUrl) {
  const trimmed = paragraph.trim();
  const isEstimateTitle = /^\*\*Example MoveScan Instant Estimate\*\*$/i.test(trimmed);
  const isEstimateTotal = /^\*\*Estimated Total:/i.test(trimmed);
  const isFinePrint = /^\*Truck recommendation only/i.test(trimmed);
  const fontSize = isEstimateTotal ? '18px' : '16px';
  const margin = isEstimateTitle ? '4px 0 12px' : isFinePrint ? '0 0 22px' : '0 0 18px';
  const color = isFinePrint ? '#4b5563' : '#111827';
  return '<p style="margin:' + margin + ';font-size:' + fontSize + ';line-height:1.65;color:' + color + ';white-space:pre-wrap;">' + renderEmailInline(paragraph, safeUrl) + '</p>';
}

function buildOutreachEmail({ productUrl, pixelUrl, subject, bodyText }) {
  const trackedProductUrl = productUrl.toString();
  const safeUrl = escapeHtml(trackedProductUrl);
  const safePixelUrl = escapeHtml(pixelUrl.toString());
  const normalizedSubject = normalizeOutreachSubject(subject);
  const normalizedBody = normalizeOutreachBody(bodyText);
  const safePreheader = escapeHtml(OUTREACH_PREHEADER);
  const paragraphs = normalizedBody.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  const textParts = paragraphs.length ? paragraphs.map(stripEmailMarkdown) : [stripEmailMarkdown(DEFAULT_OUTREACH_BODY)];
  textParts.push('See MoveScan in Action: ' + trackedProductUrl);
  const text = textWithTrackedLinks(textParts.join('\n\n'), trackedProductUrl);
  const htmlParts = [];
  paragraphs.forEach((paragraph) => {
    if (/^(\*\*See MoveScan in action:\*\*\s*)?https:\/\/aiguylabs\.com\/products\/movescan\/?$/i.test(paragraph.trim())) return;
    htmlParts.push(renderEmailParagraph(paragraph, safeUrl));
  });
  htmlParts.push('<p style="margin:28px 0 0;text-align:center;"><a href="' + safeUrl + '" style="display:inline-block;background:#1264d8;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;line-height:1.2;padding:14px 22px;border-radius:6px;">See MoveScan in Action</a></p>');
  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f4f7fb;color:#111827;font-family:Arial,sans-serif;">
    <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;color:transparent;">${safePreheader}</div>
    <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;color:transparent;">&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
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
  OUTREACH_PREHEADER,
  MOVESCAN_OUTREACH_CAMPAIGN,
  MOVESCAN_OUTREACH_PROSPECTS,
  MOVESCAN_RECIPIENT_COOKIE,
  TRACKING_COOKIE_MAX_AGE,
  cleanHeaderText,
  ensureCampaignRecipientsTable,
  ensureCampaignRecipientEngagementTables,
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
