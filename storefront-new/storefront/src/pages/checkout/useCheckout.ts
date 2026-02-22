import { CartItem } from "@/context/CartContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { API_ROUTES } from "@/pages/api/constants/apiRoutes";
import { axiosInstance } from "@/utils/axiosInstance";
import { useCallback, useEffect, useRef, useState } from "react";
import { STEP_META } from "./checkoutConstants";
import { FieldError, ShippingDetails, StepId } from "./checkoutTypes";
import {
  debounce,
  formatGBP,
  validateField,
} from "./checkoutUtils";

/** Polls the payment API until a checkout URL is available or attempt limit is reached. */
async function pollForPaymentUrl(id: string): Promise<string> {
  const maxAttempts = 5;
  let attempts = 0;
  let delay = 1000;

  while (attempts < maxAttempts) {
    try {
      const res = await axiosInstance.get(API_ROUTES.PAYMENT.STATUS_BY_ORDER(id));
      const { status, checkout_url } = res.data;
      if (status === "URL_READY" && checkout_url) return checkout_url;
      if (status === "FAILED") throw new Error("Payment failed during processing.");
    } catch {
      // swallow poll errors; retry loop handles it
    }
    attempts++;
    await new Promise((resolve) => setTimeout(resolve, delay));
    delay *= 2;
  }

  throw new Error("Payment link took too long to generate. Please try again.");
}

export interface CheckoutState {
  cart: CartItem[];
  currentStep: StepId;
  direction: 1 | -1;
  shippingMethod: string;
  shippingDetails: ShippingDetails;
  touched: Record<string, boolean>;
  fieldErrors: FieldError;
  promoCode: string;
  discount: number;
  promoExpanded: boolean;
  promoError: string;
  isProcessing: boolean;
  showMobileSummary: boolean;
  editingSection: StepId | null;
  // computed
  subtotal: number;
  shipping: number;
  tax: number;
  discountAmount: number;
  total: number;
  itemCount: number;
  ctaLabel: string;
  // setters
  setShippingMethod: (v: string) => void;
  setPromoCode: (v: string) => void;
  setPromoExpanded: (v: boolean) => void;
  setShowMobileSummary: (v: boolean) => void;
  setEditingSection: (v: StepId | null) => void;
  // handlers
  handleChange: (name: keyof ShippingDetails, value: string) => void;
  handleBlur: (name: keyof ShippingDetails) => void;
  validateStep: (step: StepId) => boolean;
  isStepValid: (step: StepId) => boolean;
  goToStep: (step: StepId) => void;
  goNext: () => void;
  goBack: () => void;
  applyPromo: () => void;
  completeOrder: () => Promise<void>;
}

