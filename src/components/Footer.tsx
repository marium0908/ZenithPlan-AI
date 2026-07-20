import React from "react";
import { Compass, Mail, Phone, MapPin, Github, Linkedin, Globe, Shield } from "lucide-react";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 py-16 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate("home")}>
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-900 shadow-md">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                ZenithPlan <span className="text-emerald-400 font-bold">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              An intelligent, green-oriented travel planning ecosystem powered by advanced Agentic AI models. We help conscious adventurers discover, catalog, and analyze eco-friendly destinations.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-slate-900 transition-all cursor-pointer">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-slate-900 transition-all cursor-pointer">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-slate-900 transition-all cursor-pointer">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Explore</h4>
            <ul className="space-y-3.5 text-sm font-medium">
              <li>
                <button onClick={() => onNavigate("explore")} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Sustainable Spots
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("recommend")} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  AI Destination Matcher
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("recommend")} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Carbon Expense Auditor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("about")} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Our Mission & About
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("help")} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Help & Support FAQ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("privacy")} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Privacy Policy & Charter
                </button>
              </li>
            </ul>
          </div>

          {/* Ambassador & Services Portal */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Ambassador Portal</h4>
            <ul className="space-y-3.5 text-sm font-medium">
              <li>
                <button onClick={() => onNavigate("add")} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Add Eco-Destination
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("manage")} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Manage Saved Trips
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("login")} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Credentials login
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("contact")} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Submit Support Ticket
                </button>
              </li>
            </ul>
          </div>

          {/* Guidelines / Green Travel */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Resources</h4>
            <ul className="space-y-3.5 text-sm font-medium">
              <li><a href="https://sustainabletravel.org/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Sustainable Tourism Org</a></li>
              <li><a href="https://www.nature.org/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Nature Conservancy</a></li>
              <li><a href="https://cop28.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Climate Impact Analytics</a></li>
              <li><a href="https://www.unep.org/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">UN Environment Program</a></li>
            </ul>
          </div>

          {/* Direct Support Contact */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Contact Desk</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:support@zenithplan.ai" className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>support@zenithplan.ai</span>
                </a>
              </li>
              <li>
                <a href="tel:+15557224733" className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>+1 (555) 722-GREEN</span>
                </a>
              </li>
              <li>
                <a href="https://maps.google.com/?q=Silicon+Valley,+California" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Silicon Valley, California</span>
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-2 text-xs bg-slate-800 border border-slate-700/50 p-2.5 rounded-lg">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400">100% Zero-Carbon Certified</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} ZenithPlan AI. Designed with absolute precision & sustainable care.</p>
        </div>
      </div>
    </footer>
  );
}
