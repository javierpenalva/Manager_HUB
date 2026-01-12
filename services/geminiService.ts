import { GoogleGenAI } from "@google/genai";
import { Resource } from "../types";

// En Vite, las variables de entorno se acceden vía import.meta.env o se definen en el config
// Esta lógica asegura compatibilidad con el entorno actual y con el despliegue final
const apiKey = process.env.API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;

export const getGeminiRecommendations = async (
  query: string,
  availableResources: Resource[]
): Promise<string> => {
  if (!apiKey || apiKey === "undefined") {
    return "El asistente IA no está disponible (falta API_KEY). Por favor, configura el Secret en GitHub.";
  }

  const ai = new GoogleGenAI({ apiKey });

  const resourcesContext = availableResources
    .map((r) => `- ${r.title} (${r.category}): ${r.description}`)
    .join("\n");

  const prompt = `
    Actúa como un experto consultor en tecnología educativa (EdTech).
    El usuario es un profesor buscando ayuda.
    Tienes acceso al siguiente repositorio de recursos disponibles en esta web:
    
    ${resourcesContext}
    
    Pregunta del usuario: "${query}"
    
    Instrucciones:
    1. Recomienda 1 o 2 herramientas de la lista anterior que mejor se adapten a la necesidad.
    2. Explica brevemente por qué.
    3. Si ninguna herramienta encaja perfectamente, sugiere una alternativa genérica pero menciona que no está en el repositorio.
    4. Mantén un tono profesional, motivador y breve (máximo 100 palabras).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "No pude generar una respuesta.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Hubo un error al consultar con el asistente inteligente.";
  }
};