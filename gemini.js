import { GoogleGenAI } from "@google/genai";
import { get } from "./localStorage";

const ai = new GoogleGenAI({ apiKey: get('geminiApiKey') });

export default async word => {
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

// await main();

// import { get } from "./localStorage";

// export default async word => {
//   // const key = get('geminiApiKey');
//   const key = 'AIzaSyAbypjP5hOxISxCmXJSvjNEhKDQMUvVtx0';
//   if (key) {
//     const schema = {
//       type: "object",
//       properties: {
//         meaning: { type: "string" },
//         synonyms: { type: "array", items: { type: "string" } },
//         rootWord: { type: "string", description: "The 'kata dasar' of the word" },
//         background: { type: "string" },
//         examples: { type: "array", items: { type: "string" }, description: "3 example sentences" }
//       },
//       required: ["meaning", "synonyms", "rootWord", "background", "examples"]
//     };

//     const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         contents: [{
//           parts: [{ text: `Analyze the Indonesian word "${word}". All explanations must be in English.` }]
//         }],
//         generationConfig: {
//           response_mime_type: "application/json",
//           response_schema: schema,
//           temperature: 0.1
//         }
//       })
//     });

//     return response.json();
//   }

//   return false;
// }