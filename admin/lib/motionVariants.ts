/**
 * Premium motion variants for Framer Motion animations
 * Used across the dashboard for consistent, polished animations
 */

// ── Container / Stagger ──
/** Stagger container: fades in and animates children in sequence (80ms apart, 100ms delay). */
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/** Stagger child: fades in while rising 16px; use inside {@link containerVariants}. */
export const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// ── Fade ──
/** Simple 0.4s opacity fade with no movement. */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

/** 0.5s fade combined with a 20px upward rise. */
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/** 0.4s fade combined with a 12px downward drop into place. */
export const fadeInDown = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

/** 0.4s fade combined with a 16px slide in from the left. */
export const fadeInLeft = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

/** 0.4s fade combined with a 16px slide in from the right. */
export const fadeInRight = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// ── Scale ──
/** 0.35s fade combined with a subtle 0.95 → 1 scale-up. */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ── Card Hover ──
/** Hover interaction for cards: lifts the card 4px and scales it to 1.02. */
export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// ── Slide in from side (for sidebar) ──
/** 0.5s slide-in from the left, used for the dashboard sidebar. */
export const slideInLeft = {
  hidden: { x: -40, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ── Page transition ──
/** Spring-free page transition: 8px vertical offset with a 0.25s cross-fade. */
export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: "easeInOut" },
};

// ── Notification pop ──
/** Notifications pop in with a spring, scaling from 0.8 and dropping 8px from the top. */
export const notificationPop = {
  initial: { opacity: 0, scale: 0.8, y: -8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8, y: -8 },
  transition: { type: "spring", stiffness: 400, damping: 25 },
};
