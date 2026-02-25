import { FormField } from "../CheckoutComponents";
import { SLIDE_VARIANTS } from "../checkoutConstants";
import { FormStateProps } from "../checkoutTypes";
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
      className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm"
      aria-label="Step 1: Contact Information"
      data-step="1"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-rose-600 to-amber-500 flex items-center justify-center">
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
