  import { GoogleGenerativeAI } from "@google/generative-ai";

  const PRIMARY_MODEL = process.env.GEMINI_PRIMARY_MODEL || "gemini-1.5-pro";
  const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || "gemini-1.5-flash";
  const MAX_TOKENS = parseInt(process.env.GEMINI_MAX_TOKENS || "2048", 10);

  async function generateWithRetry(genAI, prompt, model = PRIMARY_MODEL) {
    let delay = 500;
    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        const m = genAI.getGenerativeModel({ model });
        const result = await m.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: MAX_TOKENS },
        });
        return result.response.text();
      } catch (err) {
        const status = err?.status || err?.response?.status;
        const msg = (err?.message || "").toUpperCase();
        const transient = status === 503 || status === 429 || msg.includes("UNAVAILABLE") || msg.includes("OVERLOADED");
        if (transient && attempt < 4) {
          await new Promise((r) => setTimeout(r, delay));
          delay *= 2;
          continue;
        }
        if (model === PRIMARY_MODEL) {
          model = FALLBACK_MODEL;
          continue;
        }
        throw err;
      }
    }
    throw new Error("Gemini is busy—please try again shortly.");
  }

  export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY not configured" });

    const { action, prompt, aspectRatio } = req.body || {};
    if (!action) return res.status(400).json({ error: "action is required" });

    const genAI = new GoogleGenerativeAI(apiKey);
    try {
      if (action === "chat") {
        if (!prompt) return res.status(400).json({ error: "prompt is required" });
        const text = await generateWithRetry(genAI, prompt);
        return res.status(200).json({ text });
      }

      if (action === "resources") {
        if (!prompt) return res.status(400).json({ error: "prompt is required" });
        const query = `Give 5 specific, high-quality tutorials/articles/videos for: "${prompt}".
Return JSON with fields: text (one-line reason why it is useful) and sources (array of {uri,title}).`;
        const text = await generateWithRetry(genAI, query, FALLBACK_MODEL);
        return res.status(200).json({ text });
      }

      if (action === "image") {
        if (!prompt) return res.status(400).json({ error: "prompt is required" });
        // Basic image generation via text-only prompt; many Gemini tiers return base64 image as inlineData.
        const model = genAI.getGenerativeModel({ model: "imagen-3.0-generate-002" });
        const result = await model.generateContent([
          { text: prompt },
        ]);
        const part = result.response?.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.mimeType?.startsWith("image/"));
        if (!part?.inlineData?.data) return res.status(500).json({ error: "No image returned" });
        return res.status(200).json({ b64: part.inlineData.data, mime: part.inlineData.mimeType || "image/png" });
      }

      if (action === "tts") {
        // Not all tiers support TTS; stub friendly message to avoid hard errors.
        return res.status(501).json({ error: "Text-to-speech not enabled on this deployment." });
      }

      return res.status(400).json({ error: "Unknown action" });
    } catch (err) {
      return res.status(500).json({ error: err?.message || "AI request failed" });
    }
  }
