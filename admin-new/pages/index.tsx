import { useState, useEffect } from "react";
import AuthForm from "@/components/AuthForm";
import BackgroundElements from "@/components/BackgroundElements";
import Logo3D from "@/components/Logo3D";
import { motion } from "framer-motion";
import { ChevronRight, ShieldCheck, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [mounted, setMounted] = useState(false);

  // This ensures that animations trigger after the component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const features = [
    {
      title: "Real-time Analytics",
      description: "Monitor performance with live dashboards and reports",
      icon: BarChart3,
    },
    {
      title: "Advanced Security",
      description: "Enterprise-grade protection for your sensitive data",
      icon: ShieldCheck,
    },
    {
      title: "Lightning Fast",
      description: "Optimized performance for smooth admin experience",
      icon: Zap,
    },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col">
      <BackgroundElements />

      <header className="container mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <div className="animate-spin-slow">
            <Logo3D />
          </div>
        </motion.div>

        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ul className="flex items-center space-x-8">
            <li>
              <a
                href="#features"
                className="text-sm font-medium text-gray-300 hover:text-primary transition-colors"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="text-sm font-medium text-gray-300 hover:text-primary transition-colors"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="text-sm font-medium text-gray-300 hover:text-primary transition-colors"
              >
                Contact
              </a>
            </li>
            <li>
              <Button
                size="sm"
                className="gradient-teal btn-glow text-primary-foreground"
              >
                Get Started
              </Button>
            </li>
          </ul>
        </motion.nav>
      </header>

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-12 md:py-20 flex flex-col md:flex-row gap-12 items-center">
        {/* Hero Content */}
        <motion.div
          className="w-full md:w-1/2 mb-12 md:mb-0 md:pr-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Power Your Business with Our{" "}
              <span className="text-gradient">Admin Dashboard</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-md">
              The complete platform to visualize, manage, and scale your
              operations with ease.
            </p>

            <motion.div
              className="mt-10"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <div className="grid gap-6 mt-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={item}
                    className="flex items-start gap-4 group"
                  >
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-primary">
                      <feature.icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={item}>
                <Button
                  className="mt-8 gradient-teal btn-glow text-primary-foreground gap-2"
                  size="lg"
                >
                  Explore Features <ChevronRight size={16} />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Auth Form */}
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </main>
    </div>
  );
};

export default Index;
