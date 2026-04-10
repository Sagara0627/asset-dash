"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORY_META, AssetEntry } from "@/app/lib/store";

interface DonutChartProps {
  assets: AssetEntry[];
  total: number;
}

function formatYen(n: number) {
  if (n >= 1_000_000) return `¥${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000)    return `¥${(n / 10_000).toFixed(1)}万`;
  return `¥${n.toLocaleString("ja-JP")}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const meta = CATEGORY_META[d.category as keyof typeof CATEGORY_META];
  return (
    <div
      className="glass rounded-xl px-4 py-3 text-sm pointer-events-none"
      style={{ border: `1px solid ${meta.color}50` }}
    >
      <div className="font-semibold text-white mb-1">{d.label}</div>
      <div style={{ color: meta.color }} className="text-base font-bold tabular-nums">
        ¥{d.amount.toLocaleString("ja-JP")}
      </div>
      <div className="text-[var(--text-secondary)] text-xs mt-0.5">
        {(d.percent * 100).toFixed(1)}%
      </div>
    </div>
  );
}

export function DonutChart({ assets, total }: DonutChartProps) {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [hoveredAmount, setHoveredAmount] = useState<number | null>(null);
  const [hoveredPct, setHoveredPct] = useState<number | null>(null);

  const data = assets.map((a) => ({
    ...a,
    value: a.amount,
    percent: total > 0 ? a.amount / total : 0,
    color: CATEGORY_META[a.category]?.color ?? "#6b7280",
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleMouseEnter(d: any) {
    setHoveredLabel(d.label);
    setHoveredAmount(d.amount);
    setHoveredPct(d.percent);
  }
  function handleMouseLeave() {
    setHoveredLabel(null);
    setHoveredAmount(null);
    setHoveredPct(null);
  }

  return (
    <div className="relative w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="58%"
            outerRadius="78%"
            dataKey="value"
            paddingAngle={2}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            animationBegin={0}
            animationDuration={900}
            animationEasing="ease-out"
            activeShape={(props) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props as any;
              return (
                <g>
                  <Sector
                    cx={cx} cy={cy}
                    innerRadius={(innerRadius as number) - 4}
                    outerRadius={(outerRadius as number) + 10}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                    opacity={1}
                  />
                  <Sector
                    cx={cx} cy={cy}
                    innerRadius={(outerRadius as number) + 14}
                    outerRadius={(outerRadius as number) + 18}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                    opacity={0.5}
                  />
                </g>
              );
            }}
          >
            {data.map((entry) => (
              <Cell
                key={entry.id}
                fill={entry.color}
                style={{ cursor: "pointer", transition: "opacity 0.2s" }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Center text */}
      <AnimatePresence mode="wait">
        {hoveredLabel ? (
          <motion.div
            key="hovered"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          >
            <div className="text-[var(--text-secondary)] text-xs font-medium mb-1">
              {hoveredLabel}
            </div>
            <div className="text-white text-xl font-bold tabular-nums">
              {formatYen(hoveredAmount ?? 0)}
            </div>
            <div className="text-[var(--text-secondary)] text-xs mt-0.5">
              {((hoveredPct ?? 0) * 100).toFixed(1)}%
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          >
            <div className="text-[var(--text-secondary)] text-xs font-medium tracking-widest uppercase mb-1">
              総資産
            </div>
            <div className="text-white text-2xl font-bold tabular-nums">
              {formatYen(total)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
