import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { WorldMap } from "react-svg-worldmap";

type StageWordProps = {
  eyebrow: string;
  word: string;
  progress: MotionValue<number>;
  range: [number, number, number, number];
  className?: string;
  verbClassName?: string;
  wordClassName?: string;
};

function StageWord({ eyebrow, word, progress, range, className = "", verbClassName = "", wordClassName = "" }: StageWordProps) {
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
        <p className="mb-5 text-[clamp(0.95rem,1.7vw,1.7rem)] font-semibold uppercase leading-none tracking-[0.04em] text-[#11100e]/72 md:mb-6">
          {eyebrow}
        </p>
        <h2 className="font-semibold uppercase leading-[0.78] tracking-normal">
          <span className={`block ${verbClassName}`}>WE CONNECT</span>
          <span className={`block ${wordClassName}`}>{word}</span>
        </h2>
      </motion.div>
    </motion.div>
  );
}

function RegionalMapBackdrop() {
  const highlightedCountries = [
    { country: "pl", value: 1 },
    { country: "ae", value: 1 },
    { country: "sa", value: 1 },
  ];

  return (
    <div className="about-regional-map pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <WorldMap
        title=""
        valueSuffix=""
        color="#c99a57"
        size={980}
        data={highlightedCountries}
        frame={false}
        styleFunction={(context) => {
          const country = context.countryCode?.toLowerCase() || "";
          const active = country === "pl" || country === "ae";
          const supporting = country === "sa";

          return {
            fill: active ? "#ad8751" : supporting ? "#d2bf92" : "#c5cbc8",
            stroke: "rgba(255,255,255,.72)",
            strokeWidth: active ? 0.85 : 0.45,
            opacity: active ? 0.92 : supporting ? 0.72 : 0.58,
            pointerEvents: "none",
          };
        }}
      />
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

  const mapOpacity = useTransform(scrollYProgress, [0, 0.24, 0.52, 0.78, 1], reduced ? [0.62, 0.62, 0.62, 0.62, 0.62] : [0.3, 0.42, 0.56, 0.72, 0.76]);
  const mapScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [0.98, 1.03]);
  const mapX = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["1.5%", "-1%"]);
  const peopleAccent = useTransform(scrollYProgress, [0.02, 0.18], reduced ? [0, 0] : [16, 0]);
  const peopleAccentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.36], reduced ? [1, 1, 1] : [1, 1, 0]);
  const marketsOpacity = useTransform(scrollYProgress, [0.58, 0.7, 1], reduced ? [1, 1, 1] : [0, 1, 1]);
  const arcProgress = useTransform(scrollYProgress, [0.66, 0.84], reduced ? [1, 1] : [1, 0]);

  return (
    <section ref={ref} id="AboutUs" className="relative h-[260svh] bg-[#f1ede3] text-[#11100e]">
      <div className="sticky top-0 h-svh overflow-hidden px-5 md:px-8 lg:px-12">
        <motion.div style={{ opacity: mapOpacity, scale: mapScale, x: mapX }} className="pointer-events-none absolute inset-0">
          <RegionalMapBackdrop />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(241,237,227,.84)_0%,rgba(241,237,227,.48)_42%,rgba(241,237,227,.18)_100%)]" />

        <div className="relative z-10 mx-auto grid h-full max-w-[1500px] grid-rows-[1fr] py-[clamp(5.5rem,10svh,7.5rem)]">
          <div className="relative min-h-0">
            <StageWord
              eyebrow="Talent starts with"
              word="PEOPLE."
              progress={scrollYProgress}
              range={[0, 0.08, 0.25, 0.36]}
              className="top-[10%] md:top-[8%]"
              verbClassName="text-[clamp(2.9rem,7.2vw,7.7rem)]"
              wordClassName="text-[clamp(4rem,10.5vw,11.6rem)]"
            />
            <StageWord
              eyebrow="Across specialized"
              word="INDUSTRIES."
              progress={scrollYProgress}
              range={[0.3, 0.42, 0.56, 0.68]}
              className="top-[19%] md:left-[4%] md:top-[16%] md:max-w-[74rem]"
              verbClassName="text-[clamp(2.5rem,5.6vw,6.2rem)]"
              wordClassName="text-[clamp(3.1rem,6.9vw,7.6rem)]"
            />
            <StageWord
              eyebrow="From Europe to the Middle East"
              word="MARKETS."
              progress={scrollYProgress}
              range={[0.62, 0.74, 0.98, 1]}
              className="top-[12%] md:top-[9%]"
              verbClassName="text-[clamp(2.7rem,6.2vw,6.8rem)]"
              wordClassName="text-[clamp(4rem,10.4vw,11.4rem)] text-[#11100e]"
            />

            <motion.div
              style={{ y: peopleAccent, opacity: peopleAccentOpacity }}
              className="absolute bottom-[11%] left-0 max-w-[16rem] text-xs font-semibold uppercase tracking-[0.24em] text-[#8f6a3b] md:bottom-[12%]"
            >
              Poland based.
              <br />
              International search.
            </motion.div>

            <motion.div style={{ opacity: marketsOpacity }} className="pointer-events-none absolute inset-0">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <motion.path
                  d="M54.2 41.8 C 62 43.5, 69.5 50.5, 76.2 63.5"
                  fill="none"
                  stroke="#8f6a3b"
                  strokeWidth="0.18"
                  strokeDasharray="1"
                  pathLength="1"
                  style={{ strokeDashoffset: arcProgress }}
                  strokeLinecap="round"
                />
                <motion.circle cx="54.2" cy="41.8" r="0.62" fill="#8f6a3b" />
                <motion.circle cx="76.2" cy="63.5" r="0.62" fill="#8f6a3b" />
              </svg>
              <div className="absolute left-[52.2%] top-[37.2%] -translate-x-full text-right text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#8f6a3b]">
                Poland
                <br />
                52.2297 N
                <br />
                21.0122 E
              </div>
              <div className="absolute left-[77.5%] top-[61%] text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#8f6a3b]">
                UAE
                <br />
                Dubai
                <br />
                Middle East
              </div>
              <div className="absolute bottom-[8%] right-0 text-right text-xs font-semibold uppercase tracking-[0.28em] text-[#11100e]/70">
                Europe ↔ Middle East
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
