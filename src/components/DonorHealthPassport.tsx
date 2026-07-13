import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QrCode, Download, Search, CheckCircle2, XCircle, Shield, MapPin, Globe, ChevronLeft, ChevronRight, Activity, Droplets, Weight } from "lucide-react";
import { mlService } from "../services/mlService";
import { CSVDonor } from "../types";
import { CAN_DONATE_TO } from "../data/donors";
import { BloodGroup } from "../types";

export function DonorHealthPassport() {
  const [scope, setScope] = useState<"local" | "global">("local");
  const [selectedState, setSelectedState] = useState("Gujarat");
  const [selectedCity, setSelectedCity] = useState("");
  const [bloodGroup, setBloodGroup] = useState("All");
  const [search, setSearch] = useState("");
  const [states, setStates] = useState<string[]>([]);
  const [citiesByState, setCitiesByState] = useState<Record<string, string[]>>({});
  const [donors, setDonors] = useState<CSVDonor[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<CSVDonor | null>(null);
  const LIMIT = 12;

  useEffect(() => {
    mlService.getDonorFilters().then((f) => {
      setStates(f.states);
      setCitiesByState(f.cities_by_state);
    });
  }, []);

  const fetchDonors = useCallback(async (newOffset = 0) => {
    setIsLoading(true);
    const result = await mlService.getDonors({
      scope,
      state: selectedState,
      city: selectedCity,
      blood_group: bloodGroup !== "All" ? bloodGroup : "",
      limit: LIMIT,
      offset: newOffset,
    });
    setDonors(result.donors);
    setTotal(result.total);
    setOffset(newOffset);
    setIsLoading(false);
  }, [scope, selectedState, selectedCity, bloodGroup]);

  useEffect(() => { fetchDonors(0); }, [fetchDonors]);

  const filtered = donors.filter((d) =>
    search === "" || d.name.toLowerCase().includes(search.toLowerCase())
  );

  const raktScore = (d: CSVDonor) => {
    const avail = d.eligible ? 1 : 0.3;
    const hb = d.hemoglobin >= 12.5 ? 1 : 0.5;
    const freq = Math.min(d.total_donations / 10, 1);
    return Math.round((0.4 * avail + 0.35 * hb + 0.25 * freq) * 100);
  };

  const downloadPassport = (d: CSVDonor) => {
    const score = raktScore(d);
    const text = [
      "=== RAKTCARE AI — DONOR HEALTH PASSPORT ===",
      `Name           : ${d.name}`,
      `Blood Group    : ${d.blood_group}`,
      `Age            : ${d.age} | Gender: ${d.gender}`,
      `Location       : ${d.city}, ${d.state}`,
      `Phone          : ${d.phone}`,
      `Email          : ${d.email}`,
      `Total Donations: ${d.total_donations}`,
      `Last Donated   : ${d.last_donation_date}`,
      `Hemoglobin     : ${d.hemoglobin} g/dL`,
      `Weight         : ${d.weight_kg} kg`,
      `Medical        : ${d.medical_condition || "None"}`,
      `Eligible       : ${d.eligible ? "YES" : "NO"}`,
      `Donation Center: ${d.donation_center}`,
      `RaktScore      : ${score}/100`,
      `Can Donate To  : ${CAN_DONATE_TO[d.blood_group as BloodGroup]?.join(", ") || "N/A"}`,
      "============================================",
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `passport_${d.name.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const cities = citiesByState[selectedState] || [];
  const totalPages = Math.ceil(total / LIMIT);
  const currentPage = Math.floor(offset / LIMIT) + 1;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Donor Health Passport</h2>
            <p className="text-xs text-slate-400 font-mono">Verified donor profiles with health metrics & RaktScore</p>
          </div>
        </div>

        {/* Scope toggle */}
        <div className="flex gap-2 mb-4">
          {(["local", "global"] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setScope(s); setSelectedCity(""); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                scope === s
                  ? "bg-emerald-600 text-white"
                  : "bg-white/5 border border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {s === "local" ? <MapPin className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
              {s === "local" ? "Local (State)" : "Global (All India)"}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {scope === "local" && (
            <select
              value={selectedState}
              onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(""); }}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              {states.map((s) => <option key={s} value={s} className="bg-black">{s}</option>)}
            </select>
          )}

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
          >
            <option value="" className="bg-black">All Cities</option>
            {(scope === "local" ? cities : Object.values(citiesByState).flat().sort()).map((c) => (
              <option key={c} value={c} className="bg-black">{c}</option>
            ))}
          </select>

          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
          >
            <option value="All" className="bg-black">All Groups</option>
            {["O+","O-","A+","A-","B+","B-","AB+","AB-"].map((g) => (
              <option key={g} value={g} className="bg-black">{g}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Passport Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse h-52" />
            ))
          ) : filtered.length > 0 ? (
            filtered.map((donor) => {
              const score = raktScore(donor);
              return (
                <motion.div
                  key={donor.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all cursor-pointer"
                  onClick={() => setSelectedDonor(donor)}
                >
                  {/* Top row */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{donor.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950/60 text-red-400 border border-red-900/60">
                          {donor.blood_group}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{donor.city}, {donor.state} · {donor.age}y · {donor.gender}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] font-mono text-slate-400">RaktScore</div>
                      <div className={`text-xl font-extrabold ${score >= 70 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                        {score}
                      </div>
                    </div>
                  </div>

                  {/* Health stats */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-[9px] text-slate-500 uppercase">Hb g/dL</div>
                      <div className={`text-sm font-bold ${donor.hemoglobin >= 12.5 ? "text-green-400" : "text-orange-400"}`}>{donor.hemoglobin}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-[9px] text-slate-500 uppercase">Weight</div>
                      <div className="text-sm font-bold text-slate-200">{donor.weight_kg}kg</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-[9px] text-slate-500 uppercase">Donations</div>
                      <div className="text-sm font-bold text-slate-200">{donor.total_donations}</div>
                    </div>
                  </div>

                  {/* Eligibility */}
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-1.5 text-xs font-mono font-bold ${donor.eligible ? "text-green-400" : "text-orange-400"}`}>
                      {donor.eligible
                        ? <><CheckCircle2 className="w-3.5 h-3.5" /> Eligible</>
                        : <><XCircle className="w-3.5 h-3.5" /> {donor.medical_condition || "Not Eligible"}</>
                      }
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); downloadPassport(donor); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg text-xs font-mono transition-all"
                    >
                      <Download className="w-3 h-3" /> Export
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-2 text-center py-12 text-slate-500 font-mono">
              <Shield className="w-10 h-10 mx-auto mb-3 opacity-30" />
              No donors match your search.
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {total > LIMIT && (
        <div className="flex items-center justify-center gap-4 font-mono text-xs">
          <button onClick={() => fetchDonors(offset - LIMIT)} disabled={offset === 0} className="p-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10 cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-slate-400">Page {currentPage} of {totalPages} · {total} donors</span>
          <button onClick={() => fetchDonors(offset + LIMIT)} disabled={offset + LIMIT >= total} className="p-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10 cursor-pointer">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedDonor && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50" onClick={() => setSelectedDonor(null)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0c0808] border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedDonor.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedDonor.city}, {selectedDonor.state} · {selectedDonor.age}y · {selectedDonor.gender}</p>
                </div>
                <span className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400 font-extrabold flex items-center justify-center text-xl">
                  {selectedDonor.blood_group}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                {[
                  ["Phone", selectedDonor.phone],
                  ["Email", selectedDonor.email],
                  ["Last Donated", selectedDonor.last_donation_date],
                  ["Donation Center", selectedDonor.donation_center],
                  ["Hemoglobin", `${selectedDonor.hemoglobin} g/dL`],
                  ["Weight", `${selectedDonor.weight_kg} kg`],
                  ["Total Donations", String(selectedDonor.total_donations)],
                  ["Medical", selectedDonor.medical_condition || "None"],
                ].map(([label, value]) => (
                  <div key={label} className="bg-white/5 rounded-lg p-2">
                    <div className="text-[9px] text-slate-500 uppercase mb-0.5">{label}</div>
                    <div className="text-slate-200 font-bold truncate">{value}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button onClick={() => setSelectedDonor(null)} className="flex-1 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-slate-400 hover:text-white cursor-pointer">
                  Close
                </button>
                <button onClick={() => downloadPassport(selectedDonor)} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-mono text-white font-bold cursor-pointer flex items-center justify-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Export Passport
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
