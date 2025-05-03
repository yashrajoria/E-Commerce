import React, { useRef, useEffect } from "react";

const Logo3D = () => {
  const logoRef = useRef<HTMLDivElement>(null);

  // Simple perspective tilt effect
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
        rotateY(${x * 10}deg)
        rotateX(${-y * 10}deg)
        translateZ(20px)
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
      className="flex flex-col items-center transition-transform duration-200 ease-out cursor-pointer"
    >
      <div className="relative">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden animate-spin">
          {/* Inner cube */}
          <div className="w-12 h-12 bg-gradient-to-tr from-teal-400 to-blue-600 rounded-lg absolute animate-pulse"></div>

          {/* Reflection effect */}
          <div className="absolute inset-0 bg-white/20 top-0 left-0 w-full h-1/2 transform -skew-y-12"></div>
        </div>

        {/* Shadow */}
        <div className="w-16 h-2 bg-black/20 rounded-full blur-md mx-auto mt-4"></div>
      </div>

      {/* Text */}
      <h2 className="mt-4 text-2xl font-bold tracking-tight text-gradient">
        Admin Panel
      </h2>
    </div>
  );
};

export default Logo3D;
