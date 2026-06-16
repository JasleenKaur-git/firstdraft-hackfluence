"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import exifr from "exifr";
import { 
  Shield, 
  Search, 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  RotateCcw, 
  ChevronRight, 
  Lightbulb, 
  Rocket, 
  FileText, 
  Info 
} from "lucide-react";

export default function SafetyScanner() {
  // States
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);
  
  // Custom states
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState(null);

  // Clean up object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Image upload/drag-and-drop processing
  const handleImageProcess = async (file) => {
    setError(null);
    setImageFile(file);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(URL.createObjectURL(file));

    try {
      const parsed = await exifr.parse(file, {
        gps: true,
        tiff: true,
        exif: true
      });
      setMetadata(parsed || {});
    } catch (err) {
      console.error("EXIF parsing error:", err);
      setMetadata({});
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleImageProcess(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      await handleImageProcess(file);
    } else {
      setError("Please drop a valid image file.");
    }
  };

  // Run the safety scan
  const handleScan = async () => {
    if (!imageFile && !caption.trim()) {
      setError("Please upload a thumbnail image or paste a caption to perform a privacy scan.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append("image", imageFile);
      }
      if (caption.trim()) {
        formData.append("caption", caption.trim());
      }
      if (metadata) {
        formData.append("metadata", JSON.stringify(metadata));
      }

      const response = await fetch("/api/safety-scanner", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Scan failed. Please try again.");
      }

      setResults(data);
    } catch (err) {
      console.error("Scan error:", err);
      setError(err.message || "Scan failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset entire form
  const handleReset = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setCaption("");
    setMetadata(null);
    setResults(null);
    setShowCongrats(false);
    setError(null);
    setIsLoading(false);
  };

  // Helper to format metadata key-values into lists
  const getMetadataFieldsList = () => {
    if (!metadata || Object.keys(metadata).length === 0) return [];
    const fields = [];

    if (metadata.Make) fields.push(`Make: ${metadata.Make}`);
    if (metadata.Model) fields.push(`Model: ${metadata.Model}`);
    if (metadata.Software) fields.push(`Software: ${metadata.Software}`);
    
    if (metadata.DateTimeOriginal || metadata.CreateDate) {
      const dateVal = metadata.DateTimeOriginal || metadata.CreateDate;
      const formattedDate = dateVal instanceof Date ? dateVal.toLocaleDateString() : String(dateVal);
      fields.push(`Date: ${formattedDate}`);
    }

    if (metadata.latitude !== undefined && metadata.longitude !== undefined) {
      fields.push(`GPS: ${metadata.latitude.toFixed(4)}, ${metadata.longitude.toFixed(4)}`);
    } else if (metadata.GPSLatitude) {
      fields.push(`GPS Lat: ${metadata.GPSLatitude}`);
    }

    if (metadata.LensModel) fields.push(`Lens: ${metadata.LensModel}`);
    if (metadata.ISO) fields.push(`ISO: ${metadata.ISO}`);
    if (metadata.FNumber) fields.push(`Aperture: f/${metadata.FNumber}`);
    if (metadata.ExposureTime) fields.push(`Exposure: ${metadata.ExposureTime}s`);

    // Fallback if no main fields found
    if (fields.length === 0) {
      let count = 0;
      for (const [key, val] of Object.entries(metadata)) {
        if (key !== "thumbnail" && (typeof val === "string" || typeof val === "number" || typeof val === "boolean")) {
          fields.push(`${key}: ${val}`);
          count++;
          if (count >= 6) break;
        }
      }
    }

    return fields;
  };

  const metadataFields = getMetadataFieldsList();
  
  // Normalize risk score colors and badges
  const getRiskBadge = (level) => {
    const l = (level || "low").toLowerCase();
    if (l.includes("high")) {
      return (
        <div className="bg-red-100 text-red-700 rounded-full px-6 py-3 text-xl font-bold flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-red-700" />
          <span>High Risk</span>
        </div>
      );
    }
    if (l.includes("medium")) {
      return (
        <div className="bg-citrus/20 text-citrus rounded-full px-6 py-3 text-xl font-bold flex items-center gap-2">
          <Info className="w-6 h-6 text-citrus" />
          <span>Medium Risk</span>
        </div>
      );
    }
    return (
      <div className="bg-green-100 text-green-700 rounded-full px-6 py-3 text-xl font-bold flex items-center gap-2">
        <CheckCircle className="w-6 h-6 text-green-700" />
        <span>Low Risk</span>
      </div>
    );
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 sm:py-20 flex flex-col gap-10">
      
      {/* Heading Block */}
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-amalfi tracking-tight mb-4 flex items-center justify-center gap-3 font-sans">
          <Shield className="w-10 h-10 text-amalfi" />
          {"Pre-Publish Safety Scanner"}
        </h1>
        <p className="text-lg font-medium text-slate-700 max-w-2xl mx-auto leading-relaxed">
          {"Upload your thumbnail and paste your caption. We'll flag anything that could expose your identity or location before you hit publish."}
        </p>
      </div>

      {/* Flow Breadcrumbs (Pill-shaped steps, purely visual, small font) */}
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
        <div className="flex items-center gap-1.5 opacity-60">
          <Search className="w-3.5 h-3.5" />
          <span>Check</span>
        </div>
        <ChevronRight className="w-3 h-3 opacity-40" />
        <div className="flex items-center gap-1.5 text-amalfi font-bold bg-white/60 border border-white/80 px-3 py-1 rounded-full">
          <Shield className="w-3.5 h-3.5 text-amalfi" />
          <span>Scan</span>
        </div>
      </div>

      {/* Main Form Input Cards (Side-by-side on desktop, stacked on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start w-full">
        
        {/* LEFT CARD: Image Upload */}
        <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-md p-6 flex flex-col gap-5 h-full">
          <h2 className="text-xl font-bold text-amalfi flex items-center gap-2">
            {"Upload Thumbnail"}
          </h2>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
              isDragOver 
                ? "border-amalfi bg-white/40 scale-[1.01]" 
                : "border-amalfi/40 hover:border-amalfi/60 hover:bg-white/20"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              disabled={isLoading}
            />
            <Upload className="w-8 h-8 text-amalfi mb-3" />
            <span className="text-sm font-bold text-slate-800">
              {"Click to upload or drag and drop"}
            </span>
            <span className="text-xs text-slate-600/80 mt-1">
              {"JPG, PNG, WEBP supported"}
            </span>
          </div>

          {/* Image Preview & Metadata */}
          {imagePreview && (
            <div className="flex flex-col gap-4 mt-2">
              <div className="relative rounded-xl overflow-hidden max-h-[200px] border border-white/40 shadow-sm bg-white/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover max-h-[200px]"
                />
              </div>

              {/* Metadata Detected Area */}
              <div className="bg-white/35 backdrop-blur-sm border border-white/30 rounded-xl p-4 flex flex-col gap-3">
                <h3 className="text-sm font-bold text-amalfi flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amalfi" />
                  {"Metadata Detected"}
                </h3>
                
                {metadataFields.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {metadataFields.map((field, idx) => (
                      <span
                        key={idx}
                        className="bg-citrus/20 text-citrus rounded-full px-3 py-1 text-xs font-semibold"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs font-medium text-slate-500 italic">
                    {"No metadata detected"}
                  </p>
                )}
              </div>

              {/* Green confirmation badge */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-bold w-fit shadow-sm animate-fade-in">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>{"Metadata flagged and noted"}</span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT CARD: Caption Input */}
        <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-md p-6 flex flex-col gap-5 h-full">
          <h2 className="text-xl font-bold text-amalfi flex items-center gap-2">
            <FileText className="w-5 h-5 text-amalfi" />
            {"Caption or Post Text"}
          </h2>

          <div className="flex flex-col gap-2">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              disabled={isLoading}
              rows={8}
              placeholder="Paste your YouTube description, Instagram caption, or tweet here..."
              className="w-full bg-white/50 rounded-xl border border-white/40 p-4 text-sm text-slate-800 placeholder-slate-400/90 resize-none focus:outline-none focus:ring-2 focus:ring-amalfi/40 transition-all duration-300 min-h-[160px] disabled:opacity-60"
            />
            <div className="text-right">
              <span className="text-xs text-slate-500 font-semibold">
                {caption.length} {"characters"}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Error Output */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3 shadow-sm text-red-800 max-w-2xl mx-auto w-full">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
          <div className="flex flex-col gap-1">
            <h4 className="font-bold">{"Scan Request Failed"}</h4>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Large CTA Scan Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleScan}
          disabled={isLoading || (!imageFile && !caption.trim())}
          className={`bg-amalfi text-white rounded-full px-10 py-4 text-lg font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${
            isLoading ? "animate-pulse" : ""
          }`}
        >
          {isLoading ? (
            <>
              <Search className="w-5 h-5 animate-spin" />
              <span>{"Scanning..."}</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>{"Scan for Privacy Risks"}</span>
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      {results && (
        <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-md p-8 flex flex-col gap-8 max-w-4xl mx-auto w-full transition-all duration-500 animate-fade-in-up mt-8">
          
          <div className="text-center flex flex-col items-center gap-4">
            <h2 className="text-2xl font-extrabold text-amalfi tracking-tight font-sans">
              {"Your Privacy Risk Score"}
            </h2>
            {getRiskBadge(results.riskLevel)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/30">
            
            {/* Section 1 - What We Found */}
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-bold text-amalfi flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                {"What We Found"}
              </h3>
              
              {results.risksFound && results.risksFound.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {results.risksFound.map((risk, idx) => (
                    <span
                      key={idx}
                      className="bg-citrus/20 text-citrus rounded-full px-4 py-2 text-xs font-semibold shadow-xs"
                    >
                      {risk}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-medium text-slate-500 italic">
                  {"No specific risks detected"}
                </p>
              )}
            </div>

            {/* Section 2 - Recommendations */}
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-bold text-amalfi flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                {"Recommendations"}
              </h3>
              
              {results.recommendations && results.recommendations.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {results.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 font-medium leading-relaxed">
                      <ChevronRight className="w-4 h-4 text-amalfi flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm font-medium text-slate-500 italic">
                  {"No recommendations needed"}
                </p>
              )}
            </div>

          </div>

          {/* Section 3 - Metadata Status */}
          <div className="bg-white/20 border border-white/30 rounded-xl p-4 mt-2">
            <h3 className="text-sm font-bold text-slate-800 mb-2">{"Metadata Status"}</h3>
            {imageFile ? (
              <div className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>
                  {"All metadata has been read and flagged. Remove EXIF data before uploading to social platforms."}
                </span>
              </div>
            ) : (
              <p className="text-sm font-medium text-slate-500 italic">
                {"No image uploaded"}
              </p>
            )}
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
            
            <button
              onClick={handleReset}
              className="w-full sm:w-auto border-2 border-amalfi text-amalfi hover:bg-amalfi/10 px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all duration-300 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{"Scan Again"}</span>
            </button>

            <button
              onClick={() => setShowCongrats(true)}
              className="w-full sm:w-auto bg-amalfi hover:bg-[#1e4484] text-white px-8 py-3.5 rounded-full font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{"I'm Ready to Publish"}</span>
            </button>

          </div>

        </div>
      )}

      {/* Congratulations Modal */}
      {showCongrats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white/30 backdrop-blur-md border border-amalfi rounded-2xl p-8 max-w-md w-full text-center relative shadow-xl flex flex-col items-center gap-5 transition-transform duration-300 scale-100">
            
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center shadow-inner">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-extrabold text-amalfi tracking-tight">
                {"You're all set! Go make your mark."}
              </h3>
              <p className="text-slate-700 text-sm font-medium leading-relaxed">
                {"FirstDraft has helped you create with confidence."}
              </p>
            </div>

            <button
              onClick={() => setShowCongrats(false)}
              className="mt-2 bg-amalfi text-white rounded-full px-8 py-2.5 font-bold hover:opacity-90 shadow-sm active:scale-95 transition-all duration-200"
            >
              {"Close"}
            </button>

          </div>
        </div>
      )}

    </main>
  );
}
