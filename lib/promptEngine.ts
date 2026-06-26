// Prompt engine — deterministicky poskladá finálny prompt pre image-to-image model.
// Žiadne LLM volanie, žiadne náklady. Toto je jadro produktu.
//
// Poradie je zámerné: "zámok geometrie" je vždy prvý a vždy rovnaký (model váži
// skoršie inštrukcie viac), poznámka užívateľa ide až na koniec — môže doladiť
// štýl, ale nie prepísať ochranu stavby.

import type { MoodPack, RoomType } from "../types";

const GEOMETRY_LOCK = [
  "preserve the original room geometry exactly",
  "preserve camera angle and perspective",
  "preserve windows, doors, ceiling height and wall layout",
  "do not change, add or remove any structural elements",
  "keep existing floor, wall and window positions unchanged",
].join(", ");

const QUALITY_BASE = [
  "photorealistic real estate interior visualization",
  "add realistic, correctly scaled furniture and interior styling",
  "natural lighting consistent with the existing windows",
  "high-end but believable design",
].join(", ");

const NEGATIVE = [
  "people",
  "text",
  "watermark",
  "logo",
  "distorted or warped furniture",
  "impossible architecture",
  "extra windows or doors",
  "changed room shape",
  "floating objects",
  "blurry",
  "lowres",
].join(", ");

const ROOM_HINTS: Record<RoomType, string> = {
  living_room: "furnish as a living room (sofa, coffee table, rug, lighting)",
  bedroom: "furnish as a bedroom (bed, bedside tables, soft textiles)",
  kitchen: "style as a kitchen with realistic appliances and worktop decor",
  bathroom: "style as a bathroom with tasteful fixtures and accessories",
  dining_room: "furnish as a dining room (table, chairs, lighting)",
  home_office: "furnish as a home office (desk, chair, shelving)",
  kids_room: "furnish as a child's room, tasteful and safe",
  hallway: "style as an entrance hallway (console, mirror, lighting)",
  studio: "furnish as a compact studio apartment",
};

export interface BuildPromptInput {
  moodPack: MoodPack;
  roomType: RoomType;
  userNote?: string; // voľná poznámka užívateľa (napr. "viac zelene")
  preserveGeometry?: boolean; // default true
}

export interface BuiltPrompt {
  prompt: string;
  negativePrompt: string;
}

export function buildPrompt(input: BuildPromptInput): BuiltPrompt {
  const geom = input.preserveGeometry === false ? "" : GEOMETRY_LOCK + ", ";
  const note = input.userNote?.trim() ? `, ${input.userNote.trim()}` : "";

  const prompt =
    [
      geom + QUALITY_BASE,
      ROOM_HINTS[input.roomType],
      input.moodPack.promptFragment,
      `palette ${input.moodPack.colors.join(" ")}`,
      `materials: ${input.moodPack.materials.join(", ")}`,
      `avoid: ${input.moodPack.avoid.join(", ")}`,
    ].join(". ") +
    note +
    ".";

  return { prompt, negativePrompt: NEGATIVE };
}
