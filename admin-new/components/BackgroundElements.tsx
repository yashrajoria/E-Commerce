import React, { useEffect, useState } from "react";

// Simple Particle component
interface ParticleProps {
  index: number;
}

const Particle: React.FC<ParticleProps> = ({ index }) => {
  const size = Math.random() * 6 + 2;
  const opacity = Math.random() * 0.5 + 0.1;
  const top = Math.random() * 100;
  const left = Math.random() * 100;
  const animationDelay = Math.random() * 5;
  const animationDuration = Math.random() * 10 + 10;

  return (
    <div
      key={index}
      className="absolute rounded-full bg-white opacity-0"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top: `${top}%`,
        left: `${left}%`,
        opacity: opacity,
        animation: `pulse-slow ${animationDuration}s infinite alternate`,
        animationDelay: `${animationDelay}s`,
      }}
    />
  );
};

// Floating Shape Component
interface FloatingShapeProps {
  shape: "circle" | "square" | "triangle";
  size: string;
  position: string;
  color: string;
  delay: string;
}

const FloatingShape: React.FC<FloatingShapeProps> = ({
  shape,
  size,
  position,
  color,
  delay,
}) => {
  let shapeElement;

  if (shape === "circle") {
    shapeElement = (
      <div className={`rounded-full ${size} ${color} opacity-30`} />
    );
  } else if (shape === "square") {
    shapeElement = <div className={`${size} ${color} opacity-30 rotate-45`} />;
  } else if (shape === "triangle") {
    shapeElement = (
      <div
        className={`${size} ${color} opacity-30`}
        style={{
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        }}
      />
    );
  }

  return (
    <div
      className="absolute animate-float"
      style={{
        ...JSON.parse(position),
        animationDelay: delay,
      }}
    >
      {shapeElement}
    </div>
  );
};

// Main Background Elements Component
const BackgroundElements: React.FC = () => {
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    // Generate random number of particles between 25-40
    const particleCount = Math.floor(Math.random() * 16) + 25;
    setParticles(Array.from({ length: particleCount }, (_, i) => i));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
      {/* Particles */}
      {particles.map((p, index) => (
        <Particle key={index} index={index} />
      ))}

      {/* Floating Shapes */}
      <FloatingShape
        shape="circle"
        size="w-24 h-24"
        position='{"top": "15%", "left": "10%"}'
        color="bg-blue-500"
        delay="-1s"
      />
      <FloatingShape
        shape="square"
        size="w-32 h-32"
        position='{"top": "60%", "left": "8%"}'
        color="bg-purple-500"
        delay="-3s"
      />
      <FloatingShape
        shape="triangle"
        size="w-40 h-40"
        position='{"top": "30%", "right": "15%"}'
        color="bg-teal-500"
        delay="-2s"
      />
      <FloatingShape
        shape="circle"
        size="w-16 h-16"
        position='{"bottom": "20%", "right": "10%"}'
        color="bg-pink-500"
        delay="-4s"
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-radial from-transparent to-background"
        style={{}}
      />
    </div>
  );
};

export default BackgroundElements;
