import { ensureDb, isEmail, json, readJson, safeString } from '../_lead-utils.js';

const CONTACT_FROM = 'website@aiguylabs.com';
const CONTACT_TO = 'contact@aiguylabs.com';
const CONTACT_SUBJECT = 'New AI Guy Labs Website Inquiry';
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const DUPLICATE_WINDOW_MS = 2 * 60 * 1000;

function cleanText(value, max = 4000) {
  return safeString(value, max).replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function cleanMessage(value, max = 6000) {
  return safeString(value, max).replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
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

function submittedAfter(millisecondsAgo) {
  return new Date(Date.now() - millisecondsAgo).toISOString();
}

function buildTextEmail(values) {
  const lines = [
    'New website inquiry',
    '',
    'Name:',
    values.name,
    '',
    'Email:',
    values.email,
  ];

  if (values.projectType) {
    lines.push('', 'Project type:', values.projectType);
  }

  if (values.company) {
    lines.push('', 'Company:', values.company);
  }

  if (values.budgetRange) {
    lines.push('', 'Estimated project budget:', values.budgetRange);
  }

  lines.push('', 'Message:', values.message, '', 'Submitted from:', 'aiguylabs.com');
  return lines.join('\n');
}

function buildHtmlEmail(values) {
  const rows = [
    ['Name', values.name],
    ['Email', values.email],
  ];

  if (values.projectType) rows.push(['Project type', values.projectType]);
  if (values.company) rows.push(['Company', values.company]);
  if (values.budgetRange) rows.push(['Estimated project budget', values.budgetRange]);

  const detailRows = rows.map(([label, value]) => `
    <tr>
      <th style="padding:8px 12px;text-align:left;vertical-align:top;background:#f4f7fb;border:1px solid #dbe3ef;font-family:Arial,sans-serif;font-size:14px;color:#111827;">${escapeHtml(label)}</th>
      <td style="padding:8px 12px;border:1px solid #dbe3ef;font-family:Arial,sans-serif;font-size:14px;color:#111827;">${escapeHtml(value)}</td>
    </tr>`).join('');

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f8fafc;color:#111827;font-family:Arial,sans-serif;">
    <main style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #dbe3ef;border-radius:8px;overflow:hidden;">
      <div style="padding:20px 24px;background:#05070b;color:#ffffff;">
        <h1 style="margin:0;font-size:22px;line-height:1.3;">New website inquiry</h1>
      </div>
      <div style="padding:24px;">
        <table role="presentation" style="width:100%;border-collapse:collapse;margin-bottom:22px;">${detailRows}</table>
        <h2 style="margin:0 0 8px;font-size:16px;line-height:1.35;color:#111827;">Message</h2>
        <div style="white-space:pre-wrap;padding:14px 16px;background:#f8fafc;border:1px solid #dbe3ef;border-radius:6px;font-size:15px;line-height:1.55;color:#111827;">${escapeHtml(values.message)}</div>
        <p style="margin:22px 0 0;color:#4b5563;font-size:13px;line-height:1.5;">Submitted from: aiguylabs.com</p>
      </div>
    </main>
  </body>
</html>`;
}

async function enforceRateLimit(db, { ipAddress, email }) {
  const since = submittedAfter(RATE_LIMIT_WINDOW_MS);
  const row = await db.prepare(`
    select count(*) as count
    from contact_requests
    where created_at >= ? and (ip_address = ? or lower(email) = lower(?))
  `).bind(since, ipAddress, email).first();

  return Number(row?.count || 0) < RATE_LIMIT_MAX;
}

async function isRecentDuplicate(db, { email, projectType, message }) {
  const since = submittedAfter(DUPLICATE_WINDOW_MS);
  const row = await db.prepare(`
    select id
    from contact_requests
    where created_at >= ? and lower(email) = lower(?) and project_type = ? and message = ?
    limit 1
  `).bind(since, email, projectType, message).first();

  return Boolean(row?.id);
}

async function sendContactEmail(env, values) {
  if (!env.EMAIL || typeof env.EMAIL.send !== 'function') {
    throw new Error('EMAIL binding is not configured.');
  }

  const result = await env.EMAIL.send({
    from: CONTACT_FROM,
    to: CONTACT_TO,
    replyTo: values.email,
    subject: CONTACT_SUBJECT,
    text: buildTextEmail(values),
    html: buildHtmlEmail(values),
  });

  return result?.messageId || '';
}

export async function onRequestPost({ request, env }) {
  const db = await ensureDb(env);
  const body = await readJson(request);
  if (!body) return json({ ok: false, error: 'Invalid request.' }, { status: 400 });

  if (safeString(body.website, 200)) {
    return json({ ok: true }, { status: 202 });
  }

  const name = cleanText(body.name, 160);
  const email = cleanText(body.email, 240).toLowerCase();
  const company = cleanText(body.company, 180);
  const projectType = cleanText(body.projectType || body.project_type, 240);
  const budgetRange = cleanText(body.budgetRange || body.budget_range, 120);
  const message = cleanMessage(body.message, 6000);

  const errors = {};
  if (!name) errors.name = 'Name is required.';
  if (!email || !isEmail(email)) errors.email = 'A valid email is required.';
  if (!projectType) errors.project_type = 'Project type is required.';
  if (!message || message.length < 10) errors.message = 'Message must include at least 10 characters.';
  if (Object.keys(errors).length) return json({ ok: false, errors }, { status: 400 });

  const ipAddress = cleanText(request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '', 120);
  const userAgent = safeString(request.headers.get('user-agent') || '', 600);

  const withinLimit = await enforceRateLimit(db, { ipAddress, email });
  if (!withinLimit) return json({ ok: false, error: 'Please wait before sending another message.' }, { status: 429 });

  const duplicate = await isRecentDuplicate(db, { email, projectType, message });
  if (duplicate) return json({ ok: false, error: 'This message was already received. Please wait before sending it again.' }, { status: 409 });

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  await db.prepare(`
    insert into contact_requests (
      id, created_at, name, email, company, project_type, budget_range, message, status, notes, ip_address, user_agent, metadata
    ) values (?, ?, ?, ?, ?, ?, ?, ?, 'New', '', ?, ?, ?)
  `).bind(id, createdAt, name, email, company, projectType, budgetRange, message, ipAddress, userAgent, JSON.stringify({ emailStatus: 'pending' })).run();

  try {
    const messageId = await sendContactEmail(env, { name, email, company, projectType, budgetRange, message });
    await db.prepare('update contact_requests set metadata = ? where id = ?')
      .bind(JSON.stringify({ emailStatus: 'sent', emailSentAt: new Date().toISOString(), messageId }), id)
      .run();
    console.log('Contact inquiry email sent', { id, to: CONTACT_TO, from: CONTACT_FROM, replyTo: email, messageId });
    return json({ ok: true, id, status: 'New' }, { status: 201 });
  } catch (error) {
    await db.prepare('update contact_requests set metadata = ? where id = ?')
      .bind(JSON.stringify({ emailStatus: 'failed', emailFailedAt: new Date().toISOString() }), id)
      .run();
    console.error('Contact inquiry email failed', { id, code: error?.code || 'UNKNOWN' });
    return json({ ok: false, error: 'Unable to send your message right now. Please try again shortly.' }, { status: 502 });
  }
}

export async function onRequestGet() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405, headers: { allow: 'POST' } });
}

export async function onRequestPut() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405, headers: { allow: 'POST' } });
}

export async function onRequestPatch() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405, headers: { allow: 'POST' } });
}

export async function onRequestDelete() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405, headers: { allow: 'POST' } });
}
