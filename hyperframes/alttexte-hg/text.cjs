/* Liest den Text der Quellen aus dem Briefing für S05 · Produktbilder und Alt-Texte mit KI (Playwright/Chromium, ohne Login,
   Handy-Ansicht). Nur lesen.  node text.cjs <ziel-ordner> */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const ZIELE = {
  mediagen: 'https://help.shopify.com/de/manual/ai-powered-tools/media-generation',
  editor: 'https://help.shopify.com/de/manual/shopify-admin/productivity-tools/media-editor',
  alttext: 'https://help.shopify.com/de/manual/products/product-media/add-alt-text',
  barriere: 'https://help.shopify.com/de/manual/online-store/themes/customizing-themes/accessibility',
};
(async () => {
  const [out] = process.argv.slice(2);
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  for (const [name, url] of Object.entries(ZIELE)) {
    const ctx = await browser.newContext({ viewport: { width: 412, height: 732 }, deviceScaleFactor: 1, locale: 'de-DE' });
    const page = await ctx.newPage();
    const r = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    const txt = await page.evaluate(() => (document.querySelector('main') || document.body).innerText);
    fs.writeFileSync(`${out}/${name}.txt`, `${page.url()}\n${await page.title()}\nStatus ${r && r.status()}\n\n${txt}`);
    console.log(name, r && r.status(), page.url(), await page.title(), txt.length);
    await ctx.close();
  }
  await browser.close();
})().catch((e) => { console.error('FEHLER', e.message); process.exit(1); });
