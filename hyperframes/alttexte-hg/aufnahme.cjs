/* Nimmt die Quellen aus dem Briefing für S05 · Produktbilder und Alt-Texte mit KI auf (Playwright/Chromium, ohne Login,
   Handy-Ansicht 412 css-px, 2,62-fach = 1079 px breit). Cookie-Hinweis bestätigt, schwebende Knöpfe ("Frage stellen",
   Feedback) ausgeblendet; die Sätze, über die er spricht, mit <mark> grün hinterlegt (karten-aufbau.md "Quelle groß").
   Sonst nichts verändert. Je Seite ein Bild der ganzen Seite und die css-y der Markierungen und Überschriften in
   aufnahme.json.  node aufnahme.cjs <ziel-ordner> [mediagen|editor|alttext|barriere] */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const ZIELE = {
  mediagen: {
    url: 'https://help.shopify.com/de/manual/ai-powered-tools/media-generation',
    marken: [
      'Die Mediengenerierung mit Sidekick ist nur für Shops mit dem Basic-Abo, Grow-Abo, Advanced-Abo und Shopify Plus-Abo verfügbar.',
      'Farbhintergrund: Ersetze den Hintergrund eines Bildes durch eine einfarbige Fläche, mit automatischer Objekterkennung und bei Bedarf manueller Korrektur',
    ],
    anker: ['Mediengenerierung im Datei-Editor', 'Abo-Anforderung', 'Farbiger Hintergrund'],
  },
  editor: {
    url: 'https://help.shopify.com/de/manual/shopify-admin/productivity-tools/media-editor',
    marken: [
      'Der Medien-Editor schlägt möglicherweise Alt-Text für Bilder vor, die noch keinen haben.',
      'Diese Vorschläge werden mithilfe von KI generiert, um den Inhalt deines Bildes zu beschreiben.',
      'Du kannst den vorgeschlagenen Alt-Text annehmen, bearbeiten oder ersetzen.',
      'Wenn ein Alt-Text vorgeschlagen wird, überprüfe ihn und klicke auf Akzeptieren, um ihn zu verwenden, oder bearbeite ihn bei Bedarf.',
    ],
    anker: ['Den Medien-Editor verwenden', 'Alt-Text hinzufügen oder bearbeiten'],
  },
  alttext: {
    url: 'https://help.shopify.com/de/manual/products/product-media/add-alt-text',
    marken: [
      'Alt-Text (Alternativtext) beschreibt ein Medienelement',
      'Er wird auch von unterstützenden Technologien verwendet, um Kund:innen mit Sehbehinderung ein Bild zu beschreiben.',
    ],
    anker: ['Alt-Text zu Medien hinzufügen'],
  },
  barriere: {
    url: 'https://help.shopify.com/de/manual/online-store/themes/customizing-themes/accessibility',
    marken: [
      'Kund:innen, die Screenreader verwenden, sind auf Alt-Texte angewiesen, um den Inhalt von Bildern in deinem Onlineshop zu verstehen.',
    ],
    anker: ['Zugänglichkeit für Themes', 'Alternativtext für Bilder'],
  },
};
(async () => {
  const [out, ...nur] = process.argv.slice(2);
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const info = {};
  for (const [name, z] of Object.entries(ZIELE)) {
    if (nur.length && !nur.includes(name)) continue;
    const ctx = await browser.newContext({ viewport: { width: 412, height: 6400 }, deviceScaleFactor: 2.62, locale: 'de-DE' });
    const page = await ctx.newPage();
    const r = await page.goto(z.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3500);
    for (let k = 0; k < 20 && /verifiziert|Just a moment|Einen Moment/i.test(await page.title()); k++) await page.waitForTimeout(1500);
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
