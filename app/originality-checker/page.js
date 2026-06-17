"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Lightbulb, 
  Rocket, 
  Search, 
  Shield, 
  ChevronRight, 
  Loader2, 
  Sparkles, 
  RefreshCw, 
  ArrowRight, 
  AlertCircle 
} from "lucide-react";

function OriginalityCheckerContent() {
  const searchParams = useSearchParams();
  const topicParam = searchParams.get("topic") || searchParams.get("idea") || "";
  const platformParam = searchParams.get("platform") || "";
  const angleParam = searchParams.get("angle") || "";

  // Form states
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("YouTube");
  const [angle, setAngle] = useState("");

  // Loading & App states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  // Pre-populate fields if parameters exist in the URL query string
  useEffect(() => {
    if (topicParam) setTopic(topicParam);
    if (platformParam) setPlatform(platformParam);
    if (angleParam) setAngle(angleParam);
  }, [topicParam, platformParam, angleParam]);

  // Loading messages rotation
  const loadingMessages = [
    "Scanning YouTube for similar content...",
    "Analyzing saturation levels...",
    "Finding your unique angle...",
    "Almost there..."
  ];

  useEffect(() => {
    let interval;
    if (isLoading) {
      setLoadingMessage(loadingMessages[0]);
      let index = 0;
      interval = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[index]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Check Originality handler
  const handleCheckOriginality = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Please describe your content idea.");
      return;
    }
    if (!platform.trim()) {
      setError("Please select a platform.");
      return;
    }
    if (!angle.trim()) {
      setError("Please enter your unique angle.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch("/api/originality-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform, angle }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Originality check failed. Please try again.");
      }

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Form reset handler
  const handleReset = () => {
    setTopic("");
    setPlatform("YouTube");
    setAngle("");
    setResults(null);
    setError(null);
    // Smooth scroll back to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // CSS/SVG Circle color generator
  const getScoreColor = (score) => {
    if (score <= 30) return "#22c55e"; // green
    if (score <= 60) return "#FFA62B"; // citrus orange
    if (score <= 80) return "#f97316"; // orange-red
    return "#ef4444"; // red
  };

  // Saturation badge generator
  const getSaturationBadge = (score) => {
    if (score <= 30) {
      return {
        text: "🟢 Low Saturation — Great timing!",
        classes: "bg-emerald-50 border border-emerald-200 text-emerald-700"
      };
    }
    if (score <= 60) {
      return {
        text: "🟡 Medium Saturation — Angle matters",
        classes: "bg-yellow-50 border border-citrus/30 text-citrus"
      };
    }
    if (score <= 80) {
      return {
        text: "🟠 High Saturation — Stand out or step aside",
        classes: "bg-orange-50 border border-orange-200 text-orange-700"
      };
    }
    return {
      text: "🔴 Oversaturated — You NEED a unique angle",
      classes: "bg-red-50 border border-red-200 text-red-700"
    };
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 sm:py-20 flex flex-col gap-10">
      
      {/* Breadcrumb Flow Indicator */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-white/20 px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm w-fit mx-auto text-xs font-semibold text-slate-500 shadow-sm">
        <div className="flex items-center gap-1.5 opacity-60">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Capture</span>
        </div>
        <ChevronRight className="w-3 h-3 opacity-40" />
        <div className="flex items-center gap-1.5 opacity-60">
          <Rocket className="w-3.5 h-3.5" />
          <span>Start</span>
        </div>
        <ChevronRight className="w-3 h-3 opacity-40" />
        <div className="flex items-center gap-1.5 text-white bg-amalfi px-3.5 py-1 rounded-full font-bold shadow-sm scale-105">
          <Search className="w-3.5 h-3.5 text-white" />
          <span>Check</span>
        </div>
        <ChevronRight className="w-3 h-3 opacity-40" />
        <div className="flex items-center gap-1.5 opacity-60">
          <Shield className="w-3.5 h-3.5" />
          <span>Scan</span>
        </div>
      </div>

      {/* Heading Block */}
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-amalfi tracking-tight mb-4 flex items-center justify-center gap-3 font-sans">
          🔍 Originality Checker
        </h1>
        <p className="text-lg font-medium text-slate-700 max-w-2xl mx-auto leading-relaxed">
          Find out how saturated your idea is — and exactly how to make yours stand out.
        </p>
      </div>

      {/* Input Form Card */}
      <form onSubmit={handleCheckOriginality} className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-6 sm:p-8 shadow-md flex flex-col gap-6">
        
        {/* Topic Input */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-bold text-amalfi" htmlFor="topic">
            What&apos;s your content idea?
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. how to start coding as a complete beginner"
            disabled={isLoading}
            className="w-full bg-white/50 border border-white/60 rounded-xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amalfi/40 transition-all duration-300 disabled:opacity-60"
          />
        </div>

        {/* Platform Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-bold text-amalfi" htmlFor="platform">
            Where are you posting this?
          </label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            disabled={isLoading}
            className="w-full bg-white/50 border border-white/60 rounded-xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amalfi/40 transition-all duration-300 disabled:opacity-60"
          >
            <option value="YouTube">YouTube</option>
            <option value="Instagram">Instagram</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Twitter/X">Twitter/X</option>
            <option value="Podcast">Podcast</option>
            <option value="Blog">Blog</option>
          </select>
        </div>

        {/* Unique Angle Textarea */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-bold text-amalfi" htmlFor="angle">
            What&apos;s YOUR unique angle or perspective?
          </label>
          <textarea
            id="angle"
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
            placeholder="e.g. I failed my first 3 coding interviews and want to share what I wish I knew before starting. Not the success story — the real one."
            rows={4}
            disabled={isLoading}
            className="w-full bg-white/50 border border-white/60 rounded-xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amalfi/40 transition-all duration-300 disabled:opacity-60"
          />
          <span className="text-xs text-slate-500 font-semibold">
            The more specific your angle, the more accurate your originality score will be.
          </span>
        </div>

        {/* Error Output */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3 shadow-sm text-red-800 w-full animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
            <div className="flex flex-col gap-1">
              <h4 className="font-bold">Originality Check Failed</h4>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Submit CTA Button & Loading Animation */}
        <div className="flex flex-col items-center gap-4 mt-2">
          <button
            type="submit"
            disabled={isLoading || !topic.trim() || !angle.trim()}
            className="bg-amalfi text-white rounded-full px-10 py-4 text-lg font-semibold hover:opacity-90 hover:scale-[1.01] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <span>🔍 Check Originality</span>
            )}
          </button>

          {isLoading && (
            <div className="flex items-center gap-2 text-amalfi font-bold animate-pulse mt-2 bg-white/40 px-4 py-2 rounded-full border border-white/50 shadow-sm">
              <Sparkles className="w-5 h-5 text-citrus animate-spin" style={{ animationDuration: "3s" }} />
              <span>{loadingMessage}</span>
            </div>
          )}
        </div>
      </form>

      {/* Results Section */}
      {results && (
        <div className="flex flex-col gap-8 mt-4 animate-fade-in-up">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* CARD 1 — Saturation Score */}
            <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-md p-6 sm:p-8 flex flex-col items-center justify-between text-center gap-6">
              <h2 className="text-xl font-extrabold text-amalfi tracking-tight w-full text-left">
                📊 Saturation Score
              </h2>

              <div className="relative flex items-center justify-center my-2">
                <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="transparent"
                    stroke="rgba(255, 255, 255, 0.4)"
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="transparent"
                    stroke={getScoreColor(results.saturationScore)}
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={2 * Math.PI * 50 * (1 - results.saturationScore / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <span className="absolute text-2xl font-black text-slate-800">
                  {results.saturationScore}%
                </span>
              </div>

              <div className="flex flex-col items-center gap-3">
                <span className="text-3xl font-black text-slate-800">
                  {results.saturationScore}/100
                </span>
                
                {(() => {
                  const badge = getSaturationBadge(results.saturationScore);
                  return (
                    <span className={`px-4.5 py-2 rounded-full font-bold text-sm inline-block shadow-sm border ${badge.classes}`}>
                      {badge.text}
                    </span>
                  );
                })()}

                <span className="text-xs font-bold text-slate-600 mt-2">
                  {results.usedFallback ? (
                    "Based on AI knowledge analysis"
                  ) : (
                    `Found ${results.videoCount !== null ? results.videoCount.toLocaleString() : "0"} videos on this topic on YouTube`
                  )}
                </span>
              </div>
            </div>

            {/* CARD 2 — Your Unique Angle Score */}
            <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-md p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div>
                <h2 className="text-xl font-extrabold text-amalfi tracking-tight">
                  ✨ Your Angle Score
                </h2>
                <p className="text-sm font-semibold text-slate-600 mt-1">
                  How differentiated is YOUR take on this topic?
                </p>
              </div>

              <div className="flex flex-col gap-4 my-auto">
                <div className="flex items-center gap-4 w-full">
                  <div className="w-full bg-white/40 h-4.5 rounded-full overflow-hidden border border-white/50 shadow-inner">
                    <div 
                      className="bg-citrus h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${results.angleScore}%` }}
                    />
                  </div>
                  <span className="text-2xl font-extrabold text-amalfi min-w-[3.5rem] text-right">
                    {results.angleScore}/100
                  </span>
                </div>
              </div>

              <p className="text-slate-700 text-sm font-semibold leading-relaxed border-l-4 border-citrus pl-4 bg-white/20 p-4 rounded-r-xl">
                {results.angleSummary}
              </p>
            </div>

          </div>

          {/* CARD 3 — Unique Angle Suggestions */}
          <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-md p-6 sm:p-8 flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-extrabold text-amalfi tracking-tight">
                💡 3 Ways to Stand Out
              </h2>
              <p className="text-sm font-semibold text-slate-600 mt-1">
                Specific to your topic and your angle
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {results.suggestions && results.suggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className="bg-white/40 rounded-xl p-5 border border-white/50 flex gap-4 items-start shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="bg-amalfi text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm mt-0.5">
                    {index + 1}
                  </div>
                  <div className="flex flex-col gap-2.5 w-full">
                    <h4 className="font-extrabold text-amalfi text-base leading-snug">
                      {suggestion.title}
                    </h4>
                    <p className="text-slate-700 text-sm font-semibold leading-relaxed">
                      {suggestion.explanation}
                    </p>
                    <div>
                      <span className="inline-block bg-citrus/15 text-citrus border border-citrus/20 rounded-full px-3.5 py-1.5 text-xs font-extrabold tracking-wide uppercase">
                        Why this works: {suggestion.whyItWorks}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 4 — The Verdict */}
          <div className="bg-yellow-50/50 border border-citrus/20 backdrop-blur-sm rounded-2xl p-6 sm:p-8 flex flex-col gap-3 shadow-inner">
            <h2 className="text-xl font-extrabold text-amalfi tracking-tight flex items-center gap-2">
              ⚡ The Verdict
            </h2>
            <p className="text-xl sm:text-2xl font-extrabold italic text-slate-800 leading-relaxed font-sans mt-2">
              &ldquo;{results.verdict}&rdquo;
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-end mt-4">
            <button
              onClick={handleReset}
              className="w-full sm:w-auto border-2 border-amalfi text-amalfi bg-transparent hover:bg-amalfi/10 px-8 py-3.5 rounded-full font-bold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Check Another Idea</span>
            </button>
            
            <Link
              href="/safety-scanner"
              className="w-full sm:w-auto bg-amalfi hover:bg-[#1e4484] text-white px-8 py-4 rounded-full font-bold shadow-md hover:shadow-lg transition-all duration-300 text-center flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>Run Safety Scan →</span>
            </Link>
          </div>

        </div>
      )}
      
    </main>
  );
}

export default function OriginalityChecker() {
  return (
    <Suspense fallback={
      <main className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-amalfi animate-spin" />
        <p className="text-slate-600 font-semibold">Loading Originality Checker...</p>
      </main>
    }>
      <OriginalityCheckerContent />
    </Suspense>
  );
}
