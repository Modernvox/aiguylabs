import { json, readJson, safeString } from '../_lead-utils.js';
import { recordCampaignEvent } from '../_campaign-events.js';

function cleanText(value, max = 240) {
  return safeString(value, max).replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildOnboardingWorkerUrl(request, env) {
  if (env.ONBOARDING_WORKER_URL) return env.ONBOARDING_WORKER_URL;
  if (env.OUTREACH_WORKER_URL) {
    const url = new URL(env.OUTREACH_WORKER_URL);
    url.pathname = '/api/free-onboarding/send';
    url.search = '';
    return url.toString();
  }
  return new URL('/api/free-onboarding/send', request.url).toString();
}

async function sendOnboardingEmail(request, env, values) {
  const internalToken = env.OUTREACH_INTERNAL_TOKEN || '';
  if (!internalToken) throw new Error('OUTREACH_INTERNAL_TOKEN is not configured.');

  const workerUrl = buildOnboardingWorkerUrl(request, env);
  const response = await fetch(workerUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-outreach-token': internalToken,
    },
    body: JSON.stringify(values),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.ok !== true) {
    throw new Error(typeof result.error === 'string' ? result.error : 'Email worker rejected the onboarding request.');
  }
  return result?.messageId || '';
}

async function recordOnboardingEvent(env, request, values, messageId) {
  try {
    await recordCampaignEvent(env, request, {
      eventName: 'movescan_free_onboarding_request',
      campaign: 'movescan_local_launch',
      sourcePath: '/products/movescan',
      destinationPath: '/products/movescan',
      utmSource: 'movescan_product_page',
      utmMedium: 'website_form',
      utmCampaign: 'movescan_local_launch',
      metadata: {
        companyName: values.companyName,
        phone: values.phone,
        messageId,
      },
    });
  } catch (error) {
    console.error('MoveScan onboarding request email sent but event recording failed', { code: error?.code || 'UNKNOWN' });
  }
}

export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  if (!body) return json({ ok: false, error: 'Invalid request.' }, { status: 400, headers: { 'cache-control': 'no-store' } });

  const companyName = cleanText(body.companyName, 180);
  const phone = cleanText(body.phone, 80);

  const errors = {};
  if (!companyName) errors.companyName = 'Company name is required.';
  if (!phone) errors.phone = 'Phone number is required.';
  if (Object.keys(errors).length) return json({ ok: false, errors, error: 'Please complete the required fields.' }, { status: 400, headers: { 'cache-control': 'no-store' } });

  const values = { companyName, phone, timestamp: new Date().toISOString() };

  try {
    const messageId = await sendOnboardingEmail(request, env, values);
    await recordOnboardingEvent(env, request, values, messageId);
    return json({ ok: true }, { status: 201, headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    const reason = typeof error?.message === 'string' ? error.message.slice(0, 180) : 'unknown';
    console.error('Unable to send MoveScan onboarding request email', { code: error?.code || 'UNKNOWN', reason });
    return json({ ok: false, error: 'We could not send your request. Please try again shortly.' }, { status: 502, headers: { 'cache-control': 'no-store' } });
  }
}

export async function onRequestGet() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405, headers: { allow: 'POST' } });
}
