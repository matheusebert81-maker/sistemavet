import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const geminiService = {
  async suggestAssessmentAndPlan(subjective: string, objective: string, species: string) {
    if (!ai) {
      console.warn("Gemini API Key missing");
      return null;
    }

    try {
      const prompt = `
        Atue como um assistente veterinário experiente.
        Paciente: ${species}
        
        Com base nestes dados clínicos:
        Subjetivo (Queixa/Histórico): "${subjective}"
        Objetivo (Exame Físico): "${objective}"

        Sugira:
        1. Uma Avaliação (Suspeita diagnóstica).
        2. Um Plano (Exames, tratamento inicial ou recomendações).
        
        Retorne APENAS um objeto JSON neste formato:
        {
          "assessment": "texto aqui",
          "plan": "texto aqui"
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (!text) return null;
      return JSON.parse(text);

    } catch (error) {
      console.error("Gemini Error:", error);
      return null;
    }
  }
};