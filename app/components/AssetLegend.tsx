"use client";

import { motion } from "framer-motion";
import { CATEGORY_META, AssetEntry } from "@/app/lib/store";

interface AssetLegendProps {
  assets: AssetEntry[];
  total: number;
  onRemove: (id: string) => void;
}

export function AssetLegend({ assets, total, onRemove }: AssetLegendProps) {
  return (
    <div className="glass rounded-2xl p-5 space-y-2">
      <div className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-widest mb-3">
        内訳
      </div>
      {assets.map((asset, i) => {
        const meta = CATEGORY_META[asset.category];
        const pct  = total > 0 ? (asset.amount / total) * 100 : 0;
        return (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="group flex items-center gap-3"
          >
            {/* Color dot */}
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: meta.color, boxShadow: `0 0 6px ${meta.color}80` }}
            />
            {/* Label + bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-sm text-white/80 truncate">{asset.label}</span>
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  <span className="text-xs text-[var(--text-secondary)] tabular-nums">
                    {pct.toFixed(1)}%
                  </span>
                  <span className="text-sm font-semibold text-white tabular-nums">
                    ¥{asset.amount.toLocaleString("ja-JP")}
                  </span>
                  <button
                    onClick={() => onRemove(asset.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-red-400 text-xs"
                    aria-label="削除"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: meta.color, opacity: 0.7 }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
      {assets.length === 0 && (
        <p className="text-[var(--text-muted)] text-sm text-center py-4">
          ＋ ボタンから資産を追加してください
        </p>
      )}
    </div>
  );
}
