// Spoločné rozhranie pre AI image providera. Za týmto rozhraním je v MVP jediná
// implementácia (fal.ts). Vymeniť/pridať providera = jeden nový súbor.

import type { Quality } from "../cost";

export interface StageParams {
  imageUrl: string; // verejná URL nahraného obrázka
  prompt: string;
  seed?: number; // pre opakovateľnosť / konzistenciu
  quality: Quality;
}

export interface StageResult {
  imageUrl: string; // URL výsledného (zariadeného) obrázka
  seed: number;
  costCents: number;
}

export interface ImageProvider {
  upload(file: Blob): Promise<string>;
  stage(params: StageParams): Promise<StageResult>;
}
