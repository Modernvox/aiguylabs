import {
  onRequestDelete,
  onRequestGet,
  onRequestPatch,
  onRequestPost,
  onRequestPut,
} from '../functions/api/contact-requests/index.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/contact-requests') {
      return new Response('Not found', { status: 404 });
    }

    const context = { request, env, ctx, params: {} };
    if (request.method === 'POST') return onRequestPost(context);
    if (request.method === 'GET') return onRequestGet(context);
    if (request.method === 'PUT') return onRequestPut(context);
    if (request.method === 'PATCH') return onRequestPatch(context);
    if (request.method === 'DELETE') return onRequestDelete(context);

    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed.' }), {
      status: 405,
      headers: { 'content-type': 'application/json; charset=utf-8', allow: 'POST' },
    });
  },
};
