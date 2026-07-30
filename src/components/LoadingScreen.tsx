import React from "react";

interface LoadingScreenProps {
  loadingStage: string;
  progress: number;
}

export default function LoadingScreen({ loadingStage, progress }: LoadingScreenProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs p-10 flex flex-col items-center justify-center min-h-[450px] text-center gap-6 animate-pulse">
      <div className="relative flex items-center justify-center">
        {/* Large outer pulsing circle */}
        <span className="animate-ping absolute inline-flex h-20 w-20 rounded-full bg-violet-400 opacity-25 dark:bg-violet-500"></span>
        <div className="h-16 w-16 rounded-full border-4 border-violet-500 border-t-transparent animate-spin"></div>
        <span className="absolute text-2xl">⚡</span>
      </div>

      <div className="space-y-2 max-w-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Construyendo tu Ficha Técnica
        </h3>
        <p className="text-sm font-bold text-violet-600 dark:text-violet-400 h-6">
          {loadingStage}
        </p>
        <p className="text-xs text-slate-400 leading-relaxed">
          Nuestra Inteligencia Artificial está traduciendo tus necesidades al lenguaje que los programadores adoran.
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs bg-slate-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span className="text-xs font-bold text-slate-400">
        {progress}% completado
      </span>
    </div>
  );
}
