// Ceny a limity. costCents sú ODHADY — over na fal.ai pred fixáciou.
// Slúži na interné počítanie nákladov na jeden render.

export type Quality = "preview" | "final";

export const PRICING: Record<Quality, { model: string; costCents: number }> = {
  // Lacný náhľad
  preview: { model: "fal-ai/flux-pro/kontext", costCents: 4 },
  // Platený finálny HD render
  final: { model: "fal-ai/flux-pro/kontext/max", costCents: 8 },
};

// Ceny pre OpenAI gpt-image-2 (ODHADY vrátane vstupnej fotky — sú vyššie než fal).
// quality riadi kvalitu aj cenu; vstupná fotka sa ráta vo vysokej vernosti.
export const OPENAI_PRICING: Record<
  Quality,
  { quality: "low" | "medium" | "high"; costCents: number }
> = {
  preview: { quality: "medium", costCents: 12 },
  final: { quality: "high", costCents: 28 },
};

// Približná cena rozpoznania typu miestnosti (Moondream vision) na jednu fotku.
export const DETECT_COST_CENTS = 1;

// Limit náhľadov na používateľa (zatiaľ konštanta; neskôr z databázy).
export const FREE_RENDER_LIMIT = 10;
