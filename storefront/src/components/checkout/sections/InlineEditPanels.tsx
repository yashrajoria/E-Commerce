import { Button } from "@/components/ui/button";
import { FormField } from "@/components/checkout/CheckoutComponents";
import { SHIPPING_OPTIONS } from "@/components/checkout/checkoutConstants";
import { FieldError, ShippingDetails, StepId } from "@/components/checkout/checkoutTypes";
import { formatGBP, getDeliveryDate } from "@/components/checkout/checkoutUtils";
import { Badge } from "@/components/ui/badge";
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
          <div className="rounded-lg bg-surface border border-border p-5 space-y-4">
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
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  if (validateStep(1)) onClose();
                }}
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
          <div className="rounded-lg bg-surface border border-border p-5 space-y-4">
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
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  if (validateStep(2)) onClose();
                }}
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
          <div className="rounded-lg bg-surface border border-border p-5">
            <div className="space-y-3">
              {SHIPPING_OPTIONS.map((opt) => {
                const isSelected = shippingMethod === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setShippingMethod(opt.id)}
                    className={`w-full text-left rounded-lg border p-4 transition-colors ${
                      isSelected
                        ? "border-foreground bg-muted/40 shadow-xs"
                        : "border-border hover:border-foreground/40 bg-background"
                    }`}
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`${opt.label} - ${opt.time} - ${formatGBP(opt.price)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? "border-foreground bg-foreground text-background"
                              : "border-muted-foreground/40"
                          }`}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm text-foreground">
                              {opt.label}
                            </p>
                            {opt.badge && (
                              <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
                                {opt.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {opt.sub}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 font-medium">
                            Arrives by {getDeliveryDate(opt.days)}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-sm text-foreground shrink-0 ml-4">
                        {opt.price === 0 ? "Free" : formatGBP(opt.price)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" size="sm" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
