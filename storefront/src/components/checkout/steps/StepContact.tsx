import { FormField } from "@/components/checkout/CheckoutComponents";
import { SLIDE_VARIANTS } from "@/components/checkout/checkoutConstants";
import { FormStateProps } from "@/components/checkout/checkoutTypes";
import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";

type Props = FormStateProps;

export function StepContact({
  shippingDetails,
  fieldErrors,
  touched,
  direction,
  handleChange,
  handleBlur,
}: Props) {
  return (
    <motion.section
      key="step-1"
      custom={direction}
      variants={SLIDE_VARIANTS}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="rounded-lg bg-surface border border-border"
      aria-label="Step 1: Contact Information"
      data-step="1"
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center text-foreground">
            <Mail className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Contact Information
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              We&apos;ll send your order confirmation and dispatch updates here.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <FormField
            name="email"
            label="Email Address"
            icon={Mail}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={shippingDetails.email}
            error={fieldErrors.email}
            isTouched={touched.email}
            onChange={(v) => handleChange("email", v)}
            onBlur={() => handleBlur("email")}
          />
          <FormField
            name="phone"
            label="Phone Number"
            icon={Phone}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+44 7700 900000"
            value={shippingDetails.phone}
            error={fieldErrors.phone}
            isTouched={touched.phone}
            onChange={(v) => handleChange("phone", v)}
            onBlur={() => handleBlur("phone")}
          />
        </div>
      </div>
    </motion.section>
  );
}
