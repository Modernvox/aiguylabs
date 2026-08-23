import { buildOutreachEmail } from './_campaign-outreach.js';

const OUTREACH_TEST_EMAIL = 'mike@aiguylabs.com';

function getOutreachPreviewUrls(request) {
  return {
    productUrl: new URL('/products/movescan', request.url),
    pixelUrl: new URL('/images/icon.png', request.url),
  };
}

function buildOutreachPreview(request, options = {}) {
  const { productUrl, pixelUrl } = getOutreachPreviewUrls(request);
  const email = buildOutreachEmail({
    productUrl,
    pixelUrl,
    subject: options.subject,
    bodyText: options.bodyText,
  });
  return {
    ...email,
    from: 'Mike from MoveScan <mike@aiguylabs.com>',
    replyTo: OUTREACH_TEST_EMAIL,
  };
}

export { OUTREACH_TEST_EMAIL, buildOutreachPreview, getOutreachPreviewUrls };