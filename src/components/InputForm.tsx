import React from "react";
import { Show, SignInButton } from "@clerk/nextjs";

export interface SavedSpec {
  id: string;
  projectName: string;
  idea: string;
  platform: string;
  answers?: { question: string; answer: string }[];
  spec: any; // We can type this loosely as any or ProductSpec
  markdown: string;
  version: number;
  createdAt: string;
}

const PLATFORM_OPTIONS = [
  { id: "web", label: "Sitio Web o App Web", icon: "🌐", desc: "Plataformas accesibles desde cualquier navegador (ej. Airbnb, Trello)" },
  { id: "mobile", label: "Aplicación Móvil", icon: "📱", desc: "Apps nativas o híbridas para iOS y Android (ej. Uber, Instagram)" },
  { id: "saas", label: "Software SaaS (Suscripción)", icon: "💻", desc: "Herramientas de software en la nube para empresas (ej. Slack, Notion)" },
  { id: "e-commerce", label: "Tienda Online (E-commerce)", icon: "🛒", desc: "Plataformas de venta de productos físicos o digitales" },
  { id: "other", label: "Otro Concepto Técnico", icon: "⚙️", desc: "Integraciones, APIs, Bots, etc." },
];

const ENRICHMENT_QUESTIONS = [
  {
    id: "users",
    question: "👥 ¿Quiénes serán los usuarios o clientes principales de tu producto?",
    placeholder: "Ej: Freelancers que necesitan cobrar sus servicios, clientes finales...",
    tooltip: "Define quién interactúa con el sistema. Ayuda a escribir Historias de Usuario precisas."
  },
  {
    id: "problem",
    question: "🎯 ¿Cuál es el problema principal que resuelve tu producto?",
    placeholder: "Ej: Pierden mucho tiempo haciendo facturas manuales y se equivocan en los montos...",
    tooltip: "Define el dolor que soluciona tu MVP. Permite enfocar las prioridades del sistema."
  },
  {
    id: "revenue",
    question: "💰 ¿Cómo imaginas que tu producto generará ingresos o valor?",
    placeholder: "Ej: Suscripción mensual de $10 dólares, o una comisión por transacción...",
    tooltip: "Indica el modelo de negocio. Permite sugerir integraciones adecuadas de pago."
  },
];

interface InputFormProps {
  projectName: string;
  setProjectName: (val: string) => void;
  idea: string;
  setIdea: (val: string) => void;
  platform: string;
  setPlatform: (val: string) => void;
  showAssistant: boolean;
  setShowAssistant: (val: boolean) => void;
  answers: { users: string; problem: string; revenue: string };
  handleAnswerChange: (key: string, value: string) => void;
  isLoading: boolean;
  showVagueAlert: boolean;
  setShowVagueAlert: (val: boolean) => void;
  vagueMsg: string;
  startGeneration: (force: boolean) => void;
  history: SavedSpec[];
  loadSavedSpec: (spec: SavedSpec) => void;
  deleteSavedSpec: (id: string, e: React.MouseEvent) => void;
}

