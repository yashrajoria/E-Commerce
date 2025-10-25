"use client";

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Check,
  CreditCard,
  Lock,
  Mail,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
} from "lucide-react";
import { useState } from "react";

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const steps = [
    { id: 1, title: "Shipping", icon: Truck },
    { id: 2, title: "Payment", icon: CreditCard },
    { id: 3, title: "Review", icon: Package },
  ];
  const { cart } = useCart();
  const { showSuccess } = useToast();

  const completeOrder = async () => {
    try {
      // 1️⃣ Add items to cart (This part looks correct)
      const addResponse = await axios.post(
        "http://localhost:8080/cart/add",
        {
          items: cart.map((item) => ({
            product_id: item._id,
            quantity: item.quantity,
          })),
        },
        { withCredentials: true }
      );

      if (addResponse.status !== 200) {
        console.error("Failed to add items to cart.");
        // showError("Failed to update cart. Please try again.");
        return;
      }

      console.log("Items added/updated in cart.");

      // 2️⃣ Checkout (This part is correct)
      const checkoutResponse = await axios.post(
        "http://localhost:8080/cart/checkout",
        {},
        { withCredentials: true }
      );

      console.log("Checkout response:", checkoutResponse.data);

      if (checkoutResponse.status !== 200 || !checkoutResponse.data.order_id) {
        console.error("No order ID returned from checkout.");
        // showError("Failed to initiate checkout. Please try again.");
        return;
      }

      const orderId = checkoutResponse.data.order_id;
      console.log("Checkout initiated, polling with Order ID:", orderId);
      // showLoading("Waiting for payment link..."); // Show a spinner

      // 3️⃣ Polling (This section is fixed)

      const pollForPaymentUrl = async (orderId) => {
        // Create a long-polling mechanism
        const maxAttempts = 20; // Poll for 20 * 5s = 100 seconds
        let attempts = 0;

        return new Promise((resolve, reject) => {
          const interval = setInterval(async () => {
            if (attempts >= maxAttempts) {
              clearInterval(interval);
              reject(
                new Error("Timeout: Payment link took too long to generate.")
              );
              return;
            }

            try {
              // FIX 1: Use GET, not POST, for the status check
              const response = await axios.get(
                `http://localhost:8080/payment/status/by-order/${orderId}`,
                { withCredentials: true }
              );

              console.log("Polling response:", response.data);
              const { status, checkout_url } = response.data;

              // FIX 2: Check for "URL_READY", not "completed"
              // "URL_READY" is the status our consumer sets when the URL is available.
              if (status === "URL_READY" && checkout_url) {
                clearInterval(interval);
                console.log("Payment URL received:", checkout_url);
                resolve(checkout_url); // Stop polling and return the URL
              } else if (status === "FAILED") {
                clearInterval(interval);
                reject(new Error("Payment failed during processing."));
              } else {
                // Status is "PENDING" or "PROCESSING", just keep polling
                console.log(`Status is ${status}, polling again...`);
                attempts++;
              }
            } catch (err) {
              console.error("Polling error:", err);
              attempts++; // Still count as an attempt
            }
          }, 5000); // Poll every 5 seconds
        });
      };

      // Start polling and wait for the result
      const checkoutUrl = await pollForPaymentUrl(orderId);

      // FIX 3: Redirect the user to the Stripe URL
      if (checkoutUrl) {
        // hideLoading(); // Hide spinner
        showSuccess("Redirecting to payment...");

        window.location.href = checkoutUrl; // <-- The most important part
      }
    } catch (error) {
      console.error("Error completing order:", error);
      // hideLoading(); // Hide spinner
      // showError(error.message || "Something went wrong during order processing.");
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = shippingMethod === "express" ? 15.99 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Checkout
            </h1>
            <p className="text-muted-foreground">Complete your purchase</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-8 mb-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <motion.div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  currentStep >= step.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 border-blue-600 text-white"
                    : "border-muted bg-background text-muted-foreground"
                }`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {currentStep > step.id ? (
                  <Check className="h-6 w-6" />
                ) : (
                  <step.icon className="h-6 w-6" />
                )}
              </motion.div>
              <div className="ml-3 hidden sm:block">
                <p
                  className={`font-medium ${
                    currentStep >= step.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? "bg-blue-600" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-background/95 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl p-8 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-teal-500/5 pointer-events-none" />

              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 relative z-10"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      <Truck className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">Shipping Information</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-medium"
                      >
                        First Name
                      </Label>
                      <div className="relative mt-2">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="firstName"
                          placeholder="Enter first name"
                          className="pl-12 h-12"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </Label>
                      <div className="relative mt-2">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="lastName"
                          placeholder="Enter last name"
                          className="pl-12 h-12"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        className="pl-12 h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </Label>
                    <div className="relative mt-2">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="phone"
                        placeholder="Enter phone number"
                        className="pl-12 h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-sm font-medium">
                      Street Address
                    </Label>
                    <div className="relative mt-2">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="address"
                        placeholder="Enter street address"
                        className="pl-12 h-12"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-sm font-medium">
                        City
                      </Label>
                      <Input
                        id="city"
                        placeholder="Enter city"
                        className="mt-2 h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-sm font-medium">
                        State
                      </Label>
                      <Input
                        id="state"
                        placeholder="Enter state"
                        className="mt-2 h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip" className="text-sm font-medium">
                        ZIP Code
                      </Label>
                      <Input
                        id="zip"
                        placeholder="Enter ZIP"
                        className="mt-2 h-12"
                      />
                    </div>
                  </div>

                  {/* Shipping Methods */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">
                      Shipping Method
                    </h3>
                    <RadioGroup
                      value={shippingMethod}
                      onValueChange={setShippingMethod}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label
                            htmlFor="standard"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">Standard Shipping</p>
                                <p className="text-sm text-muted-foreground">
                                  5-7 business days
                                </p>
                              </div>
                              <p className="font-medium">$5.99</p>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                          <RadioGroupItem value="express" id="express" />
                          <Label
                            htmlFor="express"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">Express Shipping</p>
                                <p className="text-sm text-muted-foreground">
                                  2-3 business days
                                </p>
                              </div>
                              <p className="font-medium">$15.99</p>
                            </div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 relative z-10"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">Payment Information</h2>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Payment Method
                    </h3>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                          <RadioGroupItem value="card" id="card" />
                          <Label
                            htmlFor="card"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center space-x-3">
                              <CreditCard className="h-5 w-5" />
                              <span>Credit/Debit Card</span>
                            </div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Card Details */}
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="cardNumber"
                        className="text-sm font-medium"
                      >
                        Card Number
                      </Label>
                      <div className="relative mt-2">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          className="pl-12 h-12"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry" className="text-sm font-medium">
                          Expiry Date
                        </Label>
                        <div className="relative mt-2">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            className="pl-12 h-12"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-sm font-medium">
                          CVV
                        </Label>
                        <div className="relative mt-2">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            id="cvv"
                            placeholder="123"
                            className="pl-12 h-12"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cardName" className="text-sm font-medium">
                        Cardholder Name
                      </Label>
                      <Input
                        id="cardName"
                        placeholder="Enter cardholder name"
                        className="mt-2 h-12"
                      />
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sameAddress" />
                    <Label htmlFor="sameAddress" className="text-sm">
                      Billing address same as shipping address
                    </Label>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review Order */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 relative z-10"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">Review Your Order</h2>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 p-4 border rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Info Summary */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Shipping Information</h4>
                    <p className="text-sm text-muted-foreground">
                      John Doe
                      <br />
                      123 Main Street
                      <br />
                      New York, NY 10001
                    </p>
                  </div>

                  {/* Payment Info Summary */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Payment Method</h4>
                    <p className="text-sm text-muted-foreground">
                      •••• •••• •••• 3456
                      <br />
                      Expires 12/25
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t relative z-10">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => {
                    if (currentStep < 3) {
                      setCurrentStep(currentStep + 1);
                    } else {
                      // Handle order placement
                      completeOrder();
                    }
                  }}
                >
                  {currentStep === 3 ? "Place Order" : "Continue"}
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-background/95 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl p-6 sticky top-8 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-teal-500/5 pointer-events-none" />

              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="mb-4" />

                {/* Pricing */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm font-medium">Secure Checkout</span>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
