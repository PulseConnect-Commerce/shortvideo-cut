/* Liest eine öffentliche Seite des Shopify Help Center (ohne Login): Text, Überschriften, Bilder, Logo im Kopf.
     node lesen.cjs <url> <ziel-ordner> <name> */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const [URL, out, name] = process.argv.slice(2);
(async () => {
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'de-DE' });
  const page = await ctx.newPage();
  const r = await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  for (const t of ['Alle akzeptieren', 'Akzeptieren', 'Accept', 'Accept all']) {
    const b = page.getByRole('button', { name: t });
    if (await b.count()) { try { await b.first().click({ timeout: 2000 }); break; } catch (e) {} }
  }
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(1500);
  const d = await page.evaluate(() => {
    const main = document.querySelector('main') || document.body;
    const text = main.innerText;
    const hs = [...document.querySelectorAll('h1,h2,h3')].map((h) => h.tagName + ': ' + h.textContent.trim().slice(0, 120));
    const imgs = [...document.querySelectorAll('img, video, picture source, object, iframe')].map((i) => ({ tag: i.tagName, src: (i.currentSrc || i.src || i.srcset || i.data || '').slice(0, 300), alt: (i.alt || i.title || '').slice(0, 160), w: i.naturalWidth || i.videoWidth || 0, h: i.naturalHeight || i.videoHeight || 0 }));
    const svgs = [...document.querySelectorAll('header svg, a[href="/"] svg, a[href*="shopify.com"] svg')].slice(0, 5).map((s) => ({ aria: s.getAttribute('aria-label') || (s.closest('a') || {}).ariaLabel || '', html: s.outerHTML.slice(0, 400), len: s.outerHTML.length }));
    const icons = [...document.querySelectorAll('link[rel*=icon]')].map((l) => l.href);
    const links = [...main.querySelectorAll('a')].map((a) => a.textContent.trim().slice(0, 60) + ' -> ' + a.href).filter((s) => s.includes('/manual/products'));
    return { titel: document.title, text, hs, imgs, svgs, icons, links };
  });
  fs.writeFileSync(`${out}/${name}.lesen.json`, JSON.stringify({ url: page.url(), status: r && r.status(), datum: new Date().toISOString(), ...d }, null, 1));
  console.log(page.url(), r && r.status(), d.titel);
  console.log(d.hs.join('\n'));
  console.log('BILDER', JSON.stringify(d.imgs, null, 0).slice(0, 4000));
  console.log('SVG', JSON.stringify(d.svgs, null, 0).slice(0, 1500), d.icons);
  await browser.close();
})().catch((e) => { console.error('FEHLER', e.message); process.exit(1); });
