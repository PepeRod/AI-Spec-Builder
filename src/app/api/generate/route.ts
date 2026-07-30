import { NextRequest, NextResponse } from "next/server";
import { generateSpec, convertToMarkdown } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { projectName, idea, platform, answers } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "La clave de API de Gemini (GEMINI_API_KEY) no está configurada en el servidor. Por favor, agregue la variable de entorno en su archivo .env.local para comenzar." },
        { status: 500 }
      );
    }

    if (!projectName || !idea || !platform) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: projectName, idea y platform son requeridos." },
        { status: 400 }
      );
    }

    // Call the structured Gemini generator
    const spec = await generateSpec(projectName, idea, platform, answers);
    
    // Convert to markdown as well
    const markdown = convertToMarkdown(spec);

    return NextResponse.json({ spec, markdown });
  } catch (error: any) {
    console.error("API Route Generation failed:", error);
    return NextResponse.json(
      { error: error.message || "La generación de la especificación falló. Por favor intente de nuevo." },
      { status: 500 }
    );
  }
}
