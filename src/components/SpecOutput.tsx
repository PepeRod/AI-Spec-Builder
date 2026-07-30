import React, { useState } from "react";
import { ProductSpec } from "@/lib/ai";
import { SavedSpec } from "./InputForm";
import SpecTabs from "./SpecTabs";
import VersionComparison from "./VersionComparison";

interface SpecOutputProps {
  spec: ProductSpec | null;
  markdown: string;
  projectName: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  history: SavedSpec[];
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export default function SpecOutput({
  spec,
  markdown,
  projectName,
  activeTab,
  setActiveTab,
  history,
  showToast,
}: SpecOutputProps) {
  const [isCopyHighlighted, setIsCopyHighlighted] = useState(false);

  if (!spec) return null;

  const triggerCopyHighlight = () => {
    setIsCopyHighlighted(true);
    setTimeout(() => setIsCopyHighlighted(false), 5000);
  };

  const handleCopyClipboard = (text: string, typeName: string) => {
    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard API no disponible");
      }
      navigator.clipboard.writeText(text);
      showToast(`¡${typeName} copiado al portapapeles!`, "success");
    } catch (e) {
      console.error(e);
      showToast("Fallo al copiar automáticamente. Por favor cópialo manualmente.", "error");
      triggerCopyHighlight();
    }
  };

  const handleDownloadMarkdown = () => {
    try {
      const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `especificacion-${projectName.toLowerCase().replace(/\s+/g, "-")}-v${(history.find(h => h.projectName === projectName)?.version || "1")}.md`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("Documento Markdown descargado.", "success");
    } catch (e) {
      console.error(e);
      showToast("La descarga falló. Copia el contenido mediante el botón resaltado.", "error");
      triggerCopyHighlight();
    }
  };

  const handlePrintPDF = () => {
    try {
      window.print();
    } catch (e) {
      console.error(e);
      showToast("Fallo al iniciar impresión. Copia el contenido mediante el botón resaltado.", "error");
      triggerCopyHighlight();
    }
  };

  const handleGenerateShareableLink = () => {
    try {
      const data = JSON.stringify({ spec, markdown });
      const bytes = new TextEncoder().encode(data);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);
      const encoded = encodeURIComponent(base64);

      const shareUrl = `${window.location.origin}${window.location.pathname}#share=${encoded}`;

      navigator.clipboard.writeText(shareUrl);
      showToast("¡Enlace web compartible copiado al portapapeles!", "success");
    } catch (e) {
      console.error(e);
      showToast("No se pudo generar el enlace. Copia el contenido mediante el botón resaltado.", "error");
      triggerCopyHighlight();
    }
  };

  const activeSavedSpec = history.find(
    (h) => h.projectName.toLowerCase() === projectName.toLowerCase()
  );

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs flex flex-col flex-1 overflow-hidden print-full">
      <div className="bg-slate-50 dark:bg-zinc-900/60 p-6 border-b border-slate-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-violet-600 bg-violet-50 dark:bg-violet-950 dark:text-violet-400 px-2.5 py-1 rounded-full">
              Especificación Técnica de Producto
            </span>
            <span className="text-xs text-slate-400">
              V{activeSavedSpec?.version || 1} • Listo para desarrollador
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5 leading-tight truncate">
            {projectName}
          </h2>
        </div>

        <div className="flex gap-2 shrink-0 no-print flex-wrap">
          <button
            onClick={handleGenerateShareableLink}
            className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 hover:bg-slate-50 border border-slate-200 dark:border-zinc-700 py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs cursor-pointer"
            title="Generar y copiar enlace web compartible"
          >
            <span>🔗</span> Enlace
          </button>
          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 hover:bg-slate-50 border border-slate-200 dark:border-zinc-700 py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs cursor-pointer"
            title="Descargar archivo Markdown (.md)"
          >
            <span>⬇️</span> Descargar .MD
          </button>
          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 hover:bg-slate-50 border border-slate-200 dark:border-zinc-700 py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs cursor-pointer"
            title="Imprimir o Guardar como PDF"
          >
            <span>🖨️</span> PDF
          </button>
          <button
            onClick={() => handleCopyClipboard(markdown, "Especificación en Markdown")}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold shadow-2xs cursor-pointer transition-all duration-300 ${
              isCopyHighlighted
                ? "bg-amber-500 hover:bg-amber-600 text-white ring-4 ring-amber-400/70 scale-105 animate-pulse"
                : "bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-black dark:hover:bg-slate-200"
            }`}
            title="Copiar contenido de Markdown al Portapapeles"
          >
            <span>📋</span> Copiar Todo
          </button>
        </div>
      </div>

      <SpecTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasHistory={history.length > 0}
      />

      <div className="p-6 overflow-y-auto max-h-[600px] flex-1 text-slate-700 dark:text-slate-300 leading-relaxed print-full">
        <div className="hidden print:block mb-8">
          <h1 className="text-3xl font-bold">{projectName}</h1>
          <p className="text-slate-600 italic mt-2">{spec.vision}</p>
        </div>

        {/* TAB 1: Vision & Users */}
        {(activeTab === "vision" || typeof window === "undefined") && (
          <div className="space-y-6 print-full">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 no-print">
                Visión de Producto
              </h3>
              <p className="text-base text-slate-900 dark:text-white font-medium bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-100 dark:border-zinc-800/80 leading-relaxed italic">
                "{spec.vision}"
              </p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 no-print">
                Usuarios
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-100 dark:border-zinc-800/80 leading-relaxed">
                {spec.users}
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: Features */}
        {(activeTab === "features" || typeof window === "undefined") && (
          <div className="space-y-4 print-full print-page-break">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800/80 pb-2 mb-2">
              Funcionalidades
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed no-print">
              Capacidades principales del producto para el MVP.
            </p>
            <div className="space-y-2">
              {spec.features?.map((f, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 border border-slate-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/40 shadow-2xs"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-0.5">
                    {f}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Flows */}
        {(activeTab === "flows" || typeof window === "undefined") && (
          <div className="space-y-4 print-full print-page-break">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800/80 pb-2 mb-2">
              Flujos de Usuario
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed no-print">
              Secuencias de interacción principales dentro del sistema.
            </p>
            <div className="space-y-4">
              {spec.flows?.map((flow, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-2xs"
                >
                  <div className="bg-slate-50 dark:bg-zinc-900 p-4 border-b border-slate-200 dark:border-zinc-800">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400">🔄</span>
                      {flow.name}
                    </h4>
                  </div>
                  <div className="p-4 bg-white dark:bg-zinc-900/20 space-y-3">
                    <div>
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                        Pasos del Flujo
                      </h5>
                      <ol className="space-y-1.5">
                        {flow.steps?.map((step, sidx) => (
                          <li key={sidx} className="flex items-start gap-2 text-xs leading-relaxed">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold">
                              {sidx + 1}
                            </span>
                            <span className="pt-0.5 text-slate-700 dark:text-slate-300">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div className="bg-rose-50/50 dark:bg-rose-950/15 border border-rose-100 dark:border-rose-950/50 rounded-lg p-3">
                      <p className="text-[10px] font-bold uppercase text-rose-700 dark:text-rose-400">
                        En caso de error
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">
                        {flow.error_path}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Architecture */}
        {(activeTab === "architecture" || typeof window === "undefined") && (
          <div className="space-y-4 print-full print-page-break">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800/80 pb-2 mb-2">
              Arquitectura Tecnológica
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed no-print">
              Stack tecnológico, arquitectura del sistema y decisiones de diseño.
            </p>
            <div className="bg-slate-50 dark:bg-zinc-950 p-5 rounded-xl border border-slate-100 dark:border-zinc-800/80">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {spec.architecture}
              </p>
            </div>
          </div>
        )}

        {/* TAB 5: Requirements */}
        {(activeTab === "requirements" || typeof window === "undefined") && (
          <div className="space-y-4 print-full print-page-break">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800/80 pb-2 mb-2">
              Requisitos del Sistema
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed no-print">
              Requisitos funcionales y no funcionales del producto.
            </p>
            <div className="bg-slate-50 dark:bg-zinc-950 p-5 rounded-xl border border-slate-100 dark:border-zinc-800/80">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {spec.requirements}
              </p>
            </div>
          </div>
        )}

        {/* TAB 6: Version Comparison */}
        {(activeTab === "compare" || typeof window === "undefined") && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800/80 pb-2 mb-2">
              Comparación de Versiones
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compara distintas versiones de tu especificación para ver cómo ha evolucionado.
            </p>
            <VersionComparison
              history={history}
              currentSpecId={activeSavedSpec?.id}
            />
          </div>
        )}

        {/* TAB 7: Complete Raw Markdown Text */}
        {(activeTab === "markdown" || typeof window === "undefined") && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800/80 pb-2 mb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Documento en Markdown (.md)
              </h3>
              <button
                onClick={() => handleCopyClipboard(markdown, "Texto Markdown")}
                className="text-xs font-bold text-violet-600 hover:underline dark:text-violet-400 cursor-pointer"
              >
                Copiar Código
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Este es el formato estándar usado en repositorios de código. Cópialo y pégalo en un archivo README.md para tu equipo de desarrollo.
            </p>

            <pre className="bg-slate-950 text-slate-200 p-5 rounded-xl text-xs font-mono overflow-auto max-h-[400px] border border-zinc-800 leading-relaxed">
              {markdown}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
