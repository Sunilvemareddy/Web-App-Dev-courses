import { AspectRatio, Resource } from '../types';

async function post(path: string, body: any) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

export async function getAiTutorResponse(prompt: string, thinkingEnabled = false): Promise<string> {
  const { text } = await post('/api/gemini', { action: 'chat', prompt });
  return text;
}

export async function fetchLearningResources(topic: string): Promise<Resource[]> {
  const { text } = await post('/api/gemini', { action: 'resources', prompt: topic });
  // model may wrap JSON in fences — strip if present
  const cleaned = text.trim().replace(/^```json\s*|\s*```$/g, '');
  try {
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : (parsed.resources || []);
  } catch {
    return [{ text, sources: [] } as Resource];
  }
}

export async function generateImage(_prompt: string, _aspect: AspectRatio = '1:1'): Promise<string> {
  throw new Error('Image generation is not enabled on this deployment.');
}

export async function findLocalStudySpots(location: string): Promise<string> {
  const q = `List 3 quiet study spots near ${location}. Respond in plain text, 1 per line.`;
  const { text } = await post('/api/gemini', { action: 'chat', prompt: q });
  return text;
}

export async function generateSpeech(_: string): Promise<void> {
  throw new Error("Text-to-speech is not enabled on this deployment.");
}
