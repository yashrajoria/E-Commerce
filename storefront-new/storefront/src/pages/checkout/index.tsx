"use client";

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { API_ROUTES } from "@/pages/api/constants/apiRoutes";
import { axiosInstance } from "@/utils/axiosInstance";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Lock,
  Mail,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Head from "next/head";

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [shippingDetails, setShippingDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const steps = [
    { id: 1, title: "Shipping", icon: Truck },
    { id: 2, title: "Review", icon: Package },
  ];

  const { cart } = useCart();
  const { showError, showSuccess } = useToast();
  const pollIntervalRef = useRef<number | null>(null);
  const formatGBP = (value?: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(value ?? 0);

  const validateShippingDetails = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
    ] as const;
    return requiredFields.every(
      (field) => shippingDetails[field].trim().length > 0,
    );
  };

  const completeOrder = async () => {
    try {
      if (cart.length === 0) {
        showError("Your cart is empty.");
        return;
      }
      if (!validateShippingDetails()) {
        showError("Please complete all shipping details.");
        return;
      }
      // 1️⃣ Add items to cart (This part looks correct)
      const addResponse = await axiosInstance.post(API_ROUTES.CART.ADD, {
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      });

      if (addResponse.status !== 200) {
        console.error("Failed to add items to cart.");
        // showError("Failed to update cart. Please try again.");
        return;
      }

      // 2️⃣ Checkout (This part is correct)
      const checkoutResponse = await axiosInstance.post(
        API_ROUTES.CART.CHECKOUT,
        {},
      );

      if (checkoutResponse.status !== 200 || !checkoutResponse.data.order_id) {
        console.error("No order ID returned from checkout.");
        // showError("Failed to initiate checkout. Please try again.");
        return;
      }

      const orderId = checkoutResponse.data.order_id;
      // showLoading("Waiting for payment link..."); // Show a spinner

      // 3️⃣ Polling (This section is fixed)

      const pollForPaymentUrl = async (
        orderId: string,
      ): Promise<string | null> => {
        // Create a long-polling mechanism
        const maxAttempts = 20; // Poll for 20 * 5s = 100 seconds
        let attempts = 0;

        return new Promise<string | null>((resolve, reject) => {
          pollIntervalRef.current = window.setInterval(async () => {
            if (attempts >= maxAttempts) {
              if (pollIntervalRef.current !== null) {
                window.clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
              }
              reject(
                new Error("Timeout: Payment link took too long to generate."),
              );
              return;
            }

            try {
              // FIX 1: Use GET, not POST, for the status check
              const response = await axiosInstance.get(
                API_ROUTES.PAYMENT.STATUS_BY_ORDER(orderId),
              );

              const { status, checkout_url } = response.data;

              // FIX 2: Check for "URL_READY", not "completed"
              // "URL_READY" is the status our consumer sets when the URL is available.
              if (status === "URL_READY" && checkout_url) {
                if (pollIntervalRef.current !== null) {
                  window.clearInterval(pollIntervalRef.current);
                  pollIntervalRef.current = null;
                }
                resolve(checkout_url); // Stop polling and return the URL
              } else if (status === "FAILED") {
                if (pollIntervalRef.current !== null) {
                  window.clearInterval(pollIntervalRef.current);
                  pollIntervalRef.current = null;
                }
                reject(new Error("Payment failed during processing."));
              } else {
                // Status is "PENDING" or "PROCESSING", just keep polling
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

        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Error completing order:", error);
      // hideLoading(); // Hide spinner
      // showError(error.message || "Something went wrong during order processing.");
    }
  };
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current !== null) {
        window.clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = shippingMethod === "express" ? 15.99 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>Storefront | Checkout</title>
        <meta
          name="description"
          content="Complete your order with secure checkout."
        />
        <link rel="canonical" href={`${siteUrl}/checkout`} />
        <meta property="og:title" content="Storefront | Checkout" />
        <meta
          property="og:description"
          content="Complete your order with secure checkout."
        />
        <meta property="og:url" content={`${siteUrl}/checkout`} />
      </Head>
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
                          value={shippingDetails.firstName}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              firstName: e.target.value,
                            })
                          }
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
                          value={shippingDetails.lastName}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              lastName: e.target.value,
                            })
                          }
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
                        value={shippingDetails.email}
                        onChange={(e) =>
                          setShippingDetails({
                            ...shippingDetails,
                            email: e.target.value,
                          })
                        }
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
                        value={shippingDetails.phone}
                        onChange={(e) =>
                          setShippingDetails({
                            ...shippingDetails,
                            phone: e.target.value,
                          })
                        }
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
                        value={shippingDetails.address}
                        onChange={(e) =>
                          setShippingDetails({
                            ...shippingDetails,
                            address: e.target.value,
                          })
                        }
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
                        value={shippingDetails.city}
                        onChange={(e) =>
                          setShippingDetails({
                            ...shippingDetails,
                            city: e.target.value,
                          })
                        }
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
                        value={shippingDetails.state}
                        onChange={(e) =>
                          setShippingDetails({
                            ...shippingDetails,
                            state: e.target.value,
                          })
                        }
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
                        value={shippingDetails.zipCode}
                        onChange={(e) =>
                          setShippingDetails({
                            ...shippingDetails,
                            zipCode: e.target.value,
                          })
                        }
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
                              <p className="font-medium">{formatGBP(5.99)}</p>
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
                              <p className="font-medium">{formatGBP(15.99)}</p>
                            </div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Review Order */}
              {currentStep === 2 && (
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
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                          <Image
                            src={item.images?.[0] || "/icons8-image-100.png"}
                            alt={item.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          {formatGBP(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Info Summary */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Shipping Information</h4>
                    <p className="text-sm text-muted-foreground">
                      {shippingDetails.firstName} {shippingDetails.lastName}
                      <br />
                      {shippingDetails.address}
                      <br />
                      {shippingDetails.city}, {shippingDetails.state}{" "}
                      {shippingDetails.zipCode}
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
                    if (currentStep < 2) {
                      if (!validateShippingDetails()) {
                        showError("Please complete all shipping details.");
                        return;
                      }
                      setCurrentStep(currentStep + 1);
                    } else {
                      // Handle order placement
                      completeOrder();
                    }
                  }}
                >
                  {currentStep === 2 ? "Place Order" : "Continue"}
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-background/95 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl p-6 sticky top-8 overflow-hidden"
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
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                        <Image
                          src={item.images?.[0] || "/icons8-image-100.png"}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-sm">
                        {formatGBP(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="mb-4" />

                {/* Pricing */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatGBP(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{formatGBP(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{formatGBP(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">{formatGBP(total)}</span>
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
