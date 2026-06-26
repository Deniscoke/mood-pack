// Spoločné typy projektu. Zatiaľ len to, čo potrebuje jadro (mood packy + prompt
// engine). Typy pre DB/render pridáme, až keď budeme stavať API.

export type RoomType =
  | "living_room"
  | "bedroom"
  | "kitchen"
  | "bathroom"
  | "dining_room"
  | "home_office"
  | "kids_room"
  | "hallway"
  | "studio";

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
  promptFragment: string; // vkladá sa do image promptu (po anglicky)
}
