"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export function Footer() {
  const footerLinks = {
    Shop: [
      "Electronics",
      "Fashion",
      "Home & Garden",
      "Sports",
      "Books",
      "Beauty",
    ],
    "Customer Service": [
      "Contact Us",
      "FAQ",
      "Shipping Info",
      "Returns",
      "Size Guide",
      "Track Order",
    ],
    Company: [
      "About Us",
      "Careers",
      "Press",
      "Investor Relations",
      "Sustainability",
      "Terms of Service",
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "Youtube" },
  ];

  return (
    <footer className="relative bg-foreground/[0.03] border-t">
      {/* Newsletter Banner */}
      <div className="border-b">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <motion.div
            className="flex flex-col md:flex-row items-center justify-between gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold mb-1">Stay in the loop</h3>
              <p className="text-muted-foreground text-sm">
                Subscribe for exclusive offers, new arrivals, and insider-only
                discounts.
              </p>
            </div>
            <div className="flex w-full max-w-md gap-2">
              <Input
                placeholder="Enter your email"
                className="rounded-full h-11 bg-background"
              />
              <Button className="rounded-full h-11 px-6 bg-linear-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white shadow-lg shadow-rose-500/20">
                Subscribe
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-linear-to-br from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-semibold text-xl tracking-tight">
                ShopSwift
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Your premium destination for curated products. Quality, style, and
              exceptional service — all in one place.
            </p>
            <div className="space-y-2.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-rose-500" />
                <span>+44 (0) 20 7123 4567</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-rose-500" />
                <span>hello@storefront.co.uk</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-rose-500" />
                <span>123 Oxford Street, London W1D 1BS</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-medium text-sm mb-4 uppercase tracking-wider text-foreground/80">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <button className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 text-left">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-sm text-muted-foreground">
              <span>
                &copy; {new Date().getFullYear()} ShopSwift. All rights
                reserved.
              </span>
              <div className="flex gap-4">
                <button className="hover:text-foreground transition-colors">
                  Privacy
                </button>
                <button className="hover:text-foreground transition-colors">
                  Terms
                </button>
                <button className="hover:text-foreground transition-colors">
                  Cookies
                </button>
              </div>
            </div>

            <div className="flex gap-1.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
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

