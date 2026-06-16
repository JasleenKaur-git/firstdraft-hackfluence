import { Folder, Lock } from "lucide-react";

export default function About() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 sm:py-24 flex flex-col gap-16">
      {/* Editorial Content */}
      <article className="max-w-2xl mx-auto text-center sm:text-left">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-amalfi tracking-tight mb-8">
          {"Built for the Creators Who Haven't Started Yet"}
        </h1>
        <div className="h-1 w-16 bg-citrus mb-8 sm:mx-0 mx-auto rounded-full"></div>
        <p className="text-slate-800 text-base sm:text-lg leading-relaxed sm:leading-loose text-justify font-medium mb-8">
          {"Millions dream of becoming creators, yet many never publish their first piece of content. Not because they lack ideas, but because starting feels overwhelming. As students who experienced this firsthand, we built FirstDraft to help aspiring creators move from overthinking to uploading."}
        </p>
        <blockquote className="border-l-4 border-citrus pl-4 py-2 my-6 italic text-amalfi font-semibold text-lg sm:text-xl">
          {"\"Because the world doesn't just need more content. It needs the stories that almost never got shared.\""}
        </blockquote>
      </article>

      {/* Beyond FirstDraft Section */}
      <section className="max-w-4xl mx-auto w-full mt-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-amalfi tracking-tight">
            Beyond FirstDraft
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
            Features currently in our product pipeline
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Card 1 */}
          <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-sm min-h-[180px] flex flex-col justify-between hover:border-citrus/40 transition-all duration-300">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-citrus bg-citrus/15 border border-citrus/20 px-2.5 py-1 rounded-full w-max">
                  Coming Soon
                </span>
                <Folder className="w-5 h-5 text-amalfi" />
              </div>
              <h3 className="text-lg font-bold text-amalfi mt-2">Creator History</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Save and revisit your past ideas, briefs, and originality reports.
              </p>
            </div>
            <div className="h-1.5 w-12 bg-white/50 rounded-full mt-4"></div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-sm min-h-[180px] flex flex-col justify-between hover:border-citrus/40 transition-all duration-300">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-citrus bg-citrus/15 border border-citrus/20 px-2.5 py-1 rounded-full w-max">
                  Coming Soon
                </span>
                <Lock className="w-5 h-5 text-amalfi" />
              </div>
              <h3 className="text-lg font-bold text-amalfi mt-2">Visual Privacy Scanner</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Upload images and detect identity leaks before you post.
              </p>
            </div>
            <div className="h-1.5 w-12 bg-white/50 rounded-full mt-4"></div>
          </div>
        </div>
      </section>
    </main>
  );
}
