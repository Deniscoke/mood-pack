// Prompt engine — poskladá prompt pre image-to-image model (fal.ai Flux Kontext).
//
// Flux Kontext je EDITAČNÝ model a fotku VIDÍ. Model si typ miestnosti určí sám.
// KĽÚČOVÉ: mood pack používame len ako ŠTÝL (farby, materiály, svetlo, nálada),
// NIE ako zoznam nábytku — inak model pcháva gauč aj do kúpeľne. Aký nábytok
// patrí do izby, rozhoduje typ miestnosti, nie štýl.

import type { MoodPack } from "../types";

// Čo má model zachovať — "while keeping ... identical".
const PRESERVE_CLAUSE =
  "while keeping the room's walls, windows, doors, floor, ceiling, overall layout, " +
  "proportions, camera angle and perspective exactly as in the original photo. " +
  "Do not change, move, add or remove any architectural or structural element — " +
  "only add furniture and decor, change nothing else about the room.";

const REALISM =
  "Photorealistic real estate interior photo, realistic furniture scale, " +
  "natural lighting consistent with the existing windows. No people, no text, no watermark.";

// Aký nábytok patrí do akej izby + tvrdé zákazy pre kúpeľne/chodby/kuchyne.
const ROOM_RULES =
  "Identify the type of room in the photo and add only furniture and decor that " +
  "genuinely belong in that exact room. A bathroom or toilet keeps its fixtures and " +
  "gets only towels, plants and small accessories — never a sofa or living-room " +
  "furniture. A hallway or corridor gets only a slim console and a mirror — never a " +
  "sofa. A kitchen keeps its units and appliances and gets only small worktop styling. " +
  "Only living rooms, bedrooms and dining rooms get full furniture (a living room gets " +
  "seating and a coffee table, a bedroom gets a bed, a dining room gets a table and chairs).";

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

  // Mood pack ako ŠTÝL (žiadny konkrétny nábytok): nálada + materiály + svetlo.
  const style =
    `${input.moodPack.name} style — ${input.moodPack.atmosphere}; ` +
    `materials: ${input.moodPack.materials.join(", ")}; ` +
    `lighting: ${input.moodPack.lighting}`;

  const prompt =
    ROOM_RULES +
    " " +
    `Apply this visual style to materials, colours, lighting and mood only: ${style}. ` +
    preserve +
    REALISM +
    note;

  // Pozn.: negativePrompt sa do Flux Kontext NEposiela (model ho nemá ako vstup).
  const negativePrompt = [
    "sofa or living-room furniture in a bathroom, toilet, hallway or kitchen",
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
