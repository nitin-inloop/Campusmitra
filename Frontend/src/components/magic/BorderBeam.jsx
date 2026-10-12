import { motion } from "framer-motion";

export function BorderBeam({ className, size = 200, duration = 15, anchor = 90, borderWidth = 1.5, colorFrom = "#ffaa40", colorTo = "#9c40ff" }) {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": duration,
          "--anchor": anchor,
          "--border-width": borderWidth,
          "--color-from": colorFrom,
          "--color-to": colorTo,
        } 
      }
      className={`pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent] ${className}`}
    >
      <motion.div
        className="absolute -inset-[2px] rounded-[inherit] bg-[linear-gradient(var(--anchor),var(--color-from),transparent,var(--color-to))] opacity-[0.6] blur-[2px]"
        animate={{
          backgroundPosition: ["0% 0%", `${size * 2}% ${size * 2}%`],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration,
          ease: "linear",
        }}
        style={{
          backgroundSize: `${size}% ${size}%`,
        }}
      />
      <motion.div
        className="absolute -inset-[2px] rounded-[inherit] bg-[linear-gradient(var(--anchor),var(--color-from),transparent,var(--color-to))] opacity-[0.6] blur-[2px]"
        animate={{
          backgroundPosition: [`${size * 2}% ${size * 2}%`, "0% 0%"],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration,
          ease: "linear",
        }}
        style={{
          backgroundSize: `${size}% ${size}%`,
        }}
      />
    </div>
  );
}


