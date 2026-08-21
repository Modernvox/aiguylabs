import { json, readJson } from '../../../_lead-utils.js';
import { isPrivateCampaignsAuthorized } from '../../../_private-campaigns.js';
import { buildOutreachPreview } from '../../../_campaign-outreach-preview.js';

function previewResponse(request, options = {}) {
  const email = buildOutreachPreview(request, options);
  return json({ ok: true, subject: email.subject, from: email.from, replyTo: email.replyTo, html: email.html, text: email.text }, { headers: { 'cache-control': 'no-store' } });
}

export async function onRequestGet({ request, env }) {
  if (!isPrivateCampaignsAuthorized(request, env)) {
    return json({ ok: false, error: 'Unauthorized.' }, { status: 401, headers: { 'cache-control': 'no-store' } });
  }

  return previewResponse(request);
}

export async function onRequestPost({ request, env }) {
  if (!isPrivateCampaignsAuthorized(request, env)) {
    return json({ ok: false, error: 'Unauthorized.' }, { status: 401, headers: { 'cache-control': 'no-store' } });
  }

  const body = await readJson(request);
  if (!body) return json({ ok: false, error: 'Invalid request.' }, { status: 400, headers: { 'cache-control': 'no-store' } });
  return previewResponse(request, { subject: body.subject, bodyText: body.bodyText || body.body });
}
