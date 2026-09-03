import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

const premiumEase = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
};

export function Reveal({ children, className = "", delay = 0, direction = "up" }: RevealProps) {
  const reduced = useReducedMotion();
  const offset = reduced
    ? { x: 0, y: 0 }
    : {
        up: { x: 0, y: 28 },
        down: { x: 0, y: -20 },
        left: { x: 34, y: 0 },
        right: { x: -34, y: 0 },
        none: { x: 0, y: 0 },
      }[direction];

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.28, margin: "0px 0px -12% 0px" }}
      transition={{ duration: reduced ? 0.01 : 0.78, delay, ease: premiumEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type RevealLinesProps = {
  lines: string[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
};

export function RevealLines({
  lines,
  as = "h2",
  className = "",
  lineClassName = "",
  delay = 0,
  stagger = 0.1,
}: RevealLinesProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  return (
    <Component className={className}>
      {lines.map((line, index) => (
        <span key={`${line}-${index}`} className="block overflow-hidden pb-[0.04em]">
          <motion.span
            className={`block ${lineClassName}`}
            initial={reduced ? false : { y: "108%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: reduced ? 0.01 : 0.82, delay: delay + index * stagger, ease: premiumEase }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}

type RevealWordsProps = {
  text: string;
  className?: string;
  activeClassName?: string;
};

export function ScrollProgressText({ text, className = "", activeClassName = "text-[#f4efe6]" }: RevealWordsProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 78%", "end 42%"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => {
        const start = index / Math.max(words.length, 1);
        const end = Math.min(start + 0.22, 1);
        return (
          <ProgressWord
            key={`${word}-${index}`}
            word={word}
            progress={scrollYProgress}
            range={[start, end]}
            className={activeClassName}
          />
        );
      })}
    </p>
  );
}

function ProgressWord({
  word,
  progress,
  range,
  className,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  className: string;
}) {
  const reduced = useReducedMotion();
  const opacity = useTransform(progress, range, reduced ? [1, 1] : [0.24, 1]);

  return (
    <motion.span style={{ opacity }} className={`mr-[0.22em] inline-block ${className}`}>
      {word}
    </motion.span>
  );
}

export function RevealDivider({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.7 }}
      transition={{ duration: reduced ? 0.01 : 0.72, delay, ease: premiumEase }}
      className={`origin-left ${className}`}
    />
  );
}

export function RevealNumber({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={reduced ? false : { y: "115%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true, amount: 0.65 }}
        transition={{ duration: reduced ? 0.01 : 0.68, delay, ease: premiumEase }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function RevealClip({ children, className = "", delay = 0, id }: { children: ReactNode; className?: string; delay?: number; id?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { clipPath: "inset(100% 0 0 0)" }}
      whileInView={{ clipPath: "inset(0% 0 0 0)" }}
      viewport={{ once: true, amount: 0.28 }}
      transition={{ duration: reduced ? 0.01 : 0.9, delay, ease: premiumEase }}
      className={className}
      id={id}
    >
      {children}
    </motion.div>
  );
}
