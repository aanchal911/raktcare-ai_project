import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BloodDrop3D } from "./components/BloodDrop3D";
import { CompatibilityChart } from "./components/CompatibilityChart";
import { AwarenessHub } from "./components/AwarenessHub";
import { DonorSearch } from "./components/DonorSearch";
import { FamilyVault } from "./components/FamilyVault";
import { AnalyticsHub } from "./components/AnalyticsHub";
import { AssistantChat } from "./components/AssistantChat";
import { EmergencyRegister } from "./components/EmergencyRegister";
import { LandingPage3D } from "./components/LandingPage3D";
import { PitchDeck } from "./components/PitchDeck";
import { NotificationToastContainer, ToastAlert, playNotificationSynthSound } from "./components/NotificationToastContainer";
import { getStoredEmergencyRequests, saveEmergencyRequests } from "./data/donors";
import { BloodGroup, EmergencyRequest } from "./types";
import { DonorHealthPassport } from "./components/DonorHealthPassport";
import { 
  Heart, 
  Search, 
  HelpCircle, 
  Cpu, 
  Flame, 
  ShieldAlert, 
  Home, 
  ChevronRight, 
  Activity, 
  Lock, 
  Sparkles, 
  ArrowRightLeft, 
  Clock, 
  BookOpen, 
  Workflow,
  IdCard
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [selectedSearchGroup, setSelectedSearchGroup] = useState<BloodGroup>("O+");
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);
  const [timeStr, setTimeStr] = useState("");
  const [enteredDashboard, setEnteredDashboard] = useState<boolean>(false);
  const [activeToasts, setActiveToasts] = useState<ToastAlert[]>([]);
  const seenRequestIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Persistent initial request list
    const stored = getStoredEmergencyRequests();
    setEmergencyRequests(stored);
    
    // Populate seen request IDs on load to ignore them for push notification sound/toast alerts
    stored.forEach((r) => seenRequestIdsRef.current.add(r.id));

    // Clean dynamic real-time clock synced to the metadata
    const updateTime = () => {
      const utcTime = new Date();
      setTimeStr(utcTime.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Set up the push notification trigger reaction when the requests list changes
  useEffect(() => {
    if (emergencyRequests.length === 0) return;

    // Detect if there are any new requests that we haven't seen yet
    const unseenRequests = emergencyRequests.filter((r) => !seenRequestIdsRef.current.has(r.id));

    if (unseenRequests.length > 0) {
      unseenRequests.forEach((newestReq) => {
        // Mark as seen immediately to prevent duplicate runs
        seenRequestIdsRef.current.add(newestReq.id);

        const toastId = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const newToast: ToastAlert = {
          id: toastId,
          source: newestReq.id.includes("sim") ? "MOCK_GATEWAY" : "FAMILY_VAULT",
          patientName: newestReq.patientName,
          bloodGroup: newestReq.bloodGroup,
          hospital: newestReq.hospital,
          urgency: newestReq.urgency,
          unitsNeeded: newestReq.unitsNeeded
        };

        // Prepend to visible toasts
        setActiveToasts((prev) => [newToast, ...prev]);

        // Auto-dismiss the toast in 8 seconds
        setTimeout(() => {
          setActiveToasts((prev) => prev.filter((t) => t.id !== toastId));
        }, 8000);
      });

      // Play synthesized audio chiming chord if sound is enabled
      playNotificationSynthSound();
    }
  }, [emergencyRequests]);

  const handleAddEmergencyRequest = (newRequest: EmergencyRequest) => {
    setEmergencyRequests((prev) => {
      const updated = [newRequest, ...prev];
      saveEmergencyRequests(updated);
      return updated;
    });
  };

  const handleToastExploreDonors = (group: BloodGroup) => {
    setSelectedSearchGroup(group);
    setActiveTab("search");
    // Scroll smoothly to dashboard so user doesn't miss the screen transition!
    scrollToDashboard();
  };

  const handleBecomeDonorPlaceholder = () => {
    alert("🌟 Thank you for your volunteer spirit! Your RaktCare record is initialized. Check out the Smart Donor Finder to locate emergency demands near you.");
  };

  // Quick stat counters
  const activeSOSRequestsCount = emergencyRequests.filter((r) => r.status === "Pending").length;
  const resolvedSOSCount = emergencyRequests.filter((r) => r.status === "Completed").length;

  const scrollToDashboard = () => {
    document.getElementById("dashboard-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToLanding = () => {
    document.getElementById("landing-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#060303] text-slate-100 font-sans overflow-x-hidden selection:bg-red-650 selection:text-white relative pb-12 scroll-smooth">
      
      {/* 3D Gate Landing Page (Exactly 100vh height stacked above the dashboard) */}
      <div id="landing-section" className="w-full h-screen relative">
        <LandingPage3D onEnterDashboard={scrollToDashboard} />
      </div>

      {/* Ambient background glowing circles for high fidelity Frosted Glass style */}
      <div className="absolute top-[calc(100vh+50px)] right-[-100px] w-96 h-96 bg-red-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[200px] left-[5%] w-[450px] h-[450px] bg-red-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-[calc(100vh+30%)] right-[15%] w-[400px] h-[400px] bg-red-900/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Responsive Grid Layout Container for the Dashboard */}
      <div id="dashboard-section" className="max-w-[1440px] mx-auto p-4 lg:p-6 space-y-6 relative z-10 pt-8">
        
        {/* TOP STATUS BAR: Apple Vision inspired Frosted Glass */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative">
          
          {/* Logo brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-red-400 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)] relative group cursor-pointer" onClick={() => setActiveTab("home")}>
              <Heart className="w-5.5 h-5.5 text-white fill-white/10 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-sans font-bold text-2xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  RaktCare AI
                </h2>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-600/20 border border-red-500/20 text-red-100">
                  V4.2 PROT
                </span>
                <button
                  id="btn-return-splash"
                  onClick={scrollToLanding}
                  className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 border border-white/10 hover:border-red-500/30 text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm ml-2"
                  title="Return to 3D Gate View"
                >
                  ↑ Return to Splash
                </button>
              </div>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider block">
                SMART BLOOD DONOR ECOSYSTEM
              </span>
            </div>
          </div>

          {/* Quick Metrics Header Overlay */}
          <div className="hidden lg:flex items-center gap-8 text-xs font-mono border-l border-white/10 pl-8">
            <div>
              <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Available Donors Today</span>
              <span className="font-bold text-slate-300 text-sm">2,451 Registered</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Clinical Deficits</span>
              <span className="font-bold text-red-400 text-sm flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                {activeSOSRequestsCount} Active SOS
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Bio-Units Sourced</span>
              <span className="font-bold text-green-400 text-sm">567 Pints</span>
            </div>
          </div>

          {/* Real-time UTC clock */}
          <div className="flex items-center gap-3 self-end md:self-auto text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 backdrop-blur-md">
              <Clock className="w-3.5 h-3.5 text-red-400 animate-[spin_10s_linear_infinite]" />
              <span>{timeStr || "UTC Line Synced"}</span>
            </div>
          </div>

        </header>

        {/* INTEGRATED NAV RAILS + WORKSPACE BENTO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* NAVIGATION SIDEBAR: 3 Space Rail with Apple design */}
          <nav className="lg:col-span-3 space-y-4">
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-lg">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-3 px-1">
                Ecosystem Directories
              </span>
              
              <div className="space-y-1.5">
                {[
                  { id: "home", label: "Dashboard Home", icon: Home },
                  { id: "search", label: "Smart Donor Finder", icon: Search },
                  { id: "passport", label: "Donor Health Passport", icon: IdCard },
                  { id: "vault", label: "Family Emergency Vault", icon: Lock, badge: "Sec" },
                  { id: "requests", label: "Active Emergency SOS", icon: ShieldAlert, badge: activeSOSRequestsCount > 0 ? String(activeSOSRequestsCount) : undefined },
                  { id: "compatibility", label: "Compatibility Graph", icon: ArrowRightLeft },
                  { id: "awareness", label: "Awareness & Myths", icon: BookOpen },
                  { id: "analytics", label: "Diagnostic Analytics", icon: Workflow },
                  { id: "assistant", label: "RaktCare Smart AI", icon: Cpu, badge: "GenAI" }
                ].map((item) => {
                  const Icon = item.icon;
                  const isCurrent = activeTab === item.id;
                  
                  return (
                    <button
                      id={`nav-link-${item.id}`}
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all text-left group cursor-pointer ${
                        isCurrent 
                          ? "bg-white/10 border border-white/15 text-red-400 font-bold shadow-[0_4px_12px_rgba(0,0,0,0.2)]" 
                          : "border border-transparent text-slate-400 hover:text-slate-100 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 transition-transform ${isCurrent ? "text-red-400 scale-110" : "text-slate-500 group-hover:text-red-400"}`} />
                        <span>{item.label}</span>
                      </div>
                      
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                          item.badge === "GenAI" 
                            ? "bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]" 
                            : item.id === "requests" 
                              ? "bg-red-950/60 text-red-400 border border-red-900/60" 
                              : "bg-white/10 text-slate-400 border border-white/5"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUICK INFORMATION WIDGET: Reusable biological highlights */}
            <div className="hidden lg:block bg-red-600/10 backdrop-blur-lg border border-red-500/20 p-4 rounded-2xl space-y-3.5">
              <div className="flex items-center gap-1.5 text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4" />
                <span>Immediate SOS Broadcast</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Need whole blood or concentrates urgently? Activate the SOS request to matching regional centers in Anand immediately.
              </p>
              <button
                id="btn-sidebar-raise-sos"
                onClick={() => { setActiveTab("requests") }}
                className="w-full text-center py-2 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-bold font-mono tracking-wider transition-all cursor-pointer text-white shadow-lg shadow-red-900/40"
              >
                LOG EMERGENCY SIGNAL
              </button>
            </div>

          </nav>

          {/* ACTIVE CONTENT PORTPORTS: 9 Space responsive display */}
          <main className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="space-y-6"
              >
                
                {/* 1. DASHBOARD HOME VIEW */}
                {activeTab === "home" && (
                  <div className="space-y-6">
                    
                    {/* Hero Layout: Pulses 3D with vital diagnostic numbers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      
                      {/* Left Block: Pulsating large 3D central blood drop and trigger bursts */}
                      <div>
                        <BloodDrop3D />
                      </div>

                      {/* Right Block: Core stats list & high fidelity buttons */}
                      <div className="space-y-5 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] h-full flex flex-col justify-between">
                        
                        <div className="space-y-4">
                          <span className="text-[10px] font-mono text-red-400 font-bold tracking-widest uppercase block bg-red-600/10 border border-red-500/20 px-3 py-1 rounded w-fit">
                            Live Donor Synchronization Matrix
                          </span>

                          <h2 className="text-2xl font-bold text-transparent-gradient tracking-tight leading-none">
                            Connecting Hearts, Securing Futures.
                          </h2>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            RaktCare AI calculates immediate availability probability based on physiological recovery spacing (8-week cycles), geographic distances, and historical response rates under a Random Forest simulation model.
                          </p>
                        </div>

                        {/* Interactive Hero metrics cards list */}
                        <div className="grid grid-cols-2 gap-3 font-mono">
                          <div className="bg-[#120a0a]/60 p-3 rounded-xl border border-red-900/25">
                            <span className="text-slate-400 text-[9px] block">Emergency Requests</span>
                            <span className="text-lg font-extrabold text-[#ef4444] animate-pulse">
                              {activeSOSRequestsCount} Pending
                            </span>
                          </div>
                          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <span className="text-slate-400 text-[9px] block">Availability Index</span>
                            <span className="text-lg font-extrabold text-green-400">
                              2,451 Active
                            </span>
                          </div>
                        </div>

                        {/* Action buttons list */}
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold">
                          <button
                            id="btn-hero-find-donor"
                            onClick={() => setActiveTab("search")}
                            className="py-3 bg-white/10 hover:bg-white/15 rounded-xl border border-white/10 hover:border-white/20 text-slate-100 transition-all cursor-pointer text-center font-bold"
                          >
                            Find Donor
                          </button>
                          
                          <button
                            id="btn-hero-emergency"
                            onClick={() => setActiveTab("requests")}
                            className="py-3 bg-red-600 hover:bg-red-500 rounded-xl text-white text-center transition-all cursor-pointer shadow-[0_0_20px_rgba(220,38,38,0.3)] font-bold"
                          >
                            SOS Request
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold">
                          <button
                            id="btn-hero-become-donor"
                            onClick={handleBecomeDonorPlaceholder}
                            className="py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-slate-300 hover:text-white transition-colors cursor-pointer text-center"
                          >
                            Become Donor
                          </button>
                          <button
                            id="btn-hero-learn"
                            onClick={() => setActiveTab("awareness")}
                            className="py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-slate-300 hover:text-white transition-all cursor-pointer text-center"
                          >
                            Learn Donation
                          </button>
                        </div>

                      </div>

                    </div>

                    {/* Integrated Sub-panels preview: Family Emergency list \& radar graph */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4">
                        <div className="flex justify-between items-center border-b border-white/10 pb-3">
                          <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                            Emergency SOS list
                          </h3>
                          <button
                            id="btn-go-sos-tab"
                            onClick={() => setActiveTab("requests")}
                            className="text-[10px] text-red-400 font-mono flex items-center hover:underline cursor-pointer"
                          >
                            Configure SOS <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                          {emergencyRequests.slice(0, 3).map((r) => (
                            <div key={r.id} className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono hover:border-red-500/20 transition-all">
                              <div>
                                <span className="font-bold text-slate-100 block">{r.patientName}</span>
                                <span className="text-[9px] text-slate-400">{r.hospital}</span>
                              </div>
                              <div className="text-right">
                                <span className="px-1.5 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-900/60 text-[8px] font-bold block mb-1">
                                  {r.bloodGroup} Needed
                                </span>
                                <span className="text-[10px] text-slate-400 block">{r.urgency.split(" ")[0]}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bio Compatibility quick access widget */}
                      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                        <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-3">
                          <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                            Compatibility thresholds
                          </h3>
                          <button
                            id="btn-go-compatibility-tab"
                            onClick={() => setActiveTab("compatibility")}
                            className="text-[10px] text-red-400 font-mono flex items-center hover:underline cursor-pointer"
                          >
                            Explore Graph <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed mb-4">
                          Clicking A+ recipients safely processes infusions from A+, A-, O+, and O-. Let's verify recipient antigens instantly within our full interactive network visualization map.
                        </p>

                        <div className="grid grid-cols-4 gap-1.5 font-mono text-center text-xs select-none">
                          {["O-", "O+", "A+", "AB+"].map((g) => (
                            <div
                              key={g}
                              onClick={() => {
                                setSelectedSearchGroup(g as BloodGroup);
                                setActiveTab("compatibility");
                              }}
                              className="bg-white/5 border border-white/5 hover:border-red-500/30 py-2.5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                            >
                              <span className="font-bold text-slate-100 block mb-0.5">{g}</span>
                              <span className="text-[9px] text-slate-400">
                                {g === "O-" ? "Univ Donor" : g === "AB+" ? "Univ Rec" : "Biocompat"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* 1.5 PITCH DECK REMOVED */}

                {/* 2. DONOR HEALTH PASSPORT */}
                {activeTab === "passport" && (
                  <div>
                    <DonorHealthPassport />
                  </div>
                )}

                {/* 3. SMART DONOR SEARCH VIEW */}
                {activeTab === "search" && (
                  <div>
                    <DonorSearch 
                      onAddEmergencyRequest={handleAddEmergencyRequest}
                      savedFamilyMemberSearchGroup={selectedSearchGroup}
                    />
                  </div>
                )}

                {/* 3. FAMILY EMERGENCY VAULT */}
                {activeTab === "vault" && (
                  <div>
                    <FamilyVault 
                      onSelectSearchGroup={(grp) => setSelectedSearchGroup(grp)}
                      onAddEmergencyRequest={handleAddEmergencyRequest}
                      onTransitionToTab={(tab) => setActiveTab(tab)}
                    />
                  </div>
                )}

                {/* 4. ACTIVE EMERGENCY SOS REGISTRY */}
                {activeTab === "requests" && (
                  <div>
                    <EmergencyRegister 
                      requests={emergencyRequests}
                      onSetRequests={setEmergencyRequests}
                      onSelectSearchGroup={(grp) => setSelectedSearchGroup(grp)}
                      onTransitionToTab={(tab) => setActiveTab(tab)}
                    />
                  </div>
                )}

                {/* 5. CARD COMPATIBILITY GRAPH EXPLORER */}
                {activeTab === "compatibility" && (
                  <div>
                    <CompatibilityChart />
                  </div>
                )}

                {/* 6. EDUCATIONAL REHABILITATION CENTER */}
                {activeTab === "awareness" && (
                  <div>
                    <AwarenessHub />
                  </div>
                )}

                {/* 7. DIAGNOSTIC ANALYTICS VIEW */}
                {activeTab === "analytics" && (
                  <div>
                    <AnalyticsHub />
                  </div>
                )}

                {/* 8. CORE CHAT BOT COMPOSITE VIEW */}
                {activeTab === "assistant" && (
                  <div>
                    <AssistantChat />
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </main>

        </div>

      </div>

      {/* Modern custom toast alerts dynamic channel */}
      <NotificationToastContainer 
        toasts={activeToasts}
        onRemoveToast={(id) => setActiveToasts((prev) => prev.filter((t) => t.id !== id))}
        onExploreDonors={handleToastExploreDonors}
        onSimulateSOS={handleAddEmergencyRequest}
      />

    </div>
  );
}
