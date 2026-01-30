
import { GoogleGenAI } from "@google/genai";
import { APP_CONFIG } from "../config";

const apiKey = process.env.API_KEY || (import.meta as any).env.API_KEY;

// Inicializa o cliente apenas se a configuração permitir e houver chave
const ai = (APP_CONFIG.FEATURES.USE_GOOGLE_AI && apiKey) 
  ? new GoogleGenAI({ apiKey }) 
  : null;

export const geminiService = {
  async suggestAssessmentAndPlan(subjective: string, objective: string, species: string) {
    
    // MODO LOCAL / OPEN SOURCE (SEM API KEY)
    if (!ai) {
      console.log("[AI Service] Modo Local: Retornando sugestão simulada.");
      
      // Simula um delay de rede para UX realista
      await new Promise(resolve => setTimeout(resolve, 1500));

      return {
        assessment: `[Sugestão Local] Baseado nos sinais clínicos de ${species}, considere diagnósticos diferenciais compatíveis com o histórico informado.`,
        plan: `1. Realizar hemograma completo e bioquímico.\n2. Manter hidratação.\n3. Monitorar temperatura e FC.\n4. (Isto é uma resposta automática do modo offline).`
      };
    }

    // MODO CONECTADO (GOOGLE GEMINI)
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
      // Fallback gracioso em caso de erro de API
      return {
        assessment: "Erro ao conectar com a IA. Verifique sua conexão.",
        plan: "Prossiga com o protocolo padrão da clínica."
      };
    }
  }
};