export default function InputForm({
  projectName,
  setProjectName,
  idea,
  setIdea,
  platform,
  setPlatform,
  showAssistant,
  setShowAssistant,
  answers,
  handleAnswerChange,
  isLoading,
  showVagueAlert,
  setShowVagueAlert,
  vagueMsg,
  startGeneration,
  history,
  loadSavedSpec,
  deleteSavedSpec,
}: InputFormProps) {
  return (
    <section className="lg:col-span-5 flex flex-col gap-6 no-print">
      {/* Main Input Form Card */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs p-6 flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📝</span> Aterriza tu Idea
          </h2>
          {history.length > 0 && (
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded">
              {history.length} Borradores
            </span>
          )}
        </div>

        {/* Smart Alert (Prompt injection/Vague concept) */}
        {showVagueAlert && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-300 rounded-xl p-4 flex flex-col gap-2.5">
            <div className="flex gap-2 text-sm font-semibold">
              <span>⚠️</span>
              <span>Descripción muy simple</span>
            </div>
            <p className="text-xs leading-relaxed">{vagueMsg}</p>
            <div className="flex gap-2">
              <button
                onClick={() => startGeneration(true)}
                className="text-xs font-bold text-amber-950 dark:text-amber-400 hover:underline bg-amber-100 dark:bg-amber-900/40 px-2 py-1 rounded"
              >
                Ignorar y Generar así
              </button>
              <button
                onClick={() => {
                  setShowVagueAlert(false);
                  const el = document.getElementById("users-input");
                  if (el) el.focus();
                }}
                className="text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded"
              >
                Completar Asistente
              </button>
            </div>
          </div>
        )}

        {/* Project Name */}
        <div className="flex flex-col gap-1.5 font-sans">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Nombre de tu Proyecto
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Ej: AgroMarket, Uber de Mascotas, FacturaPro..."
            className="w-full bg-slate-50 border border-slate-200 dark:bg-zinc-800 dark:border-zinc-700/60 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500 transition-all font-medium text-slate-900 dark:text-white"
            maxLength={40}
            disabled={isLoading}
          />
        </div>

        {/* Project Idea description */}
        <div className="flex flex-col gap-1.5 font-sans">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              ¿En qué consiste tu idea?
            </label>
            <span className="text-[10px] text-slate-400">{idea.length}/1000</span>
          </div>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe qué hace tu idea de la forma más sencilla posible. Ej: Una aplicación para conectar productores agrícolas locales con restaurantes sin intermediarios."
            className="w-full bg-slate-50 border border-slate-200 dark:bg-zinc-800 dark:border-zinc-700/60 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500 transition-all min-h-[100px] max-h-[250px] font-medium text-slate-900 dark:text-white leading-relaxed"
            maxLength={1000}
            disabled={isLoading}
          />
        </div>

        {/* Platform Options selection */}
        <div className="flex flex-col gap-1.5 font-sans">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Tipo de Plataforma
          </label>
          <div className="grid grid-cols-1 gap-2 mt-1">
            {PLATFORM_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setPlatform(opt.id)}
                disabled={isLoading}
                className={`flex items-start text-left gap-3 p-3 rounded-xl border transition-all hover:bg-slate-50 dark:hover:bg-zinc-800/60 ${
                  platform === opt.id
                    ? "border-violet-600 bg-violet-50/50 ring-1 ring-violet-500 dark:border-violet-500 dark:bg-violet-950/25"
                    : "border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900"
                }`}
              >
                <span className="text-2xl mt-0.5">{opt.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{opt.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Assisted Enrichment Wizard (Toggle) */}
        <div className="border-t border-slate-100 dark:border-zinc-800/80 pt-4 mt-2 font-sans">
          <button
            type="button"
            onClick={() => setShowAssistant(!showAssistant)}
            disabled={isLoading}
            className="w-full flex justify-between items-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 py-1 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              ✨ Asistente de Enriquecimiento (Recomendado)
              <span className="bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-[9px] px-1.5 py-0.5 rounded">
                IA inteligente
              </span>
            </span>
            <span>{showAssistant ? "Ocultar ▲" : "Mostrar ▼"}</span>
          </button>

          {showAssistant && (
            <div className="flex flex-col gap-4 mt-4 bg-slate-50 dark:bg-zinc-950/50 rounded-xl p-4 border border-slate-200/50 dark:border-zinc-800/60 animate-fade-in">
              <p className="text-xs text-slate-500 leading-relaxed">
                Si respondes estas preguntas opcionales, la IA creará historias de usuario y módulos mucho más adaptados a tu negocio.
              </p>

              {ENRICHMENT_QUESTIONS.map((q) => (
                <div key={q.id} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      {q.question}
                    </label>
                    <span
                      className="cursor-help text-xs text-slate-400 hover:text-slate-600"
                      title={q.tooltip}
                    >
                      ❓
                    </span>
                  </div>
                  <textarea
                    id={`${q.id}-input`}
                    value={answers[q.id as keyof typeof answers]}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    placeholder={q.placeholder}
                    disabled={isLoading}
                    className="w-full bg-white border border-slate-200 dark:bg-zinc-800 dark:border-zinc-700/60 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-1 focus:ring-violet-500 transition-all min-h-[60px] font-medium text-slate-900 dark:text-white"
                    maxLength={300}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Launch CTA */}
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button
              type="button"
              className="w-full font-bold text-white rounded-xl py-3.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <span>🔑</span>
              <span>Inicia Sesión para Generar</span>
            </button>
          </SignInButton>
        </Show>
        <Show when="signed-in">
          <button
            onClick={() => startGeneration(false)}
            disabled={isLoading}
            className={`w-full font-bold text-white rounded-xl py-3.5 px-4 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer ${
              isLoading
                ? "bg-slate-300 cursor-not-allowed dark:bg-zinc-800 dark:text-slate-500"
                : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 active:scale-[0.99]"
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Generando Especificación...</span>
              </>
            ) : (
              <>
                <span>⚡</span>
                <span>Generar Especificación Técnica</span>
              </>
            )}
          </button>
        </Show>
      </div>

      {/* Local Borradores / History Card */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs p-5 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span className="flex items-center gap-2">💾 Borradores Guardados</span>
            <span className="text-[10px] text-slate-400">LocalStorage local</span>
          </h3>
          <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => loadSavedSpec(item)}
                className="flex justify-between items-center p-3 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 hover:bg-slate-50 dark:bg-zinc-950/40 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.projectName}
                    </p>
                    <span className="text-[9px] font-bold text-violet-600 bg-violet-50 dark:bg-violet-950 px-1 py-0.2 rounded">
                      V{item.version}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.idea}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">{item.createdAt}</p>
                </div>
                <button
                  onClick={(e) => deleteSavedSpec(item.id, e)}
                  className="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Eliminar borrador"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
