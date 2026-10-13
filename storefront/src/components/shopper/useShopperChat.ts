import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import type { ActionCard, BundleItem, Message } from "./types";

export function useShopperChat() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() => `shopper-${Date.now()}`);
  const [liveStatus, setLiveStatus] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "👋 Hi! I'm your AI Personal Shopper & Bundle Builder. Tell me your target budget or aesthetic, and I'll curate in-stock products with the highest stackable discounts!",
      timestamp: new Date(),
    },
  ]);
  const [checkedItemsMap, setCheckedItemsMap] = useState<Record<string, Record<string, boolean>>>({});

  const { addToCart } = useCart();

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

        let receivedContent = false;
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
              if (delta) receivedContent = true;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId ? { ...m, text: m.text + delta } : m
                )
              );
            } else if (eventType === "action_card") {
              const card = parsedData as unknown as ActionCard;
              receivedContent = true;
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
                receivedContent = true;
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

        if (receivedContent) {
          streamedSuccessfully = true;
        } else {
          setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
        }
      }
    } catch (streamErr) {
      console.warn("[shopper] Streaming attempt failed, falling back to sync query:", streamErr);
      setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
      streamedSuccessfully = false;
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

  return {
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
  };
}

