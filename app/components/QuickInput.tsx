"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORY_META, AssetCategory, AssetEntry } from "@/app/lib/store";

interface QuickInputProps {
  onAdd: (entry: Omit<AssetEntry, "id">) => void;
}

const CATEGORIES = Object.entries(CATEGORY_META) as [AssetCategory, typeof CATEGORY_META[AssetCategory]][];

export function QuickInput({ onAdd }: QuickInputProps) {
  const [open, setOpen]         = useState(false);
  const [category, setCategory] = useState<AssetCategory>("cash");
  const [label, setLabel]       = useState("");
  const [amount, setAmount]     = useState("");
  const [error, setError]       = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = Number(amount.replace(/[,，]/g, ""));
    if (isNaN(num) || num <= 0) {
      setError("正しい金額を入力してください");
      return;
    }
    onAdd({
      category,
      label: label.trim() || CATEGORY_META[category].label,
      amount: num,
    });
    setLabel("");
    setAmount("");
    setError("");
    setOpen(false);
  }

  const meta = CATEGORY_META[category];

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center text-2xl font-light text-white shadow-xl"
        style={{
          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          boxShadow: "0 8px 32px rgba(59,130,246,0.45), 0 2px 8px rgba(0,0,0,0.4)",
        }}
        aria-label="資産を追加"
      >
        +
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto"
            >
              <div
                className="glass rounded-t-3xl p-6 pb-10"
                style={{ borderBottom: "none" }}
              >
                {/* Handle */}
                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />

                <h2 className="text-white font-semibold text-lg mb-5">資産を追加</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Category picker */}
                  <div>
                    <label className="text-[var(--text-secondary)] text-xs uppercase tracking-widest block mb-2">
                      カテゴリ
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {CATEGORIES.map(([key, m]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setCategory(key)}
                          className="rounded-xl py-2 px-1 text-xs font-medium transition-all"
                          style={{
                            background: category === key ? `${m.color}30` : "rgba(255,255,255,0.04)",
                            border: `1px solid ${category === key ? m.color : "rgba(255,255,255,0.08)"}`,
                            color: category === key ? m.color : "var(--text-secondary)",
                          }}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Label */}
                  <div>
                    <label className="text-[var(--text-secondary)] text-xs uppercase tracking-widest block mb-2">
                      名前（任意）
                    </label>
                    <input
                      type="text"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      placeholder={meta.label}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[var(--accent-blue)] transition-colors text-sm"
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="text-[var(--text-secondary)] text-xs uppercase tracking-widest block mb-2">
                      金額（円）
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">¥</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => { setAmount(e.target.value); setError(""); }}
                        placeholder="1,000,000"
                        min={0}
                        step={10000}
                        autoFocus
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[var(--accent-blue)] transition-colors text-sm"
                      />
                    </div>
                    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3.5 rounded-xl font-semibold text-white text-sm"
                    style={{
                      background: `linear-gradient(135deg, ${meta.color}, ${meta.gradient[1]})`,
                      boxShadow: `0 4px 20px ${meta.color}50`,
                    }}
                  >
                    追加する
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
