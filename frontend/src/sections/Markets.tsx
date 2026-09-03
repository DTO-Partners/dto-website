import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import WorldMapComponent from "@/components/WorldMap";

export default function InternationalReach() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInView = useInView(mapRef, { once: true, amount: 0.22 });
  const reduced = useReducedMotion();

  return (
    <section id="Markets" className="relative overflow-hidden bg-[#0d0d0c] px-5 py-24 text-[#f2efe7] md:px-8 md:py-28 lg:px-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_14%,rgba(199,149,75,.2),transparent_26%),linear-gradient(180deg,#0d0d0c,rgba(18,17,15,.96)_42%,#0d0d0c)]" />
      <div className="mx-auto max-w-[1500px]">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c7954b]">
              Global network
            </p>
            <motion.h2
              initial={false}
              animate={reduced ? undefined : { y: [12, 0] }}
              transition={{ duration: 0.76, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 text-[clamp(4rem,9vw,10rem)] font-semibold uppercase leading-[0.82] tracking-normal"
            >
              <span className="block">From</span>
              <span className="block text-[#c7954b]">Europe</span>
            </motion.h2>
          </div>
          <motion.h3
            initial={false}
            animate={reduced ? undefined : { y: [12, 0] }}
            transition={{ duration: 0.76, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(3.6rem,8vw,8.75rem)] font-semibold uppercase leading-[0.84] tracking-normal lg:text-right"
          >
            <span className="block">To the</span>
            <span className="block">Middle East.</span>
          </motion.h3>
        </div>

        <motion.div ref={mapRef} className="relative z-10 mt-8 lg:-mt-20">
          <WorldMapComponent autoTour={mapInView} />
        </motion.div>
      </div>
    </section>
  );
}
