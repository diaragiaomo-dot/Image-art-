import { GoogleGenAI } from "@google/genai";
import { ModelType, GenerationConfig } from "../types";

// Helper to get the AI client. 
// We re-instantiate this every time to ensure we pick up the latest API key 
// if the user switches it via the aistudio overlay.
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key mancante");
  }
  return new GoogleGenAI({ apiKey });
};

export const checkApiKeySelection = async (): Promise<boolean> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.hasSelectedApiKey) {
    return await win.aistudio.hasSelectedApiKey();
  }
  return true; // Fallback if not running in the specific environment requiring selection
};

export const promptForKeySelection = async (): Promise<void> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.openSelectKey) {
    await win.aistudio.openSelectKey();
  }
};

export const generateImage = async (config: GenerationConfig): Promise<string[]> => {
  const ai = getClient();
  
  // Basic configuration
  const requestConfig: any = {
    imageConfig: {
      aspectRatio: config.aspectRatio,
    }
  };

  // Add size only if supported (Pro model)
  if (config.model === ModelType.Pro && config.size) {
    requestConfig.imageConfig.imageSize = config.size;
  }

  try {
    const response = await ai.models.generateContent({
      model: config.model,
      contents: {
        parts: [
          { text: config.prompt }
        ]
      },
      config: requestConfig
    });

    const imageUrls: string[] = [];

    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData && part.inlineData.data) {
             const base64Data = part.inlineData.data;
             const mimeType = part.inlineData.mimeType || 'image/png';
             imageUrls.push(`data:${mimeType};base64,${base64Data}`);
          }
        }
      }
    }

    if (imageUrls.length === 0) {
      throw new Error("Nessuna immagine generata. Riprova con un prompt diverso.");
    }

    return imageUrls;
  } catch (error: any) {
    console.error("Errore generazione immagine:", error);
    
    // Handle specific error for key not found which might happen with Pro models
    if (error.message && error.message.includes("Requested entity was not found")) {
       throw new Error("KEY_ERROR");
    }
    
    throw error;
  }
};