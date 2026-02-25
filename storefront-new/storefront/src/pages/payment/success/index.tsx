/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Head from "next/head";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { API_ROUTES } from "@/pages/api/constants/apiRoutes";
import { axiosInstance } from "@/utils/axiosInstance";
import {
  Loader,
  ShoppingBag,
  XCircle,
  Shield,
  Lock,
  ThumbsUp,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface CartItem {
  id: string | number;
  name?: string;
  title?: string;
  price?: number;
  quantity?: number;
}

interface NormalizedItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function LoadingState() {
  return (
    <div className="min-h-[360px] flex flex-col items-center justify-center">
      <Loader className="h-14 w-14 text-blue-600 animate-spin" />
      <h2 className="mt-6 text-2xl font-semibold text-gray-900">
        Verifying your payment…
      </h2>
      <p className="mt-2 text-sm text-gray-500">This may take a few seconds.</p>
      <div className="mt-6 w-3/4 h-3 rounded-full bg-gray-200 animate-pulse" />
    </div>
  );
}

function AnimatedCheckmark() {
  return (
    <svg
      className="h-28 w-28 flex-shrink-0"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="60" cy="60" r="54" stroke="#D1FAE5" strokeWidth="12" />
      <path
        d="M34 62 L52 78 L86 42"
        stroke="#059669"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{
          strokeDasharray: 200,
          strokeDashoffset: 200,
          animation: "dash 0.9s ease-in-out forwards",
        }}
      />
      <style>{`@keyframes dash { to { stroke-dashoffset: 0; } }`}</style>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main content
// ---------------------------------------------------------------------------
function PaymentSuccessContent() {
  const { cart, clearCart } = useCart();
  const { user } = useUser();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState<string>("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [purchasedItems, setPurchasedItems] = useState<NormalizedItem[]>([]);
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [verifiedAt, setVerifiedAt] = useState<number | null>(null);

  // Stable ref so clearCart never triggers the verify effect
  const clearCartRef = useRef(clearCart);
  useEffect(() => {
    clearCartRef.current = clearCart;
  }, [clearCart]);

  // 1. Extract session_id from URL once
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSessionId(params.get("session_id"));
  }, []);

  // 2. Verify payment when sessionId is ready
  useEffect(() => {
    if (sessionId === null) return; // still waiting for URL parse

    if (!sessionId) {
      setStatus("error");
      setMessage("No payment session ID was found. Please contact support.");
      return;
    }

    let mounted = true;

    (async () => {
      try {
        const resp = await axiosInstance.post(
          API_ROUTES.PAYMENT.VERIFY,
          { session_id: sessionId, payment_id: sessionId },
          { withCredentials: true },
        );

        if (!mounted) return;
        const data = resp.data ?? {};

        const paid =
          data.payment_status === "paid" || data.payment_status === "succeeded";

        const resolvedOrderId = data.order_id ?? data.session_id ?? sessionId;
        setOrderId(resolvedOrderId);
        setVerifiedAt(Date.now());

        // Normalize items — prefer backend response, fall back to cart snapshot
        const rawItems: any[] =
          data.items || data.line_items || data.order?.items || null;

        let normalized: NormalizedItem[];

        if (Array.isArray(rawItems) && rawItems.length > 0) {
          normalized = rawItems.map((it: any, idx: number) => ({
            id: String(it.id ?? it.product_id ?? it.sku ?? idx),
            name: it.name ?? it.title ?? it.product_name ?? "Product",
            price: Number(it.price ?? it.unit_price ?? it.amount ?? 0),
            quantity: Number(it.quantity ?? it.qty ?? 1),
          }));
        } else {
          normalized = (cart ?? []).map((it: CartItem, idx: number) => ({
            id: String(it.id ?? idx),
            name: it.name ?? it.title ?? "Product",
            price: Number(it.price ?? 0),
            quantity: Number(it.quantity ?? 1),
          }));
        }

        const computedTotal = normalized.reduce(
          (sum, it) => sum + it.price * it.quantity,
          0,
        );

        const backendTotal =
          data.total ?? data.amount ?? data.order?.total ?? data.order?.amount;

        setPurchasedItems(normalized);
        setOrderTotal(
          backendTotal != null ? Number(backendTotal) : computedTotal,
        );

        if (paid) {
          setStatus("success");
          setMessage(data.message || "Your payment was successful!");

          // Fire confetti (optional dependency — silently skipped if absent)
          try {
            const mod = await import("canvas-confetti");
            const confetti = (mod as any).default ?? mod;
            confetti?.({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
          } catch {
            // package not installed — that's fine
          }

          clearCartRef.current();
        } else {
          setStatus("error");
          setMessage(data.message || "Payment verification failed.");
        }
      } catch (err: any) {
        if (!mounted) return;
        setStatus("error");
        setMessage(
          err?.response?.data?.error ??
            "An error occurred during verification.",
        );
      }
    })();

    return () => {
      mounted = false;
    };
  }, [sessionId]); // clearCart intentionally excluded via ref

  // Truncate order ID for display
  const truncatedId = useMemo(() => {
    const id = orderId ?? sessionId ?? "";
    if (!id) return "—";
    return id.length > 12 ? `${id.slice(0, 8)}…${id.slice(-4)}` : id;
  }, [orderId, sessionId]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  if (status === "loading") return <LoadingState />;

  if (status === "error") {
    return (
      <div className="flex flex-col items-center text-center py-8">
        <XCircle className="h-16 w-16 text-red-500" />
        <h2 className="mt-6 text-3xl font-bold text-gray-900">
          Payment Failed
        </h2>
        <p className="mt-3 text-lg text-gray-700">{message}</p>
        <p className="mt-2 text-sm text-gray-500">You have not been charged.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/cart"
            className="inline-flex items-center justify-center px-5 py-3 bg-gray-700 text-white rounded-md shadow-sm hover:bg-gray-800 transition-colors"
          >
            Back to Cart
          </Link>
          <a
            href="mailto:support@shopswift.example"
            className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 rounded-md text-sm text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  // success
  return (
    <div className="flex flex-col gap-8">
      {/* Header row */}
      <div className="flex items-center gap-5">
        <AnimatedCheckmark />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Payment Successful!
          </h1>
          <p className="text-gray-500 mt-1">{message}</p>
          {user?.email && (
            <p className="text-sm text-gray-400 mt-1">
              A confirmation email has been sent to{" "}
              <span className="font-medium text-gray-600">{user.email}</span>.
            </p>
          )}
        </div>
      </div>

      {/* Two-column detail grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left — Order summary */}
        <section className="space-y-4">
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Order Summary
            </h3>

            <dl className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <dt className="font-medium text-gray-700">Order ID</dt>
                <dd className="font-mono">{truncatedId}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-700">Date</dt>
                <dd>
                  {verifiedAt ? new Date(verifiedAt).toLocaleString() : "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-700">
                  Estimated Delivery
                </dt>
                <dd>3–5 business days</dd>
              </div>
            </dl>

            {/* Items list */}
            <div className="mt-5 border-t border-gray-200 pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Items
              </h4>
              {purchasedItems.length > 0 ? (
                <ul className="space-y-2">
                  {purchasedItems.map((it) => (
                    <li
                      key={it.id}
                      className="flex justify-between text-sm text-gray-600"
                    >
                      <span className="truncate max-w-[180px]">
                        {it.name}{" "}
                        <span className="text-gray-400">x{it.quantity}</span>
                      </span>
                      <span className="font-medium text-gray-800 ml-2">
                        £{(it.price * it.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">No items to display.</p>
              )}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3">
            <a
              href="#"
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-rose-600 to-amber-500 text-white text-sm font-medium rounded-md shadow hover:opacity-90 transition-opacity"
            >
              Download Receipt
            </a>
            <Link
              href="/orders"
              className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Track Order
            </Link>
          </div>
        </section>

        {/* Right — Payment details + Trust badges */}
        <aside className="space-y-4">
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-5">
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Payment Details
            </h4>
            <dl className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <dt className="font-medium text-gray-700">Email</dt>
                <dd className="truncate max-w-[180px]">{user?.email ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-700">Payment Method</dt>
                <dd>Card</dd>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3 mt-3">
                <dt className="font-semibold text-gray-800">Total</dt>
                <dd className="font-semibold text-gray-900">
                  £{orderTotal.toFixed(2)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-lg p-5">
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Security &amp; Trust
            </h4>
            <ul className="mt-4 space-y-3">
              {[
                { Icon: Shield, label: "Secured by Stripe" },
                { Icon: Lock, label: "256-bit SSL Encryption" },
                { Icon: ThumbsUp, label: "Satisfaction Guaranteed" },
              ].map(({ Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 text-sm text-gray-600"
                >
                  <Icon className="h-5 w-5 text-rose-600 flex-shrink-0" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Footer action */}
      <div className="flex justify-end pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition-colors"
        >
          <ShoppingBag className="h-5 w-5" />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function PaymentSuccessPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>ShopSwift | Payment Confirmed</title>
        <meta
          name="description"
          content="Your payment confirmation and order summary."
        />
        <link rel="canonical" href={`${siteUrl}/payment/success`} />
        <meta property="og:title" content="ShopSwift | Payment Confirmed" />
        <meta
          property="og:description"
          content="Your payment confirmation and order summary."
        />
        <meta property="og:url" content={`${siteUrl}/payment/success`} />
      </Head>

      <Header />

      <main className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <Suspense fallback={<LoadingState />}>
            <PaymentSuccessContent />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
