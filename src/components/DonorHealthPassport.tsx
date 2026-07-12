import React, { useState } from "react";
import { motion } from "motion/react";
import { QrCode, Download, Search, CheckCircle2, XCircle, Shield } from "lucide-react";
import { INITIAL_DONORS, CAN_DONATE_TO } from "../data/donors";
import { BloodGroup } from "../types";

export function DonorHealthPassport() {
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState<BloodGroup | "All">("All");

  const filtered = INITIAL_DONORS.filter((d) => {
    const matchName = d.name.toLowerCase().includes(search.toLowerCase());
    const matchGroup = filterGroup === "All" || d.bloodGroup === filterGroup;
    return matchName && matchGroup;
  });

  const isEligible = (weeksAgo: number) => weeksAgo >= 8;

  const raktScore = (d: typeof INITIAL_DONORS[0]) => {
    const avail = d.availability === "Available Now" ? 1 : 0.5;
    const recency = Math.min(d.lastDonationWeeksAgo / 52, 1);
    const freq = Math.min(d.previousDonationsCount / 15, 1);
    return Math.round((0.4 * avail + 0.35 * d.responseRate + 0.15 * recency + 0.1 * freq) * 100);
  };

  const downloadPassport = (d: typeof INITIAL_DONORS[0]) => {
    const text = [
      "=== RAKTCARE AI — DONOR HEALTH PASSPORT ===",
      `Name        : ${d.name}`,
      `Blood Group : ${d.bloodGroup}`,
      `Age         : ${d.age}`,
      `Location    : ${d.location}`,
      `Phone       : ${d.phone}`,
      `Donations   : ${d.previousDonationsCount}`,
      `Last Donated: ${d.lastDonationDate}`,
      `Eligible    : ${isEligible(d.lastDonationWeeksAgo) ? "YES" : "NO"}`,
      `RaktScore   : ${raktScore(d)}/100`,
      `Can Donate To: ${CAN_DONATE_TO[d.bloodGroup as BloodGroup].join(", ")}`,
      "============================================",
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `passport_${d.name.replace(" ", "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const bloodGroups: (BloodGroup | "All")[] = ["All", "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Donor Health Passport</h2>
            <p className="text-xs text-slate-400 font-mono">Verified donor profiles with eligibility & RaktScore</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search donor name..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-white/20"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {bloodGroups.map((g) => (
            <button
              key={g}
              onClick={() => setFilterGroup(g)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                filterGroup === g
                  ? "bg-red-600 text-white"
                  : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Passport Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((donor) => {
          const eligible = isEligible(donor.lastDonationWeeksAgo);
          const score = raktScore(donor);
          return (
            <motion.div
              key={donor.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all"
            >
              {/* Top row */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{donor.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950/60 text-red-400 border border-red-900/60">
                      {donor.bloodGroup}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{donor.location} · {donor.age}y</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-slate-400">RaktScore</div>
                  <div className={`text-xl font-extrabold ${score >= 70 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                    {score}
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <div className="text-[9px] text-slate-500 uppercase">Donations</div>
                  <div className="text-sm font-bold text-slate-200">{donor.previousDonationsCount}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <div className="text-[9px] text-slate-500 uppercase">Response</div>
                  <div className="text-sm font-bold text-slate-200">{Math.round(donor.responseRate * 100)}%</div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <div className="text-[9px] text-slate-500 uppercase">Last</div>
                  <div className="text-[11px] font-bold text-slate-200">{donor.lastDonationDate}</div>
                </div>
              </div>

              {/* Compatible types */}
              <div className="flex flex-wrap gap-1 mb-3">
                {CAN_DONATE_TO[donor.bloodGroup as BloodGroup].map((g) => (
                  <span key={g} className="px-1.5 py-0.5 rounded bg-blue-950/50 border border-blue-900/40 text-[9px] text-blue-300 font-mono">
                    {g}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-1.5 text-xs font-mono font-bold ${eligible ? "text-green-400" : "text-orange-400"}`}>
                  {eligible
                    ? <><CheckCircle2 className="w-3.5 h-3.5" /> Eligible to Donate</>
                    : <><XCircle className="w-3.5 h-3.5" /> Not Yet Eligible</>
                  }
                </div>
                <button
                  onClick={() => downloadPassport(donor)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg text-xs font-mono transition-all"
                >
                  <Download className="w-3 h-3" /> Export
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500 font-mono">
          <Shield className="w-10 h-10 mx-auto mb-3 opacity-30" />
          No donors match your search.
        </div>
      )}
    </div>
  );
}
