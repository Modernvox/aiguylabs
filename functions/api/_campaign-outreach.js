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
  await db.prepare(`create table if not exists campaign_recipients (id text primary key, tracking_token text not null unique, company_name text not null, recipient_email text not null, campaign text not null, status text not null default 'pending', created_at text not null, sent_at text)`).run();
  await db.prepare('create index if not exists campaign_recipients_campaign_idx on campaign_recipients(campaign)').run();
  await db.prepare('create index if not exists campaign_recipients_token_idx on campaign_recipients(tracking_token)').run();
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

function buildOutreachEmail({ productUrl, pixelUrl }) {
  const trackedProductUrl = productUrl.toString();
  const safeUrl = escapeHtml(trackedProductUrl);
  const movescanHomepageImageUrl = 'https://aiguylabs.com/images/products/movescan/movescan-homepage.png';
  const text = `Hi, I’m Mike. I’m an actual mover here in Nashville and an independent full-stack software developer. I operate AI Guy Labs, where I build software around real-world problems I encounter firsthand.

See MoveScan in Action -> ${trackedProductUrl}

A lot of moving companies are still asking customers for furniture lists, stairs, pickup and delivery details, truck information, and other move details just to figure out a price.

That process made sense years ago.

Today, customers are used to doing almost everything from their phones with a few swipes and taps. They don’t want to sit there typing out every couch, bed, dresser, TV, box, and table they own — and they definitely shouldn’t have to guess what size moving truck they need.

And when nearly every moving company uses the same slow quote process, customers start looking for easier alternatives — including third-party marketplaces that promise a faster, simpler way to book moving help, often at the moving company’s expense through fees, commissions, and tighter control over how the job is priced or handled.

MoveScan gives independent moving companies a way to offer that same kind of convenience directly, without sending the customer somewhere else first.

The customer opens your MoveScan estimate link on their phone and completes a short, guided room-by-room walkthrough. MoveScan identifies the inventory, calculates estimated cubic feet, determines truck and crew needs, accounts for the move details, applies your company’s own pricing and operating rules, and produces the customer’s instant estimate.

This isn’t just an AI inventory scanner that gives your staff a list to quote later. MoveScan is a complete end-to-end instant estimating system. The estimate is already built for you, leaving your staff primarily with a review-and-approve step.

A customer can walk through a full three-bedroom home and receive their instant moving estimate in under five minutes.

I’m looking for a small group of moving companies interested in getting involved early. I’ll personally set MoveScan up around your company’s operation and pricing at no cost, and your first 5 estimates are free.

There’s also a bigger goal behind this. As more moving companies begin using MoveScan, I want to build a network of MoveScan-enabled movers and dedicate a portion of subscription revenue toward advertising that network to consumers — creating new customer demand for the same movers using the technology.

I built MoveScan while actually working in the field as a mover, so it was designed around the problems we deal with on real jobs — not around what someone outside the industry thinks moving software should look like.

You don’t need to schedule a call or wait for me to send anything. You can see the customer experience for yourself here:

${trackedProductUrl}

Click See It in Action to watch the demo.

Best,
Michael Pierre
Nashville Mover / Independent Full-Stack Software Developer
MoveScan / AI Guy Labs
mike@aiguylabs.com`;
  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f4f7fb;color:#111827;font-family:Arial,sans-serif;">
    <main style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #dbe3ef;border-radius:8px;overflow:hidden;">
      <div style="padding:28px 30px;">
        <p style="margin:0 0 18px;font-size:16px;line-height:1.65;">Hi, I’m Mike. I’m an actual mover here in Nashville and an independent full-stack software developer. I operate AI Guy Labs, where I build software around real-world problems I encounter firsthand.</p>
        <p style="margin:24px 0;text-align:center;"><a href="${safeUrl}" style="display:block;text-decoration:none;"><img src="${movescanHomepageImageUrl}" alt="MoveScan homepage and instant moving estimate experience" width="560" style="display:block;width:100%;max-width:560px;height:auto;margin:0 auto;border:0;"></a></p>
        <p style="margin:0 0 24px;text-align:center;"><a href="${safeUrl}" style="display:inline-block;background:#1264d8;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;line-height:1.2;padding:14px 22px;border-radius:6px;">See MoveScan in Action &rarr;</a></p>
        <p style="margin:0 0 18px;font-size:16px;line-height:1.65;">A lot of moving companies are still asking customers for furniture lists, stairs, pickup and delivery details, truck information, and other move details just to figure out a price.</p>
        <p style="margin:0 0 18px;font-size:16px;line-height:1.65;">That process made sense years ago.</p>
        <p style="margin:0 0 18px;font-size:16px;line-height:1.65;">Today, customers are used to doing almost everything from their phones with a few swipes and taps. They don’t want to sit there typing out every couch, bed, dresser, TV, box, and table they own — and they definitely shouldn’t have to guess what size moving truck they need.</p>
        <p style="margin:0 0 18px;font-size:16px;line-height:1.65;">And when nearly every moving company uses the same slow quote process, customers start looking for easier alternatives — including third-party marketplaces that promise a faster, simpler way to book moving help, often at the moving company’s expense through fees, commissions, and tighter control over how the job is priced or handled.</p>
        <p style="margin:0 0 18px;font-size:16px;line-height:1.65;"><strong>MoveScan gives independent moving companies a way to offer that same kind of convenience directly, without sending the customer somewhere else first.</strong></p>
        <p style="margin:0 0 18px;font-size:16px;line-height:1.65;">The customer opens your MoveScan estimate link on their phone and completes a short, guided room-by-room walkthrough. MoveScan identifies the inventory, calculates estimated cubic feet, determines truck and crew needs, accounts for the move details, applies <strong>your company’s own pricing and operating rules</strong>, and produces the customer’s instant estimate.</p>

        <p style="margin:0 0 18px;font-size:16px;line-height:1.65;">This isn’t just an AI inventory scanner that gives your staff a list to quote later. <strong>MoveScan is a complete end-to-end instant estimating system.</strong> The estimate is already built for you, leaving your staff primarily with a review-and-approve step.</p>
        <p style="margin:0 0 18px;font-size:16px;line-height:1.65;">A customer can walk through a full three-bedroom home and receive their instant moving estimate in <strong>under five minutes.</strong></p>
        <p style="margin:0 0 18px;font-size:16px;line-height:1.65;">I’m looking for a small group of moving companies interested in getting involved early. <strong>I’ll personally set MoveScan up around your company’s operation and pricing at no cost, and your first 5 estimates are free.</strong></p>
        <p style="margin:0 0 18px;font-size:16px;line-height:1.65;">There’s also a bigger goal behind this. As more moving companies begin using MoveScan, I want to build a network of MoveScan-enabled movers and dedicate a portion of subscription revenue toward advertising that network to consumers — creating new customer demand for the same movers using the technology.</p>
        <p style="margin:0 0 18px;font-size:16px;line-height:1.65;">I built MoveScan while actually working in the field as a mover, so it was designed around the problems we deal with on real jobs — not around what someone outside the industry thinks moving software should look like.</p>
        <p style="margin:0 0 18px;font-size:16px;line-height:1.65;">You don’t need to schedule a call or wait for me to send anything. You can see the customer experience for yourself here:</p>
        <p style="margin:0 0 18px;font-size:16px;line-height:1.65;"><a href="${safeUrl}" style="color:#1264d8;">${trackedProductUrl}</a></p>
        <p style="margin:0 0 24px;font-size:16px;line-height:1.65;">Click <strong>See It in Action</strong> to watch the demo.</p>
        <p style="margin:0;font-size:16px;line-height:1.65;">Best,<br>Michael Pierre<br>Nashville Mover / Independent Full-Stack Software Developer<br>MoveScan / AI Guy Labs<br><a href="mailto:mike@aiguylabs.com" style="color:#1264d8;">mike@aiguylabs.com</a></p>
      </div>
    </main>
    <img src="${escapeHtml(pixelUrl.toString())}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0;opacity:0;">
  </body>
</html>`;
  return { text, html };
}

export {
  MOVESCAN_OUTREACH_CAMPAIGN,
  MOVESCAN_OUTREACH_PROSPECTS,
  MOVESCAN_RECIPIENT_COOKIE,
  TRACKING_COOKIE_MAX_AGE,
  cleanHeaderText,
  ensureCampaignRecipientsTable,
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
