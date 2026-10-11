"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "./brand-logo";

type FooterLink = { label: string; href: string };

export function Footer() {
  const [email, setEmail] = useState("");
  const { showSuccess, showError } = useToast();

  const footerLinks: Record<string, FooterLink[]> = {
    Shop: [
      { label: "All products", href: "/products" },
      { label: "Categories", href: "/categories" },
      { label: "Featured", href: "/products?sortBy=newest" },
      { label: "On sale", href: "/products" },
    ],
    "Customer Service": [
      { label: "My account", href: "/account" },
      { label: "Track order", href: "/account" },
      { label: "Shipping info", href: "/products" },
      { label: "Returns", href: "/account" },
      { label: "Contact", href: "mailto:hello@shopswift.co.uk" },
    ],
    Company: [
      { label: "About", href: "/" },
      { label: "Careers", href: "/" },
      { label: "Terms of service", href: "/account" },
      { label: "Privacy", href: "/account" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com", label: "Youtube" },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      showError("Enter a valid email address");
      return;
    }
    showSuccess("Thanks — you’re on the list.");
    setEmail("");
  };

  return (
    <footer className="relative bg-muted/30 border-t border-border">
      <div className="border-b border-border/60">
        <div className="container mx-auto px-4 lg:px-8 py-10">
          <motion.div
            className="flex flex-col md:flex-row items-center justify-between gap-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-1">Stay in the loop</h3>
              <p className="text-muted-foreground text-sm">
                Curated updates, product drops, and exclusive seasonal releases.
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex w-full max-w-md gap-2"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 text-sm bg-background border-border/80"
                aria-label="Email for newsletter"
                required
              />
              <Button
                type="submit"
                className="h-10 px-5 text-sm font-medium shrink-0"
              >
                Subscribe
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="md" />
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Curated everyday products with thoughtful design, durable craftsmanship, and direct delivery.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground pt-1">
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-muted-foreground/70" />
                <a href="tel:+442071234567" className="hover:text-foreground transition-colors">
                  +44 (0) 20 7123 4567
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-muted-foreground/70" />
                <a
                  href="mailto:hello@shopswift.co.uk"
                  className="hover:text-foreground transition-colors"
                >
                  hello@shopswift.co.uk
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-muted-foreground/70" />
                <span>123 Oxford Street, London W1D 1BS</span>
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-xs mb-3.5 uppercase tracking-wider text-foreground">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-xs text-muted-foreground">
              <span>
                &copy; {new Date().getFullYear()} ShopSwift Ltd. All rights reserved.
              </span>
              <div className="flex gap-4">
                <Link
                  href="/account"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  href="/account"
                  className="hover:text-foreground transition-colors"
                >
                  Terms
                </Link>
                <Link
                  href="/account"
                  className="hover:text-foreground transition-colors"
                >
                  Cookies
                </Link>
              </div>
            </div>

            <div className="flex gap-1">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
