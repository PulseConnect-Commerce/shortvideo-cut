/* Erkundet purelei.com (Playwright/Chromium, ohne Login, Handy-Ansicht): Titel, Links der Navigation, sichtbare Überschriften.
   node probe.cjs <url> [<bild.png>] */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const [url, bild] = process.argv.slice(2);
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const ctx = await browser.newContext({ viewport: { width: 412, height: 900 }, deviceScaleFactor: 1, locale: 'de-DE' });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  const info = await page.evaluate(() => ({
    title: document.title,
    h: [...document.querySelectorAll('h1,h2,h3')].map(e => e.innerText.trim()).filter(Boolean).slice(0, 40),
    links: [...new Set([...document.querySelectorAll('a[href]')].map(a => a.href + ' | ' + a.innerText.trim().slice(0, 40)))].slice(0, 200),
    buttons: [...document.querySelectorAll('button')].map(b => b.innerText.trim()).filter(Boolean).slice(0, 30),
  }));
  console.log(JSON.stringify(info, null, 1));
  if (bild) await page.screenshot({ path: bild, fullPage: false });
  await browser.close();
})();
