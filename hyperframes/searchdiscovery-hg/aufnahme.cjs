/* Nimmt die Quellen aus dem Briefing für S08 · Search & Discovery auf (Vorlage hyperframes/varianten-hg/aufnahme.cjs) (Playwright/Chromium, ohne Login,
   Handy-Ansicht 412 css-px, 2,62-fach = 1079 px breit). Cookie-Hinweis bestätigt, schwebende Knöpfe ("Frage stellen",
   Feedback) ausgeblendet; die Sätze, über die er spricht, mit <mark> grün hinterlegt (karten-aufbau.md "Quelle groß").
   Sonst nichts verändert. Je Seite ein Bild der ganzen Seite und die css-y der Markierungen und Überschriften in
   aufnahme.json.  node aufnahme.cjs <ziel-ordner> [storefront|filter|appstore] */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const ZIELE = {
  storefront: {
    url: 'https://help.shopify.com/de/manual/online-store/storefront-search/search-and-discovery',
    marken: [
      'Die Shopify Search & Discovery-App gibt dir mehr Kontrolle darüber, wie Kund:innen deine Produkte online entdecken.',
      'Erstelle benutzerdefinierte Filter, mit denen Kund:innen ihre Such- und Kollektionsseiten nach mehreren Kategorien anpassen können, um relevantere Ergebnisse anzuzeigen.',
      'Hebe bestimmte Produkte in den Suchergebnissen hervor.',
      'Empfiehl auf Produktseiten verwandte Produkte, um die automatisch generierten Empfehlungen zu ergänzen.',
    ],
    anker: ['Storefront-Suche', 'Shopify Search & Discovery-App', 'Hinweis'],
  },
  filter: {
    url: 'https://help.shopify.com/de/manual/online-store/storefront-search/search-and-discovery-filters',
    marken: [
      'Wenn dein Theme keine Filter unterstützt, kannst du zwar trotzdem Filter in der Shopify Search & Discovery App erstellen, sie werden deinen Kund:innen aber nicht angezeigt.',
      'Du kannst mehrere Filterwerte gruppieren, um sie der Kundschaft als einen einzigen Filterwert anzuzeigen.',
      'Angenommen, du hast ein Produkt mit der Option Farbe, die die Werte Onyx, Ebony und Midnight umfasst.',
      'Du kannst diese Werte unter einem einzigen Filter mit dem Namen Schwarz gruppieren.',
    ],
    anker: ['Filter mit Shopify Search & Discovery hinzufügen', 'Anforderungen', 'Filterwerte gruppieren'],
  },
  appstore: {
    url: 'https://apps.shopify.com/search-and-discovery?locale=de',
    marken: [],
    anker: ['Shopify Search & Discovery', 'Hilf Kunden bei ihrer Produktsuche'],
  },
};
(async () => {
  const [out, ...rest] = process.argv.slice(2);
  const AUS = rest.length && rest[rest.length - 1].startsWith('{') ? JSON.parse(rest.pop()) : {};
  const nur = rest;
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const info = {};
  for (const [name, z] of Object.entries(ZIELE)) {
    if (nur.length && !nur.includes(name)) continue;
    const ctx = await browser.newContext({ viewport: { width: 412, height: 6400 }, deviceScaleFactor: 2.62, locale: 'de-DE' });
    const page = await ctx.newPage();
    const r = await page.goto(z.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3500);
    for (let k = 0; k < 40 && /verifiziert|Just a moment|Einen Moment/i.test(await page.title()); k++) await page.waitForTimeout(1500);
    for (const t of ['Alle akzeptieren', 'Akzeptieren', 'Einverstanden', 'Alle Cookies akzeptieren', 'Accept', 'Accept all']) {
      const b = page.getByRole('button', { name: t });
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
      // Markierung auch über mehrere Textknoten (Links, fett): den Satz im Text des Absatzes suchen und jedes Stück einzeln markieren
      for (const m of marken) {
        let gefunden = false;
        for (const el of document.querySelectorAll('p, li, div')) {
          if (el.querySelector('p, li, div')) continue;
          const knoten = []; let text = '';
          const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          while (w.nextNode()) { knoten.push([w.currentNode, text.length]); text += w.currentNode.textContent; }
          const i = text.indexOf(m);
          if (i < 0) continue;
          const ende = i + m.length; let box = null;
          for (const [n, off] of knoten) {
            const a = Math.max(i, off), b = Math.min(ende, off + n.textContent.length);
            if (a >= b) continue;
            const rg = document.createRange(); rg.setStart(n, a - off); rg.setEnd(n, b - off);
            const mk = document.createElement('mark');
            mk.style.cssText = 'background:#7CF0C4;color:#0B0C0E;border-radius:4px;padding:0 2px;box-decoration-break:clone;-webkit-box-decoration-break:clone';
            rg.surroundContents(mk);
            const r = mk.getBoundingClientRect();
            box = box ? [Math.min(box[0], r.top), Math.max(box[1], r.bottom)] : [r.top, r.bottom];
          }
          pos[m] = [Math.round(box[0] + scrollY), Math.round(box[1] - box[0])]; gefunden = true; break;
        }
        if (!gefunden) pos[m] = null;
      }
      const ank = {};
      for (const a of anker) {
        for (const el of document.querySelectorAll('h1,h2,h3,h4,strong,p')) if (el.textContent.trim().startsWith(a)) { const b = el.getBoundingClientRect(); ank[a] = [Math.round(b.top + scrollY), Math.round(b.height)]; break; }
      }
      return { pos, ank, hoehe: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) };
    }, { marken: z.marken, anker: z.anker });
    await page.waitForTimeout(800);
    const h = Math.min(6400, daten.hoehe + 40);
    await page.setViewportSize({ width: 412, height: h });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${out}/${name}-ganz.png` });
    for (const [n, y0, y1] of (AUS[name] || [])) {
      if (typeof y0 === 'number') {
        await page.screenshot({ path: `${out}/${n}.png`, clip: { x: 0, y: y0, width: 412, height: y1 - y0 }, fullPage: true });
      } else {
        // tief unten (die Seite scrollt in einem inneren Bereich): den Absatz mit dieser Markierung ins Bild holen und
        // ihn mit y1 css-px Rand ausschneiden
        await page.setViewportSize({ width: 412, height: 1400 });
        await page.waitForTimeout(500);
        const box = await page.evaluate((t) => {
          const mk = [...document.querySelectorAll('mark')].find((m) => m.textContent.startsWith(t.slice(0, 30)));
          const p = mk.closest('p, li, div');
          p.scrollIntoView({ block: 'center' });
          const r = p.getBoundingClientRect();
          return [r.top, r.height];
        }, y0);
        await page.waitForTimeout(500);
        await page.screenshot({ path: `${out}/${n}.png`, clip: { x: 0, y: box[0] - y1, width: 412, height: box[1] + 2 * y1 } });
      }
      console.log('Ausschnitt', n, y0, y1);
    }
    info[name] = { url: page.url(), status: r && r.status(), titel: await page.title(), ...daten };
    console.log(name, page.url(), await page.title(), JSON.stringify(daten.pos), JSON.stringify(daten.ank));
    await ctx.close();
  }
  const p = `${out}/aufnahme.json`;
  const alt = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p)) : { ziele: {} };
  alt.datum = new Date().toISOString(); alt.viewport = '412x732 @2.62'; Object.assign(alt.ziele, info);
  fs.writeFileSync(p, JSON.stringify(alt, null, 1));
  await browser.close();
})().catch((e) => { console.error('FEHLER', e.message); process.exit(1); });
