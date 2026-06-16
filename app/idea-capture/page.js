"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Lightbulb, 
  Mic, 
  MicOff, 
  Loader2, 
  Sparkles,
  FileText,
  Target,
  Users,
  Tv,
  MessageSquare,
  Zap,
  ArrowRight,
  AlertCircle
} from "lucide-react";

export default function IdeaCapture() {
  const [idea, setIdea] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [brief, setBrief] = useState(null);
  const [error, setError] = useState(null);

  const [recognition, setRecognition] = useState(null);
  const [voiceSupported, setVoiceSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setVoiceSupported(false);
        return;
      }
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsRecording(true);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      rec.onerror = (e) => {
        console.error("Speech recognition error:", e);
        setIsRecording(false);
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIdea((prev) => {
          const spacing = prev.trim() ? " " : "";
          return prev + spacing + transcript;
        });
      };

      setRecognition(rec);
    }
  }, []);

  const toggleRecording = () => {
    if (!voiceSupported) return;
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
    } else {
      setError(null);
      try {
        recognition.start();
      } catch (e) {
        console.error("Failed to start speech recognition:", e);
      }
    }
  };

  const handleGenerate = async () => {
    if (idea.trim().length < 10) {
      setError("Please describe your idea in at least 10 characters");
      return;
    }

    setIsLoading(true);
    setError(null);
    setBrief(null);

    try {
      const res = await fetch("/api/generate-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate brief. Please try again.");
      }

      setBrief(data.brief);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIdea("");
    setBrief(null);
    setError(null);
  };

  // Helper to color Effort badges
  const getEffortBadgeStyles = (effort) => {
    const cleanEffort = (effort || "").toLowerCase();
    if (cleanEffort === "low") {
      return "bg-green-150 text-green-700 border-green-300";
    }
    if (cleanEffort === "high") {
      return "bg-red-150 text-red-700 border-red-300";
    }
    return "bg-citrus/15 text-citrus border-citrus/30";
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 sm:py-20 flex flex-col gap-10">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-amalfi tracking-tight mb-4 flex items-center justify-center gap-3">
          <Lightbulb className="w-10 h-10 text-amalfi" />
          {"Capture Your Spark"}
        </h1>
        <p className="text-lg font-medium text-slate-700 max-w-2xl mx-auto leading-relaxed">
          {"Drop your idea — messy, half-formed, or rough. We'll shape it into something real."}
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <div className="relative">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            disabled={isLoading}
            placeholder="e.g. I want to make a video about why students in India struggle to find their first internship..."
            rows={5}
            className="w-full bg-white/50 backdrop-blur-sm border border-white/60 rounded-xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amalfi/40 transition-all duration-300 disabled:opacity-60"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <button
              onClick={toggleRecording}
              disabled={isLoading || !voiceSupported}
              className={`flex items-center gap-2 px-4.5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                isRecording
                  ? "bg-citrus text-white shadow-md animate-pulse"
                  : "bg-white/60 border border-white/80 text-amalfi hover:bg-white/80 active:scale-95 disabled:opacity-50"
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isRecording ? "Stop Recording" : "Voice Record"}</span>
            </button>
            
            {!voiceSupported && (
              <span className="text-[10px] text-slate-500 font-medium">
                {"Voice recording not supported in this browser. Please use Chrome."}
              </span>
            )}
          </div>

          <span className="text-xs font-semibold text-slate-500">
            {idea.length} {"characters"}
          </span>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || idea.trim().length < 10}
          className="bg-amalfi hover:bg-[#1e4484] text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{"Generating..."}</span>
            </>
          ) : (
            <span>{"Generate Brief"}</span>
          )}
        </button>
      </div>

      {/* Error Output */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3 shadow-sm text-red-800">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
          <div className="flex flex-col gap-1">
            <h4 className="font-bold">{"Failed to generate brief"}</h4>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Brief Output */}
      {brief && (
        <div className="flex flex-col gap-8">
          <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-white/30">
              <Sparkles className="w-6 h-6 text-amalfi" />
              <h2 className="text-2xl font-extrabold text-amalfi tracking-tight">
                {"Your Content Brief"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl p-4.5">
                <div className="flex items-center gap-2 text-amalfi font-bold text-sm mb-1">
                  <FileText className="w-4 h-4" />
                  <span>{"Content Title"}</span>
                </div>
                <p className="text-slate-800 font-bold text-base">{brief.title}</p>
              </div>

              {/* Hook */}
              <div className="bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl p-4.5">
                <div className="flex items-center gap-2 text-amalfi font-bold text-sm mb-1">
                  <Target className="w-4 h-4" />
                  <span>{"Hook"}</span>
                </div>
                <p className="text-slate-800 font-semibold text-base italic">{"\""}{brief.hook}{"\""}</p>
              </div>

              {/* Target Audience */}
              <div className="bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl p-4.5">
                <div className="flex items-center gap-2 text-amalfi font-bold text-sm mb-1">
                  <Users className="w-4 h-4" />
                  <span>{"Target Audience"}</span>
                </div>
                <p className="text-slate-700 text-sm font-medium">{brief.audience}</p>
              </div>

              {/* Recommended Format */}
              <div className="bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl p-4.5">
                <div className="flex items-center gap-2 text-amalfi font-bold text-sm mb-1">
                  <Tv className="w-4 h-4" />
                  <span>{"Recommended Format"}</span>
                </div>
                <p className="text-slate-700 text-sm font-medium">{brief.format}</p>
              </div>

              {/* Tone */}
              <div className="bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl p-4.5">
                <div className="flex items-center gap-2 text-amalfi font-bold text-sm mb-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{"Tone"}</span>
                </div>
                <p className="text-slate-700 text-sm font-medium">{brief.tone}</p>
              </div>

              {/* Effort Level */}
              <div className="bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl p-4.5">
                <div className="flex items-center gap-2 text-amalfi font-bold text-sm mb-1.5">
                  <Zap className="w-4 h-4" />
                  <span>{"Effort Level"}</span>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getEffortBadgeStyles(brief.effort)}`}>
                  {brief.effort}
                </span>
              </div>

              {/* Why This Idea Matters */}
              <div className="bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl p-4.5 md:col-span-2">
                <div className="flex items-center gap-2 text-amalfi font-bold text-sm mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>{"Why This Idea Matters"}</span>
                </div>
                <p className="text-slate-700 text-sm font-medium leading-relaxed">{brief.why}</p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-end">
            <button
              onClick={handleReset}
              className="w-full sm:w-auto border-2 border-amalfi text-amalfi hover:bg-amalfi/10 px-8 py-3 rounded-full font-bold transition-all duration-300 active:scale-95"
            >
              {"Start Fresh"}
            </button>
            <Link
              href={`/starting-point?idea=${encodeURIComponent(idea)}`}
              className="w-full sm:w-auto bg-amalfi hover:bg-[#1e4484] text-white px-8 py-3.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all duration-300 text-center flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>{"Find Your Starting Point"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
