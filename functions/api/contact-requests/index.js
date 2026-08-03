import { ensureDb, isEmail, json, readJson, safeString } from '../_lead-utils.js';

export async function onRequestPost({ request, env }) {
  const db = await ensureDb(env);
  const body = await readJson(request);
  if (!body) return json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 });

  const name = safeString(body.name, 160);
  const email = safeString(body.email, 240).toLowerCase();
  const company = safeString(body.company, 180);
  const projectType = safeString(body.projectType || body.project_type, 240);
  const budgetRange = safeString(body.budgetRange || body.budget_range, 120);
  const message = safeString(body.message, 6000);

  const errors = {};
  if (!name) errors.name = 'Name is required.';
  if (!email || !isEmail(email)) errors.email = 'A valid email is required.';
  if (!projectType) errors.projectType = 'Project type is required.';
  if (!message || message.length < 10) errors.message = 'Message must include at least 10 characters.';
  if (Object.keys(errors).length) return json({ ok: false, errors }, { status: 400 });

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const ipAddress = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '';
  const userAgent = request.headers.get('user-agent') || '';

  await db.prepare(`
    insert into contact_requests (
      id, created_at, name, email, company, project_type, budget_range, message, status, notes, ip_address, user_agent
    ) values (?, ?, ?, ?, ?, ?, ?, ?, 'New', '', ?, ?)
  `).bind(id, createdAt, name, email, company, projectType, budgetRange, message, ipAddress, userAgent).run();

  return json({ ok: true, id, status: 'New' }, { status: 201 });
}
