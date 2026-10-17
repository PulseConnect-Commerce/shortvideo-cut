/**
 * REWE × Lieferando, zweite Fassung im freigegebenen Look ab 2026-10-17 (Skizzen über dem Kopf, Untertitel darunter,
 * leichte Musik). A/B-Test gegen die erste Fassung (Komposition Rewe, 17.10. 18:00); diese hier läuft am 18.10. um 09:00.
 * Schnitt, Takes und Grafiken kommen aus ../rewe; die Props (voice, sfx, musik) gehen durch, damit checks --stems geht.
 */
import type React from "react";
import { meta as erste, Video as Rewe } from "../rewe/Video";

export const meta = { ...erste, id: "ReweV2" };

export const Video: React.FC<React.ComponentProps<typeof Rewe>> = ({ musik = "news.mp3", ...p }) => (
  <Rewe {...p} neu musik={musik} />
);
