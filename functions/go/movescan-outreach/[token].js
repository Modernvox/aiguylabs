import { buildTrackedProductUrl, buildRecipientCookie, recordRecipientEvent } from '../../api/_campaign-outreach.js';

function noCacheHeaders() {
  return {
    'cache-control': 'no-store, no-cache, must-revalidate, max-age=0',
    pragma: 'no-cache',
    expires: '0',
  };
}

export async function onRequest({ request, env, params }) {
  const token = params?.token || '';
  const destination = buildTrackedProductUrl(request, token);

  try {
    const event = await recordRecipientEvent(env, request, {
      token,
      eventName: 'product_page_click',
      sourcePath: '/go/movescan-outreach/' + token,
      destinationPath: destination.pathname + destination.search,
      metadata: { destination: destination.toString() },
    });
    if (event) console.info('product_page_click recorded', { id: event.id });
  } catch (error) {
    console.error('Unable to record MoveScan product page click', { code: error?.code || 'UNKNOWN' });
  }

  const headers = new Headers({ location: destination.toString(), ...noCacheHeaders() });
  if (token) headers.append('set-cookie', buildRecipientCookie(request, token));
  return new Response(null, { status: 302, headers });
}
