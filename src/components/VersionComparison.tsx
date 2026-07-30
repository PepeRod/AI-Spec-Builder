import React, { useState, useEffect } from "react";
import { SavedSpec } from "./InputForm";

interface VersionComparisonProps {
  history: SavedSpec[];
  currentSpecId?: string;
}

export default function VersionComparison({ history, currentSpecId }: VersionComparisonProps) {
  const [specAId, setSpecAId] = useState<string>("");
  const [specBId, setSpecBId] = useState<string>("");

  useEffect(() => {
    if (history.length > 0) {
      const currentSpec = currentSpecId ? history.find(h => h.id === currentSpecId) : history[0];
      const activeSpec = currentSpec || history[0];
      setSpecAId(activeSpec.id);

      const sameProjectSpecs = history.filter(
        h => h.projectName.toLowerCase() === activeSpec.projectName.toLowerCase() && h.id !== activeSpec.id
      );

      if (sameProjectSpecs.length > 0) {
        setSpecBId(sameProjectSpecs[0].id);
      } else if (history.length > 1) {
        const fallbackSpec = history.find(h => h.id !== activeSpec.id);
        if (fallbackSpec) setSpecBId(fallbackSpec.id);
      }
    }
  }, [history, currentSpecId]);

  const specA = history.find(h => h.id === specAId);
  const specB = history.find(h => h.id === specBId);

  if (history.length < 2) {
    return (
      <div className="text-center py-12 px-4 space-y-3 font-sans">
        <span className="text-4xl">🔄</span>
        <h3 className="text-base font-bold text-slate-800 dark:text-white">
          Se necesitan al menos 2 borradores para comparar
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Genera una nueva versión de tu proyecto para ver cómo evoluciona la especificación.
        </p>
      </div>
    );
  }

  const cleanStr = (s: string) => s.trim().toLowerCase();

  const renderStringDiff = (label: string, a?: string, b?: string) => {
    const valA = a || "No definido";
    const valB = b || "No definido";
    const changed = cleanStr(valA) !== cleanStr(valB);

    return (
      <div className="p-4 border border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50/50 dark:bg-zinc-950/20 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            {label} - V{specA?.version}
          </span>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{valA}</p>
        </div>
        <div className={`rounded-lg p-2 transition-colors ${changed ? "bg-emerald-50/70 border border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900/50" : ""}`}>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center justify-between">
            <span>{label} - V{specB?.version}</span>
            {changed && (
              <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                Cambiado
              </span>
            )}
          </span>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{valB}</p>
        </div>
      </div>
    );
  };

  const renderArrayDiff = (label: string, itemsA: string[] = [], itemsB: string[] = []) => {
    const added = itemsB.filter(b => !itemsA.some(a => cleanStr(a) === cleanStr(b)));
    const removed = itemsA.filter(a => !itemsB.some(b => cleanStr(b) === cleanStr(a)));

    return (
      <div className="space-y-3">
        {(added.length > 0 || removed.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
                <span>❌</span> Eliminados en V{specB?.version}
              </h5>
              {removed.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Ninguno eliminado.</p>
              ) : (
                removed.map((item, idx) => (
                  <div key={idx} className="p-3 border border-rose-200 bg-rose-50/40 dark:border-rose-950/40 dark:bg-rose-950/15 rounded-lg">
                    <p className="text-[11px] text-rose-700 dark:text-rose-400 leading-relaxed">{item}</p>
                  </div>
                ))
              )}
            </div>
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
                <span>➕</span> Añadidos en V{specB?.version}
              </h5>
              {added.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Ninguno añadido.</p>
              ) : (
                added.map((item, idx) => (
                  <div key={idx} className="p-3 border border-emerald-200 bg-emerald-50/40 dark:border-emerald-950/40 dark:bg-emerald-950/15 rounded-lg">
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed">{item}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {added.length === 0 && removed.length === 0 && (
          <p className="text-xs text-slate-400 italic">Sin cambios.</p>
        )}
      </div>
    );
  };

  const featuresA = specA?.spec?.features || [];
  const featuresB = specB?.spec?.features || [];
  const flowsA: any[] = specA?.spec?.flows || [];
  const flowsB: any[] = specB?.spec?.flows || [];

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-slate-50 dark:bg-zinc-950 p-4 border border-slate-200 dark:border-zinc-800 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase text-slate-500">Versión Base (A)</label>
          <select
            value={specAId}
            onChange={(e) => setSpecAId(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs font-semibold"
          >
            {history.map((h) => (
              <option key={h.id} value={h.id}>
                {h.projectName} (V{h.version}) - {h.createdAt}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase text-slate-500">Versión de Comparación (B)</label>
          <select
            value={specBId}
            onChange={(e) => setSpecBId(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs font-semibold"
          >
            {history.map((h) => (
              <option key={h.id} value={h.id}>
                {h.projectName} (V{h.version}) - {h.createdAt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {specA && specB && (
        <div className="space-y-6">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800/80 pb-2">
            Visión
          </h4>
          {renderStringDiff("Visión", specA.spec?.vision, specB.spec?.vision)}

          <h4 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800/80 pb-2">
            Usuarios
          </h4>
          {renderStringDiff("Usuarios", specA.spec?.users, specB.spec?.users)}

          <h4 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800/80 pb-2">
            Funcionalidades
          </h4>
          {renderArrayDiff("Funcionalidades", featuresA, featuresB)}

          <h4 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800/80 pb-2">
            Flujos
          </h4>
          {(() => {
            const addedFlows = flowsB.filter((fb: any) => !flowsA.some((fa: any) => cleanStr(fa.name) === cleanStr(fb.name)));
            const removedFlows = flowsA.filter((fa: any) => !flowsB.some((fb: any) => cleanStr(fb.name) === cleanStr(fa.name)));
            const commonFlows = flowsB.filter((fb: any) => flowsA.some((fa: any) => cleanStr(fa.name) === cleanStr(fb.name)));
            return (
              <div className="space-y-3">
                {(addedFlows.length > 0 || removedFlows.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
                        <span>❌</span> Eliminados en V{specB?.version}
                      </h5>
                      {removedFlows.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">Ninguno eliminado.</p>
                      ) : (
                        removedFlows.map((f: any, idx: number) => (
                          <div key={idx} className="p-3 border border-rose-200 bg-rose-50/40 dark:border-rose-950/40 dark:bg-rose-950/15 rounded-lg">
                            <p className="text-[11px] font-bold text-rose-700 dark:text-rose-400">{f.name}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
                        <span>➕</span> Añadidos en V{specB?.version}
                      </h5>
                      {addedFlows.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">Ninguno añadido.</p>
                      ) : (
                        addedFlows.map((f: any, idx: number) => (
                          <div key={idx} className="p-3 border border-emerald-200 bg-emerald-50/40 dark:border-emerald-950/40 dark:bg-emerald-950/15 rounded-lg">
                            <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">{f.name}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
                {commonFlows.map((fB: any, idx: number) => {
                  const fA = flowsA.find((f: any) => cleanStr(f.name) === cleanStr(fB.name));
                  const addedSteps = fB.steps?.filter((s: string) => !fA?.steps?.some((sa: string) => cleanStr(sa) === cleanStr(s))) || [];
                  const removedSteps = fA?.steps?.filter((s: string) => !fB.steps?.some((sb: string) => cleanStr(sb) === cleanStr(s))) || [];
                  const errorChanged = cleanStr(fA?.error_path || "") !== cleanStr(fB?.error_path || "");
                  if (addedSteps.length === 0 && removedSteps.length === 0 && !errorChanged) return null;
                  return (
                    <div key={idx} className="p-4 border border-slate-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/40">
                      <h6 className="text-xs font-bold text-slate-800 dark:text-white mb-2">{fB.name}</h6>
                      {addedSteps.map((s: string, sidx: number) => (
                        <div key={sidx} className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/15 p-1.5 rounded border border-emerald-100/50 dark:border-emerald-950/30 flex items-start gap-1 mb-1">
                          <span className="text-emerald-500 font-bold">➕</span> {s}
                        </div>
                      ))}
                      {removedSteps.map((s: string, sidx: number) => (
                        <div key={sidx} className="text-xs text-rose-700 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/15 p-1.5 rounded border border-rose-100/50 dark:border-rose-950/30 flex items-start gap-1 mb-1 opacity-80 line-through">
                          <span className="text-rose-500 font-bold">➖</span> {s}
                        </div>
                      ))}
                      {errorChanged && (
                        <div className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50/60 dark:bg-amber-950/15 p-1.5 rounded border border-amber-100/50 dark:border-amber-950/30 flex items-start gap-1 mt-1">
                          <span className="text-amber-500 font-bold">⚠️</span> Error path cambiado: "{fB.error_path}"
                        </div>
                      )}
                    </div>
                  );
                })}
                {addedFlows.length === 0 && removedFlows.length === 0 && commonFlows.every((fB: any) => {
                  const fA = flowsA.find((f: any) => cleanStr(f.name) === cleanStr(fB.name));
                  const stepsEqual = (fB.steps || []).every((s: string) => fA?.steps?.some((sa: string) => cleanStr(sa) === cleanStr(s)));
                  return stepsEqual && cleanStr(fA?.error_path || "") === cleanStr(fB?.error_path || "");
                }) && (
                  <p className="text-xs text-slate-400 italic">Sin cambios en los flujos.</p>
                )}
              </div>
            );
          })()}

          <h4 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800/80 pb-2">
            Arquitectura
          </h4>
          {renderStringDiff("Arquitectura", specA.spec?.architecture, specB.spec?.architecture)}

          <h4 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800/80 pb-2">
            Requisitos
          </h4>
          {renderStringDiff("Requisitos", specA.spec?.requirements, specB.spec?.requirements)}
        </div>
      )}
    </div>
  );
}
