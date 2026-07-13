import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CAN_RECEIVE_FROM, CAN_DONATE_TO } from "../data/donors";
import { BloodGroup } from "../types";
import { Sparkles, ArrowRightLeft, ShieldAlert } from "lucide-react";

export function CompatibilityChart() {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>("A+");

  const groups: BloodGroup[] = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

  // Mapping positions on a beautiful polar coordinate circle for floating UI network layout
  const positions: Record<BloodGroup, { x: number; y: number }> = {
    "O-": { x: 50, y: 15 },
    "O+": { x: 80, y: 30 },
    "A-": { x: 85, y: 65 },
    "A+": { x: 60, y: 88 },
    "B-": { x: 30, y: 85 },
    "B+": { x: 12, y: 60 },
    "AB-": { x: 15, y: 30 },
    "AB+": { x: 50, y: 50 } // Universal recipient in center!
  };

  const receiveList = CAN_RECEIVE_FROM[selectedGroup];
  const donateList = CAN_DONATE_TO[selectedGroup];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-bold text-transparent-gradient tracking-tight">Blood Compatibility Visualizer</h2>
        </div>
        <span className="text-[10px] font-mono sky-glow text-red-400 bg-red-950/40 border border-red-900/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
          Biocompatible Map
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Connection Network Ring */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[280px] bg-white/5 rounded-full border border-white/10 p-4">
            
            {/* Base grid lines to center */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
              {/* Render links based on compatibility when hover or selection occurs */}
              {groups.map((g) => {
                const start = positions[g];
                const end = positions[selectedGroup];
                const isCompatible = receiveList.includes(g) || donateList.includes(g);
                
                if (g === selectedGroup) return null;

                return (
                  <line
                    key={`line-${g}`}
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke={
                      receiveList.includes(g) 
                        ? "rgb(34, 197, 94)" // Green for incoming receiver
                        : donateList.includes(g)
                          ? "rgb(239, 68, 68)" // Red for outgoing donor
                          : "rgba(255,255,255,0.03)"
                    }
                    strokeWidth={isCompatible ? "0.8" : "0.2"}
                    strokeDasharray={isCompatible ? "none" : "2"}
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>

            {/* Orbiting Blood Type Nodes */}
            {groups.map((group) => {
              const pos = positions[group];
              const isSelected = selectedGroup === group;
              const isDonor = receiveList.includes(group); // Can donate TO selected group
              const isRecipient = donateList.includes(group); // Selected group can donate TO this group
              
              let ringColor = "border-white/10 bg-white/5 text-slate-400";
              if (isSelected) {
                ringColor = "border-red-500 bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]";
              } else if (isDonor && isRecipient) {
                ringColor = "border-amber-500 bg-amber-950/40 text-amber-300";
              } else if (isDonor) {
                ringColor = "border-green-500 bg-green-950/40 text-green-300";
              } else if (isRecipient) {
                ringColor = "border-red-500/60 bg-red-950/40 text-red-300";
              }

              return (
                <button
                  id={`node-blood-${group}`}
                  onClick={() => setSelectedGroup(group)}
                  key={group}
                  style={{
                    position: "absolute",
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: "translate(-50%, -50%)"
                  }}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-xs select-none transition-all duration-300 backdrop-blur-md cursor-pointer hover:scale-110 z-20 ${ringColor}`}
                >
                  {group}
                </button>
              );
            })}
          </div>
          
          {/* Key guide indicators */}
          <div className="flex flex-wrap gap-4 mt-4 justify-center text-[10px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-655 border border-red-500 inline-block" />
              <span>Selected Type</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-950/60 border border-green-500 inline-block" />
              <span>Can Donate to Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-950/60 border border-red-500/60 inline-block" />
              <span>Can Receive from Selected</span>
            </div>
          </div>
        </div>

        {/* Diagnostic Pane */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#120a0a]/50 rounded-xl p-4 border border-red-955/20">
            <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-widest block mb-1">
              Selected Target
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{selectedGroup}</span>
              <span className="text-xs text-slate-300">
                {selectedGroup === "O-" && "Universal Donor (Critical Resource)"}
                {selectedGroup === "AB+" && "Universal Recipient"}
                {selectedGroup !== "O-" && selectedGroup !== "AB+" && "Standard Recipient Group"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                <span>CAN RECEIVE FROM ({receiveList.length})</span>
                <span className="text-green-455 text-[10px]">Medical Compatibility</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {receiveList.map((g) => (
                  <span
                    key={`rx-${g}`}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-green-950/30 border border-green-900/50 text-green-300 animate-fade-in"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                <span>CAN DONATE TO ({donateList.length})</span>
                <span className="text-red-400 text-[10px]">Distribution Outflow</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {donateList.map((g) => (
                  <span
                    key={`tx-${g}`}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-955/35 border border-red-900/50 text-red-300 animate-fade-in"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Alert Medical Warning for O- is displayed beautifully */}
          {selectedGroup === "O-" && (
            <div className="flex gap-2 bg-amber-955/20 border border-amber-900/40 rounded-xl p-3 text-xs text-amber-250">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300">Universal Donor Constraint:</span> O- donors are highly scarce. Standard clinics dispatch O- in critical emergencies because any recipient can absorb it without antibody rejection.
              </div>
            </div>
          )}
          
          {selectedGroup === "AB+" && (
            <div className="flex gap-2 bg-blue-955/25 border border-blue-900/40 rounded-xl p-3 text-xs text-blue-250">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-blue-300">Universal Recipient:</span> AB+ beneficiaries contain both A and B antigens on red cells, meaning they can safely process infusions from any blood type.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
