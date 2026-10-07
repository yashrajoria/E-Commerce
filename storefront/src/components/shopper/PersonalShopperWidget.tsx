"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  ShoppingBag,
  Check,
  CheckCircle2,
  Tag,
  RotateCcw,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

interface BundleItem {
  id: string;
  _id?: string;
  name: string;
  price: number;
  images?: string[];
  brand?: string;
  sku?: string;
  category_path?: string[];
  description?: string;
  quantity?: number;
}

interface ActionCard {
  type: string;
  title: string;
  theme?: string;
  budget_cents: number;
  bundle_price_cents: number;
  original_price_cents: number;
  discount_cents: number;
  coupon_code: string;
  savings_cents: number;
  items: BundleItem[];
}

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  steps?: string[];
  actionCard?: ActionCard;
  timestamp: Date;
}

const STARTER_PROMPTS = [
  { label: "🖥️ Home office desk setup under $300", prompt: "Build me a home office desk bundle under $300" },
  { label: "🏃 Weekend running kit under $150", prompt: "Curate a running and fitness bundle under $150" },
  { label: "🍵 Tea & focus corner under $80", prompt: "Curate an artisan tea and relaxing desk setup under $80" },
  { label: "✨ Best available store discount?", prompt: "What is the best discount coupon code right now?" },
];

