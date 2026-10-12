import { cn } from "../../lib/utils";

export function Badge({ children, className, variant = "default", ...props }) {
  const variants = {
    default: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900",
    success: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
    warning: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white",
    destructive: "bg-gradient-to-r from-red-500 to-rose-500 text-white",
    outline: "border-2 border-gray-300 bg-transparent text-gray-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors shadow-sm",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}


