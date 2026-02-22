import { FormField } from "../CheckoutComponents";
import { SLIDE_VARIANTS } from "../checkoutConstants";
import { FormStateProps } from "../checkoutTypes";
import { motion } from "framer-motion";
import { MapPin, User } from "lucide-react";

type Props = FormStateProps;

export function StepShipping({
  shippingDetails,
  fieldErrors,
  touched,
  direction,
  handleChange,
  handleBlur,
}: Props) {
  return (
    <motion.section
      key="step-2"
      custom={direction}
      variants={SLIDE_VARIANTS}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm"
      aria-label="Step 2: Shipping Address"
      data-step="2"
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
              value={shippingDetails.firstName}
              error={fieldErrors.firstName}
              isTouched={touched.firstName}
              onChange={(v) => handleChange("firstName", v)}
              onBlur={() => handleBlur("firstName")}
            />
            <FormField
              name="lastName"
              label="Last Name"
              icon={User}
              autoComplete="family-name"
              placeholder="Smith"
              value={shippingDetails.lastName}
              error={fieldErrors.lastName}
              isTouched={touched.lastName}
              onChange={(v) => handleChange("lastName", v)}
              onBlur={() => handleBlur("lastName")}
            />
          </div>

          <FormField
            name="address"
            label="Street Address"
            icon={MapPin}
            autoComplete="address-line1"
            placeholder="123 High Street"
            value={shippingDetails.address}
            error={fieldErrors.address}
            isTouched={touched.address}
            onChange={(v) => handleChange("address", v)}
            onBlur={() => handleBlur("address")}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <FormField
              name="city"
              label="City"
              icon={MapPin}
              autoComplete="address-level2"
              placeholder="London"
              value={shippingDetails.city}
              error={fieldErrors.city}
              isTouched={touched.city}
              onChange={(v) => handleChange("city", v)}
              onBlur={() => handleBlur("city")}
            />
            <FormField
              name="state"
              label="State / County"
              icon={MapPin}
              autoComplete="address-level1"
              placeholder="Greater London"
              value={shippingDetails.state}
              error={fieldErrors.state}
              isTouched={touched.state}
              onChange={(v) => handleChange("state", v)}
              onBlur={() => handleBlur("state")}
            />
            <FormField
              name="zipCode"
              label="Postcode"
              icon={MapPin}
              autoComplete="postal-code"
              placeholder="SW1A 1AA"
              value={shippingDetails.zipCode}
              error={fieldErrors.zipCode}
              isTouched={touched.zipCode}
              onChange={(v) => handleChange("zipCode", v)}
              onBlur={() => handleBlur("zipCode")}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
