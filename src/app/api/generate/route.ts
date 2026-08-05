import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateSpec, convertToMarkdown } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitize, validateIdea } from "@/lib/validate";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "No autorizado. Por favor inicia sesión." },
      { status: 401 }
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";

  const { allowed, retryAfter } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Has generado demasiadas especificaciones. Espera un momento e inténtalo de nuevo." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  try {
    const body = await request.json();
    const { projectName, idea, platform, answers } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "La clave de API de Gemini (GEMINI_API_KEY) no está configurada en el servidor. Por favor, agregue la variable de entorno en su archivo .env.local para comenzar." },
        { status: 500 }
      );
    }

    if (!projectName || !projectName.trim()) {
      return NextResponse.json(
        { error: "El nombre del proyecto no puede estar vacío." },
        { status: 400 }
      );
    }

    if (!platform || !platform.trim()) {
      return NextResponse.json(
        { error: "La plataforma no puede estar vacía." },
        { status: 400 }
      );
    }

    const ideaError = validateIdea(idea);
    if (ideaError) {
      return NextResponse.json(
        { error: ideaError },
        { status: 400 }
      );
    }

    const sanitizedProjectName = sanitize(projectName.trim());
    const sanitizedIdea = sanitize(idea.trim());
    const sanitizedPlatform = sanitize(platform.trim());

    const spec = await generateSpec(sanitizedProjectName, sanitizedIdea, sanitizedPlatform, answers);
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
