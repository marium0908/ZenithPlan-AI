import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { TravelCard, SkeletonCard } from "./components/TravelCard";
import { RecommendationEngine } from "./components/RecommendationEngine";
import { ItineraryGenerator } from "./components/ItineraryGenerator";
import { DataAnalyzer } from "./components/DataAnalyzer";
import { AITravelBuddy } from "./components/AITravelBuddy";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { Destination, ItineraryPlan, UserProfile } from "./types";
import { getSavedUser, saveUser, getDestinations, saveDestinations, getItineraries, saveItinerary, deleteItinerary } from "./lib/store";
import { getChatResponse } from "./lib/gemini";
import { 
  Compass, MapPin, Star, Calendar, Shield, Leaf, Heart, ArrowRight, Sparkles, 
  Search, SlidersHorizontal, Info, Mail, Phone, Lock, ChevronDown, CheckCircle2, Trash2, Eye, Plus, Send, RefreshCw,
  Bot, BarChart3, X, ChevronLeft, ChevronRight, ChevronsDown, Train, Plane, Car, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80",
    badge: "Solar Eco-Lodges & Reforest Trails",
    title: "Journey with Zero Footprint",
    desc: "Our specialized Travel Agent formulates organic, carbon-neutral itineraries and pairs you with certified green sanctuaries."
  },
  {
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    badge: "Glacier Expeditions & Low-Emission Treks",
    title: "Navigate into the Untamed Wilds",
    desc: "Discover pristine alpine heights governed by strict leave-no-trace principles and carbon-offset certified local guides."
  },
  {
    image: "https://images.unsplash.com/photo-1531266752426-aad472b7bbf4?auto=format&fit=crop&w=1200&q=80",
    badge: "Thermal Wood Springs & Passive Spas",
    title: "Savor Conscious Green Luxury",
    desc: "Calibrate your vibe match with boutique wellness spots using closed-loop geothermal energy and organic farming."
  }
];

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [selectedDestId, setSelectedDestId] = useState<string | null>(null);
  const [manageTab, setManageTab] = useState<"destinations" | "itineraries">("destinations");

  // Hero interactive slider state
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  // Shared Itinerary Builder State
  const [plannerDestination, setPlannerDestination] = useState("");
  const [plannerDuration, setPlannerDuration] = useState(3);

  // Authentication State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string>("home");

  // Content Databases
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [userPlans, setUserPlans] = useState<ItineraryPlan[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedBudgetRange, setSelectedBudgetRange] = useState<string>("All");
  const [selectedRating, setSelectedRating] = useState<string>("All");
  const [selectedDurationRange, setSelectedDurationRange] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("default");
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const itemsPerPage = 4;

  // Contact Page Form
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactAutoReply, setContactAutoReply] = useState("");
  const [isSendingContact, setIsSendingContact] = useState(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Custom Destination Addition Form (/items/add)
  const [addTitle, setAddTitle] = useState("");
  const [addShortDesc, setAddShortDesc] = useState("");
  const [addFullDesc, setAddFullDesc] = useState("");
  const [addCategory, setAddCategory] = useState<Destination["category"]>("Eco-Tourism");
  const [addBudget, setAddBudget] = useState("");
  const [addDuration, setAddDuration] = useState("");
  const [addLocation, setAddLocation] = useState("");
  const [addImageUrl, setAddImageUrl] = useState("");
  const [addDifficulty, setAddDifficulty] = useState("Easy");
  const [addSuccessMessage, setAddSuccessMessage] = useState("");

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Help & Privacy page states
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [helpSearchQuery, setHelpSearchQuery] = useState("");
  const [helpSelectedCategory, setHelpSelectedCategory] = useState("All");
  const [helpExpandedFaq, setHelpExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    if (currentPage === "home") {
      const interval = setInterval(() => {
        setHeroSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [currentPage]);

  // Simple landing page carbon calculator state
  const [calcTravelers, setCalcTravelers] = useState(1);
  const [calcTransport, setCalcTransport] = useState<"flight" | "train" | "electric-car">("flight");
  const [calcDays, setCalcDays] = useState(3);

  // TanStack Query integration for retrieving destinations dynamically
  const { data: queryDestData } = useQuery({
    queryKey: ["destinations"],
    queryFn: async () => {
      const res = await fetch("/api/destinations");
      if (!res.ok) throw new Error("Failed to load destinations");
      return res.json();
    },
    initialData: { destinations: getDestinations() }
  });

  // Keep destinations state synchronized with TanStack Query cache
  useEffect(() => {
    if (queryDestData?.destinations) {
      setDestinations(queryDestData.destinations);
    }
  }, [queryDestData]);

  // Load Initial Store Data and Fetch from Backend
  useEffect(() => {
    async function loadData() {
      setIsDataLoading(true);
      setIsAuthLoading(true);
      const jwtToken = localStorage.getItem("zenithplan_jwt");

      // Fetch user profile if JWT exists
      if (jwtToken) {
        try {
          const userRes = await fetch("/api/auth/me", {
            headers: { "Authorization": `Bearer ${jwtToken}` }
          });
          if (userRes.ok) {
            const userData = await userRes.json();
            setUser(userData.user);
            
            // Load user saved itineraries from backend
            const planRes = await fetch("/api/itineraries", {
              headers: { "Authorization": `Bearer ${jwtToken}` }
            });
            if (planRes.ok) {
              const planData = await planRes.json();
              setUserPlans(planData.itineraries);
            }
          } else {
            // Token expired or invalid
            localStorage.removeItem("zenithplan_jwt");
            setUser(null);
          }
        } catch (err) {
          // Offline fallback
          const savedUser = getSavedUser();
          if (savedUser) setUser(savedUser);
          setUserPlans(getItineraries());
        }
      } else {
        setUser(null);
        setUserPlans([]);
      }
      
      setIsDataLoading(false);
      setIsAuthLoading(false);
    }
    
    loadData();
  }, []);

  // Trigger brief loading screen for dynamic filters to show skeleton loader transitions
  useEffect(() => {
    setIsDataLoading(true);
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedBudgetRange, selectedRating, selectedDurationRange, sortBy, currentPageNum]);

  // Reset page number on filter changes
  useEffect(() => {
    setCurrentPageNum(1);
  }, [searchQuery, selectedCategory, selectedBudgetRange, selectedRating, selectedDurationRange, sortBy]);

  // Simple URL Synchronizer Router for pathnames like /items/add and /login
  useEffect(() => {
    if (isAuthLoading) return; // Wait until initial auth check is finished

    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/items/add") {
        if (!user) {
          setRedirectAfterLogin("add");
          setCurrentPage("login");
          window.history.replaceState({}, "", "/login");
        } else {
          setCurrentPage("add");
        }
      } else if (path === "/login") {
        setCurrentPage("login");
      } else if (path === "/register") {
        setCurrentPage("register");
      } else if (path === "/manage" || path === "/items/manage") {
        if (!user) {
          setRedirectAfterLogin("manage");
          setCurrentPage("login");
          window.history.replaceState({}, "", "/login");
        } else {
          setCurrentPage("manage");
        }
      } else if (path === "/explore") {
        setCurrentPage("explore");
      } else if (path === "/recommend") {
        setCurrentPage("recommend");
      } else if (path === "/about") {
        setCurrentPage("about");
      } else if (path === "/contact") {
        setCurrentPage("contact");
      } else if (path === "/help") {
        setCurrentPage("help");
      } else if (path === "/privacy") {
        setCurrentPage("privacy");
      } else if (path === "/") {
        setCurrentPage("home");
      }
    };

    window.addEventListener("popstate", handlePopState);
    handlePopState(); // Handle on initial load

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isAuthLoading, user]);

  // Save changes helper
  const handleLikeDestination = async (id: string) => {
    if (!user) {
      handleNavigation("login");
      return;
    }

    const jwtToken = localStorage.getItem("zenithplan_jwt");
    if (!jwtToken) {
      // Local fallback for demo mode
      const updatedLikes = user.likes.includes(id)
        ? user.likes.filter(item => item !== id)
        : [...user.likes, id];
      const updatedUser = { ...user, likes: updatedLikes };
      setUser(updatedUser);
      saveUser(updatedUser);
      return;
    }

    try {
      const res = await fetch("/api/destinations/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ destinationId: id })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        saveUser(data.user);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  // Nav Function with custom scroll to top and browser history support
  const handleNavigation = (page: string) => {
    let path = "/";
    if (page === "add") path = "/items/add";
    else if (page === "login") path = "/login";
    else if (page === "register") path = "/register";
    else if (page === "manage") path = "/items/manage";
    else if (page === "explore") path = "/explore";
    else if (page === "recommend") path = "/recommend";
    else if (page === "about") path = "/about";
    else if (page === "contact") path = "/contact";
    else if (page === "help") path = "/help";
    else if (page === "privacy") path = "/privacy";
    else if (page === "home") path = "/";

    if ((page === "add" || page === "manage") && !user) {
      setRedirectAfterLogin(page);
      setCurrentPage("login");
      window.history.pushState({}, "", "/login");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setCurrentPage(page);
    window.history.pushState({}, "", path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // View detail helper
  const handleViewDetails = (id: string) => {
    setSelectedDestId(id);
    handleNavigation("details");
  };

  // Demo user autologin
  const handleDemoLogin = async () => {
    // Try to login or register with default demo credentials on backend so database is synced
    try {
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "eco.traveler@zenithplan.ai", password: "demopassword123" })
      });

      if (loginRes.ok) {
        const loginData = await loginRes.json();
        localStorage.setItem("zenithplan_jwt", loginData.token);
        setUser(loginData.user);
        saveUser(loginData.user);
        
        // Load itineraries
        const planRes = await fetch("/api/itineraries", {
          headers: { "Authorization": `Bearer ${loginData.token}` }
        });
        if (planRes.ok) {
          const planData = await planRes.json();
          setUserPlans(planData.itineraries);
        }
        setShowAuthModal(false);
        setAuthError("");
        return;
      }

      // If login failed, register demo user
      const regRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Alex Green", email: "eco.traveler@zenithplan.ai", password: "demopassword123" })
      });

      if (regRes.ok) {
        const regData = await regRes.json();
        localStorage.setItem("zenithplan_jwt", regData.token);
        setUser(regData.user);
        saveUser(regData.user);
        setUserPlans([]);
        setShowAuthModal(false);
        setAuthError("");
      }
    } catch (err) {
      // Direct local fallback if backend is offline
      const demoUser: UserProfile = {
        email: "eco.traveler@zenithplan.ai",
        name: "Alex Green",
        role: "Premium Explorer",
        likes: ["dest-1", "dest-3"],
        savedItineraries: []
      };
      setUser(demoUser);
      saveUser(demoUser);
      setShowAuthModal(false);
      setAuthError("");
    }
  };

  // Portal Authentication Action
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (!authEmail.includes("@")) {
      setAuthError("Please enter a valid email address.");
      return;
    }
    if (authPassword.length < 5) {
      setAuthError("Password must be at least 5 characters.");
      return;
    }

    if (authMode === "register" && !authName.trim()) {
      setAuthError("Please provide your full name.");
      return;
    }

    const cleanEmail = authEmail.trim().toLowerCase();
    const cleanPassword = authPassword.trim();

    // Instant client-side login bypass for demo user to support Netlify, static hosting, and offline localhost
    if (authMode === "login" && cleanEmail === "eco.traveler@zenithplan.ai" && cleanPassword === "demopassword123") {
      const fallbackUser: UserProfile = {
        email: "eco.traveler@zenithplan.ai",
        name: "Alex Green",
        role: "Premium Explorer",
        likes: ["dest-1", "dest-3"],
        savedItineraries: []
      };
      localStorage.setItem("zenithplan_jwt", "mock-jwt-token-123");
      setUser(fallbackUser);
      saveUser(fallbackUser);
      setUserPlans([]);
      setShowAuthModal(false);
      setAuthEmail("");
      setAuthPassword("");
      setAuthName("");
      return;
    }

    try {
      const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = authMode === "login" 
        ? { email: authEmail, password: authPassword }
        : { name: authName, email: authEmail, password: authPassword };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setAuthError(errData.error || "Authentication failed.");
        return;
      }

      const data = await res.json();
      localStorage.setItem("zenithplan_jwt", data.token);
      setUser(data.user);
      saveUser(data.user);

      // Fetch user plans
      const planRes = await fetch("/api/itineraries", {
        headers: { "Authorization": `Bearer ${data.token}` }
      });
      if (planRes.ok) {
        const planData = await planRes.json();
        setUserPlans(planData.itineraries);
      } else {
        setUserPlans([]);
      }

      setShowAuthModal(false);
      setAuthEmail("");
      setAuthPassword("");
      setAuthName("");
    } catch (err) {
      // Local fallback for static site deployments (e.g. Netlify) and offline testing
      const namePrefix = authEmail.split("@")[0];
      const capitalizedName = namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1);
      const fallbackUser: UserProfile = {
        email: authEmail,
        name: authMode === "login" ? (capitalizedName || "Eco Traveler") : (authName || capitalizedName),
        role: authEmail === "eco.traveler@zenithplan.ai" ? "Premium Explorer" : "Eco Adventurer",
        likes: ["dest-1", "dest-3"],
        savedItineraries: []
      };
      localStorage.setItem("zenithplan_jwt", "mock-jwt-token-123");
      setUser(fallbackUser);
      saveUser(fallbackUser);
      setUserPlans([]);
      setShowAuthModal(false);
      setAuthEmail("");
      setAuthPassword("");
      setAuthName("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("zenithplan_jwt");
    setUser(null);
    saveUser(null);
    setUserPlans([]);
    handleNavigation("home");
  };

  // AI Itinerary Saving Form
  const handleSaveAIPlan = async (plan: { title: string; destination: string; days: number; travelStyle: string; budget: number; content: string }) => {
    const jwtToken = localStorage.getItem("zenithplan_jwt");
    if (!jwtToken) {
      // Local fallback
      const newPlan: ItineraryPlan = {
        id: `plan-${Date.now()}`,
        ...plan,
        createdAt: new Date().toLocaleDateString()
      };
      saveItinerary(newPlan);
      setUserPlans(getItineraries());
      return;
    }

    try {
      const res = await fetch("/api/itineraries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`
        },
        body: JSON.stringify({
          title: plan.title,
          destination: plan.destination,
          days: plan.days,
          travelStyle: plan.travelStyle,
          details: plan.content
        })
      });

      if (res.ok) {
        // Reload plans
        const planRes = await fetch("/api/itineraries", {
          headers: { "Authorization": `Bearer ${jwtToken}` }
        });
        if (planRes.ok) {
          const planData = await planRes.json();
          setUserPlans(planData.itineraries);
        }
      }
    } catch (err) {
      console.error("Error saving itinerary to backend:", err);
    }
  };

  // Add Custom Destination (Protected Page Form)
  const handleAddDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      handleNavigation("login");
      return;
    }

    const budgetNum = parseInt(addBudget);
    const durationNum = parseInt(addDuration);

    if (!addTitle.trim() || !addShortDesc.trim() || !addFullDesc.trim() || !addLocation.trim() || isNaN(budgetNum) || isNaN(durationNum)) {
      setAddSuccessMessage("Please fill in all fields with valid information.");
      return;
    }

    const jwtToken = localStorage.getItem("zenithplan_jwt");
    if (!jwtToken) {
      setAddSuccessMessage("Please authenticate with premium status first.");
      return;
    }

    try {
      const res = await fetch("/api/destinations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`
        },
        body: JSON.stringify({
          title: addTitle,
          shortDescription: addShortDesc,
          description: addFullDesc,
          category: addCategory,
          budget: budgetNum,
          location: addLocation,
          images: addImageUrl.trim() ? [addImageUrl.trim()] : [],
          duration: durationNum,
          specifications: {
            bestTime: "Year-Round Eco Trails",
            difficulty: addDifficulty,
            carbonFootprint: String(Math.round(durationNum * 12)),
            accommodation: "Local Organic Homestay"
          }
        })
      });

      if (res.ok) {
        // Fetch updated destinations list
        const destRes = await fetch("/api/destinations");
        if (destRes.ok) {
          const destData = await destRes.json();
          setDestinations(destData.destinations);
        }
        setAddSuccessMessage("🎉 Eco-Destination successfully audited and added to the ZenithPlan Registry!");
        
        // Clear Form
        setAddTitle("");
        setAddShortDesc("");
        setAddFullDesc("");
        setAddBudget("");
        setAddDuration("");
        setAddLocation("");
        setAddImageUrl("");

        setTimeout(() => {
          setAddSuccessMessage("");
          handleNavigation("explore");
        }, 2000);
      } else {
        const errData = await res.json().catch(() => ({}));
        setAddSuccessMessage(`Error: ${errData.error || "Failed to submit destination"}`);
      }
    } catch (err) {
      setAddSuccessMessage("Connection error. Could not register destination on server.");
    }
  };

  // Delete User Itinerary Plan
  const handleDeletePlan = async (id: string) => {
    const jwtToken = localStorage.getItem("zenithplan_jwt");
    if (!jwtToken) {
      deleteItinerary(id);
      setUserPlans(getItineraries());
      return;
    }

    try {
      const res = await fetch(`/api/itineraries/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${jwtToken}` }
      });
      if (res.ok) {
        // Reload plans
        const planRes = await fetch("/api/itineraries", {
          headers: { "Authorization": `Bearer ${jwtToken}` }
        });
        if (planRes.ok) {
          const planData = await planRes.json();
          setUserPlans(planData.itineraries);
        }
      }
    } catch (err) {
      console.error("Error deleting plan on backend:", err);
    }
  };

  // Delete Destination (Protected Item Management)
  const handleDeleteDestination = async (id: string) => {
    const jwtToken = localStorage.getItem("zenithplan_jwt");
    if (!jwtToken) {
      // Offline fallback
      setDestinations(prev => prev.filter(dest => dest.id !== id));
      return;
    }

    try {
      const res = await fetch(`/api/destinations/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${jwtToken}` }
      });
      if (res.ok) {
        const destRes = await fetch("/api/destinations");
        if (destRes.ok) {
          const destData = await destRes.json();
          setDestinations(destData.destinations);
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || "Failed to delete destination");
      }
    } catch (err) {
      console.error("Error deleting destination:", err);
    }
  };

  // Contact form agent reply
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    setIsSendingContact(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage
        })
      });

      if (res.ok) {
        const data = await res.json();
        setContactAutoReply(data.autoReply);
        setContactSuccess(true);
        setContactName("");
        setContactEmail("");
        setContactMessage("");
      } else {
        throw new Error("Contact submission error");
      }
    } catch {
      setContactAutoReply("Thank you! Your message was received, and our sustainable travel advisors will get back to you shortly.");
      setContactSuccess(true);
    } finally {
      setIsSendingContact(false);
    }
  };

  // Filter & Sort Logic for Explore spots
  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dest.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dest.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || dest.category === selectedCategory;
    
    let matchesBudget = true;
    if (selectedBudgetRange !== "All") {
      const budget = dest.budget;
      if (selectedBudgetRange === "under-1500") matchesBudget = budget < 1500;
      else if (selectedBudgetRange === "1500-2500") matchesBudget = budget >= 1500 && budget <= 2500;
      else if (selectedBudgetRange === "over-2500") matchesBudget = budget > 2500;
    }

    let matchesRating = true;
    if (selectedRating !== "All") {
      const rating = dest.rating;
      if (selectedRating === "4.5") matchesRating = rating >= 4.5;
      else if (selectedRating === "4.8") matchesRating = rating >= 4.8;
    }

    let matchesDuration = true;
    if (selectedDurationRange !== "All") {
      const duration = dest.duration;
      if (selectedDurationRange === "short") matchesDuration = duration <= 4;
      else if (selectedDurationRange === "medium") matchesDuration = duration >= 5 && duration <= 6;
      else if (selectedDurationRange === "long") matchesDuration = duration >= 7;
    }

    return matchesSearch && matchesCategory && matchesBudget && matchesRating && matchesDuration;
  });

  const sortedDestinations = [...filteredDestinations].sort((a, b) => {
    if (sortBy === "price-low") return a.budget - b.budget;
    if (sortBy === "price-high") return b.budget - a.budget;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "duration") return b.duration - a.duration;
    return 0; // default (unsorted order)
  });

  // Pagination bounds
  const indexOfLastItem = currentPageNum * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedDestinations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedDestinations.length / itemsPerPage);

  const FAQ_ITEMS = [
    { q: "What is ZenithPlan AI?", a: "ZenithPlan AI is a full-stack sustainable travel engine designed to organize travel while strictly minimizing ecological harm. Our custom Agentic AI is trained to audit expenditures and formulate organic carbon-neutral travel itineraries." },
    { q: "How does the AI Recommendation Engine continuously improve?", a: "The AI agent monitors your saved (liked) locations to learn your favorite bio-tourism themes. As you bookmark and review destinations, the match rating adjusts to showcase properties with lower carbon metrics." },
    { q: "Can I generate day-by-day travel plans for custom spots?", a: "Yes! Using our AI Itinerary Creator, you can type in any destination on earth, configure your preferred duration, select your carbon target, and obtain a custom day-by-day travel strategy instantly." },
    { q: "How is the ESG budget carbon footprint audited?", a: "By parsing expense allocations, the ESG audit engine calculates the exact ratio of green investments vs carbon-heavy transits. It analyzes direct local multipliers to grade your impact from A+ to F." }
  ];

  const currentDetailsDest = destinations.find(d => d.id === selectedDestId);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900 font-sans flex flex-col justify-between">
      
      {/* Dynamic Navigation */}
      <Navbar 
        user={user} 
        onNavigate={handleNavigation} 
        currentPage={currentPage}
        onLogout={handleLogout}
        onOpenAuth={() => { setAuthMode("login"); handleNavigation("login"); }}
      />

      {/* Main Container Pages with AnimatePresence */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          
          {/* LANDING PAGE / HOME */}
          {currentPage === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-24 pb-24"
            >
              {/* 1. HERO SECTION */}
              <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/10 to-white lg:h-[65vh] lg:min-h-[520px] lg:max-h-[650px] flex flex-col justify-center pt-8 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-7 space-y-6">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider transition-all duration-500">
                        <Sparkles className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500 animate-pulse" />
                        <span>{HERO_SLIDES[heroSlideIndex].badge}</span>
                      </div>
                      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.08] min-h-[72px] sm:min-h-[120px]">
                        {HERO_SLIDES[heroSlideIndex].title.split(" ").map((word, index) => 
                          ["Zero", "Footprint", "CO2", "vibe"].includes(word) || word.startsWith("Zero")
                            ? <span key={index} className="text-emerald-600"> {word}</span> 
                            : " " + word
                        )}
                      </h1>
                      <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl min-h-[60px]">
                        {HERO_SLIDES[heroSlideIndex].desc}
                      </p>
                      
                      {/* Slides Interactive Indicators */}
                      <div className="flex items-center gap-2 pt-2">
                        {HERO_SLIDES.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setHeroSlideIndex(idx)}
                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                              heroSlideIndex === idx ? "w-8 bg-emerald-600" : "w-2 bg-slate-200 hover:bg-slate-300"
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                          />
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-4 pt-2">
                        <button
                          onClick={() => handleNavigation("explore")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-100 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                        >
                          Discover Green Spots
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (!user) {
                              setAuthMode("login");
                              handleNavigation("login");
                            } else {
                              handleNavigation("recommend");
                            }
                          }}
                          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold px-6 py-3.5 rounded-xl shadow-lg shadow-slate-100 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                        >
                          Calibrate AI Vibe Match
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-5 relative">
                      <div className="absolute -inset-4 bg-emerald-200/30 rounded-full blur-3xl -z-10 animate-pulse" />
                      <div className="relative rounded-[2rem] border border-slate-100 shadow-2xl overflow-hidden aspect-4/3">
                        <img 
                          src={HERO_SLIDES[heroSlideIndex].image} 
                          alt="Lush green landscape" 
                          className="w-full h-full object-cover transition-all duration-700 ease-in-out"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clear Visual Flow scroll indicator */}
                <div className="hidden lg:flex justify-center absolute bottom-2 left-0 right-0">
                  <button
                    onClick={() => {
                      const element = document.getElementById("features-grid");
                      element?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="animate-bounce p-2 bg-white rounded-full border border-slate-100 shadow-md text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-colors cursor-pointer"
                    aria-label="Scroll to features"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </section>

              {/* 2. FEATURES GRID (Section 1) */}
              <section id="features-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
                <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Our Agentic AI Capabilities</h2>
                  <p className="text-slate-500 text-sm">Four advanced AI features integrated into a single seamless travel workspace.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { title: "Itinerary Generator", desc: "Formulates deep markdown day plans complete with local landmarks, transit systems, and solar accommodation.", icon: Compass, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
                    { title: "Recommendation Engine", desc: "Matches your organic interest profile with verified properties. Learns preferences continuously.", icon: Sparkles, color: "bg-blue-50 text-blue-600 border-blue-100" },
                    { title: "Chat Assistant Buddy", desc: "A sticky conversational travel buddy that helps with navigation, packing lists, and local climate tips.", icon: Bot, color: "bg-purple-50 text-purple-600 border-purple-100" },
                    { title: "ESG Budget Auditor", desc: "Paste expense budgets to plot carbon footprints and allocate direct regional community multipliers.", icon: BarChart3, color: "bg-amber-50 text-amber-600 border-amber-100" },
                  ].map((feat, i) => {
                    const Icon = feat.icon;
                    return (
                      <div key={i} className={`p-6 bg-white border ${feat.color} rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow`}>
                        <div className="space-y-3">
                          <div className="w-10 h-10 rounded-xl bg-white border flex items-center justify-center shadow-sm">
                            <Icon className="w-5 h-5" />
                          </div>
                          <h3 className="text-base font-black text-slate-900">{feat.title}</h3>
                          <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 3. QUICK STATS (Section 2) */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-slate-900 py-12 px-6 sm:px-12 rounded-[2rem] text-white border border-slate-800 relative overflow-hidden shadow-xl shadow-slate-900/15">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -z-10" />
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    {[
                      { num: "84,200+", label: "Metric Tons CO2 Offset" },
                      { num: "12,450", label: "Smart Itineraries Crafted" },
                      { num: "98.4%", label: "Zero-Waste Trust Score" },
                      { num: "140+", label: "Eco-Properties Audited" },
                    ].map((stat, i) => (
                      <div key={i} className="space-y-1">
                        <span className="block text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">{stat.num}</span>
                        <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 4. CATEGORIES (Section 3) */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Eco-Tourism Classifications</h2>
                  <p className="text-slate-500 text-sm">We audit and index properties across four specialized sustainable divisions.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { cat: "Eco-Tourism", label: "Solar treehouses and reforest trails", image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=400&q=80" },
                    { cat: "Adventure", label: "Glacier expeditions & leave-no-trace hikes", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80" },
                    { cat: "Cultural", label: "Organic heritage townhouses & local food", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80" },
                    { cat: "Luxury Wellness", label: "Thermal wood-pellet springs & passive spas", image: "https://images.unsplash.com/photo-1531266752426-aad472b7bbf4?auto=format&fit=crop&w=400&q=80" },
                  ].map((item, i) => (
                    <div 
                      key={i} 
                      onClick={() => { setSelectedCategory(item.cat); handleNavigation("explore"); }}
                      className="group relative h-64 rounded-2xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer"
                    >
                      <img src={item.image} alt={item.cat} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-5" />
                      <div className="absolute bottom-5 left-5 right-5 space-y-1">
                        <span className="text-white font-extrabold text-base block">{item.cat}</span>
                        <span className="text-slate-300 text-xs block font-medium">{item.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 5. HOW IT WORKS (Section 4) */}
              <section className="bg-slate-50 border-y border-slate-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight font-display">The Sustainable Workflow</h2>
                    <p className="text-slate-500 text-sm">How our Agentic AI guarantees flawless carbon mitigation on every trip plan.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                      { step: "01", title: "Vibe Calibration", desc: "Select your preferred travel pace, style interest tags, and daily spend limit." },
                      { step: "02", title: "Carbon Auditing", desc: "Our AI reasons through local rail routes and passive eco-lodge inventories." },
                      { step: "03", title: "Direct Reforest", desc: "Every generated plan includes tree-planting instructions and community aid." },
                      { step: "04", title: "Live Navigation", desc: "Your sticky Travel Buddy chat advisor handles weather offsets and local tips." },
                    ].map((w, i) => (
                      <div key={i} className="space-y-3 relative">
                        <span className="text-4xl font-black text-emerald-100 block">{w.step}</span>
                        <h3 className="text-base font-black text-slate-900">{w.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">{w.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 6. CORE LISTINGS SECTION (Section 5) */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Trending Sustainable Havens</h2>
                    <p className="text-slate-500 text-sm">Pristine destinations vetted by our carbon auditing agency.</p>
                  </div>
                  <button
                    onClick={() => handleNavigation("explore")}
                    className="text-emerald-600 hover:text-emerald-700 font-extrabold text-sm flex items-center gap-1.5"
                  >
                    View All Destinational Registries
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {isDataLoading ? (
                    [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)
                  ) : (
                    destinations.slice(0, 4).map(dest => (
                      <TravelCard 
                        key={dest.id} 
                        destination={dest} 
                        onViewDetails={handleViewDetails}
                        onLike={handleLikeDestination}
                        isLiked={user?.likes?.includes(dest.id)}
                      />
                    ))
                  )}
                </div>
              </section>

              {/* 6. INTERACTIVE CARBON FOOTPRINT ESTIMATOR */}
              <section className="bg-slate-50 border-y border-slate-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left Column - Controls */}
                    <div className="lg:col-span-6 space-y-8">
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block">Interactive Sandbox</span>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Eco-Footprint Estimator</h2>
                        <p className="text-slate-500 text-sm leading-relaxed">
                          Tweak the parameters below to witness how modern travel choices impact global ecosystems in real-time.
                        </p>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                        {/* Transport Type Selector */}
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">Mode of Transit</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { type: "train", label: "Train Route", icon: Train },
                              { type: "electric-car", label: "Electric Car", icon: Car },
                              { type: "flight", label: "Airlines Jet", icon: Plane },
                            ].map((item) => {
                              const Icon = item.icon;
                              const isActive = calcTransport === item.type;
                              return (
                                <button
                                  key={item.type}
                                  type="button"
                                  onClick={() => setCalcTransport(item.type as any)}
                                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer ${
                                    isActive
                                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100"
                                      : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                  <span className="text-[10px] font-black">{item.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Number of Travelers */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-black text-slate-700 uppercase tracking-wider">Number of Travelers</span>
                            <span className="font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">{calcTravelers} Explorer(s)</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={calcTravelers}
                            onChange={(e) => setCalcTravelers(parseInt(e.target.value))}
                            className="w-full accent-emerald-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Trip Duration */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-black text-slate-700 uppercase tracking-wider">Trip Duration</span>
                            <span className="font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">{calcDays} Day(s)</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="30"
                            value={calcDays}
                            onChange={(e) => setCalcDays(parseInt(e.target.value))}
                            className="w-full accent-emerald-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Real-time metrics output */}
                    <div className="lg:col-span-6">
                      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -z-10" />
                        
                        <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Footprint Analysis Report</span>
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            calcTransport === "train" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                            calcTransport === "electric-car" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                            "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          }`}>
                            Grade: {calcTransport === "train" ? "A+" : calcTransport === "electric-car" ? "B-" : "F"}
                          </span>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1">
                            <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Estimated Carbon Footprint</span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-5xl font-black text-white tracking-tight">
                                {(() => {
                                  let base = 12; // kg per day per person
                                  if (calcTransport === "flight") base = 145;
                                  if (calcTransport === "electric-car") base = 32;
                                  return (base * calcTravelers * calcDays).toLocaleString();
                                })()}
                              </span>
                              <span className="text-sm font-bold text-slate-400">kg CO₂e</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Required Offsetting Measures</span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-4xl font-black text-emerald-400 tracking-tight">
                                {(() => {
                                  let base = 12;
                                  if (calcTransport === "flight") base = 145;
                                  if (calcTransport === "electric-car") base = 32;
                                  const totalCo2 = base * calcTravelers * calcDays;
                                  return Math.max(1, Math.round(totalCo2 / 18));
                                })()}
                              </span>
                              <span className="text-sm font-bold text-slate-400">Native Trees Planted</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                          {calcTransport === "train" ? (
                            <span>🌱 <strong>Exceptional Choice!</strong> High-speed trains consume 85% less carbon per traveler than passenger aircraft. No offsetting trees are critically needed, though planting still enhances regional bio-diversity.</span>
                          ) : calcTransport === "electric-car" ? (
                            <span>🚗 <strong>Eco-Conscious!</strong> Pure electric transits represent low direct exhaust values, though power grid charging profiles do contribute modest footprint sums. Planting compensates for the localized multiplier.</span>
                          ) : (
                            <span>⚠️ <strong>Critical Emission load.</strong> Commercial aviation releases intensive greenhouse deposits at high altitudes, compounding thermal effects. Planting native forest zones is highly advised.</span>
                          )}
                        </div>

                        <button
                          onClick={() => handleNavigation("recommend")}
                          className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] cursor-pointer"
                        >
                          Audit Full Expense Budget
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* 7. TESTIMONIALS (Section 6) */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Eco-Explorer Testimonials</h2>
                  <p className="text-slate-500 text-sm">Conscious travelers share their zero-footprint experiences.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { name: "Sarah Jenkins", role: "Biologist", text: "The carbon footprint audit was amazingly accurate. Staying in solar treehouses while active reforest projects were happening transformed how I think about vacations.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", rating: 5 },
                    { name: "David Chen", role: "Climate Researcher", text: "I audited my travel budget using the AI auditor. The dynamic pie charts and carbon mitigation letter grade gave me exact off-setting priorities.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", rating: 5 },
                    { name: "Emily Watson", role: "Zen Yoga Coach", text: "Using the AI Itinerary Generator to plan a 5-day cultural organic trip in Kyoto was seamless. Saved hours of research finding local community hosts.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80", rating: 4.8 },
                  ].map((test, i) => (
                    <div key={i} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col justify-between space-y-6">
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold italic">"{test.text}"</p>
                      <div className="flex items-center gap-3">
                        <img src={test.avatar} alt={test.name} className="w-10 h-10 rounded-full object-cover border border-emerald-100" />
                        <div>
                          <span className="block text-xs font-black text-slate-900">{test.name}</span>
                          <span className="block text-[10px] text-slate-400 font-bold">{test.role}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 8. FAQ & ACCORDION (Section 7) */}
              <section className="max-w-3xl mx-auto px-4">
                <div className="text-center space-y-3 mb-12">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Frequently Answered Queries</h2>
                  <p className="text-slate-500 text-sm">Got questions about zero-carbon guidelines and smart recommendations?</p>
                </div>
                <div className="space-y-3">
                  {FAQ_ITEMS.map((faq, index) => {
                    const isOpen = openFaqIndex === index;
                    return (
                      <div key={index} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                          className="w-full flex justify-between items-center px-5 py-4 text-left font-extrabold text-sm text-slate-800 hover:text-emerald-600 transition-colors"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 text-xs text-slate-500 leading-relaxed border-t border-slate-50">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 9. NEWSLETTER CALL TO ACTION (Section 8) */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-emerald-600 text-white rounded-[2rem] p-8 md:p-12 text-center space-y-6 shadow-xl shadow-emerald-100/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl -z-10" />
                  <div className="max-w-2xl mx-auto space-y-4">
                    <span className="text-[10px] uppercase font-black tracking-widest text-emerald-100 block">Stay Carbon Neutral</span>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-none">Join the Zero-Waste Newsletter</h2>
                    <p className="text-emerald-100 text-xs sm:text-sm">Get monthly travel alerts, newly certified properties, and local guide highlights directly to your inbox.</p>
                  </div>
                  {newsletterSubscribed ? (
                    <div className="max-w-md mx-auto p-4 bg-white/10 rounded-xl flex items-center justify-center gap-2 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                      <span>Thank you! Your zero-waste guide has been sent.</span>
                    </div>
                  ) : (
                    <form 
                      onSubmit={(e) => { e.preventDefault(); if (newsletterEmail) setNewsletterSubscribed(true); }}
                      className="max-w-md mx-auto flex flex-col sm:flex-row gap-3"
                    >
                      <input
                        type="email"
                        required
                        placeholder="Enter your email address..."
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="flex-1 bg-white/10 placeholder-emerald-200 border border-emerald-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-200 font-semibold"
                      />
                      <button 
                        type="submit" 
                        className="bg-white hover:bg-emerald-550 text-emerald-900 hover:text-emerald-600 font-extrabold px-6 py-3 rounded-xl text-sm transition-transform active:scale-95 cursor-pointer"
                      >
                        Subscribe
                      </button>
                    </form>
                  )}
                </div>
              </section>
            </motion.div>
          )}

          {/* EXPLORE / LISTING PAGE */}
          {currentPage === "explore" && (
            <motion.div
              key="explore"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Eco Destinational Registries</h1>
                <p className="text-slate-500 text-sm">Search, filter, and sort vetted sustainable spots around the globe.</p>
              </div>

              {/* Filtering bar */}
              <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {/* Search box */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search spot, city..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-700"
                    />
                  </div>

                  {/* Category dropdown */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-700 cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="Eco-Tourism">Eco-Tourism</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Luxury Wellness">Luxury Wellness</option>
                  </select>

                  {/* Budget filter */}
                  <select
                    value={selectedBudgetRange}
                    onChange={(e) => setSelectedBudgetRange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-700 cursor-pointer"
                  >
                    <option value="All">All Budgets</option>
                    <option value="under-1500">Under $1,500</option>
                    <option value="1500-2500">$1,500 - $2,500</option>
                    <option value="over-2500">Over $2,500</option>
                  </select>

                  {/* Rating filter */}
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-700 cursor-pointer"
                  >
                    <option value="All">All Ratings</option>
                    <option value="4.5">4.5★ & Up</option>
                    <option value="4.8">4.8★ & Up</option>
                  </select>

                  {/* Duration filter */}
                  <select
                    value={selectedDurationRange}
                    onChange={(e) => setSelectedDurationRange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-700 cursor-pointer"
                  >
                    <option value="All">All Durations</option>
                    <option value="short">Short (≤ 4 Days)</option>
                    <option value="medium">Medium (5-6 Days)</option>
                    <option value="long">Long (≥ 7 Days)</option>
                  </select>

                  {/* Sorting dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-700 cursor-pointer"
                  >
                    <option value="default">Sort: Default</option>
                    <option value="price-low">Budget: Low to High</option>
                    <option value="price-high">Budget: High to Low</option>
                    <option value="rating">Vibe Rating</option>
                    <option value="duration">Trip Duration</option>
                  </select>
                </div>

                {/* Reset button displayed contextually */}
                {(searchQuery || selectedCategory !== "All" || selectedBudgetRange !== "All" || selectedRating !== "All" || selectedDurationRange !== "All" || sortBy !== "default") && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 animate-fadeIn">
                    <span className="text-xs text-slate-400 font-medium">
                      Found {filteredDestinations.length} matching eco-spots
                    </span>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("All");
                        setSelectedBudgetRange("All");
                        setSelectedRating("All");
                        setSelectedDurationRange("All");
                        setSortBy("default");
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 transition-colors bg-red-50 hover:bg-red-100/50 px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Grid listings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {isDataLoading ? (
                  Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                ) : currentItems.length > 0 ? (
                  currentItems.map(dest => (
                    <TravelCard 
                      key={dest.id} 
                      destination={dest} 
                      onViewDetails={handleViewDetails}
                      onLike={handleLikeDestination}
                      isLiked={user?.likes?.includes(dest.id)}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center space-y-2">
                    <Compass className="w-12 h-12 text-slate-300 mx-auto animate-bounce" />
                    <h3 className="text-lg font-bold text-slate-800">No registrations match</h3>
                    <p className="text-slate-400 text-sm">Please try modifying your keywords or filters.</p>
                  </div>
                )}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => { setCurrentPageNum(page); window.scrollTo({ top: 300, behavior: "smooth" }); }}
                      className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                        currentPageNum === page
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-100"
                          : "bg-white border border-slate-100 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* MATCHMAKER / RECOMMEND / PERSONALIZED */}
          {currentPage === "recommend" && (
            <motion.div
              key="recommend"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12"
            >
              <RecommendationEngine 
                destinations={destinations} 
                user={user} 
                onViewDetails={handleViewDetails}
                onLike={handleLikeDestination}
              />

              {/* Additional analysis tools */}
              <DataAnalyzer userLoggedIn={!!user} onOpenAuth={() => handleNavigation("login")} />

              {/* Day Generator Block */}
              <ItineraryGenerator 
                userLoggedIn={!!user} 
                onOpenAuth={() => handleNavigation("login")} 
                onSavePlan={handleSaveAIPlan}
              />
            </motion.div>
          )}

          {/* ADD DESTINATION (Protected) */}
          {currentPage === "add" && (
            <motion.div
              key="add"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto px-4 py-12"
            >
              {!user ? (
                <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl shadow-sm p-8 space-y-6">
                  <Lock className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-800">Protected Destination Portal</h3>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto">
                    You must sign in with your Ambassador or Premium credentials to add new audited sustainable destinations to our database.
                  </p>
                  <button
                    onClick={() => { handleNavigation("login"); }}
                    className="bg-emerald-600 text-white font-extrabold px-6 py-2.5 rounded-xl text-sm hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    Authenticate Portal Account
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-150 p-6 md:p-8 shadow-sm space-y-8">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 block">Premium Agent Submission</span>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add Audited Eco-Destination</h2>
                    <p className="text-slate-400 text-xs">Vete and publish direct reforestation spot metrics to our worldwide registries.</p>
                  </div>

                  {addSuccessMessage && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl font-bold text-emerald-800 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span>{addSuccessMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleAddDestination} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Spot Name</label>
                        <input
                          type="text" required placeholder="Costa Rica Forest Lodge"
                          value={addTitle} onChange={(e) => setAddTitle(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Exact Location</label>
                        <input
                          type="text" required placeholder="Monteverde, Costa Rica"
                          value={addLocation} onChange={(e) => setAddLocation(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Short Abstract Description</label>
                      <input
                        type="text" required placeholder="Brief, engaging summary describing key sustainable focus."
                        value={addShortDesc} onChange={(e) => setAddShortDesc(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Full Environmental Overview Details</label>
                      <textarea
                        required placeholder="Detail local eco lodge architecture, community aid, or carbon compensation schemes..."
                        rows={4}
                        value={addFullDesc} onChange={(e) => setAddFullDesc(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Eco Category</label>
                        <select
                          value={addCategory} onChange={(e) => setAddCategory(e.target.value as Destination["category"])}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none"
                        >
                          <option value="Eco-Tourism">Eco-Tourism</option>
                          <option value="Adventure">Adventure</option>
                          <option value="Cultural">Cultural</option>
                          <option value="Luxury Wellness">Luxury Wellness</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Estimated Budget ($)</label>
                        <input
                          type="number" required placeholder="1400"
                          value={addBudget} onChange={(e) => setAddBudget(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Trip Duration (Days)</label>
                        <input
                          type="number" required placeholder="5"
                          value={addDuration} onChange={(e) => setAddDuration(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Spot Cover Photo (Image URL)</label>
                        <input
                          type="url" placeholder="https://unsplash.com/... (Optional)"
                          value={addImageUrl} onChange={(e) => setAddImageUrl(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl p-3 text-xs font-semibold text-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Trail Difficulty Level</label>
                        <select
                          value={addDifficulty} onChange={(e) => setAddDifficulty(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none"
                        >
                          <option value="Easy">Easy (Seniors/Kids friendly)</option>
                          <option value="Moderate">Moderate (Active hiking)</option>
                          <option value="Hard">Hard (Expert rifting)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-xl text-sm transition-transform active:scale-[0.98] shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Audit & Register Sustainable Haven</span>
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          )}

          {/* MANAGE ITEMS (Protected) */}
          {currentPage === "manage" && (
            <motion.div
              key="manage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 block">Registry Hub Console</span>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Registry Items</h1>
                  <p className="text-slate-500 text-sm">Vete, review, and delete registered eco-destinations and travel plans.</p>
                </div>
                {user && (
                  <button
                    onClick={() => handleNavigation("add")}
                    className="self-start md:self-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-transform active:scale-[0.98] shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Spot</span>
                  </button>
                )}
              </div>

              {!user ? (
                <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl shadow-sm p-8 space-y-6">
                  <Lock className="w-12 h-12 text-slate-300 mx-auto animate-pulse" />
                  <h3 className="text-xl font-bold text-slate-800">Protected Account Panel</h3>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto">Please authorize your portal credentials to manage eco-destinations and itineraries.</p>
                  <button
                    onClick={() => { handleNavigation("login"); }}
                    className="bg-emerald-600 text-white font-extrabold px-6 py-2.5 rounded-xl text-sm hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    Portal Login
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Modern Tab Selector */}
                  <div className="flex border-b border-slate-200">
                    <button
                      onClick={() => setManageTab("destinations")}
                      className={`pb-4 px-6 font-bold text-sm tracking-tight border-b-2 transition-all cursor-pointer ${
                        manageTab === "destinations"
                          ? "border-emerald-600 text-emerald-600"
                          : "border-transparent text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      Audited Eco-Destinations ({destinations.length})
                    </button>
                    <button
                      onClick={() => setManageTab("itineraries")}
                      className={`pb-4 px-6 font-bold text-sm tracking-tight border-b-2 transition-all cursor-pointer ${
                        manageTab === "itineraries"
                          ? "border-emerald-600 text-emerald-600"
                          : "border-transparent text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      AI Travel Itineraries ({userPlans.length})
                    </button>
                  </div>

                  {manageTab === "destinations" ? (
                    <div>
                      {destinations.length > 0 ? (
                        <>
                          {/* Desktop/Tablet Table View */}
                          <div className="hidden md:block bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                                  <th className="px-6 py-4">Destination Cover</th>
                                  <th className="px-6 py-4">Spot Title / Name</th>
                                  <th className="px-6 py-4">Exact Location</th>
                                  <th className="px-6 py-4">Category</th>
                                  <th className="px-6 py-4">Estimated Budget</th>
                                  <th className="px-6 py-4 text-right">Console Controls</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold text-xs">
                                {destinations.map((dest) => (
                                  <tr key={dest.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                      <img
                                        src={dest.images && dest.images[0] ? dest.images[0] : "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=150&q=80"}
                                        alt={dest.title}
                                        referrerPolicy="no-referrer"
                                        className="w-16 h-10 object-cover rounded-lg border border-slate-100"
                                      />
                                    </td>
                                    <td className="px-6 py-4">
                                      <div>
                                        <span className="block font-extrabold text-slate-900 text-sm">{dest.title}</span>
                                        <span className="text-[10px] text-slate-400 font-medium line-clamp-1">{dest.shortDescription}</span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                      <span className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>{dest.location}</span>
                                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800">
                                        {dest.category}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 font-extrabold text-slate-900 text-sm">
                                      ${dest.budget?.toLocaleString() || "1,200"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                      <div className="flex gap-2 justify-end">
                                        <button
                                          onClick={() => handleViewDetails(dest.id)}
                                          className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center justify-center cursor-pointer"
                                          title="View Audit Details"
                                        >
                                          <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            if (window.confirm(`Are you sure you want to delete ${dest.title} from the registry?`)) {
                                              handleDeleteDestination(dest.id);
                                            }
                                          }}
                                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center cursor-pointer"
                                          title="Delete Eco-Destination"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile Layout: Polish Card Grid */}
                          <div className="block md:hidden grid grid-cols-1 gap-4">
                            {destinations.map((dest) => (
                              <div key={dest.id} className="bg-white border border-slate-150 rounded-2xl shadow-sm p-4 space-y-4">
                                <div className="flex gap-3">
                                  <img
                                    src={dest.images && dest.images[0] ? dest.images[0] : "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=150&q=80"}
                                    alt={dest.title}
                                    referrerPolicy="no-referrer"
                                    className="w-20 h-16 object-cover rounded-lg border border-slate-100 shrink-0"
                                  />
                                  <div className="space-y-1 min-w-0">
                                    <span className="block font-extrabold text-slate-900 text-sm truncate">{dest.title}</span>
                                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                                      <span className="truncate">{dest.location}</span>
                                    </div>
                                    <div className="flex gap-1.5 items-center">
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800">
                                        {dest.category}
                                      </span>
                                      <span className="text-[10px] font-extrabold text-slate-800">${dest.budget || "1,200"}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2 border-t border-slate-100 pt-3">
                                  <button
                                    onClick={() => handleViewDetails(dest.id)}
                                    className="flex-1 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>View Details</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm(`Are you sure you want to delete ${dest.title}?`)) {
                                        handleDeleteDestination(dest.id);
                                      }
                                    }}
                                    className="flex-1 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete Spot</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="py-20 text-center bg-white border border-slate-150 rounded-2xl space-y-4 p-6">
                          <Compass className="w-12 h-12 text-slate-300 mx-auto animate-bounce" />
                          <h3 className="text-base font-extrabold text-slate-800">No Audited Destinations Found</h3>
                          <p className="text-slate-400 text-xs max-w-sm mx-auto">Click "Add New Spot" above to register a new sustainable haven into the active registry database.</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
                      {userPlans.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                                <th className="px-6 py-4">Itinerary / Trip Destination</th>
                                <th className="px-6 py-4">Days</th>
                                <th className="px-6 py-4">Eco Vibe</th>
                                <th className="px-6 py-4">Created Date</th>
                                <th className="px-6 py-4 text-right">Console Controls</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold text-xs">
                              {userPlans.map((plan) => (
                                <tr key={plan.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-6 py-4">
                                    <div>
                                      <span className="block font-extrabold text-slate-900 text-sm">{plan.title}</span>
                                      <span className="text-[10px] text-slate-400">{plan.destination}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">{plan.days} Days</td>
                                  <td className="px-6 py-4">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800">
                                      {plan.travelStyle}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-slate-400">{plan.createdAt}</td>
                                  <td className="px-6 py-4 text-right">
                                    <div className="flex gap-2 justify-end">
                                      <button
                                        onClick={() => {
                                          setPlannerDestination(plan.destination);
                                          setPlannerDuration(plan.days);
                                          handleNavigation("recommend");
                                        }}
                                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                                        title="Open Audit details"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeletePlan(plan.id)}
                                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                                        title="Delete plan"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="py-20 text-center space-y-4 p-6">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mx-auto">
                            <Compass className="w-6 h-6 animate-spin-slow" />
                          </div>
                          <h3 className="text-base font-extrabold text-slate-800">No Custom Itineraries Registered</h3>
                          <p className="text-slate-400 text-xs max-w-sm mx-auto">Use our generator tool inside Zenith Matchmaker to formulate and commit day plans.</p>
                          <button
                            onClick={() => handleNavigation("recommend")}
                            className="bg-emerald-600 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                          >
                            Launch AI Planner
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* DETAILED VIEW PAGE (Public) */}
          {currentPage === "details" && currentDetailsDest && (
            <motion.div
              key="details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto px-4 py-12 space-y-12"
            >
              {/* Back button */}
              <button
                onClick={() => handleNavigation("explore")}
                className="text-slate-500 hover:text-emerald-600 font-extrabold text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span>Return to listings</span>
              </button>

              {/* Title & Location Header */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded">
                  {currentDetailsDest.category} Registry Item
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">{currentDetailsDest.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>{currentDetailsDest.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>{currentDetailsDest.rating} Rating</span>
                  </div>
                </div>
              </div>

              {/* Photos Gallery */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 rounded-2xl overflow-hidden aspect-16/10 shadow-sm bg-slate-100">
                  <img src={currentDetailsDest.images[0]} alt="Scenic cover spot" className="w-full h-full object-cover" />
                </div>
                <div className="grid grid-rows-2 gap-6">
                  {currentDetailsDest.images.slice(1, 3).map((img, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden shadow-sm bg-slate-100 relative">
                      <img src={img} alt="Detail view" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Specs & Descriptions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-8 bg-white border border-slate-150 p-6 md:p-8 rounded-3xl shadow-sm">
                  <div className="space-y-4">
                    <h3 className="text-xl font-extrabold text-slate-900">Environmental & Spot Description</h3>
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{currentDetailsDest.description}</p>
                  </div>

                  {/* Vibe reviews */}
                  <div className="space-y-6 pt-6 border-t border-slate-100">
                    <h3 className="text-xl font-extrabold text-slate-900">Verified Traveler Reviews</h3>
                    <div className="space-y-5">
                      {currentDetailsDest.reviews.map((rev) => (
                        <div key={rev.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100/50 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <img src={rev.avatar} alt="User Avatar" className="w-8 h-8 rounded-full object-cover" />
                              <div>
                                <span className="block text-xs font-black text-slate-900">{rev.user}</span>
                                <span className="block text-[9px] text-slate-400 font-semibold">{rev.date}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs">
                              <Star className="w-3.5 h-3.5 fill-amber-500" />
                              <span>{rev.rating}</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 font-semibold leading-relaxed">"{rev.text}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Audit specifications box */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-slate-900 text-slate-100 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-lg">
                    <h4 className="font-black text-sm uppercase tracking-wider border-b border-slate-800 pb-3">Carbon Audit Metrics</h4>
                    
                    <div className="space-y-4 text-xs font-semibold">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Green Lodging</span>
                        <span className="text-emerald-400">{currentDetailsDest.specifications.accommodation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Carbon Footprint</span>
                        <span className="text-emerald-400 font-black">{currentDetailsDest.specifications.carbonFootprint} kg CO2e</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Difficulty Grade</span>
                        <span>{currentDetailsDest.specifications.difficulty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Best Season</span>
                        <span>{currentDetailsDest.specifications.bestTime}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-end justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Estimated Cost</span>
                        <span className="text-2xl font-black text-white">${currentDetailsDest.budget}</span>
                      </div>
                      <button
                        onClick={() => handleLikeDestination(currentDetailsDest.id)}
                        className={`p-2.5 rounded-xl border transition-colors ${
                          user?.likes?.includes(currentDetailsDest.id)
                            ? "bg-red-500 text-white border-transparent"
                            : "border-slate-800 hover:border-slate-700 text-slate-400"
                        }`}
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>

                  {/* CTA generate custom planner */}
                  <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl text-center space-y-3 shadow-sm">
                    <Sparkles className="w-6 h-6 text-emerald-600 mx-auto animate-pulse" />
                    <span className="block font-black text-xs text-slate-800">Generate Custom Day Itinerary?</span>
                    <p className="text-[11px] text-slate-500 leading-normal">Our agent will formulate a customized travel map for {currentDetailsDest.title} instantly.</p>
                    <button
                      onClick={() => {
                        setPlannerDestination(currentDetailsDest.title);
                        setPlannerDuration(currentDetailsDest.duration);
                        handleNavigation("recommend");
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl w-full"
                    >
                      Formulate Sustainable Plan
                    </button>
                  </div>
                </div>
              </div>

              {/* Related Items Section */}
              <div className="space-y-6 pt-12 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Related Eco-Tourism Havens</h3>
                  <button
                    onClick={() => handleNavigation("explore")}
                    className="text-emerald-600 hover:text-emerald-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View all spots</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {destinations
                    .filter(dest => dest.id !== currentDetailsDest.id)
                    .sort((a, b) => {
                      const aSameCat = a.category === currentDetailsDest.category ? 1 : 0;
                      const bSameCat = b.category === currentDetailsDest.category ? 1 : 0;
                      if (aSameCat !== bSameCat) {
                        return bSameCat - aSameCat;
                      }
                      return b.rating - a.rating;
                    })
                    .slice(0, 4)
                    .map(dest => (
                      <TravelCard 
                        key={dest.id} 
                        destination={dest} 
                        onViewDetails={handleViewDetails}
                        onLike={handleLikeDestination}
                        isLiked={user?.likes?.includes(dest.id)}
                      />
                    ))
                  }
                </div>
              </div>
            </motion.div>
          )}

          {/* ABOUT PAGE */}
          {currentPage === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto px-4 py-16 space-y-12"
            >
              <div className="space-y-3 text-center">
                <span className="text-xs uppercase font-black text-emerald-600 tracking-wider">Mission Statement</span>
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">Our Green Travel Vision</h1>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xl mx-auto">
                  ZenithPlan AI combines full-stack precision engineering with Large Language Models to compensate for emissions and encourage local fair trade tourism.
                </p>
              </div>

              <div className="rounded-3xl overflow-hidden shadow-sm aspect-21/9 border bg-slate-100">
                <img src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80" alt="Lush green treetops with active canopy research" className="w-full h-full object-cover" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-semibold text-slate-600 leading-relaxed text-sm">
                <div className="space-y-3 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-extrabold text-slate-900">Why Agentic AI Travel?</h3>
                  <p className="text-xs">
                    Standard booking platforms maximize traffic and ticket volumes, which frequently contributes to over-tourism and degrades delicate ecosystems. ZenithPlan implements localized auditing, encouraging travelers to pick solar-powered domes, local guides, and zero-carbon transit routes.
                  </p>
                </div>
                <div className="space-y-3 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-extrabold text-slate-900">Our Offsetting Integrity</h3>
                  <p className="text-xs">
                    Every vacation spot listed in our catalog supports verified localized direct action campaigns, such as coral micro-fragmentation in Pemuteran, cloud forest canopy preservation in Costa Rica, and rewilding trails inside Patagonia.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* CONTACT PAGE */}
          {currentPage === "contact" && (
            <motion.div
              key="contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto px-4 py-16 space-y-12"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">Support Desk</h1>
                <p className="text-slate-500 text-sm">Connect with our organic travel specialists and ecological auditors.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* Contact form */}
                <div className="md:col-span-7 bg-white border border-slate-150 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
                  {contactSuccess ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        <span>Support ticket submitted successfully!</span>
                      </div>
                      <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 space-y-2">
                        <span className="text-[9px] uppercase font-black text-emerald-400 block tracking-widest">Instant AI Assistant Auto-Reply:</span>
                        <p className="text-xs font-semibold leading-relaxed italic text-slate-300">"{contactAutoReply}"</p>
                      </div>
                      <button
                        onClick={() => setContactSuccess(false)}
                        className="text-emerald-600 hover:underline text-xs font-bold"
                      >
                        Submit another ticket
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Your Name</label>
                        <input
                          type="text" required placeholder="Alex Green"
                          value={contactName} onChange={(e) => setContactName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-3.5 text-xs font-semibold focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Your Email</label>
                        <input
                          type="email" required placeholder="alex@greenmail.com"
                          value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-3.5 text-xs font-semibold focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Your Message / Request</label>
                        <textarea
                          required placeholder="Tell us how we can assist with your travel planning or carbon compensation goals..."
                          rows={4}
                          value={contactMessage} onChange={(e) => setContactMessage(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-3 text-xs font-semibold focus:outline-none resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSendingContact}
                        className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-[0.98]"
                      >
                        {isSendingContact ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                            <span>Formulating AI Response...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 text-emerald-400" />
                            <span>Submit Ticket & Get AI Feedback</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>

                {/* Direct info details */}
                <div className="md:col-span-5 bg-slate-900 text-slate-200 p-6 rounded-3xl border border-slate-800 space-y-6">
                  <h4 className="font-black text-sm uppercase tracking-wider border-b border-slate-850 pb-3 text-white">Direct Connect</h4>
                  
                  <ul className="space-y-4 text-xs font-semibold">
                    <li className="flex gap-3 items-start">
                      <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-slate-400">General Questions</span>
                        <span className="text-white">support@zenithplan.ai</span>
                      </div>
                    </li>
                    <li className="flex gap-3 items-start">
                      <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-slate-400">Emergency Desk</span>
                        <span className="text-white">+1 (555) 722-GREEN</span>
                      </div>
                    </li>
                    <li className="flex gap-3 items-start">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-slate-400">Headquarters</span>
                        <span className="text-white">Silicon Valley, California</span>
                      </div>
                    </li>
                  </ul>

                  <div className="p-4 bg-slate-800 border border-slate-750 rounded-2xl text-[11px] leading-relaxed text-slate-400">
                    <Shield className="w-4 h-4 text-emerald-400 mb-2" />
                    Our system uses AES-256 state encryption to safeguard travel records and payment logs.
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* DEDICATED LOGIN / REGISTER PAGES */}
          {currentPage === "login" && (
            <LoginPage
              onLoginSuccess={(userData, token) => {
                setUser(userData);
                saveUser(userData);
                // Trigger dynamic plans load if possible
                fetch("/api/itineraries", {
                  headers: { "Authorization": `Bearer ${token}` }
                }).then(res => {
                  if (res.ok) return res.json();
                  return { itineraries: [] };
                }).then(data => {
                  setUserPlans(data.itineraries || []);
                }).catch(() => {
                  setUserPlans(getItineraries());
                });
              }}
              onNavigate={(page) => {
                if (page === "home" && redirectAfterLogin !== "home") {
                  handleNavigation(redirectAfterLogin);
                  setRedirectAfterLogin("home");
                } else {
                  handleNavigation(page);
                }
              }}
            />
          )}

          {currentPage === "register" && (
            <RegisterPage
              onRegisterSuccess={(userData, token) => {
                setUser(userData);
                saveUser(userData);
                setUserPlans([]);
              }}
              onNavigate={(page) => {
                if (page === "home" && redirectAfterLogin !== "home") {
                  handleNavigation(redirectAfterLogin);
                  setRedirectAfterLogin("home");
                } else {
                  handleNavigation(page);
                }
              }}
            />
          )}

          {/* HELP & SUPPORT FAQ PORTAL */}
          {currentPage === "help" && (
            <motion.div
              key="help"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-4xl mx-auto px-4 py-16 space-y-12"
            >
              <div className="text-center space-y-3">
                <span className="text-xs uppercase font-black text-emerald-600 tracking-wider">Support Center</span>
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">Help FAQ Portal</h1>
                <p className="text-slate-500 text-sm max-w-lg mx-auto">
                  Find fast, clear answers about eco-auditing standards, customizable itineraries, and offset multipliers.
                </p>
              </div>

              {/* Dynamic Support Filter Bar */}
              <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Search box */}
                  <div className="relative sm:col-span-7">
                    <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search support topics..."
                      value={helpSearchQuery}
                      onChange={(e) => setHelpSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none text-slate-800"
                    />
                    {helpSearchQuery && (
                      <button
                        onClick={() => setHelpSearchQuery("")}
                        className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Category Pills */}
                  <div className="sm:col-span-5 flex overflow-x-auto gap-1.5 no-scrollbar scroll-smooth">
                    {["All", "Carbon Audit", "Itineraries", "Saves & Profile", "AI Technology"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { setHelpSelectedCategory(cat); setHelpExpandedFaq(null); }}
                        className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                          helpSelectedCategory === cat
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* FAQ Accordions List */}
              <div className="space-y-3">
                {(() => {
                  const items = [
                    {
                      category: "Carbon Audit",
                      q: "How does the AI determine the carbon offset requirements?",
                      a: "Our ESG Budget Auditor uses strict global emission factors (e.g. GHG Protocol & DEFRA database values). Flights are computed at approximately 145g of CO2e per passenger-kilometer, high-speed rail at 12g, and typical electric vehicles at 32g. Offset calculations translate this gross emission volume into equivalent mature trees planted, assuming one mature tree absorbs approximately 18kg to 22kg of carbon dioxide per year."
                    },
                    {
                      category: "Itineraries",
                      q: "Can I modify the generated day-by-day plans?",
                      a: "Absolutely! ZenithPlan generates itineraries in standard Markdown format. You can click 'Download MD' to save the plans locally and edit them in any text editor. If you are signed in, you can also save the plans directly to your Ambassador profile to easily review them in the 'Manage Saved Trips' panel."
                    },
                    {
                      category: "Saves & Profile",
                      q: "Do I need to pay to become an Eco Ambassador?",
                      a: "No, our Ambassador portal is free to join! Basic membership allows you to explore eco-spots, save your favorites, and calculate carbon budgets. Premium status is automatically assigned to active community editors who submit audited eco-destinations."
                    },
                    {
                      category: "AI Technology",
                      q: "Is the Gemini AI model safe to use with personal data?",
                      a: "Yes, ZenithPlan AI executes all generative model queries on a secure, server-side infrastructure. Your API keys are encrypted at-rest, and any personal budget numbers or trip queries are processed statelessly without perpetual training exposure."
                    },
                    {
                      category: "Carbon Audit",
                      q: "How can I verify the eco lodges are genuinely sustainable?",
                      a: "Every single destination listed in the Zenith registry is vetted under three criteria: 1) Verified renewable energy dependencies, 2) active local employment/economic integration, and 3) verified waste management compliance. Ambassadors actively review, update, and flag lodges that violate these strict guidelines."
                    },
                    {
                      category: "AI Technology",
                      q: "What guidelines should I give to the custom itinerary agent?",
                      a: "You can use the 'Custom Agent Directives' input box in the itinerary creator to provide specific requests. Helpful details include physical fitness levels, dietary requirements (e.g. gluten-free, vegan dining), traveling with young children, or interest in specific outdoor hobbies like bird-watching or rafting."
                    }
                  ].filter(faq => {
                    const matchesSearch = faq.q.toLowerCase().includes(helpSearchQuery.toLowerCase()) || 
                                          faq.a.toLowerCase().includes(helpSearchQuery.toLowerCase());
                    const matchesCategory = helpSelectedCategory === "All" || faq.category === helpSelectedCategory;
                    return matchesSearch && matchesCategory;
                  });

                  if (items.length === 0) {
                    return (
                      <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 p-6 space-y-3">
                        <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
                        <h4 className="font-bold text-slate-800 text-sm">No Matching Questions Found</h4>
                        <p className="text-xs text-slate-400">Try tweaking your search phrase or choosing a different category tab.</p>
                      </div>
                    );
                  }

                  return items.map((faq, index) => {
                    const isExpanded = helpExpandedFaq === index;
                    return (
                      <div key={index} className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm hover:border-slate-250 transition-colors">
                        <button
                          onClick={() => setHelpExpandedFaq(isExpanded ? null : index)}
                          className="w-full flex justify-between items-center px-6 py-4.5 text-left font-extrabold text-sm text-slate-800 hover:text-emerald-600 transition-colors"
                        >
                          <div className="space-y-1 pr-4">
                            <span className="inline-block text-[9px] font-black tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase leading-none">
                              {faq.category}
                            </span>
                            <span className="block font-black text-slate-900 text-sm leading-snug">{faq.q}</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isExpanded ? "rotate-180 text-emerald-500" : ""}`} />
                        </button>
                        {isExpanded && (
                          <div className="px-6 pb-6 pt-2 text-xs text-slate-500 font-semibold leading-relaxed border-t border-slate-50 bg-slate-50/30">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Direct Support desk call to action */}
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl text-center space-y-4 max-w-lg mx-auto">
                <Bot className="w-8 h-8 text-emerald-600 mx-auto animate-pulse" />
                <h3 className="font-black text-base text-slate-950">Still Have Custom Travel Queries?</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-normal">
                  Our organic support experts and carbon emission auditors are standing by to verify complex itineraries.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => handleNavigation("contact")}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                  >
                    Open Support Ticket
                  </button>
                  <button
                    onClick={() => {
                      const chatBtn = document.querySelector('[class*="bottom-6 right-6"] button') as HTMLButtonElement;
                      if (chatBtn) chatBtn.click();
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                  >
                    Chat with AI Buddy
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* PRIVACY POLICY & TERMS PAGE */}
          {currentPage === "privacy" && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-3xl mx-auto px-4 py-16 space-y-12 font-sans"
            >
              <div className="text-center space-y-2">
                <Shield className="w-12 h-12 text-emerald-600 mx-auto animate-spin-slow" />
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">Privacy & Safety Charter</h1>
                <p className="text-slate-400 text-xs">Effective: July 18, 2026 • Verified Zero Leakage Infrastructure</p>
              </div>

              <div className="bg-white border border-slate-150 p-6 md:p-8 rounded-3xl shadow-sm space-y-8 font-semibold text-slate-600 text-sm leading-relaxed">
                <div className="space-y-3">
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-black">1</span>
                    Zero-Footprint Audit Authenticity
                  </h3>
                  <p className="text-xs text-slate-500 pl-8">
                    ZenithPlan strictly pledges to never list unvetted properties or eco-safari providers who practice greenwashing. Every property registry contains fully authentic and traceable carbon credentials, solar panel counts, and localized community compensation multipliers.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-black">2</span>
                    Agentic AI Chat History Isolation
                  </h3>
                  <p className="text-xs text-slate-500 pl-8">
                    To maintain strict personal confidentiality, your conversational prompts with the ZenithPlan AI Assistant and ESG Auditor are processed statelessly using the secure server-side Google Gemini SDK. Chat logs are held entirely in transient client-side states, ensuring zero permanent cloud exposure or model training data contamination.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-black">3</span>
                    Payment & Local Storage Encryption
                  </h3>
                  <p className="text-xs text-slate-500 pl-8">
                    All budget data, custom itineraries, and registered passwords entered into our database are encrypted in your local browser cache via AES-256 standard protocols. We sell zero traveler logs to airlines, travel aggregators, or behavioral advertisement networks.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-black">4</span>
                    Limitation of Liability & Use
                  </h3>
                  <p className="text-xs text-slate-500 pl-8">
                    Calculations from our carbon expense estimator represent dynamic models based on regional averages. Real travel circumstances (e.g., flight delays, alternative local transport schedules) can result in variances. Travelers are encouraged to utilize AI suggestions as planning advice rather than legal certification guidelines.
                  </p>
                </div>

                {/* Interactive Consent block */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="policyAcceptance"
                      checked={privacyAccepted}
                      onChange={(e) => setPrivacyAccepted(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-350 rounded mt-1 cursor-pointer"
                    />
                    <label htmlFor="policyAcceptance" className="text-xs text-slate-700 font-extrabold cursor-pointer select-none">
                      I accept the Privacy Policy and terms of eco-auditing
                    </label>
                  </div>

                  {privacyAccepted && (
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 animate-fadeIn">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Acceptance Saved</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Dynamic footer */}
      <Footer onNavigate={handleNavigation} />

      {/* Floating Travel Buddy AI Assistant */}
      <AITravelBuddy />

    </div>
  );
}
