// Výber "motora" zariadenia. Default: OpenAI gpt-image-1.
// Prepnutie späť na fal.ai Flux Kontext: nastav env STAGE_ENGINE=fal.
// Vďaka tomu vieme oba modely porovnať alebo sa kedykoľvek vrátiť — bez zmeny kódu.

import { imageProvider } from "./imageProvider";
import { stageWithOpenAI } from "./openaiStage";
import type { StageParams, StageResult } from "./imageProvider/types";

export function stage(params: StageParams): Promise<StageResult> {
  const engine = (process.env.STAGE_ENGINE ?? "openai").toLowerCase();
  if (engine === "fal") return imageProvider.stage(params); // Flux Kontext
  return stageWithOpenAI(params); // gpt-image-1
}
