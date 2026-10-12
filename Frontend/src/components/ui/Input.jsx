import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function Input({ className, type = "text", ...props }) {
  return (
    <motion.input
      type={type}
      whileFocus={{ scale: 1.01 }}
      className={cn(
        "flex h-12 w-full rounded-2xl border border-white/[0.1] bg-[#0A0A0A] px-5 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-white/[0.3] focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
        className
      )}
      {...props}
    />
  );
}
