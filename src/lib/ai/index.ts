import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY ?? "",
});

export interface SpecFlow {
  name: string;
  steps: string[];
  error_path: string;
}

export interface ProductSpec {
  vision: string;
  users: string;
  features: string[];
  flows: SpecFlow[];
  architecture: string;
  requirements: string;
}

const specSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    vision: {
      type: Type.STRING,
      description: "Product vision, purpose, and value proposition. 2-4 sentences.",
    },
    users: {
      type: Type.STRING,
      description: "Target users and their main pain points. 2-4 sentences.",
    },
    features: {
      type: Type.ARRAY,
      description: "Core features of the MVP. Each item starts with 'El usuario puede...' or 'El sistema permite...'",
      items: { type: Type.STRING },
    },
    flows: {
      type: Type.ARRAY,
      description: "Key user flows, 3-5 items. Each flow has a name, ordered steps, and an error path.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Short flow name" },
          steps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Happy-path steps in order" },
          error_path: { type: Type.STRING, description: "What happens if this flow fails" },
        },
        required: ["name", "steps", "error_path"],
      },
    },
    architecture: {
      type: Type.STRING,
      description: "Technical architecture, stack choices, and system design. 2-4 sentences.",
    },
    requirements: {
      type: Type.STRING,
      description: "Functional and non-functional requirements. 2-4 sentences.",
    },
  },
  required: ["vision", "users", "features", "flows", "architecture", "requirements"],
};

export async function generateSpec(
  projectName: string,
  idea: string,
  platform: string,
  answers?: { question: string; answer: string }[]
): Promise<ProductSpec> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }

  let enrichedContext = "";
  if (answers && answers.length > 0) {
    enrichedContext = "\nPreguntas y respuestas complementarias para enriquecer la idea:\n" +
      answers.map(a => `- Pregunta: ${a.question}\n  Respuesta: ${a.answer}`).join("\n");
  }

  const prompt = `You are a senior software architect. Your ONLY task is to generate technical specifications in JSON format.

Given the product idea provided by the user, generate a complete technical specification as a JSON object.

IMPORTANT: Respond with the raw JSON object directly — no wrapper keys, no markdown fences, no extra text.
The root object must have exactly these 6 keys:

{
  "vision": "<string, 2-4 sentences describing the product vision, core purpose, and value proposition>",
  "users": "<string, 2-4 sentences describing the target users, their context, and their main pain points>",
  "features": [
    "El usuario puede ... (or El sistema permite ...)",
    "... between 5 and 8 items total ..."
  ],
  "flows": [
    {
      "name": "<short flow name>",
      "steps": ["Step 1", "Step 2", "Step 3"],
      "error_path": "<what happens if this flow fails>"
    }
  ],
  "architecture": "<string, 2-4 sentences describing the technical architecture, stack choices, and system design>",
  "requirements": "<string, 2-4 sentences covering the key functional and non-functional requirements>"
}

Project Information:
- Project Name: ${projectName}
- Idea: ${idea}
- Platform Type: ${platform}${enrichedContext}

Rules:
- All text in features, flows (name, steps, error_path), and users must be in SPANISH. vision, architecture, and requirements can be in SPANISH too.
- features: array of strings, 5–8 items, each starting with 'El usuario puede' or 'El sistema permite'.
- flows: array of objects, 3–5 items. Each object must have exactly: name (string), steps (array of strings with the happy-path steps in order), error_path (string describing what happens if the flow fails).
- vision, users, architecture, requirements: plain strings of exactly 2–4 sentences — not one line, not a long paragraph.
- Output only the JSON object. No wrapper object, no extra keys, no explanation.

IMPORTANT: Return the JSON object directly. Do NOT wrap it in any parent key like spec, data, result or any other wrapper. The root of your response must be the JSON object itself.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: specSchema,
        temperature: 0.2,
      },
    });

    if (!response.text) {
      throw new Error("No response text received from Gemini API");
    }

    return JSON.parse(response.text) as ProductSpec;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw error;
  }
}

export function convertToMarkdown(spec: ProductSpec): string {
  let md = `# Especificación de Producto\n\n`;

  md += `## Visión\n${spec.vision}\n\n`;

  md += `## Usuarios\n${spec.users}\n\n`;

  md += `## Funcionalidades\n`;
  spec.features.forEach((f, i) => { md += `${i + 1}. ${f}\n`; });
  md += `\n`;

  md += `## Flujos\n`;
  spec.flows.forEach((flow, i) => {
    md += `### ${i + 1}. ${flow.name}\n`;
    md += `**Pasos:**\n`;
    flow.steps.forEach((step, j) => { md += `${j + 1}. ${step}\n`; });
    md += `\n**En caso de error:** ${flow.error_path}\n\n`;
  });

  md += `## Arquitectura\n${spec.architecture}\n\n`;

  md += `## Requisitos\n${spec.requirements}\n\n`;

  md += `---\n*Documento generado automáticamente por AI Product Spec Builder.*`;
  return md;
}
