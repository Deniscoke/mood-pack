// Zoznam typov miestností s ľudskými názvami (SK). Zdroj pravdy pre dropdowny.
import type { RoomType } from "@/types";

export const ROOM_TYPES: { value: RoomType; label: string }[] = [
  { value: "living_room", label: "Obývačka" },
  { value: "bedroom", label: "Spálňa" },
  { value: "kitchen", label: "Kuchyňa" },
  { value: "dining_room", label: "Jedáleň" },
  { value: "home_office", label: "Pracovňa" },
  { value: "bathroom", label: "Kúpeľňa" },
  { value: "kids_room", label: "Detská izba" },
  { value: "hallway", label: "Predsieň" },
  { value: "studio", label: "Garsónka" },
];
