// Typovaný prístup k mood packom. JSON je jediný zdroj pravdy; tu ho len načítame
// a otypujeme, plus pridáme jednoduché pomocné funkcie.

import data from "./moodPacks.json";
import type { MoodPack } from "../types";

export const moodPacks: MoodPack[] = data as MoodPack[];

export function getMoodPack(id: string): MoodPack | undefined {
  return moodPacks.find((p) => p.id === id);
}

export function listMoodPackIds(): string[] {
  return moodPacks.map((p) => p.id);
}
