import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage } from "../types";
import { MessageSquare, Send, Bot, RefreshCw, Sparkles, User, AlertCircle, HelpCircle } from "lucide-react";

export function AssistantChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "model",
      text: "Welcome to **RaktCare AI Assistant**. I am linked with your core clinic documentation. Ask me anything about biocompatibility thresholds, Red Cell (Erythropoietin) replacement rates, or donation general safety guidelines!",
      timestamp: new Date()
    }
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const presetQueries = [
    "Can I donate if I'm 18?",
    "How often can I donate?",
    "Does blood donation hurt?",
    "How long does recovery take?"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-usr`,
      role: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMsg("");
    setIsLoading(true);

    try {
      // Package payload with recent history
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload
        })
      });

      if (!res.ok) {
        throw new Error("HTTP error connecting to digital health line");
      }

      const data = await res.json();
      
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-model`,
        role: "model",
        text: data.text || "I apologize, but my diagnostic systems are transiently out of range. Please review our safety pamphlets.",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        role: "model",
        text: "🚨 **Connection Alert**: Our local telemetry servers experienced an interruption. Don't worry—most adults can donate every 56 days safely, replenishing fluids post-haste! Contact urgent support lines for any SOS assistance.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to render a clean subset of markdown safely in the UI
  // Handles bold (**text**), bullet points (* or -), and inline clean breaks
  const renderFormattedText = (raw: string) => {
    const lines = raw.split("\n");
    return lines.map((line, idx) => {
      let content = line;
      let isBullet = false;

      // Handle simple list elements
      if (content.trim().startsWith("- ") || content.trim().startsWith("* ")) {
        content = content.replace(/^[\s*-]+/, "");
        isBullet = true;
      }

      // Handle bold blocks via regex replacements
      const parts = [];
      const regex = /\*\*([^*]+)\*\*/g;
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(content)) !== null) {
        // Append raw pre-match text
        if (match.index > lastIndex) {
          parts.push(content.substring(lastIndex, match.index));
        }
        // Append bold match
        parts.push(
          <strong key={match.index} className="font-extrabold text-red-400">
            {match[1]}
          </strong>
        );
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex));
      }

      const renderedLine = parts.length > 0 ? parts : content;

      if (isBullet) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-300 mb-1 leading-relaxed text-left">
            {renderedLine}
          </li>
        );
      }

      return (
        <p key={idx} className="text-xs text-slate-300 leading-relaxed mb-1.5 min-h-[4px] text-left">
          {renderedLine}
        </p>
      );
    });
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col h-[520px] overflow-hidden">
      
      {/* Bot Header component */}
      <div className="bg-white/5 p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-red-955/25 border border-red-500/40 flex items-center justify-center relative">
            <Bot className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border border-black" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-bold text-white leading-none">RaktCare Core AI</h4>
            <span className="text-[10px] text-green-455 font-mono font-bold tracking-wider">Expert Medical Grounding</span>
          </div>
        </div>
        
        <button
          id="btn-reboot-chat"
          onClick={() => {
            setMessages([
              {
                id: "welcome-reboot",
                role: "model",
                text: "Diagnostic timeline flushed. Ready for active blood donation queries!",
                timestamp: new Date()
              }
            ]);
          }}
          className="p-1.5 rounded-lg border border-white/10 hover:border-red-500/30 text-slate-450 hover:text-white bg-white/5 transition-colors cursor-pointer"
          title="Flush history logs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Scroll stage */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <div
              key={m.id}
              className={`flex gap-2 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : ""}`}
            >
              {/* Icon avatar */}
              <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs ${
                isUser 
                  ? "bg-white/5 border border-white/10 text-slate-305" 
                  : "bg-red-955/20 border border-red-500/20 text-red-400"
              }`}>
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Speech bubble */}
              <div className={`rounded-2xl px-3.5 py-2.5 text-xs ${
                isUser 
                  ? "bg-white/10 text-white border border-white/15 rounded-tr-none" 
                  : "bg-[#0b0606]/60 border border-white/10 text-slate-205 rounded-tl-none font-medium text-left"
              }`}>
                {renderFormattedText(m.text)}
              </div>
            </div>
          );
        })}

        {/* Loading typing indicators */}
        {isLoading && (
          <div className="flex gap-2 max-w-[85%]">
            <div className="w-6 h-6 rounded-full bg-red-955/20 border border-red-500/20 flex items-center justify-center text-red-400">
              <Bot className="w-3.5 h-3.5 animate-bounce" />
            </div>
            <div className="bg-[#0b0606]/60 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce" />
            </div>
          </div>
        )}
      </div>

      {/* Preset fast prompt queries widget */}
      <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap select-none">
        {presetQueries.map((query) => (
          <button
            key={query}
            id={`btn-preset-query-${query.replace(/\s+/g, "_")}`}
            onClick={() => handleSendMessage(query)}
            className="px-3 py-1.5 rounded-full bg-[#120a0a]/50 hover:bg-white/10 text-[10px] text-slate-350 hover:text-white border border-white/10 hover:border-red-500/30 font-bold transition-all cursor-pointer inline-block"
          >
            {query}
          </button>
        ))}
      </div>

      {/* Active input actions bar */}
      <div className="p-3 bg-white/5 border-t border-white/10 flex gap-2">
        <input
          id="input-assistant-chat"
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputMsg)}
          placeholder="Ask RaktCare AI (e.g. Does medication disqualify me?)..."
          className="flex-1 bg-[#120a0a]/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-550 focus:ring-0 transition-all"
        />
        <button
          id="btn-send-chat"
          onClick={() => handleSendMessage(inputMsg)}
          disabled={!inputMsg.trim() || isLoading}
          className={`p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            !inputMsg.trim() || isLoading 
              ? "bg-white/5 text-slate-600 border border-white/10 cursor-not-allowed" 
              : "bg-red-655 text-white hover:bg-red-550 shadow-md font-bold"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
