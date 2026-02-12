import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import DashboardPreview from "@/components/landing/DashboardPreview";
import HowItWorks from "@/components/landing/HowItWorks";
import StatsSection from "@/components/landing/StatsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import IntegrationsSection from "@/components/landing/IntegrationsSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import AuthModal from "@/components/landing/AuthModal";

export default function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "register">("login");

  const openLogin = useCallback(() => {
    setAuthView("login");
    setAuthOpen(true);
  }, []);

  const openSignUp = useCallback(() => {
    setAuthView("register");
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthOpen(false);
  }, []);

  /* Spotlight cursor effect */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <>
      <Head>
        <title>
          {"AdminPanel — The E-Commerce Admin Dashboard That Scales With You"}
        </title>
        <meta
          name="description"
          content="Powerful analytics, seamless operations, and real-time insights — all in one beautiful dashboard. Manage your e-commerce empire with the most premium admin panel."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-background text-foreground noise-texture">
        {/* Spotlight overlay */}
        <div className="fixed inset-0 spotlight pointer-events-none z-0" />

        {/* Navbar */}
        <Navbar onLogin={openLogin} onSignUp={openSignUp} />

        {/* Page Sections */}
        <main>
          <HeroSection onGetStarted={openSignUp} />
          <FeaturesSection />
          <DashboardPreview />
          <HowItWorks />
          <StatsSection />
          <TestimonialsSection />
          <PricingSection onGetStarted={openSignUp} />
          <IntegrationsSection />
          <CTASection onGetStarted={openSignUp} />
        </main>

        <Footer />

        {/* Auth Modal */}
        <AuthModal open={authOpen} onClose={closeAuth} initialView={authView} />
      </div>
    </>
  );
}
