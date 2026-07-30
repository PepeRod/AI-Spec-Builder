import React from "react";

interface SpecTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasHistory: boolean;
}

export default function SpecTabs({
  activeTab,
  setActiveTab,
  hasHistory,
}: SpecTabsProps) {
  return (
    <div className="flex border-b border-slate-200 dark:border-zinc-800 overflow-x-auto no-print">
      <button
        onClick={() => setActiveTab("vision")}
        className={`px-5 py-3.5 text-xs font-bold shrink-0 border-b-2 transition-all ${
          activeTab === "vision"
            ? "border-violet-600 text-violet-600 dark:border-violet-500 dark:text-violet-400"
            : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
        }`}
      >
        Visión & Usuarios
      </button>
      <button
        onClick={() => setActiveTab("features")}
        className={`px-5 py-3.5 text-xs font-bold shrink-0 border-b-2 transition-all ${
          activeTab === "features"
            ? "border-violet-600 text-violet-600 dark:border-violet-500 dark:text-violet-400"
            : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
        }`}
      >
        Funcionalidades
      </button>
      <button
        onClick={() => setActiveTab("flows")}
        className={`px-5 py-3.5 text-xs font-bold shrink-0 border-b-2 transition-all ${
          activeTab === "flows"
            ? "border-violet-600 text-violet-600 dark:border-violet-500 dark:text-violet-400"
            : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
        }`}
      >
        Flujos
      </button>
      <button
        onClick={() => setActiveTab("architecture")}
        className={`px-5 py-3.5 text-xs font-bold shrink-0 border-b-2 transition-all ${
          activeTab === "architecture"
            ? "border-violet-600 text-violet-600 dark:border-violet-500 dark:text-violet-400"
            : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
        }`}
      >
        Arquitectura
      </button>
      <button
        onClick={() => setActiveTab("requirements")}
        className={`px-5 py-3.5 text-xs font-bold shrink-0 border-b-2 transition-all ${
          activeTab === "requirements"
            ? "border-violet-600 text-violet-600 dark:border-violet-500 dark:text-violet-400"
            : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
        }`}
      >
        Requisitos
      </button>
      {hasHistory && (
        <button
          onClick={() => setActiveTab("compare")}
          className={`px-5 py-3.5 text-xs font-bold shrink-0 border-b-2 transition-all ${
            activeTab === "compare"
              ? "border-violet-600 text-violet-600 dark:border-violet-500 dark:text-violet-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
          }`}
        >
          Comparar Versiones
        </button>
      )}
      <button
        onClick={() => setActiveTab("markdown")}
        className={`px-5 py-3.5 text-xs font-bold shrink-0 border-b-2 transition-all ${
          activeTab === "markdown"
            ? "border-violet-600 text-violet-600 dark:border-violet-500 dark:text-violet-400"
            : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
        }`}
      >
        Raw Markdown
      </button>
    </div>
  );
}
