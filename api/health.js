export default async function handler(_req, res) {
  // Simple probe so the UI (and you) can see if the function can read the key
  const ok = !!process.env.GEMINI_API_KEY;
  res.status(200).json({ ok });
}
