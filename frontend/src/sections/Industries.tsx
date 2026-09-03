import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Reveal, RevealDivider, RevealLines, RevealNumber } from "@/components/motion/Reveals";

type ProcessStep = [string, string, string];

export default function IndustriesSection() {
  const { t } = useTranslation();

  const industries = [
    t("industries.sections.finance.title"),
    t("industries.sections.foodEngineering.title"),
    t("industries.sections.itCybersecurity.title"),
    t("industries.sections.healthcare.title"),
    t("industries.sections.hospitality.title"),
  ];

  const process: ProcessStep[] = [
    ["01", "Understand", "We learn the company, role, context, and expectations before starting the search."],
    ["02", "Search", "We use DTO's international network and sector knowledge to identify relevant talent."],
    ["03", "Connect", "We create considered introductions between candidates and organizations."],
    ["04", "Build", "The goal is a successful long-term professional relationship, handled with discretion."],
  ];

  return (
    <section id="Industries" className="bg-[#f4efe6] text-[#161410]">
      <div className="mx-auto max-w-[1500px] px-5 py-24 md:px-8 md:py-32 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div>
            <Reveal direction="right">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8f6a3b]">Expertise</p>
            </Reveal>
            <Reveal delay={0.12} direction="right">
              <p className="mt-6 max-w-xs text-lg leading-relaxed text-[#5a5147]">
                Built around industries and disciplines DTO Partners already understands.
              </p>
            </Reveal>
          </div>
          <div>
            <RevealLines
              lines={["Industries with enough", "context to make", "hiring precise."]}
              className="max-w-4xl text-balance text-5xl font-semibold leading-none tracking-normal md:text-7xl"
            />
            <div className="mt-14 grid border-t border-[#161410]/18 md:grid-cols-2">
              {industries.map((industry, index) => (
                <div key={industry} className="group border-b border-[#161410]/18 py-8 md:pr-10">
                  <RevealDivider className="mb-7 h-px bg-[#8f6a3b]/60" delay={index * 0.07} />
                  <Reveal delay={index * 0.09} direction={index % 2 === 0 ? "right" : "left"}>
                    <p className="text-[clamp(2rem,5vw,4.75rem)] font-semibold leading-none tracking-normal text-[#161410] transition group-hover:text-[#8f6a3b]">
                      <span className="mr-4 align-top font-mono text-sm text-[#8f6a3b]">{String(index + 1).padStart(2, "0")}</span>
                      {industry}
                    </p>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div id="HowItWorks" className="border-t border-[#161410]/14 bg-[#e7ded1] px-5 py-24 md:px-8 md:py-32 lg:px-12">
        <ProcessExperience steps={process} />
      </div>
    </section>
  );
}

function ProcessExperience({ steps }: { steps: ProcessStep[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 30%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (reduced) return;
    const next = Math.min(steps.length - 1, Math.max(0, Math.floor(value * steps.length)));
    setActiveStep(next);
  });

  return (
    <div ref={containerRef} className="mx-auto max-w-[1500px]">
      <div className="grid gap-12 lg:grid-cols-[360px_minmax(0,1fr)]">
        <Reveal direction="right">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8f6a3b]">How it works</p>
        </Reveal>
        <RevealLines
          lines={["A direct process", "for meaningful", "professional introductions."]}
          className="max-w-5xl text-balance text-5xl font-semibold leading-none tracking-normal md:text-7xl"
        />
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="relative hidden lg:block">
          <div className="sticky top-32 h-[420px] border-l border-[#161410]/18 pl-8">
            <motion.div
              style={{ scaleY: lineScale }}
              className="absolute left-0 top-0 h-full w-px origin-top bg-[#8f6a3b]"
            />
            <RevealNumber className="font-mono text-8xl font-semibold leading-none text-[#8f6a3b]">
              {steps[activeStep][0]}
            </RevealNumber>
            <motion.p
              key={steps[activeStep][1]}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0.01 : 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 text-5xl font-semibold leading-none"
            >
              {steps[activeStep][1]}
            </motion.p>
          </div>
        </div>

        <div className="grid border-t border-[#161410]/18">
          {steps.map(([number, title, body], index) => {
            const isActive = reduced || activeStep === index;
            const isPast = activeStep > index;
            return (
              <Reveal key={number} delay={index * 0.08} direction={index % 2 === 0 ? "right" : "left"}>
                <div
                  className={`grid gap-5 border-b border-[#161410]/18 py-8 transition duration-300 md:grid-cols-[90px_minmax(0,1fr)] ${
                    isActive ? "opacity-100" : isPast ? "opacity-42" : "opacity-62"
                  }`}
                >
                  <RevealNumber delay={index * 0.05} className="font-mono text-sm text-[#8f6a3b] md:text-2xl">
                    {number}
                  </RevealNumber>
                  <div>
                    <h3 className="text-3xl font-medium md:text-5xl">{title}</h3>
                    <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#5a5147]">{body}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
