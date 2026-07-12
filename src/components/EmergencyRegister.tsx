import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getStoredEmergencyRequests, saveEmergencyRequests, CAN_RECEIVE_FROM } from "../data/donors";
import { EmergencyRequest, BloodGroup } from "../types";
import { ShieldAlert, Plus, Activity, CheckCircle2, Clock, Trash2, Hospital } from "lucide-react";

interface EmergencyRegisterProps {
  requests: EmergencyRequest[];
  onSetRequests: React.Dispatch<React.SetStateAction<EmergencyRequest[]>>;
  onSelectSearchGroup: (group: BloodGroup) => void;
  onTransitionToTab: (tab: string) => void;
}

export function EmergencyRegister({ requests, onSetRequests, onSelectSearchGroup, onTransitionToTab }: EmergencyRegisterProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newData, setNewData] = useState<Partial<EmergencyRequest>>({
    patientName: "",
    bloodGroup: "O+",
    hospital: "Zydus Hospital, Anand",
    urgency: "Critical (Immediate)",
    unitsNeeded: 2
  });

  const hospitals = [
    "Krishna Shalby Hospital, Anand",
    "Zydus Hospital, Anand",
    "Charutar Arogya Mandal General Hospital, Anand",
    "Amul Trust General Hospital, Anand",
    "Apex Heart Institute, Anand"
  ];

  const urgencies: EmergencyRequest["urgency"][] = [
    "Critical (Immediate)",
    "High (Within 6 Hrs)",
    "Standard (Within 24 Hrs)"
  ];

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newData.patientName) return;

    const created: EmergencyRequest = {
      id: `req-${Date.now()}`,
      patientName: newData.patientName,
      bloodGroup: newData.bloodGroup as BloodGroup,
      hospital: newData.hospital as string,
      urgency: newData.urgency as EmergencyRequest["urgency"],
      unitsNeeded: Number(newData.unitsNeeded) || 1,
      timestamp: new Date().toISOString(),
      status: "Pending"
    };

    const updated = [created, ...requests];
    onSetRequests(updated);
    saveEmergencyRequests(updated);
    setShowAddModal(false);
    setNewData({
      patientName: "",
      bloodGroup: "O+",
      hospital: "Zydus Hospital, Anand",
      urgency: "Critical (Immediate)",
      unitsNeeded: 2
    });
  };

  const handleDeleteRequest = (id: string) => {
    const updated = requests.filter((r) => r.id !== id);
    onSetRequests(updated);
    saveEmergencyRequests(updated);
  };

  const handleToggleStatus = (id: string) => {
    const updated = requests.map((r) => {
      if (r.id === id) {
        const nextStatus: EmergencyRequest["status"] = 
          r.status === "Pending" ? "Sourced" : r.status === "Sourced" ? "Completed" : "Pending";
        return { ...r, status: nextStatus };
      }
      return r;
    });
    onSetRequests(updated);
    saveEmergencyRequests(updated);
  };

  const handleInspectMatchingDonors = (group: BloodGroup) => {
    onSelectSearchGroup(group);
    onTransitionToTab("search");
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-6">
      
      {/* Header SOS */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
          <h2 className="text-lg font-bold text-transparent-gradient tracking-tight">Active Emergency Requests</h2>
        </div>
        <button
          id="btn-trigger-sos-form"
          onClick={() => setShowAddModal(!showAddModal)}
          className="flex items-center gap-1.5 text-xs font-mono bg-red-600 hover:bg-red-550 text-white px-3 py-1.5 rounded-xl font-bold shadow-lg shadow-red-900/20 cursor-pointer transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          LOG SOS ALERT
        </button>
      </div>

      {/* Brief educational notice */}
      <p className="text-xs text-slate-300">
        Broadcasting immediate requirements automatically links to matched biocombat donor catalogs. Coordinate transfusion centers and resolve blood component deliveries.
      </p>

      {/* SOS Creation form block */}
      {showAddModal && (
        <motion.form
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          onSubmit={handleCreateRequest}
          className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-4 shadow-xl"
        >
          <h3 className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
            Dispatch Broadcast parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Patient Name */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">PATIENT IDENTIFIER / NAME</label>
              <input
                id="input-sos-patient"
                type="text"
                required
                value={newData.patientName}
                onChange={(e) => setNewData({ ...newData, patientName: e.target.value })}
                placeholder="Patient Full Name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all"
              />
            </div>

            {/* Blood Type required */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">REQUIRED BLOOD GROUP</label>
              <select
                id="select-sos-blood"
                value={newData.bloodGroup}
                onChange={(e) => setNewData({ ...newData, bloodGroup: e.target.value as BloodGroup })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:bg-white/10"
              >
                {Object.keys(CAN_RECEIVE_FROM).map((g) => (
                  <option key={g} value={g} className="bg-black text-white">{g}</option>
                ))}
              </select>
            </div>

            {/* Hospital Anchor */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">DISPATCH CLINIC / HOSPITAL</label>
              <select
                id="select-sos-clinic"
                value={newData.hospital}
                onChange={(e) => setNewData({ ...newData, hospital: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:bg-white/10"
              >
                {hospitals.map((h) => (
                  <option key={h} value={h} className="bg-black text-white">{h}</option>
                ))}
              </select>
            </div>

            {/* Urgencies and count */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">URGENCY LEVEL</label>
                <select
                  id="select-sos-urgency"
                  value={newData.urgency}
                  onChange={(e) => setNewData({ ...newData, urgency: e.target.value as any })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:bg-white/10"
                >
                  {urgencies.map((u) => (
                    <option key={u} value={u} className="bg-black text-white">{u}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">REQUIRED UNITS (PINTS)</label>
                <input
                  id="input-sos-units"
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={newData.unitsNeeded}
                  onChange={(e) => setNewData({ ...newData, unitsNeeded: Number(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-2 text-xs font-mono pt-2">
            <button
               id="btn-cancel-sos"
               type="button"
               onClick={() => setShowAddModal(false)}
               className="px-3 py-1.5 border border-white/10 bg-white/5 text-slate-450 hover:text-white rounded-lg cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-submit-sos"
              type="submit"
              className="px-4 py-1.5 bg-red-600 hover:bg-red-550 text-white rounded-lg cursor-pointer font-bold shadow-lg"
            >
              Broadcast SOS
            </button>
          </div>
        </motion.form>
      )}

      {/* Requests table listing */}
      <div className="space-y-3.5">
        <AnimatePresence mode="popLayout">
          {requests.length > 0 ? (
            requests.map((req) => {
              const matchedDonationGroups = CAN_RECEIVE_FROM[req.bloodGroup] || [];

              return (
                <motion.div
                  key={req.id}
                  layoutId={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative group hover:border-red-500/35 transition-all"
                >
                  
                  {/* Left Column: patient details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        req.status === "Pending" 
                          ? "bg-red-500 animate-pulse" 
                          : req.status === "Sourced" 
                            ? "bg-amber-400 animate-pulse" 
                            : "bg-green-500"
                      }`} />
                      <h4 className="text-sm font-bold text-slate-100">{req.patientName}</h4>
                      
                      <span className={`px-2 py-0.5 text-[9px] font-semibold font-mono rounded ${
                        req.urgency.startsWith("Critical") 
                          ? "bg-red-950/60 border border-red-900/60 text-red-200" 
                          : req.urgency.startsWith("High")
                            ? "bg-amber-955/65 border border-amber-900/60 text-amber-200"
                            : "bg-white/5 border border-white/10 text-slate-350"
                      }`}>
                        {req.urgency}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 flex items-center gap-1">
                      <Hospital className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      {req.hospital}
                    </p>

                    <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2 pt-0.5">
                      <span>Logged: {new Date(req.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span>Target units: {req.unitsNeeded} Pints</span>
                    </div>
                  </div>

                  {/* Middle Column: Biocompatible matching tags */}
                  <div className="bg-[#120a0a]/50 p-2.5 rounded-xl text-[10px] font-mono border border-red-950/40 text-slate-400 max-w-[190px]">
                    <div className="text-slate-455 mb-1 text-[9px] uppercase tracking-wider">Compatible Donor Pool:</div>
                    <div className="flex flex-wrap gap-1 text-green-300 font-bold">
                      {matchedDonationGroups.map((g) => (
                        <span key={g}>{g}</span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 border-t sm:border-0 border-white/10 pt-3 sm:pt-0">
                    
                    {/* Big blood type item */}
                    <div className="mr-3 text-center">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-widest">REQ Group</span>
                      <span className="font-extrabold text-slate-100 text-lg leading-none">{req.bloodGroup}</span>
                    </div>

                    {/* Toggle Resolve state matches */}
                    <button
                      id={`btn-toggle-status-${req.id}`}
                      onClick={() => handleToggleStatus(req.id)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold cursor-pointer transition-all ${
                        req.status === "Pending"
                          ? "bg-red-650/10 border border-red-500/20 text-red-450 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/20"
                          : req.status === "Sourced"
                            ? "bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/20"
                            : "bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-white/5 hover:border-white/10 hover:text-slate-450"
                      }`}
                    >
                      {req.status === "Pending" && "MARK SOURCED"}
                      {req.status === "Sourced" && "MARK RESOLVED"}
                      {req.status === "Completed" && "REOPEN CONFLICT"}
                    </button>

                    {/* Quick matching search */}
                    <button
                      id={`btn-sos-match-search-${req.id}`}
                      onClick={() => handleInspectMatchingDonors(req.bloodGroup)}
                      className="p-2 border border-white/10 rounded-xl hover:border-red-500/30 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
                      title="Inspect immediate donor candidates"
                    >
                      <Plus className="w-4 h-4 text-red-500" />
                    </button>

                    {/* Remove alert */}
                    <button
                      id={`btn-sos-delete-${req.id}`}
                      onClick={() => handleDeleteRequest(req.id)}
                      className="p-1.5 rounded-lg border border-white/10 hover:border-red-500/30 hover:bg-white/10 text-slate-450 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </motion.div>
              );
            })
          ) : (
            <div className="border border-dashed border-white/15 bg-white/5 rounded-2xl p-10 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto animate-pulse" />
              <h4 className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-widest">
                All queues clear & synchronized
              </h4>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                No active critical donor deficits. Sourcing lines operating at 100% capacity within regional municipalities.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
