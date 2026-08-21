const MOVESCAN_TITLE = 'MoveScan | AI Guy Labs\u2122 Product';
const MOVESCAN_DESCRIPTION = 'MoveScan helps moving companies turn customer walkthroughs into instant estimates using inventory detection, cubic-foot estimation, truck and crew recommendations, packing workflows, and company-controlled pricing.';

function replaceFirst(source, pattern, replacement) {
  return source.replace(pattern, replacement);
}

function buildMoveScanFallback() {
  return `<main style="min-height:100vh;background:#000;color:#fff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        <section style="padding:48px 20px;max-width:960px;margin:0 auto;">
          <p style="margin:0 0 12px;color:#54a4ff;font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;">AI Guy Labs\u2122 Product</p>
          <h1 style="margin:0 0 14px;font-size:clamp(42px,8vw,86px);line-height:.95;letter-spacing:-.04em;">MoveScan</h1>
          <p style="margin:0 0 20px;color:#cdd8e8;font-size:clamp(18px,2.2vw,24px);line-height:1.45;">AI Instant Moving Estimates for Moving Companies</p>
          <p style="margin:0 0 28px;color:#cdd8e8;font-size:18px;line-height:1.6;max-width:780px;">Give customers an instant moving estimate from a guided walkthrough. MoveScan identifies inventory, estimates move size, recommends truck and crew needs, and applies company-controlled pricing.</p>
          <a href="https://www.movescan.app" style="display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 20px;border-radius:999px;background:#54a4ff;color:#02050a;font-weight:800;text-decoration:none;">Start Free Trial</a>
        </section>
      </main>`;
}

async function fetchIndexHtml(request, env) {
  const indexUrl = new URL('/index.html', request.url);
  const assetRequest = new Request(indexUrl.toString(), request);
  return env.ASSETS.fetch(assetRequest);
}

export async function onRequestGet({ request, env }) {
  const assetResponse = await fetchIndexHtml(request, env);
  let html = await assetResponse.text();
  const canonicalUrl = 'https://aiguylabs.com/products/movescan';

  html = replaceFirst(html, /<title>[\s\S]*?<\/title>/i, `<title>${MOVESCAN_TITLE}</title>`);
  html = replaceFirst(html, /<meta name="description" content="[^"]*">/i, `<meta name="description" content="${MOVESCAN_DESCRIPTION}">`);

  if (html.includes('<link rel="canonical"')) {
    html = replaceFirst(html, /<link rel="canonical" href="[^"]*">/i, `<link rel="canonical" href="${canonicalUrl}">`);
  } else {
    html = replaceFirst(html, '</title>', `</title>\n    <link rel="canonical" href="${canonicalUrl}">`);
  }

  html = replaceFirst(
    html,
    /<div id="root">[\s\S]*?<\/div>\s*(?=<script\b)/i,
    `<div id="root">\n      ${buildMoveScanFallback()}\n    </div>\n    `
  );

  const headers = new Headers(assetResponse.headers);
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.set('cache-control', 'public, max-age=0, must-revalidate');

  return new Response(html, {
    status: assetResponse.status,
    headers,
  });
}
