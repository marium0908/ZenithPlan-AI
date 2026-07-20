import React, { useState, useEffect } from "react";
import { Destination, UserProfile } from "../types";
import { Sparkles, Heart, RefreshCw, Compass, ArrowRight, Lightbulb, MapPin, Star } from "lucide-react";
import { motion } from "motion/react";

interface RecommendationEngineProps {
  destinations: Destination[];
  user: UserProfile | null;
  onViewDetails: (id: string) => void;
  onLike: (id: string) => void;
}

export function RecommendationEngine({ destinations, user, onViewDetails, onLike }: RecommendationEngineProps) {
  const [selectedStyle, setSelectedStyle] = useState<string>("All");
  const [recommendations, setRecommendations] = useState<{ spot: Destination; score: number; reason: string }[]>([]);
  const [isComputing, setIsComputing] = useState(false);

  // Re-run recommendation scoring when liked items or chosen style changes
  useEffect(() => {
    setIsComputing(true);
    const timer = setTimeout(() => {
      computeRecommendations();
      setIsComputing(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [user?.likes, selectedStyle, destinations]);

  const computeRecommendations = () => {
    // 1. Calculate user's category preferences from their likes
    const likedDests = destinations.filter(d => user?.likes?.includes(d.id));
    const prefCategories: { [key: string]: number } = {};
    
    likedDests.forEach(d => {
      prefCategories[d.category] = (prefCategories[d.category] || 0) + 1;
    });

    const totalLikes = likedDests.length;

    // 2. Score all spots
    const scored = destinations.map(dest => {
      let score = 50; // baseline
      let reason = "This popular sustainable destination matches our standard carbon-neutral guidelines.";

      // Check category compatibility
      if (totalLikes > 0 && prefCategories[dest.category]) {
        const percentage = prefCategories[dest.category] / totalLikes;
        score += Math.round(percentage * 40);
        reason = `Matches your growing interest in ${dest.category} places based on your saves.`;
      }

      // Check travel style filtering
      if (selectedStyle !== "All" && dest.category === selectedStyle) {
        score += 30;
      }

      // Boost premium rating
      score += Math.round((dest.rating - 4.5) * 20);

      // Boost lower footprint spots (under 80kg CO2)
      if (parseInt(dest.specifications.carbonFootprint) < 80) {
        score += 15;
        reason = `Top pick due to an ultra-low carbon rating of ${dest.specifications.carbonFootprint} kg CO2e and high rating!`;
      }

      // If user liked this specific spot, give it a special badge or rank it down to promote new ideas
      if (user?.likes?.includes(dest.id)) {
        score -= 20; // prioritize unliked spots in recommendation feed
      }

      return {
        spot: dest,
        score,
        reason
      };
    });

    // Sort by recommendation score descending
    const sorted = scored.sort((a, b) => b.score - a.score);
    setRecommendations(sorted.slice(0, 4));
  };

  return (
    <div className="bg-slate-50 rounded-3xl border border-slate-100 p-6 md:p-8 space-y-8">
      {/* Engine Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-sm uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-500 fill-emerald-500" />
            <span>Smart Engine Activated</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            AI Personalized Recommendations
          </h2>
          <p className="text-sm text-slate-500">
            {user?.likes?.length && user.likes.length > 0 
              ? `Learning from your ${user.likes.length} saved destinations. Likes dynamically shape this feed.`
              : "Save/like a few spots in the listings to train your AI recommendations agent!"
            }
          </p>
        </div>

        {/* Style selection pill filter */}
        <div className="flex flex-wrap gap-2">
          {["All", "Eco-Tourism", "Cultural", "Adventure", "Luxury Wellness"].map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedStyle === style
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-100"
                  : "bg-white border border-slate-100 text-slate-600 hover:border-slate-300"
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Grid container with motion animation */}
      {isComputing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[320px] bg-slate-200/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map(({ spot, score, reason }, i) => {
            const isLiked = user?.likes?.includes(spot.id);
            return (
              <motion.div
                key={spot.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-emerald-100/50 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative group"
              >
                {/* Score badge */}
                <div className="absolute top-3 left-3 z-10 bg-emerald-600 text-white font-black text-[10px] px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-white" />
                  <span>{score}% Match</span>
                </div>

                {/* Cover Image */}
                <div className="relative h-32 bg-slate-100 overflow-hidden">
                  <img
                    src={spot.images[0]}
                    alt={spot.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Body Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <MapPin className="w-3 h-3" />
                      <span>{spot.location}</span>
                    </div>
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-600 line-clamp-1">
                      {spot.title}
                    </h3>
                  </div>

                  {/* Insight Prompt Reasoning */}
                  <div className="bg-emerald-50/50 border border-emerald-100/30 p-2.5 rounded-lg flex items-start gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] font-medium text-emerald-800 leading-tight">
                      {reason}
                    </p>
                  </div>

                  {/* Actions footer */}
                  <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <span className="block text-[8px] uppercase font-bold text-slate-400 tracking-wider">Est. Budget</span>
                      <span className="text-sm font-extrabold text-slate-900">${spot.budget}</span>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => onLike(spot.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isLiked
                            ? "bg-red-50 border-red-100 text-red-500"
                            : "bg-slate-50 border-slate-100 text-slate-400 hover:text-red-500"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                      </button>
                      <button
                        onClick={() => onViewDetails(spot.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
