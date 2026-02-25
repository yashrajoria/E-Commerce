"use client";

import { AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight, Lock, Mail, MapPin, Truck } from "lucide-react";
import Head from "next/head";
import { STEP_META } from "./checkoutConstants";
import { CompletedCard, ProgressDots } from "./CheckoutComponents";
import { formatGBP } from "./checkoutUtils";
import { useCheckout } from "./useCheckout";
import { CheckoutCTABar } from "./sections/CheckoutCTABar";
import { ExpressCheckout } from "./sections/ExpressCheckout";
import { InlineEditPanels } from "./sections/InlineEditPanels";
import { MobileOrderSummary } from "./sections/MobileOrderSummary";
import { StepContact } from "./steps/StepContact";
import { StepDelivery } from "./steps/StepDelivery";
import { StepReview } from "./steps/StepReview";
import { StepShipping } from "./steps/StepShipping";

export default function CheckoutPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const {
    cart, currentStep, direction, shippingMethod, shippingDetails,
    touched, fieldErrors, promoCode, discount, promoExpanded, promoError,
    isProcessing, showMobileSummary, editingSection,
    subtotal, shipping, tax, discountAmount, total, itemCount, ctaLabel,
    setShippingMethod, setPromoCode, setPromoExpanded,
    setShowMobileSummary, setEditingSection,
    handleChange, handleBlur, validateStep, isStepValid,
    goToStep, goNext, goBack, applyPromo, completeOrder,
  } = useCheckout();

  const formStateProps = { shippingDetails, fieldErrors, touched, direction, handleChange, handleBlur };

  return (
    <div className="min-h-screen bg-linear-to-b from-rose-50 via-amber-50/30 to-rose-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <Head>
        <title>Secure Checkout | ShopSwift</title>
        <meta name="description" content="Complete your order with our secure checkout." />
        <link rel="canonical" href={`${siteUrl}/checkout`} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div id="sr-step-announce" className="sr-only" aria-live="polite" aria-atomic="true" />

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-800/50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => (currentStep > 1 ? goBack() : window.history.back())}
            className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors min-h-12 min-w-12 justify-center rounded-xl"
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

          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 min-h-12">
            <Lock className="h-4 w-4" />
            <span className="text-xs font-semibold hidden sm:inline">Secure</span>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-3xl mx-auto px-4 pt-6 pb-36">
        {currentStep === 1 && <ExpressCheckout />}

        {/* Completed section summaries */}
        <AnimatePresence>
          {currentStep > 1 && (
            <CompletedCard step={1} title="Contact" icon={Mail}
              summary={<span>{shippingDetails.email} · {shippingDetails.phone}</span>}
            />
          )}
          {currentStep > 2 && (
            <CompletedCard step={2} title="Shipping Address" icon={MapPin}
              summary={<span>{shippingDetails.firstName} {shippingDetails.lastName}, {shippingDetails.address}, {shippingDetails.city}</span>}
            />
          )}
          {currentStep > 3 && (
            <CompletedCard step={3} title="Delivery" icon={Truck}
              summary={<span>{shippingMethod === "express" ? "Express (2–3 days)" : "Standard (5–7 days)"} — {formatGBP(shipping)}</span>}
            />
          )}
        </AnimatePresence>

        {/* Inline edit panels for completed sections */}
        <InlineEditPanels
          editingSection={editingSection}
          onClose={() => setEditingSection(null)}
          shippingDetails={shippingDetails}
          fieldErrors={fieldErrors}
          touched={touched}
          handleChange={handleChange}
          handleBlur={handleBlur}
          validateStep={validateStep}
          shippingMethod={shippingMethod}
          setShippingMethod={setShippingMethod}
        />

        {/* Step cards */}
        <AnimatePresence mode="wait" custom={direction}>
          {currentStep === 1 && <StepContact {...formStateProps} />}
          {currentStep === 2 && <StepShipping {...formStateProps} />}
          {currentStep === 3 && (
            <StepDelivery shippingMethod={shippingMethod} direction={direction} onSelectMethod={setShippingMethod} />
          )}
          {currentStep === 4 && (
            <StepReview
              cart={cart} subtotal={subtotal} shipping={shipping} tax={tax}
              discount={discount} discountAmount={discountAmount} total={total}
              shippingMethod={shippingMethod} promoCode={promoCode}
              promoExpanded={promoExpanded} promoError={promoError} direction={direction}
              onPromoCodeChange={setPromoCode}
              onPromoExpandChange={setPromoExpanded}
              onApplyPromo={applyPromo}
            />
          )}
        </AnimatePresence>

        {/* Jump to Review shortcut */}
        {currentStep > 1 && currentStep < 4 && isStepValid(1) && (
          <div className="mt-4 text-center">
            <button
              onClick={() => { if (validateStep(currentStep)) goToStep(4); }}
              className="text-sm text-rose-600 dark:text-rose-400 font-medium hover:underline inline-flex items-center gap-1"
            >
              Jump to Review
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </main>

      <MobileOrderSummary
        isOpen={showMobileSummary}
        onClose={() => setShowMobileSummary(false)}
        cart={cart}
        itemCount={itemCount}
        subtotal={subtotal}
        shipping={shipping}
        tax={tax}
        discount={discount}
        discountAmount={discountAmount}
        total={total}
      />

      <CheckoutCTABar
        itemCount={itemCount}
        total={total}
        isProcessing={isProcessing}
        currentStep={currentStep}
        ctaLabel={ctaLabel}
        onAction={currentStep === 4 ? completeOrder : goNext}
        onShowSummary={() => setShowMobileSummary(true)}
      />
    </div>
  );
}
