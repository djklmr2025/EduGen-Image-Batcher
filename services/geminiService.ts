import { GoogleGenAI } from "@google/genai";

// Standard prompt wrapper to ensure consistency and style
const BASE_PROMPT = "Create a clear, photorealistic, educational image suitable for a textbook, 584x584 pixels, depicting: ";

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-2.5-flash-image as requested for balance of speed and quality for batch jobs
    // The model typically returns 1024x1024. We will resize on the client side.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: BASE_PROMPT + prompt
          },
        ],
      },
      config: {
        // Flash image model doesn't support extensive config like 'imageSize' yet in the same way Pro does,
        // but supports aspectRatio. 1:1 is default.
      }
    });

    // Extract base64
    let base64Image: string | undefined;

    for (const candidate of response.candidates || []) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.data) {
          base64Image = part.inlineData.data;
          break;
        }
      }
      if (base64Image) break;
    }

    if (!base64Image) {
      throw new Error("No image data found in response");
    }

    return `data:image/png;base64,${base64Image}`;

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};
