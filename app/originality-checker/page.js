import Link from "next/link";
import { Search } from "lucide-react";

export default function OriginalityChecker() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20 sm:py-32 flex flex-col items-center justify-center">
      <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-3xl p-8 sm:p-12 shadow-sm text-center max-w-lg w-full transition-all duration-300 hover:border-citrus/40 hover:shadow-md">
        <div className="flex justify-center mb-6">
          <Search className="w-12 h-12 text-amalfi" />
        </div>
        <h1 className="text-3xl font-extrabold text-amalfi tracking-tight mb-3">
          Find Your Unique Angle
        </h1>
        <p className="text-slate-600 font-medium mb-8">
          See how saturated your idea is and find your unique angle.
        </p>
        <div className="mb-8">
          <span className="inline-block text-xs font-extrabold tracking-wider uppercase text-citrus bg-citrus/15 border border-citrus/20 px-4 py-2 rounded-full">
            Coming Soon
          </span>
        </div>
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-sm font-bold text-amalfi hover:underline gap-1.5"
          >
            <span>← Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
