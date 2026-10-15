import { CartItem } from "@/context/CartContext";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { guestAuth } from "@/lib/auth";
import { API_ROUTES } from "@/pages/api/constants/apiRoutes";
import { axiosInstance } from "@/utils/axiosInstance";
import { getActiveStoreId } from "@ecommerce/shared";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { STEP_META } from "./checkoutConstants";
import { FieldError, ShippingDetails, StepId } from "./checkoutTypes";
import { debounce, formatGBP, validateField } from "./checkoutUtils";

/** Polls the payment API until a checkout URL is available or attempt limit is reached. */
async function pollForPaymentUrl(id: string): Promise<string> {
  const maxAttempts = 5;
  let attempts = 0;
  let delay = 1000;

  while (attempts < maxAttempts) {
    try {
      const res = await axiosInstance.get(
        API_ROUTES.PAYMENT.STATUS_BY_ORDER(id),
      );
      const { status, checkout_url } = res.data;
      const statusStr = typeof status === "string" ? status.toUpperCase() : "";
      const url =
        typeof checkout_url === "string" && checkout_url.trim().length > 0
          ? checkout_url.trim()
          : "";

      if (url) return url;
      if (statusStr === "SUCCEEDED" || statusStr === "PAID") {
        return `/payment/success?order_id=${encodeURIComponent(id)}&method=store_credit`;
      }
      // URL_READY without a URL is not success — keep polling.
      if (statusStr === "FAILED") {
        throw new Error("Payment failed during processing.");
      }
    } catch (err) {
      if (err instanceof Error && err.message.startsWith("Payment failed")) {
        throw err;
      }
      // swallow transient poll errors; retry loop handles it
    }
    attempts++;
    await new Promise((resolve) => setTimeout(resolve, delay));
    delay *= 2;
  }

  throw new Error("Payment link took too long to generate. Please try again.");
}

