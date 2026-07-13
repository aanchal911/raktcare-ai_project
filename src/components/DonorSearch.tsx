import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CAN_RECEIVE_FROM } from "../data/donors";
import { BloodGroup, EmergencyRequest, CSVDonor } from "../types";
import { mlService } from "../services/mlService";
import { Search, Compass, Phone, CheckCircle, Bell, Volume2, MapPin, Globe, Filter, ChevronLeft, ChevronRight, User, Droplets, Activity } from "lucide-react";

interface DonorSearchProps {
  onAddEmergencyRequest: (newRequest: EmergencyRequest) => void;
  savedFamilyMemberSearchGroup?: BloodGroup;
}

export function DonorSearch({ onAddEmergencyRequest, savedFamilyMemberSearchGroup }: DonorSearchProps) {
  const [scope, setScope] = useState<"local" | "global">("local");
  const [bloodGroup, setBloodGroup] = useState<string>(savedFamilyMemberSearchGroup || "O+");
  const [selectedState, setSelectedState] = useState("Gujarat");
  const [selectedCity, setSelectedCity] = useState("");
  const [states, setStates] = useState<string[]>([]);
  const [citiesByState, setCitiesByState] = useState<Record<string, string[]>>({});
  const [donors, setDonors] = useState<CSVDonor[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<CSVDonor | null>(null);
  const [dispatchState, setDispatchState] = useState<"idle" | "broadcasting" | "dispatched">("idle");
  const LIMIT = 12;

  // Load filters on mount
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

  const handleRequestDonation = (donor: CSVDonor) => {
    setSelectedDonor(donor);
    setDispatchState("broadcasting");
    setTimeout(() => setDispatchState("dispatched"), 2200);
  };

  const finalizeRequest = () => {
    if (!selectedDonor) return;
    onAddEmergencyRequest({
      id: `req-${Date.now()}`,
      patientName: `Match: ${selectedDonor.name}`,
      bloodGroup: selectedDonor.blood_group as BloodGroup,
      hospital: selectedDonor.donation_center,
      urgency: "Critical (Immediate)",
      unitsNeeded: 1,
      timestamp: new Date().toISOString(),
      status: "Sourced",
    });
    setSelectedDonor(null);
    setDispatchState("idle");
  };

  const cities = citiesByState[selectedState] || [];
  const totalPages = Math.ceil(total / LIMIT);
  const currentPage = Math.floor(offset / LIMIT) + 1;

  return (
    <div className="space-y-6">

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 mb-5">
          <Search className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-bold text-transparent-gradient tracking-tight">Smart Donor Finder</h2>
        </div>

        {/* Local / Global toggle */}
        <div className="flex gap-2 mb-5">
          {(["local", "global"] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setScope(s); setSelectedCity(""); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                scope === s
                  ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                  : "bg-white/5 border border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {s === "local" ? <MapPin className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
              {s === "local" ? "Local (State)" : "Global (All India)"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Blood Group */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Blood Group</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500 transition-all"
            >
              <option value="All" className="bg-black">All Groups</option>
              {["O+","O-","A+","A-","B+","B-","AB+","AB-"].map((g) => (
                <option key={g} value={g} className="bg-black">{g}</option>
              ))}
            </select>
          </div>

          {/* State (only in local mode) */}
          {scope === "local" && (
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">State</label>
              <select
                value={selectedState}
                onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(""); }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500 transition-all"
              >
                {states.map((s) => <option key={s} value={s} className="bg-black">{s}</option>)}
              </select>
            </div>
          )}

          {/* City */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500 transition-all"
            >
              <option value="" className="bg-black">All Cities</option>
              {(scope === "local" ? cities : Object.values(citiesByState).flat().sort()).map((c) => (
                <option key={c} value={c} className="bg-black">{c}</option>
              ))}
            </select>
          </div>

          {/* Results count */}
          <div className="flex items-end">
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-full text-center">
              <span className="text-[10px] text-slate-500 font-mono block uppercase">Found</span>
              <span className="text-lg font-bold text-red-400 font-mono">{total}</span>
              <span className="text-[10px] text-slate-500 font-mono block">donors</span>
            </div>
          </div>

        </div>
      </div>

      {/* Donor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse h-48" />
            ))
          ) : donors.length > 0 ? (
            donors.map((donor) => (
              <motion.div
                key={donor.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-red-500/30 transition-all group"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-bold text-slate-100 text-sm group-hover:text-red-400 transition-colors">{donor.name}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span className="text-[11px] text-slate-400 font-mono">{donor.city}, {donor.state}</span>
                    </div>
                  </div>
                  <span className="w-11 h-11 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400 font-extrabold flex items-center justify-center text-lg">
                    {donor.blood_group}
                  </span>
                </div>

                {/* Health metrics */}
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  <div className="bg-white/5 rounded-lg p-1.5 text-center">
                    <span className="text-[8px] text-slate-500 uppercase block">Hb g/dL</span>
                    <span className={`text-xs font-bold ${donor.hemoglobin >= 12.5 ? "text-green-400" : "text-orange-400"}`}>{donor.hemoglobin}</span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-1.5 text-center">
                    <span className="text-[8px] text-slate-500 uppercase block">Weight</span>
                    <span className="text-xs font-bold text-slate-200">{donor.weight_kg}kg</span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-1.5 text-center">
                    <span className="text-[8px] text-slate-500 uppercase block">Donations</span>
                    <span className="text-xs font-bold text-slate-200">{donor.total_donations}</span>
                  </div>
                </div>

                {/* Eligibility + condition */}
                <div className={`text-[10px] font-mono px-2 py-1 rounded-lg mb-3 flex items-center gap-1.5 ${
                  donor.eligible
                    ? "bg-green-950/30 border border-green-900/40 text-green-400"
                    : "bg-orange-950/30 border border-orange-900/40 text-orange-400"
                }`}>
                  <Activity className="w-3 h-3" />
                  {donor.eligible ? "Eligible to Donate" : `Not Eligible${donor.medical_condition ? ` · ${donor.medical_condition}` : ""}`}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <a href={`tel:${donor.phone}`} className="p-2 border border-white/10 rounded-xl hover:border-red-500/30 text-slate-400 hover:text-white transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleRequestDonation(donor)}
                    disabled={!donor.eligible}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 ${
                      donor.eligible
                        ? "bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                        : "bg-white/5 text-slate-600 cursor-not-allowed border border-white/5"
                    }`}
                  >
                    <Bell className="w-3 h-3" /> Request Donor
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-slate-500 font-mono">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
              No donors found. Try changing filters.
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {total > LIMIT && (
        <div className="flex items-center justify-center gap-4 font-mono text-xs">
          <button
            onClick={() => fetchDonors(offset - LIMIT)}
            disabled={offset === 0}
            className="p-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-slate-400">Page {currentPage} of {totalPages} · {total} donors</span>
          <button
            onClick={() => fetchDonors(offset + LIMIT)}
            disabled={offset + LIMIT >= total}
            className="p-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dispatch Modal */}
      {selectedDonor && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/5 backdrop-blur-2xl border border-white/15 rounded-2xl max-w-md w-full p-6 text-center space-y-5 shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
          >
            <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-widest block bg-red-600/10 border border-red-500/20 py-1 rounded-md px-3 mx-auto w-fit">
              SOS DISPATCH
            </span>
            <h3 className="text-lg font-bold text-slate-100">Connecting to {selectedDonor.name}</h3>

            <div className="py-3 flex items-center justify-center">
              {dispatchState === "broadcasting" ? (
                <div className="space-y-2">
                  <div className="w-16 h-16 mx-auto bg-red-950/45 rounded-full border border-red-500/30 flex items-center justify-center">
                    <Volume2 className="w-7 h-7 text-red-500 animate-ping" />
                  </div>
                  <p className="text-xs font-mono text-red-400 animate-pulse">Broadcasting to {selectedDonor.name}...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-16 h-16 mx-auto bg-green-950/40 rounded-full border border-green-500/30 flex items-center justify-center">
                    <CheckCircle className="w-9 h-9 text-green-400" />
                  </div>
                  <p className="text-xs font-mono text-green-300">Alert acknowledged!</p>
                </div>
              )}
            </div>

            <div className="bg-black/40 p-3 rounded-xl text-left border border-white/10 space-y-1 text-xs font-mono">
              <div className="text-slate-400">Donor: <span className="text-white font-bold">{selectedDonor.name}</span></div>
              <div className="text-slate-400">Blood Group: <span className="text-white font-bold">{selectedDonor.blood_group}</span></div>
              <div className="text-slate-400">City: <span className="text-white font-bold">{selectedDonor.city}, {selectedDonor.state}</span></div>
              <div className="text-slate-400">Center: <span className="text-white font-bold">{selectedDonor.donation_center}</span></div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setSelectedDonor(null); setDispatchState("idle"); }} className="flex-1 py-2 text-xs font-mono font-bold border border-white/10 text-slate-400 hover:text-white rounded-xl bg-white/5 transition-all cursor-pointer">
                Abort
              </button>
              {dispatchState === "dispatched" && (
                <button onClick={finalizeRequest} className="flex-1 py-2 text-xs font-mono font-bold bg-green-600 hover:bg-green-500 text-white rounded-xl transition-all cursor-pointer">
                  Confirm Sourced
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
