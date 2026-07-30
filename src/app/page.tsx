"use client";

import React, { useState, useEffect } from "react";
import { ProductSpec } from "@/lib/ai";
import { generateUUID } from "@/lib/uuid";
import InputForm, { SavedSpec } from "@/components/InputForm";
import SpecOutput from "@/components/SpecOutput";
import LoadingScreen from "@/components/LoadingScreen";
import ThemeToggle from "@/components/ThemeToggle";

const LOADING_STAGES = [
  { stage: "Analizando tu idea y propuesta de valor...", duration: 3000 },
  { stage: "Escribiendo historias de usuario para tus clientes...", duration: 3500 },
  { stage: "Estructurando módulos y flujos de datos del MVP...", duration: 4000 },
  { stage: "Seleccionando el stack tecnológico óptimo y creando analogías...", duration: 3500 },
  { stage: "Puliendo la especificación y el glosario interactivo...", duration: 3000 },
];

// Helper to decode shared specification from URL hash
function decodeState(encoded: string): { spec: ProductSpec; markdown: string } | null {
  try {
    const decodedUri = decodeURIComponent(encoded);
    const binary = atob(decodedUri);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const data = new TextDecoder().decode(bytes);
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to decode shareable link state:", e);
    return null;
  }
}

export default function Home() {
  // Input states
  const [projectName, setProjectName] = useState("");
  const [idea, setIdea] = useState("");
  const [platform, setPlatform] = useState("");
  const [showAssistant, setShowAssistant] = useState(false);
  const [answers, setAnswers] = useState({
    users: "",
    problem: "",
    revenue: "",
  });

  // Flow and UI states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showVagueAlert, setShowVagueAlert] = useState(false);
  const [vagueMsg, setVagueMsg] = useState("");

  // Output states
  const [spec, setSpec] = useState<ProductSpec | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [activeTab, setActiveTab] = useState("vision");
  const [history, setHistory] = useState<SavedSpec[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Sharing states
  const [isSharedView, setIsSharedView] = useState(false);

  // Load history from localStorage and check URL hash for shareable links
  useEffect(() => {
    // Load history
    const saved = localStorage.getItem("spec_builder_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }

    // Check shareable link in URL hash
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash.startsWith("#share=")) {
        const encoded = hash.substring(7);
        const decoded = decodeState(encoded);
        if (decoded) {
          setSpec(decoded.spec);
          setMarkdown(decoded.markdown);
          setProjectName("Proyecto Compartido");
          setIdea(decoded.spec.vision || "Importado desde enlace");
          setPlatform("web");
          setIsSharedView(true);
          setActiveTab("vision");
          showToast("Visualizando especificación compartida desde enlace", "info");
        } else {
          showToast("El enlace compartido no es válido o está incompleto.", "error");
        }
      }
    }
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
  };

  const handleAnswerChange = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  // Vague entry detection helper
  const detectVagueInput = () => {
    const trimmedIdea = idea.trim();
    if (trimmedIdea.split(/\s+/).length < 5) {
      return {
        isVague: true,
        reason: "Tu descripción es extremadamente corta (menos de 5 palabras). Por favor, danos un poco más de contexto o utiliza el Asistente de Enriquecimiento para detallar tu visión.",
      };
    }

    // Check for overly vague general descriptions
    const vagueKeywords = ["hacer un uber", "un tinder", "un facebook", "un clon de", "una app de", "un software para"];
    const isVagueKeyword = vagueKeywords.some((kw) => cleanStr(trimmedIdea) === cleanStr(kw));
    if (isVagueKeyword || trimmedIdea.length < 25) {
      return {
        isVague: true,
        reason: "¡Tu idea suena emocionante! Pero necesitamos algunos detalles adicionales para generar una especificación técnica de calidad. Por favor, usa el Asistente de Enriquecimiento que aparece abajo.",
      };
    }

    return { isVague: false, reason: "" };
  };

  const cleanStr = (s: string) => s.trim().toLowerCase();

  const startGeneration = async (force: boolean = false) => {
    setError(null);
    setShowVagueAlert(false);
    setIsSharedView(false); // Disable shared banner once the user compiles their own ideas

    if (!projectName.trim()) {
      showToast("Por favor, introduce el nombre de tu proyecto.", "error");
      return;
    }
    if (!idea.trim()) {
      showToast("Por favor, introduce una descripción de tu idea.", "error");
      return;
    }
    if (!platform) {
      showToast("Por favor, selecciona un tipo de plataforma.", "error");
      return;
    }

    // Smart check for vague inputs unless forced
    if (!force) {
      const vagueCheck = detectVagueInput();
      if (vagueCheck.isVague) {
        setVagueMsg(vagueCheck.reason);
        setShowVagueAlert(true);
        setShowAssistant(true); // Open the assistant automatically to help them
        return;
      }
    }

    // Set up loading and stages
    setIsLoading(true);
    setProgress(5);
    setLoadingStage(LOADING_STAGES[0].stage);

    // Simulate progressive loading bar
    let currentProgress = 5;
    const interval = setInterval(() => {
      if (currentProgress < 95) {
        currentProgress += Math.floor(Math.random() * 3) + 1;
        setProgress(Math.min(currentProgress, 95));
      }
    }, 250);

    // Progressive stage transitions
    const stageTimers: NodeJS.Timeout[] = [];
    let accumulatedTime = 0;

    LOADING_STAGES.forEach((stageObj, idx) => {
      if (idx > 0) {
        accumulatedTime += LOADING_STAGES[idx - 1].duration;
        const timer = setTimeout(() => {
          setLoadingStage(stageObj.stage);
        }, accumulatedTime);
        stageTimers.push(timer);
      }
    });

    try {
      // Build answers array if assistant is used
      const answersArray = showAssistant
        ? Object.entries(answers)
            .filter(([_, val]) => val.trim().length > 0)
            .map(([key, val]) => ({
              question:
                key === "users"
                  ? "👥 ¿Quiénes serán los usuarios principales?"
                  : key === "problem"
                  ? "🎯 ¿Cuál es el problema principal?"
                  : "💰 ¿Cómo generará valor/ingresos?",
              answer: val,
            }))
        : undefined;

      // Make API call
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName,
          idea,
          platform,
          answers: answersArray,
        }),
      });

      clearInterval(interval);
      stageTimers.forEach((t) => clearTimeout(t));

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Error de red en la generación de la especificación.");
      }

      const data = await response.json();

      setProgress(100);
      setSpec(data.spec);
      setMarkdown(data.markdown);
      setActiveTab("vision");

      // Save spec in LocalStorage history
      const newSaved: SavedSpec = {
        id: generateUUID(),
        projectName: projectName.trim(),
        idea: idea.trim(),
        platform,
        answers: answersArray,
        spec: data.spec,
        markdown: data.markdown,
        version: calculateNextVersion(projectName.trim()),
        createdAt: new Date().toLocaleString("es-ES"),
      };

      const updatedHistory = [newSaved, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("spec_builder_history", JSON.stringify(updatedHistory));

      showToast(`¡Especificación generada con éxito! Versión V${newSaved.version} guardada.`, "success");

      // Scroll down to results on mobile
      setTimeout(() => {
        const outputEl = document.getElementById("output-section");
        if (outputEl) outputEl.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } catch (err: any) {
      console.error(err);
      clearInterval(interval);
      stageTimers.forEach((t) => clearTimeout(t));
      setError(err.message || "Lo sentimos, nos tomó más tiempo de lo esperado entender la idea.");
      showToast("La generación falló. Por favor intente de nuevo.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNextVersion = (name: string): number => {
    const existing = history.filter((h) => h.projectName.toLowerCase() === name.toLowerCase());
    if (existing.length === 0) return 1;
    const maxVersion = Math.max(...existing.map((e) => e.version));
    return maxVersion + 1;
  };

  const loadSavedSpec = (saved: SavedSpec) => {
    setIsSharedView(false);
    setProjectName(saved.projectName);
    setIdea(saved.idea);
    setPlatform(saved.platform);
    setSpec(saved.spec);
    setMarkdown(saved.markdown);
    setActiveTab("vision");

    // Set up answers if any
    if (saved.answers) {
      const answersObj = { users: "", problem: "", revenue: "" };
      saved.answers.forEach((a) => {
        if (a.question.includes("usuarios")) answersObj.users = a.answer;
        if (a.question.includes("problema")) answersObj.problem = a.answer;
        if (a.question.includes("valor") || a.question.includes("ingresos")) answersObj.revenue = a.answer;
      });
      setAnswers(answersObj);
      setShowAssistant(true);
    } else {
      setShowAssistant(false);
    }

    showToast(`Cargado borrador "${saved.projectName}" (V${saved.version})`, "info");

    setTimeout(() => {
      const outputEl = document.getElementById("output-section");
      if (outputEl) outputEl.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const deleteSavedSpec = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("spec_builder_history", JSON.stringify(updated));
    showToast("Borrador eliminado correctamente.", "info");
  };

  const handleSaveSharedSpec = () => {
    if (!spec) return;

    const newSaved: SavedSpec = {
      id: generateUUID(),
      projectName: projectName.trim() || "Proyecto Compartido",
      idea: spec.vision || idea.trim() || "Importado desde enlace compartido",
      platform: platform || "web",
      spec,
      markdown,
      version: calculateNextVersion(projectName.trim()),
      createdAt: new Date().toLocaleString("es-ES"),
    };

    const updatedHistory = [newSaved, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("spec_builder_history", JSON.stringify(updatedHistory));
    setIsSharedView(false);
    
    // Clear hash to normalize URL without refreshing the page
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname);
    }
    
    showToast("Especificación guardada en tus borradores locales con éxito.", "success");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-slate-100 font-sans print:bg-white print:text-black">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center p-4 rounded-xl shadow-lg border animate-bounce max-w-sm bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
          <div
            className={`mr-3 text-2xl ${
              toast.type === "success" ? "text-emerald-500" : toast.type === "error" ? "text-rose-500" : "text-sky-500"
            }`}
          >
            {toast.type === "success" ? "✓" : toast.type === "error" ? "⚠️" : "ℹ"}
          </div>
          <div className="text-sm font-medium">{toast.message}</div>
        </div>
      )}

      {/* Print-only CSS layout */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          header,
          .no-print,
          button,
          form,
          select,
          .drafts-sidebar {
            display: none !important;
          }
          .print-full {
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
          }
          .print-page-break {
            page-break-before: always;
            margin-top: 2rem;
          }
        }
      `}</style>

      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 py-6 px-4 md:px-8 shadow-xs no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🛠️</span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
                SpecGenius
              </h1>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Creador de Especificaciones de Producto para Emprendedores
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-center md:text-right">
            <div>
              <p className="text-xs text-slate-400">Visual, Interactivo y Listo para Programadores</p>
              <p className="text-xs font-bold text-violet-600 dark:text-violet-400 mt-0.5">
                Potenciado por Google Gemini IA
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex-1 flex flex-col gap-6 w-full">
        {/* Shareable Link Top Banner */}
        {isSharedView && (
          <div className="bg-violet-600 text-white px-5 py-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md no-print animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌐</span>
              <div className="min-w-0">
                <p className="text-sm font-bold">Especificación Compartida Encontrada</p>
                <p className="text-xs text-violet-100 mt-0.5">
                  Estás visualizando el MVP generado para <strong>"{projectName}"</strong>. Puedes guardarlo en tus borradores locales para no perderlo.
                </p>
              </div>
            </div>
            <button
              onClick={handleSaveSharedSpec}
              className="bg-white hover:bg-slate-100 text-violet-700 font-bold text-xs py-2 px-4 rounded-xl transition-colors shadow-sm shrink-0 cursor-pointer"
            >
              💾 Guardar en mis Borradores
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
          {/* Left Form Panel */}
          <InputForm
            projectName={projectName}
            setProjectName={setProjectName}
            idea={idea}
            setIdea={setIdea}
            platform={platform}
            setPlatform={setPlatform}
            showAssistant={showAssistant}
            setShowAssistant={setShowAssistant}
            answers={answers}
            handleAnswerChange={handleAnswerChange}
            isLoading={isLoading}
            showVagueAlert={showVagueAlert}
            setShowVagueAlert={setShowVagueAlert}
            vagueMsg={vagueMsg}
            startGeneration={startGeneration}
            history={history}
            loadSavedSpec={loadSavedSpec}
            deleteSavedSpec={deleteSavedSpec}
          />

          {/* Right Panel Output */}
          <section id="output-section" className="lg:col-span-7 flex flex-col gap-6 print:col-span-12 w-full">
            {/* Loading Stage Screen */}
            {isLoading && <LoadingScreen loadingStage={loadingStage} progress={progress} />}

            {/* Initial State Screen */}
            {!isLoading && !spec && !error && (
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs p-10 flex flex-col items-center justify-center min-h-[450px] text-center gap-5">
                <span className="text-6xl animate-pulse">📋</span>
                <div className="space-y-1.5 max-w-md">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Tu Especificación Aparecerá Aquí
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Ingresa los detalles de tu proyecto a la izquierda y presiona el botón. Generaremos un documento
                    completo de requerimientos con objetivos, historias de usuario, módulos y stack de desarrollo.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mt-2 max-w-md">
                  <span className="text-xs font-semibold bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full">
                    ✓ Formato compatible con programadores
                  </span>
                  <span className="text-xs font-semibold bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full">
                    ✓ Historias de usuario para MVP
                  </span>
                  <span className="text-xs font-semibold bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full">
                    ✓ Glosario interactivo sin tecnicismos
                  </span>
                </div>
              </div>
            )}

            {/* Error contingency screen */}
            {!isLoading && error && (
              <div className="bg-white dark:bg-zinc-900 border border-rose-200 dark:border-rose-950 rounded-2xl shadow-xs p-10 flex flex-col items-center justify-center min-h-[450px] text-center gap-6">
                <span className="text-6xl">⏱️</span>
                <div className="space-y-2 max-w-md">
                  <h3 className="text-lg font-bold text-rose-700 dark:text-rose-400">
                    Nos tomó más tiempo de lo esperado
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    No pudimos conectarnos correctamente con la API o el servidor se demoró demasiado procesando.
                    No te preocupes, guardamos todo tu avance a la izquierda para que no tengas que escribirlo de nuevo.
                  </p>
                  <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-[11px] font-mono p-3 rounded-lg border border-rose-100 dark:border-rose-950/60 max-w-sm mx-auto text-left relative group">
                    <div className="overflow-x-auto pr-6">
                      Error: {error}
                    </div>
                    <button
                      onClick={() => {
                        try {
                          navigator.clipboard.writeText(error);
                          showToast("Error copiado al portapapeles.", "success");
                        } catch (e) {
                          showToast("Fallo al copiar. Cópialo manualmente.", "error");
                        }
                      }}
                      className="absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity bg-rose-200 hover:bg-rose-300 dark:bg-rose-800/60 dark:hover:bg-rose-700/60 cursor-pointer"
                      title="Copiar error al portapapeles"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => startGeneration(true)}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer"
                  >
                    Reintentar Generación
                  </button>
                  <button
                    onClick={() => {
                      try {
                        navigator.clipboard.writeText(idea);
                        showToast("¡Idea de negocio copiada al portapapeles!", "success");
                      } catch (e) {
                        showToast("Fallo al copiar. Cópialo manualmente de la descripción.", "error");
                      }
                    }}
                    className="bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700 font-bold text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer"
                  >
                    Copiar Idea Escrita
                  </button>
                </div>
              </div>
            )}

            {/* Visual preview of specification */}
            {!isLoading && spec && (
              <SpecOutput
                spec={spec}
                markdown={markdown}
                projectName={projectName}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                history={history}
                showToast={showToast}
              />
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 py-6 px-4 text-center text-xs text-slate-400 no-print mt-auto">
        <p>
          © {new Date().getFullYear()} SpecGenius — Plantilla Spec-First por dominicode. Construido con Next.js, Google
          Gemini y Tailwind.
        </p>
        <p className="mt-1">Diseñado para democratizar la tecnología y empoderar a los emprendedores de habla hispana.</p>
      </footer>
    </div>
  );
}