/** State and actions returned by {@link useCheckout}. */
export interface CheckoutState {
  /** Cart lines taken from the cart context. */
  cart: CartItem[];
  /** Active wizard step, from `1` (contact) to `4` (review). */
  currentStep: StepId;
  /** Slide direction of the most recent step transition. */
  direction: 1 | -1;
  /** Selected delivery method id, e.g. `"standard"` or `"express"`. */
  shippingMethod: string;
  /** Current values of every shipping field. */
  shippingDetails: ShippingDetails;
  /** Flags marking which fields the user has already interacted with. */
  touched: Record<string, boolean>;
  /** Validation messages keyed by field name. */
  fieldErrors: FieldError;
  /** Current promo code input value. */
  promoCode: string;
  /** Relative discount multiplier (0–1) applied to the subtotal. */
  discount: number;
  /** Whether the promo code field is expanded on the review step. */
  promoExpanded: boolean;
  /** Validation message for the promo code, if any. */
  promoError: string;
  /** True while the order is being submitted, used to disable the CTA. */
  isProcessing: boolean;
  /** Whether the mobile order summary sheet is open. */
  showMobileSummary: boolean;
  /** Section currently open in the inline edit panels, or `null`. */
  editingSection: StepId | null;
  /** Cart subtotal in major currency units (GBP). */
  subtotal: number;
  /** Shipping cost in major currency units, derived from {@link CheckoutState.shippingMethod}. */
  shipping: number;
  /** Estimated tax in major currency units (8% of the subtotal). */
  tax: number;
  /** Absolute discount amount in major currency units. */
  discountAmount: number;
  /** Order total before store credit, in major currency units. */
  grossTotal: number;
  /** Final total to pay after discounts and store credit. */
  total: number;
  /** Customer's available store credit in minor units (pence). */
  storeCreditBalance: number;
  /** Store credit selected for this order in minor units (pence). */
  storeCreditAmount: number;
  /**
   * Sets the store credit to apply in minor units.
   *
   * @param v - Credit amount in pence.
   */
  setStoreCreditAmount: (v: number) => void;
  /** Whether the user has chosen to apply store credit. */
  applyStoreCredit: boolean;
  /**
   * Toggles store credit for the order; enabling it seeds the maximum usable amount.
   *
   * @param v - Whether store credit should be applied.
   */
  setApplyStoreCredit: (v: boolean) => void;
  /** Store credit actually applied after clamping, in minor units (pence). */
  effectiveCreditAmount: number;
  /** Total number of units in the cart. */
  itemCount: number;
  /** Label for the primary CTA button, derived from the active step and total. */
  ctaLabel: string;
  /** Whether a signed-in user is completing the checkout. */
  isAuthenticated: boolean;
  /** Whether the login modal is open. */
  isLoginModalOpen: boolean;
  /**
   * Opens or closes the login modal.
   *
   * @param v - Whether the modal should be visible.
   */
  setIsLoginModalOpen: (v: boolean) => void;
  /**
   * Selects a delivery method.
   *
   * @param v - Delivery method id.
   */
  setShippingMethod: (v: string) => void;
  /**
   * Updates the promo code input value.
   *
   * @param v - New code.
   */
  setPromoCode: (v: string) => void;
  /**
   * Expands or collapses the promo code field.
   *
   * @param v - Whether the field should be shown.
   */
  setPromoExpanded: (v: boolean) => void;
  /**
   * Opens or closes the mobile order summary sheet.
   *
   * @param v - Whether the sheet should be visible.
   */
  setShowMobileSummary: (v: boolean) => void;
  /**
   * Sets the section open in the inline edit panels.
   *
   * @param v - Step id to edit, or `null` to close.
   */
  setEditingSection: (v: StepId | null) => void;
  /**
   * Updates one shipping field and re-validates it when already touched.
   *
   * @param name - Field to update.
   * @param value - New field value.
   */
  handleChange: (name: keyof ShippingDetails, value: string) => void;
  /**
   * Marks a field as touched and validates its current value.
   *
   * @param name - Field that lost focus.
   */
  handleBlur: (name: keyof ShippingDetails) => void;
  /**
   * Validates all fields of a step, recording errors and touched flags.
   *
   * @param step - Step to validate.
   */
  validateStep: (step: StepId) => boolean;
  /**
   * Checks whether a step's fields are valid without touching state.
   *
   * @param step - Step to check.
   */
  isStepValid: (step: StepId) => boolean;
  /**
   * Jumps to a step, closes edit panels and focuses its first input.
   *
   * @param step - Destination step.
   */
  goToStep: (step: StepId) => void;
  /** Advances one step after validating the current one. */
  goNext: () => void;
  /** Returns to the previous step. */
  goBack: () => void;
  /** Validates the promo code against the API and stores the resulting discount. */
  applyPromo: () => void;
  /** Creates the order (guest auth, cart sync, checkout and payment redirect). */
  completeOrder: () => Promise<void>;
}

/**
 * Drives the multi-step checkout wizard, from contact details through payment hand-off.
 *
 * @remarks
 * Client-side hook. It reads the cart and user from context, fetches the store-credit balance when the user is
 * authenticated, persists a debounced draft to `localStorage`, and on {@link CheckoutState.completeOrder} starts a
 * guest session if needed, syncs the cart, posts the checkout payload with an idempotency key and polls the payment
 * API for the redirect URL. Failures surface through toasts rather than thrown errors.
 *
 * @returns The {@link CheckoutState} object consumed by the checkout page and its step components.
 */
