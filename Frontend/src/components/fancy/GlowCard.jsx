import { motion } from "framer-motion";
import { useState } from "react";

export function GlowCard({ children, className = "", glowColor = "blue" }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const glowColors = {
    blue: "rgba(59, 130, 246, 0.5)",
    purple: "rgba(139, 92, 246, 0.5)",
    pink: "rgba(236, 72, 153, 0.5)",
    green: "rgba(34, 197, 94, 0.5)",
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl blur-xl opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColors[glowColor]}, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}


