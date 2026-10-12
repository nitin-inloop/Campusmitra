import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function AnimatedText({ text, className = "" }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-0.5 h-6 bg-current ml-1"
      />
    </span>
  );
}

export function LetterSwapHover({ text, className = "" }) {
  const letters = text.split("");

  return (
    <div className={`inline-flex ${className}`}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className="inline-block"
          whileHover={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 0.5,
            delay: index * 0.05,
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </div>
  );
}

export function GradientText({ text, className = "", gradient = "from-blue-600 via-purple-600 to-pink-600" }) {
  return (
    <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`}>
      {text}
    </span>
  );
}


