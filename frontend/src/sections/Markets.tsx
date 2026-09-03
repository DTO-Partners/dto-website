import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import WorldMapComponent from "@/components/WorldMap";

export default function InternationalReach() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInView = useInView(mapRef, { once: true, amount: 0.18 });
  const reduced = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section id="Markets" className="relative overflow-hidden bg-[#0d0d0c] px-5 py-16 text-[#f2efe7] md:px-8 md:py-20 lg:px-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_48%,rgba(199,149,75,.13),transparent_30%),linear-gradient(180deg,#0d0d0c,rgba(18,17,15,.98)_46%,#090908)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#080807]" />

      <div className="relative mx-auto grid min-h-svh max-w-[1500px] grid-rows-[auto_1fr] gap-6 pt-20 md:pt-24 lg:pt-24">
        <div className="relative z-20 grid gap-6 lg:grid-cols-[0.42fr_1fr] lg:items-end">
          <motion.h2
            initial={reduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: reduced ? 0.01 : 0.5, delay: 0.18, ease }}
            className="max-w-[54rem] text-[clamp(2.9rem,5.5vw,6.1rem)] font-semibold uppercase leading-[0.88] tracking-normal lg:justify-self-start"
          >
            <motion.span
              className="block overflow-hidden"
              initial={reduced ? false : { y: "108%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: reduced ? 0.01 : 0.72, delay: 0.22, ease }}
            >
              From Europe
            </motion.span>
            <motion.span
              className="block overflow-hidden text-[#c7954b]"
              initial={reduced ? false : { y: "108%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: reduced ? 0.01 : 0.72, delay: 0.34, ease }}
            >
              To the Middle East.
            </motion.span>
          </motion.h2>
        </div>

        <motion.div
          ref={mapRef}
          initial={reduced ? false : { opacity: 0, y: 30, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ duration: reduced ? 0.01 : 0.9, delay: 0.52, ease }}
          className="relative z-10 min-h-0 lg:-mt-10"
        >
          <WorldMapComponent autoTour={mapInView} />
        </motion.div>
      </div>
    </section>
  );
}
