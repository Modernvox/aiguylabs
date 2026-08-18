import { getAdminToken, json, readJson, safeString } from '../../../_lead-utils.js';
import { buildSessionCookie, clearSessionCookie, SESSION_MAX_AGE_SECONDS } from '../../../_private-campaigns.js';

export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  if (!body) return json({ ok: false, error: 'Invalid request.' }, { status: 400, headers: { 'cache-control': 'no-store' } });

  const password = safeString(body.password || body.token || '', 200);
  const expected = getAdminToken(env);
  if (!expected || password !== expected) {
    return json({ ok: false, error: 'Invalid private access password.' }, { status: 401, headers: { 'cache-control': 'no-store' } });
  }

  return json(
    { ok: true, expiresInSeconds: SESSION_MAX_AGE_SECONDS },
    {
      headers: {
        'cache-control': 'no-store',
        'set-cookie': buildSessionCookie(request, expected),
      },
    }
  );
}

export async function onRequestDelete({ request }) {
  return json(
    { ok: true },
    {
      headers: {
        'cache-control': 'no-store',
        'set-cookie': clearSessionCookie(request),
      },
    }
  );
}