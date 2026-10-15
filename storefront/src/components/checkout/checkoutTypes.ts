/** Contact and delivery details collected across the checkout wizard. */
export interface ShippingDetails {
  /** Email address used for the order confirmation. */
  email: string;
  /** Phone number used for delivery updates. */
  phone: string;
  /** Recipient's first name. */
  firstName: string;
  /** Recipient's last name. */
  lastName: string;
  /** Street address line of the delivery destination. */
  address: string;
  /** Town or city of the delivery destination. */
  city: string;
  /** State or county of the delivery destination. */
  state: string;
  /** Postcode of the delivery destination (UK format). */
  zipCode: string;
  /** ISO country code; defaults to `"GB"` when posting the checkout payload. */
  country: string;
}

/** Map of field name to its validation message for the shipping form. */
export interface FieldError {
  /** Validation message for the named field; an empty string means the field is valid. */
  [key: string]: string;
}

/** Identifier of a checkout wizard step, from contact details (`1`) to review (`4`). */
export type StepId = 1 | 2 | 3 | 4;

/** Shared form-state props passed down to each step component. */
export interface FormStateProps {
  /** Current values of every shipping field. */
  shippingDetails: ShippingDetails;
  /** Validation messages keyed by field name. */
  fieldErrors: FieldError;
  /** Flags marking which fields the user has already interacted with. */
  touched: Record<string, boolean>;
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
  /** Slide direction for the step transition supplied to the motion variants. */
  direction: number;
}
