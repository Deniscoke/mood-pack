// Ceny a limity. costCents sú ODHADY — over na fal.ai pred fixáciou.
// Slúži na interné počítanie nákladov na jeden render.

export type Quality = "preview" | "final";

export const PRICING: Record<Quality, { model: string; costCents: number }> = {
  // Lacný náhľad
  preview: { model: "fal-ai/flux-pro/kontext", costCents: 4 },
  // Platený finálny HD render
  final: { model: "fal-ai/flux-pro/kontext/max", costCents: 8 },
};

// Limit náhľadov na používateľa (zatiaľ konštanta; neskôr z databázy).
export const FREE_RENDER_LIMIT = 10;
