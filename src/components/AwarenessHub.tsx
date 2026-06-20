import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, RefreshCw, Milestone, Sparkles, Check, X, ShieldCheck } from "lucide-react";

export function AwarenessHub() {
  const [activeTab, setActiveTab] = useState<"myths" | "recovery" | "timeline">("myths");
  const [currentMythIndex, setCurrentMythIndex] = useState(0);

  const mythsList = [
    {
      myth: "Blood donation makes your body permanently weak or cuts down immunity.",
      fact: "Most healthy adults contain approximately 10 pints of blood. A standard whole blood donation consumes only 1 pint (about 10%). Your physiological systems initiate direct replacement immediately. Immunity remains intact as white cells are rapidly recycled and replenished.",
      detail: "Your bone marrow constantly manufactures brand new cells. The fluid volume you donate is fully replenished within 24-48 hours with adequate hydration!"
    },
    {
      myth: "The donation procedure takes hours and is extremely painful.",
      fact: "The actual extraction phase takes just 8 to 10 minutes. The preliminary pinch of the sterile needle is brief, equivalent to a minor rubber band snap.",
      detail: "Including check-in, brief medical screening, and post-donation snacks and recovery, the whole premium experience wraps up smoothly in under 45 minutes."
    },
    {
      myth: "People on blood pressure or cholesterol medication can never donate.",
      fact: "As long as your cardiovascular stats are managed and stable under medicine, you are generally fully eligible to donate!",
      detail: "Our medical specialists conduct a rapid non-invasive check of your blood pressure and iron levels prior to entry to guarantee secure safety profiles."
    }
  ];

  const timelineSteps = [
    {
      day: "Day 0",
      title: "Heroic Donation",
      description: "You donate 1 pint of whole blood. Your liver and kidneys instantly register the fluid change.",
      recoveryPercent: 0,
      badge: "Extraction Phase"
    },
    {
      day: "24 Hours",
      title: "Fluid Replenishment",
      description: "Hydration starts correcting plasma deficit. Plasma volume is almost fully restored.",
      recoveryPercent: 30,
      badge: "Plasma Surge"
    },
    {
      day: "3 Days",
      title: "Plasma Restored",
      description: "Liquid component is 100% replaced. Your cardiovascular system regains standard volume levels.",
      recoveryPercent: 50,
      badge: "Volume Equalized"
    },
    {
      day: "7 Days",
      title: "Platelets Synthesized",
      description: "Platelets are fully restored under the stimulus of the hormone Thrombopoietin.",
      recoveryPercent: 75,
      badge: "Platelets Restored"
    },
    {
      day: "4-8 Weeks",
      title: "Red Blood Cells Replaced",
      description: "Erythropoietin (kidney hormone) stimulates bone marrow to fully replace lost red blood cells.",
      recoveryPercent: 100,
      badge: "Full Cellular Renewal"
    }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-6">
      
      {/* Structural Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-500 animate-pulse" />
            <h2 className="text-lg font-bold text-transparent-gradient tracking-tight">Awareness & Rehabilitation Hub</h2>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">Demystifying physiological recovery & heroic wellness</p>
        </div>

        {/* Tab Controls */}
        <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 text-xs text-slate-300">
          <button
            onClick={() => setActiveTab("myths")}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all ${
              activeTab === "myths" ? "bg-red-650 text-white shadow-md font-semibold" : "hover:text-white hover:bg-white/5"
            }`}
          >
            Myth vs Fact
          </button>
          <button
            onClick={() => setActiveTab("recovery")}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all ${
              activeTab === "recovery" ? "bg-red-650 text-white shadow-md font-semibold" : "hover:text-white hover:bg-white/5"
            }`}
          >
            Body Recovery
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all ${
              activeTab === "timeline" ? "bg-red-650 text-white shadow-md font-semibold" : "hover:text-white hover:bg-white/5"
            }`}
          >
            Animated Timeline
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="min-h-[220px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: Myth vs Fact Slider */}
          {activeTab === "myths" && (
            <motion.div
              key="myths"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Myth Card */}
                <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-red-400">
                      <X className="w-4 h-4" />
                      <span className="text-xs font-mono font-bold tracking-wider uppercase">COMMON MYTH</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-100 leading-relaxed italic">
                      "{mythsList[currentMythIndex].myth}"
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-405 font-mono mt-4">
                    Visual Lesson {currentMythIndex + 1} of {mythsList.length}
                  </div>
                </div>

                {/* Fact Card */}
                <div className="bg-green-955/20 border border-green-500/20 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-green-400">
                      <Check className="w-4 h-4" />
                      <span className="text-xs font-mono font-bold tracking-wider uppercase">BIOLOGICAL FACT</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed font-semibold">
                      {mythsList[currentMythIndex].fact}
                    </p>
                    <p className="text-xs text-slate-400 mt-2 border-t border-white/10 pt-2">
                      {mythsList[currentMythIndex].detail}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      id="btn-prev-myth"
                      onClick={() => setCurrentMythIndex((prev) => (prev > 0 ? prev - 1 : mythsList.length - 1))}
                      className="text-[11px] font-mono hover:text-red-400 cursor-pointer text-slate-400 px-3 py-1.5 rounded-lg border border-white/10 hover:border-red-500/30 bg-white/5 transition-all"
                    >
                      Prev
                    </button>
                    <button
                      id="btn-next-myth"
                      onClick={() => setCurrentMythIndex((prev) => (prev < mythsList.length - 1 ? prev + 1 : 0))}
                      className="text-[11px] font-mono hover:text-red-400 cursor-pointer text-white px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-600/20 transition-all font-bold"
                    >
                      Next Fact
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 2: physiological Recovery Elements */}
          {activeTab === "recovery" && (
            <motion.div
              key="recovery"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              
              {/* Card A: Red Blood Cells */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col justify-between space-y-4 hover:bg-white/10 transition-all">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-3 h-3 rounded-full bg-red-600 border border-red-500" />
                    <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider">Red Blood Cells (RBC)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Erythrocytes transport critical oxygen from lungs to rest of the body tissue.
                  </p>
                </div>
                <div className="space-y-2 border-t border-white/10 pt-3">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Stimulus Hormone</span>
                    <span className="text-red-300 font-semibold">Erythropoietin</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Time Window</span>
                    <span className="text-white font-medium">4–8 Weeks</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-red-600 h-full rounded-full" style={{ width: "35%" }} />
                  </div>
                </div>
              </div>

              {/* Card B: Platelets */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col justify-between space-y-4 hover:bg-white/10 transition-all">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-400" />
                    <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">Platelets</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Tiny cell fragments responsible for natural blood clotting and physical vessel sealing.
                  </p>
                </div>
                <div className="space-y-2 border-t border-white/10 pt-3">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Stimulus Hormone</span>
                    <span className="text-amber-300 font-semibold">Thrombopoietin</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Time Window</span>
                    <span className="text-white font-medium">~7 Days</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: "80%" }} />
                  </div>
                </div>
              </div>

              {/* Card C: Plasma */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col justify-between space-y-4 hover:bg-white/10 transition-all">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500 border border-blue-400" />
                    <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">Plasma (Fluids)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Yellowish liquid component that is 90% water. Transports waste, proteins, and minerals.
                  </p>
                </div>
                <div className="space-y-2 border-t border-white/10 pt-3">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Stimulus Trigger</span>
                    <span className="text-blue-300 font-semibold">Inferred Hydration</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Time Window</span>
                    <span className="text-white font-medium">24–48 Hours</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 3: Dynamic Recovery Timeline */}
          {activeTab === "timeline" && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Timeline Stepper map */}
              <div className="relative group pl-6 border-l-2 border-white/15 ml-4 space-y-6 py-2">
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="relative">
                    {/* Node Dot */}
                    <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-black border-2 border-red-500 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    </span>

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 pl-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-red-400 px-1.5 py-0.5 rounded bg-red-950/40 border border-red-500/20">
                            {step.day}
                          </span>
                          <h4 className="text-sm font-semibold text-slate-150">{step.title}</h4>
                          <span className="text-[9px] font-mono text-slate-500">{step.badge}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 max-w-xl">
                          {step.description}
                        </p>
                      </div>

                      {/* Visual Progress percentage */}
                      <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-300">
                        <span>Recovery Ratio:</span>
                        <span className={step.recoveryPercent === 100 ? "text-green-455" : "text-amber-400"}>
                          {step.recoveryPercent}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
