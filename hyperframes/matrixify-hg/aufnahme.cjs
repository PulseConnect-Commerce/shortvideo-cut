/* Nimmt die Quelle aus dem Briefing für A06 · Matrixify auf: den Eintrag im Shopify App Store
   (https://apps.shopify.com/excel-export-import), Playwright/Chromium, ohne Login, Handy-Ansicht 412 css-px,
   2,62-fach = 1079 px breit. Cookie-Hinweis bestätigt, schwebende Elemente ausgeblendet. Markiert (grün hinterlegt, sonst
   nichts verändert):
     de: "Excel, CSV oder Google Sheets" in der Kurzbeschreibung, im Preisbereich "Kostenlos" und "10 Produkte, 10 Kategorien"
         des kostenlosen Plans "Demo" (Briefing: kostenlosen Tarif nur ohne unbelegte unbegrenzte Nutzung erwähnen)
     en: "Products, Collections", "Redirects", "Metafields" in "Export and import data for: …" (Originaltext des Entwicklers;
         die automatische deutsche Übersetzung macht aus "Collections" "Kategorien")
   Ein Bild der ganzen Seite und die css-y der Markierungen und Abschnitte in aufnahme-<sprache>.json.
     node aufnahme.cjs <ziel-ordner> de|en */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const [out, sprache = 'de'] = process.argv.slice(2);
const URL = 'https://apps.shopify.com/excel-export-import' + (sprache === 'de' ? '?locale=de' : '?locale=en');
// [text, exakt]: exakt = der ganze Textknoten (getrimmt) muss so lauten
const MARKEN = sprache === 'de'
  ? [['Excel, CSV oder Google Sheets', false], ['Kostenlos', true], ['10 Produkte, 10 Kategorien', false]]
  : [['Products, Collections', false], ['Redirects', false], ['Metafields', false]];
const ANKER = sprache === 'de'
  ? ['Matrixify: Data Export Import', 'Preisgestaltung', 'Demo', 'Basic', 'Rezensionen', 'Entwickler', 'Kompatibel mit']
  : ['Matrixify: Data Export Import', 'Pricing', 'Demo', 'Reviews', 'Developer', 'Works with'];
(async () => {
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const ctx = await browser.newContext({ viewport: { width: 412, height: 732 }, deviceScaleFactor: 2.62, locale: sprache === 'de' ? 'de-DE' : 'en-US' });
  const page = await ctx.newPage();
  const r = await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  for (const t of ['Alle akzeptieren', 'Akzeptieren', 'Accept', 'Accept all', 'Einverstanden']) {
    const b = page.getByRole('button', { name: t, exact: true });
    if (await b.count()) { try { await b.first().click({ timeout: 2000 }); break; } catch (e) {} }
  }
  await page.waitForTimeout(1500);
  const daten = await page.evaluate(({ marken, anker }) => {
    for (const el of document.querySelectorAll('body *')) {
      const st = getComputedStyle(el);
      if ((st.position === 'fixed' || st.position === 'sticky') && el.getBoundingClientRect().top > 40) el.style.display = 'none';
    }
    document.body.style.overflow = 'visible';
    const pos = {};
    for (const [m, exakt] of marken) {
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      pos[m] = null;
      while (w.nextNode()) {
        const n = w.currentNode;
        const roh = n.textContent;
        if (exakt && roh.trim() !== m) continue;
        const start = roh.indexOf(m);
        if (start < 0) continue;
        const el = n.parentElement;
        if (!el || el.getBoundingClientRect().width === 0) continue;
        if (el.closest('header, nav, a, button')) continue;
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
      for (const el of document.querySelectorAll('h1,h2,h3,h4,p,span,div,dt,dd')) {
        if (el.children.length === 0 && el.textContent.trim() === a) {
          const b = el.getBoundingClientRect();
          if (b.width > 0) { ank[a] = [Math.round(b.top + scrollY), Math.round(b.left)]; break; }
        }
      }
    }
    return { pos, ank, hoehe: document.body.scrollHeight };
  }, { marken: MARKEN, anker: ANKER });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/app-${sprache}.png`, fullPage: true });
  const info = { datum: new Date().toISOString(), viewport: '412x732 @2.62', url: page.url(), status: r && r.status(), titel: await page.title(), ...daten };
  fs.writeFileSync(`${out}/aufnahme-${sprache}.json`, JSON.stringify(info, null, 1));
  console.log(JSON.stringify(info));
  await browser.close();
})().catch((e) => { console.error('FEHLER', e.message); process.exit(1); });
