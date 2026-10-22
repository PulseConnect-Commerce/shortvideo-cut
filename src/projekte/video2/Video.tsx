/** Video 2 "Meine E-Commerce-Story", Fassung A (Hook A). Format FACE. Körper: ../video2/Basis.tsx */
import { createCut } from "../../lib/schnitt";
import { makeVideo } from "../video2/Basis";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "Video2A", durationInFrames: C.DURATION, fps: C.FPS };
export const Video = makeVideo(C, { line1: "ANFANG 2026:", line2: "UNTERNEHMEN VERKAUFT" });
