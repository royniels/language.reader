import { GoogleGenAI } from "@google/genai";
import { get } from "./localStorage";

export default async word => {
  const ai = new GoogleGenAI({ apiKey: get('geminiApiKey') });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Can you translate the indonesian word "${word}" to english, can you tell me what the root word is. Finally show if this is a word that is used frequently or not`,
    generationConfig: {
      maxOutputTokens: 150,
      temperature: 0.2,
    }
  });
  return response.text;
}