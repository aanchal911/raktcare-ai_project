import React, { useState } from "react";
import { motion } from "motion/react";
import {
  HeartPulse, Calendar, Activity, AlertTriangle,
  CheckCircle2, Clock, Droplet, Apple, Pill, Phone, XCircle
} from "lucide-react";
import { INITIAL_DONORS } from "../data/donors";

type RecoveryStatus = "critical" | "monitoring" | "recovering" | "safe";

interface HealthRecord {
  id: string;
  name: string;
  bloodGroup: string;
  donationDate: string;
  daysSince: number;
  status: RecoveryStatus;
  eligible: boolean;
  nextEligible: string;
  hemoglobin: number;
  iron: number;
  heartRate: number;
  fatigue: "none" | "mild" | "moderate";
  dizziness: boolean;
  supplements: string[];
}

function buildRecords(): HealthRecord[] {
  const now = new Date();
  return INITIAL_DONORS.map((d) => {
    const daysSince = d.lastDonationWeeksAgo * 7;
    const donationDate = new Date(now.getTime() - daysSince * 86400000);
    const nextEligible = new Date(donationDate.getTime() + 56 * 86400000);

    let status: RecoveryStatus;
    if (daysSince < 4)       status = "critical";
    else if (daysSince < 14) status = "monitoring";
    else if (daysSince < 56) status = "recovering";
    else                     status = "safe";

    // donor with 0 donations — no recent donation to monitor
    if (d.previousDonationsCount === 0) status = "safe";

    const hemoglobin = parseFloat((12.5 + Math.random() * 3).toFixed(1));
    const iron = Math.floor(50 + Math.random() * 100);

    return {
      id: d.id,
      name: d.name,
      bloodGroup: d.bloodGroup,
      donationDate: donationDate.toISOString().split("T")[0],
      daysSince,
      status,
      eligible: daysSince >= 56,
      nextEligible: nextEligible.toISOString().split("T")[0],
      hemoglobin,
      iron,
      heartRate: 65 + Math.floor(Math.random() * 25),
      fatigue: (daysSince < 4 ? "moderate" : daysSince < 14 ? "mild" : "none") as "none" | "mild" | "moderate",
      dizziness: daysSince < 4 && Math.random() > 0.6,
      supplements: hemoglobin < 13
        ? ["Iron 65mg daily", "Vitamin C 500mg", "Folic Acid 400mcg"]
        : ["Multivitamin daily"],
    };
  }).sort((a, b) => a.daysSince - b.daysSince);
}

const STATUS_CFG = {
  critical:   { label: "Critical",   border: "border-red-500/50",    badge: "bg-red-950/60 text-red-400 border-red-900/60",       icon: AlertTriangle,  iconColor: "text-red-400"    },
  monitoring: { label: "Monitoring", border: "border-orange-500/50", badge: "bg-orange-950/60 text-orange-400 border-orange-900/60", icon: Activity,       iconColor: "text-orange-400" },
  recovering: { label: "Recovering", border: "border-yellow-500/50", badge: "bg-yellow-950/60 text-yellow-400 border-yellow-900/60", icon: HeartPulse,     iconColor: "text-yellow-400" },
  safe:       { label: "Safe",       border: "border-green-500/50",  badge: "bg-green-950/60 text-green-400 border-green-900/60",   icon: CheckCircle2,   iconColor: "text-green-400"  },
};

