import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Particle component
interface ParticleProps {
  index: number;
}

const Particle: React.FC<ParticleProps> = ({ index }) => {
  const size = Math.random() * 3 + 1; // Smaller particles
  const opacity = Math.random() * 0.4 + 0.1;
  const top = Math.random() * 100;
  const left = Math.random() * 100;
  const animationDelay = Math.random() * 5;
  const animationDuration = Math.random() * 20 + 10;

  return (
    <motion.div
      key={index}
      className="absolute rounded-full bg-primary/40"
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      transition={{ duration: 1.5, delay: animationDelay * 0.2 }}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top: `${top}%`,
        left: `${left}%`,
        boxShadow: `0 0 ${size * 2}px 0px rgba(20, 184, 166, 0.3)`,
        animation: `pulse-slow ${animationDuration}s infinite alternate`,
        animationDelay: `${animationDelay}s`,
      }}
    />
  );
};

// Floating Shape Component with custom motion animations
interface FloatingShapeProps {
  shape: "circle" | "square" | "triangle" | "blob";
  size: number;
  position: { top?: string; left?: string; right?: string; bottom?: string };
  color: string;
  delay: number;
  duration: number;
  blur?: number;
}

const FloatingShape: React.FC<FloatingShapeProps> = ({
  shape,
  size,
  position,
  color,
  delay,
  duration,
  blur = 60,
}) => {
  let ShapeElement;

  // SVG shapes for more interesting visuals
  if (shape === "circle") {
    ShapeElement = (
      <motion.div
        className="rounded-full absolute"
        style={{
          width: size,
          height: size,
          background: color,
          filter: `blur(${blur}px)`,
          opacity: 0.15,
        }}
        animate={{
          y: ["0%", "10%", "-5%", "0%"],
          scale: [1, 1.05, 0.95, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
    );
  } else if (shape === "square") {
    ShapeElement = (
      <motion.div
        className="absolute rounded-lg"
        style={{
          width: size,
          height: size,
          background: color,
          filter: `blur(${blur}px)`,
          opacity: 0.15,
        }}
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
    );
  } else if (shape === "triangle") {
    ShapeElement = (
      <motion.div
        className="absolute"
        style={{
          width: size,
          height: size,
          background: color,
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          filter: `blur(${blur}px)`,
          opacity: 0.15,
        }}
        animate={{
          rotate: [0, 15, -15, 0],
          y: ["0%", "15%", "-5%", "0%"],
        }}
        transition={{
          duration,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
    );
  } else if (shape === "blob") {
    // Random blob using border-radius
    const randomBorderRadius = () => {
      return `${30 + Math.random() * 40}% ${30 + Math.random() * 40}% ${
        30 + Math.random() * 40
      }% ${30 + Math.random() * 40}% / ${30 + Math.random() * 40}% ${
        30 + Math.random() * 40
      }% ${30 + Math.random() * 40}% ${30 + Math.random() * 40}%`;
    };

    const radius1 = randomBorderRadius();
    const radius2 = randomBorderRadius();

    ShapeElement = (
      <motion.div
        className="absolute"
        style={{
          width: size,
          height: size,
          background: color,
          borderRadius: radius1,
          filter: `blur(${blur}px)`,
          opacity: 0.15,
        }}
        animate={{
          borderRadius: [radius1, radius2, radius1],
          scale: [1, 1.1, 0.9, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: duration * 1.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
    );
  }

  return (
    <motion.div
      className="absolute"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay }}
      style={{
        ...position,
      }}
    >
      {ShapeElement}
    </motion.div>
  );
};

// Grid Lines Component
const GridLines = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden opacity-[0.03] pointer-events-none">
      <div className="absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white to-transparent"></div>
      <div className="absolute left-1/4 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white to-transparent"></div>
      <div className="absolute left-2/4 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white to-transparent"></div>
      <div className="absolute left-3/4 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white to-transparent"></div>
      <div className="absolute right-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white to-transparent"></div>

      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
      <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
      <div className="absolute top-2/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
      <div className="absolute top-3/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
    </div>
  );
};

// Main Background Elements Component
const BackgroundElements: React.FC = () => {
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    // Generate random number of particles
    const particleCount = Math.floor(Math.random() * 30) + 30;
    setParticles(Array.from({ length: particleCount }, (_, i) => i));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background to-background"></div>

      {/* Grid lines for subtle structure */}
      <GridLines />

      {/* Particles */}
      {particles.map((p, index) => (
        <Particle key={index} index={index} />
      ))}

      {/* Floating Shapes - larger more colorful blobs */}
      <FloatingShape
        shape="blob"
        size={500}
        position={{ top: "-5%", left: "-5%" }}
        color="hsl(175, 84%, 45%)"
        delay={0}
        duration={20}
        blur={100}
      />
      <FloatingShape
        shape="blob"
        size={400}
        position={{ bottom: "-10%", right: "-5%" }}
        color="hsl(229, 48%, 42%)"
        delay={0.5}
        duration={25}
        blur={80}
      />
      <FloatingShape
        shape="circle"
        size={300}
        position={{ top: "30%", right: "10%" }}
        color="hsl(262, 83%, 58%)"
        delay={1}
        duration={18}
        blur={70}
      />
      <FloatingShape
        shape="triangle"
        size={200}
        position={{ bottom: "20%", left: "15%" }}
        color="hsl(340, 82%, 52%)"
        delay={1.5}
        duration={22}
        blur={60}
      />

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-background opacity-50"></div>
    </div>
  );
};

export default BackgroundElements;
