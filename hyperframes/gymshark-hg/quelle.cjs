/* Nimmt aus dem Shopify-Blog (Quelle im Briefing) den Kopf (Titel, Datum) und den Gymshark-Abschnitt auf, Handy-Ansicht
   432 css-px, 2,5-fach, ohne Login. Nur aufgenommen, nichts verändert. node quelle.cjs <ziel-ordner> */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const out = process.argv[2];
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const ctx = await browser.newContext({ viewport: { width: 432, height: 768 }, deviceScaleFactor: 2.5, isMobile: true, hasTouch: true, locale: 'de-DE' });
  const page = await ctx.newPage();
  await page.goto('https://www.shopify.com/de/blog/fitness-e-commerce-websites', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);
  for (const t of ['Alle akzeptieren', 'Akzeptieren', 'Accept', 'Accept all', 'Alle Cookies akzeptieren']) {
    const b = page.getByRole('button', { name: t });
    if (await b.count()) { try { await b.first().click({ timeout: 2000 }); break; } catch (e) {} }
  }
  await page.waitForTimeout(1000);
  const pos = await page.evaluate(() => {
    const find = (re, sel = 'h1,h2,h3,p,time,span,div') => { for (const el of document.querySelectorAll(sel)) { if (el.children.length < 4 && re.test(el.textContent) && el.getBoundingClientRect().height < 400) { const b = el.getBoundingClientRect(); return [Math.round(b.top + scrollY), Math.round(b.height)]; } } return null; };
    return { titel: find(/Fitness-E-Commerce-Websites/, 'h1'), datum: find(/1\. März 2026/, 'time,span,p,div'), gym: find(/Gymshark: von der URL zur Realität/, 'h2,h3'),
      popup: find(/Online-to-Offline/, 'p') };
  });
  console.log(JSON.stringify(pos));
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < Math.min(h, pos.popup[0] + 800); y += 600) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(300); }
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/shopify-kopf.png`, fullPage: true, clip: { x: 0, y: Math.max(0, pos.titel[0] - 20), width: 432, height: pos.titel[1] + 120 } });
  await page.screenshot({ path: `${out}/shopify-gymshark.png`, fullPage: true, clip: { x: 0, y: pos.gym[0] - 10, width: 432, height: (pos.popup[0] + pos.popup[1]) - pos.gym[0] + 20 } });
  await browser.close();
})().catch((e) => { console.error('FEHLER', e.message); process.exit(1); });
