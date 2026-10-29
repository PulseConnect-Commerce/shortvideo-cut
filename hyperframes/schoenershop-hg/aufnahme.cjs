/* Nimmt die offizielle Quelle aus dem Briefing für P06 · Schöner Shop, aber wenig Verkäufe auf (Playwright/Chromium, ohne
   Login, Handy-Ansicht 412 css-px, 2,62-fach = 1079 px breit): Shopify Help Center "Automatische Erstellung von Inhalten im
   Theme-Editor" (deutsche Fassung der englischen Seite aus dem Briefing). Cookie-Hinweis bestätigt, schwebende Elemente
   (z. B. "Frage nach diesem Artikel") ausgeblendet, die Sätze, über die er spricht, mit <mark> grün hinterlegt. Sonst nichts
   verändert. Ein Bild der ganzen Seite und die css-y der Markierungen in aufnahme.json.  node aufnahme.cjs <ziel-ordner> */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const ZIELE = {
  de: {
    url: 'https://help.shopify.com/de/manual/online-store/themes/customizing-themes/theme-editor/sidekick/generate-content',
    marken: [
      'z. B. Produktvorteile, die du nicht auflistest, oder Fakten über ähnliche Produkte.',
      'Produktgarantien wie „garantiert bis zu 1000 Wäschen“',
    ],
    anker: ['Automatische Erstellung von Inhalten im Theme-Editor'],
  },
  en: {
    url: 'https://help.shopify.com/en/manual/online-store/themes/customizing-themes/theme-editor/sidekick/generate-content',
    marken: ['such as product benefits you don\'t list or facts about similar products.', 'product guarantees such as "guaranteed up to 1000 washes"'],
    anker: ['Automatically generating content in the theme editor'],
  },
};
(async () => {
  const [out] = process.argv.slice(2);
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const info = {};
  const nur = process.argv.slice(3);
  for (const [name, z] of Object.entries(ZIELE)) {
    if (nur.length && !nur.includes(name)) continue;
    const ctx = await browser.newContext({ viewport: { width: 412, height: 1300 }, deviceScaleFactor: 2.62, locale: name === 'de' ? 'de-DE' : 'en-US', ignoreHTTPSErrors: false });
    const page = await ctx.newPage();
    const r = await page.goto(z.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3500);
    // Cloudflare "Verbindung wird verifiziert": wie ein normaler Browser warten, nichts umgehen (kein Captcha lösen)
    for (let i = 0; i < 12 && /verifiziert|Verifying|Just a moment|Nur einen Moment|einen Moment/i.test(await page.title()); i++) await page.waitForTimeout(2500);
    if (/verifiziert|Verifying|Just a moment|Nur einen Moment|einen Moment/i.test(await page.title())) { console.log(name, 'Prüfseite von Cloudflare, nicht umgangen, kein Bild'); await ctx.close(); continue; }
    for (const t of ['Akzeptieren', 'Alle akzeptieren', 'Accept', 'Accept all', 'OK']) {
      const b = page.getByRole('button', { name: t, exact: true });
      if (await b.count()) { try { await b.first().click({ timeout: 2000 }); break; } catch (e) {} }
    }
    await page.waitForTimeout(1200);
    const daten = await page.evaluate(({ marken, anker }) => {
      for (const el of document.querySelectorAll('body *')) {
        const st = getComputedStyle(el);
        if ((st.position === 'fixed' || st.position === 'sticky') && el.getBoundingClientRect().top > 40) el.style.display = 'none';
      }
      const pos = {};
      for (const m of marken) {
        const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let gefunden = false;
        while (w.nextNode()) {
          const n = w.currentNode; const roh = n.textContent; const txt = roh.replace(/\s+/g, ' ');
          const start = txt.indexOf(m);
          if (start < 0) continue;
          const rg = document.createRange(); rg.setStart(n, start); rg.setEnd(n, Math.min(roh.length, start + m.length));
          const mk = document.createElement('mark');
          mk.style.cssText = 'background:#7CF0C4;color:#0B0C0E;border-radius:4px;padding:0 2px;box-decoration-break:clone;-webkit-box-decoration-break:clone';
          rg.surroundContents(mk);
          const b = mk.getBoundingClientRect();
          pos[m] = [Math.round(b.top + scrollY), Math.round(b.height)]; gefunden = true; break;
        }
        if (!gefunden) pos[m] = null;
      }
      const ank = {};
      for (const a of anker) for (const el of document.querySelectorAll('h1,h2,h3')) if (el.textContent.trim().startsWith(a)) { const b = el.getBoundingClientRect(); ank[a] = Math.round(b.top + scrollY); break; }
      const box = [...document.querySelectorAll('div, aside, section')].find((el) => /^(Achtung|Caution)/.test(el.innerText.trim()) && el.innerText.length < 900);
      const bb = box ? box.getBoundingClientRect() : null;
      return { pos, ank, kasten: bb ? [Math.round(bb.top + scrollY), Math.round(bb.height)] : null, hoehe: document.body.scrollHeight };
    }, { marken: z.marken, anker: z.anker });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${out}/${name}-ganz.png`, fullPage: true });
    info[name] = { url: page.url(), status: r && r.status(), titel: await page.title(), ...daten };
    console.log(name, page.url(), r && r.status(), await page.title(), JSON.stringify(daten));
    await ctx.close();
  }
  const p = `${out}/aufnahme.json`; const alt = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p)) : { ziele: {} };
  alt.datum = new Date().toISOString(); alt.viewport = '412x1300 @2.62'; Object.assign(alt.ziele, info);
  fs.writeFileSync(p, JSON.stringify(alt, null, 1));
  await browser.close();
})().catch((e) => { console.error('FEHLER', e.message); process.exit(1); });
