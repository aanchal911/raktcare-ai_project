import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { 
  Heart, 
  ShieldCheck, 
  ChevronDown, 
  Activity, 
  Sparkles,
  Shield,
  LifeBuoy
} from "lucide-react";

interface LandingPage3DProps {
  onEnterDashboard: () => void;
}

interface SafetyParticle {
  x: number;
  y: number;
  z: number;
  radius: number;
  speed: number;
  angle: number;
  amplitude: number;
  type: "cell" | "shield"; // some particles are blood cells, some are safety shield crosses
  color: string;
}

export function LandingPage3D({ onEnterDashboard }: LandingPage3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [pulseScale, setPulseScale] = useState(1);

  // Parallax tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      const x = (e.clientX / clientWidth) * 2 - 1;
      const y = (e.clientY / clientHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 3D canvas of blood + safety graphics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: SafetyParticle[] = [];
    const particleCount = 40;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const z = Math.random() * 2 + 0.2;
        const speedFactor = 1 / z;
        const type = Math.random() > 0.7 ? "shield" : "cell";
        
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z,
          radius: (type === "shield" ? 8 : 6) * speedFactor,
          speed: (0.4 + Math.random() * 1.2) * speedFactor,
          angle: Math.random() * Math.PI * 2,
          amplitude: 15 + Math.random() * 25,
          type,
          color: type === "shield" 
            ? "rgba(34, 197, 94, 0.45)"  // Shimmering green safety guard
            : "rgba(220, 38, 38, 0.55)"  // Deep oxygen-rich blood cells
        });
      }
    };

    const draw = () => {
      ctx.fillStyle = "rgba(6, 3, 3, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle space-grid safety vectors
      ctx.strokeStyle = "rgba(220, 38, 38, 0.02)";
      ctx.lineWidth = 1;
      const grid = 80;
      for (let x = 0; x < canvas.width; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += grid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Render Blood + Safety particles
      particles.forEach((p) => {
        p.x += p.speed;
        p.angle += 0.008;

        // Interactive mouse gravity offsets
        const dx = p.x - (canvas.width / 2 + mousePos.x * 150);
        const dy = p.y - (canvas.height / 2 + mousePos.y * 150);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const push = (150 - dist) / 150;
          p.x += (dx / dist) * push * 3;
          p.y += (dy / dist) * push * 3;
        }

        // Standard boundary wrap
        if (p.x > canvas.width + 30) {
          p.x = -30;
          p.y = Math.random() * canvas.height;
        }

        ctx.save();
        ctx.globalAlpha = 0.3 + (1.2 / p.z) * 0.4;

        if (p.type === "cell") {
          // Draw standard Erythrocyte (biconcave blood cell)
          ctx.shadowBlur = p.radius * 1.5;
          ctx.shadowColor = "rgba(220, 38, 38, 0.4)";
          
          ctx.beginPath();
          ctx.ellipse(p.x, p.y + Math.sin(p.angle) * p.amplitude * 0.2, p.radius * 1.2, p.radius * 0.8, Math.PI / 4, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();

          // Concave center depression
          ctx.beginPath();
          ctx.ellipse(p.x, p.y + Math.sin(p.angle) * p.amplitude * 0.2, p.radius * 0.5, p.radius * 0.3, Math.PI / 4, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(6, 3, 3, 0.9)";
          ctx.fill();
        } else {
          // Draw a soft glowing safety cross / shield indicator
          ctx.shadowBlur = p.radius * 2;
          ctx.shadowColor = "rgba(34, 197, 94, 0.5)";
          
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          
          // Draw cross
          const size = p.radius;
          ctx.moveTo(p.x - size, p.y);
          ctx.lineTo(p.x + size, p.y);
          ctx.moveTo(p.x, p.y - size);
          ctx.lineTo(p.x, p.y + size);
          ctx.stroke();

          // Tiny protective ring around cross
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 1.4, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(34, 197, 94, 0.2)";
          ctx.stroke();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [mousePos]);

  // Click smooth scrolldown logic
  const handleScrollDown = () => {
    onEnterDashboard();
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-[#060303] flex flex-col justify-between p-6 lg:p-10 relative overflow-hidden select-none"
    >
      {/* 3D Canvas rendering blood flow + safety symbols */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Floating high-impact ambient light fields */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full bg-red-950/20 blur-[130px] pointer-events-none z-0 transition-transform duration-700"
        style={{
          transform: `translate(${mousePos.x * 50}px, ${mousePos.y * 50}px) translate(-50%, -50%)`,
          top: "50%",
          left: "50%"
        }}
      />
      <div 
        className="absolute w-[350px] h-[350px] rounded-full bg-green-950/10 blur-[110px] pointer-events-none z-0 transition-transform duration-700"
        style={{
          transform: `translate(${mousePos.x * -70}px, ${mousePos.y * -70}px) translate(-50%, -50%)`,
          top: "40%",
          left: "70%"
        }}
      />

      {/* HEADER RAIL */}
      <header className="flex items-center justify-between border-b border-white/5 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-red-400 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.45)]">
            <Heart className="w-5.5 h-5.5 text-white fill-white/10 animate-pulse" />
          </div>
          <div className="text-left">
            <span className="font-bold text-lg tracking-tight text-white uppercase block">
              RaktCare AI
            </span>
            <span className="text-[9px] text-slate-500 font-mono tracking-widest block uppercase">
              Clinical Quality Guard
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-green-400 animate-pulse bg-green-950/30 px-3 py-1 rounded border border-green-500/20 font-bold block">
            SECURE HEALTH SYSTEM ACTIVE
          </span>
        </div>
      </header>

      {/* MAIN HERO: PURE BLOOD DROP + SAFETY GRAPHIC */}
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-8 relative z-10 py-6">
        
        {/* GRAPHICS LAYER: Blood plus Safety nested interactive vector drop */}
        <div className="relative flex items-center justify-center w-64 h-64 select-none">
          
          {/* Ambient red & green protective aura */}
          <div className="absolute w-56 h-56 bg-red-600/10 rounded-full blur-[60px] animate-pulse" />
          <div className="absolute w-44 h-44 bg-green-600/10 rounded-full blur-[50px] [animation-delay:1.5s] animate-pulse" />

          {/* 3D Glass Shield contour (representing Safety Guard) */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.05, 1]
            }}
            transition={{
              rotate: { repeat: Infinity, duration: 25, ease: "linear" },
              scale: { repeat: Infinity, duration: 6, ease: "easeInOut" }
            }}
            className="absolute inset-0 rounded-full border border-dashed border-red-500/20 flex items-center justify-center"
          >
            <div className="w-[90%] h-[90%] rounded-full border border-green-500/20 flex items-center justify-center">
              <Shield className="w-full h-full text-green-500/10 stroke-[0.3]" />
            </div>
          </motion.div>

          {/* Golden/Green Glassmorphic Safety Shield centered */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute w-48 h-48 rounded-2xl bg-white/[0.02] backdrop-blur-md border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex items-center justify-center group"
          >
            
            {/* Pulsating Crimson Red Blood Droplet nestled perfectly inside */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg
                viewBox="0 0 100 120"
                className="w-full h-full drop-shadow-[0_0_20px_rgba(239,68,68,0.7)] filter group-hover:scale-105 transition-transform duration-300"
              >
                <defs>
                  <linearGradient id="landingDropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="50%" stopColor="#dc2626" />
                    <stop offset="100%" stopColor="#811212" />
                  </linearGradient>
                  <radialGradient id="highlightReflect" cx="30%" cy="30%" r="25%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </radialGradient>
                </defs>
                
                {/* 3D Blood Drop Shape */}
                <path
                  d="M50,10 C82,55 90,82 85,97 C78,112 50,115 50,115 C50,115 22,112 15,97 C10,82 18,55 50,10 Z"
                  fill="url(#landingDropGrad)"
                />

                {/* Refracted Glossy Layer */}
                <path
                  d="M32,40 C38,24 48,20 48,20 C54,20 60,36 56,43 C53,48 46,50 38,46 C34,44 30,42 32,40 Z"
                  fill="url(#highlightReflect)"
                />

                {/* Dynamic Inner Clinical Cross (The Safety Emblem) */}
                <path
                  d="M44,70 h12 v12 h-12 Z"
                  fill="none"
                />
              </svg>

              {/* Heartbeat Indicator centered in Blood Drop */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                <ShieldCheck className="w-7 h-7 text-green-400 drop-shadow-md animate-pulse.5s_infinite]" />
                <span className="text-[7px] font-mono tracking-widest text-[#ffebeb] uppercase block mt-1 font-bold">
                  SAFE BLOOD
                </span>
              </div>
            </div>

            {/* Shield lock corners visual */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/30" />
            <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/30" />
            <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/30" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/30" />

          </motion.div>

        </div>

        {/* COMPOSITE SLOGAN BRANDING */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-950/40 border border-green-500/30 text-green-400 font-mono text-[10px] uppercase font-bold tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Hematological Biosecurity
          </div>
          
          {/* USER SPECIFIED HEADING */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Protect your health<br/>
            <span className="text-transparent-gradient">with RaktCare AI</span>
          </h1>

          <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed font-medium">
            Authorized clinical safeguard nodes predicting blood cross-matching security, dynamic donor cycles, and regional deficiencies with zero latency.
          </p>
        </div>

        {/* SCROLL-DOWN TRIGGER HELPER BUTTON */}
        <div className="pt-2">
          <button
            id="btn-trigger-scrolldown"
            onClick={handleScrollDown}
            className="px-6 py-3 bg-gradient-to-r from-red-650 to-red-550 hover:brightness-110 active:scale-95 transition-all text-white font-bold font-mono text-xs rounded-xl tracking-wider cursor-pointer shadow-[0_0_25px_rgba(220,38,38,0.4)] flex items-center gap-2.5 mx-auto border border-red-500/20 group"
          >
            <span>SCROLL DOWN TO DASHBOARD</span>
            <ChevronDown className="w-4 h-4 text-white animate-bounce group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>

      {/* FOOTER METRICS */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-4 text-slate-505 font-mono text-[10px] relative z-10">
        <div>
          <span>RAKTCARE SMART LABS & CORES</span>
        </div>

        <div 
          onClick={handleScrollDown}
          className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors bg-white/5 border border-white/10 px-4 py-1.5 rounded-full"
        >
          <ChevronDown className="w-3 h-3 text-red-500 animate-bounce" />
          <span className="text-slate-300 font-bold">SCROLL DOWN OR SWIPE UP TO SCAN DATA</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>REAL-TIME CLINICAL SANCTIONED VALIDATION</span>
        </div>
      </footer>

    </div>
  );
}
