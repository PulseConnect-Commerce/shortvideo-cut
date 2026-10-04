/**
 * Die Zeitachse eines Schnitts: aus der cut.json (tools/schnitt.py) werden Schnittstücke in Frames, die Wörter in
 * Ausgabe-Frames und die Helfer, mit denen jede Grafik auf ihr Wort gesetzt wird.
 *
 *   const C = createCut(cut);
 *   C.W("github")            erster Frame des Worts "github" (Suche über alle Wörter, normalisiert)
 *   C.W("schritt", C.W("github"))   das nächste "schritt" nach "github"
 *   C.WE("drive")            letzter Frame des Worts
 *   C.cue("github")          W - LEAD: hier erscheint die Grafik (2 Frames vor dem ersten Laut)
 *   C.spoken(text, after) + typedSync(parts, frame): Text, der Wort für Wort mit der Stimme getippt wird
 */
import { pictureSpans, type PictureSpan } from "./jcut";

/** vor/nach: freier Raumklang (s) vor dem Anfang und nach dem Ende, für die Überblendung (tools/schnitt.py) */
export type Keep = {
  src: string;
  from: number;
  to: number;
  jcut?: boolean;
  vor?: number;
  nach?: number;
  /** Quell-Sekunden, die leise statt geschnitten werden (ein "äh" in einem ganzen Satz) */
  stumm?: number[][];
};
export type CutJson = {
  projekt: string;
  fps: number;
  sprache?: string;
  keeps: Keep[];
  words: { text: string; src: string; start: number; end: number }[];
  pages: number[];
};
export type Word = { text: string; a: number; b: number };

/** jede Grafik landet LEAD Frames vor dem ersten Laut ihres Worts: so wirkt sie "auf dem Wort" */
export const LEAD = 2;

export const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");

export const createCut = (cut: CutJson, opts: { tail?: number; avoid?: number[] } = {}) => {
  const FPS = cut.fps;
  const f = (s: number) => Math.round(s * FPS);
  const KEEPS = cut.keeps.reduce<(Keep & { at: number; len: number })[]>((acc, k) => {
    const prev = acc[acc.length - 1];
    acc.push({ ...k, at: prev ? prev.at + prev.len : 0, len: f(k.to) - f(k.from) });
    return acc;
  }, []);
  const DURATION = KEEPS.reduce((s, k) => s + k.len, 0) + (opts.tail ?? 0);

  /** Ausgabe-Frame einer Quell-Sekunde eines Takes (null, wenn sie nicht im Schnitt ist) */
  const out = (src: string, t: number) => {
    const k = KEEPS.find((k) => k.src === src && t >= k.from - 0.03 && t <= k.to + 0.06);
    return k ? k.at + (t - k.from) * FPS : null;
  };
  const outEnd = (src: string, start: number, end: number) => {
    const k = KEEPS.find((k) => k.src === src && start >= k.from - 0.03 && start <= k.to + 0.06);
    return k ? k.at + (Math.min(end, k.to) - k.from) * FPS : null;
  };
  const all = cut.words.map((w) => ({
    text: w.text,
    a: out(w.src, w.start),
    b: outEnd(w.src, w.start, w.end),
  }));
  const WORDS = all.filter((w): w is Word => w.a !== null && w.b !== null && w.text !== "");

  const hit = (word: string, after: number) => {
    const n = norm(word);
    const h = WORDS.find((w) => norm(w.text).includes(n) && w.a >= after);
    if (!h) throw new Error(`Wort nicht im Schnitt: ${word} (nach Frame ${after})`);
    return h;
  };
  const W = (word: string, after = 0) => Math.round(hit(word, after).a);
  const WE = (word: string, after = 0) => Math.round(hit(word, after).b);
  const cue = (word: string, after = 0) => W(word, after) - LEAD;

  /** Text, der Wort für Wort mit der Stimme getippt wird: jedes Wort wird dem gesprochenen Wort zugeordnet (nach
   * Position im Transkript, nicht nach Zeit) und tippt über dessen Dauer; nicht gesprochene Wörter folgen direkt. */
  const spoken = (text: string, after: number) => {
    let i = WORDS.findIndex((w) => w.a >= after);
    let at = after;
    return text.split(" ").map((t) => {
      const k = WORDS.findIndex((w, j) => j >= i && j < i + 6 && norm(w.text) === norm(t));
      if (k >= 0) {
        i = k + 1;
        at = Math.max(at, WORDS[k].a);
        return { t, a: at - 1, b: Math.max(at + 2, WORDS[k].b - 1) };
      }
      return { t, a: at, b: at + 4 };
    });
  };

  /** Untertitel-Seiten aus der cut.json (in der Reihenfolge der Wörter) */
  const PAGES: Word[][] = [];
  let k = 0;
  for (const n of cut.pages) {
    const items = all.slice(k, k + n).filter((w): w is Word => w.a !== null && w.b !== null && w.text !== "");
    k += n;
    if (items.length) PAGES.push(items);
  }
  const LAST = WORDS.length ? Math.round(WORDS[WORDS.length - 1].b) : 0;
  const SPANS: PictureSpan[] = pictureSpans(KEEPS, cut.words, FPS, { avoid: opts.avoid });

  return { FPS, f, KEEPS, DURATION, WORDS, PAGES, LAST, SPANS, out, W, WE, cue, spoken };
};
export type Cut = ReturnType<typeof createCut>;

/** tippt die Teile aus spoken() im Takt der Stimme */
export const typedSync = (parts: { t: string; a: number; b: number }[], fr: number) =>
  parts
    .map(({ t, a, b }, i) => {
      const n = Math.round(Math.min(1, Math.max(0, (fr - a) / Math.max(1, b - a))) * t.length);
      return (i && fr >= a ? " " : "") + t.slice(0, n);
    })
    .join("");
