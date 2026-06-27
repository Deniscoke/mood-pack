// Zariadenie cez OpenAI gpt-image-2 (alternatíva k fal Flux Kontext).
// gpt-image-2 = aktuálny najlepší model; nahranú fotku drží vo vysokej vernosti
// automaticky (gpt-image-1 sa navyše ruší 23.10.2026).
// OPENAI_API_KEY sa číta z prostredia (.env.local / Vercel) — nikdy nie v kóde.

import OpenAI, { toFile } from "openai";
import { imageProvider } from "./imageProvider";
import { OPENAI_PRICING } from "./cost";
import type { StageParams, StageResult } from "./imageProvider/types";

export async function stageWithOpenAI(params: StageParams): Promise<StageResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Chýba OPENAI_API_KEY.");
  const client = new OpenAI({ apiKey });

  // OpenAI edit potrebuje samotný obrázok (nie URL) — stiahneme ho z nahranej URL.
  const resp = await fetch(params.imageUrl);
  const buf = Buffer.from(await resp.arrayBuffer());
  const contentType = resp.headers.get("content-type") ?? "image/jpeg";
  const image = await toFile(buf, "room", { type: contentType });

  const cfg = OPENAI_PRICING[params.quality];
  const result = await client.images.edit({
    model: "gpt-image-2",
    image,
    prompt: params.prompt,
    size: "auto",
    quality: cfg.quality,
  });

  const b64 = result.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenAI nevrátil obrázok.");

  // Výsledok (base64) nahráme na fal storage, aby sme mali čistú URL na zobrazenie.
  const outUrl = await imageProvider.upload(
    new Blob([Buffer.from(b64, "base64")], { type: "image/png" }),
  );

  return { imageUrl: outUrl, seed: params.seed ?? 0, costCents: cfg.costCents };
}
