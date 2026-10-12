import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "../../lib/utils";

export function MagicCard({ children, className, gradientColor = "from-blue-600 via-indigo-600 to-purple-600" }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      className={cn("group relative rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="p-6">
      <div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: isHovering
            ? `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`
            : "transparent",
        }}
      />
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}

