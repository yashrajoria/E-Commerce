import { Button } from "@/components/ui/button";
import { FormField } from "../CheckoutComponents";
import { SHIPPING_OPTIONS } from "../checkoutConstants";
import { FieldError, ShippingDetails, StepId } from "../checkoutTypes";
import { formatGBP, getDeliveryDate } from "../checkoutUtils";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, MapPin, Phone, User } from "lucide-react";

interface Props {
  editingSection: StepId | null;
  onClose: () => void;
  shippingDetails: ShippingDetails;
  fieldErrors: FieldError;
  touched: Record<string, boolean>;
  handleChange: (name: keyof ShippingDetails, value: string) => void;
  handleBlur: (name: keyof ShippingDetails) => void;
  validateStep: (step: StepId) => boolean;
  shippingMethod: string;
  setShippingMethod: (v: string) => void;
}

const saveButtonCls =
  "bg-gradient-to-r from-rose-600 to-amber-500 text-white rounded-xl h-10";

export function InlineEditPanels({
  editingSection,
  onClose,
  shippingDetails,
  fieldErrors,
  touched,
  handleChange,
  handleBlur,
  validateStep,
  shippingMethod,
  setShippingMethod,
}: Props) {
  return (
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
              value={shippingDetails.phone}
              error={fieldErrors.phone}
              isTouched={touched.phone}
              onChange={(v) => handleChange("phone", v)}
              onBlur={() => handleBlur("phone")}
            />
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  if (validateStep(1)) onClose();
                }}
                className={saveButtonCls}
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
                value={shippingDetails.zipCode}
                error={fieldErrors.zipCode}
                isTouched={touched.zipCode}
                onChange={(v) => handleChange("zipCode", v)}
                onBlur={() => handleBlur("zipCode")}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  if (validateStep(2)) onClose();
                }}
                className={saveButtonCls}
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
              {SHIPPING_OPTIONS.map((opt) => {
                const isSelected = shippingMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setShippingMethod(opt.id)}
                    className={`w-full text-left rounded-2xl border-2 p-5 transition-all duration-200 min-h-20 ${
                      isSelected
                        ? "border-rose-500 bg-gradient-to-r from-rose-50 to-amber-50 dark:from-rose-950/30 dark:to-amber-950/20 shadow-md shadow-rose-500/10"
                        : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                    }`}
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`${opt.label} - ${opt.time} - ${formatGBP(opt.price)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 ${isSelected ? "border-rose-500 bg-rose-500" : "border-neutral-300 dark:border-neutral-600"}`}
                        />
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
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={onClose} className={saveButtonCls}>
                Save Changes
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
