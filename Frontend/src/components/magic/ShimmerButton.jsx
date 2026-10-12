import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function ShimmerButton({ children, className, shimmerColor = "#ffffff", ...props }) {
  return (
    <motion.button
      className={cn(
        "relative z-10 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-4 py-1.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:shadow-[0_0_20px_rgba(0,163,255,0.5)]",
        className
      )}
      {...props}
    >
      <div className="absolute -z-10 inset-0 bg-gradient-to-r from-blue-600 to-indigo-600" />
      <div
        className="absolute -z-10 inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"
        style={{
          backgroundImage: `linear-gradient(to right, transparent, ${shimmerColor}20, transparent)`,
        }}
      />
      {children}
    </motion.button>
  );
}


