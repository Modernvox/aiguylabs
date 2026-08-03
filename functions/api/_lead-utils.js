const STATUSES = new Set(['New', 'Contacted', 'Discovery Scheduled', 'Proposal Sent', 'Won', 'Lost', 'Closed']);

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...(init.headers || {}),
    },
  });
}

function getDb(env) {
  return env.DB || env.AIGUY_DB || env.AI_GUY_DB;
}

function getAdminToken(env) {
  return env.ADMIN_LEADS_TOKEN || env.ADMIN_PASSWORD || env.AIGUY_ADMIN_TOKEN;
}

function isAuthorized(request, env) {
  const expected = getAdminToken(env);
  if (!expected) return false;
  const header = request.headers.get('authorization') || '';
  const bearer = header.match(/^Bearer\s+(.+)$/i)?.[1];
  return bearer === expected || request.headers.get('x-admin-token') === expected;
}

function safeString(value, max = 4000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function rowToLead(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    email: row.email,
    company: row.company || '',
    projectType: row.project_type,
    budgetRange: row.budget_range || '',
    message: row.message,
    status: row.status,
    notes: row.notes || '',
    ipAddress: row.ip_address || '',
    userAgent: row.user_agent || '',
  };
}

async function ensureDb(env) {
  const db = getDb(env);
  if (!db) throw new Error('D1 database binding DB is not configured.');
  return db;
}

export { STATUSES, json, getDb, getAdminToken, isAuthorized, safeString, isEmail, readJson, rowToLead, ensureDb };
