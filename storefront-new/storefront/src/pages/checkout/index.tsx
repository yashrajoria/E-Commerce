"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { API_ROUTES } from "@/pages/api/constants/apiRoutes";
import { axiosInstance } from "@/utils/axiosInstance";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CreditCard,
  Lock,
  Mail,
  MapPin,
  Package,
  Pencil,
  Phone,
  Shield,
  ShoppingBag,
  Tag,
  Truck,
  User,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Head from "next/head";

/* ─── Types ─── */
interface ShippingDetails {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

type StepId = 1 | 2 | 3 | 4;

interface FieldError {
  [key: string]: string;
}

/* ─── Validation helpers ─── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s()-]{7,18}$/;

function validateField(name: string, value: string): string {
  const v = value.trim();
  switch (name) {
    case "email":
      if (!v) return "We need this to send your order confirmation";
      if (!EMAIL_RE.test(v)) return "Please enter a valid email address";
      return "";
    case "phone":
      if (!v) return "We need this for delivery updates";
      if (!PHONE_RE.test(v)) return "Please enter a valid phone number";
      return "";
    case "firstName":
      if (!v) return "We need your first name to deliver your order";
      return "";
    case "lastName":
      if (!v) return "We need your last name to deliver your order";
      return "";
    case "address":
      if (!v) return "We need this to deliver your order";
      return "";
    case "city":
      if (!v) return "Please enter your city";
      return "";
    case "state":
      if (!v) return "Please enter your state or county";
      return "";
    case "zipCode":
      if (!v) return "Check your postcode format (e.g., SW1A 1AA)";
      return "";
    default:
      return "";
  }
}

/* ─── Delivery date estimation ─── */
function getDeliveryDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

/* ─── Animated checkmark ─── */
function CheckmarkIcon({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check className="h-3 w-3 text-white" strokeWidth={3} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Progress dots ─── */
function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div
      className="flex items-center gap-2"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Step ${current} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const isCompleted = current > step;
        const isCurrent = current === step;
        return (
          <div key={step} className="flex items-center gap-2">
            <motion.div
              className={`flex items-center justify-center rounded-full transition-all duration-300 ${
                isCompleted
                  ? "w-8 h-8 bg-gradient-to-r from-rose-600 to-amber-500"
                  : isCurrent
                    ? "w-8 h-8 bg-gradient-to-r from-rose-600 to-amber-500 ring-4 ring-rose-500/20"
                    : "w-8 h-8 bg-neutral-200 dark:bg-neutral-700"
              }`}
              layout
            >
              {isCompleted ? (
                <Check className="h-4 w-4 text-white" strokeWidth={3} />
              ) : (
                <span
                  className={`text-xs font-bold ${
                    isCurrent
                      ? "text-white"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  {step}
                </span>
              )}
            </motion.div>
            {step < total && (
              <div
                className={`w-8 sm:w-12 h-0.5 rounded-full transition-colors duration-300 ${
                  isCompleted
                    ? "bg-gradient-to-r from-rose-600 to-amber-500"
                    : "bg-neutral-200 dark:bg-neutral-700"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Step labels ─── */
const STEP_META: { id: StepId; label: string; icon: React.ElementType }[] = [
  { id: 1, label: "Contact", icon: Mail },
  { id: 2, label: "Shipping", icon: MapPin },
  { id: 3, label: "Delivery", icon: Truck },
  { id: 4, label: "Review", icon: CreditCard },
];

/* ─────────────────────────────────────────────
   Checkout Page Component
   ───────────────────────────────────────────── */
export default function CheckoutPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { cart } = useCart();
  const { showError, showSuccess } = useToast();
  const pollIntervalRef = useRef<number | null>(null);

  /* ── State ── */
  const [currentStep, setCurrentStep] = useState<StepId>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<FieldError>({});
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoExpanded, setPromoExpanded] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMobileSummary, setShowMobileSummary] = useState(false);
  const [editingSection, setEditingSection] = useState<StepId | null>(null);

  /* ── Format helpers ── */
  const formatGBP = (value?: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(value ?? 0);

  /* ── Totals ── */
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = shippingMethod === "express" ? 15.99 : 5.99;
  const tax = subtotal * 0.08;
  const discountAmount = subtotal * discount;
  const total = subtotal + shipping + tax - discountAmount;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  /* ── Auto-save to localStorage every 2s ── */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "checkout_draft",
          JSON.stringify({ shippingDetails, shippingMethod, currentStep }),
        );
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [shippingDetails, shippingMethod, currentStep]);

  // Restore draft on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const draft = localStorage.getItem("checkout_draft");
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          if (parsed.shippingDetails)
            setShippingDetails(parsed.shippingDetails);
          if (parsed.shippingMethod) setShippingMethod(parsed.shippingMethod);
        } catch {
          /* ignore corrupt data */
        }
      }
    }
  }, []);

  /* ── Cleanup polling on unmount ── */
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current !== null) {
        window.clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  /* ── Field change handler ── */
  const handleChange = useCallback(
    (name: keyof ShippingDetails, value: string) => {
      setShippingDetails((prev) => ({ ...prev, [name]: value }));
      if (touched[name]) {
        setFieldErrors((prev) => ({
          ...prev,
          [name]: validateField(name, value),
        }));
      }
    },
    [touched],
  );

  /* ── Blur handler — validate on leave ── */
  const handleBlur = useCallback(
    (name: keyof ShippingDetails) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      setFieldErrors((prev) => ({
        ...prev,
        [name]: validateField(name, shippingDetails[name]),
      }));
    },
    [shippingDetails],
  );

  /* ── Validate entire step ── */
  const validateStep = useCallback(
    (step: StepId): boolean => {
      let fieldsToValidate: (keyof ShippingDetails)[] = [];
      switch (step) {
        case 1:
          fieldsToValidate = ["email", "phone"];
          break;
        case 2:
          fieldsToValidate = [
            "firstName",
            "lastName",
            "address",
            "city",
            "state",
            "zipCode",
          ];
          break;
        case 3:
        case 4:
          return true;
      }
      const newErrors: FieldError = {};
      const newTouched: Record<string, boolean> = {};
      let valid = true;
      for (const f of fieldsToValidate) {
        const err = validateField(f, shippingDetails[f]);
        newErrors[f] = err;
        newTouched[f] = true;
        if (err) valid = false;
      }
      setFieldErrors((prev) => ({ ...prev, ...newErrors }));
      setTouched((prev) => ({ ...prev, ...newTouched }));
      return valid;
    },
    [shippingDetails],
  );

  /* ── Is current step valid? (for enabling CTA) ── */
  const isStepValid = useCallback(
    (step: StepId): boolean => {
      let fields: (keyof ShippingDetails)[] = [];
      switch (step) {
        case 1:
          fields = ["email", "phone"];
          break;
        case 2:
          fields = [
            "firstName",
            "lastName",
            "address",
            "city",
            "state",
            "zipCode",
          ];
          break;
        case 3:
        case 4:
          return true;
      }
      return fields.every((f) => {
        const v = shippingDetails[f].trim();
        return v.length > 0 && !validateField(f, v);
      });
    },
    [shippingDetails],
  );

  /* ── Navigate steps ── */
  const goToStep = useCallback(
    (step: StepId) => {
      setDirection(step > currentStep ? 1 : -1);
      setCurrentStep(step);
      setEditingSection(null);
      const label = STEP_META.find((s) => s.id === step)?.label;
      if (label) {
        const el = document.getElementById("sr-step-announce");
        if (el) el.textContent = `Step ${step} of 4: ${label}`;
      }
    },
    [currentStep],
  );

  const goNext = useCallback(() => {
    if (!validateStep(currentStep)) {
      showError("Please complete all required fields");
      return;
    }
    if (currentStep < 4) goToStep((currentStep + 1) as StepId);
  }, [currentStep, validateStep, goToStep, showError]);

  const goBack = useCallback(() => {
    if (currentStep > 1) goToStep((currentStep - 1) as StepId);
  }, [currentStep, goToStep]);

  /* ── Promo code ── */
  const applyPromo = useCallback(() => {
    if (!promoCode.trim()) {
      setPromoError("Enter a promo code");
      return;
    }
    if (promoCode.trim().toUpperCase() === "SAVE10") {
      setDiscount(0.1);
      setPromoError("");
      showSuccess("Promo applied — 10% off!");
    } else {
      setDiscount(0);
      setPromoError("Invalid promo code");
    }
  }, [promoCode, showSuccess]);

  /* ── Place order (existing API logic) ── */
  const completeOrder = useCallback(async () => {
    if (cart.length === 0) {
      showError("Your cart is empty");
      return;
    }
    if (!validateStep(1) || !validateStep(2)) {
      showError("Please complete all required details");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Add items
      const addRes = await axiosInstance.post(API_ROUTES.CART.ADD, {
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      });
      if (addRes.status !== 200) {
        showError("Failed to update cart. Please try again.");
        setIsProcessing(false);
        return;
      }

      // 2. Checkout
      const checkoutRes = await axiosInstance.post(
        API_ROUTES.CART.CHECKOUT,
        {},
      );
      if (checkoutRes.status !== 200 || !checkoutRes.data.order_id) {
        showError("Failed to initiate checkout. Please try again.");
        setIsProcessing(false);
        return;
      }

      const orderId = checkoutRes.data.order_id;

      // 3. Poll for payment URL
      const pollForPaymentUrl = (id: string): Promise<string | null> => {
        const maxAttempts = 20;
        let attempts = 0;
        return new Promise<string | null>((resolve, reject) => {
          pollIntervalRef.current = window.setInterval(async () => {
            if (attempts >= maxAttempts) {
              if (pollIntervalRef.current !== null) {
                window.clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
              }
              reject(
                new Error(
                  "Payment link took too long to generate. Please try again.",
                ),
              );
              return;
            }
            try {
              const res = await axiosInstance.get(
                API_ROUTES.PAYMENT.STATUS_BY_ORDER(id),
              );
              const { status, checkout_url } = res.data;
              if (status === "URL_READY" && checkout_url) {
                if (pollIntervalRef.current !== null) {
                  window.clearInterval(pollIntervalRef.current);
                  pollIntervalRef.current = null;
                }
                resolve(checkout_url);
              } else if (status === "FAILED") {
                if (pollIntervalRef.current !== null) {
                  window.clearInterval(pollIntervalRef.current);
                  pollIntervalRef.current = null;
                }
                reject(new Error("Payment failed during processing."));
              } else {
                attempts++;
              }
            } catch {
              attempts++;
            }
          }, 5000);
        });
      };

      const checkoutUrl = await pollForPaymentUrl(orderId);
      if (checkoutUrl) {
        localStorage.removeItem("checkout_draft");
        showSuccess("Redirecting to secure payment…");
        window.location.href = checkoutUrl;
      }
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      showError(msg);
    } finally {
      setIsProcessing(false);
    }
  }, [cart, showError, showSuccess, validateStep]);

  /* ── Slide animation variants ── */
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 80 : -80,
      opacity: 0,
    }),
  };

  /* ── Floating input with icon ── */
  const FormField = ({
    name,
    label,
    icon: Icon,
    type = "text",
    autoComplete,
    inputMode,
    placeholder,
  }: {
    name: keyof ShippingDetails;
    label: string;
    icon: React.ElementType;
    type?: string;
    autoComplete?: string;
    inputMode?: "text" | "email" | "tel" | "numeric";
    placeholder?: string;
  }) => {
    const value = shippingDetails[name];
    const error = fieldErrors[name];
    const isTouched = touched[name];
    const isValid = isTouched && !error && value.trim().length > 0;

    return (
      <div className="space-y-1.5">
        <Label
          htmlFor={name}
          className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2"
        >
          <Icon className="h-4 w-4 text-rose-500" />
          {label}
        </Label>
        <div className="relative">
          <Input
            id={name}
            name={name}
            type={type}
            autoComplete={autoComplete}
            inputMode={inputMode}
            placeholder={placeholder ?? label}
            value={value}
            onChange={(e) => handleChange(name, e.target.value)}
            onBlur={() => handleBlur(name)}
            aria-label={label}
            aria-invalid={isTouched && !!error}
            aria-describedby={error ? `${name}-error` : undefined}
            className={`h-12 text-base pr-10 transition-all duration-200 rounded-xl border-neutral-200 dark:border-neutral-700 focus:border-rose-500 focus:ring-rose-500/20 ${
              isTouched && error
                ? "border-rose-500 ring-2 ring-rose-500/20"
                : isValid
                  ? "border-emerald-400 dark:border-emerald-600"
                  : ""
            }`}
          />
          <CheckmarkIcon visible={isValid} />
        </div>
        <AnimatePresence>
          {isTouched && error && (
            <motion.p
              id={`${name}-error`}
              role="alert"
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              className="text-sm text-rose-600 dark:text-rose-400"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  };

  /* ── Completed section summary card ── */
  const CompletedCard = ({
    step,
    title,
    summary,
  }: {
    step: StepId;
    title: string;
    icon: React.ElementType;
    summary: React.ReactNode;
  }) => {
    const isEditing = editingSection === step;
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 mb-4"
      >
        <button
          onClick={() => {
            if (isEditing) {
              setEditingSection(null);
            } else {
              setEditingSection(step);
            }
          }}
          className="w-full flex items-center justify-between text-left"
          aria-expanded={isEditing}
          aria-label={`Edit ${title}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
              <Check className="h-4 w-4 text-white" strokeWidth={3} />
            </div>
            <div>
              <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                {title}
              </p>
              {!isEditing && (
                <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                  {summary}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 text-sm font-medium">
            <Pencil className="h-3.5 w-3.5" />
            <span>{isEditing ? "Close" : "Edit"}</span>
          </div>
        </button>
      </motion.div>
    );
  };

  /* ── CTA Label ── */
  const ctaLabel = (() => {
    switch (currentStep) {
      case 1:
        return "Continue to Shipping";
      case 2:
        return "Continue to Delivery";
      case 3:
        return "Review Order";
      case 4:
        return `Pay ${formatGBP(total)}`;
      default:
        return "Continue";
    }
  })();

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-amber-50/30 to-rose-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <Head>
        <title>Secure Checkout | ShopSwift</title>
        <meta
          name="description"
          content="Complete your order with our secure checkout."
        />
        <link rel="canonical" href={`${siteUrl}/checkout`} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>

      {/* Screen reader live region */}
      <div
        id="sr-step-announce"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-800/50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => (currentStep > 1 ? goBack() : window.history.back())}
            className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors min-h-[48px] min-w-[48px] justify-center rounded-xl"
            aria-label={currentStep > 1 ? "Go to previous step" : "Go back"}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium hidden sm:inline">Back</span>
          </button>

          <div className="flex flex-col items-center">
            <ProgressDots current={currentStep} total={4} />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 font-medium">
              Step {currentStep} of 4 — {STEP_META[currentStep - 1].label}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 min-h-[48px]">
            <Lock className="h-4 w-4" />
            <span className="text-xs font-semibold hidden sm:inline">
              Secure
            </span>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-3xl mx-auto px-4 pt-6 pb-36">
        {/* ── Express Checkout — visible on step 1 ── */}
        {currentStep === 1 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
            aria-label="Express checkout"
          >
            <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 text-center mb-4">
                Express Checkout
              </h2>
              <div className="flex gap-3">
                <button
                  className="flex-1 h-12 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
                  aria-label="Pay with Apple Pay"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.52-3.23 0-1.44.62-2.2.44-3.06-.4C4.24 16.7 4.89 10.5 8.6 10.3c1.24.06 2.1.72 2.82.76.96-.2 1.88-.9 2.93-.82 1.26.1 2.2.62 2.82 1.56-2.58 1.56-1.97 4.98.37 5.93-.47 1.2-.86 2.02-1.49 2.55ZM12.06 10.24c-.12-2.16 1.62-3.96 3.6-4.12.24 2.36-2.16 4.2-3.6 4.12z" />
                  </svg>
                  Apple Pay
                </button>
                <button
                  className="flex-1 h-12 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold text-sm flex items-center justify-center gap-2 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 active:scale-[0.98] transition-all"
                  aria-label="Pay with Google Pay"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google Pay
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white dark:bg-neutral-900 px-4 text-sm text-neutral-500 dark:text-neutral-400">
                    or continue with details below
                  </span>
                </div>
              </div>

              <p className="text-xs text-center text-neutral-400 dark:text-neutral-500">
                Your payment information is always encrypted &amp; secure
              </p>
            </div>
          </motion.section>
        )}

        {/* ── Completed section summaries ── */}
        <AnimatePresence>
          {currentStep > 1 && (
            <CompletedCard
              step={1}
              title="Contact"
              icon={Mail}
              summary={
                <span>
                  {shippingDetails.email} · {shippingDetails.phone}
                </span>
              }
            />
          )}
          {currentStep > 2 && (
            <CompletedCard
              step={2}
              title="Shipping Address"
              icon={MapPin}
              summary={
                <span>
                  {shippingDetails.firstName} {shippingDetails.lastName},{" "}
                  {shippingDetails.address}, {shippingDetails.city}
                </span>
              }
            />
          )}
          {currentStep > 3 && (
            <CompletedCard
              step={3}
              title="Delivery"
              icon={Truck}
              summary={
                <span>
                  {shippingMethod === "express"
                    ? "Express (2–3 days)"
                    : "Standard (5–7 days)"}{" "}
                  — {formatGBP(shipping)}
                </span>
              }
            />
          )}
        </AnimatePresence>

        {/* ── Inline edit panels for completed sections ── */}
        <AnimatePresence>
          {editingSection === 1 && (
            <motion.div
              key="edit-contact"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
                <FormField
                  name="email"
                  label="Email Address"
                  icon={Mail}
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                />
                <FormField
                  name="phone"
                  label="Phone Number"
                  icon={Phone}
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      if (validateStep(1)) setEditingSection(null);
                    }}
                    className="bg-gradient-to-r from-rose-600 to-amber-500 text-white rounded-xl h-10"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
          {editingSection === 2 && (
            <motion.div
              key="edit-shipping"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    name="firstName"
                    label="First Name"
                    icon={User}
                    autoComplete="given-name"
                  />
                  <FormField
                    name="lastName"
                    label="Last Name"
                    icon={User}
                    autoComplete="family-name"
                  />
                </div>
                <FormField
                  name="address"
                  label="Street Address"
                  icon={MapPin}
                  autoComplete="address-line1"
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <FormField
                    name="city"
                    label="City"
                    icon={MapPin}
                    autoComplete="address-level2"
                  />
                  <FormField
                    name="state"
                    label="State / County"
                    icon={MapPin}
                    autoComplete="address-level1"
                  />
                  <FormField
                    name="zipCode"
                    label="Postcode"
                    icon={MapPin}
                    autoComplete="postal-code"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      if (validateStep(2)) setEditingSection(null);
                    }}
                    className="bg-gradient-to-r from-rose-600 to-amber-500 text-white rounded-xl h-10"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
          {editingSection === 3 && (
            <motion.div
              key="edit-delivery"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6">
                <div className="space-y-3">
                  {[
                    {
                      id: "standard",
                      label: "Standard Shipping",
                      time: "5–7 business days",
                      sub: "Tracked delivery",
                      price: 5.99,
                      days: 7,
                    },
                    {
                      id: "express",
                      label: "Express Shipping",
                      time: "2–3 business days",
                      sub: "Next-day for orders before 2pm",
                      price: 15.99,
                      days: 3,
                    },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setShippingMethod(opt.id)}
                      className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                        shippingMethod === opt.id
                          ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20"
                          : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">{opt.label}</p>
                          <p className="text-xs text-neutral-500">{opt.time}</p>
                        </div>
                        <p className="font-bold text-sm">
                          {formatGBP(opt.price)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={() => setEditingSection(null)}
                    className="bg-gradient-to-r from-rose-600 to-amber-500 text-white rounded-xl h-10"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Step Cards with slide animation ── */}
        <AnimatePresence mode="wait" custom={direction}>
          {/* ── STEP 1: Contact Info ── */}
          {currentStep === 1 && (
            <motion.section
              key="step-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm"
              aria-label="Step 1: Contact Information"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-amber-500 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gradient-premium">
                      Contact Information
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      How can we reach you about your order?
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <FormField
                    name="email"
                    label="Email Address"
                    icon={Mail}
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@example.com"
                  />
                  <FormField
                    name="phone"
                    label="Phone Number"
                    icon={Phone}
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+44 7700 900000"
                  />
                </div>
              </div>
            </motion.section>
          )}

          {/* ── STEP 2: Shipping Address ── */}
          {currentStep === 2 && (
            <motion.section
              key="step-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm"
              aria-label="Step 2: Shipping Address"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-amber-500 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gradient-premium">
                      Shipping Address
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      name="firstName"
                      label="First Name"
                      icon={User}
                      autoComplete="given-name"
                      placeholder="Jane"
                    />
                    <FormField
                      name="lastName"
                      label="Last Name"
                      icon={User}
                      autoComplete="family-name"
                      placeholder="Smith"
                    />
                  </div>
                  <FormField
                    name="address"
                    label="Street Address"
                    icon={MapPin}
                    autoComplete="address-line1"
                    placeholder="123 High Street"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <FormField
                      name="city"
                      label="City"
                      icon={MapPin}
                      autoComplete="address-level2"
                      placeholder="London"
                    />
                    <FormField
                      name="state"
                      label="State / County"
                      icon={MapPin}
                      autoComplete="address-level1"
                      placeholder="Greater London"
                    />
                    <FormField
                      name="zipCode"
                      label="Postcode"
                      icon={MapPin}
                      autoComplete="postal-code"
                      placeholder="SW1A 1AA"
                    />
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* ── STEP 3: Delivery Method ── */}
          {currentStep === 3 && (
            <motion.section
              key="step-3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm"
              aria-label="Step 3: Delivery Method"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-amber-500 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gradient-premium">
                      Delivery Method
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Choose how you&apos;d like to receive your order
                    </p>
                  </div>
                </div>

                <div
                  className="space-y-3"
                  role="radiogroup"
                  aria-label="Delivery options"
                >
                  {[
                    {
                      id: "standard",
                      label: "Standard Shipping",
                      time: "5–7 business days",
                      sub: "Tracked delivery",
                      price: 5.99,
                      days: 7,
                    },
                    {
                      id: "express",
                      label: "Express Shipping",
                      time: "2–3 business days",
                      sub: "Next-day for orders before 2pm",
                      price: 15.99,
                      days: 3,
                      badge: "Popular",
                    },
                  ].map((opt) => {
                    const isSelected = shippingMethod === opt.id;
                    return (
                      <motion.button
                        key={opt.id}
                        onClick={() => setShippingMethod(opt.id)}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full text-left rounded-2xl border-2 p-5 transition-all duration-200 min-h-[80px] ${
                          isSelected
                            ? "border-rose-500 bg-gradient-to-r from-rose-50 to-amber-50 dark:from-rose-950/30 dark:to-amber-950/20 shadow-md shadow-rose-500/10"
                            : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900"
                        }`}
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`${opt.label} - ${opt.time} - ${formatGBP(opt.price)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? "border-rose-500 bg-rose-500"
                                  : "border-neutral-300 dark:border-neutral-600"
                              }`}
                            >
                              {isSelected && (
                                <Check
                                  className="h-3 w-3 text-white"
                                  strokeWidth={3}
                                />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                                  {opt.label}
                                </p>
                                {opt.badge && (
                                  <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-rose-600 to-amber-500 text-white rounded-full">
                                    {opt.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                                {opt.sub}
                              </p>
                              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-medium">
                                Arrives by {getDeliveryDate(opt.days)}
                              </p>
                            </div>
                          </div>
                          <p className="font-bold text-lg text-neutral-900 dark:text-neutral-100 shrink-0 ml-4">
                            {formatGBP(opt.price)}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.section>
          )}

          {/* ── STEP 4: Review & Pay ── */}
          {currentStep === 4 && (
            <motion.section
              key="step-4"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="space-y-4"
              aria-label="Step 4: Review and Payment"
            >
              {/* ── Order items ── */}
              <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-amber-500 flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gradient-premium">
                    Order Summary
                  </h2>
                </div>

                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50"
                    >
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-700">
                        <Image
                          src={item.images?.[0] || "/icons8-image-100.png"}
                          alt={item.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-neutral-900 dark:text-neutral-100 truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 shrink-0">
                        {formatGBP(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Promo code — expandable */}
                <div className="mt-6">
                  <button
                    onClick={() => setPromoExpanded(!promoExpanded)}
                    className="flex items-center gap-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
                    aria-expanded={promoExpanded}
                  >
                    <Tag className="h-4 w-4" />
                    Have a promo code?
                    {promoExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  <AnimatePresence>
                    {promoExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex gap-2 mt-3">
                          <Input
                            placeholder="Enter code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") applyPromo();
                            }}
                            className="h-10 rounded-xl"
                            aria-label="Promo code"
                          />
                          <Button
                            onClick={applyPromo}
                            variant="outline"
                            className="h-10 rounded-xl px-5 shrink-0"
                          >
                            Apply
                          </Button>
                        </div>
                        {promoError && (
                          <p className="text-sm text-rose-600 dark:text-rose-400 mt-2">
                            {promoError}
                          </p>
                        )}
                        {discount > 0 && (
                          <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                            SAVE10 applied — 10% discount!
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── Pricing breakdown ── */}
                <Separator className="my-6" />
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
                    <span>Subtotal</span>
                    <span>{formatGBP(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
                    <span>
                      Shipping (
                      {shippingMethod === "express" ? "Express" : "Standard"})
                    </span>
                    <span>{formatGBP(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
                    <span>Tax</span>
                    <span>{formatGBP(tax)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>Discount (10%)</span>
                      <span>-{formatGBP(discountAmount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg pt-1">
                    <span className="text-neutral-900 dark:text-neutral-100">
                      Total
                    </span>
                    <span className="text-gradient-premium">
                      {formatGBP(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Trust signals ── */}
              <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        256-bit SSL
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Encryption
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        Free Returns
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Within 30 days
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        Secure Payment
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Data never stored
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment method logos */}
                <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  {["Visa", "Mastercard", "Amex"].map((brand) => (
                    <span
                      key={brand}
                      className="px-3 py-1.5 text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-lg"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── "Jump to Review" shortcut ── */}
        {currentStep < 4 && currentStep > 1 && isStepValid(1) && (
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                if (validateStep(currentStep)) {
                  goToStep(4);
                }
              }}
              className="text-sm text-rose-600 dark:text-rose-400 font-medium hover:underline inline-flex items-center gap-1"
            >
              Jump to Review
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </main>

      {/* ── Mobile Bottom Sheet: Order Summary ── */}
      <AnimatePresence>
        {showMobileSummary && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setShowMobileSummary(false)}
            />
            {/* Bottom sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto lg:hidden"
            >
              <div className="p-6">
                {/* Drag handle */}
                <div className="w-10 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600 mx-auto mb-4" />
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    Your Order ({itemCount} {itemCount === 1 ? "item" : "items"}
                    )
                  </h3>
                  <button
                    onClick={() => setShowMobileSummary(false)}
                    className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center"
                    aria-label="Close order summary"
                  >
                    <X className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </button>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-5">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-700">
                        <Image
                          src={item.images?.[0] || "/icons8-image-100.png"}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-neutral-900 dark:text-neutral-100">
                          {item.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 shrink-0">
                        {formatGBP(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="mb-4" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
                    <span>Subtotal</span>
                    <span>{formatGBP(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
                    <span>Shipping</span>
                    <span>{formatGBP(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
                    <span>Tax</span>
                    <span>{formatGBP(tax)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600 font-medium">
                      <span>Discount</span>
                      <span>-{formatGBP(discountAmount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg pt-1">
                    <span className="text-neutral-900 dark:text-neutral-100">
                      Total
                    </span>
                    <span className="text-gradient-premium">
                      {formatGBP(total)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Sticky Bottom CTA Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-200/50 dark:border-neutral-800/50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Mobile summary toggle */}
          <button
            onClick={() => setShowMobileSummary(true)}
            className="flex items-center gap-2 min-h-[48px] px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 shrink-0 lg:hidden"
            aria-label="View order summary"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{itemCount}</span>
            <ChevronUp className="h-3.5 w-3.5" />
          </button>

          {/* Total on desktop */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 shrink-0">
            <ShoppingBag className="h-4 w-4" />
            <span>
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
            <span className="font-bold text-neutral-900 dark:text-neutral-100">
              {formatGBP(total)}
            </span>
          </div>

          {/* CTA Button */}
          <motion.button
            onClick={currentStep === 4 ? completeOrder : goNext}
            disabled={isProcessing}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 h-[52px] rounded-xl font-semibold text-base text-white flex items-center justify-center gap-2 transition-all ${
              isProcessing
                ? "bg-neutral-400 cursor-not-allowed"
                : "bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 active:scale-[0.98]"
            }`}
            aria-label={ctaLabel}
          >
            {isProcessing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                Processing…
              </>
            ) : (
              <>
                {ctaLabel}
                {currentStep < 4 && <ChevronRight className="h-5 w-5" />}
                {currentStep === 4 && <Lock className="h-4 w-4" />}
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
