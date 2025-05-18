import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const Logo3D = () => {
  const logoRef = useRef<HTMLDivElement>(null);

  // Hover effect with 3D perspective tilt
  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = logo.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      // Apply the tilt effect using CSS transform
      logo.style.transform = `
        perspective(1000px)
        rotateY(${x * 15}deg)
        rotateX(${-y * 15}deg)
        translateZ(30px)
      `;
    };

    const handleMouseLeave = () => {
      // Reset the transform when mouse leaves
      logo.style.transform = `
        perspective(1000px)
        rotateY(0deg)
        rotateX(0deg)
        translateZ(0px)
      `;
    };

    logo.addEventListener("mousemove", handleMouseMove);
    logo.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      logo.removeEventListener("mousemove", handleMouseMove);
      logo.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={logoRef}
      className="flex flex-col items-center transition-transform duration-300 ease-out cursor-pointer"
    >
      <div className="relative">
        {/* Main cube */}
        <motion.div
          className="w-20 h-20 bg-gradient-to-br from-teal-400 to-blue-600 rounded-xl flex items-center justify-center shadow-xl relative overflow-hidden"
          animate={{ rotateY: 360 }}
          transition={{
            duration: 10,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          {/* Inner elements */}
          <div className="absolute inset-0">
            <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full opacity-50"></div>
            <div className="absolute bottom-2 left-2 w-2 h-2 bg-white rounded-full opacity-30"></div>
          </div>

          {/* Inner cube */}
          <motion.div
            className="w-10 h-10 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-lg absolute"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
            }}
          />

          {/* Floating dots */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute w-1.5 h-1.5 bg-white rounded-full"
              animate={{
                y: [0, -8, 0],
                x: [0, 5, 0],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ top: "70%", left: "30%" }}
            />
            <motion.div
              className="absolute w-1 h-1 bg-white rounded-full"
              animate={{
                y: [0, 5, 0],
                x: [0, -3, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              style={{ top: "40%", right: "30%" }}
            />
            <motion.div
              className="absolute w-2 h-2 bg-white rounded-full"
              animate={{
                y: [0, 6, 0],
                x: [0, 3, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              style={{ bottom: "30%", right: "40%" }}
            />
          </div>

          {/* Reflection effect */}
          <div className="absolute inset-0 bg-white/20 top-0 left-0 w-full h-1/3 transform -skew-y-12"></div>
        </motion.div>

        {/* Glow effect */}
        <div className="absolute inset-0 -z-10 blur-xl bg-primary/20 rounded-full transform scale-75 opacity-60"></div>

        {/* Shadow */}
        <div className="w-16 h-2 bg-black/20 rounded-full blur-md mx-auto mt-4"></div>
      </div>

      {/* Text */}
      <h2 className="mt-4 text-2xl font-bold tracking-tight text-gradient">
        Admin Pro
      </h2>
    </div>
  );
};

export default Logo3D;
