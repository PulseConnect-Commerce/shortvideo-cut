/* Nimmt die Quellen für N08 · Etsy: Neue KI-Regeln auf (Playwright/Chromium, ohne Login, Handy-Ansicht 412 css-px,
   2,62-fach = 1079 px breit). Cookie-Hinweis bestätigt bzw. ausgeblendet, schwebende Elemente ausgeblendet; die Sätze, über
   die er spricht, mit <mark> grün hinterlegt (stil-news "Quelle"). Sonst nichts verändert.
   Je Variante ein Ausschnitt der Seite (nur die Markierungen dieser Variante) und die css-y in aufnahme.json.
     node aufnahme.cjs <ziel-ordner> [ohn] [hilfe-bilder] [hilfe-verkaufen]
   Vorbild: hyperframes/temuwarenkorb-hg/aufnahme.cjs (N07).
   Das Etsy Seller Handbook (https://www.etsy.com/seller-handbook/article/1522733284810, 22.10.2026) zeigt automatisierten
   Browsern "Der Zugriff ist vorübergehend eingeschränkt" (HTTP 403); das wird nicht umgangen. Stattdessen die offiziellen
   Etsy-Hilfeseiten (help.etsy.com), die dieselben Regeln enthalten. */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const ZIELE = {
  ohn: {
    url: 'https://ohn.haendlerbund.de/themen/marktplaetze/etsy-shop-druck-neue-ki-regeln',
    varianten: {
      // Kopf: Überschrift, Datum, erster Absatz mit "Wer auf Etsy verkauft, muss seine Listings prüfen – auch die bestehenden."
      kopf: { marken: ['Wer auf Etsy verkauft, muss seine Listings prüfen – auch die bestehenden.'], von: 'oben', vor: 0, nach: 1500 },
      seit: { marken: ['Seit dem 22. Oktober 2026 gelten neue Regeln für Produktfotos, KI-generierte Anleitungen und automatisch erstellte Angebote.'], vor: 380, nach: 520 },
      pflicht: { marken: ['Jedes Angebot braucht künftig mindestens ein Foto des echten Artikels vor einem echten Hintergrund.'], vor: 300, nach: 600 },
      bestehende: { marken: ['Die neuen Regeln gelten nicht nur für neue Angebote. Etsy stellt klar: Wer bestehende Listings hat, die die Anforderungen nicht erfüllen, muss sie anpassen.'], vor: 300, nach: 600 },
    },
    anker: ['Etsy-Shop unter Druck', 'Die wichtigsten Neuerungen im Überblick', 'Ausnahmen je nach Produktart', 'Gute Idee, aber viel Arbeit'],
  },
  'hilfe-bilder': {
    url: 'https://help.etsy.com/hc/de/articles/44297885802647',
    varianten: {
      foto: { marken: ['Etsy schreibt für die meisten Artikel mindestens ein unbearbeitetes Foto vor.'], von: 'oben', vor: 0, nach: 1400 },
      weitere: { marken: ['Für weitere Bilder kannst du Bildbearbeitungsprogramme nutzen, auch solche mit KI, solange deine Bilder auch genau das zeigen, was die Käufer:innen erhalten werden.'], von: 'oben', vor: 0, nach: 1400 },
      ausnahmen: { marken: ['Die Anforderungen können je nachdem, was du verkaufst, unterschiedlich sein:'], vor: 260, nach: 900 },
    },
    anker: ['Inwiefern gelten Etsys Voraussetzungen', 'Was gilt, wenn ich digitale Downloads'],
  },
  'hilfe-verkaufen': {
    url: 'https://help.etsy.com/hc/de/articles/360024112614',
    varianten: {
      anleitungen: { marken: ['KI-generierte Funktionsanleitungen, wie zum Beispiel Bastelvorlagen, Rezepte und Anleitungen'], vor: 420, nach: 560 },
      bots: { marken: ['Von Bots erstellte Inhalte'], vor: 420, nach: 560 },
      liste: { marken: [], um: 'Bestimmte Arten von KI-generierten Inhalten sind auf Etsy nicht erlaubt, darunter:', vor: 420, nach: 560 },
    },
    anker: ['Was kann ich auf Etsy verkaufen?', 'KI-generierte Inhalte'],
  },
};
(async () => {
  const [out, ...nur] = process.argv.slice(2);
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const info = {};
  for (const [name, z] of Object.entries(ZIELE)) {
    if (nur.length && !nur.includes(name)) continue;
    const ctx = await browser.newContext({ viewport: { width: 412, height: 732 }, deviceScaleFactor: 2.62, locale: 'de-DE' });
    const page = await ctx.newPage();
    const r = await page.goto(z.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3500);
    if (r && r.status() >= 400) { console.log(name, 'HTTP', r.status(), 'nicht aufgenommen'); await ctx.close(); continue; }
    for (const t of ['Alle akzeptieren', 'Einverstanden', 'Akzeptieren', 'Alle Cookies akzeptieren', 'Accept', 'Erlauben']) {
      const b = page.getByRole('button', { name: t, exact: true });
      if (await b.count()) { try { await b.first().click({ timeout: 2000 }); break; } catch (e) {} }
    }
    await page.waitForTimeout(1200);
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(1200);
    // schwebende Elemente (Cookie-Leiste, Chat, Werbung, Zurück-nach-oben) ausblenden
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('body *')) {
        const st = getComputedStyle(el);
        if (st.position === 'fixed' || (st.position === 'sticky' && el.getBoundingClientRect().top > 40)) el.style.display = 'none';
      }
      for (const el of document.querySelectorAll('[class*="cookie"], [id*="cookie"], [class*="consent"], [id*="consent"], .modal-backdrop, ins.adsbygoogle, [id^="google_ads"], iframe')) el.style.display = 'none';
      // Etsy-Hilfe: Cookie-Hinweis oben ("Durch Stöbern auf Etsy …")
      for (const el of document.querySelectorAll('body *')) {
        if (el.children.length < 4 && /^Durch Stöbern auf Etsy/.test((el.innerText || '').trim()) && (el.innerText || '').length < 200) el.style.display = 'none';
      }
      document.body.style.overflow = 'visible';
    });
    await page.waitForTimeout(600);
    info[name] = { url: page.url(), status: r && r.status(), titel: await page.title(), varianten: {} };
    for (const [vname, v] of Object.entries(z.varianten)) {
      const daten = await page.evaluate(({ marken, anker, um }) => {
        for (const mk of document.querySelectorAll('mark[data-fc]')) { const p = mk.parentNode; while (mk.firstChild) p.insertBefore(mk.firstChild, mk); p.removeChild(mk); p.normalize(); }
        const norm = (s) => s.replace(/\s+/g, ' ');
        function finde(m) {
          const bloecke = [...document.querySelectorAll('p, li, h1, h2, h3, td, figcaption, div, span')].filter((b) => norm(b.innerText || '').includes(m));
          if (!bloecke.length) return null;
          return bloecke.reduce((a, c) => ((c.innerText || '').length < (a.innerText || '').length ? c : a));
        }
        function markiere(m) {
          const b = finde(m); if (!b) return null;
          const knoten = []; const w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT);
          let voll = '';
          while (w.nextNode()) { const n = w.currentNode; knoten.push([n, voll.length]); voll += n.textContent; }
          let nz = ''; const map = [];
          for (let i = 0; i < voll.length; i++) { const c = voll[i]; if (/\s/.test(c)) { if (nz.endsWith(' ')) continue; nz += ' '; } else nz += c; map.push(i); }
          const a = nz.indexOf(m); if (a < 0) return null;
          const von = map[a], bis = map[a + m.length - 1] + 1;
          const mks = [];
          for (const [n, off] of knoten) {
            const s = Math.max(von, off), e = Math.min(bis, off + n.textContent.length);
            if (s >= e || !n.textContent.slice(s - off, e - off).trim()) continue;
            const rg = document.createRange(); rg.setStart(n, s - off); rg.setEnd(n, e - off);
            const mk = document.createElement('mark'); mk.dataset.fc = '1';
            mk.style.cssText = 'background:#7CF0C4;color:#0B0C0E;border-radius:4px;padding:0 2px;box-decoration-break:clone;-webkit-box-decoration-break:clone';
            try { rg.surroundContents(mk); mks.push(mk); } catch (e) {}
          }
          if (!mks.length) return null;
          const ys = mks.flatMap((mk) => [...mk.getClientRects()].map((r) => [r.top + scrollY, r.bottom + scrollY]));
          return [Math.round(Math.min(...ys.map((y) => y[0]))), Math.round(Math.max(...ys.map((y) => y[1])) - Math.min(...ys.map((y) => y[0])))];
        }
        const pos = {};
        for (const m of marken) pos[m] = markiere(m);
        if (um) { const b = finde(um); if (b) { const r = b.getBoundingClientRect(); pos[um] = [Math.round(r.top + scrollY), Math.round(r.height)]; } }
        const ank = {};
        for (const a of anker) for (const el of document.querySelectorAll('h1,h2,h3,h4,strong,p')) if ((el.textContent || '').trim().startsWith(a)) { const b = el.getBoundingClientRect(); ank[a] = Math.round(b.top + scrollY); break; }
        const bilder = [...document.querySelectorAll('img')].map((i) => { const b = i.getBoundingClientRect(); return [i.alt || i.src.slice(-60), Math.round(b.top + scrollY), Math.round(b.height), Math.round(b.width)]; }).filter((x) => x[2] > 80);
        return { pos, ank, bilder, hoehe: document.body.scrollHeight };
      }, { marken: v.marken, anker: z.anker, um: v.um });
      const ys = Object.values(daten.pos).filter(Boolean).map((p) => p[0]);
      const ref = v.von === 'oben' ? 0 : (ys.length ? Math.min(...ys) : 0);
      const top = Math.max(0, ref - (v.vor || 0));
      const hoehe = Math.min((v.vor || 0) + (v.nach || 900), daten.hoehe - top);
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${out}/${name}-${vname}.png`, fullPage: true, clip: { x: 0, y: top, width: 412, height: hoehe } });
      info[name].varianten[vname] = { clipTop: top, clipHoehe: hoehe, ...daten };
      console.log(name, vname, 'clip', top, hoehe, JSON.stringify(daten.pos), JSON.stringify(daten.ank));
    }
    await ctx.close();
  }
  const p = `${out}/aufnahme.json`;
  const alt = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p)) : { ziele: {} };
  alt.datum = new Date().toISOString(); alt.viewport = '412x732 @2.62'; Object.assign(alt.ziele, info);
  fs.writeFileSync(p, JSON.stringify(alt, null, 1));
  await browser.close();
})().catch((e) => { console.error('FEHLER', e.message); process.exit(1); });
