import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

type StageWordProps = {
  eyebrow: string;
  word: string;
  progress: MotionValue<number>;
  range: [number, number, number, number];
  className?: string;
  wordClassName?: string;
};

function StageWord({ eyebrow, word, progress, range, className = "", wordClassName = "" }: StageWordProps) {
  const reduced = useReducedMotion();
  const opacity = useTransform(progress, range, reduced ? [1, 1, 1, 1] : [0, 1, 1, 0]);
  const y = useTransform(progress, range, reduced ? [0, 0, 0, 0] : [48, 0, 0, -48]);
  const clipPath = useTransform(progress, range, [
    "inset(100% 0 0 0)",
    "inset(0% 0 0 0)",
    "inset(0% 0 0 0)",
    "inset(0 0 100% 0)",
  ]);

  return (
    <motion.div style={{ opacity, y }} className={`absolute left-0 right-0 ${className}`}>
      <motion.div style={{ clipPath }} className="overflow-hidden">
        <p className="mb-5 text-[clamp(1.1rem,2.2vw,2.6rem)] font-semibold uppercase leading-none tracking-[0.04em] text-[#11100e]/72 md:mb-6">
          {eyebrow}
        </p>
        <h2 className="text-[clamp(4.6rem,12vw,13rem)] font-semibold uppercase leading-[0.78] tracking-normal">
          <span className="block">WE CONNECT</span>
          <span className={`block ${wordClassName}`}>{word}</span>
        </h2>
      </motion.div>
    </motion.div>
  );
}

function FloatingLabel({
  children,
  className,
  progress,
}: {
  children: string;
  className: string;
  progress: MotionValue<number>;
}) {
  const reduced = useReducedMotion();
  const opacity = useTransform(progress, [0.28, 0.4, 0.62, 0.72], reduced ? [1, 1, 1, 1] : [0, 1, 1, 0]);
  const y = useTransform(progress, [0.28, 0.45, 0.72], reduced ? [0, 0, 0] : [22, 0, -18]);

  return (
    <motion.p
      style={{ opacity, y }}
      className={`pointer-events-none absolute text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#8f6a3b] md:text-xs ${className}`}
    >
      {children}
    </motion.p>
  );
}

function ProgressSegment({ label, index, progress }: { label: string; index: number; progress: MotionValue<number> }) {
  const scaleX = useTransform(progress, [index / 3, (index + 1) / 3], [0, 1]);

  return (
    <div className="grid gap-2">
      <span>{label}</span>
      <motion.span className="h-px origin-left bg-[#8f6a3b]" style={{ scaleX }} />
    </div>
  );
}

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const mapOpacity = useTransform(scrollYProgress, [0, 0.28, 0.58, 0.82, 1], reduced ? [0.32, 0.32, 0.32, 0.32, 0.32] : [0.1, 0.14, 0.28, 0.56, 0.72]);
  const mapScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [0.96, 1.08]);
  const mapX = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["5%", "-3%"]);
  const peopleAccent = useTransform(scrollYProgress, [0.02, 0.18], reduced ? [0, 0] : [24, 0]);
  const marketsOpacity = useTransform(scrollYProgress, [0.62, 0.74, 1], reduced ? [1, 1, 1] : [0, 1, 1]);
  const arcProgress = useTransform(scrollYProgress, [0.68, 0.86], reduced ? [1, 1] : [1, 0]);

  return (
    <section ref={ref} id="AboutUs" className="relative h-[285svh] bg-[#f1ede3] text-[#11100e]">
      <div className="sticky top-0 h-svh overflow-hidden px-5 md:px-8 lg:px-12">
        <motion.div
          style={{ opacity: mapOpacity, scale: mapScale, x: mapX }}
          className="pointer-events-none absolute inset-0 [background-image:url('/europe.svg')] [background-position:56%_52%] [background-repeat:no-repeat] [background-size:min(142vw,1500px)]"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_14%,rgba(199,149,75,.22),transparent_26%),linear-gradient(115deg,rgba(241,237,227,.92)_0%,rgba(241,237,227,.62)_42%,rgba(241,237,227,.28)_100%)]" />

        <div className="relative z-10 mx-auto grid h-full max-w-[1500px] grid-rows-[auto_1fr_auto] py-24 md:py-28">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.28em] text-[#8f6a3b]">
            <span>02 / What we do</span>
            <span>People / Industries / Markets</span>
          </div>

          <div className="relative min-h-0">
            <StageWord
              eyebrow="Talent starts with"
              word="PEOPLE."
              progress={scrollYProgress}
              range={[0, 0.08, 0.25, 0.36]}
              className="top-[14%] md:top-[12%]"
              wordClassName="text-[clamp(5.8rem,15vw,16.5rem)]"
            />
            <StageWord
              eyebrow="Across specialized"
              word="INDUSTRIES."
              progress={scrollYProgress}
              range={[0.3, 0.42, 0.56, 0.68]}
              className="top-[20%] md:left-[7%] md:top-[18%]"
              wordClassName="text-[clamp(4.5rem,10.6vw,12rem)]"
            />
            <StageWord
              eyebrow="From Europe to the Middle East"
              word="MARKETS."
              progress={scrollYProgress}
              range={[0.62, 0.74, 0.98, 1]}
              className="top-[18%] md:top-[12%]"
              wordClassName="text-[clamp(6rem,16vw,18rem)] text-[#11100e]"
            />

            <motion.div
              style={{ y: peopleAccent }}
              className="absolute bottom-[18%] left-0 max-w-[16rem] text-xs font-semibold uppercase tracking-[0.24em] text-[#8f6a3b] md:bottom-[16%]"
            >
              Poland based.
              <br />
              International search.
            </motion.div>

            <FloatingLabel progress={scrollYProgress} className="left-[3%] top-[9%]" children="Finance 01" />
            <FloatingLabel progress={scrollYProgress} className="right-[8%] top-[22%]" children="Food Engineering 02" />
            <FloatingLabel progress={scrollYProgress} className="left-[12%] bottom-[20%]" children="IT & Cybersecurity 03" />
            <FloatingLabel progress={scrollYProgress} className="right-[16%] bottom-[14%]" children="Healthcare 04" />

            <motion.div style={{ opacity: marketsOpacity }} className="pointer-events-none absolute inset-0">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 680" preserveAspectRatio="none" aria-hidden="true">
                <motion.path
                  d="M560 312 C 690 210, 825 260, 968 405"
                  fill="none"
                  stroke="#8f6a3b"
                  strokeWidth="1.5"
                  strokeDasharray="1"
                  pathLength="1"
                  style={{ strokeDashoffset: arcProgress }}
                  strokeLinecap="round"
                />
                <motion.circle cx="560" cy="312" r="6" fill="#8f6a3b" />
                <motion.circle cx="968" cy="405" r="6" fill="#8f6a3b" />
              </svg>
              <div className="absolute left-[42%] top-[45%] -translate-x-1/2 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#8f6a3b]">
                Poland
                <br />
                52.2297 N
                <br />
                21.0122 E
              </div>
              <div className="absolute right-[8%] top-[58%] text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#8f6a3b] md:right-[14%]">
                UAE
                <br />
                Dubai
                <br />
                Middle East
              </div>
              <div className="absolute bottom-[9%] right-0 text-right text-xs font-semibold uppercase tracking-[0.28em] text-[#11100e]/70">
                Europe ↔ Middle East
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#11100e]/45 md:max-w-xl">
            {["People", "Industries", "Markets"].map((label, index) => (
              <ProgressSegment key={label} label={label} index={index} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
