import { json, readJson, safeString } from '../_lead-utils.js';
import { recordCampaignEvent } from '../_campaign-events.js';

function cleanText(value, max = 240) {
  return safeString(value, max).replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  if (!body) return json({ ok: false, error: 'Invalid request.' }, { status: 400 });

  const companyName = cleanText(body.companyName, 180);
  const phone = cleanText(body.phone, 80);

  const errors = {};
  if (!companyName) errors.companyName = 'Company name is required.';
  if (!phone) errors.phone = 'Phone number is required.';
  if (Object.keys(errors).length) return json({ ok: false, errors, error: 'Please complete the required fields.' }, { status: 400 });

  await recordCampaignEvent(env, request, {
    eventName: 'movescan_free_onboarding_request',
    campaign: 'movescan_local_launch',
    sourcePath: '/products/movescan',
    destinationPath: '/products/movescan',
    source: 'movescan_product_page',
    medium: 'website_form',
    metadata: {
      companyName,
      phone,
    },
  });

  return json({ ok: true }, { status: 201 });
}

export async function onRequestGet() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405, headers: { allow: 'POST' } });
}
