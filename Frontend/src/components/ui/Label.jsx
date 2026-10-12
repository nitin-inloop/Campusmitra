import { cn } from "../../lib/utils";

export function Label({ children, className, ...props }) {
  return (
    <label
      className={cn(
        "text-xs font-medium uppercase tracking-widest text-[#888] mb-2 block leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}
