// Spoločné typy projektu. Typ miestnosti sme zámerne odstránili — model si ho
// určí sám z nahranej fotky, užívateľ nič nevyberá.

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
