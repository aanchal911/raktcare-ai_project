import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { INITIAL_DONORS, predictDonorMetrics, CAN_RECEIVE_FROM } from "../data/donors";
import { BloodGroup, Donor, EmergencyRequest } from "../types";
import { mlService, MLDonorInput, MLPredictionResponse } from "../services/mlService";
import { Search, Compass, ShieldCheck, Phone, CheckCircle, Bell, Volume2, Cpu, UserCheck, Brain } from "lucide-react";

interface DonorSearchProps {
  onAddEmergencyRequest: (newRequest: EmergencyRequest) => void;
  savedFamilyMemberSearchGroup?: BloodGroup;
}

export function DonorSearch({ onAddEmergencyRequest, savedFamilyMemberSearchGroup }: DonorSearchProps) {
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(savedFamilyMemberSearchGroup || "O+");
  const [location, setLocation] = useState("Anand");
  const [radius, setRadius] = useState<number>(10);
  const [availableNowOnly, setAvailableNowOnly] = useState(true);
  const [selectedDonorForAction, setSelectedDonorForAction] = useState<Donor | null>(null);
  const [simulatedDispatchState, setSimulatedDispatchState] = useState<"idle" | "broadcasting" | "dispatched">("idle");
  const [mlPredictions, setMlPredictions] = useState<Map<string, MLPredictionResponse>>(new Map());
  const [isLoadingML, setIsLoadingML] = useState(false);

  // Load ML predictions for all donors
  useEffect(() => {
    const loadMLPredictions = async () => {
      setIsLoadingML(true);
      const predictions = new Map<string, MLPredictionResponse>();
      
      try {
        for (const donor of INITIAL_DONORS) {
          const mlInput = mlService.convertDonorToMLFormat(donor);
          const prediction = await mlService.predictAvailability(mlInput);
          predictions.set(donor.id, prediction);
        }
        setMlPredictions(predictions);
      } catch (error) {
        console.error('Failed to load ML predictions:', error);
      } finally {
        setIsLoadingML(false);
      }
    };

    loadMLPredictions();
  }, []);

  // Filter and score donors using ML predictions and biological rules
  const processedDonors = useMemo(() => {
    // Determine which blood groups can donate to the requested patient group
    const compatibleGroups = CAN_RECEIVE_FROM[bloodGroup] || [];

    return INITIAL_DONORS.map((donor) => {
      // Get ML prediction for this donor
      const mlPrediction = mlPredictions.get(donor.id);
      
      // Calculate traditional metrics as fallback
      const { isMedicallyEligible, medicalEligibilityReason, responseProbability, overallRankScore } = 
        predictDonorMetrics(donor, bloodGroup);

      const isGroupCompatible = compatibleGroups.includes(donor.bloodGroup);

      // Use ML predictions if available, otherwise fallback to traditional scoring
      const finalAvailabilityProb = mlPrediction ? 
        Math.round(mlPrediction.availability_probability * 100) : responseProbability;
      
      const finalDonorScore = mlPrediction ? 
        Math.round(mlPrediction.donor_score * 100) : overallRankScore;

      return {
        ...donor,
        isGroupCompatible,
        isMedicallyEligible,
        medicalEligibilityReason,
        responseProbability: finalAvailabilityProb,
        overallRankScore: finalDonorScore,
        mlPrediction,
        hasMLPrediction: !!mlPrediction
      };
    })
    .filter((donor) => {
      // Group compatibility check is strict for blood recipient transfers
      if (!donor.isGroupCompatible) return false;

      // Distance radius filter
      if (donor.distanceKm > radius) return false;

      // Availability status filter
      if (availableNowOnly && donor.availability !== "Available Now") return false;

      return true;
    })
    // Sort by ML-enhanced overall rank score descending
    .sort((a, b) => b.overallRankScore - a.overallRankScore);

  }, [bloodGroup, radius, availableNowOnly, mlPredictions]);

  const handleRequestDonation = (donor: Donor) => {
    setSelectedDonorForAction(donor);
    setSimulatedDispatchState("broadcasting");
    
    // Simulate satellite-broadcast and notification ping
    setTimeout(() => {
      setSimulatedDispatchState("dispatched");
    }, 2200);
  };

  const finalizeEmergencySourcing = () => {
    if (!selectedDonorForAction) return;

    // Create an automatic emergency request tracker
    const newReq: EmergencyRequest = {
      id: `req-${Date.now()}`,
      patientName: `Self-Lookup Match (${selectedDonorForAction.name})`,
      bloodGroup: selectedDonorForAction.bloodGroup,
      hospital: "Charutar Arogya Mandal General Hospital, Anand",
      urgency: "Critical (Immediate)",
      unitsNeeded: 1,
      timestamp: new Date().toISOString(),
      status: "Sourced"
    };

    onAddEmergencyRequest(newReq);
    setSelectedDonorForAction(null);
    setSimulatedDispatchState("idle");
  };

  return (
    <div className="space-y-6">
      
      {/* Search Filter Bento */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-bold text-transparent-gradient tracking-tight">AI Smart Donor Finder</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          {/* Input A: Blood Group */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
              Patient Blood Group
            </label>
            <select
              id="select-search-blood"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500 transition-all focus:bg-white/10"
            >
              {Object.keys(CAN_RECEIVE_FROM).map((group) => (
                <option key={group} value={group} className="bg-black text-slate-100">
                  {group} (Needs donor matching)
                </option>
              ))}
            </select>
          </div>

          {/* Input B: Location */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
              Emergency Location
            </label>
            <input
              id="input-search-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Anand"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-all focus:bg-white/10"
            />
          </div>

          {/* Input C: Radius range */}
          <div>
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1.5">
              <span className="uppercase tracking-widest">Radius Limit</span>
              <span className="text-red-400 font-semibold">{radius} km</span>
            </div>
            <input
              id="range-search-radius"
              type="range"
              min="2"
              max="25"
              step="1"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>

          {/* Filters: Toggle Availability check */}
          <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
            <input
              id="check-search-available"
              type="checkbox"
              checked={availableNowOnly}
              onChange={(e) => setAvailableNowOnly(e.target.checked)}
              className="w-4 h-4 text-red-600 bg-white/5 border-white/20 rounded focus:ring-0 cursor-pointer accent-red-500"
            />
            <label
              htmlFor="check-search-available"
              className="text-xs font-medium text-slate-300 cursor-pointer select-none"
            >
              Available Now Only
            </label>
          </div>

        </div>

        {/* Informative biological helper warning */}
        <div className="mt-4 border-t border-white/10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5 text-neutral-300">
            <Brain className="w-4 h-4 text-red-500" />
            <span>ML-Enhanced Biocompatibility: {isLoadingML ? 'Loading predictions...' : 'XGBoost models active'}</span>
          </div>
          <div>
            Compatible Donor Groups for {bloodGroup}:{" "}
            <span className="text-green-400 font-bold">{CAN_RECEIVE_FROM[bloodGroup]?.join(", ")}</span>
          </div>
        </div>
      </div>

      {/* Recommended Donors List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-widest font-mono">
            Analyzed & Recommended Donors ({processedDonors.length})
          </h3>
          <span className="text-[10px] text-neutral-500 font-mono">Sorted by availability & wait score</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout text-muted-foreground">
            {processedDonors.length > 0 ? (
              processedDonors.map((donor, index) => {
                const isRankOne = index === 0 && donor.overallRankScore > 65;
                const isUnderWait = !donor.isMedicallyEligible;

                return (
                  <motion.div
                    key={donor.id}
                    layoutId={donor.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 flex flex-col justify-between hover:border-red-500/30 hover:bg-white/10 transition-all duration-350 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden group"
                  >
                    
                    {/* Glowing highlight border on first item */}
                    {isRankOne && (
                      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-550 via-red-430 to-red-600 shadow-[0_4px_12px_rgba(239,68,68,0.4)]" />
                    )}

                    <div>
                      {/* Donor name & Rank Badge */}
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-slate-100 group-hover:text-red-400 transition-colors">
                              {donor.name}
                            </h4>
                            <span className="px-2 py-0.5 text-[9px] font-bold font-mono rounded bg-white/5 border border-white/10 text-slate-350">
                              {donor.age} yrs
                            </span>
                          </div>
                          <span className="text-xs text-slate-450 flex items-center gap-1 font-mono mt-0.5">
                            <Compass className="w-3.5 h-3.5 text-slate-500" />
                            {donor.location} • {donor.distanceKm} km away
                          </span>
                        </div>

                        {/* Large Blood Group Badge */}
                        <span className="w-11 h-11 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400 font-extrabold flex items-center justify-center font-sans tracking-tighter text-lg shadow-inner">
                          {donor.bloodGroup}
                        </span>
                      </div>

                      {/* ML scoring row */}
                      <div className="grid grid-cols-3 gap-2 bg-[#120a0a]/50 p-2.5 rounded-xl border border-red-950/40 text-[11px] font-mono mt-3">
                        <div className="text-center">
                          <span className="text-slate-400 block uppercase text-[8px] tracking-wider mb-0.5">Response Probability</span>
                          <span className="font-bold text-green-455 text-xs">
                            {donor.responseProbability}%
                          </span>
                        </div>
                        <div className="text-center border-x border-white/5">
                          <span className="text-slate-400 block uppercase text-[8px] tracking-wider mb-0.5">Availability ML Rank</span>
                          <span className="font-bold text-amber-400 text-xs">
                            #{index + 1}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="text-slate-400 block uppercase text-[8px] tracking-wider mb-0.5">Aggregate Match</span>
                          <span className="font-bold text-red-400 text-xs text-glow">
                            {donor.overallRankScore}/100
                          </span>
                        </div>
                      </div>

                      {/* Medical Eligibility disclaimer / spacing check */}
                      {isUnderWait ? (
                        <div className="mt-3 text-[10px] text-yellow-400/80 bg-yellow-950/20 border border-yellow-900/30 p-2 rounded-xl">
                          ⚠️ {donor.medicalEligibilityReason}
                        </div>
                      ) : (
                        <div className="mt-3 text-[10px] text-green-400/80 bg-green-950/20 border border-green-900/30 p-2 rounded-xl flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Last donation: {donor.lastDonationDate}. Replenished & ready.</span>
                        </div>
                      )}
                    </div>

                    {/* Quick action controls */}
                    <div className="flex gap-2 mt-4 border-t border-white/10 pt-3.5">
                      <a
                        href={`tel:${donor.phone}`}
                        className="p-2 border border-white/10 rounded-xl hover:border-red-500/30 hover:bg-white/10 text-slate-300 transition-colors flex items-center justify-center cursor-pointer"
                        title="Direct Contact Voice Line"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <button
                        id={`btn-request-donor-${donor.id}`}
                        onClick={() => handleRequestDonation(donor)}
                        disabled={isUnderWait}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold font-mono tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          isUnderWait 
                            ? "bg-white/5 border border-white/5 text-slate-600 cursor-not-allowed" 
                            : index === 0
                              ? "bg-red-600 text-white shadow-[0_4px_12px_rgba(239,68,68,0.3)] hover:bg-red-500"
                              : "bg-white/10 border border-white/10 text-slate-100 hover:bg-white/15"
                        }`}
                      >
                        <Bell className="w-3.5 h-3.5" />
                        REQUEST INFINITE DISPATCH
                      </button>
                    </div>

                  </motion.div>
                );
              })
            ) : (
              <div className="md:col-span-2 bg-neutral-950/50 border border-white/5 rounded-2xl p-10 text-center space-y-2">
                <Search className="w-8 h-8 text-neutral-600 mx-auto" />
                <h4 className="text-sm font-semibold text-neutral-300 font-mono uppercase tracking-widest">
                  Zero biocompatible donors found
                </h4>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  Adjust range sliders beyond {radius} km or toggle "Available Now Only" to matching wider regional blood banks.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* DISPATCH SCREEN SIMULATOR MODAL */}
      {selectedDonorForAction && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/5 backdrop-blur-2xl border border-white/15 rounded-2xl max-w-md w-full p-6 text-center space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative overflow-hidden"
          >
            {/* Holographic scanner wave effect */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-red-500 animate-[bounce_2.5s_infinite] opacity-30" />

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-widest block bg-red-600/10 border border-red-500/20 py-1 rounded-md px-3 mx-auto w-fit">
                HOLOGRAPHIC SATELLITE DISPATCH
              </span>
              <h3 className="text-lg font-bold text-slate-100">Connecting Local LifeFlow Receiver Matrix</h3>
            </div>

            <div className="relative py-4 flex items-center justify-center">
              {simulatedDispatchState === "broadcasting" ? (
                <div className="space-y-3">
                  <div className="relative w-20 h-20 mx-auto bg-red-950/45 rounded-full border border-red-500/30 flex items-center justify-center">
                    <Volume2 className="w-8 h-8 text-red-500 animate-[ping_1.2s_infinite]" />
                  </div>
                  <p className="text-xs font-mono text-red-450 animate-pulse">
                    Broadcasting urgent compatibility request to <strong>{selectedDonorForAction.name}</strong>...
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-20 h-20 mx-auto bg-green-950/40 rounded-full border border-green-500/30 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <p className="text-xs font-mono text-green-300">
                    Emergency Alert successfully received & acknowledged in background!
                  </p>
                </div>
              )}
            </div>

            <div className="bg-black/40 p-4 rounded-xl text-left border border-white/10 space-y-1.5 text-xs font-mono">
              <div className="text-slate-400">Recipient Group Requested: <span className="text-slate-100 font-bold">{bloodGroup}</span></div>
              <div className="text-slate-400">Target Donor Group: <span className="text-slate-100 font-bold">{selectedDonorForAction.bloodGroup}</span></div>
              <div className="text-slate-400">Response Probability: <span className="text-slate-100 font-bold">{selectedDonorForAction.responseProbability}%</span></div>
              <div className="text-slate-400">Sourcing Hospital: <span className="text-slate-100 font-bold">Charutar Arogya Mandal Hospital</span></div>
            </div>

            <div className="flex gap-3">
              <button
                id="btn-close-dispatch-cancel"
                onClick={() => setSelectedDonorForAction(null)}
                className="flex-1 py-2 text-xs font-mono font-bold border border-white/10 hover:border-white/20 text-slate-400 hover:text-white rounded-xl bg-white/5 transition-all cursor-pointer"
              >
                Abort
              </button>
              
              {simulatedDispatchState === "dispatched" && (
                <button
                  id="btn-confirm-source-alert"
                  onClick={finalizeEmergencySourcing}
                  className="flex-1 py-2 text-xs font-mono font-bold bg-green-600 hover:bg-green-550 text-white rounded-xl shadow-lg hover:shadow-green-900/30 transition-all cursor-pointer"
                >
                  Verify Sourced
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
