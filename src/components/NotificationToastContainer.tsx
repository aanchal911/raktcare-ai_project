import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bell, 
  X, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink, 
  ChevronRight, 
  Sparkles, 
  Hospital, 
  User, 
  Zap,
  Volume2,
  VolumeX,
  Play,
  Share2
} from "lucide-react";
import { BloodGroup, EmergencyRequest } from "../types";

export interface ToastAlert {
  id: string;
  source: "HOSPITAL_PORTAL" | "FAMILY_VAULT" | "MOCK_GATEWAY";
  patientName: string;
  bloodGroup: BloodGroup;
  hospital: string;
  urgency: EmergencyRequest["urgency"];
  unitsNeeded: number;
}

interface NotificationToastContainerProps {
  toasts: ToastAlert[];
  onRemoveToast: (id: string) => void;
  onExploreDonors: (group: BloodGroup) => void;
  onSimulateSOS: (request: EmergencyRequest) => void;
}

// Futurist melodic synth alert chime using continuous Web Audio api
export function playNotificationSynthSound() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Play dual pulse harmonious chime
    const playChime = (freq: number, startTime: number, duration: number, gainLevel: number) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      
      gainNode.gain.setValueAtTime(gainLevel, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = audioCtx.currentTime;
    // A5 chiming sound followed by an elegant E6 octave fifth jump
    playChime(880, now, 0.4, 0.08); 
    playChime(1318.51, now + 0.1, 0.35, 0.06); 
  } catch (error) {
    // Browsers block un-interacted media sound, failing gracefully
  }
}

