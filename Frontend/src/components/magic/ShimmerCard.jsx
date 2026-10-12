import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function ShimmerCard({ children, className, ...props }) {
  return (
    <div className={cn("group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-8 shadow-sm", className)} {...props}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 transition duration-1000 group-hover:opacity-100 group-hover:duration-200" />
      <div className="relative bg-white rounded-xl">{children}</div>
    </div>
  );
}


