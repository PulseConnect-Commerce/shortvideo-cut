/* Liest den Text der Quellen aus dem Briefing für S06 · Rabattcodes richtig konfigurieren (Playwright/Chromium, ohne Login,
   Handy-Ansicht). Nur lesen.  node text.cjs <ziel-ordner> */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const ZIELE = {
  kombi: 'https://help.shopify.com/de/manual/discounts/discount-combinations',
  rabatte: 'https://help.shopify.com/de/manual/discounts',
};
(async () => {
  const [out, ...extra] = process.argv.slice(2);
  for (const e of extra) { const [n, u] = e.split('='); ZIELE[n] = u; }
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  for (const [name, url] of Object.entries(ZIELE)) {
    if (extra.length && !extra.some((e) => e.startsWith(name + '='))) continue;
    const ctx = await browser.newContext({ viewport: { width: 412, height: 732 }, deviceScaleFactor: 1, locale: 'de-DE' });
    const page = await ctx.newPage();
    const r = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    const txt = await page.evaluate(() => (document.querySelector('main') || document.body).innerText);
    const links = await page.evaluate(() => [...document.querySelectorAll('main a')].map((a) => a.textContent.trim() + ' | ' + a.href).join('\n'));
    fs.writeFileSync(`${out}/${name}.txt`, `${page.url()}\n${await page.title()}\nStatus ${r && r.status()}\n\n${txt}\n\nLINKS\n${links}`);
    console.log(name, r && r.status(), page.url(), await page.title(), txt.length);
    await ctx.close();
  }
  await browser.close();
})().catch((e) => { console.error('FEHLER', e.message); process.exit(1); });