export function NotificationToastContainer({ 
  toasts, 
  onRemoveToast, 
  onExploreDonors,
  onSimulateSOS
}: NotificationToastContainerProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [emulatorVisible, setEmulatorVisible] = useState(false);
  const [customFormActive, setCustomFormActive] = useState(false);
  
  // Custom simulation target builders
  const [customName, setCustomName] = useState("");
  const [customGroup, setCustomGroup] = useState<BloodGroup>("O-");
  const [customHospital, setCustomHospital] = useState("Amul Trust General Hospital, Anand");
  const [customUrgency, setCustomUrgency] = useState<EmergencyRequest["urgency"]>("Critical (Immediate)");
  const [customUnits, setCustomUnits] = useState(3);

  const hospitals = [
    "Zydus Hospital, Anand",
    "Krishna Shalby Hospital, Anand",
    "Charutar Arogya Mandal Hospital, Anand",
    "Amul Trust General Hospital, Anand",
    "Apex Heart Institute, Anand"
  ];

  const randomNames = [
    "Vikram Shah", "Siddharth Mehta", "Anjali Patel", "Rajesh Sharma", 
    "Suresh Solanki", "Kavita Amin", "Nikhil Bhatt", "Priyanka Parmar"
  ];

  const handleSimulateQuickRequest = (type: "O_ACCIDENT" | "AB_PEDIATRIC" | "B_SURGERY") => {
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    let simulated: EmergencyRequest;

    if (type === "O_ACCIDENT") {
      simulated = {
        id: `req-sim-${Date.now()}`,
        patientName: randomName,
        bloodGroup: "O-",
        hospital: "Zydus Hospital, Anand",
        urgency: "Critical (Immediate)",
        unitsNeeded: 4,
        timestamp: new Date().toISOString(),
        status: "Pending"
      };
    } else if (type === "AB_PEDIATRIC") {
      simulated = {
        id: `req-sim-${Date.now()}`,
        patientName: `${randomName} (Pediatric)`,
        bloodGroup: "AB-",
        hospital: "Krishna Shalby Hospital, Anand",
        urgency: "High (Within 6 Hrs)",
        unitsNeeded: 1,
        timestamp: new Date().toISOString(),
        status: "Pending"
      };
    } else {
      simulated = {
        id: `req-sim-${Date.now()}`,
        patientName: randomName,
        bloodGroup: "B+",
        hospital: "Apex Heart Institute, Anand",
        urgency: "Standard (Within 24 Hrs)",
        unitsNeeded: 2,
        timestamp: new Date().toISOString(),
        status: "Pending"
      };
    }

    if (soundEnabled) {
      playNotificationSynthSound();
    }
    onSimulateSOS(simulated);
  };

  const handleFormSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const simulated: EmergencyRequest = {
      id: `req-sim-${Date.now()}`,
      patientName: customName,
      bloodGroup: customGroup,
      hospital: customHospital,
      urgency: customUrgency,
      unitsNeeded: Number(customUnits) || 2,
      timestamp: new Date().toISOString(),
      status: "Pending"
    };

    if (soundEnabled) {
      playNotificationSynthSound();
    }
    onSimulateSOS(simulated);
    setCustomFormActive(false);
    setCustomName("");
  };

  return (
    <>
      {/* 1. TOAST ALERTS STACK CONTAINER - Anchored to bottom-right for Apple Vision ergonomic styling */}
      <div className="fixed bottom-6 right-6 z-50 w-full max-w-[380px] p-4 pointer-events-none flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const urgencyBg = 
              toast.urgency === "Critical (Immediate)" 
                ? "bg-red-500/10 border-red-500/30 text-red-400"
                : toast.urgency === "High (Within 6 Hrs)"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  : "bg-blue-500/10 border-blue-500/30 text-blue-400";

            return (
              <motion.div
                key={toast.id}
                id={`toast-alert-${toast.id}`}
                layout
                initial={{ opacity: 0, y: 35, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="pointer-events-auto w-full bg-[#060303]/90 backdrop-blur-2xl border border-red-500/20 rounded-2xl p-4.5 shadow-[0_20px_50px_rgba(239,68,68,0.25)] relative overflow-hidden flex flex-col gap-3 group"
              >
                {/* Visual red neon scanner line */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_8px_#ef4444] animate-pulse" />

                {/* Toast Header Info block */}
                <div className="flex gap-3 justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-red-650/10 rounded-xl border border-red-500/20 flex items-center justify-center animate-pulse">
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 font-extrabold tracking-widest block uppercase">
                        🔴 REMOTE INGRESS SOS
                      </span>
                      <span className="text-[10px] font-mono text-slate-350 font-semibold block uppercase">
                        New Push notification
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    id={`btn-close-toast-${toast.id}`}
                    onClick={() => onRemoveToast(toast.id)}
                    className="text-slate-500 hover:text-white p-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Patient / Sourcing details card in Toast */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex justify-between items-center gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-200 block flex items-center gap-1">
                      <User className="w-3 h-3 text-red-400" />
                      {toast.patientName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block flex items-center gap-1">
                      <Hospital className="w-3 h-3 text-slate-500" />
                      {toast.hospital}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded border ${urgencyBg}`}>
                        {toast.urgency}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 font-bold">
                        {toast.unitsNeeded} units needed
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center bg-red-950/20 border border-red-500/20 px-3 py-2 rounded-xl h-14 w-14 shrink-0">
                    <span className="text-[8px] font-mono tracking-wider text-red-400 text-center uppercase font-bold block leading-none mb-0.5">REQ</span>
                    <span className="text-xl font-bold text-white tracking-tight leading-none">{toast.bloodGroup}</span>
                  </div>
                </div>

                {/* Actions array */}
                <div className="flex items-center gap-2 pt-1 font-mono text-[10.5px]">
                  <button
                    id={`btn-explore-donors-toast-${toast.id}`}
                    onClick={() => {
                      onExploreDonors(toast.bloodGroup);
                      onRemoveToast(toast.id);
                    }}
                    className="flex-1 py-1.5 bg-red-650 hover:bg-red-600 text-white font-bold rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer shadow-md"
                  >
                    <span>Match Donors Now</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  
                  <button
                    id={`btn-dismiss-toast-${toast.id}`}
                    onClick={() => onRemoveToast(toast.id)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-350 hover:text-white rounded-lg transition-colors text-center cursor-pointer font-bold border border-white/5"
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 2. PERSISTENT COLLAPSIBLE EMULATOR PANEL - Anchored in bottom-left */}
      <div className="fixed bottom-6 left-6 z-50 font-mono text-xs">
        
        <AnimatePresence>
          {emulatorVisible && (
            <motion.div
              id="sos-emulator-drawer"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0c0808]/95 backdrop-blur-2xl border border-red-500/15 rounded-2xl p-4.5 w-[320px] shadow-[0_15px_35px_rgba(0,0,0,0.8)] mb-3 space-y-3"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-[10px] font-extrabold tracking-widest text-red-400 block uppercase flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                  SOS Ingress Emulator
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    id="btn-toggle-sound"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                    title={soundEnabled ? "Mute Alert Sound" : "Unmute Alert Sound"}
                  >
                    {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-green-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                  </button>
                  
                  <button
                    id="btn-close-emulator"
                    onClick={() => setEmulatorVisible(false)}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <span className="text-[9.5px] text-slate-400 block leading-relaxed mb-1">
                Fires mock network package transmissions which arrive raw over simulated web socket endpoints. Use this tool with other active view modes to test live response layouts.
              </span>

              {!customFormActive ? (
                <div className="space-y-1.5">
                  <button
                    id="btn-sim-o-accident"
                    onClick={() => handleSimulateQuickRequest("O_ACCIDENT")}
                    className="w-full text-left p-2 rounded-xl bg-white/5 border border-white/5 hover:border-red-500/30 hover:bg-white/10 text-slate-200 hover:text-white transition-all flex justify-between items-center cursor-pointer group"
                  >
                    <span className="truncate">💥 Simulate Road Trauma [O-]</span>
                    <Play className="w-3 h-3 text-red-500 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  
                  <button
                    id="btn-sim-ab-pediatric"
                    onClick={() => handleSimulateQuickRequest("AB_PEDIATRIC")}
                    className="w-full text-left p-2 rounded-xl bg-white/5 border border-white/5 hover:border-red-500/30 hover:bg-white/10 text-slate-200 hover:text-white transition-all flex justify-between items-center cursor-pointer group"
                  >
                    <span className="truncate">👶 Pediatric Crisis [AB-]</span>
                    <Play className="w-3 h-3 text-[#3b82f6] group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    id="btn-sim-b-surgery"
                    onClick={() => handleSimulateQuickRequest("B_SURGERY")}
                    className="w-full text-left p-2 rounded-xl bg-white/5 border border-white/5 hover:border-red-500/30 hover:bg-white/10 text-slate-200 hover:text-white transition-all flex justify-between items-center cursor-pointer group"
                  >
                    <span className="truncate">🏥 Heart Surgery Urgent [B+]</span>
                    <Play className="w-3 h-3 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    id="btn-sim-custom-form"
                    onClick={() => setCustomFormActive(true)}
                    className="w-full text-center py-2 border border-dashed border-red-500/30 hover:border-red-500 text-red-400 hover:text-white rounded-xl bg-red-650/5 transition-colors cursor-pointer text-xs font-bold font-mono"
                  >
                    ➕ Configure Custom SOS Ingress
                  </button>
                </div>
              ) : (
                <form id="form-ingress-generator" onSubmit={handleFormSimulate} className="space-y-2 text-xs">
                  <div>
                    <label className="text-slate-500 block text-[9px] uppercase font-bold text-left mb-1">Patient Name</label>
                    <input 
                      id="input-sim-name"
                      type="text" 
                      placeholder="e.g., Harish Kumar"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full bg-black border border-white/15 rounded-lg px-2.5 py-1.5 text-slate-100 placeholder-slate-650 focus:border-red-500 outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-500 block text-[9px] uppercase font-bold text-left mb-1">Blood Group</label>
                      <select
                        id="select-sim-group"
                        value={customGroup}
                        onChange={(e) => setCustomGroup(e.target.value as BloodGroup)}
                        className="w-full bg-black border border-white/15 rounded-lg px-2 py-1.5 text-slate-100 outline-none focus:border-red-500 cursor-pointer"
                      >
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-500 block text-[9px] uppercase font-bold text-left mb-1">Units (Pints)</label>
                      <input 
                        id="input-sim-units"
                        type="number" 
                        min="1" 
                        max="8"
                        value={customUnits}
                        onChange={(e) => setCustomUnits(Number(e.target.value))}
                        className="w-full bg-black border border-white/15 rounded-lg px-2.5 py-1 text-slate-100 outline-none focus:border-red-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-500 block text-[9px] uppercase font-bold text-left mb-1">Hospital Destination</label>
                    <select
                      id="select-sim-hospital"
                      value={customHospital}
                      onChange={(e) => setCustomHospital(e.target.value)}
                      className="w-full bg-black border border-white/15 rounded-lg px-2 py-1.5 text-slate-100 outline-none focus:border-red-500 text-[10.5px] cursor-pointer"
                    >
                      {hospitals.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-500 block text-[9px] uppercase font-bold text-left mb-1">Urgency Level</label>
                    <select
                      id="select-sim-urgency"
                      value={customUrgency}
                      onChange={(e) => setCustomUrgency(e.target.value as EmergencyRequest["urgency"])}
                      className="w-full bg-black border border-white/15 rounded-lg px-2 py-1.5 text-slate-100 outline-none focus:border-red-500 text-[10.5px] cursor-pointer"
                    >
                      <option value="Critical (Immediate)">Critical (Immediate)</option>
                      <option value="High (Within 6 Hrs)">High (Within 6 Hrs)</option>
                      <option value="Standard (Within 24 Hrs)">Standard (Within 24 Hrs)</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      id="btn-sim-custom-submit"
                      type="submit"
                      className="flex-1 py-1.5 bg-red-650 hover:bg-red-600 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-red-950/40 transition-all cursor-pointer text-center"
                    >
                      Fire Pack
                    </button>
                    <button
                      id="btn-sim-custom-cancel"
                      type="button"
                      onClick={() => setCustomFormActive(false)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-350 rounded-lg cursor-pointer text-center hover:text-white"
                    >
                      Back
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed floating toggle indicator */}
        <button
          id="btn-emulator-floating-trigger"
          onClick={() => setEmulatorVisible(!emulatorVisible)}
          className={`px-4 py-2.5 rounded-full border shadow-2xl backdrop-blur-xl transition-all cursor-pointer flex items-center gap-2 text-xs font-bold font-mono tracking-wider relative group ${
            emulatorVisible 
              ? "bg-red-950/70 border-red-500/40 text-red-400" 
              : "bg-black/80 border-white/10 text-slate-300 hover:text-white hover:border-red-500/30"
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <Bell className="w-3.5 h-3.5 text-red-400 group-hover:rotate-12 transition-transform" />
          <span>{emulatorVisible ? "Close Control" : "Simulate SOS Ingress"}</span>
        </button>

      </div>
    </>
  );
}
