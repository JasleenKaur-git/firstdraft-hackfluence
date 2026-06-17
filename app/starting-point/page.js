"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Copy, 
  Check, 
  Loader2, 
  Sparkles, 
  RefreshCw, 
  ArrowRight, 
  AlertCircle,
  Lightbulb,
  Rocket,
  Search,
  ShieldCheck
} from "lucide-react";

function StartingPointContent() {
  const searchParams = useSearchParams();
  const ideaParam = searchParams.get("idea") || "";

  // Form states
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("YouTube Long-form");
  const [angle, setAngle] = useState("");
  
  // App states
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedHook, setSelectedHook] = useState(null);
  const [error, setError] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  // Pre-populate topic if query param exists
  useEffect(() => {
    if (ideaParam) {
      setTopic(ideaParam);
    }
  }, [ideaParam]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Please describe what your content is about.");
      return;
    }
    if (!angle.trim()) {
      setError("Please explain your personal angle.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);
    setSelectedHook(null);

    try {
      const res = await fetch("/api/starting-point", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform, angle }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate starting point. Please try again.");
      }

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTopic("");
    setPlatform("YouTube Long-form");
    setAngle("");
    setResults(null);
    setSelectedHook(null);
    setError(null);
    // Smooth scroll back to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 sm:py-20 flex flex-col gap-10">
      {/* Breadcrumb Flow Indicator */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 my-2 text-sm font-bold text-slate-700">
        <div className="bg-white/40 px-4 py-2 rounded-full border border-white/50 flex items-center gap-1.5 opacity-80">
          <Lightbulb className="w-4 h-4 text-slate-600" />
          <span>Capture</span>
        </div>
        <svg className="w-4 h-4 text-amalfi" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        
        <div className="bg-amalfi text-white px-5 py-2.5 rounded-full border border-amalfi flex items-center gap-1.5 shadow-md scale-105">
          <Rocket className="w-4 h-4 text-white" />
          <span>Start</span>
        </div>
        <svg className="w-4 h-4 text-amalfi" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>

        <div className="bg-white/40 px-4 py-2 rounded-full border border-white/50 flex items-center gap-1.5 opacity-50">
          <Search className="w-4 h-4 text-slate-400" />
          <span>Check</span>
        </div>
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>

        <div className="bg-white/40 px-4 py-2 rounded-full border border-white/50 flex items-center gap-1.5 opacity-50">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span>Scan</span>
        </div>
      </div>

      {/* Heading */}
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-amalfi tracking-tight mb-4 flex items-center justify-center gap-3">
          <Rocket className="w-10 h-10 text-amalfi" />
          🚀 Starting Point Generator
        </h1>
        <p className="text-lg font-medium text-slate-700 max-w-2xl mx-auto leading-relaxed">
          {"Tell us what you're making and who you are as a creator. We'll give you exactly where to begin — no more staring at a blank page."}
        </p>
      </div>

      {/* Input Card */}
      <form onSubmit={handleGenerate} className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-6 sm:p-8 shadow-md flex flex-col gap-6">
        {/* Topic Input */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-bold text-amalfi" htmlFor="topic">
            {"What's your content about?"}
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. how to start coding as a complete beginner"
            disabled={isLoading}
            className="w-full bg-white/50 backdrop-blur-sm border border-white/60 rounded-xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amalfi/40 transition-all duration-300 disabled:opacity-60"
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
            className="w-full bg-white/50 backdrop-blur-sm border border-white/60 rounded-xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amalfi/40 transition-all duration-300 disabled:opacity-60"
          >
            <option value="YouTube Long-form">YouTube Long-form</option>
            <option value="YouTube Shorts">YouTube Shorts</option>
            <option value="Instagram Reels">Instagram Reels</option>
            <option value="Instagram Carousel">Instagram Carousel</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Twitter/X">Twitter/X</option>
            <option value="Podcast">Podcast</option>
            <option value="Blog">Blog</option>
          </select>
        </div>

        {/* Personal Angle Textarea */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-bold text-amalfi" htmlFor="angle">
            {"What's YOUR angle? What makes you different?"}
          </label>
          <textarea
            id="angle"
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
            placeholder="e.g. I'm a self-taught developer who failed 3 times before landing my first job. I want to share what actually worked for me, not the textbook version."
            rows={4}
            disabled={isLoading}
            className="w-full bg-white/50 backdrop-blur-sm border border-white/60 rounded-xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amalfi/40 transition-all duration-300 disabled:opacity-60"
          />
          <span className="text-xs text-slate-500 font-semibold">
            This is what makes your content yours. The more specific, the better your starting point will be.
          </span>
        </div>

        {/* Error Output */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3 shadow-sm text-red-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
            <div className="flex flex-col gap-1">
              <h4 className="font-bold">Failed to generate starting point</h4>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Submit Button & Loading State */}
        <div className="flex flex-col items-center gap-4 mt-2">
          <button
            type="submit"
            disabled={isLoading || !topic.trim() || !angle.trim()}
            className="bg-amalfi text-white rounded-full px-10 py-4 text-lg font-semibold hover:opacity-90 hover:scale-[1.01] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <span>🚀 Generate My Starting Point</span>
            )}
          </button>

          {isLoading && (
            <div className="flex items-center gap-2 text-amalfi font-bold animate-pulse mt-2">
              <Sparkles className="w-5 h-5 text-citrus" />
              <span>Crafting your starting point...</span>
            </div>
          )}
        </div>
      </form>

      {/* Results Section */}
      {results && (
        <div className="flex flex-col gap-8 mt-4">
          
          {/* Card 1 - Hook Variations */}
          <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-6 sm:p-8 shadow-md flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-extrabold text-amalfi tracking-tight">
                🎣 3 Hook Variations
              </h2>
              <p className="text-sm font-semibold text-slate-600 mt-1">
                Choose the angle that feels most like you
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {results.hooks && results.hooks.map((hook, index) => {
                const isSelected = selectedHook === index;
                // Hook types badge colors
                let badgeClass = "";
                if (hook.type === "Curiosity") badgeClass = "bg-seabreeze/20 text-amalfi border border-seabreeze/30";
                else if (hook.type === "Relatability") badgeClass = "bg-citrus/15 text-citrus border border-citrus/25";
                else badgeClass = "bg-rose-100 text-rose-700 border border-rose-200";

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedHook(isSelected ? null : index)}
                    className={`relative bg-white/40 rounded-xl p-5 border cursor-pointer transition-all duration-300 hover:bg-white/50 flex flex-col gap-3 ${
                      isSelected 
                        ? "border-citrus ring-2 ring-citrus/40 shadow-md" 
                        : "border-white/50"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeClass}`}>
                          {hook.type}
                        </span>
                        {isSelected && (
                          <span className="text-xs font-bold text-citrus flex items-center gap-1">
                            ✓ Selected
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(hook.text, `hook-${index}`);
                        }}
                        className="flex items-center gap-1 text-xs font-bold text-amalfi bg-white/60 hover:bg-white/80 px-3 py-1.5 rounded-full border border-white/80 shadow-sm active:scale-95 transition-all duration-200"
                      >
                        {copiedKey === `hook-${index}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-slate-800 text-base font-semibold leading-relaxed">
                      &ldquo;{hook.text}&rdquo;
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2 - First Line */}
          <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-6 sm:p-8 shadow-md flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-amalfi tracking-tight">
                ✍️ Your First Line
              </h2>
              <p className="text-sm font-semibold text-slate-600 mt-1">
                The actual first sentence to say or write
              </p>
            </div>
            
            <div className="bg-white/40 rounded-xl p-6 border border-white/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p className="text-lg sm:text-xl font-bold italic text-slate-800 leading-relaxed font-sans border-l-4 border-citrus pl-4">
                &ldquo;{results.firstLine}&rdquo;
              </p>
              <button
                onClick={() => copyToClipboard(results.firstLine, "firstLine")}
                className="flex-shrink-0 flex items-center gap-1 text-xs font-bold text-amalfi bg-white/60 hover:bg-white/80 px-4 py-2 rounded-full border border-white/80 shadow-sm active:scale-95 transition-all duration-200"
              >
                {copiedKey === "firstLine" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 3 - Content Outline */}
          <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-6 sm:p-8 shadow-md flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-extrabold text-amalfi tracking-tight">
                📋 Content Outline
              </h2>
              <p className="text-sm font-semibold text-slate-600 mt-1">
                Your roadmap from start to finish
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {results.outline && results.outline.map((item, index) => (
                <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 flex gap-4 items-start hover:bg-white/25 transition-all duration-200">
                  <div className="bg-amalfi text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm mt-0.5">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-amalfi text-base mb-1">{item.title}</h4>
                    <p className="text-slate-700 text-sm font-semibold leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4 - Title Suggestions */}
          <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-6 sm:p-8 shadow-md flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-extrabold text-amalfi tracking-tight">
                💡 Title Suggestions
              </h2>
              <p className="text-sm font-semibold text-slate-600 mt-1">
                Platform-optimized, not clickbait-y
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {results.titles && results.titles.map((title, index) => (
                <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 flex justify-between items-center gap-4 hover:bg-white/25 transition-all duration-200">
                  <span className="font-extrabold text-slate-800 text-base">{title}</span>
                  <button
                    onClick={() => copyToClipboard(title, `title-${index}`)}
                    className="flex-shrink-0 flex items-center gap-1 text-xs font-bold text-amalfi bg-white/60 hover:bg-white/80 px-3 py-1.5 rounded-full border border-white/80 shadow-sm active:scale-95 transition-all duration-200"
                  >
                    {copiedKey === `title-${index}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-end mt-4">
            <button
              onClick={handleReset}
              className="w-full sm:w-auto border-2 border-amalfi text-amalfi bg-transparent hover:bg-amalfi/10 px-8 py-3.5 rounded-full font-bold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate Again</span>
            </button>
            <Link
              href="/originality-checker"
              className="w-full sm:w-auto bg-amalfi hover:bg-[#1e4484] text-white px-8 py-4 rounded-full font-bold shadow-md hover:shadow-lg transition-all duration-300 text-center flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>Check Originality</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      )}
    </main>
  );
}

export default function StartingPoint() {
  return (
    <Suspense fallback={
      <main className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-amalfi animate-spin" />
        <p className="text-slate-600 font-semibold">Loading Starting Point Generator...</p>
      </main>
    }>
      <StartingPointContent />
    </Suspense>
  );
}

