
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
    // API Key must be obtained exclusively from the environment variable process.env.API_KEY.
    if (!process.env.API_KEY) {
      console.error("API Key is missing in process.env");
      throw new Error("API Key not found.");
    }

    // Always use new GoogleGenAI({apiKey: process.env.API_KEY});
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

    // Use ai.models.generateContent to query GenAI with model name and prompt/parts
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
      },
    });

    // Extract text output using the .text property (not a method)
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
