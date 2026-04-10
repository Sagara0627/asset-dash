"use client";

export type AssetCategory =
  | "cash"
  | "stock_jp"
  | "stock_us"
  | "fund"
  | "bond"
  | "crypto"
  | "real_estate"
  | "other";

export interface AssetEntry {
  id: string;
  category: AssetCategory;
  label: string;
  amount: number;
}

export interface Portfolio {
  id: string;
  name: string;
  assets: AssetEntry[];
  fireGoal: number; // FIRE target in JPY
  createdAt: number;
}

export const CATEGORY_META: Record<
  AssetCategory,
  { label: string; color: string; gradient: string[] }
> = {
  cash:         { label: "現金・預金",    color: "#3b82f6", gradient: ["#3b82f6", "#60a5fa"] },
  fund:         { label: "投資信託",      color: "#8b5cf6", gradient: ["#8b5cf6", "#a78bfa"] },
  stock_jp:     { label: "国内株",        color: "#10b981", gradient: ["#10b981", "#34d399"] },
  stock_us:     { label: "米国株",        color: "#06b6d4", gradient: ["#06b6d4", "#22d3ee"] },
  bond:         { label: "債券",          color: "#f59e0b", gradient: ["#f59e0b", "#fbbf24"] },
  crypto:       { label: "暗号資産",      color: "#f43f5e", gradient: ["#f43f5e", "#fb7185"] },
  real_estate:  { label: "不動産",        color: "#84cc16", gradient: ["#84cc16", "#a3e635"] },
  other:        { label: "その他",        color: "#6b7280", gradient: ["#6b7280", "#9ca3af"] },
};

export const DEFAULT_PORTFOLIO: Portfolio = {
  id: "default",
  name: "マイポートフォリオ",
  fireGoal: 30_000_000,
  createdAt: Date.now(),
  assets: [
    { id: "a1", category: "cash",     label: "普通預金",     amount: 3_200_000 },
    { id: "a2", category: "fund",     label: "eMAXIS Slim",  amount: 4_800_000 },
    { id: "a3", category: "stock_jp", label: "国内株式",     amount: 2_100_000 },
    { id: "a4", category: "stock_us", label: "米国ETF",      amount: 1_850_000 },
    { id: "a5", category: "crypto",   label: "Bitcoin",      amount: 500_000 },
  ],
};

const STORAGE_KEY = "asset-dash-portfolios";
const ACTIVE_KEY  = "asset-dash-active";

export function loadPortfolios(): Portfolio[] {
  if (typeof window === "undefined") return [DEFAULT_PORTFOLIO];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [DEFAULT_PORTFOLIO];
    const parsed = JSON.parse(raw) as Portfolio[];
    return parsed.length > 0 ? parsed : [DEFAULT_PORTFOLIO];
  } catch {
    return [DEFAULT_PORTFOLIO];
  }
}

export function savePortfolios(portfolios: Portfolio[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolios));
}

export function loadActiveId(): string {
  if (typeof window === "undefined") return "default";
  return localStorage.getItem(ACTIVE_KEY) ?? "default";
}

export function saveActiveId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_KEY, id);
}

export function totalAssets(portfolio: Portfolio): number {
  return portfolio.assets.reduce((s, a) => s + a.amount, 0);
}

export function fireProgress(portfolio: Portfolio): number {
  const total = totalAssets(portfolio);
  return portfolio.fireGoal > 0
    ? Math.min(100, (total / portfolio.fireGoal) * 100)
    : 0;
}
