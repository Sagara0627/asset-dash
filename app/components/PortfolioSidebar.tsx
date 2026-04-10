"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Portfolio, totalAssets } from "@/app/lib/store";

interface PortfolioSidebarProps {
  portfolios: Portfolio[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: (name: string) => void;
  onDelete: (id: string) => void;
}

export function PortfolioSidebar({
  portfolios,
  activeId,
  onSelect,
  onAdd,
  onDelete,
}: PortfolioSidebarProps) {
  const [open, setOpen]   = useState(false);
  const [newName, setNewName] = useState("");
  const [adding, setAdding]   = useState(false);

  function handleAdd() {
    if (!newName.trim()) return;
    onAdd(newName.trim());
    setNewName("");
    setAdding(false);
  }

  const active = portfolios.find((p) => p.id === activeId);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 glass rounded-full text-sm text-white/80 hover:text-white transition-colors"
      >
        <span className="max-w-[120px] truncate">{active?.name ?? "選択"}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-50">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 glass flex flex-col"
              style={{ borderRight: "1px solid rgba(255,255,255,0.1)", borderLeft: "none", borderTop: "none", borderBottom: "none", borderRadius: "0 24px 24px 0" }}
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white font-semibold text-base">ポートフォリオ</h2>
                  <button onClick={() => setOpen(false)} className="text-[var(--text-muted)] hover:text-white transition-colors text-lg">✕</button>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto">
                  {portfolios.map((p) => {
                    const total = totalAssets(p);
                    const isActive = p.id === activeId;
                    return (
                      <motion.button
                        key={p.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { onSelect(p.id); setOpen(false); }}
                        className="w-full text-left px-4 py-3 rounded-xl transition-all"
                        style={{
                          background: isActive ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${isActive ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.06)"}`,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white truncate pr-2">{p.name}</span>
                          {portfolios.length > 1 && !isActive && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onDelete(p.id); }}
                              className="text-[var(--text-muted)] hover:text-red-400 transition-colors text-xs"
                            >
                              削除
                            </button>
                          )}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] mt-0.5 tabular-nums">
                          ¥{total.toLocaleString("ja-JP")}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Add portfolio */}
                <div className="mt-4 pt-4 border-t border-white/5">
                  {adding ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                        placeholder="ポートフォリオ名"
                        autoFocus
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                      />
                      <div className="flex gap-2">
                        <button onClick={handleAdd} className="flex-1 py-2 rounded-xl text-xs font-medium text-white" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                          作成
                        </button>
                        <button onClick={() => setAdding(false)} className="flex-1 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] bg-white/5">
                          キャンセル
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAdding(true)}
                      className="w-full py-2.5 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-white border border-white/8 hover:border-white/15 transition-all flex items-center justify-center gap-2"
                    >
                      <span className="text-base leading-none">+</span>
                      新しいポートフォリオ
                    </button>
                  )}
                </div>

                <p className="mt-4 text-[10px] text-[var(--text-muted)] text-center leading-relaxed">
                  複数ポートフォリオ管理は<br/>
                  <span className="text-[var(--accent-blue)]">Proプラン</span>で利用できます
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
