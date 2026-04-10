"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { nanoid } from "nanoid";
import {
  Portfolio, AssetEntry,
  loadPortfolios, savePortfolios,
  loadActiveId, saveActiveId,
  totalAssets, fireProgress,
  DEFAULT_PORTFOLIO,
} from "@/app/lib/store";
import { CountUp }         from "./CountUp";
import { DonutChart }      from "./DonutChart";
import { AssetLegend }     from "./AssetLegend";
import { GoalProgress }    from "./GoalProgress";
import { QuickInput }      from "./QuickInput";
import { PortfolioSidebar } from "./PortfolioSidebar";
import { DashboardSkeleton } from "./SkeletonLoader";
import { ParticleField }    from "./ParticleField";

type PeriodKey = "daily" | "monthly" | "all";

const PERIOD_OPTIONS: { value: PeriodKey; label: string }[] = [
  { value: "daily",   label: "前日比" },
  { value: "monthly", label: "今月" },
  { value: "all",     label: "全期間" },
];

// Simulated period multipliers for demo
const PERIOD_DELTA: Record<PeriodKey, { pct: number; abs: number }> = {
  daily:   { pct: +0.34,  abs: +42_380  },
  monthly: { pct: +2.18,  abs: +267_000 },
  all:     { pct: +23.4,  abs: +2_450_000 },
};

export function Dashboard() {
  const [mounted, setMounted]       = useState(false);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([DEFAULT_PORTFOLIO]);
  const [activeId, setActiveId]     = useState<string>("default");
  const [period, setPeriod]         = useState<PeriodKey>("daily");

  // Hydrate from localStorage
  useEffect(() => {
    const ps = loadPortfolios();
    const aid = loadActiveId();
    setPortfolios(ps);
    setActiveId(ps.find((p) => p.id === aid) ? aid : ps[0].id);
    setMounted(true);
  }, []);

  const persist = useCallback((ps: Portfolio[], aid?: string) => {
    setPortfolios(ps);
    savePortfolios(ps);
    if (aid !== undefined) {
      setActiveId(aid);
      saveActiveId(aid);
    }
  }, []);

  const portfolio = portfolios.find((p) => p.id === activeId) ?? portfolios[0];
  const total = totalAssets(portfolio);
  const progress = fireProgress(portfolio);
  const delta = PERIOD_DELTA[period];

  function addAsset(entry: Omit<AssetEntry, "id">) {
    const updated = portfolios.map((p) =>
      p.id === activeId
        ? { ...p, assets: [...p.assets, { ...entry, id: nanoid(8) }] }
        : p
    );
    persist(updated);
  }

  function removeAsset(id: string) {
    const updated = portfolios.map((p) =>
      p.id === activeId
        ? { ...p, assets: p.assets.filter((a) => a.id !== id) }
        : p
    );
    persist(updated);
  }

  function updateGoal(goal: number) {
    const updated = portfolios.map((p) =>
      p.id === activeId ? { ...p, fireGoal: goal } : p
    );
    persist(updated);
  }

  function addPortfolio(name: string) {
    const newP: Portfolio = {
      id: nanoid(8),
      name,
      assets: [],
      fireGoal: 30_000_000,
      createdAt: Date.now(),
    };
    const updated = [...portfolios, newP];
    persist(updated, newP.id);
  }

  function deletePortfolio(id: string) {
    if (portfolios.length <= 1) return;
    const updated = portfolios.filter((p) => p.id !== id);
    persist(updated, updated[0].id);
  }

  if (!mounted) return <DashboardSkeleton />;

  return (
    <div className="relative min-h-screen flex flex-col">
      <ParticleField />
      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-7 pb-2">
        <div className="flex items-center gap-3">
          <PortfolioSidebar
            portfolios={portfolios}
            activeId={activeId}
            onSelect={(id) => { setActiveId(id); saveActiveId(id); }}
            onAdd={addPortfolio}
            onDelete={deletePortfolio}
          />
        </div>

        {/* Period segment control */}
        <div className="segment-control flex items-center">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={`segment-btn relative ${period === opt.value ? "active" : ""}`}
            >
              {period === opt.value && (
                <motion.div
                  layoutId="period-pill"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.10)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{opt.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="relative z-10 flex-1 px-4 pb-28 mt-3 max-w-lg mx-auto w-full space-y-4">

        {/* ── Total card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl px-6 py-5"
        >
          <div className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-widest mb-1">
            総資産
          </div>
          <div className="flex items-end gap-3 flex-wrap">
            <CountUp
              target={total}
              duration={1400}
              prefix="¥"
              className="text-4xl font-bold text-white tabular-nums leading-none"
            />
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={period}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5"
              >
                <span
                  className="text-sm font-semibold tabular-nums"
                  style={{ color: delta.pct >= 0 ? "#10b981" : "#f43f5e" }}
                >
                  {delta.pct >= 0 ? "▲" : "▼"}{Math.abs(delta.pct).toFixed(2)}%
                </span>
                <span className="text-xs text-[var(--text-secondary)] tabular-nums">
                  ({delta.abs >= 0 ? "+" : ""}¥{delta.abs.toLocaleString("ja-JP")})
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Donut chart ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="glass rounded-2xl"
          style={{ height: 320 }}
        >
          {portfolio.assets.length > 0 ? (
            <DonutChart assets={portfolio.assets} total={total} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] gap-2 p-8">
              <div className="w-24 h-24 rounded-full border-[12px] border-white/5 flex items-center justify-center text-3xl">
                +
              </div>
              <p className="text-sm text-center">右下の ＋ ボタンから<br/>資産を追加してください</p>
            </div>
          )}
        </motion.div>

        {/* ── Legend ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
        >
          <AssetLegend
            assets={portfolio.assets}
            total={total}
            onRemove={removeAsset}
          />
        </motion.div>

        {/* ── FIRE progress ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
        >
          <GoalProgress
            progress={progress}
            total={total}
            goal={portfolio.fireGoal}
            onGoalChange={updateGoal}
          />
        </motion.div>

        {/* ── Pro upsell banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32 }}
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.12) 100%)",
            border: "1px solid rgba(139,92,246,0.25)",
          }}
        >
          {/* Glow */}
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #8b5cf6, transparent)", transform: "translate(40%, -40%)" }}
          />
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-white font-semibold text-sm mb-1">Proプランにアップグレード</div>
                <div className="text-[var(--text-secondary)] text-xs leading-relaxed">
                  複数ポートフォリオ、家族の資産管理、<br/>CSVエクスポートが利用可能になります
                </div>
              </div>
              <button
                className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold text-white whitespace-nowrap"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
                }}
              >
                月額 ¥490
              </button>
            </div>
          </div>
        </motion.div>

      </main>

      {/* ── FAB ── */}
      <QuickInput onAdd={addAsset} />
    </div>
  );
}