export function PostDonationMonitoring() {
  const [records] = useState<HealthRecord[]>(buildRecords);
  const [filter, setFilter] = useState<RecoveryStatus | "all">("all");
  const [selected, setSelected] = useState<HealthRecord | null>(null);

  const visible = filter === "all" ? records : records.filter(r => r.status === filter);

  const count = (s: RecoveryStatus) => records.filter(r => r.status === s).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Post-Donation Health Monitoring</h2>
            <p className="text-xs text-slate-400 font-mono">Donor recovery tracking · 8-week re-donation safety</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(["critical", "monitoring", "recovering", "safe"] as RecoveryStatus[]).map((s) => {
          const cfg = STATUS_CFG[s];
          const Icon = cfg.icon;
          return (
            <div key={s} className={`border rounded-xl p-4 ${cfg.border} bg-white/5`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${cfg.iconColor}`} />
                <span className={`text-xs font-mono uppercase font-bold ${cfg.iconColor}`}>{cfg.label}</span>
              </div>
              <div className={`text-2xl font-bold ${cfg.iconColor}`}>{count(s)}</div>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "critical", "monitoring", "recovering", "safe"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
              filter === f ? "bg-white/15 text-white border border-white/20" : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10"
            }`}
          >
            {f === "all" ? "All Donors" : STATUS_CFG[f].label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {visible.map((r) => {
          const cfg = STATUS_CFG[r.status];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelected(r)}
              className={`bg-white/5 border ${cfg.border} rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-all`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{r.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-950/60 text-red-400 border border-red-900/60">
                      {r.bloodGroup}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>{r.donationDate}</span>
                    <span className="text-slate-500">·</span>
                    <span className={r.daysSince < 14 ? "text-orange-400 font-bold" : "text-slate-300"}>
                      {r.daysSince}d ago
                    </span>
                  </div>
                </div>
                <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <div className="text-[9px] text-slate-500 uppercase">Hgb</div>
                  <div className={`text-sm font-bold ${r.hemoglobin < 13 ? "text-red-400" : "text-green-400"}`}>
                    {r.hemoglobin}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <div className="text-[9px] text-slate-500 uppercase">Iron</div>
                  <div className={`text-sm font-bold ${r.iron < 80 ? "text-orange-400" : "text-green-400"}`}>
                    {r.iron}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <div className="text-[9px] text-slate-500 uppercase">HR</div>
                  <div className="text-sm font-bold text-slate-300">{r.heartRate}</div>
                </div>
              </div>

              {/* Next eligible */}
              <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                r.eligible ? "bg-green-950/40 border border-green-900/50" : "bg-orange-950/40 border border-orange-900/50"
              }`}>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <Clock className={`w-3.5 h-3.5 ${r.eligible ? "text-green-400" : "text-orange-400"}`} />
                  Next eligible:
                </div>
                <span className={`text-xs font-bold ${r.eligible ? "text-green-400" : "text-orange-400"}`}>
                  {r.eligible ? "Ready Now ✓" : r.nextEligible}
                </span>
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
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">{selected.name}</h3>
                <p className="text-xs text-slate-400 font-mono">{selected.bloodGroup} · Donated {selected.donationDate}</p>
              </div>
              <button onClick={() => setSelected(null)} className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-mono">
                Close
              </button>
            </div>

            <div className="space-y-4">
              {/* Vitals */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Droplet, label: "Hemoglobin", val: `${selected.hemoglobin} g/dL`, warn: selected.hemoglobin < 13 },
                  { icon: Activity, label: "Iron", val: `${selected.iron} µg/dL`, warn: selected.iron < 80 },
                  { icon: HeartPulse, label: "Heart Rate", val: `${selected.heartRate} bpm`, warn: false },
                ].map(({ icon: Icon, label, val, warn }) => (
                  <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                    <Icon className={`w-4 h-4 mx-auto mb-1 ${warn ? "text-red-400" : "text-green-400"}`} />
                    <div className="text-[9px] text-slate-500 uppercase">{label}</div>
                    <div className={`text-sm font-bold ${warn ? "text-red-400" : "text-slate-200"}`}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Symptoms */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 text-xs">
                <h4 className="font-bold text-white mb-2">Symptoms</h4>
                <div className="flex justify-between">
                  <span className="text-slate-400">Fatigue:</span>
                  <span className={`font-bold ${selected.fatigue === "moderate" ? "text-red-400" : selected.fatigue === "mild" ? "text-yellow-400" : "text-green-400"}`}>
                    {selected.fatigue}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dizziness:</span>
                  <span className={`font-bold ${selected.dizziness ? "text-red-400" : "text-green-400"}`}>
                    {selected.dizziness ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              {/* Supplements */}
              <div className="bg-blue-950/40 border border-blue-900/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Pill className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-bold text-white">Supplements</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selected.supplements.map((s, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-xs text-blue-300 font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Diet tips */}
              <div className="bg-green-950/40 border border-green-900/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Apple className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-bold text-white">Diet Tips</span>
                </div>
                <ul className="space-y-1 text-xs text-green-300">
                  {["Iron-rich foods: spinach, lentils, red meat", "3–4 litres of water daily", "Avoid caffeine for 48h post-donation", "Rest for 24h after donation"].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-sm font-bold transition-all">
                <Phone className="w-4 h-4" /> Schedule Follow-Up Call
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
