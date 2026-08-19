import { recordRecipientEvent } from '../../_campaign-outreach.js';

const PIXEL = Uint8Array.from([
  71, 73, 70, 56, 57, 97, 1, 0, 1, 0, 128, 0, 0, 0, 0, 0, 255, 255, 255,
  33, 249, 4, 1, 0, 0, 0, 0, 44, 0, 0, 0, 1, 0, 1, 0, 0, 2, 2, 68, 1, 0, 59,
]);

export async function onRequestGet({ request, env, params }) {
  try {
    await recordRecipientEvent(env, request, {
      token: params?.token || '',
      eventName: 'email_open',
      sourcePath: '/api/campaign/open/' + (params?.token || ''),
      destinationPath: '/products/movescan',
      metadata: { approximate: true, source: 'email-pixel' },
    });
  } catch (error) {
    console.error('Unable to record MoveScan email open', { code: error?.code || 'UNKNOWN' });
  }

  return new Response(PIXEL, {
    headers: {
      'content-type': 'image/gif',
      'cache-control': 'no-store, no-cache, must-revalidate, max-age=0',
      pragma: 'no-cache',
      expires: '0',
    },
  });
}

export async function onRequestPost(context) {
  return onRequestGet(context);
}
