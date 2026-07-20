import React, { useState, useRef, useEffect } from "react";
import { Message, getChatResponse } from "../lib/gemini";
import { Bot, User, Send, X, MessageSquare, Sparkles, AlertCircle, Compass, HelpCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function AITravelBuddy() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: "Hello! I am your ZenithPlan AI travel advisor. Ask me anything about sustainable travel spots, calculating your carbon footprint, or formulating customized itineraries!"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const chatHistory = [...messages, userMsg];
      const response = await getChatResponse(chatHistory, "ZenithPlan Travel Advisor");
      setMessages((prev) => [
        ...prev,
        { role: "model", content: response || "I had trouble gathering information. Please try again." }
      ]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "model", content: `Connection error: ${err.message || "Please check your GEMINI_API_KEY."}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const presetSuggestions = [
    "Recommend an adventure trip",
    "How do I travel carbon-neutral?",
    "Suggest a luxury wellness spot",
    "Costa Rica vs. Patagonia?"
  ];

  return (
    <div className={`fixed z-[9999] font-sans transition-all duration-300 ${
      isOpen 
        ? "inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[400px] sm:h-[580px]" 
        : "bottom-4 right-4 sm:bottom-6 sm:right-6"
    }`}>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="w-full h-full bg-white sm:rounded-3xl rounded-none border-t sm:border border-slate-150 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                {/* Mobile Minimize Arrow */}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="sm:hidden p-1.5 -ml-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  aria-label="Minimize Chat"
                  type="button"
                >
                  <ChevronDown className="w-6 h-6 text-emerald-400" />
                </button>

                <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-900 shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight">ZenithPlan AI Assistant</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Online Travel Agent</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                title="Minimize chat"
                type="button"
              >
                <span className="hidden sm:inline text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Minimize</span>
                <ChevronDown className="w-4 h-4 text-emerald-400" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50" ref={scrollRef}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 max-w-[85%] ${
                    msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                      msg.role === "user" ? "bg-emerald-600 text-white" : "bg-slate-900 text-white"
                    }`}
                  >
                    {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-emerald-600 text-white rounded-tr-none"
                        : "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 mr-auto max-w-[85%]">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-slate-100 text-slate-800 px-3.5 py-2.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions Panel */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {presetSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSend(suggestion)}
                  className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-emerald-300 text-[10px] font-bold text-slate-600 hover:text-emerald-700 whitespace-nowrap transition-colors shadow-sm shrink-0"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Form Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputValue);
              }}
              className="p-3 border-t border-slate-100 bg-white flex items-center gap-2 shrink-0 pb-safe"
            >
              <input
                type="text"
                placeholder="Ask your travel companion..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none shadow-inner"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white flex items-center justify-center transition-colors shadow shadow-emerald-200 cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-slate-900 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-200/50 transition-colors group cursor-pointer border-2 border-white"
          >
            <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-emerald-500 text-[9px] font-black text-slate-900 rounded-full flex items-center justify-center animate-pulse border border-white">
              AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
