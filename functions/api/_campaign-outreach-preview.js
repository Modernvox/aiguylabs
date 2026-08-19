import { buildOutreachEmail } from './_campaign-outreach.js';

const OUTREACH_TEST_EMAIL = 'mike@aiguylabs.com';

function getOutreachPreviewUrls(request) {
  return {
    productUrl: new URL('/products/movescan', request.url),
    pixelUrl: new URL('/images/icon.png', request.url),
  };
}

function buildOutreachPreview(request) {
  const { productUrl, pixelUrl } = getOutreachPreviewUrls(request);
  return {
    ...buildOutreachEmail({ productUrl, pixelUrl }),
    subject: 'Early MoveScan Network Opportunity',
    from: 'mike@aiguylabs.com',
    replyTo: OUTREACH_TEST_EMAIL,
  };
}

export { OUTREACH_TEST_EMAIL, buildOutreachPreview, getOutreachPreviewUrls };
