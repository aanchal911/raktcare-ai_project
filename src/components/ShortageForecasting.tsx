import React, { useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, AlertTriangle, CheckCircle2, Activity } from "lucide-react";
import { BloodGroup } from "../types";

interface ForecastEntry {
  bloodGroup: BloodGroup;
  currentStock: number;
  dailyDemand: number;
  forecast7d: number[];
  alertLevel: "critical" | "high" | "normal";
  modelMAE: number;
  modelR2: number;
}

const FORECAST_DATA: ForecastEntry[] = [
  { bloodGroup: "O+",  currentStock: 42, dailyDemand: 18, forecast7d: [38,31,26,22,18,15,12], alertLevel: "high",     modelMAE: 0.41, modelR2: 0.54 },
  { bloodGroup: "O-",  currentStock: 8,  dailyDemand: 6,  forecast7d: [6, 4, 3, 2, 1, 0, 0],  alertLevel: "critical", modelMAE: 0.38, modelR2: 0.57 },
  { bloodGroup: "A+",  currentStock: 55, dailyDemand: 12, forecast7d: [50,44,39,34,30,26,22], alertLevel: "normal",   modelMAE: 0.44, modelR2: 0.52 },
  { bloodGroup: "A-",  currentStock: 14, dailyDemand: 5,  forecast7d: [12,10,8, 6, 5, 4, 3],  alertLevel: "high",     modelMAE: 0.39, modelR2: 0.56 },
  { bloodGroup: "B+",  currentStock: 38, dailyDemand: 10, forecast7d: [34,29,25,21,18,15,12], alertLevel: "normal",   modelMAE: 0.42, modelR2: 0.53 },
  { bloodGroup: "B-",  currentStock: 6,  dailyDemand: 4,  forecast7d: [5, 3, 2, 1, 0, 0, 0],  alertLevel: "critical", modelMAE: 0.37, modelR2: 0.58 },
  { bloodGroup: "AB+", currentStock: 22, dailyDemand: 7,  forecast7d: [19,15,12,9, 7, 5, 3],  alertLevel: "high",     modelMAE: 0.43, modelR2: 0.51 },
  { bloodGroup: "AB-", currentStock: 4,  dailyDemand: 3,  forecast7d: [3, 2, 1, 0, 0, 0, 0],  alertLevel: "critical", modelMAE: 0.36, modelR2: 0.59 },
];

const DAYS = ["D+1", "D+2", "D+3", "D+4", "D+5", "D+6", "D+7"];

const alertConfig = {
  critical: { color: "red",    label: "Critical",  icon: AlertTriangle,  bg: "bg-red-950/40 border-red-900/50" },
  high:     { color: "orange", label: "High Risk",  icon: Activity,       bg: "bg-orange-950/40 border-orange-900/50" },
  normal:   { color: "green",  label: "Stable",     icon: CheckCircle2,   bg: "bg-green-950/40 border-green-900/50" },
};

export function ShortageForecasting() {
  const [selected, setSelected] = useState<ForecastEntry | null>(null);

  const critical = FORECAST_DATA.filter(d => d.alertLevel === "critical").length;
  const high     = FORECAST_DATA.filter(d => d.alertLevel === "high").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Blood Shortage Forecasting</h2>
            <p className="text-xs text-slate-400 font-mono">XGBoost 7-day demand forecast · per blood group</p>
          </div>
        </div>
        <div className="flex gap-4 mt-4 text-xs font-mono">
          <span className="text-red-400 font-bold">{critical} Critical</span>
          <span className="text-orange-400 font-bold">{high} High Risk</span>
          <span className="text-green-400 font-bold">{8 - critical - high} Stable</span>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FORECAST_DATA.map((entry) => {
          const cfg = alertConfig[entry.alertLevel];
          const Icon = cfg.icon;
          const maxVal = Math.max(...entry.forecast7d, entry.currentStock);

          return (
            <motion.div
              key={entry.bloodGroup}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelected(entry)}
              className={`border rounded-xl p-4 cursor-pointer hover:scale-[1.02] transition-all ${cfg.bg}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-2xl font-extrabold text-white">{entry.bloodGroup}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{entry.currentStock} units in stock</div>
                </div>
                <Icon className={`w-5 h-5 text-${cfg.color}-400`} />
              </div>

              {/* Sparkline bars */}
              <div className="flex items-end gap-0.5 h-10 mb-2">
                {entry.forecast7d.map((val, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm bg-${cfg.color}-500/60`}
                    style={{ height: `${Math.max(4, (val / maxVal) * 100)}%` }}
                  />
                ))}
              </div>

              <div className={`text-[10px] font-bold font-mono text-${cfg.color}-400 uppercase`}>
                {cfg.label}
              </div>
              <div className="text-[9px] text-slate-500 font-mono">
                Day 7 forecast: {entry.forecast7d[6]} units
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detail modal */}
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0a0505] border border-white/20 rounded-2xl p-6 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">{selected.bloodGroup} — 7-Day Forecast</h3>
                <p className="text-xs text-slate-400 font-mono">XGBoost regressor · MAE {selected.modelMAE} · R² {selected.modelR2}</p>
              </div>
              <button onClick={() => setSelected(null)} className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-mono">
                Close
              </button>
            </div>

            {/* Bar chart */}
            <div className="space-y-2">
              {selected.forecast7d.map((val, i) => {
                const max = Math.max(...selected.forecast7d, selected.currentStock);
                const pct = Math.max(4, (val / max) * 100);
                const color = val <= 2 ? "bg-red-500" : val <= 8 ? "bg-orange-500" : "bg-green-500";
                return (
                  <div key={i} className="flex items-center gap-3 text-xs font-mono">
                    <span className="w-8 text-slate-400">{DAYS[i]}</span>
                    <div className="flex-1 bg-white/5 rounded-full h-5 overflow-hidden">
                      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-12 text-right text-slate-300 font-bold">{val} units</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-400 font-mono">
              Current stock: <span className="text-white font-bold">{selected.currentStock} units</span> ·
              Daily demand: <span className="text-white font-bold">{selected.dailyDemand} units/day</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