export function PersonalShopperWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() => `shopper-${Date.now()}`);
  const [liveStatus, setLiveStatus] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "👋 Hi! I'm your AI Personal Shopper & Bundle Builder. Tell me your target budget or aesthetic, and I'll curate in-stock products with the highest stackable discounts!",
      timestamp: new Date(),
    },
  ]);

  // Selected state per bundle card message ID: Map<messageId, Set<productId>>
  const [checkedItemsMap, setCheckedItemsMap] = useState<Record<string, Record<string, boolean>>>({});

  const { addToCart } = useCart();
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleToggleItem = (msgId: string, itemId: string) => {
    setCheckedItemsMap((prev) => {
      const currentMsgMap = prev[msgId] || {};
      const nextChecked = currentMsgMap[itemId] !== false ? false : true;
      return {
        ...prev,
        [msgId]: {
          ...currentMsgMap,
          [itemId]: nextChecked,
        },
      };
    });
  };

  const handleAddBundleToCart = (msgId: string, card: ActionCard) => {
    const itemMap = checkedItemsMap[msgId] || {};
    const selected = card.items.filter((item) => itemMap[item.id] !== false);

    if (selected.length === 0) {
      toast.error("Please select at least one item to add to cart.");
      return;
    }

    selected.forEach((item) => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        images: item.images || ["/icons8-image-100.png"],
        category: item.category_path?.[0] || "General",
        rating: 5,
        reviews: 12,
        quantity: 1,
      });
    });

    if (card.coupon_code) {
      try {
        localStorage.setItem("saved_coupon", card.coupon_code);
        localStorage.setItem("applied_coupon", card.coupon_code);
      } catch {
        // ignore localstorage errors
      }
    }

    toast.success(
      `Added ${selected.length} items to your cart! Promo code ${card.coupon_code} ready.`,
      {
        duration: 4000,
        icon: "🎉",
      }
    );
  };

  const handleSubmit = async (textToSend?: string) => {
    const query = (textToSend ?? prompt).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: "user",
      text: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setPrompt("");
    setLoading(true);
    setLiveStatus("Analyzing request & scanning catalog...");

    const assistantMsgId = `assistant-${Date.now()}`;
    let streamedSuccessfully = false;

    try {
      // 1. Attempt Server-Sent Events (SSE) streaming
      const streamRes = await fetch("/api/shopper/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: query, session_id: sessionId }),
      });

      if (streamRes.ok && streamRes.body) {
        streamedSuccessfully = true;
        // Seed blank assistant message
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMsgId,
            sender: "assistant",
            text: "",
            steps: [],
            timestamp: new Date(),
          },
        ]);

        const reader = streamRes.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const blocks = buffer.split("\n\n");
          buffer = blocks.pop() || "";

          for (const block of blocks) {
            if (!block.trim()) continue;
            const eventMatch = block.match(/^event:\s*([^\n\r]+)/m);
            const dataMatch = block.match(/^data:\s*([^\n\r]+)/m);
            if (!eventMatch || !dataMatch) continue;

            const eventType = eventMatch[1].trim();
            let parsedData: Record<string, unknown>;
            try {
              parsedData = JSON.parse(dataMatch[1].trim());
            } catch {
              continue;
            }

            if (eventType === "status") {
              setLiveStatus(typeof parsedData.message === "string" ? parsedData.message : null);
            } else if (eventType === "token") {
              const delta = typeof parsedData.delta === "string" ? parsedData.delta : "";
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId ? { ...m, text: m.text + delta } : m
                )
              );
            } else if (eventType === "action_card") {
              const card = parsedData as unknown as ActionCard;
              if (Array.isArray(card.items)) {
                const initMap: Record<string, boolean> = {};
                card.items.forEach((it: BundleItem) => {
                  initMap[it.id] = true;
                });
                setCheckedItemsMap((prev) => ({
                  ...prev,
                  [assistantMsgId]: initMap,
                }));
              }
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId ? { ...m, actionCard: card } : m
                )
              );
            } else if (eventType === "steps") {
              const stepsArr = Array.isArray(parsedData.steps) ? (parsedData.steps as string[]) : [];
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId
                    ? { ...m, steps: stepsArr }
                    : m
                )
              );
            } else if (eventType === "done") {
              if (typeof parsedData.answer === "string" && parsedData.answer) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId && !m.text
                      ? { ...m, text: parsedData.answer as string }
                      : m
                  )
                );
              }
            } else if (eventType === "error") {
              const errMsg = typeof parsedData.error === "string" ? parsedData.error : "Stream returned error";
              throw new Error(errMsg);
            }
          }
        }
      }
    } catch (streamErr) {
      console.warn("[shopper] Streaming attempt failed, falling back to sync query:", streamErr);
    }

    // 2. Fallback to synchronous query if streaming didn't process
    if (!streamedSuccessfully) {
      try {
        const res = await fetch("/api/shopper/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: query, session_id: sessionId }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }

        const data = await res.json();

        // Initialize all items as checked
        if (data.action_card?.items) {
          const initMap: Record<string, boolean> = {};
          data.action_card.items.forEach((it: BundleItem) => {
            initMap[it.id] = true;
          });
          setCheckedItemsMap((prev) => ({
            ...prev,
            [assistantMsgId]: initMap,
          }));
        }

        const assistantMsg: Message = {
          id: assistantMsgId,
          sender: "assistant",
          text: data.answer || "Here is what I curated for you:",
          steps: data.steps || [],
          actionCard: data.action_card || undefined,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        console.error("Shopper query error:", err);
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            sender: "assistant",
            text: "I couldn't reach the catalog engine right now. Please check that the backend is running and try again.",
            timestamp: new Date(),
          },
        ]);
      }
    }

    setLoading(false);
    setLiveStatus(null);
  };

  const clearChat = () => {
    setSessionId(`shopper-${Date.now()}`);
    setLiveStatus(null);
    setMessages([
      {
        id: "welcome-reset",
        sender: "assistant",
        text: "✨ Fresh session started. What can I help you find or build today?",
        timestamp: new Date(),
      },
    ]);
    setCheckedItemsMap({});
  };

  return (
    <>
      {/* Floating Trigger Pill */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-linear-to-r from-violet-600 via-indigo-600 to-rose-600 text-white shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/40 border border-white/20 backdrop-blur-md transition-all duration-300"
          aria-label="Open AI Personal Shopper Copilot"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-300"></span>
          </span>
          <Sparkles className="h-4 w-4 text-amber-300 transition-transform duration-300 group-hover:rotate-12" />
          <span className="font-semibold text-sm tracking-wide">AI Shopper</span>
          <span className="hidden sm:inline-block text-[11px] font-medium uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full">
            Copilot
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
                    <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-violet-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
                      <Sparkles className="h-5 w-5 text-white" />
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
                          onToggleItem={(itemId) => handleToggleItem(msg.id, itemId)}
                          onAddBundle={() => handleAddBundleToCart(msg.id, msg.actionCard!)}
                        />
                      )}

                      {/* Quick Conversational Refinement Pills */}
                      {msg.actionCard && !loading && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%]">
                          <button
                            onClick={() => handleSubmit("Make this bundle cheaper / reduce total cost")}
                            className="text-[11px] font-medium bg-card hover:bg-accent border border-border/70 hover:border-violet-500/50 rounded-lg px-2.5 py-1 text-muted-foreground hover:text-foreground transition-all duration-200 flex items-center gap-1 shadow-2xs"
                          >
                            📉 Lower budget
                          </button>
                          <button
                            onClick={() => handleSubmit("Can you swap one item for a recommended alternative?")}
                            className="text-[11px] font-medium bg-card hover:bg-accent border border-border/70 hover:border-violet-500/50 rounded-lg px-2.5 py-1 text-muted-foreground hover:text-foreground transition-all duration-200 flex items-center gap-1 shadow-2xs"
                          >
                            🔄 Swap an item
                          </button>
                          <button
                            onClick={() => handleSubmit("Find the best active discount coupon code")}
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
                      <Zap className="h-3 w-3 text-amber-500" /> Suggested queries:
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
                      <ShieldCheck className="h-3 w-3 text-emerald-500" /> Zero-knowledge saved payments
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

