// Prompt engine — poskladá prompt pre image-to-image model (fal.ai Flux Kontext).
//
// Typ miestnosti dostávame z automatickej detekcie (Moondream), takže model už
// NEhádže — povieme mu konkrétne "toto je kúpeľňa, zariaď ju ako kúpeľňu".
// Mood pack je len ŠTÝL (farby, materiály, svetlo), NIE zoznam nábytku.

import type { MoodPack, RoomType } from "../types";

const PRESERVE_CLAUSE =
  "while keeping the room's walls, windows, doors, floor, ceiling, overall layout, " +
  "proportions, camera angle and perspective exactly as in the original photo. " +
  "Do not change, move, add or remove any architectural or structural element — " +
  "only add furniture and decor, change nothing else about the room.";

const REALISM =
  "Photorealistic real estate interior photo, realistic furniture scale, " +
  "natural lighting consistent with the existing windows. No people, no text, no watermark.";

// Čo pridať podľa typu miestnosti (typ určila detekcia, nie užívateľ).
const ROOM_FURNISHING: Record<RoomType, string> = {
  living_room:
    "This is a living room. Add a sofa, coffee table, rug, a lamp and light decor.",
  bedroom:
    "This is a bedroom. Add a bed with bedding, bedside tables, a lamp and soft textiles.",
  kitchen:
    "This is a kitchen. Keep the existing cabinets and appliances; add only small worktop styling and decor — no sofa.",
  bathroom:
    "This is a bathroom. Keep the existing fixtures and sanitary ware; add only towels, plants and small accessories — never a sofa or living-room furniture.",
  dining_room:
    "This is a dining room. Add a dining table with chairs and a hanging light.",
  home_office:
    "This is a home office. Add a desk, a chair, shelving and light decor.",
  kids_room:
    "This is a child's room. Add tasteful, safe children's furniture and decor.",
  hallway:
    "This is an entrance hallway. Add only a slim console table and a mirror — no sofa.",
  other:
    "Add only furniture and decor that genuinely belong in this kind of room; do not add a sofa unless it is clearly a living room.",
};

export interface BuildPromptInput {
  moodPack: MoodPack;
  room: RoomType; // výsledok automatickej detekcie
  userNote?: string;
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
    ROOM_FURNISHING[input.room] +
    " " +
    `Apply this visual style to materials, colours, lighting and mood only: ${style}. ` +
    preserve +
    REALISM +
    note;

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
