import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export function NumberTicker({ value, className = "" }) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const display = useTransform(spring, (latest) => Math.round(latest));

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  return (
    <motion.span className={className}>
      {display}
    </motion.span>
  );
}


