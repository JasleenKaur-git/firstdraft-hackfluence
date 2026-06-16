"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Lightbulb, 
  Rocket, 
  Search, 
  ShieldCheck, 
  PenLine, 
  ScanSearch, 
  BadgeCheck 
} from "lucide-react";

export default function Home() {
  const fullHeadline = "From First Draft to First Audience";
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullHeadline.slice(0, index + 1));
      index++;
      if (index >= fullHeadline.length) {
        clearInterval(interval);
      }
    }, 70); // Smooth typewriter speed
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      Icon: Lightbulb,
      name: "Capture Your Spark",
      desc: "Dump your raw idea. We'll shape it into a content brief.",
      link: "/idea-capture",
    },
    {
      Icon: Rocket,
      name: "Find Your Starting Point",
      desc: "Stuck on where to begin? Get your hook, first line, and outline.",
      link: "/starting-point",
    },
    {
      Icon: Search,
      name: "Find Your Unique Angle",
      desc: "See how saturated your idea is and find your unique angle.",
      link: "/originality-checker",
    },
    {
      Icon: ShieldCheck,
      name: "Publish with Confidence",
      desc: "Scan your content for identity leaks before you post.",
      link: "/safety-scanner",
    },
  ];

  return (
    <main className="max-w-6xl mx-auto px-6 py-16 sm:py-24 flex flex-col gap-24 overflow-x-hidden">
      {/* Section 1 - Hero */}
      <section className="flex flex-col items-center text-center gap-6 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-amalfi tracking-tight min-h-[3rem] sm:min-h-[4rem] flex justify-center items-center">
          <span>{typedText}</span>
          <span className="inline-block w-[4px] h-[0.9em] bg-amalfi ml-1.5 align-middle cursor-blink" aria-hidden="true"></span>
        </h1>
        <p className="text-lg sm:text-2xl font-medium text-slate-600/90 leading-relaxed mt-2">
          Stop overthinking. Start creating.
        </p>
        <div className="mt-6">
          <button
            onClick={() => {
              const el = document.getElementById("how-it-works");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-amalfi hover:bg-[#1e4484] text-white text-base sm:text-lg font-bold px-8 py-3.5 sm:px-10 sm:py-4 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Try FirstDraft
          </button>
        </div>
      </section>

      {/* Section 2 - How It Works */}
      <section id="how-it-works" className="flex flex-col gap-12 scroll-mt-24">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-amalfi tracking-tight">
            How It Works
          </h2>
          <div className="h-1 w-12 bg-citrus mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">
          {/* Step 1 */}
          <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-8 shadow-sm flex flex-col items-center text-center gap-4 transition-all duration-300 hover:shadow-md hover:border-citrus/40">
            <div className="flex justify-between items-center w-full">
              <span className="text-xs font-extrabold tracking-wider uppercase text-citrus bg-citrus/15 border border-citrus/20 px-3 py-1 rounded-full">
                Step 1
              </span>
              <PenLine className="w-8 h-8 text-amalfi" />
            </div>
            <h3 className="text-xl font-bold text-amalfi mt-2">Drop your idea</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Raw thought, voice note, or rough concept
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-8 shadow-sm flex flex-col items-center text-center gap-4 transition-all duration-300 hover:shadow-md hover:border-citrus/40">
            <div className="flex justify-between items-center w-full">
              <span className="text-xs font-extrabold tracking-wider uppercase text-citrus bg-citrus/15 border border-citrus/20 px-3 py-1 rounded-full">
                Step 2
              </span>
              <ScanSearch className="w-8 h-8 text-amalfi" />
            </div>
            <h3 className="text-xl font-bold text-amalfi mt-2">Refine and validate</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Check originality, find your angle
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-8 shadow-sm flex flex-col items-center text-center gap-4 transition-all duration-300 hover:shadow-md hover:border-citrus/40">
            <div className="flex justify-between items-center w-full">
              <span className="text-xs font-extrabold tracking-wider uppercase text-citrus bg-citrus/15 border border-citrus/20 px-3 py-1 rounded-full">
                Step 3
              </span>
              <BadgeCheck className="w-8 h-8 text-amalfi" />
            </div>
            <h3 className="text-xl font-bold text-amalfi mt-2">Create with confidence</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Know exactly where to start
            </p>
          </div>
        </div>
      </section>

      {/* Section 3 - Features */}
      <section id="features" className="flex flex-col gap-12 scroll-mt-24">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-amalfi tracking-tight">
            Your creative journey, step by step
          </h2>
          <div className="h-1 w-12 bg-citrus mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
          {features.map((feat, idx) => {
            const FeatIcon = feat.Icon;
            return (
              <Link
                key={idx}
                href={feat.link}
                className="group block bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-8 shadow-sm transition-all duration-300 hover:border-citrus hover:shadow-[0_0_25px_rgba(255,166,43,0.25)] hover:-translate-y-1 hover:bg-white/50"
              >
                <div className="mb-4 inline-block">
                  <FeatIcon className="w-8 h-8 text-amalfi group-hover:text-citrus transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-amalfi mb-2 transition-colors">
                  {feat.name}
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed mb-4">
                  {feat.desc}
                </p>
                <div className="inline-flex items-center text-sm font-bold text-amalfi group-hover:text-citrus transition-colors gap-1">
                  <span>Start</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Section 4 - Why FirstDraft? (Full-width Warm Section) */}
      <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white/10 backdrop-blur-sm border-y border-white/30 py-16 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-amalfi leading-normal tracking-tight max-w-3xl italic">
            {"\"The world doesn't just need more content. It needs the stories that almost never got shared.\""}
          </h2>
          <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-16 mt-2">
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-citrus">50M+</span>
              <span className="text-sm font-semibold text-slate-700 mt-1">aspiring creators in India alone</span>
            </div>
            <div className="h-8 w-px bg-amalfi/20 hidden sm:block"></div>
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-citrus">Most</span>
              <span className="text-sm font-semibold text-slate-700 mt-1">quit before their first post</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 - Flow Indicator */}
      <section className="flex flex-col items-center gap-6">
        <div className="w-full max-w-4xl bg-white/25 backdrop-blur-sm border border-white/40 rounded-3xl p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {/* Step 1 */}
            <div className="bg-white/50 px-5 py-2.5 rounded-full border border-citrus shadow-[0_0_12px_rgba(255,166,43,0.12)] flex items-center gap-2 text-sm font-bold text-slate-800">
              <Lightbulb className="w-4 h-4 text-amalfi" /> Capture
            </div>
            {/* Arrow */}
            <svg
              className="w-5 h-5 text-citrus animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>

            {/* Step 2 */}
            <div className="bg-white/50 px-5 py-2.5 rounded-full border border-citrus shadow-[0_0_12px_rgba(255,166,43,0.12)] flex items-center gap-2 text-sm font-bold text-slate-800">
              <Rocket className="w-4 h-4 text-amalfi" /> Start
            </div>
            {/* Arrow */}
            <svg
              className="w-5 h-5 text-citrus animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>

            {/* Step 3 */}
            <div className="bg-white/50 px-5 py-2.5 rounded-full border border-citrus shadow-[0_0_12px_rgba(255,166,43,0.12)] flex items-center gap-2 text-sm font-bold text-slate-800">
              <Search className="w-4 h-4 text-amalfi" /> Check
            </div>
            {/* Arrow */}
            <svg
              className="w-5 h-5 text-citrus animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>

            {/* Step 4 */}
            <div className="bg-white/50 px-5 py-2.5 rounded-full border border-citrus shadow-[0_0_12px_rgba(255,166,43,0.12)] flex items-center gap-2 text-sm font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-amalfi" /> Scan
            </div>
          </div>
          <div className="text-center mt-5">
            <p className="text-xs sm:text-sm font-medium text-slate-600/90">
              Follow the flow or jump to any step directly
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
