// Výber providera. V MVP jediný (fal.ai). Vymeniť = zmena tohto jedného riadku.
import { falProvider } from "./fal";
import type { ImageProvider } from "./types";

export const imageProvider: ImageProvider = falProvider;
