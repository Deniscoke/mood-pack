// Automatické rozpoznanie typu miestnosti z fotky (Moondream vision cez providera).
// Užívateľ nič nevyberá. Keď detekcia zlyhá, vrátime "other" — render nezhodíme.

import { imageProvider } from "./imageProvider";
import type { RoomType } from "@/types";

const QUESTION =
  "What type of room is shown in this photo? Answer with just one of: " +
  "living room, bedroom, kitchen, bathroom, dining room, home office, kids room, hallway, other.";

export async function detectRoom(imageUrl: string): Promise<RoomType> {
  let text = "";
  try {
    text = (await imageProvider.describe(imageUrl, QUESTION)).toLowerCase();
  } catch {
    return "other"; // detekcia zlyhala — nech to nezhodí render
  }

  // Poradie je zámerné (napr. "bath" pred "bed", lebo "bedroom" obsahuje "bed").
  if (text.includes("bath") || text.includes("toilet") || text.includes("wc")) return "bathroom";
  if (text.includes("kitchen")) return "kitchen";
  if (text.includes("dining")) return "dining_room";
  if (text.includes("child") || text.includes("kid") || text.includes("nursery")) return "kids_room";
  if (text.includes("office") || text.includes("study")) return "home_office";
  if (text.includes("hall") || text.includes("corridor") || text.includes("entrance") || text.includes("entry")) return "hallway";
  if (text.includes("bed")) return "bedroom";
  if (text.includes("living") || text.includes("lounge")) return "living_room";
  return "other";
}
