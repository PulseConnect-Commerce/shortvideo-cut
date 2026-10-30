/* Liest die Farbe, in der purelei.com das Logo im Seitenkopf zeichnet (currentColor), und den Hintergrund des Kopfs.
   node logofarbe.cjs */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const ctx = await browser.newContext({ viewport: { width: 412, height: 900 }, deviceScaleFactor: 2, locale: 'de-DE' });
  const page = await ctx.newPage();
  await page.goto('https://purelei.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  const d = await page.evaluate(() => [...document.querySelectorAll('svg')].filter((s) => (s.innerHTML || '').includes('logo')).map((s) => {
    const r = s.getBoundingClientRect(); let bg = 'transparent', e = s;
    while (e && (bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)')) { bg = getComputedStyle(e).backgroundColor; e = e.parentElement; }
    return { html: s.outerHTML.slice(0, 160), color: getComputedStyle(s).color, bg, x: r.x, y: r.y, w: r.width, h: r.height };
  }));
  console.log(JSON.stringify(d, null, 1));
  await browser.close();
})();
