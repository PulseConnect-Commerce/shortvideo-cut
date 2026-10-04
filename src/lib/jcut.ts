/**
 * J-Cuts: der nächste Satz ist 3 Frames (0,1 s) zu hören, bevor er zu sehen ist. Der Ton jedes Schnittstücks bleibt,
 * wo der Schnitt ihn hingelegt hat; nur das Bild verschiebt sich: wo ein Stück einen neuen Satz beginnt, läuft das
 * Bild des vorigen Stücks LEAD Frames weiter (der Take läuft einfach über das Stückende hinaus) und das Bild dieses
 * Stücks beginnt LEAD Frames später. Die Länge des Videos ändert sich nicht.
 *
 * Ein Stück beginnt einen Satz, wenn das letzte Wort davor auf . ? oder ! endet. `jcut: true/false` am Stück
 * (schnitt.json "jcut") überschreibt das. Nie beim ersten Stück, bei einem zu kurzen Stück, bei einem Schnitt
 * innerhalb derselben Stelle eines Takes (nichts Neues zu sehen) oder nahe an einem `avoid`-Frame (Zoom, Knall).
 */

export const J_LEAD = 3;

export type JKeep = {
  src: string;
  /** Quell-Sekunden */
  from: number;
  to: number;
  /** Ausgabe-Frame, an dem der Ton des Stücks beginnt, und seine Länge in Frames */
  at: number;
  len: number;
  blooper?: boolean;
  jcut?: boolean;
};
export type JWord = { text: string; src: string; start: number; end: number };
/** Was ein Bild-<Video> spielt: Start im Take (Frames), Ausgabe-Frame, Länge (Frames). */
export type PictureSpan = { src: string; trimBefore: number; at: number; len: number };

export const sentenceStarts = (keeps: JKeep[], words: JWord[]): boolean[] =>
  keeps.map((k, i) => {
    const prev = keeps[i - 1];
    if (!prev || k.blooper || prev.blooper) return false;
    if (k.jcut !== undefined) return k.jcut;
    const inPrev = words.filter(
      (w) =>
        w.src === prev.src && w.start >= prev.from - 0.05 && w.start < prev.to && w.text,
    );
    const last = inPrev[inPrev.length - 1];
    return !!last && /[.?!…]["“”»«']?$/.test(last.text.trim());
  });

export const pictureSpans = (
  keeps: JKeep[],
  words: JWord[],
  fps: number,
  opts: { lead?: number; avoid?: number[] } = {},
): PictureSpan[] => {
  const lead = opts.lead ?? J_LEAD;
  const avoid = opts.avoid ?? [];
  const starts = sentenceStarts(keeps, words);
  const spans = keeps.map((k) => ({
    src: k.src,
    trimBefore: Math.round(k.from * fps),
    at: k.at,
    len: k.len,
  }));
  keeps.forEach((k, i) => {
    if (!starts[i]) return;
    const prev = keeps[i - 1];
    const sameStretch = prev.src === k.src && (k.from - prev.to) * fps < 2 * lead;
    const nearAvoid = avoid.some((a) => a >= k.at - lead - 2 && a <= k.at + lead + 2);
    if (sameStretch || nearAvoid || k.len < 4 * lead) return;
    spans[i - 1].len += lead;
    spans[i].trimBefore += lead;
    spans[i].at += lead;
    spans[i].len -= lead;
  });
  return spans;
};
