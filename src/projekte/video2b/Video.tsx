/** Video 2 "Meine E-Commerce-Story", Fassung B (Hook B). Format FACE. Körper: ../video2/Basis.tsx */
import { createCut } from "../../lib/schnitt";
import { makeVideo } from "../video2/Basis";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "Video2B", durationInFrames: C.DURATION, fps: C.FPS };
export const Video = makeVideo(C, { line1: "10 JAHRE E-COMMERCE:", line2: "SHOP VERKAUFT. WARUM?" });
