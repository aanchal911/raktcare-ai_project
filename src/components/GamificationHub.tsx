import React, { useState } from "react";
import { motion } from "motion/react";
import { Trophy, Star, Flame, Award, Users, TrendingUp } from "lucide-react";
import { INITIAL_DONORS } from "../data/donors";

interface DonorStats {
  id: string;
  name: string;
  bloodGroup: string;
  donations: number;
  points: number;
  level: string;
  levelColor: string;
  badges: string[];
  streak: number;
}

const LEVELS = [
  { min: 0,   label: "Newcomer",   color: "text-slate-400" },
  { min: 1,   label: "Helper",     color: "text-green-400" },
  { min: 3,   label: "Supporter",  color: "text-blue-400"  },
  { min: 6,   label: "Guardian",   color: "text-purple-400"},
  { min: 10,  label: "Champion",   color: "text-yellow-400"},
  { min: 15,  label: "Legend",     color: "text-red-400"   },
];

const BADGES: Record<string, { icon: string; label: string; condition: (d: typeof INITIAL_DONORS[0]) => boolean }> = {
  "first_drop":   { icon: "🩸", label: "First Drop",    condition: (d) => d.previousDonationsCount >= 1  },
  "triple":       { icon: "🔱", label: "Triple Hero",   condition: (d) => d.previousDonationsCount >= 3  },
  "veteran":      { icon: "🎖️", label: "Veteran",       condition: (d) => d.previousDonationsCount >= 8  },
  "universal":    { icon: "🌍", label: "Universal",     condition: (d) => d.bloodGroup === "O-"           },
  "rapid":        { icon: "⚡", label: "Rapid Responder",condition: (d) => d.responseRate >= 0.95         },
  "local_hero":   { icon: "🏠", label: "Local Hero",    condition: (d) => d.distanceKm <= 2              },
  "decade":       { icon: "💎", label: "Decade Club",   condition: (d) => d.previousDonationsCount >= 10 },
};

function buildStats(donors: typeof INITIAL_DONORS): DonorStats[] {
  return donors.map((d) => {
    const pts = d.previousDonationsCount * 100 + Math.round(d.responseRate * 50);
    const lvl = [...LEVELS].reverse().find((l) => d.previousDonationsCount >= l.min) || LEVELS[0];
    const earned = Object.entries(BADGES)
      .filter(([, b]) => b.condition(d))
      .map(([, b]) => `${b.icon} ${b.label}`);
    const streak = Math.min(d.previousDonationsCount, 6);
    return {
      id: d.id,
      name: d.name,
      bloodGroup: d.bloodGroup,
      donations: d.previousDonationsCount,
      points: pts,
      level: lvl.label,
      levelColor: lvl.color,
      badges: earned,
      streak,
    };
  }).sort((a, b) => b.points - a.points);
}

export function GamificationHub() {
  const [tab, setTab] = useState<"leaderboard" | "badges">("leaderboard");
  const stats = buildStats(INITIAL_DONORS);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Donor Gamification Hub</h2>
            <p className="text-xs text-slate-400 font-mono">RaktPoints · Badges · Leaderboard</p>
          </div>
        </div>
        <div className="flex gap-4 mt-4 text-xs font-mono">
          <span className="text-yellow-400 font-bold">{stats.length} Donors Ranked</span>
          <span className="text-purple-400 font-bold">{stats.filter(s => s.level === "Legend" || s.level === "Champion").length} Champions+</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["leaderboard", "badges"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
              tab === t ? "bg-white/15 text-white border border-white/20" : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10"
            }`}
          >
            {t === "leaderboard" ? "🏆 Leaderboard" : "🎖️ Badges"}
          </button>
        ))}
      </div>

      {tab === "leaderboard" && (
        <div className="space-y-2">
          {stats.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-4 hover:bg-white/10 transition-all"
            >
              {/* Rank */}
              <div className={`w-8 text-center font-extrabold font-mono text-lg ${
                i === 0 ? "text-yellow-400" : i === 1 ? "text-slate-300" : i === 2 ? "text-orange-400" : "text-slate-500"
              }`}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
              </div>

              {/* Name + level */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white truncate">{s.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-950/60 text-red-400 border border-red-900/60">
                    {s.bloodGroup}
                  </span>
                </div>
                <div className={`text-[11px] font-mono font-bold ${s.levelColor}`}>{s.level}</div>
              </div>

              {/* Streak */}
              <div className="text-center hidden sm:block">
                <div className="flex items-center gap-1 text-orange-400 text-xs font-mono">
                  <Flame className="w-3.5 h-3.5" />
                  <span className="font-bold">{s.streak}</span>
                </div>
                <div className="text-[9px] text-slate-500">streak</div>
              </div>

              {/* Donations */}
              <div className="text-center">
                <div className="text-sm font-bold text-slate-200">{s.donations}</div>
                <div className="text-[9px] text-slate-500 font-mono">donations</div>
              </div>

              {/* Points */}
              <div className="text-right">
                <div className="text-sm font-bold text-yellow-400">{s.points}</div>
                <div className="text-[9px] text-slate-500 font-mono">pts</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tab === "badges" && (
        <div className="space-y-4">
          {/* Badge legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(BADGES).map(([key, badge]) => (
              <div key={key} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">{badge.icon}</div>
                <div className="text-xs font-bold text-slate-200">{badge.label}</div>
              </div>
            ))}
          </div>

          {/* Donor badge cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stats.filter(s => s.badges.length > 0).map((s) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-white">{s.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-950/60 text-red-400 border border-red-900/60">
                    {s.bloodGroup}
                  </span>
                  <span className={`text-[10px] font-mono font-bold ml-auto ${s.levelColor}`}>{s.level}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {s.badges.map((b, i) => (
                    <span key={i} className="px-2 py-1 bg-yellow-950/40 border border-yellow-900/40 rounded-lg text-[10px] text-yellow-300 font-mono">
                      {b}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
