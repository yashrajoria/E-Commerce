import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { toast } from "sonner";
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
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);

  const openLogin = useCallback(() => {
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

  /* Surface gate redirects like /?error=admin_required */
  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.error !== "admin_required") return;

    toast.error("Admin access required. Please sign in with an admin account.");
    setAuthOpen(true);

    const nextQuery = { ...router.query };
    delete nextQuery.error;
    void router.replace(
      { pathname: router.pathname, query: nextQuery },
      undefined,
      { shallow: true },
    );
    // Intentionally depend on the error query only to avoid replace loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.error]);

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
        <Navbar onLogin={openLogin} />

        {/* Page Sections */}
        <main>
          <HeroSection onGetStarted={openLogin} />
          <FeaturesSection />
          <DashboardPreview />
          <HowItWorks />
          <StatsSection />
          <TestimonialsSection />
          <PricingSection onGetStarted={openLogin} />
          <IntegrationsSection />
          <CTASection onGetStarted={openLogin} />
        </main>

        <Footer />

        {/* Auth Modal — login only (admins are seeded / invited) */}
        <AuthModal open={authOpen} onClose={closeAuth} initialView="login" />
      </div>
    </>
  );
}
