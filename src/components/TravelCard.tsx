import React from "react";
import { Destination } from "../types";
import { Star, MapPin, Calendar, FlameKindling, Leaf } from "lucide-react";

interface TravelCardProps {
  destination: Destination;
  onViewDetails: (id: string) => void;
  onLike?: (id: string) => void;
  isLiked?: boolean;
}

export function TravelCard({ destination, onViewDetails, onLike, isLiked }: TravelCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden h-full group">
      {/* Photo header */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img 
          src={destination.images[0]} 
          alt={destination.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-700 shadow-sm uppercase tracking-wide flex items-center gap-1">
          <Leaf className="w-3.5 h-3.5" />
          {destination.category}
        </div>
        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-sm flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          {destination.rating.toFixed(1)}
        </div>
      </div>

      {/* Card Info Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-xs text-slate-400 font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{destination.location}</span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
            {destination.title}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {destination.shortDescription}
          </p>
        </div>

        {/* Price & Meta info */}
        <div className="pt-4 mt-4 border-t border-slate-50 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-slate-500 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              <span>{destination.duration} Days Plan</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 font-bold uppercase tracking-wider text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
              <span>CO2: {destination.specifications.carbonFootprint} kg</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Estimated Budget</span>
              <span className="text-xl font-extrabold text-slate-900">${destination.budget.toLocaleString()}</span>
            </div>
            <div className="flex gap-2">
              {onLike && (
                <button
                  onClick={() => onLike(destination.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    isLiked 
                      ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100" 
                      : "bg-slate-50 border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50"
                  }`}
                  title="Save Spot"
                >
                  <Star className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                </button>
              )}
              <button
                onClick={() => onViewDetails(destination.id)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-emerald-50 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse h-[380px] flex flex-col overflow-hidden">
      <div className="bg-slate-200 h-48 w-full" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="h-6 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded w-12" />
            <div className="h-5 bg-slate-200 rounded w-20" />
          </div>
          <div className="h-9 bg-slate-200 rounded w-28" />
        </div>
      </div>
    </div>
  );
}
