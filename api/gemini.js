import { GoogleGenAI } from "@google/genai";

// Models & sane defaults
const PRIMARY_MODEL  = process.env.GEMINI_PRIMARY_MODEL  || "gemini-1.5-pro";
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || "gemini-1.5-flash";
const MAX_TOKENS     = parseInt(process.env.GEMINI_MAX_TOKENS || "1024", 10);

async function generateWithRetry(client, prompt, model = PRIMARY_MODEL) {
  let delay = 500; // ms
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const result = await client.models.generateContent({
        model,
        contents: [{ role: "user", parts: [{ text: prompt }]}],
        generationConfig: { maxOutputTokens: MAX_TOKENS }
      });
      return result.response.text();
    } catch (err) {
      const status = err?.status || err?.response?.status;
      const msg = (err?.message || "").toUpperCase();
      const transient =
        status === 503 || status === 429 ||
        msg.includes("UNAVAILABLE") || msg.includes("OVERLOADED");
      if (transient && attempt < 4) {
        await new Promise(r => setTimeout(r, delay));
        delay *= 2;
        continue;
      }
      if (model === PRIMARY_MODEL) {
        model = FALLBACK_MODEL;   // one-shot fallback
        continue;
      }
      throw err;
    }
  }
  throw new Error("Gemini is busy—please try again shortly.");
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY not configured" });

    const client = new GoogleGenAI({ apiKey });
    const { action, prompt } = req.body || {};
    if (!action) return res.status(400).json({ error: "action is required" });

    if (action === "chat") {
      if (!prompt) return res.status(400).json({ error: "prompt is required" });
      const text = await generateWithRetry(client, prompt);
      return res.status(200).json({ text });
    }

    if (action === "resources") {
      if (!prompt) return res.status(400).json({ error: "prompt is required" });
      const q = `Return a compact JSON array of 4–6 learning resources for: "${prompt}".
Each item: { "text": "<1-sentence why it's useful>", "sources": [ { "uri": "<link>", "title": "<name>" } ] }`;
      const text = await generateWithRetry(client, q, FALLBACK_MODEL);
      return res.status(200).json({ text });
    }

    if (action === "image") return res.status(501).json({ error: "Image generation is not enabled" });
    if (action === "tts")   return res.status(501).json({ error: "Text-to-speech is not enabled" });

    return res.status(400).json({ error: "Unknown action" });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
