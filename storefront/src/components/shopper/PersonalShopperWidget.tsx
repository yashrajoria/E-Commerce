"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useRouter } from "next/router";
import { STARTER_PROMPTS } from "./types";
import { BundleCardRenderer } from "./BundleCardRenderer";
import { useShopperChat } from "./useShopperChat";

/**
 * Renders the floating AI Personal Shopper trigger and its slide-over chat drawer.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * Hidden entirely while the route is under `/checkout`; chat state comes from `useShopperChat`, bundle replies render through `BundleCardRenderer`, and the trigger sits higher on product detail routes (`[id]`) to clear sticky mobile bars.
 *
 * @example
 * ```tsx
 * // Mounted once in the app shell.
 * <PersonalShopperWidget />
 * ```
 */
export function PersonalShopperWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    prompt,
    setPrompt,
    loading,
    liveStatus,
    messages,
    checkedItemsMap,
    handleToggleItem,
    handleAddBundleToCart,
    handleSubmit,
    clearChat,
  } = useShopperChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  // Handle step pulse simulator when loading
  useEffect(() => {
    if (!loading) {
      setCurrentStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < 2 ? prev + 1 : prev));
    }, 1100);
    return () => clearInterval(interval);
  }, [loading]);

  // Distraction-free funnel: hide floating shopper during checkout
  if (router?.pathname?.startsWith("/checkout")) {
    return null;
  }

  return (
    <>
      {/* Floating Trigger Pill */}
      <div
        className={`fixed ${
          router?.pathname?.includes("[id]")
            ? "bottom-20 md:bottom-6"
            : "bottom-4 sm:bottom-6"
        } right-4 sm:right-6 z-40`}
      >
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="group relative flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-foreground text-background shadow-lg hover:shadow-xl border border-border/40 transition-all duration-200 cursor-pointer"
          aria-label="Open AI Personal Shopper"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground/60 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <Sparkles className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-12" />
          <span className="font-semibold text-xs tracking-tight">
            AI Shopper
          </span>
        </motion.button>
      </div>

      {/* Drawer Overlay & Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            />

            {/* Slide-over Panel */}
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                className="w-screen max-w-lg md:max-w-xl bg-background/95 dark:bg-zinc-900/95 backdrop-blur-xl border-l border-border/80 shadow-2xl flex flex-col"
              >
                {/* Header */}
                <div className="px-6 py-4.5 border-b border-border/60 flex items-center justify-between bg-card/60 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center shadow-xs">
                      <Sparkles className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                        ShopSwift Copilot
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Live Agent
                        </span>
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        AI Personal Shopper & Bundle Builder
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={clearChat}
                      title="Clear session"
                      className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      title="Close drawer"
                      className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      {/* Message Bubble */}
                      <div
                        className={`max-w-[90%] sm:max-w-[85%] rounded-2xl px-4.5 py-3 text-sm leading-relaxed shadow-xs ${
                          msg.sender === "user"
                            ? "bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-tr-xs"
                            : "bg-card border border-border/80 text-foreground rounded-tl-xs shadow-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>

                      {/* Completed Steps Pills if present */}
                      {msg.steps && msg.steps.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%]">
                          {msg.steps.map((st, i) => (
                            <span
                              key={i}
                              className="text-[11px] font-medium bg-muted/80 text-muted-foreground border border-border/60 px-2.5 py-1 rounded-full flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                              {st}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Interactive Bundle Card */}
                      {msg.actionCard && msg.actionCard.type === "bundle" && (
                        <BundleCardRenderer
                          card={msg.actionCard}
                          checkedMap={checkedItemsMap[msg.id] || {}}
                          onToggleItem={(itemId) =>
                            handleToggleItem(msg.id, itemId)
                          }
                          onAddBundle={() =>
                            handleAddBundleToCart(msg.id, msg.actionCard!)
                          }
                        />
                      )}

                      {/* Quick Conversational Refinement Pills */}
                      {msg.actionCard && !loading && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%]">
                          <button
                            onClick={() =>
                              handleSubmit(
                                "Make this bundle cheaper / reduce total cost",
                              )
                            }
                            className="text-[11px] font-medium bg-card hover:bg-accent border border-border/70 hover:border-violet-500/50 rounded-lg px-2.5 py-1 text-muted-foreground hover:text-foreground transition-all duration-200 flex items-center gap-1 shadow-2xs"
                          >
                            📉 Lower budget
                          </button>
                          <button
                            onClick={() =>
                              handleSubmit(
                                "Can you swap one item for a recommended alternative?",
                              )
                            }
                            className="text-[11px] font-medium bg-card hover:bg-accent border border-border/70 hover:border-violet-500/50 rounded-lg px-2.5 py-1 text-muted-foreground hover:text-foreground transition-all duration-200 flex items-center gap-1 shadow-2xs"
                          >
                            🔄 Swap an item
                          </button>
                          <button
                            onClick={() =>
                              handleSubmit(
                                "Find the best active discount coupon code",
                              )
                            }
                            className="text-[11px] font-medium bg-card hover:bg-accent border border-border/70 hover:border-violet-500/50 rounded-lg px-2.5 py-1 text-muted-foreground hover:text-foreground transition-all duration-200 flex items-center gap-1 shadow-2xs"
                          >
                            🏷️ Check coupons
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Loading Steps Animation */}
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card border border-border/80 rounded-2xl p-4 max-w-[92%] shadow-sm space-y-3"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold text-violet-600 dark:text-violet-400">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-600"></span>
                        </span>
                        {liveStatus || "Curating intelligent bundle..."}
                      </div>

                      <div className="space-y-2">
                        {[
                          "🔍 Scanning catalog & matching themes...",
                          "📦 Checking live stock & inventory levels...",
                          "🏷️ Applying best stackable promo coupon...",
                        ].map((stepText, idx) => {
                          const isDone = currentStepIndex > idx;
                          const isCurrent = currentStepIndex === idx;
                          return (
                            <div
                              key={idx}
                              className={`flex items-center gap-2 text-xs transition-all duration-300 ${
                                isDone
                                  ? "text-emerald-600 dark:text-emerald-400 font-medium"
                                  : isCurrent
                                    ? "text-foreground font-medium animate-pulse"
                                    : "text-muted-foreground/60"
                              }`}
                            >
                              {isDone ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                              ) : isCurrent ? (
                                <div className="h-3.5 w-3.5 rounded-full border-2 border-violet-600 border-t-transparent animate-spin shrink-0" />
                              ) : (
                                <div className="h-3.5 w-3.5 rounded-full border border-border/80 shrink-0" />
                              )}
                              <span>{stepText}</span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts Chips */}
                {messages.length <= 2 && !loading && (
                  <div className="px-6 py-2 border-t border-border/40 bg-muted/20">
                    <p className="text-[11px] font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                      <Zap className="h-3 w-3 text-amber-500" /> Suggested
                      queries:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {STARTER_PROMPTS.map((starter) => (
                        <button
                          key={starter.label}
                          onClick={() => handleSubmit(starter.prompt)}
                          className="text-xs bg-card hover:bg-accent border border-border/70 hover:border-violet-500/50 rounded-xl px-3 py-1.5 transition-all duration-200 text-left text-muted-foreground hover:text-foreground shadow-2xs"
                        >
                          {starter.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Footer */}
                <div className="p-4 border-t border-border/60 bg-card/60 backdrop-blur-md">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Ask copilot: 'Desk setup under $300' or 'Best coupon'..."
                      disabled={loading}
                      className="flex-1 rounded-xl bg-background border border-border/80 px-4 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all placeholder:text-muted-foreground/60 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!prompt.trim() || loading}
                      className="rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-40 text-white px-4 py-2.5 flex items-center justify-center transition-all duration-200 shadow-md shadow-violet-500/20 active:scale-95"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground/70 px-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 text-emerald-500" />{" "}
                      Zero-knowledge saved payments
                    </span>
                    <span>Real-time stock verified</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