// Subcomponent: Interactive Bundle Card with live dynamic recalculations
function BundleCardRenderer({
  card,
  checkedMap,
  onToggleItem,
  onAddBundle,
}: {
  card: ActionCard;
  checkedMap: Record<string, boolean>;
  onToggleItem: (id: string) => void;
  onAddBundle: () => void;
}) {
  // Live recalculate subtotal and coupon discount based on checked items
  const { checkedItems, currentSubtotal, calculatedDiscount, finalTotal, percentBudgetUsed } =
    useMemo(() => {
      const checked = card.items.filter((item) => checkedMap[item.id] !== false);
      const subtotal = checked.reduce((acc, it) => acc + it.price, 0);

      // Proportionate discount from original bundle discount ratio
      const discountRatio =
        card.original_price_cents > 0
          ? card.discount_cents / card.original_price_cents
          : 0.1;
      const discount = Math.round(subtotal * discountRatio);
      const total = Math.max(0, subtotal - discount);

      const budget = card.budget_cents || 30000;
      const percent = Math.min(100, Math.round((total / budget) * 100));

      return {
        checkedItems: checked,
        currentSubtotal: subtotal,
        calculatedDiscount: discount,
        finalTotal: total,
        percentBudgetUsed: percent,
      };
    }, [card, checkedMap]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-3.5 w-full bg-linear-to-b from-card via-card to-muted/20 border border-violet-500/30 dark:border-violet-500/20 rounded-2xl p-4.5 shadow-md space-y-4"
    >
      {/* Title & Badge */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
            {card.theme ? `${card.theme.toUpperCase()} BUNDLE` : "CURATED BUNDLE"}
          </span>
          <h3 className="text-base font-bold text-foreground mt-1.5">{card.title}</h3>
        </div>

        {card.coupon_code && (
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 px-2.5 py-1 rounded-full">
              <Tag className="h-3 w-3" />
              {card.coupon_code}
            </span>
          </div>
        )}
      </div>

      {/* Budget Bar */}
      <div className="bg-muted/50 rounded-xl p-3 border border-border/60 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-muted-foreground">Target Budget Tracker:</span>
          <span className="text-foreground font-bold">
            ${(finalTotal / 100).toFixed(2)} / ${(card.budget_cents / 100).toFixed(2)}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-border overflow-hidden">
          <motion.div
            className={`h-full rounded-full transition-all duration-300 ${
              percentBudgetUsed > 90
                ? "bg-amber-500"
                : "bg-linear-to-r from-violet-500 to-emerald-500"
            }`}
            style={{ width: `${percentBudgetUsed}%` }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground flex justify-between">
          <span>{percentBudgetUsed}% of budget used</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
            Under budget by ${((card.budget_cents - finalTotal) / 100).toFixed(2)}
          </span>
        </p>
      </div>

      {/* Item Checklist */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground px-0.5">
          <span>Bundle Items ({checkedItems.length} of {card.items.length} selected):</span>
          <span className="text-[11px] text-violet-600 dark:text-violet-400">Click to toggle</span>
        </div>

        {card.items.map((item) => {
          const isChecked = checkedMap[item.id] !== false;
          const imageSrc = item.images?.[0] || "/icons8-image-100.png";

          return (
            <div
              key={item.id}
              onClick={() => onToggleItem(item.id)}
              className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                isChecked
                  ? "bg-card border-border hover:border-violet-500/40 shadow-2xs"
                  : "bg-muted/30 border-dashed border-border/60 opacity-50 hover:opacity-75"
              }`}
            >
              {/* Checkbox circle */}
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  isChecked
                    ? "bg-violet-600 text-white"
                    : "border border-border/80 bg-background"
                }`}
              >
                {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
              </div>

              {/* Item Thumbnail */}
              <div className="w-11 h-11 rounded-lg bg-muted/60 relative overflow-hidden border border-border/60 shrink-0">
                <Image
                  src={imageSrc}
                  alt={item.name}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>

              {/* Item Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-foreground truncate">{item.name}</h4>
                <p className="text-[11px] text-muted-foreground truncate">
                  {item.brand || "ShopSwift"} • {item.sku || "IN-STOCK"}
                </p>
              </div>

              {/* Item Price */}
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-foreground">
                  ${(item.price / 100).toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Financial Summary */}
      <div className="pt-2 border-t border-border/60 space-y-1.5 text-xs">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal:</span>
          <span>${(currentSubtotal / 100).toFixed(2)}</span>
        </div>
        {calculatedDiscount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
            <span>Coupon Discount ({card.coupon_code}):</span>
            <span>-${(calculatedDiscount / 100).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between items-baseline pt-1 border-t border-border/40 font-bold text-sm text-foreground">
          <span>Bundle Total:</span>
          <span className="text-base text-violet-600 dark:text-violet-400">
            ${(finalTotal / 100).toFixed(2)}
          </span>
        </div>
      </div>

      {/* 1-Click Add To Cart Action */}
      <button
        onClick={onAddBundle}
        disabled={checkedItems.length === 0}
        className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-linear-to-r from-violet-600 via-indigo-600 to-rose-600 hover:from-violet-700 hover:to-rose-700 shadow-md shadow-violet-500/25 hover:shadow-lg hover:shadow-violet-500/35 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <ShoppingBag className="h-4 w-4" />
        Add All {checkedItems.length} Items to Cart (${(finalTotal / 100).toFixed(2)})
      </button>
    </motion.div>
  );
}
