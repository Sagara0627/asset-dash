"use client";

import { motion } from "framer-motion";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentControlProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
}

export function SegmentControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentControlProps<T>) {
  return (
    <div className="segment-control flex items-center">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`segment-btn relative ${value === opt.value ? "active" : ""}`}
        >
          {value === opt.value && (
            <motion.div
              layoutId="segment-pill"
              className="absolute inset-0 rounded-full"
              style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
