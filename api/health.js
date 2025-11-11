export default async function handler(req, res) {
  const ok = !!process.env.GEMINI_API_KEY;
  return res.status(200).json({ ok });
}
