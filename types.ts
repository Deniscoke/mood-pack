// Spoločné typy projektu. Typ miestnosti užívateľ NEvyberá — určí ho automaticky
// AI z fotky (vision model). RoomType je teda interný výsledok detekcie.

export type RoomType =
  | "living_room"
  | "bedroom"
  | "kitchen"
  | "bathroom"
  | "dining_room"
  | "home_office"
  | "kids_room"
  | "hallway"
  | "other";

export interface MoodPack {
  id: string;
  name: string;
  description: string; // krátky popis pre UI
  atmosphere: string; // cieľová nálada
  colors: string[]; // paleta (hex)
  materials: string[];
  furniture: string[];
  lighting: string;
  avoid: string[]; // zakázané prvky
  promptFragment: string; // (po anglicky) – už sa do promptu nevkladá priamo
}
