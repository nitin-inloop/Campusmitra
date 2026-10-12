import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function Card({ children, className, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-3xl border border-white/[0.05] bg-[#0A0A0A] transition-all duration-300 relative overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn("flex flex-col space-y-2 p-8", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3
      className={cn("text-3xl font-display font-medium tracking-tight text-white", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p className={cn("text-sm font-light text-[#888]", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn("p-8 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div className={cn("flex items-center p-8 pt-0", className)} {...props}>
      {children}
    </div>
  );
}
