
import { GoogleGenAI, Type } from "@google/genai";
import { MedicalRecord } from "../types";

export const generateMedicalSummary = async (records: MedicalRecord[]) => {
  // Creating a new instance right before the call to ensure it uses the most up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const recordsJson = JSON.stringify(records, null, 2);
  
  const prompt = `
    As a specialized medical assistant for thyroid cancer, please summarize the following medical history records into a concise, professional briefing for a new oncologist.
    
    Format the response clearly with the following sections:
    1. **Patient Overview**: Brief history and current status.
    2. **Clinical Timeline**: Key milestones (Diagnosis, Imaging highlights, Surgery).
    3. **Key Lab Trends**: Focus on TSH, Thyroglobulin (Tg), and Calcium trends.
    4. **Current Status & Staging**: Based on the latest pathology/imaging.
    5. **Questions for Next Appointment**: Suggest 3-5 specific questions the patient should ask.

    User Records:
    ${recordsJson}
    
    Please keep the tone professional and the information easy to scan.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const parseLabReport = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Extract lab results from the following raw text from a medical report. 
    Focus on Thyroid markers (TSH, Free T4, T3, Thyroglobulin, TgAb, Calcium).
    Return the data as a JSON array of objects with keys: marker, value (number), unit.
    Text: "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              marker: {
                type: Type.STRING,
                description: "The medical lab marker name.",
              },
              value: {
                type: Type.NUMBER,
                description: "The numerical value recorded.",
              },
              unit: {
                type: Type.STRING,
                description: "The measurement unit (e.g., mIU/L).",
              },
            },
            required: ["marker", "value", "unit"],
          },
        },
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Error parsing lab report:", error);
    return [];
  }
};