export function useCheckout(): CheckoutState {
  const { cart } = useCart();
  const { showError, showSuccess } = useToast();
  const pollIntervalRef = useRef<number | null>(null);

  const [currentStep, setCurrentStep] = useState<StepId>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    email: "", phone: "", firstName: "", lastName: "",
    address: "", city: "", state: "", zipCode: "", country: "",
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

  // Computed values
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = shippingMethod === "express" ? 15.99 : 5.99;
  const tax = subtotal * 0.08;
  const discountAmount = subtotal * discount;
  const total = subtotal + shipping + tax - discountAmount;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const ctaLabel = (() => {
    switch (currentStep) {
      case 1: return "Continue to Shipping";
      case 2: return "Continue to Delivery";
      case 3: return "Review Order";
      case 4: return `Pay ${formatGBP(total)}`;
      default: return "Continue";
    }
  })();

  // Persist draft
  useEffect(() => {
    const saveDraft = debounce(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "checkout_draft",
          JSON.stringify({ shippingDetails, shippingMethod, currentStep }),
        );
      }
    }, 2000);
    saveDraft();
    return () => saveDraft.cancel();
  }, [shippingDetails, shippingMethod, currentStep]);

  // Restore draft on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const draft = localStorage.getItem("checkout_draft");
    if (!draft) return;
    try {
      const parsed = JSON.parse(draft);
      if (parsed.shippingDetails) setShippingDetails(parsed.shippingDetails);
      if (parsed.shippingMethod) setShippingMethod(parsed.shippingMethod);
    } catch { /* ignore corrupt data */ }
  }, []);

  // Cleanup poll interval on unmount
  useEffect(() => {
    const ref = pollIntervalRef;
    return () => {
      if (ref.current !== null) window.clearInterval(ref.current);
    };
  }, []);

  const handleChange = useCallback(
    (name: keyof ShippingDetails, value: string) => {
      setShippingDetails((prev) => ({ ...prev, [name]: value }));
      if (touched[name]) {
        setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
      }
    },
    [touched],
  );

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

  const validateStep = useCallback(
    (step: StepId): boolean => {
      let fields: (keyof ShippingDetails)[] = [];
      if (step === 1) fields = ["email", "phone"];
      else if (step === 2) fields = ["firstName", "lastName", "address", "city", "state", "zipCode"];
      else return true;

      const newErrors: FieldError = {};
      const newTouched: Record<string, boolean> = {};
      let valid = true;
      for (const f of fields) {
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

  const isStepValid = useCallback(
    (step: StepId): boolean => {
      let fields: (keyof ShippingDetails)[] = [];
      if (step === 1) fields = ["email", "phone"];
      else if (step === 2) fields = ["firstName", "lastName", "address", "city", "state", "zipCode"];
      else return true;
      return fields.every((f) => {
        const v = shippingDetails[f].trim();
        return v.length > 0 && !validateField(f, v);
      });
    },
    [shippingDetails],
  );

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
      const firstInput = document.querySelector(`[data-step="${step}"] input`) as HTMLElement | null;
      firstInput?.focus();
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

  const applyPromo = useCallback(() => {
    if (!promoCode.trim()) { setPromoError("Enter a promo code"); return; }
    if (promoCode.trim().toUpperCase() === "SAVE10") {
      setDiscount(0.1);
      setPromoError("");
      showSuccess("Promo applied — 10% off!");
    } else {
      setDiscount(0);
      setPromoError("Invalid promo code");
    }
  }, [promoCode, showSuccess]);

  const completeOrder = useCallback(async () => {
    if (cart.length === 0) { showError("Your cart is empty"); return; }
    if (!validateStep(1) || !validateStep(2)) {
      showError("Please complete all required details");
      return;
    }
    setIsProcessing(true);
    try {
      const addRes = await axiosInstance.post(API_ROUTES.CART.ADD, {
        items: cart.map((item) => ({ product_id: item.id, quantity: item.quantity })),
      });
      if (addRes.status !== 200) {
        showError("Failed to update cart. Please try again.");
        return;
      }
      const checkoutRes = await axiosInstance.post(API_ROUTES.CART.CHECKOUT, {});
      if (checkoutRes.status !== 200 || !checkoutRes.data.order_id) {
        showError("Failed to initiate checkout. Please try again.");
        return;
      }
      const checkoutUrl = await pollForPaymentUrl(checkoutRes.data.order_id);
      localStorage.removeItem("checkout_draft");
      showSuccess("Redirecting to secure payment…");
      window.location.href = checkoutUrl;
    } catch (error: unknown) {
      showError(
        error instanceof Error ? error.message : "Something went wrong. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  }, [cart, showError, showSuccess, validateStep]);

  return {
    cart, currentStep, direction, shippingMethod, shippingDetails,
    touched, fieldErrors, promoCode, discount, promoExpanded, promoError,
    isProcessing, showMobileSummary, editingSection,
    subtotal, shipping, tax, discountAmount, total, itemCount, ctaLabel,
    setShippingMethod, setPromoCode, setPromoExpanded,
    setShowMobileSummary, setEditingSection,
    handleChange, handleBlur, validateStep, isStepValid,
    goToStep, goNext, goBack, applyPromo, completeOrder,
  };
}
