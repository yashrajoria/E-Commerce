export interface ShippingDetails {
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

export interface FieldError {
  [key: string]: string;
}

export type StepId = 1 | 2 | 3 | 4;

/** Shared form-state props passed down to each step component. */
export interface FormStateProps {
  shippingDetails: ShippingDetails;
  fieldErrors: FieldError;
  touched: Record<string, boolean>;
  handleChange: (name: keyof ShippingDetails, value: string) => void;
  handleBlur: (name: keyof ShippingDetails) => void;
  direction: number;
}
