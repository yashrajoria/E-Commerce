/**
 * Premium 404 Page
 */
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";
import Head from "next/head";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
      </Head>
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/3 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center relative z-10 max-w-lg"
        >
          {/* 404 Number */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter text-gradient select-none">
              404
            </h1>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3 mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold">Page not found</h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved. Let&apos;s get you back on track.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button
              size="lg"
              className="gradient-purple text-white border-0 rounded-xl gap-2 px-6"
              asChild
            >
              <Link href="/dashboard">
                <Home size={16} />
                Back to Dashboard
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl gap-2 px-6 border-white/[0.08]"
              asChild
            >
              <Link href="/products">
                <Search size={16} />
                Browse Products
              </Link>
            </Button>
          </motion.div>

          {/* Decorative Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        </motion.div>
      </div>
    </>
  );
};

export default NotFoundPage;
