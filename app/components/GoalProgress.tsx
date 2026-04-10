"use client";

import { motion } from "framer-motion";
import { CountUp } from "./CountUp";

interface GoalProgressProps {
  progress: number;   // 0-100
  total: number;
  goal: number;
  onGoalChange: (val: number) => void;
}

const MILESTONES = [25, 50, 75, 100];

export function GoalProgress({ progress, total, goal, onGoalChange }: GoalProgressProps) {
  const remaining = Math.max(0, goal - total);
  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-widest mb-0.5">
            FIRE 達成率
          </div>
          <div className="flex items-baseline gap-2">
            <CountUp
              target={safeProgress}
              duration={1200}
              suffix="%"
              decimals={1}
              className="text-3xl font-bold text-white tabular-nums"
            />
            {safeProgress >= 100 && (
              <span className="text-emerald-400 text-sm font-semibold">達成!</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[var(--text-secondary)] text-xs mb-0.5">目標額</div>
          <div className="text-sm font-semibold text-white">
            ¥{goal.toLocaleString("ja-JP")}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
        {/* Milestone ticks */}
        {MILESTONES.map((m) => (
          <div
            key={m}
            className="absolute top-0 bottom-0 w-px bg-white/10"
            style={{ left: `${m}%` }}
          />
        ))}
        {/* Fill */}
        <motion.div
          className="h-full rounded-full"
          style={{
            background: safeProgress >= 100
              ? "linear-gradient(90deg, #10b981, #34d399)"
              : safeProgress >= 75
              ? "linear-gradient(90deg, #3b82f6, #8b5cf6)"
              : "linear-gradient(90deg, #3b82f6, #60a5fa)",
            boxShadow: safeProgress >= 100
              ? "0 0 12px rgba(16,185,129,0.5)"
              : "0 0 12px rgba(59,130,246,0.4)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${safeProgress}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        {/* Glow dot */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white/80"
          style={{
            background: safeProgress >= 100 ? "#10b981" : "#3b82f6",
            boxShadow: safeProgress >= 100
              ? "0 0 10px rgba(16,185,129,0.8)"
              : "0 0 10px rgba(59,130,246,0.8)",
            marginLeft: -8,
          }}
          initial={{ left: 0 }}
          animate={{ left: `${Math.min(safeProgress, 99)}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>

      {/* Milestone labels */}
      <div className="flex justify-between px-0">
        <span className="text-[10px] text-[var(--text-muted)]">0%</span>
        {MILESTONES.map((m) => (
          <span
            key={m}
            className="text-[10px]"
            style={{
              color: safeProgress >= m ? "rgba(255,255,255,0.4)" : "var(--text-muted)",
            }}
          >
            {m}%
          </span>
        ))}
      </div>

      {/* Remaining */}
      {safeProgress < 100 && (
        <div className="pt-1 border-t border-white/5 flex items-center justify-between">
          <span className="text-[var(--text-secondary)] text-xs">あと</span>
          <span className="text-white font-semibold text-sm tabular-nums">
            ¥{remaining.toLocaleString("ja-JP")}
          </span>
        </div>
      )}

      {/* Goal input */}
      <div className="pt-1 border-t border-white/5">
        <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest block mb-1.5">
          目標額を変更
        </label>
        <div className="flex items-center gap-2">
          <span className="text-[var(--text-secondary)] text-sm">¥</span>
          <input
            type="text"
            inputMode="numeric"
            value={goal.toLocaleString("ja-JP")}
            onChange={(e) => {
              const raw = e.target.value.replace(/[,，\s]/g, "");
              const num = Number(raw);
              if (!isNaN(num)) onGoalChange(num);
            }}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[var(--accent-blue)] transition-colors tabular-nums"
          />
        </div>
      </div>
    </div>
  );
}
