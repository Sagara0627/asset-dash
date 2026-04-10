"use client";

import { motion } from "framer-motion";

function Pulse({ className }: { className: string }) {
  return (
    <motion.div
      className={`bg-white/5 rounded-xl ${className}`}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-8 pb-4">
        <Pulse className="w-32 h-5" />
        <Pulse className="w-20 h-8 rounded-full" />
      </div>

      <div className="flex-1 px-4 pb-24 space-y-4 max-w-lg mx-auto w-full">
        {/* Total card */}
        <div className="glass rounded-2xl p-6 space-y-3">
          <Pulse className="w-24 h-3" />
          <Pulse className="w-48 h-10" />
          <Pulse className="w-28 h-4" />
        </div>

        {/* Donut placeholder */}
        <div className="glass rounded-2xl p-6 flex items-center justify-center">
          <motion.div
            className="w-52 h-52 rounded-full border-[28px] border-white/5"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
          />
        </div>

        {/* Legend */}
        <div className="glass rounded-2xl p-5 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <Pulse className="flex-1 h-3" />
              <Pulse className="w-20 h-3" />
            </div>
          ))}
        </div>

        {/* Goal */}
        <div className="glass rounded-2xl p-5 space-y-3">
          <Pulse className="w-20 h-3" />
          <Pulse className="w-16 h-8" />
          <Pulse className="w-full h-3 rounded-full" />
        </div>
      </div>
    </div>
  );
}
