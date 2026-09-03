import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import financeImage from "@/assets/pic_three.png";
import foodImage from "@/assets/pic_four.png";
import techImage from "@/assets/pic_two.png";
import healthImage from "@/assets/pic_five.png";

const keys = ["finance", "foodEngineering", "itCybersecurity", "healthcare"] as const;

const imageByKey = {
  finance: financeImage,
  foodEngineering: foodImage,
  itCybersecurity: techImage,
  healthcare: healthImage,
};

const titleLines = {
  finance: ["FINANCE"],
  foodEngineering: ["FOOD", "ENGINEERING"],
  itCybersecurity: ["IT &", "CYBERSECURITY"],
  healthcare: ["HEALTHCARE"],
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function Values() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const activeIndexRef = useRef(0);
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.02, 1.1]);
  const glowX = useTransform(scrollYProgress, [0, 1], reduced ? ["30%", "30%"] : ["8%", "70%"]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (reduced) return;
    const nextIndex = Math.min(keys.length - 1, Math.max(0, Math.floor(latest * keys.length)));
    if (nextIndex !== activeIndexRef.current) {
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    }
  });

  const items = keys.map((key) => ({
    key,
    title: t(`industries.sections.${key}.title`),
    subtitle: t(`industries.sections.${key}.subtitle`),
    services: t(`industries.sections.${key}.keyServices`, { returnObjects: true }) as string[],
    image: imageByKey[key],
    lines: titleLines[key],
  }));
  const active = items[activeIndex];

  return (
    <section ref={sectionRef} id="Industries" className="relative bg-[#0d0d0c] text-[#f2efe7] lg:h-[400svh] motion-reduce:lg:h-auto">
      <div className="sticky top-0 hidden min-h-svh overflow-hidden lg:grid lg:grid-cols-[minmax(0,1fr)_42vw] motion-reduce:lg:hidden">
        <motion.div
          style={{ x: glowX }}
          className="pointer-events-none absolute top-[12%] h-[44rem] w-[44rem] rounded-full bg-[#c7954b]/16 blur-[120px]"
        />

        <div className="relative z-10 flex min-h-svh flex-col justify-between px-12 py-28">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.28em] text-[#c7954b]">
            <span>Expertise</span>
            <span>{String(activeIndex + 1).padStart(2, "0")} / 04</span>
          </div>

          <div className="min-h-[46vh]">
            <motion.div
              key={active.key}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0.01 : 0.36, ease }}
            >
              <p className="mb-8 max-w-md text-xl text-[#cfc5b6]">{active.subtitle}</p>
              <h2 className="max-w-5xl text-[clamp(5.5rem,10.2vw,12rem)] font-semibold uppercase leading-[0.82] tracking-normal">
                {active.lines.map((line, index) => (
                  <span key={`${active.key}-${line}`} className="block overflow-hidden pb-[0.04em]">
                    <motion.span
                      initial={reduced ? false : { y: "112%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: reduced ? 0.01 : 0.52, delay: index * 0.08, ease }}
                      className="block"
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h2>
            </motion.div>
          </div>

          <div className="min-h-16">
            <motion.div
              key={`${active.key}-services`}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0.01 : 0.32, ease }}
              className="grid max-w-2xl grid-cols-3 gap-4 text-sm text-[#cfc5b6]"
            >
              {active.services.map((service) => (
                <span key={service}>{service}</span>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="relative min-h-svh overflow-hidden">
          {items.map((item, index) => (
            <motion.img
              key={item.key}
              src={item.image}
              alt=""
              aria-hidden="true"
              style={{ scale: imageScale }}
              animate={{ opacity: activeIndex === index ? 0.72 : 0 }}
              transition={{ duration: reduced ? 0.01 : 0.82, ease }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ))}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0d0d0c_0%,rgba(13,13,12,.4)_44%,rgba(13,13,12,.78)_100%)]" />
          <div className="absolute bottom-12 left-12 right-12">
            <div className="mb-6 grid grid-cols-4 gap-2">
              {items.map((item, index) => (
                <div key={item.key} className="grid gap-2" aria-hidden="true">
                  <span className="font-mono text-xs text-white/52">{String(index + 1).padStart(2, "0")}</span>
                  <span className={`h-px transition ${index <= activeIndex ? "bg-[#c7954b]" : "bg-white/24"}`} />
                </div>
              ))}
            </div>
            <a
              href="mailto:business@dtopartners.com"
              className="group inline-flex min-h-12 items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#f2efe7] transition hover:text-[#c7954b]"
            >
              Discuss search
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>
        </div>
      </div>

      <div className="grid gap-16 px-5 py-24 md:px-8 lg:hidden motion-reduce:lg:grid">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c7954b]">Expertise</p>
        {items.map((item, index) => (
          <article key={item.key} className="grid gap-6">
            <p className="text-sm text-[#c7954b]">{String(index + 1).padStart(2, "0")} / 04</p>
            <h2 className="text-[clamp(3.4rem,16vw,6.5rem)] font-semibold uppercase leading-[0.86]">{item.title}</h2>
            <div className="relative h-[52svh] min-h-[360px] overflow-hidden">
              <img src={item.image} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-75" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(13,13,12,.82))]" />
            </div>
            <p className="text-xl text-[#cfc5b6]">{item.subtitle}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
