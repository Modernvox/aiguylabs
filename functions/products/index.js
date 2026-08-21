const PRODUCTS_TITLE = 'Products | AI Guy Labs\u2122';
const PRODUCTS_DESCRIPTION = 'Explore AI Guy Labs\u2122 software products including MoveScan, Hotspot Studio, BatchFlow, SwiftSale, Sizzle, Pulsar, and SaaSquatch.';

function replaceFirst(source, pattern, replacement) {
  return source.replace(pattern, replacement);
}

function buildFallbackHeader() {
  return `<header style="position:sticky;top:0;z-index:10;background:rgba(0,0,0,.92);border-bottom:1px solid rgba(135,176,255,.16);color:#fff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        <div style="width:min(100% - 48px,1180px);min-height:76px;margin:0 auto;display:flex;align-items:center;gap:24px;">
          <a href="/" aria-label="AI Guy Labs home" style="display:inline-flex;align-items:center;flex:0 0 auto;"><img src="/images/aiguy_logo.PNG" alt="AI Guy Labs\u2122" style="display:block;height:46px;width:auto;max-width:220px;object-fit:contain;"></a>
          <nav aria-label="Primary navigation" style="display:flex;align-items:center;justify-content:center;gap:22px;flex:1;">
            <a href="/" style="color:#dce8ff;text-decoration:none;font-size:14px;font-weight:700;">Home</a>
            <a href="/products" style="color:#8ed7ff;text-decoration:none;font-size:14px;font-weight:900;">Products</a>
            <a href="/apparel" style="color:#dce8ff;text-decoration:none;font-size:14px;font-weight:700;">Apparel</a>
            <a href="/services" style="color:#dce8ff;text-decoration:none;font-size:14px;font-weight:700;">Services</a>
            <a href="/about" style="color:#dce8ff;text-decoration:none;font-size:14px;font-weight:700;">About Me</a>
            <a href="/contact" style="color:#dce8ff;text-decoration:none;font-size:14px;font-weight:700;">Contact</a>
          </nav>
          <a href="/contact" style="display:inline-flex;align-items:center;justify-content:center;min-height:38px;padding:0 16px;border-radius:999px;background:#54a4ff;color:#02050a;font-size:13px;font-weight:900;text-decoration:none;white-space:nowrap;">Work With Me</a>
        </div>
      </header>`;
}

function buildProductsFallback() {
  return `${buildFallbackHeader()}
      <main style="min-height:100vh;background:#000;color:#fff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        <section style="padding:56px 20px;max-width:1180px;margin:0 auto;">
          <p style="margin:0 0 12px;color:#54a4ff;font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;">Products Built By AI Guy Labs\u2122</p>
          <h1 style="margin:0 0 16px;font-size:clamp(42px,8vw,86px);line-height:.95;letter-spacing:-.04em;">Software designed to solve real problems.</h1>
          <p style="margin:0 0 34px;color:#cdd8e8;font-size:18px;line-height:1.6;max-width:820px;">Focused products for operators, teams, creators, and companies that need software with a clear purpose.</p>
          <nav aria-label="AI Guy Labs products" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;">
            <a href="/products/movescan" style="display:block;padding:18px;border:1px solid rgba(135,176,255,.18);border-radius:14px;color:#fff;text-decoration:none;background:rgba(5,9,17,.74);"><strong>MoveScan</strong><br><span style="color:#cdd8e8;">AI Instant Moving Estimates</span></a>
            <a href="/products/hotspot-studio" style="display:block;padding:18px;border:1px solid rgba(135,176,255,.18);border-radius:14px;color:#fff;text-decoration:none;background:rgba(5,9,17,.74);"><strong>Hotspot Studio</strong><br><span style="color:#cdd8e8;">Interactive image experiences</span></a>
            <a href="/products/batchflow" style="display:block;padding:18px;border:1px solid rgba(135,176,255,.18);border-radius:14px;color:#fff;text-decoration:none;background:rgba(5,9,17,.74);"><strong>BatchFlow</strong><br><span style="color:#cdd8e8;">Production workflow automation</span></a>
            <a href="/products/swiftsale" style="display:block;padding:18px;border:1px solid rgba(135,176,255,.18);border-radius:14px;color:#fff;text-decoration:none;background:rgba(5,9,17,.74);"><strong>SwiftSale</strong><br><span style="color:#cdd8e8;">Live selling workflow automation</span></a>
            <a href="/products/sizzle" style="display:block;padding:18px;border:1px solid rgba(135,176,255,.18);border-radius:14px;color:#fff;text-decoration:none;background:rgba(5,9,17,.74);"><strong>Sizzle</strong><br><span style="color:#cdd8e8;">Live cooking event platform</span></a>
            <a href="/products/pulsar" style="display:block;padding:18px;border:1px solid rgba(135,176,255,.18);border-radius:14px;color:#fff;text-decoration:none;background:rgba(5,9,17,.74);"><strong>Pulsar</strong><br><span style="color:#cdd8e8;">Live audience engagement</span></a>
            <a href="/products/saasquatch" style="display:block;padding:18px;border:1px solid rgba(135,176,255,.18);border-radius:14px;color:#fff;text-decoration:none;background:rgba(5,9,17,.74);"><strong>SaaSquatch</strong><br><span style="color:#cdd8e8;">SaaS operations platform</span></a>
          </nav>
        </section>
      </main>`;
}

async function fetchIndexHtml(request, env) {
  const indexUrl = new URL('/', request.url);
  return env.ASSETS.fetch(new Request(indexUrl.toString(), request));
}

export async function onRequestGet({ request, env }) {
  const assetResponse = await fetchIndexHtml(request, env);
  let html = await assetResponse.text();
  const canonicalUrl = 'https://aiguylabs.com/products';

  html = replaceFirst(html, /<title>[\s\S]*?<\/title>/i, `<title>${PRODUCTS_TITLE}</title>`);
  html = replaceFirst(html, /<meta name="description" content="[^"]*">/i, `<meta name="description" content="${PRODUCTS_DESCRIPTION}">`);

  if (html.includes('<link rel="canonical"')) {
    html = replaceFirst(html, /<link rel="canonical" href="[^"]*">/i, `<link rel="canonical" href="${canonicalUrl}">`);
  } else {
    html = replaceFirst(html, '</title>', `</title>\n    <link rel="canonical" href="${canonicalUrl}">`);
  }

  html = replaceFirst(
    html,
    /<div id="root">[\s\S]*?<\/div>\s*(?=<script\b)/i,
    `<div id="root">\n      ${buildProductsFallback()}\n    </div>\n    `
  );

  const headers = new Headers(assetResponse.headers);
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.set('cache-control', 'public, max-age=0, must-revalidate');
  headers.delete('location');

  return new Response(html, {
    status: 200,
    headers,
  });
}
