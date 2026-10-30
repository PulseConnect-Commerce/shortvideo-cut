/* Shopify-Logo aus dem Seitenkopf von shopify.com/de (das Element links oben, Link zur Startseite): Quelltext und Bild. */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const [out] = process.argv.slice(2);
(async () => {
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'de-DE', deviceScaleFactor: 4 });
  const page = await ctx.newPage();
  await page.goto('https://www.shopify.com/de', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  const d = await page.evaluate(() => {
    const el = document.elementFromPoint(150, 36);
    let a = el; while (a && a.tagName !== 'A') a = a.parentElement;
    const r = (a || el).getBoundingClientRect();
    return { tag: el.tagName, a: a ? a.href : null, aria: a ? a.ariaLabel : null, html: (a || el).outerHTML.slice(0, 20000), box: [r.x, r.y, r.width, r.height] };
  });
  console.log(d.tag, d.a, d.aria, d.box, d.html.length);
  fs.writeFileSync(`${out}/shopify-logo-element.html`, d.html);
  await page.screenshot({ path: `${out}/shopify-logo-hell.png`, clip: { x: d.box[0] - 4, y: d.box[1] - 4, width: d.box[2] + 8, height: d.box[3] + 8 } });
  await browser.close();
})().catch((e) => { console.error('FEHLER', e.message); process.exit(1); });
