import { AspectRatio, Resource } from '../types';

async function post(path: string, body: any) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export async function getAiTutorResponse(prompt: string, thinkingEnabled = false): Promise<string> {
  const { text } = await post('/api/gemini', { action: 'chat', prompt });
  return text;
}

export async function fetchLearningResources(topic: string): Promise<Resource[]> {
  const { text } = await post('/api/gemini', { action: 'resources', prompt: topic });
  try {
    const parsed = JSON.parse(text);
    // Normalize to Resource[] shape
    return Array.isArray(parsed) ? parsed : (parsed.resources || []);
  } catch {
    // Fallback: wrap as a single resource
    return [{ text, sources: [] } as Resource];
  }
}

export async function generateImage(prompt: string, aspect: AspectRatio = '1:1'): Promise<string> {
  const { b64, mime } = await post('/api/gemini', { action: 'image', prompt, aspectRatio: aspect });
  return `data:${mime};base64,${b64}`;
}

export async function findLocalStudySpots(location: string): Promise<string> {
  // This app was using Gemini to invent sample spots; keep that behavior.
  const q = `List 3 quiet study spots near ${location}. Respond in plain text, 1 per line.`;
  const { text } = await post('/api/gemini', { action: 'chat', prompt: q });
  return text;
}

export async function generateSpeech(_: string): Promise<void> {
  // Disabled on server for now; do nothing to avoid UI crash.
  throw new Error("Text-to-speech is not enabled on this deployment.");
}
