export interface Destination {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  category: "Adventure" | "Eco-Tourism" | "Cultural" | "Luxury Wellness";
  budget: number; // in USD
  rating: number; // 1-5
  location: string;
  images: string[];
  duration: number; // days
  specifications: {
    bestTime: string;
    difficulty: string;
    carbonFootprint: string; // kg CO2e
    accommodation: string;
  };
  reviews: {
    id: string;
    user: string;
    avatar: string;
    rating: number;
    text: string;
    date: string;
  }[];
}

export interface ItineraryPlan {
  id: string;
  title: string;
  destination: string;
  days: number;
  travelStyle: string;
  budget: number;
  content: string;
  createdAt: string;
}

export interface UserProfile {
  email: string;
  name: string;
  role: string;
  likes: string[]; // destination IDs
  savedItineraries: string[];
}
