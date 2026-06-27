// Prompt engine — poskladá prompt pre image-to-image model (fal.ai Flux Kontext).
//
// DÔLEŽITÉ (overené z návodu Black Forest Labs): Flux Kontext je EDITAČNÝ model
// a fotku VIDÍ. Preto mu NEvnucujeme typ miestnosti — necháme ho, nech si sám
// rozpozná, či je to kuchyňa/spálňa/kúpeľňa, a podľa toho ju zariadi.
// Prompt je krátka edit-inštrukcia: akcia + zachovanie geometrie + krátky štýl.

import type { MoodPack } from "../types";

// Čo má model zachovať — formulované ako "while keeping ... identical".
const PRESERVE_CLAUSE =
  "while keeping the room's walls, windows, doors, floor, ceiling, overall layout, " +
  "proportions, camera angle and perspective exactly as in the original photo. " +
  "Do not change, move, add or remove any architectural or structural element — " +
  "only add furniture and decor, change nothing else about the room.";

const REALISM =
  "Photorealistic real estate interior photo, realistic furniture scale, " +
  "natural lighting consistent with the existing windows. No people, no text, no watermark.";

export interface BuildPromptInput {
  moodPack: MoodPack;
  userNote?: string; // voľná poznámka užívateľa (napr. "viac zelene")
  preserveGeometry?: boolean; // default true
}

export interface BuiltPrompt {
  prompt: string;
  negativePrompt: string;
}

export function buildPrompt(input: BuildPromptInput): BuiltPrompt {
  const preserve =
    input.preserveGeometry === false ? "" : PRESERVE_CLAUSE + " ";
  const note = input.userNote?.trim() ? ` ${input.userNote.trim()}.` : "";

  // Akcia (model si typ izby určí sám z fotky) → štýl → zachovanie → realizmus.
  const prompt =
    "Furnish this empty room with realistic, well-proportioned furniture and decor " +
    "that match the type of room shown in the photo (a bedroom gets a bed, a kitchen " +
    "gets kitchen styling, a bathroom gets bathroom accessories, a living room gets a " +
    "sofa, and so on). " +
    `Style: ${input.moodPack.name} (${input.moodPack.promptFragment}). ` +
    preserve +
    REALISM +
    note;

  // Pozn.: negativePrompt sa do Flux Kontext NEposiela (model ho nemá ako vstup),
  // slúži len na dokumentáciu zámeru.
  const negativePrompt = [
    "changed room shape",
    "moved, extra or removed windows or doors",
    "distorted or warped furniture",
    "people",
    "text",
    "watermark",
    ...input.moodPack.avoid,
  ].join(", ");

  return { prompt, negativePrompt };
}
