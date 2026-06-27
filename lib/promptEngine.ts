// Prompt engine — poskladá prompt pre image-to-image model (fal.ai Flux Kontext).
//
// DÔLEŽITÉ (overené z návodu Black Forest Labs): Flux Kontext je EDITAČNÝ model.
// Pôvodnú fotku drží najlepšie, keď dostane KRÁTKU inštrukciu typu
// "pridaj X, zvyšok nechaj rovnaký" — NIE opis celej novej scény.
// Preto je prompt postavený ako edit-inštrukcia: akcia + dôrazné zachovanie
// geometrie + krátky štýl. Žiadne dlhé opisy scény, hex palety ani zoznamy.

import type { MoodPack, RoomType } from "../types";

// Čo má model zachovať. Formulované ako "while keeping ... identical" — presne
// tak, ako odporúča oficiálny návod, aby nemenil stavbu miestnosti.
const PRESERVE_CLAUSE =
  "while keeping the room's walls, windows, doors, floor, ceiling, overall layout, " +
  "proportions, camera angle and perspective exactly as in the original photo. " +
  "Do not change, move, add or remove any architectural or structural element — " +
  "only add furniture and decor, change nothing else about the room.";

const REALISM =
  "Photorealistic real estate interior photo, realistic furniture scale, " +
  "natural lighting consistent with the existing windows. No people, no text, no watermark.";

// Aký nábytok do akej miestnosti (a čo NEhýbať pri kuchyni/kúpeľni).
const ROOM_FURNISHING: Record<RoomType, string> = {
  living_room: "as a living room with a sofa, coffee table, rug, lamp and light decor",
  bedroom: "as a bedroom with a bed, bedside tables, soft textiles and a lamp",
  kitchen:
    "with tasteful kitchen styling and small worktop decor (keep the existing cabinets and appliances in place)",
  bathroom:
    "with tasteful bathroom accessories and decor (keep the existing fixtures and sanitary ware in place)",
  dining_room: "as a dining room with a dining table, chairs and a light fixture",
  home_office: "as a home office with a desk, chair, shelving and light decor",
  kids_room: "as a tasteful, safe child's room",
  hallway: "as an entrance hallway with a slim console, mirror and small decor",
  studio: "as a compact, well-organised studio apartment",
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
  const preserve =
    input.preserveGeometry === false ? "" : PRESERVE_CLAUSE + " ";
  const note = input.userNote?.trim() ? ` ${input.userNote.trim()}.` : "";

  // Akcia → štýl (krátko) → zachovanie geometrie → realizmus → poznámka.
  const prompt =
    `Furnish this empty room ${ROOM_FURNISHING[input.roomType]}, ` +
    `in a ${input.moodPack.name} style (${input.moodPack.promptFragment}), ` +
    preserve +
    REALISM +
    note;

  // Pozn.: negativePrompt sa do Flux Kontext NEposiela (model ho nemá ako vstup),
  // slúži len na prípadné zobrazenie / dokumentáciu zámeru.
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
