import { ensureDb, isAuthorized, json, rowToLead } from '../../_lead-utils.js';

export async function onRequestGet({ request, env }) {
  if (!isAuthorized(request, env)) return json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
  const db = await ensureDb(env);
  const { results } = await db.prepare(`
    select id, created_at, name, email, company, project_type, budget_range, message, status, notes, ip_address, user_agent
    from contact_requests
    order by created_at desc
    limit 250
  `).all();

  return json({ ok: true, leads: results.map(rowToLead) });
}
