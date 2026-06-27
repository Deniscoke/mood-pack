import { NextResponse } from "next/server";
import { imageProvider } from "@/lib/imageProvider";
import { buildPrompt } from "@/lib/promptEngine";
import { getMoodPack } from "@/lib/moodPacks";
import { detectRoom } from "@/lib/roomDetect";
import { DETECT_COST_CENTS } from "@/lib/cost";
import type { Quality } from "@/lib/cost";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("image");
    const moodPackId = String(form.get("moodPackId") ?? "");
    const note = String(form.get("note") ?? "");
    const quality = String(form.get("quality") ?? "preview") as Quality;

    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "Chýba obrázok." }, { status: 400 });
    }
    const moodPack = getMoodPack(moodPackId);
    if (!moodPack) {
      return NextResponse.json({ error: "Neznámy mood pack." }, { status: 400 });
    }

    const imageUrl = await imageProvider.upload(file);
    // 1) Najprv AI rozpozná typ miestnosti z fotky.
    const room = await detectRoom(imageUrl);
    // 2) Podľa toho poskladáme prompt a zariadime.
    const { prompt } = buildPrompt({ moodPack, room, userNote: note });
    const result = await imageProvider.stage({ imageUrl, prompt, quality });

    return NextResponse.json({
      inputUrl: imageUrl,
      outputUrl: result.imageUrl,
      seed: result.seed,
      room,
      costCents: result.costCents + DETECT_COST_CENTS,
    });
  } catch (err) {
    const e = err as { body?: { detail?: string }; message?: string };
    const text = e?.body?.detail ?? e?.message ?? "";
    console.error("Render error:", text || err);

    const friendly = /balance|locked|forbidden/i.test(text)
      ? "Účet fal.ai nemá kredit. Dobi ho na fal.ai/dashboard/billing a skús znova."
      : "Render zlyhal. Skús to znova o chvíľu.";
    return NextResponse.json({ error: friendly }, { status: 500 });
  }
}
