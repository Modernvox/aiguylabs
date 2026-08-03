import { ensureDb, isAuthorized, json, readJson, rowToLead, safeString, STATUSES } from '../../../_lead-utils.js';

async function getLead(db, id) {
  const row = await db.prepare(`
    select id, created_at, name, email, company, project_type, budget_range, message, status, notes, ip_address, user_agent
    from contact_requests
    where id = ?
  `).bind(id).first();
  return row ? rowToLead(row) : null;
}

export async function onRequestGet({ request, env, params }) {
  if (!isAuthorized(request, env)) return json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
  const db = await ensureDb(env);
  const lead = await getLead(db, params.id);
  if (!lead) return json({ ok: false, error: 'Lead not found.' }, { status: 404 });
  return json({ ok: true, lead });
}

export async function onRequestPatch({ request, env, params }) {
  if (!isAuthorized(request, env)) return json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
  const body = await readJson(request);
  if (!body) return json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 });

  const status = body.status == null ? null : safeString(body.status, 80);
  const notes = body.notes == null ? null : safeString(body.notes, 12000);
  if (status && !STATUSES.has(status)) return json({ ok: false, error: 'Invalid lead status.' }, { status: 400 });
  if (status == null && notes == null) return json({ ok: false, error: 'No supported fields provided.' }, { status: 400 });

  const db = await ensureDb(env);
  const existing = await getLead(db, params.id);
  if (!existing) return json({ ok: false, error: 'Lead not found.' }, { status: 404 });

  await db.prepare('update contact_requests set status = ?, notes = ? where id = ?')
    .bind(status || existing.status, notes == null ? existing.notes : notes, params.id)
    .run();

  const lead = await getLead(db, params.id);
  return json({ ok: true, lead });
}
