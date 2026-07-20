import React, { useState } from "react";
import { Compass, Calendar, PlusCircle, Layout, Info, LogIn, LogOut, Menu, X, User } from "lucide-react";
import { UserProfile } from "../types";

interface NavbarProps {
  user: UserProfile | null;
  onNavigate: (page: string) => void;
  currentPage: string;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export function Navbar({ user, onNavigate, currentPage, onLogout, onOpenAuth }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = user
    ? [
        { id: "explore", label: "Explore Spots", icon: Compass },
        { id: "recommend", label: "Personalized Match", icon: User },
        { id: "add", label: "Add Destination", icon: PlusCircle },
        { id: "manage", label: "Manage Items", icon: Layout },
        { id: "about", label: "About Us", icon: Info },
      ]
    : [
        { id: "explore", label: "Explore Spots", icon: Compass },
        { id: "add", label: "Add Destination", icon: PlusCircle },
        { id: "about", label: "About Us", icon: Info },
        { id: "contact", label: "Contact", icon: Info },
      ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => handleNavClick("home")} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
              ZenithPlan <span className="text-emerald-600 font-bold">AI</span>
            </span>
            <span className="block text-[9px] text-slate-400 font-medium uppercase tracking-widest leading-none">
              Green Travel Agent
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <button 
            onClick={() => handleNavClick("home")}
            className={`text-sm font-semibold transition-colors ${
              currentPage === "home" ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-600"
            }`}
          >
            Home
          </button>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                  currentPage === item.id ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-600"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Button & Account */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-800">{user.name}</span>
                <span className="block text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">{user.role}</span>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors pointer-events-auto"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-full px-6 py-2.5 shadow-lg shadow-emerald-100 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              Portal Login
            </button>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
        >
          {isOpen ? <X className="w-6 h-6 text-slate-800" /> : <Menu className="w-6 h-6 text-slate-800" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden absolute top-18 left-0 w-full bg-white border-b border-slate-100 shadow-xl px-4 py-6 space-y-4">
          <button 
            onClick={() => handleNavClick("home")}
            className="w-full text-left py-2 font-bold text-slate-800 hover:text-emerald-600 transition-colors"
          >
            Home
          </button>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="w-full text-left py-2 font-bold text-slate-800 hover:text-emerald-600 flex items-center gap-2 transition-colors"
            >
              <item.icon className="w-5 h-5 text-slate-400" />
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-100">
            {user ? (
              <div className="flex items-center justify-between">
                <div>
                  <span className="block font-bold text-slate-800">{user.name}</span>
                  <span className="block text-xs text-emerald-600">{user.email}</span>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="bg-red-50 text-red-600 hover:bg-red-100 rounded-xl px-4 py-2 text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setIsOpen(false);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        </div>
      )}

    </header>
  );
}
