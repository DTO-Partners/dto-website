import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import WorldMapComponent from "@/components/WorldMap";
import { ArrowLeftRight } from "lucide-react";

export default function InternationalReach() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInView = useInView(mapRef, { once: true, amount: 0.18 });
  const reduced = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section id="Markets" className="relative overflow-hidden bg-[#0d0d0c] px-5 py-14 text-[#f2efe7] md:px-8 md:py-18 lg:px-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_66%_50%,rgba(199,149,75,.18),transparent_32%),radial-gradient(circle_at_28%_24%,rgba(242,239,231,.055),transparent_24%),linear-gradient(180deg,#0d0d0c,rgba(20,18,15,.98)_46%,#090908)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-[#080807]" />

      <div className="relative mx-auto grid min-h-svh max-w-[1540px] grid-rows-[auto_1fr] gap-4 pt-40 md:pt-32 lg:pt-28">
        <div className="relative z-20 grid gap-8 lg:grid-cols-[minmax(20rem,0.36fr)_1fr] lg:items-start">
          <motion.h2
            initial={reduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: reduced ? 0.01 : 0.5, delay: 0.18, ease }}
            className="max-w-[34rem] text-[clamp(3.25rem,6vw,6.2rem)] font-semibold uppercase leading-[0.88] tracking-normal lg:justify-self-start"
          >
            <motion.span
              className="block overflow-hidden"
              initial={reduced ? false : { y: "108%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: reduced ? 0.01 : 0.72, delay: 0.22, ease }}
            >
              Global
            </motion.span>
            <motion.span
              className="block overflow-hidden text-[#c7954b]"
              initial={reduced ? false : { y: "108%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: reduced ? 0.01 : 0.72, delay: 0.34, ease }}
            >
              Network.
            </motion.span>
          </motion.h2>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: reduced ? 0.01 : 0.52, delay: 0.42, ease }}
            className="grid max-w-[38rem] gap-5 self-end lg:justify-self-end lg:pt-6"
          >
            <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#f2efe7]/74">
              <span>Europe</span>
              <ArrowLeftRight className="h-4 w-4 text-[#c7954b]" strokeWidth={1.5} />
              <span>Middle East</span>
            </div>
            <div className="grid max-w-xl grid-cols-2 gap-8 border-t border-[#c7954b]/20 pt-5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#f2efe7]/48">
              <div>
                <span className="mb-2 block text-[#c7954b]">HQ</span>
                <span>Poland</span>
              </div>
              <div>
                <span className="mb-2 block text-[#c7954b]">Network</span>
                <span>Europe / Middle East</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          ref={mapRef}
          initial={reduced ? false : { opacity: 0, y: 30, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ duration: reduced ? 0.01 : 0.9, delay: 0.52, ease }}
          className="relative z-10 min-h-0 lg:-mt-16"
        >
          <WorldMapComponent autoTour={mapInView} />
        </motion.div>
      </div>
    </section>
  );
}
