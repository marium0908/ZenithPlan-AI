import { Destination, ItineraryPlan, UserProfile } from "../types";
import { initialDestinations } from "../data";

// Helper keys for localstorage
const USER_KEY = "zenithplan_user";
const DEST_KEY = "zenithplan_destinations";
const PLANS_KEY = "zenithplan_plans";

export function getSavedUser(): UserProfile | null {
  const data = localStorage.getItem(USER_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return null;
}

export function saveUser(user: UserProfile | null) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function getDestinations(): Destination[] {
  const data = localStorage.getItem(DEST_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return initialDestinations;
    }
  }
  return initialDestinations;
}

export function saveDestinations(dests: Destination[]) {
  localStorage.setItem(DEST_KEY, JSON.stringify(dests));
}

export function getItineraries(): ItineraryPlan[] {
  const data = localStorage.getItem(PLANS_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
  return [];
}

export function saveItinerary(plan: ItineraryPlan) {
  const plans = getItineraries();
  plans.unshift(plan);
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
}

export function deleteItinerary(id: string) {
  const plans = getItineraries();
  const filtered = plans.filter(p => p.id !== id);
  localStorage.setItem(PLANS_KEY, JSON.stringify(filtered));
}
