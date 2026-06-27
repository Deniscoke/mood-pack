// Jediná implementácia providera (MVP): fal.ai.
// - upload: nahranie fotky na fal storage
// - describe: otázka k obrázku (Moondream vision) — na rozpoznanie typu miestnosti
// - stage: samotné zariadenie (Flux Kontext)
// FAL_KEY sa číta z prostredia (.env.local) — nikdy nie natvrdo v kóde.

import { fal } from "@fal-ai/client";
import { PRICING } from "../cost";
import type { ImageProvider, StageParams, StageResult } from "./types";

fal.config({ credentials: process.env.FAL_KEY });

export const falProvider: ImageProvider = {
  async upload(file: Blob): Promise<string> {
    return fal.storage.upload(file);
  },

  async describe(imageUrl: string, question: string): Promise<string> {
    const result = await fal.subscribe("fal-ai/moondream3-preview/query", {
      input: { image_url: imageUrl, prompt: question, reasoning: false },
    });
    return String((result.data as { output?: string }).output ?? "");
  },

  async stage(params: StageParams): Promise<StageResult> {
    const cfg = PRICING[params.quality];
    const result = await fal.subscribe(cfg.model, {
      input: {
        prompt: params.prompt,
        image_url: params.imageUrl,
        num_images: 1,
        output_format: "jpeg",
        guidance_scale: 3.5,
        safety_tolerance: "2",
        ...(params.seed != null ? { seed: params.seed } : {}),
      },
    });

    const data = result.data as { images: { url: string }[]; seed?: number };
    return {
      imageUrl: data.images[0].url,
      seed: data.seed ?? params.seed ?? 0,
      costCents: cfg.costCents,
    };
  },
};
