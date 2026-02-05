
// services/geminiService.ts
import { GoogleGenAI } from "@google/genai";

export interface MediaPart {
  mimeType: string;
  data: string; // Base64 string
}

/**
 * Generates text based on text, image, or audio input using Gemini API.
 */
export const generateMultimodalText = async (
  prompt: string,
  mediaParts: MediaPart[] = []
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Construct parts for the Gemini API
    const parts: any[] = [{ text: prompt }];
    
    mediaParts.forEach(m => {
      parts.push({
        inlineData: {
          mimeType: m.mimeType,
          data: m.data
        }
      });
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI.");
    }
    return text;
  } catch (error) {
    console.error("Multimodal AI Error:", error);
    throw new Error("Failed to process your request.");
  }
};

/**
 * Legacy support for text-only prompts
 */
export const generateText = async (prompt: string): Promise<string> => {
  return generateMultimodalText(prompt);
};
