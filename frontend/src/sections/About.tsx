import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function StatementWord({
  children,
  progress,
  range,
  className = "",
}: {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
  className?: string;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const y = useTransform(progress, range, [34, 0]);
  const fillOpacity = useTransform(progress, range, [0, 1]);

  return (
    <motion.span style={{ opacity, y }} className={`relative block uppercase leading-[0.82] ${className}`}>
      <span className="text-transparent [-webkit-text-stroke:1px_rgba(13,13,12,.22)]">{children}</span>
      <motion.span style={{ opacity: fillOpacity }} className="absolute inset-0 text-[#11100e]">
        {children}
      </motion.span>
    </motion.span>
  );
}

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 78%", "end 24%"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [0.98, 1.02]);

  return (
    <section
      ref={ref}
      id="AboutUs"
      className="relative min-h-[145svh] overflow-hidden bg-[#f1ede3] px-5 text-[#11100e] md:px-8 lg:px-12"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(199,149,75,.25),transparent_28%),linear-gradient(145deg,rgba(13,13,12,.08),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:url('/europe.svg')] [background-position:75%_42%] [background-repeat:no-repeat] [background-size:min(76vw,980px)]" />
      <div className="sticky top-0 mx-auto grid min-h-svh max-w-[1500px] content-center py-24">
        <motion.div style={{ scale }} className="grid gap-4 font-semibold tracking-normal">
          <StatementWord progress={scrollYProgress} range={[0.02, 0.26]} className="text-[clamp(4.6rem,13vw,14rem)]">
            WE CONNECT
          </StatementWord>
          <div className="grid gap-3 md:grid-cols-[0.85fr_1fr] md:items-center">
            <StatementWord progress={scrollYProgress} range={[0.22, 0.44]} className="text-[clamp(4.2rem,12vw,13rem)] md:text-right">
              PEOPLE
            </StatementWord>
            <StatementWord progress={scrollYProgress} range={[0.4, 0.64]} className="text-[clamp(3.7rem,10vw,11rem)]">
              INDUSTRIES
            </StatementWord>
          </div>
          <StatementWord progress={scrollYProgress} range={[0.58, 0.82]} className="text-[clamp(4.8rem,15vw,16rem)] md:pl-[18vw]">
            MARKETS.
          </StatementWord>
        </motion.div>
        <motion.p
          style={{ opacity: useTransform(scrollYProgress, [0.66, 0.9], [0, 1]) }}
          className="mt-10 max-w-md text-lg leading-snug text-[#5f5549] md:ml-auto"
        >
          Headquartered in Poland. Built for international recruitment across specialized sectors.
        </motion.p>
      </div>
    </section>
  );
}
