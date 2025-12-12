import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert professional stylist and barber with deep knowledge of face shapes, aesthetics, and grooming.
Your task is to analyze a user's facial image and provide personalized recommendations.
1. Identify the user's face shape (e.g., Oval, Round, Square, Diamond, Heart, Oblong).
2. Analyze key facial features (jawline, forehead, cheekbones).
3. Recommend 3-4 specific hairstyles that complement this face shape.
4. Recommend 3-4 specific beard or facial hair styles.
5. Recommend 3 distinct "Look Combinations" that pair a specific hairstyle with a facial hair style to create a cohesive look. Give each look a creative name (e.g., "The Modern Gentleman", "The Creative rugged").
6. Provide 3-4 general grooming or styling tips.

Be specific about WHY a style works (e.g., "Adds volume to top to elongate a round face").
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    faceShape: {
      type: Type.STRING,
      description: "The identified shape of the face (e.g., Oval, Square).",
    },
    faceAnalysis: {
      type: Type.STRING,
      description: "A brief analysis of the facial features contributing to this shape.",
    },
    hairstyles: {
      type: Type.ARRAY,
      description: "Recommended hairstyles.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the hairstyle." },
          description: { type: Type.STRING, description: "Description of the cut." },
          reasoning: { type: Type.STRING, description: "Why this suits the user." },
        },
        required: ["name", "description", "reasoning"],
      },
    },
    facialHair: {
      type: Type.ARRAY,
      description: "Recommended beard or facial hair styles.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the style." },
          description: { type: Type.STRING, description: "Description of the style." },
          reasoning: { type: Type.STRING, description: "Why this suits the user." },
        },
        required: ["name", "description", "reasoning"],
      },
    },
    combinations: {
      type: Type.ARRAY,
      description: "Recommended combinations of hair and beard styles.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Creative name for the combination." },
          hairstyle: { type: Type.STRING, description: "The specific hairstyle used in this combination." },
          facialHair: { type: Type.STRING, description: "The specific facial hair style used." },
          description: { type: Type.STRING, description: "Overall description of the look." },
          reasoning: { type: Type.STRING, description: "Why this combination works together." },
        },
        required: ["name", "hairstyle", "facialHair", "description", "reasoning"],
      },
    },
    groomingTips: {
      type: Type.ARRAY,
      description: "General grooming tips.",
      items: { type: Type.STRING },
    },
  },
  required: ["faceShape", "faceAnalysis", "hairstyles", "facialHair", "combinations", "groomingTips"],
};

export const analyzeFace = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Remove header if present
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: "Analyze this face and recommend styles including combinations.",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    } else {
      throw new Error("No response text received from Gemini.");
    }
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const generateLookPreview = async (originalBase64: string, combinationDescription: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const cleanBase64 = originalBase64.split(',')[1] || originalBase64;

    // We use gemini-2.5-flash-image for image editing/generation based on input image
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64,
            },
          },
          {
            text: `Edit this image to show the person with the following style: ${combinationDescription}. 
            Maintain the person's original identity, face shape, skin tone, and lighting. 
            Make it look like a photorealistic after-haircut photo.`,
          },
        ],
      },
    });

    // Extract image from response
    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};