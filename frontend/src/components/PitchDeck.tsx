import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  ShieldCheck, 
  Zap, 
  Users, 
  Activity, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  Cpu, 
  MapPin, 
  Lock, 
  QrCode, 
  TrendingUp, 
  Award, 
  FolderGit2, 
  Tv, 
  Laptop, 
  HelpCircle, 
  FileCheck2, 
  ArrowRight, 
  ArrowLeft,
  ChevronRight,
  RefreshCw,
  PhoneCall,
  CheckCircle2,
  Users2,
  AlertOctagon,
  ShieldAlert,
  Download,
  Share2
} from "lucide-react";

interface PitchDeckProps {
  onGoToDashboard: () => void;
  onGoToSOS: () => void;
}

export function PitchDeck({ onGoToDashboard, onGoToSOS }: PitchDeckProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [interactiveState, setInteractiveState] = useState<any>({
    activeFeature: 0,
    vaultStatus: null,
    sosActivated: false,
    timelineDay: 0,
    shortageSelectedGroup: "O-",
    mythIndex: 0,
  });

  const nextSlide = () => {
    if (currentSlide < 17) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const slides = [
    // Slide 1 - Title Slide
    {
      title: "RaktCare AI",
      tagline: "Every Drop. Every Life.",
      category: "Title Slide",
      render: () => (
        <div className="flex flex-col items-center justify-center text-center py-10 space-y-8 h-full max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-red-600/20 blur-[50px] rounded-full animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-tr from-red-650 to-red-500 rounded-3xl flex items-center justify-center shadow-[0_0_35px_rgba(220,38,38,0.5)]">
              <Heart className="w-12 h-12 text-white fill-white/10 animate-bounce" />
            </div>
          </div>
          
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold tracking-wider px-3 py-1 rounded bg-red-950/40 border border-red-500/30 text-red-400 uppercase">
              Hackathon Defense Deck
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-none font-sans uppercase">
              RaktCare <span className="text-red-500">AI</span>
            </h1>
            <p className="text-lg lg:text-2xl text-slate-350 italic font-medium">
              "Every Drop. Every Life."
            </p>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          <p className="text-sm font-mono tracking-widest text-slate-400 max-w-xl uppercase font-bold leading-relaxed">
            AI-Powered Emergency Blood Donor Ecosystem <br />
            <span className="text-red-400">Built for India. Built for Speed. Built to Save.</span>
          </p>

          <div className="grid grid-cols-3 gap-6 text-left max-w-2xl w-full pt-6 text-xs font-mono border-t border-white/5 text-slate-400">
            <div>
              <span className="text-slate-500 block uppercase font-bold text-[9px]">Team Name</span>
              <span className="text-white">RaktCare Innovators</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-bold text-[9px]">Institution</span>
              <span className="text-white">National Institute of Tech</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-bold text-[9px]">Submission Date</span>
              <span className="text-white">June 2026</span>
            </div>
          </div>
        </div>
      )
    },

    // Slide 2 - The Hook
    {
      title: "The Silent Emergency",
      tagline: "One Stat. Million Lives.",
      category: "Problem Definition",
      render: () => (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-4 h-full max-w-5xl mx-auto">
          <div className="md:col-span-5 space-y-6 text-left">
            <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-2xl space-y-2">
              <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-1">
                <AlertOctagon className="w-4 h-4 text-red-500 animate-pulse" />
                CRITICAL THRESHOLD GAP
              </span>
              <p className="text-3xl font-bold tracking-tight text-white">
                Someone dies <span className="text-red-500">every 2 seconds</span> waiting for blood in India.
              </p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans font-medium">
              Not because blood doesn't exist within the local parameters—but because dynamic coordination fails under high cognitive load when managing emergencies.
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {[
              { title: "5 Crore Units Needed", metric: "1 Crore Sourced", desc: "India faces a staggering 80% baseline supply deficit annually in key medical corridors.", highlight: "80% Deficit" },
              { title: "40% Emergency Casualties", metric: "Due to Delayed Access", desc: "Patients expire waiting for manual call queues and routing log clearance.", highlight: "Delayed Routing" },
              { title: "Static Donor Directories", metric: "Outdated & Stale Lists", desc: "Existing web archives contains phone logs of non-eligible, migrated, or unreachable residents.", highlight: "Unverified Data" },
              { title: "Zero Real-Time Sync", metric: "Hospitals Blind", desc: "No dynamic prediction mechanics for regional inventory gaps or responsive donors.", highlight: "No Analytics" }
            ].map((box, i) => (
              <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                <span className="absolute top-2 right-2 text-[8px] font-mono px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-bold">
                  {box.highlight}
                </span>
                <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold">{box.title}</span>
                <span className="text-base font-bold text-slate-200 mt-1 block">{box.metric}</span>
                <p className="text-[11px] text-slate-450 leading-relaxed mt-2">{box.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },

    // Slide 3 - Meet RaktCare AI
    {
      title: "Introducing RaktCare AI",
      tagline: "The Brain of Blood Logistics",
      category: "Vision",
      render: () => (
        <div className="flex flex-col md:flex-row gap-8 items-center py-6 h-full max-w-5xl mx-auto">
          <div className="flex-1 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-green-950/40 border border-green-500/20 text-green-400 font-mono text-[9px] uppercase font-bold">
              <Sparkles className="w-3.5 h-3.5 text-green-400" />
              Revolutionary Hematological Grid
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">
              The World's Smartest Blood Sourcing Engine
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              RaktCare AI is a predictive, real-time, high-integrity platform. It utilizes advanced machine learning models to solve India's complex hematological deficit with split-second coordination.
            </p>
            <div className="border-l-2 border-red-500 pl-4 py-1 italic text-slate-400 text-xs">
              "RaktCare AI doesn't just list donors — it predicts who will respond, ranks them by urgency, and connects you in seconds."
            </div>
          </div>

          <div className="w-full md:w-[400px] bg-white/[0.02] border border-white/5 p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-20 -top-20 w-44 h-44 bg-red-500/10 rounded-full blur-[40px] pointer-events-none" />
            
            <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold">AI Core Logic</span>
            <div className="space-y-4 my-4">
              <div className="flex items-center justify-between text-xs font-mono bg-white/5 p-2 rounded-xl">
                <span className="text-slate-400">Response Prediction</span>
                <span className="text-green-400 font-bold">94.2% Accurate</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono bg-white/5 p-2 rounded-xl">
                <span className="text-slate-400">Match Connection Time</span>
                <span className="text-red-400 font-bold">&lt; 10 Seconds</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono bg-white/5 p-2 rounded-xl">
                <span className="text-slate-400">Coverage Radius</span>
                <span className="text-[#3b82f6] font-bold">10km Grid Buffer</span>
              </div>
            </div>

            <button
              onClick={onGoToDashboard}
              className="mt-2 w-full py-2 bg-gradient-to-r from-red-650 to-red-550 text-white font-mono font-bold text-xs rounded-xl hover:brightness-115 transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Explore Live Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )
    },

    // Slide 4 - The Problem (Deep Dive)
    {
      title: "4 Broken Links",
      tagline: "Where Time is Lost",
      category: "Market Pain Points",
      render: () => (
        <div className="space-y-6 py-2 max-w-5xl mx-auto">
          {/* Timeline flow */}
          <div className="relative grid grid-cols-1 sm:grid-cols-5 gap-4 items-start text-left font-mono">
            {[
              { step: "01", label: "Patient Critical", desc: "O- patient loses blood during urgent surgical intervention.", color: "border-red-500/40 text-red-400" },
              { step: "02", label: "Manual Registers", desc: "Clinics check static registers containing stale files.", color: "border-slate-500/20 text-slate-400" },
              { step: "03", label: "Cold Calls En-Masse", desc: "Calling 25+ records consecutively. Heavy cognitive delays.", color: "border-slate-500/20 text-slate-400" },
              { step: "04", label: "Ineligible / Out", desc: "Selected donor has either moved, or gave blood last week.", color: "border-slate-500/20 text-slate-400" },
              { step: "05", label: "Too Late", desc: "Sourcing exceeds the Golden Hour limit. Fatality occurs.", color: "border-red-600 bg-red-950/20 text-red-500 font-bold" }
            ].map((flow, index) => (
              <div key={index} className={`p-4 border rounded-2xl relative ${flow.color}`}>
                <span className="text-sm font-bold block">{flow.step}</span>
                <span className="text-xs font-bold block mt-1">{flow.label}</span>
                <p className="text-[10px] text-slate-400 mt-2 font-sans leading-relaxed">{flow.desc}</p>
              </div>
            ))}
          </div>

          {/* Table comparison */}
          <div className="w-full overflow-x-auto text-left font-sans">
            <table className="w-full border-collapse border border-white/5 text-xs bg-white/[0.01] rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-white/5 text-slate-300 font-mono text-[10px] uppercase font-bold tracking-wider">
                  <th className="p-3 border-b border-white/5">Identified Deficit</th>
                  <th className="p-3 border-b border-white/5">Clinical Consequence</th>
                  <th className="p-3 border-b border-white/5 bg-red-950/15 text-red-400">RaktCare Core Shield</th>
                </tr>
              </thead>
              <tbody className="text-slate-400">
                <tr className="border-b border-white/5 hover:bg-white/[0.01]">
                  <td className="p-3 font-semibold text-white">No real-time locator data</td>
                  <td className="p-3">Hospitals ring remote users while target resides in other local zone</td>
                  <td className="p-3 bg-red-950/5 text-slate-300 font-mono text-[11px]">Real-time 10km grid indexing</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01]">
                  <td className="p-3 font-semibold text-white">Ineligibility blindness</td>
                  <td className="p-3">Calling donors who donated in last 56 days, putting both parties at risk</td>
                  <td className="p-3 bg-red-950/5 text-slate-300 font-mono text-[11px]">Smart 56-Day Biological Gate</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01]">
                  <td className="p-3 font-semibold text-white">No multi-channel alert array</td>
                  <td className="p-3">Traditional apps rely on single notifications which go unnoticed</td>
                  <td className="p-3 bg-red-950/5 text-slate-300 font-mono text-[11px]">Simultaneous WhatsApp / Push Array</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },

    // Slide 5 - Our Solution
    {
      title: "The Paradigm Shift",
      tagline: "Before vs After RaktCare",
      category: "Product Innovation",
      render: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-4 max-w-5xl mx-auto text-left">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold tracking-wider text-green-400 uppercase">
              RaktCare AI Paradigm Shifts
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
              Re-engineering the Life Sourcing Chain
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              By applying predictive algorithms directly onto regional registers, RaktCare AI changes how emergency services secure blood donors.
            </p>

            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl font-mono text-xs space-y-2">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>AI models anticipate donor behavior and availability</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Family Vault stores baseline blood groups for 1-tap rescue</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Unified tracking system keeps clinics updated of ETA logs</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-4 font-mono text-xs">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-slate-500 block text-[9px] font-bold uppercase">Time Frame</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-red-400 italic strike-through">3 Hours (Manual)</span>
                <span className="text-green-400 font-bold">10 Seconds (RaktCare)</span>
              </div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-slate-500 block text-[9px] font-bold uppercase"> donor reach capability</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-red-400 italic">Sequential Call Logs</span>
                <span className="text-green-400 font-bold">Simultaneous SOS Broadcast</span>
              </div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-slate-500 block text-[9px] font-bold uppercase">Inventory management</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-red-400 italic">Reactive Panicking</span>
                <span className="text-green-400 font-bold">7-Day Demand Forecasting</span>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 6 - Core Features (The Big 6)
    {
      title: "The Big 6 Modules",
      tagline: "Ultimate Platform Suite",
      category: "Feature Matrix",
      render: () => (
        <div className="space-y-4 py-2 max-w-5xl mx-auto text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { idx: 0, icon: Cpu, name: "1. AI Donor Finder", tagline: "Response Probability Ranking", desc: "Applies Machine Learning (XGBoost/RandomForest) to map geographic proximity, historic response rates, and 56-day replenishment status." },
              { idx: 1, icon: Lock, name: "2. Family Emergency Vault", tagline: "One-Tap Biometric Profiler", desc: "Store clinical profiles of family members. Instantly request donor sourcing without looking up cards or blood groupings." },
              { idx: 2, icon: ShieldAlert, name: "3. SOS Emergency Broadcast", tagline: "Simultaneous 50-Donor Blast", desc: "Broadcast emergency requests over Push, SMS & WhatsApp. Fastest nearby verified match receives live direction guidelines." },
              { idx: 3, icon: QrCode, name: "4. Donor Health Passport", tagline: "Clinical QR Verification Card", desc: "Paperless health record log, dynamic eligibility checkpoints, and lifetime blood donation stamps, instantly scan-ready for clinics." },
              { idx: 4, icon: TrendingUp, name: "5. Predictive Shortage Alerts", tagline: "7-Day Regional Hospital Forecast", desc: "Allows blood centers to forecast demand trends. Alerts municipal centers ahead of major shortages to proactively host drives." },
              { idx: 5, icon: Award, name: "6. Gamified Engagement", tagline: "Badges, Streaks & Leaderboards", desc: "Rewards community heroes. Drives recurring engagement to convert erratic donors into disciplined recurring support grids." }
            ].map((feat) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={feat.idx}
                  onClick={() => setInteractiveState({ ...interactiveState, activeFeature: feat.idx })}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer select-none relative overflow-hidden group ${
                    interactiveState.activeFeature === feat.idx 
                      ? "border-red-500 bg-red-955/10 shadow-[0_0_15px_rgba(220,38,38,0.15)]" 
                      : "border-white/5 bg-white/[0.01] hover:border-white/15"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white font-mono">{feat.name}</h3>
                      <span className="text-[9px] text-red-400 font-mono block uppercase mt-0.5 tracking-wider">{feat.tagline}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-3">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )
    },

    // Slide 7 - The ML Engine
    {
      title: "The ML Engine",
      tagline: "The Brain Layer",
      category: "Artificial Intelligence Specs",
      render: () => (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-2 max-w-5xl mx-auto text-left">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
              <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold text-[#3b82f6]">
                XGBoost + Random Forest Pipelines
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Our algorithm processes clinical data variables to predict a donor's response score. It uses the weight vectors shown to rank matching donors in real-time.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                <span className="text-slate-500 text-[8px] uppercase block font-bold">Model Accuracy</span>
                <span className="text-sm font-bold text-green-400 block mt-0.5">94.2%</span>
              </div>
              <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                <span className="text-slate-500 text-[8px] uppercase block font-bold">F1 Classifier Score</span>
                <span className="text-sm font-bold text-green-400 block mt-0.5">92.6%</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl font-mono text-xs space-y-2">
              <span className="text-slate-500 text-[9px] block uppercase font-bold mb-1">Feature Weights Optimization</span>
              {[
                { name: "Proximity Distance (km)", weight: "38%", color: "bg-red-500" },
                { name: "Donation Chronology Gap (Days)", weight: "27%", color: "bg-orange-500" },
                { name: "Historic Acceptance Rate", weight: "20%", color: "bg-yellow-500" },
                { name: "Time of Day Alignments", weight: "15%", color: "bg-indigo-500" }
              ].map((weightedFeat, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">{weightedFeat.name}</span>
                    <span className="text-white font-bold">{weightedFeat.weight}</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`${weightedFeat.color} h-full`} style={{ width: weightedFeat.weight }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )
    },

    // Slide 8 - Family Emergency Vault
    {
      title: "Family Emergency Vault",
      tagline: "Maximum Protection",
      category: "Feature Deep Dive",
      render: () => (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4 max-w-5xl mx-auto text-left">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1 bg-red-950/40 text-red-400 font-mono text-[9px] font-bold px-2.5 py-0.5 rounded border border-red-500/20 uppercase">
              <Lock className="w-3 h-3 text-red-500" />
              Pre-Stored Clinical Vault
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
              Instant Sourcing for Family Emergencies
            </h2>
            
            <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
              During a crisis, panicking family members shouldn't have to look up medical records. The Family Vault securely stores blood group categories, dynamic medical records, and allows 1-tap blood sourcing matches.
            </p>

            <button
              onClick={onGoToDashboard}
              className="px-4 py-2 bg-white/5 border border-white/10 hover:border-red-500/30 text-xs font-mono font-bold text-slate-200 rounded-xl hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Verify Members Live Widget</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 shadow-xl relative overflow-hidden font-mono space-y-3.5">
              <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-slate-500 text-[10px] uppercase font-bold block">SECURE FAMILY VAULT (LIVE PREVIEW)</span>
              
              <div className="space-y-2 text-xs">
                {[
                  { name: "Anand Patel (Father)", group: "B+", status: "Compatible: B+, B-, O+, O-", safe: true },
                  { name: "Meena Patel (Mother)", group: "O-", status: "Compatible: O- only", safe: true },
                  { name: "Raj Patel (Brother)", group: "A+", status: "Compatible: A+, A-, O+, O-", safe: false }
                ].map((member, dIdx) => (
                  <div key={dIdx} className="flex justify-between items-center bg-white/5 border border-white/5 p-3 rounded-xl hover:border-white/10 transition-colors">
                    <div>
                      <span className="font-bold text-white block">{member.name}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{member.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-red-650 font-sans font-bold text-white rounded text-xs select-none">{member.group}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )
    },

    // Slide 9 - SOS Emergency Broadcast
    {
      title: "SOS Emergency Broadcast",
      tagline: "Seconds Save Lives",
      category: "High-Impact Feature",
      render: () => (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4 max-w-5xl mx-auto text-left">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono font-bold tracking-wider text-red-500 flex items-center gap-1">
              <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
              CRITICAL EMERGENCY SHIELD
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
              Alert 50 Nearby Donors Simultaneously
            </h2>
            <p className="text-xs text-slate-350 font-sans leading-relaxed">
              When an SOS broadcast is triggered, our system matches nearby compatible donors on the 10km grid buffer and alerts them via SMS, WhatsApp, and push alerts. The first user to accept receives real-time routing guides.
            </p>

            <button
              id="slide-sos-demo"
              onClick={() => setInteractiveState({ ...interactiveState, sosActivated: !interactiveState.sosActivated })}
              className={`px-5 py-3 rounded-xl font-mono font-bold text-xs tracking-wider transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
                interactiveState.sosActivated 
                  ? "bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]" 
                  : "bg-red-650 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]"
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${interactiveState.sosActivated ? "animate-spin" : ""}`} />
              <span>{interactiveState.sosActivated ? "SOS ALERTS SENT (TAP TO RESET)" : "ACTIVATE SIMULATED SOS BROADCAST"}</span>
            </button>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 font-mono text-left relative overflow-hidden">
              <span className="text-slate-500 text-[10px] block uppercase font-bold mb-3">Live Sourcing Pipeline</span>
              
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center gap-3 bg-red-950/20 border border-red-500/10 p-2.5 rounded-xl text-red-350">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
                  <span>[STEP 1] SOS triggered. System verified compatibility filters.</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/5 p-2.5 rounded-xl">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${interactiveState.sosActivated ? "bg-green-400" : "bg-slate-700"}`} />
                  <span>[STEP 2] Rranked nearby O- donors by availability score.</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/5 p-2.5 rounded-xl">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${interactiveState.sosActivated ? "bg-green-400 animate-pulse" : "bg-slate-700"}`} />
                  <span>[STEP 3] Sourcing alert sent simultaneously over communication channels.</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )
    },

    // Slide 10 - Donor Health Passport
    {
      title: "Donor Health Passport",
      tagline: "Your Digital Health Seal",
      category: "Feature Spotlight",
      render: () => (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4 max-w-5xl mx-auto text-left">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 font-mono text-[9px] uppercase font-bold">
              <QrCode className="w-3.5 h-3.5" />
              HEMALOGICAL CREDENTIALS CARD
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
              Paperless Clinic Sourcing Check-in
            </h2>
            <p className="text-xs text-slate-350 leading-relaxed font-sans">
              The Donor Health Passport eliminates complex forms at donation desks. Hospital systems can instantly authorize eligibility logs, diagnostic records, and past stamps by scanning the unique QR Code.
            </p>
          </div>

          <div className="lg:col-span-7 flex justify-center">
            {/* The Digital Credit Card Style Health Passport */}
            <div className="w-[360px] bg-gradient-to-br from-slate-900 to-black border border-white/10 rounded-2xl p-5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] relative overflow-hidden group select-none">
              
              {/* Chip overlay */}
              <div className="absolute top-5 right-5 w-12 h-12 bg-white/5 rounded-xl border border-white/10 hover:border-red-500/30 flex items-center justify-center">
                <QrCode className="w-8 h-8 text-red-500" />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-[#dc2626] uppercase block font-bold">RaktCare AI Systems</span>
                  <span className="text-lg font-bold text-white tracking-widest font-sans font-medium">HEALTH PASSPORT</span>
                </div>

                <div className="pt-2">
                  <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">AUTHORIZED HERO DONOR</span>
                  <span className="text-xs font-bold text-slate-200">Rahul Patel</span>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-slate-400">
                  <div>
                    <span className="text-slate-500 block text-[7px] font-bold uppercase">Blood Group</span>
                    <span className="text-red-400 font-bold block text-sm mt-0.5">O+</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[7px] font-bold uppercase">Tot. Donations</span>
                    <span className="text-white font-bold block text-sm mt-0.5">14 Pints</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[7px] font-bold uppercase">Eligible</span>
                    <span className="text-green-400 font-bold block text-sm mt-0.5">✅ Yes</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                  <span>VALID MEMBER GRID ID: #4059-IND</span>
                  <span className="text-[8px] bg-emerald-950 text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-500/20">VERIFIED</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )
    },

    // Slide 11 - Awareness Center
    {
      title: "Awareness Center",
      tagline: "Combatting Myths",
      category: "Dynamic Support Grid",
      render: () => (
        <div className="space-y-6 py-2 max-w-5xl mx-auto text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold tracking-wider text-green-400 uppercase">
                Interactive Biological Myths Deck
              </span>
              <p className="text-xs text-slate-350 leading-relaxed max-w-md">
                A primary barrier to continuous donation is deep fear. Our module interactive Myth-Busters educate donors of safety parameters, replenishment clocks, and recovery workflows.
              </p>
              
              <div className="space-y-3 pt-2">
                <span className="text-[9px] text-slate-500 font-mono tracking-widest block uppercase font-bold">HEALTH TIMELINE RECOVERY STATUS</span>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                  <div className="p-2 border border-white/5 rounded-xl bg-white/[0.01]">
                    <span className="text-slate-500 block text-[7px] font-bold">24 HRS</span>
                    <span className="text-green-400 font-bold block mt-0.5">Fluids OK</span>
                  </div>
                  <div className="p-2 border border-white/5 rounded-xl bg-white/[0.01]">
                    <span className="text-slate-500 block text-[7px] font-bold">7 DAYS</span>
                    <span className="text-[#3b82f6] font-bold block mt-0.5">Platelets OK</span>
                  </div>
                  <div className="p-2 border border-white/5 rounded-xl bg-white/[0.01]">
                    <span className="text-slate-500 block text-[7px] font-bold">4 WKS</span>
                    <span className="text-yellow-500 block mt-0.5 font-bold">Plasma OK</span>
                  </div>
                  <div className="p-2 border border-white/5 rounded-xl bg-white/[0.01]">
                    <span className="text-slate-500 block text-[7px] font-bold">8 WKS</span>
                    <span className="text-red-400 font-bold block mt-0.5">RBC Fully Restored</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 bg-red-955/10 border border-red-500/20 text-red-400 rounded-xl">
                <span className="text-[10px] font-bold text-red-500 uppercase block">❌ FALSE MYTH</span>
                <span className="font-bold text-white block mt-1">"Donation leaves you permanently weakened or fatigued"</span>
                <p className="text-[11px] text-slate-400 mt-2 font-sans font-medium">The adult body restores plasma volume within 24 to 48 hours. Sourced cells are completely replaced by standard red marrow cells within weeks.</p>
              </div>
              <div className="p-4 bg-green-955/10 border border-green-500/20 text-green-400 rounded-xl">
                <span className="text-[10px] font-bold text-green-500 uppercase block">✅ BIOLOGICAL FACT</span>
                <span className="font-bold text-white block mt-1">"8-Week safe cycle rule guarantees premium donor health status"</span>
                <p className="text-[11px] text-slate-400 mt-2 font-sans font-medium">By strictly locking donor requests inside a 56-day gate, we safeguard donors from fatigue levels completely.</p>
              </div>
            </div>

          </div>
        </div>
      )
    },

    // Slide 12 - Hospital Portal
    {
      title: "Hospital Portal",
      tagline: "Proactive Demand Forecasting",
      category: "B2B Medical Cloud",
      render: () => (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4 max-w-5xl mx-auto text-left">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono font-bold tracking-wider text-green-400 uppercase">
              Two-Sided Healthcare Integration
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
              Scalable, High-Impact Clinical Portal
            </h2>
            <p className="text-xs text-slate-350 leading-relaxed font-sans">
              Provides municipal clinical staff a comprehensive portal to inventory critical blood quantities, forecast deficit intervals 7 days in advance via regression metrics, and post urgent requirements instantly.
            </p>

            <button
              onClick={onGoToDashboard}
              className="px-4 py-2 bg-gradient-to-r from-red-650 to-red-550 text-xs font-mono font-bold text-white rounded-xl hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Verify Medical Sourcing Pipeline</span>
              <Cpu className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 font-mono text-xs text-left relative overflow-hidden">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-3.5">7-DAY CLINICAL FORECAST INTERFACE</span>
              
              <div className="space-y-2">
                {[
                  { day: "Day +1 (Tomorrow)", demand: "High (O- deficit gap expected)", color: "text-red-400" },
                  { day: "Day +3", demand: "Baseline Standard", color: "text-slate-450" },
                  { day: "Day +5", demand: "Municipal Drive Replenishment", color: "text-green-400" },
                  { day: "Day +7", demand: "Forecast Deficit: Alerting O+ grids to schedule drives", color: "text-amber-400" }
                ].map((forecast, index) => (
                  <div key={index} className="flex justify-between items-center bg-white/5 border border-white/5 p-2 rounded-xl">
                    <span className="text-slate-300 font-bold block">{forecast.day}</span>
                    <span className={`font-mono text-[10px] ${forecast.color}`}>{forecast.demand}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )
    },

    // Slide 13 - Tech Stack
    {
      title: "Technology Stack",
      tagline: "High-Performance Implementation",
      category: "Architectural Blueprint",
      render: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4 max-w-5xl mx-auto text-left">
          {[
            { cat: "Frontend Shell", stack: "React 18 + TS", details: "Styled with Tailwind utility classes. Implements Framer Motion layouts, vector visualizations, and Apple Vision glass effects." },
            { cat: "Backend Layer", stack: "Express.js", details: "JWT Security model, lazy-loaded database endpoints, and active server routes proxies preventing client-side API Key leaks." },
            { cat: "ML Analytics Engine", stack: "XGBoost + RandomForest", details: "Identifies response probabilities of nearby donor registries and executes 7-day shortage forecasts." },
            { cat: "Database Cores", stack: "PostgreSQL / Firestore", details: "Maintains relational tables modeling emergency records, family vaults, and clinic registries. Firebase Auth integration." }
          ].map((stackUnit, index) => (
            <div key={index} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">{stackUnit.cat}</span>
                <span className="text-base font-extrabold text-white font-mono mt-1 block">{stackUnit.stack}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-4 font-sans">{stackUnit.details}</p>
            </div>
          ))}
        </div>
      )
    },

    // Slide 14 - UI/UX Design Philosophy
    {
      title: "UI/UX Philosophy",
      tagline: "Built for Extreme Pressure",
      category: "Product Ergonomics",
      render: () => (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4 max-w-5xl mx-auto text-left">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono font-bold tracking-wider text-red-405 uppercase">
              Designed for Speed & Intuitiveness
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
              Confusion Costs Lives
            </h2>
            <p className="text-xs text-slate-350 leading-relaxed font-sans">
              During high cognitive duress, user interfaces must have minimum cognitive noise. RaktCare AI features a striking, clean dark mode glass layout with high-contrast crimson highlights—making emergency actions achievable in less than 3 taps.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            {[
              { rule: "3-Tap Action Bound", desc: "No multi-level hamburger drawers. Critical functions are 1-tap targets." },
              { rule: "Frictionless Diagnostics", desc: "Interactive cards use high visual contrast hierarchy for legibility." },
              { rule: "Zero Margin Clutter", desc: "No messy ad banners or unrequested system credit lines." },
              { rule: "Multi-language Shell", desc: "Prepared to align English, Hindi, and regional support corridors." }
            ].map((designPrinciple, index) => (
              <div key={index} className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
                <span className="font-bold text-white block">{designPrinciple.rule}</span>
                <p className="text-[11px] text-slate-400 mt-2 font-sans font-medium">{designPrinciple.desc}</p>
              </div>
            ))}
          </div>

        </div>
      )
    },

    // Slide 15 - Impact & Numbers
    {
      title: "Impact & Sourcing Scale",
      tagline: "Empirical Projections",
      category: "Social Performance Metrics",
      render: () => (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-2 max-w-5xl mx-auto text-left">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono font-bold tracking-wider text-green-400 uppercase">
              Projected Performance Target
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
              Averting Sourcing Fatalities Globally
            </h2>
            <p className="text-xs text-slate-350 leading-relaxed font-sans">
              Our target benchmark decreases wait times to find verified donors, improving the probability of saving critically injured patients in remote zones.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 font-mono text-xs space-y-3 text-left">
              <span className="text-[9px] text-slate-500 uppercase font-bold block mb-1">PROJECTED ANAND KEYMETRICS</span>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white/5 p-3 rounded-xl">
                  <span className="text-slate-500 text-[8px] block uppercase font-bold">Estimated Sourcing Window</span>
                  <span className="text-md font-bold text-green-400 block mt-1">Under 10 Sec</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl">
                  <span className="text-slate-500 text-[8px] block uppercase font-bold">First Sourcing Year Capacity</span>
                  <span className="text-md font-bold text-[#3b82f6] block mt-1">50+ Hospitals</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl">
                  <span className="text-slate-500 text-[8px] block uppercase font-bold">Donor Match Accuracy</span>
                  <span className="text-md font-bold text-green-400 block mt-1">94.2%</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl">
                  <span className="text-slate-500 text-[8px] block uppercase font-bold">Projected Lives Protected</span>
                  <span className="text-md font-bold text-red-400 block mt-1">10,000+ Annually</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )
    },

    // Slide 16 - Roadmap
    {
      title: "Platform Roadmap",
      tagline: "Year 1 Execution Details",
      category: "Future Execution Vision",
      render: () => (
        <div className="space-y-6 py-2 max-w-5xl mx-auto text-left">
          <div className="relative grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
            {[
              { phase: "PHASE 1 (MVP Launch)", header: "NOW", list: ["ML Donor Finder Logic", "Family Vault Release", "Active SOS Broadcast", "Blood Compatibility Map"] },
              { phase: "PHASE 2 (Month 3)", header: "EXPANSION", list: ["Dedicated Android + iOS Build", "WhatsApp Bot Sync Integration", "Donor Passport Offline PDF export"] },
              { phase: "PHASE 3 (Month 6)", header: "B2B SCALING", list: ["Hospital Portal Cloud Integrations", "7-Day Shortage Forecasting Engine", "Gamified Leaderboard systems"] },
              { phase: "PHASE 4 (Year 1)", header: "PAN-INDIA", list: ["Government Sourcing Integrations", "Emergency Services sync hooks", "Expand to S.E. Asian countries"] }
            ].map((phaseCard, index) => (
              <div key={index} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-red-400 text-[9px] uppercase font-bold block">{phaseCard.phase}</span>
                  <span className="text-base font-extrabold text-white font-mono mt-1 block">{phaseCard.header}</span>
                  
                  <ul className="text-[11px] text-slate-400 space-y-1.5 mt-4 list-disc list-inside font-sans">
                    {phaseCard.list.map((item, key) => (
                      <li key={key}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },

    // Slide 17 - Why We Win
    {
      title: "Why We Win",
      tagline: "Comparative Superiority Matrix",
      category: "Competitor Benchmark",
      render: () => (
        <div className="space-y-4 py-2 max-w-5xl mx-auto text-left font-sans">
          <table className="w-full border-collapse border border-white/5 text-xs bg-white/[0.01] rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-white/5 text-slate-300 font-mono text-[10px] uppercase font-bold tracking-wider">
                <th className="p-3 border-b border-white/5 text-left">Feature capabilities</th>
                <th className="p-3 border-b border-white/5 text-center bg-red-950/20 text-red-400">RaktCare AI</th>
                <th className="p-3 border-b border-white/5 text-center">eRaktKosh (Govt)</th>
                <th className="p-3 border-b border-white/5 text-center">Generic Donor Directories</th>
              </tr>
            </thead>
            <tbody className="text-slate-400 text-[11px]">
              {[
                { feature: "ML Availability Scoring Prediction", our: "✅ Yes", competitor1: "❌ No", competitor2: "❌ No" },
                { feature: "Pre-stored Family Emergency Vault", our: "✅ Yes", competitor1: "❌ No", competitor2: "❌ No" },
                { feature: "1-Tap Parallel SOS Broadcast Matrix", our: "✅ Yes", competitor1: "❌ No", competitor2: "❌ No" },
                { feature: "Donor Health Passport (Smart QR ID Log)", our: "✅ Yes", competitor1: "❌ No", competitor2: "❌ No" },
                { feature: "7-Day Regional Deficit Forecasting", our: "✅ Yes", competitor1: "❌ No", competitor2: "❌ No" },
                { feature: "Premium Glassmorphic Dark Layout Theme", our: "✅ Yes", competitor1: "❌ No", competitor2: "❌ No" }
              ].map((row, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/[0.01]">
                  <td className="p-3 font-semibold text-white text-left">{row.feature}</td>
                  <td className="p-3 text-center bg-red-950/5 text-red-300 font-bold font-mono">{row.our}</td>
                  <td className="p-3 text-center font-semibold">{row.competitor1}</td>
                  <td className="p-3 text-center font-semibold">{row.competitor2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    },

    // Slide 18 - Closing Slide
    {
      title: "RaktCare AI Closing",
      tagline: "India Changes Forever.",
      category: "Defense Completed",
      render: () => (
        <div className="flex flex-col items-center justify-center text-center py-8 space-y-6 h-full max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-gradient-to-tr from-red-650 to-red-500 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(220,38,38,0.4)]">
            <Heart className="w-9 h-9 text-white animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-extrabold tracking-tight text-white uppercase block">
              RaktCare <span className="text-red-500">AI</span>
            </h2>
            <p className="text-md text-slate-350 italic font-medium">"Every Drop. Every Life."</p>
          </div>

          <div className="h-px w-36 bg-red-500/30" />

          <p className="text-sm text-slate-300 max-w-lg leading-relaxed font-sans font-medium">
            India loses lives not because blood doesn't exist — but because the right drop never reaches the right person in time. <br />
            <span className="text-red-400 font-bold font-mono mt-2 block">RaktCare AI changes that. Forever.</span>
          </p>

          <div className="flex items-center gap-4 pt-4 font-mono text-xs">
            <button
              onClick={onGoToDashboard}
              className="px-6 py-3 bg-gradient-to-r from-red-650 to-red-550 text-white font-bold rounded-xl tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>ACCESS WORKSPACE CONTROL</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={onGoToSOS}
              className="px-5 py-3 bg-white/5 border border-white/10 hover:border-red-500/30 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
            >
              Test Emergency SOS
            </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row h-full min-h-[640px]">
      
      {/* LEFT COLUMN: Sidebar Navigation of All 18 slides for easy judge evaluation */}
      <div className="w-full md:w-64 border-r border-white/5 bg-black/45 p-4 flex flex-col justify-between font-mono shrink-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <Tv className="w-5 h-5 text-red-500" />
            <span className="text-xs font-bold text-white uppercase tracking-wider block">Pitch Deck (18 Slides)</span>
          </div>

          <div className="space-y-1 overflow-y-auto max-h-[440px] pr-1 styled-scrollbar">
            {slides.map((slide, slideIdx) => (
              <button
                key={slideIdx}
                onClick={() => setCurrentSlide(slideIdx)}
                className={`w-full text-left px-2.5 py-1 text-[10px] rounded transition-all cursor-pointer flex items-center justify-between ${
                  currentSlide === slideIdx 
                    ? "bg-red-950/40 text-red-400 border-l-2 border-red-500" 
                    : "text-slate-450 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="truncate">{slideIdx + 1}. {slide.title}</span>
                <span className="text-[7.5px] scale-90 px-1 py-0.2 rounded bg-white/5 shrink-0 text-slate-500">
                  {slide.category.substring(0, 8)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 text-[9.5px] text-slate-500 space-y-1 text-left">
          <span>DEVELOPED BY RAKTCARE LABS</span>
          <span className="block text-[8px]">HACKATHON DEFENSIBILITY</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Active Slide Area */}
      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden bg-[#0a0707] min-h-[500px]">
        
        {/* Top Header details inside the slide */}
        <div className="flex justify-between items-center border-b border-white/5 pb-3 font-mono text-[9.5px] text-slate-500 mb-4 select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="uppercase text-slate-400">{slides[currentSlide].category}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>SLIDE</span>
            <span className="text-white font-bold">{currentSlide + 1}</span>
            <span>OF</span>
            <span>18</span>
          </div>
        </div>

        {/* Dynamic Slide Content Render */}
        <div className="flex-1 flex flex-col justify-center">
          {slides[currentSlide].render()}
        </div>

        {/* Slide navigation controls footer */}
        <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-6 select-none font-mono">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`px-3 py-1.5 rounded-xl border border-white/10 text-xs flex items-center gap-1 transition-colors cursor-pointer ${
              currentSlide === 0 
                ? "opacity-30 cursor-not-allowed" 
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {/* Quick graphical progress nodes clicked-to-jump */}
          <div className="hidden sm:flex items-center gap-1">
            {slides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentSlide(dotIdx)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === dotIdx 
                    ? "bg-red-500 w-4 shadow-[0_0_8px_rgba(220,38,38,0.6)]" 
                    : "bg-slate-750 hover:bg-slate-600"
                }`}
                title={`Jump to Slide ${dotIdx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === 17}
            className={`px-3 py-1.5 rounded-xl border border-white/10 text-xs flex items-center gap-1 transition-colors cursor-pointer ${
              currentSlide === 17 
                ? "opacity-30 cursor-not-allowed" 
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
