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

  // Incluimos la URL en el contexto para que Gemini la conozca
  const resourcesContext = availableResources
    .map((r) => `- ${r.title} (${r.category}): ${r.description}. URL: ${r.url}`)
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
    3. IMPRESCINDIBLE: Para cada herramienta que recomiendes del repositorio, DEBES poner su nombre con un enlace directo usando formato Markdown. Ejemplo: [Nombre Herramienta](URL).
    4. Si ninguna herramienta encaja perfectamente, sugiere una alternativa genérica pero menciona que no está en el repositorio.
    5. Mantén un tono profesional, motivador y breve (máximo 100 palabras).
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

export const getImagePromptForResource = async (title: string, description: string): Promise<string | null> => {
  if (!apiKey || apiKey === "undefined") return null;

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
    Basado en este recurso educativo:
    Título: "${title}"
    Descripción: "${description}"

    Genera una única frase corta en inglés (máximo 4 palabras) que sirva como "keyword" o "prompt" visual para buscar o generar una imagen de fondo abstracta y moderna.
    Ejemplos: "digital classroom abstract", "robot writing futuristic", "colorful dna spiral".
    
    SOLO devuelve las palabras en inglés, nada más.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text?.trim() || "technology education";
  } catch (error) {
    console.error("Error generating image prompt:", error);
    return "technology abstract";
  }
};