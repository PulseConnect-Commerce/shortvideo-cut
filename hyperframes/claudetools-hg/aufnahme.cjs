/* Nimmt die drei echten Seiten aus dem Briefing für K01 · Claude: 6 Werkzeuge auf (Playwright/Chromium, ohne Login,
   Handy-Ansicht 412 css-px, 2,62-fach = 1079 px breit). Cookie-Hinweis bestätigt, schwebende Elemente ausgeblendet,
   sonst nichts verändert außer der grünen Markierung (wie A06 Matrixify) der Stellen, die er im Video sagt.
   Ein Bild der ganzen Seite und die css-y der Anker und Markierungen in <name>.json.
     node aufnahme.cjs <ziel-ordner> <name> <url> [anker ...] [m:markierter Text ...] */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const [out, name, URL, ...REST] = process.argv.slice(2);
const ANKER = REST.filter((a) => !a.startsWith('m:'));
const MARKEN = REST.filter((a) => a.startsWith('m:')).map((a) => a.slice(2));
(async () => {
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const ctx = await browser.newContext({ viewport: { width: 412, height: 732 }, deviceScaleFactor: 2.62, locale: 'de-DE', ignoreHTTPSErrors: false });
  const page = await ctx.newPage();
  const r = await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);
  for (const t of ['Alle akzeptieren', 'Akzeptieren', 'Accept', 'Accept all', 'Accept All Cookies', 'Accept all cookies', 'Einverstanden', 'Alle Cookies akzeptieren']) {
    const b = page.getByRole('button', { name: t, exact: true });
    if (await b.count()) { try { await b.first().click({ timeout: 2000 }); break; } catch (e) {} }
  }
  await page.waitForTimeout(1500);
  // langsam scrollen, damit nachladende Bilder kommen
  const h0 = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h0; y += 600) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(250); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
  const daten = await page.evaluate(({ anker, marken }) => {
    for (const el of document.querySelectorAll('body *')) {
      const st = getComputedStyle(el);
      if ((st.position === 'fixed' || st.position === 'sticky') && el.getBoundingClientRect().top > 40) el.style.display = 'none';
    }
    document.body.style.overflow = 'visible';
    const pos = {};
    for (const m of marken) {
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      pos[m] = null;
      while (w.nextNode()) {
        const n = w.currentNode;
        const start = n.textContent.indexOf(m);
        if (start < 0) continue;
        const el = n.parentElement;
        if (!el || el.getBoundingClientRect().width === 0) continue;
        if (el.closest('header, nav, button')) continue;
        const rg = document.createRange(); rg.setStart(n, start); rg.setEnd(n, start + m.length);
        const mk = document.createElement('mark');
        mk.style.cssText = 'background:#7CF0C4;color:#0B0C0E;border-radius:4px;padding:0 2px;box-decoration-break:clone;-webkit-box-decoration-break:clone';
        rg.surroundContents(mk);
        const b = mk.getBoundingClientRect();
        pos[m] = [Math.round(b.top + scrollY), Math.round(b.height), Math.round(b.left), Math.round(b.width)];
        break;
      }
    }
    const ank = {};
    for (const a of anker) {
      for (const el of document.querySelectorAll('h1,h2,h3,h4,h5,p,span,div,li,a,button,dt,dd')) {
        if (el.children.length === 0 && el.textContent.trim().startsWith(a)) {
          const b = el.getBoundingClientRect();
          if (b.width > 0) { (ank[a] = ank[a] || []).push([Math.round(b.top + scrollY), Math.round(b.left), Math.round(b.width), Math.round(b.height)]); }
        }
      }
    }
    return { pos, ank, hoehe: document.body.scrollHeight };
  }, { anker: ANKER, marken: MARKEN });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
  const info = { datum: new Date().toISOString(), viewport: '412x732 @2.62', url: page.url(), status: r && r.status(), titel: await page.title(), ...daten };
  fs.writeFileSync(`${out}/${name}.json`, JSON.stringify(info, null, 1));
  console.log(JSON.stringify(info).slice(0, 1500));
  await browser.close();
})().catch((e) => { console.error('FEHLER', e.message); process.exit(1); });
