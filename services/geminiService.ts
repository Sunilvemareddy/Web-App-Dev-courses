// Fix: Add triple-slash directive to provide types for import.meta.env.
/// <reference types="vite/client" />

import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import { AspectRatio, Resource, GroundingChunk } from '../types';
import { decode, decodeAudioData } from '../utils/audioUtils';

const MISSING_KEY_ERROR = "Error: VITE_API_KEY is not configured. The AI features are disabled.";

// Create a new GoogleGenAI instance on-demand to ensure the latest API key is used.
function getAiClient() {
    const API_KEY = import.meta.env.VITE_API_KEY;
    if (!API_KEY) {
        console.error("VITE_API_KEY environment variable not set. AI features will be disabled.");
        return null;
    }
    return new GoogleGenAI({ apiKey: API_KEY });
}

export async function fetchLearningResources(topic: string): Promise<Resource> {
    const ai = getAiClient();
    if (!ai) {
        return { text: MISSING_KEY_ERROR, sources: [] };
    }
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Find the best online learning resources for "${topic}". Provide a brief overview and ensure the source links point directly to specific, high-quality tutorials, articles, or videos. The links must not be homepages. For example, instead of 'reactjs.org', the link should be 'reactjs.org/docs/getting-started.html'. Focus on free and reputable sources.`,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text;
        const sources: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        return { text, sources };
    } catch (error) {
        console.error("Error fetching learning resources:", error);
        return { text: "Sorry, I couldn't fetch resources at the moment. Please try again later.", sources: [] };
    }
}

export async function findLocalStudySpots(query: string, coords: GeolocationCoordinates): Promise<Resource> {
    const ai = getAiClient();
    if (!ai) {
        return { text: MISSING_KEY_ERROR, sources: [] };
    }
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Find ${query} near my current location.`,
            config: {
                tools: [{ googleMaps: {} }],
                toolConfig: {
                    retrievalConfig: {
                        latLng: {
                            latitude: coords.latitude,
                            longitude: coords.longitude,
                        }
                    }
                }
            },
        });
        const text = response.text;
        const sources: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        return { text, sources };

    } catch (error) {
        console.error("Error finding local study spots:", error);
        return { text: "Sorry, I couldn't find any spots. Make sure location permissions are enabled.", sources: [] };
    }
}

export async function getAiTutorResponse(prompt: string, useThinkingMode: boolean): Promise<string> {
    const ai = getAiClient();
    if (!ai) {
        return MISSING_KEY_ERROR;
    }
    try {
        const model = useThinkingMode ? "gemini-2.5-pro" : "gemini-2.5-flash";
        const config = useThinkingMode ? { thinkingConfig: { thinkingBudget: 32768 } } : {};
        
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: config,
        });

        return response.text;
    } catch (error) {
        console.error("Error with AI Tutor:", error);
        return "An error occurred while getting a response from the AI tutor.";
    }
}

export async function generateImage(prompt: string, aspectRatio: AspectRatio): Promise<string | null> {
    const ai = getAiClient();
    if (!ai) {
        console.error(MISSING_KEY_ERROR);
        return null;
    }
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: aspectRatio,
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        return null;

    } catch (error) {
        console.error("Error generating image:", error);
        return null;
    }
}

let audioContext: AudioContext | null = null;
const getAudioContext = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    return audioContext;
};

export async function generateSpeech(text: string): Promise<void> {
    const ai = getAiClient();
    if (!ai) {
        console.error(MISSING_KEY_ERROR);
        return;
    }
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                  },
              },
            },
          });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if(base64Audio) {
            const ctx = getAudioContext();
            const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            source.start();
        }

    } catch (error) {
        console.error("Error generating speech:", error);
    }
}
