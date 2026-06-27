import { NextResponse } from "next/server";
import { imageProvider } from "@/lib/imageProvider";
import { stage } from "@/lib/stageEngine";
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
    const result = await stage({ imageUrl, prompt, quality });

    return NextResponse.json({
      inputUrl: imageUrl,
      outputUrl: result.imageUrl,
      seed: result.seed,
      room,
      costCents: result.costCents + DETECT_COST_CENTS,
    });
  } catch (err) {
    const e = err as { body?: { detail?: string }; message?: string };
    const text = (e?.body?.detail ?? e?.message ?? "").toString();
    console.error("Render error:", text || err);

    let friendly = "Render zlyhal. Skús to znova o chvíľu.";
    if (/balance|exhausted|locked/i.test(text)) {
      friendly = "Účet fal.ai nemá kredit. Dobi ho na fal.ai/dashboard/billing a skús znova.";
    } else if (/api[ _]?key|credential|incorrect api key|unauthor|401/i.test(text)) {
      friendly = "Chýba alebo je nesprávny OPENAI_API_KEY.";
    } else if (/quota|insufficient/i.test(text)) {
      friendly = "OpenAI účet nemá kredit (insufficient quota).";
    } else if (/verif/i.test(text)) {
      friendly =
        "OpenAI organizácia musí byť overená, aby si mohol použiť gpt-image-1 (platform.openai.com → Settings → Organization → Verify).";
    }
    return NextResponse.json({ error: friendly }, { status: 500 });
  }
}