export function useCheckout(): CheckoutState {
  const { cart } = useCart();
  const { isAuthenticated, refetchUser } = useUser();
  const { showError, showSuccess } = useToast();
  const pollIntervalRef = useRef<number | null>(null);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
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
  const [storeCreditBalance, setStoreCreditBalance] = useState(0);
  const [storeCreditAmount, setStoreCreditAmount] = useState(0);
  const [applyStoreCredit, setApplyStoreCredit] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = shippingMethod === "express" ? 15.99 : 5.99;
  const tax = subtotal * 0.08;
  const discountAmount = subtotal * discount;
  const grossTotal = Math.max(0, subtotal + shipping + tax - discountAmount);
  const grossTotalMinor = Math.round(grossTotal * 100);

  const effectiveCreditAmount = applyStoreCredit
    ? Math.max(
        0,
        Math.min(storeCreditAmount, storeCreditBalance, grossTotalMinor),
      )
    : 0;
  const total = Math.max(0, (grossTotalMinor - effectiveCreditAmount) / 100);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const storeId = getActiveStoreId();
    if (!storeId || !isAuthenticated) {
      setStoreCreditBalance(0);
      return;
    }
    axiosInstance
      .get<{ available_amount?: number; balance?: number }>(
        API_ROUTES.STORE_CREDIT.BALANCE,
        { headers: { "X-Store-ID": storeId } },
      )
      .then((res) => {
        const avail = Number(
          res.data?.available_amount ?? res.data?.balance ?? 0,
        );
        setStoreCreditBalance(avail);
      })
      .catch(() => setStoreCreditBalance(0));
  }, [isAuthenticated]);

  const handleSetApplyStoreCredit = useCallback(
    (apply: boolean) => {
      setApplyStoreCredit(apply);
      if (apply && storeCreditAmount === 0 && storeCreditBalance > 0) {
        setStoreCreditAmount(Math.min(storeCreditBalance, grossTotalMinor));
      }
    },
    [grossTotalMinor, storeCreditAmount, storeCreditBalance],
  );

  const ctaLabel = (() => {
    switch (currentStep) {
      case 1:
        return "Continue to Shipping";
      case 2:
        return "Continue to Delivery";
      case 3:
        return "Review Order";
      case 4:
        return total <= 0 && effectiveCreditAmount > 0
          ? "Place Order with Store Credit"
          : `Pay ${formatGBP(total)}`;
      default:
        return "Continue";
    }
  })();

  const isDraftHydratedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const draft = localStorage.getItem("checkout_draft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.shippingDetails) setShippingDetails(parsed.shippingDetails);
        if (parsed.shippingMethod) setShippingMethod(parsed.shippingMethod);
      } catch {
        /* ignore corrupt data */
      }
    }
    isDraftHydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!isDraftHydratedRef.current) return;
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
        setFieldErrors((prev) => ({
          ...prev,
          [name]: validateField(name, value),
        }));
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
      else if (step === 2)
        fields = [
          "firstName",
          "lastName",
          "address",
          "city",
          "state",
          "zipCode",
        ];
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
      else if (step === 2)
        fields = [
          "firstName",
          "lastName",
          "address",
          "city",
          "state",
          "zipCode",
        ];
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
      const firstInput = document.querySelector(
        `[data-step="${step}"] input`,
      ) as HTMLElement | null;
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

  const applyPromo = useCallback(async () => {
    if (!promoCode.trim()) {
      setPromoError("Enter a promo code");
      return;
    }
    try {
      const res = await axiosInstance.post(API_ROUTES.PROMOTIONS.VALIDATE, {
        code: promoCode,
        cart_total: subtotal,
      });

      const { valid, discount_amount, message } = res.data;
      if (valid) {
        // Calculate the relative discount for the local state multiplier
        setDiscount(subtotal > 0 ? discount_amount / subtotal : 0);
        setPromoError("");
        showSuccess("Promo applied successfully!");
      } else {
        setDiscount(0);
        setPromoError(message || "Invalid promo code");
      }
    } catch (err: unknown) {
      setDiscount(0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      const msg =
        error.response?.data?.error || "Failed to validate promo code";
      setPromoError(msg);
    }
  }, [promoCode, subtotal, showSuccess]);

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

    if (!isAuthenticated) {
      try {
        const fullName =
          `${shippingDetails.firstName} ${shippingDetails.lastName}`.trim();
        await guestAuth(shippingDetails.email, fullName, shippingDetails.phone);
        await refetchUser();
      } catch (err: unknown) {
        if (
          axios.isAxiosError(err) &&
          err.response?.data?.error === "ACCOUNT_EXISTS"
        ) {
          showError(
            "An account already exists with this email. Please log in to complete your purchase.",
          );
          setIsLoginModalOpen(true);
          return;
        }
        showError("Could not start guest checkout. Please try again.");
        return;
      }
    }

    const cartSnapshot = cart.map((item) => ({ ...item }));

    try {
      // Sync cart to server without destroying local state if sync fails.
      try {
        await axiosInstance.delete(API_ROUTES.CART.CLEAR);
        const addRes = await axiosInstance.post(API_ROUTES.CART.ADD, {
          items: cartSnapshot.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        });
        if (addRes.status !== 200) {
          showError("Failed to update cart. Please try again.");
          return;
        }
      } catch {
        showError("Failed to sync cart. Please try again.");
        return;
      }

      const idempotencyKey =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      const checkoutPayload = {
        shipping_method: shippingMethod,
        shipping_address: {
          email: shippingDetails.email,
          phone: shippingDetails.phone,
          first_name: shippingDetails.firstName,
          last_name: shippingDetails.lastName,
          line1: shippingDetails.address,
          city: shippingDetails.city,
          state: shippingDetails.state,
          postal_code: shippingDetails.zipCode,
          country: shippingDetails.country || "GB",
        },
        contact: {
          email: shippingDetails.email,
          phone: shippingDetails.phone,
        },
        ...(promoCode.trim() ? { promo_code: promoCode.trim() } : {}),
        store_credit_amount: effectiveCreditAmount,
      };

      const checkoutRes = await axiosInstance.post(
        API_ROUTES.CART.CHECKOUT,
        checkoutPayload,
        {
          headers: {
            "Idempotency-Key": idempotencyKey,
          },
        },
      );
      if (checkoutRes.status !== 200 || !checkoutRes.data.order_id) {
        showError("Failed to initiate checkout. Please try again.");
        return;
      }
      const checkoutUrl = await pollForPaymentUrl(checkoutRes.data.order_id);
      localStorage.removeItem("checkout_draft");
      if (effectiveCreditAmount > 0 && total <= 0) {
        showSuccess("Order confirmed with store credit!");
      } else {
        showSuccess("Redirecting to secure payment…");
      }
      if (checkoutUrl && typeof checkoutUrl === "string") {
        try {
          window.location.assign(checkoutUrl);
        } catch {
          try {
            window.open(checkoutUrl, "_blank");
          } catch {
            showError("Unable to open payment page. Please try again.");
          }
        }
      } else {
        showError("Payment URL was invalid. Please try again.");
      }
    } catch (error: unknown) {
      showError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  }, [
    cart,
    effectiveCreditAmount,
    isAuthenticated,
    promoCode,
    refetchUser,
    shippingDetails,
    shippingMethod,
    showError,
    showSuccess,
    total,
    validateStep,
  ]);

  return {
    cart,
    currentStep,
    direction,
    shippingMethod,
    shippingDetails,
    touched,
    fieldErrors,
    promoCode,
    discount,
    promoExpanded,
    promoError,
    isProcessing,
    showMobileSummary,
    editingSection,
    subtotal,
    shipping,
    tax,
    discountAmount,
    grossTotal,
    total,
    storeCreditBalance,
    storeCreditAmount,
    setStoreCreditAmount,
    applyStoreCredit,
    setApplyStoreCredit: handleSetApplyStoreCredit,
    effectiveCreditAmount,
    itemCount,
    ctaLabel,
    isAuthenticated,
    isLoginModalOpen,
    setIsLoginModalOpen,
    setShippingMethod,
    setPromoCode,
    setPromoExpanded,
    setShowMobileSummary,
    setEditingSection,
    handleChange,
    handleBlur,
    validateStep,
    isStepValid,
    goToStep,
    goNext,
    goBack,
    applyPromo,
    completeOrder,
  };
}
