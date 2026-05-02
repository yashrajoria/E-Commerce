import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onLogin: () => void;
  onSignUp: () => void;
}

const navLinks = [
  { label: "Infrastructure", href: "#features" },
  { label: "Operations", href: "#preview" },
  { label: "Governance", href: "#testimonials" },
  { label: "Scalability", href: "#pricing" },
];

export default function Navbar({ onLogin, onSignUp }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-effect-strong py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.a
              href="#"
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
                <Cpu className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-[0.2em] leading-none uppercase">ShopSwift</span>
                <span className="text-xs font-light text-muted-foreground tracking-widest uppercase">Admin Pro</span>
              </div>
            </motion.a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-primary transition-all rounded-lg"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={onLogin}
                className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                Access System
              </button>
              <Button
                onClick={onSignUp}
                className="h-11 px-8 bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] text-white rounded-xl shadow-lg transition-all text-xs font-bold uppercase tracking-widest"
              >
                Initialize Instance
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/[0.05] text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-[72px] z-40 glass-effect-strong border-b border-white/[0.06] lg:hidden overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-8 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="block w-full text-left px-4 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-white/[0.02] rounded-xl transition-all"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-6 mt-6 space-y-4 border-t border-white/[0.06]">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setMobileOpen(false);
                    onLogin();
                  }}
                  className="w-full h-14 justify-center text-xs font-bold uppercase tracking-widest"
                >
                  Access System
                </Button>
                <Button
                  onClick={() => {
                    setMobileOpen(false);
                    onSignUp();
                  }}
                  className="w-full h-14 bg-primary text-white border-0 rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-primary/20"
                >
                  Initialize Instance
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
