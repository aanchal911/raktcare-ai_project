import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { TrendingUp, BarChart3, MapPin, Activity, HelpCircle, ShieldAlert, Cpu, Brain } from "lucide-react";
import { mlService } from "../services/mlService";

export function AnalyticsHub() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [modelInfo, setModelInfo] = useState<any>(null);

  useEffect(() => {
    mlService.getModelInfo().then(setModelInfo).catch(() => {});
  }, []);

  // Chart 1 Data: Most needed blood groups (Demand index)
  const groupDemand = [
    { group: "O-", index: 94, color: "bg-red-500", style: "#ef4444" },
    { group: "O+", index: 82, color: "bg-red-600", style: "#dc2626" },
    { group: "B+", index: 76, color: "bg-amber-500", style: "#f59e0b" },
    { group: "A+", index: 68, color: "bg-red-700", style: "#b91c1c" },
    { group: "AB-", index: 54, color: "bg-neutral-600", style: "#525252" },
    { group: "B-", index: 48, color: "bg-neutral-500", style: "#737373" }
  ];

  // Chart 2 Data: Weekly registered collections vs emergency requirements
  // We'll generate a custom SVG path mathematically representing bezier waves!
  const weeks = ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7"];
  const collections = [34, 45, 38, 59, 72, 65, 84];
  const requests = [40, 38, 48, 52, 60, 58, 62];

  // Compute SVG Points for cubic bezier curve fitting
  const svgWidth = 320;
  const svgHeight = 110;
  const colPoints = collections.map((val, idx) => ({
    x: (idx / (collections.length - 1)) * (svgWidth - 20) + 10,
    y: svgHeight - ((val / 100) * (svgHeight - 20) + 10)
  }));
  const reqPoints = requests.map((val, idx) => ({
    x: (idx / (requests.length - 1)) * (svgWidth - 20) + 10,
    y: svgHeight - ((val / 100) * (svgHeight - 20) + 10)
  }));

  // Build the SVG path strings
  const buildPathString = (pts: { x: number; y: number }[]) => {
    return pts.reduce((acc, p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = pts[i - 1];
      const cx1 = prev.x + (p.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (p.x - prev.x) / 2;
      const cy2 = p.y;
      return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`;
    }, "");
  };

  const colPath = buildPathString(colPoints);
  const reqPath = buildPathString(reqPoints);

  return (
    <div className="space-y-6">
      
      {/* Structural summary header */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">System Forecast</span>
          <h3 className="text-xl font-bold text-white tracking-tight">92.4% Match Rate</h3>
          <p className="text-xs text-slate-400">Predicted donor availability within 10km grid</p>
        </div>
        <div className="space-y-1 border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Peak Demand Group</span>
          <h3 className="text-xl font-bold text-transparent-gradient tracking-tight">O- Negative</h3>
          <p className="text-xs text-red-400 font-medium">Urgency level: CRITICAL</p>
        </div>
        <div className="space-y-1 border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Weekly Sourced Units</span>
          <h3 className="text-xl font-bold text-green-455">124 Units</h3>
          <p className="text-xs text-slate-400">+14.2% increase compared to past cycle</p>
        </div>
        <div className="space-y-1 border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Regional Active Donors</span>
          <h3 className="text-xl font-bold text-amber-500">2,451 Active</h3>
          <p className="text-xs text-slate-400">88% connected to immediate SMS alerts</p>
        </div>
      </div>

      {/* ML Model Status Panel */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-red-500" />
          <h4 className="text-sm font-bold text-transparent-gradient font-mono uppercase tracking-wider">ML Model Performance</h4>
          <span className={`ml-auto text-[9px] font-mono px-2 py-0.5 rounded border ${
            modelInfo && !modelInfo.error 
              ? 'bg-green-950/40 text-green-400 border-green-500/20' 
              : 'bg-amber-950/40 text-amber-400 border-amber-500/20'
          }`}>
            {modelInfo && !modelInfo.error ? 'LIVE' : 'FALLBACK MODE'}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          {[
            { label: 'Availability Model', value: 'XGBoost CLF', sub: 'F1: 0.7457 · AUC: 0.8607' },
            { label: 'Frequency Model', value: 'XGBoost REG', sub: 'R²: 0.5556 · MAE: 0.3987' },
            { label: 'Compatibility Engine', value: 'Rule-Based', sub: '64-entry lookup table' },
            { label: 'Donor Ranking', value: 'RaktScore', sub: '4-factor composite formula' }
          ].map((item) => (
            <div key={item.label} className="bg-black/30 rounded-xl p-3 border border-white/5">
              <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-1">{item.label}</span>
              <span className="font-bold text-slate-100 block">{item.value}</span>
              <span className="text-slate-500 text-[9px] block mt-0.5">{item.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Charts Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CHART A: Most needed blood groups (Bar block) */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-red-500" />
                <h4 className="text-sm font-bold text-transparent-gradient font-mono uppercase tracking-wider">Demand Index (Shortage %)</h4>
              </div>
              <span className="text-[9px] font-mono text-slate-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded">Live status</span>
            </div>

            <div className="space-y-3.5">
              {groupDemand.map((d, idx) => (
                <div
                   key={d.group}
                   className="space-y-1.5"
                   onMouseEnter={() => setHoveredIndex(idx)}
                   onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-200">{d.group} Group</span>
                    <span className="font-mono text-slate-400 font-semibold">{d.index}% scarce</span>
                  </div>
                  <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden border border-white/5 relative p-0.5">
                    <motion.div
                       initial={{ width: 0 }}
                       animate={{ width: `${d.index}%` }}
                       transition={{ duration: 1.2, ease: "easeOut" }}
                       className={`h-full rounded-full transition-all duration-300 ${d.color} ${
                         hoveredIndex === idx ? "brightness-125 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : ""
                       }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex gap-2 text-[10px] font-mono text-slate-500">
            <Cpu className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>AI Predictor weight: O- is highly scarce; clinical reserves cataloged critical.</span>
          </div>
        </div>

        {/* CHART B: Cubic bezier area chart for registered donations vs emergency requisitions */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <h4 className="text-sm font-bold text-transparent-gradient font-mono uppercase tracking-wider">Weekly Inflow/Outflow Trends</h4>
              </div>
              <span className="text-[9px] font-mono text-green-400 bg-green-950/20 border border-green-500/20 px-2 py-0.5 rounded uppercase">Optimizing</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Tracking blood units donated vs. emergency requests logged per week</p>

            {/* Custom SVG Line Chart with glow effects */}
            <div className="bg-black/40 rounded-xl p-3 border border-white/10">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible select-none">
                <defs>
                  {/* Glowing line patterns */}
                  <filter id="glow-green" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="glow-red" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Grid guidelines */}
                <line x1="10" y1="10" x2={svgWidth - 10} y2="10" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                <line x1="10" y1="55" x2={svgWidth - 10} y2="55" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                <line x1="10" y1="100" x2={svgWidth - 10} y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

                {/* Render Curves */}
                <path d={colPath} fill="none" stroke="#22c55e" strokeWidth="2" filter="url(#glow-green)" />
                <path d={reqPath} fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="3" filter="url(#glow-red)" />

                {/* Scatter markers */}
                {colPoints.map((pt, i) => (
                  <circle key={`colDot-${i}`} cx={pt.x} cy={pt.y} r="3" fill="#22c55e" />
                ))}
                {reqPoints.map((pt, i) => (
                  <circle key={`reqDot-${i}`} cx={pt.x} cy={pt.y} r="3" fill="#ef4444" />
                ))}
              </svg>

              {/* Chart Legend */}
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1.5 bg-green-500 rounded-full" />
                  <span>Donations (Volunteers)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1.5 bg-red-500 rounded-full border-dashed" />
                  <span>SOS Requests</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-4 border-t border-white/10 pt-2">
            <span>Cycle Range: 7 Weeks</span>
            <span className="text-slate-400">Updated: Today 11:45 AM</span>
          </div>
        </div>

        {/* CHART C: Emergency diagnostic radar map / Hospital coordinate locator */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col justify-between md:col-span-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-12 xl:col-span-5 space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500 animate-pulse" />
                <h4 className="text-sm font-bold text-transparent-gradient font-mono uppercase tracking-wider">Emergency Hotspot Grid</h4>
              </div>
              <p className="text-xs text-slate-350 leading-relaxed">
                Holographic mapping coordinates tracking live emergency requirements in Anand municipality and surrounding hospital corridors.
              </p>

              <div className="space-y-2 border-t border-white/10 pt-3 text-[11px] font-mono">
                <div className="flex justify-between items-center text-red-400">
                  <span>1. Krishna Shalby Hospital</span>
                  <span className="font-extrabold text-red-500">3 Units O- (Urgent)</span>
                </div>
                <div className="flex justify-between items-center text-amber-500">
                  <span>2. Zydus Hospital, Anand</span>
                  <span className="font-extrabold text-amber-500 bg-amber-505/10 px-1 rounded">2 Units A+ (Pending)</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>3. Charutar Arogya Mandal</span>
                  <span className="font-bold text-slate-500">Idle State</span>
                </div>
              </div>
            </div>

            {/* Simulated Radar Hologram Grid */}
            <div className="lg:col-span-12 xl:col-span-7 flex justify-center w-full">
              <div className="relative w-full max-w-[280px] aspect-square rounded-full border border-red-500/10 p-4 bg-radial-radar flex items-center justify-center overflow-hidden">
                
                {/* Radar grid scanning sweep indicator */}
                <div className="absolute inset-0 bg-gradient-radial-radar rounded-full animate-[spin_6s_linear_infinite] pointer-events-none opacity-20" />

                {/* Orbit rings */}
                <div className="absolute w-12 h-12 rounded-full border border-red-500/5" />
                <div className="absolute w-28 h-28 rounded-full border border-red-500/5" />
                <div className="absolute w-44 h-44 rounded-full border border-red-500/5" />
                <div className="absolute w-full h-full rounded-full border border-red-500/5" />

                {/* Radar coordinate lines */}
                <div className="absolute h-full w-[0.5px] bg-red-955/20" />
                <div className="absolute w-full h-[0.5px] bg-red-955/20" />

                {/* Pinging Hotspots */}
                {/* Hotspot 1: Town Hall */}
                <div className="absolute top-1/4 left-1/3 flex flex-col items-center">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-[ping_1.5s_infinite] absolute" />
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-red-400 z-10 animate-pulse" />
                  <span className="text-[8px] font-mono text-white/70 bg-[#0a0a0c]/80 border border-white/10 px-1 rounded transform translate-y-3">
                    SHALBY HOSP (O-)
                  </span>
                </div>

                {/* Hotspot 2: Changa */}
                <div className="absolute bottom-1/3 right-1/4 flex flex-col items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-amber-300 z-10" />
                  <span className="text-[8px] font-mono text-white/70 bg-[#0a0a0c]/80 border border-white/10 px-1 rounded transform translate-y-3">
                    ZYDUS (A+)
                  </span>
                </div>

                {/* Core Transmitter anchor */}
                <div className="w-6 h-6 rounded-full bg-neutral-900 border border-red-500 flex items-center justify-center relative z-10 shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
