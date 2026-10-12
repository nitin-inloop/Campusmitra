import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function Button({
  children,
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  const variants = {
    default: "bg-white text-black hover:bg-white/90",
    outline: "border border-white/20 hover:bg-white hover:text-black",
    ghost: "hover:bg-white/10",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    default: "px-6 py-3 text-sm",
    sm: "px-4 py-2 text-xs",
    lg: "px-8 py-4 text-base",
    icon: "p-3",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-widest",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
