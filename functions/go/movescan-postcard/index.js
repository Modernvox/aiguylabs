import { buildRedirectUrl, recordCampaignEvent } from '../../api/_campaign-events.js';

function buildNoCacheHeaders() {
  return {
    'cache-control': 'no-store, no-cache, must-revalidate, max-age=0',
    pragma: 'no-cache',
    expires: '0',
  };
}

export async function onRequest({ request, env }) {
  const destination = buildRedirectUrl(request.url);

  try {
    const result = await recordCampaignEvent(env, request, {
      eventName: 'postcard_scan',
      campaign: 'movescan_local_launch',
      sourcePath: '/go/movescan-postcard',
      destinationPath: destination.pathname + destination.search,
      utmSource: 'postcard',
      utmMedium: 'direct_mail',
      utmCampaign: 'movescan_local_launch',
      metadata: {
        destination: destination.toString(),
      },
    });
    console.info('postcard_scan recorded', { id: result.id, destination: destination.pathname + destination.search });
  } catch (error) {
    console.error('Unable to record postcard scan event', {
      code: error?.code || 'UNKNOWN',
      message: error?.message || 'unknown',
    });
  }

  return Response.redirect(destination.toString(), 302, buildNoCacheHeaders());
}
