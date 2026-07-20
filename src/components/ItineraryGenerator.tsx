import React, { useState } from "react";
import { Sparkles, Compass, Leaf, Calendar, RefreshCw, Send, FileDown, CheckCircle, ArrowRight } from "lucide-react";
import { getChatResponse } from "../lib/gemini";
import ReactMarkdown from "react-markdown";

interface ItineraryGeneratorProps {
  defaultDestination?: string;
  defaultDuration?: number;
  userLoggedIn: boolean;
  onOpenAuth: () => void;
  onSavePlan?: (plan: { title: string; destination: string; days: number; travelStyle: string; budget: number; content: string }) => void;
}

export function ItineraryGenerator({ defaultDestination = "", defaultDuration = 3, userLoggedIn, onOpenAuth, onSavePlan }: ItineraryGeneratorProps) {
  const [destination, setDestination] = useState(defaultDestination);
  const [duration, setDuration] = useState(defaultDuration);
  const [style, setStyle] = useState("Eco-Tourism");
  const [carbonLevel, setCarbonLevel] = useState("Zero Carbon (Passive Living)");
  const [extraWishes, setExtraWishes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [itineraryResult, setItineraryResult] = useState<string>("");
  const [isSaved, setIsSaved] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    setIsLoading(true);
    setIsSaved(false);
    
    // Construct a rich, structured prompt template for the travel agent
    const systemPrompt = `You are a high-level Green Travel Agent and Sustainable Itinerary Expert.
Your task is to generate a comprehensive, visually clear, and deeply realistic day-by-day travel plan.
Strictly adhere to the user's choices:
- Destination: ${destination}
- Duration: ${duration} Days
- Travel Vibe: ${style}
- Carbon Footprint Goal: ${carbonLevel}
${extraWishes ? `- Special Requests: ${extraWishes}` : ""}

Structure your markdown output as follows:
# 🗺️ Sustainable Itinerary: ${destination} (${duration} Days)
## Vibe: ${style} • Footprint Goal: ${carbonLevel}

### 💡 Core Green Concept
(Give a 2-sentence summary of the ecological focus of this trip)

### 🗓️ Day-by-Day Schedule
(For each day, provide 3 key landmarks/activities, sustainable transport tips, and eco-certified organic food spots)

### 🏨 Recommended Green Lodging
(Include one specific eco-hotel, treehouse, or solar dome suited for this budget)

### 🌿 Direct Positive Impact Tips
- (Provide 3 concrete tips on how this trip directly supports the local indigenous community or helps restore biodiversity)
`;

    try {
      const promptMessage = [
        { role: "user" as const, content: systemPrompt }
      ];
      
      const aiResponse = await getChatResponse(promptMessage, "ZenithPlan Travel Buddy");
      setItineraryResult(aiResponse || "Sorry, we could not generate the plan. Please check your Gemini connection.");
    } catch (err: any) {
      console.error(err);
      setItineraryResult(`Error generating itinerary: ${err.message || "Unknown error"}. Check if your GEMINI_API_KEY is active in Settings.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!userLoggedIn) {
      onOpenAuth();
      return;
    }
    if (onSavePlan && itineraryResult) {
      onSavePlan({
        title: `Sustainable Trip to ${destination}`,
        destination,
        days: duration,
        travelStyle: style,
        budget: duration * 180, // estimated budget formula
        content: itineraryResult
      });
      setIsSaved(true);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([itineraryResult], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ZenithPlan_${destination.replace(/\s+/g, "_")}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 fill-emerald-500" />
          <span>Sustainable Planner</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          AI Instant Sustainable Itinerary Creator
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
          Input your travel aspirations. Our green planning agent reasons through transport grids, local bio-reserves, and heritage communities to formulate a pristine, zero-waste adventure plan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Planner Inputs Form */}
        <form onSubmit={handleGenerate} className="lg:col-span-5 space-y-5 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 h-fit">
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
              Where would you love to travel?
            </label>
            <div className="relative">
              <Compass className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="e.g. Costa Rica, Patagonia, Kyoto..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl py-3.5 pl-10 pr-4 text-sm font-semibold shadow-sm text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                Trip Duration (Days)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl p-3.5 text-sm font-semibold shadow-sm text-slate-800"
              >
                <option value={1}>1 Day Guide</option>
                <option value={3}>3 Days Exploration</option>
                <option value={5}>5 Days Premium Plan</option>
                <option value={7}>7 Days Eco-Immersion</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                Vibe / Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl p-3.5 text-sm font-semibold shadow-sm text-slate-800"
              >
                <option value="Eco-Tourism">Eco-Tourism</option>
                <option value="Adventure">Adventure</option>
                <option value="Cultural">Cultural</option>
                <option value="Luxury Wellness">Luxury Wellness</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
              Carbon footprint target
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Zero Carbon (Passive Living)",
                "Low Footprint (Public / Electric Transit)"
              ].map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setCarbonLevel(lvl)}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                    carbonLevel === lvl
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300 text-slate-600"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
              Custom Agent Directives (Optional)
            </label>
            <textarea
              placeholder="e.g. Traveling with kids, gluten-free dining places, interested in local organic vineyards..."
              rows={3}
              value={extraWishes}
              onChange={(e) => setExtraWishes(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl p-3 text-sm font-semibold text-slate-800 shadow-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Formulating Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 fill-white" />
                <span>Generate Smart Itinerary</span>
              </>
            )}
          </button>
        </form>

        {/* Results Block */}
        <div className="lg:col-span-7 flex flex-col min-h-[450px]">
          {itineraryResult ? (
            <div className="flex-1 border border-slate-100 rounded-2xl flex flex-col overflow-hidden shadow-sm bg-slate-50/20">
              {/* Output Actions Header */}
              <div className="bg-slate-50 border-b border-slate-100 px-5 py-3 flex items-center justify-between">
                <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
                  Generated Itinerary Plan
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownload}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Download MD</span>
                  </button>
                  {onSavePlan && (
                    <button
                      onClick={handleSave}
                      disabled={isSaved}
                      className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                        isSaved
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-not-allowed"
                          : "bg-emerald-600 text-white hover:bg-emerald-700 border border-transparent shadow-sm"
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{isSaved ? "Saved to Profile" : "Save Itinerary"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Output markdown body */}
              <div className="p-6 md:p-8 flex-1 prose prose-emerald prose-sm max-w-none overflow-y-auto max-h-[480px] bg-white">
                <ReactMarkdown>{itineraryResult}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="flex-1 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-slate-50/20">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Your Sustainable Plan Awaits</h3>
              <p className="text-slate-400 text-sm max-w-sm mt-1">
                Configure your criteria on the left and tap the generate button. Our AI Agent will map a comprehensive travel strategy instantly.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {["Kyoto", "Patagonia", "Costa Rica", "Bali"].map((spot) => (
                  <button
                    key={spot}
                    onClick={() => setDestination(spot)}
                    className="px-3 py-1 rounded-full border border-slate-200 hover:border-emerald-300 text-xs font-bold text-slate-600 hover:text-emerald-600 bg-white transition-colors"
                  >
                    Preset: {spot}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
