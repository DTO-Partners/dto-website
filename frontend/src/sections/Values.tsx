import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import financeImage from "@/assets/pic_three.png";
import foodImage from "@/assets/pic_four.png";
import techImage from "@/assets/pic_two.png";
import healthImage from "@/assets/pic_five.png";

const keys = ["finance", "foodEngineering", "itCybersecurity", "healthcare"] as const;

type IndustryKey = (typeof keys)[number];

type IndustryItem = {
  key: IndustryKey;
  title: string;
  subtitle: string;
  services: string[];
  image: string;
  lines: string[];
};

const imageByKey: Record<IndustryKey, string> = {
  finance: financeImage,
  foodEngineering: foodImage,
  itCybersecurity: techImage,
  healthcare: healthImage,
};

const ease = [0.22, 1, 0.36, 1] as const;
const stageCount = keys.length;

function getTitleLines(key: IndustryKey, title: string) {
  if (key === "foodEngineering") {
    const [first, ...rest] = title.split(" ");
    return [first, rest.join(" ")].filter(Boolean);
  }

  if (key === "itCybersecurity") {
    if (title.includes("CYBERBEZPIECZEŃSTWO")) return ["IT I", "CYBERBEZPIECZEŃSTWO"];
    return ["IT &", "CYBERSECURITY"];
  }

  return [title];
}

function stageRange(index: number) {
  const start = index / stageCount;
  const end = (index + 1) / stageCount;
  return {
    enterStart: Math.max(0, start - 0.08),
    enterEnd: Math.min(1, start + 0.055),
    exitStart: Math.max(0, end - 0.08),
    exitEnd: Math.min(1, end + 0.055),
  };
}

function ChapterText({
  item,
  index,
  progress,
}: {
  item: IndustryItem;
  index: number;
  progress: MotionValue<number>;
}) {
  const range = stageRange(index);
  const opacity = useTransform(progress, [range.enterStart, range.enterEnd, range.exitStart, range.exitEnd], [0, 1, 1, 0]);
  const y = useTransform(progress, [range.enterStart, range.enterEnd, range.exitStart, range.exitEnd], ["9%", "0%", "0%", "-8%"]);
  const scale = useTransform(progress, [range.enterStart, range.enterEnd, range.exitStart, range.exitEnd], [0.96, 1, 1, 0.96]);
  const titleY = useTransform(progress, [range.enterStart, range.enterEnd, range.exitStart, range.exitEnd], ["118%", "0%", "0%", "-110%"]);

  return (
    <motion.div style={{ opacity, y, scale }} className="absolute inset-x-0 top-1/2 min-w-0 -translate-y-1/2">
      <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#c7954b]">
        {String(index + 1).padStart(2, "0")} / EXPERTISE
      </p>
      <p className="mb-8 max-w-[32rem] text-[clamp(1.05rem,1.7vw,1.65rem)] leading-snug text-[#d8d0c2]/78">{item.subtitle}</p>
      <h2 className="max-w-full text-[clamp(4.15rem,17cqw,9.4rem)] font-semibold uppercase leading-[0.88] tracking-normal [overflow-wrap:anywhere] xl:text-[clamp(4.7rem,16cqw,10.2rem)]">
        {item.lines.map((line, lineIndex) => (
          <span key={`${item.key}-${line}`} className="block overflow-x-visible overflow-y-hidden py-[0.045em]">
            <motion.span
              style={{ y: titleY }}
              transition={{ duration: 0.6, delay: lineIndex * 0.05, ease }}
              className="block max-w-full [text-wrap:balance]"
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h2>
    </motion.div>
  );
}

function ChapterImage({
  item,
  index,
  progress,
}: {
  item: IndustryItem;
  index: number;
  progress: MotionValue<number>;
}) {
  const range = stageRange(index);
  const opacity = useTransform(progress, [range.enterStart, range.enterEnd, range.exitStart, range.exitEnd], [0, 0.92, 0.92, 0]);
  const scale = useTransform(progress, [range.enterStart, range.enterEnd, range.exitStart, range.exitEnd], [1.08, 1.02, 1.08, 1.13]);
  const x = useTransform(progress, [range.enterStart, range.exitEnd], ["-2.5%", "2.5%"]);
  const clipPath = useTransform(
    progress,
    [range.enterStart, range.enterEnd, range.exitStart, range.exitEnd],
    ["inset(0 0 0 42%)", "inset(0 0 0 0%)", "inset(0 0 0 0%)", "inset(0 32% 0 0)"],
  );
  const overlayOpacity = useTransform(progress, [range.enterStart, range.enterEnd, range.exitStart, range.exitEnd], [0.52, 0.32, 0.38, 0.58]);

  return (
    <motion.div style={{ opacity, clipPath }} className="absolute inset-0">
      <motion.img src={item.image} alt="" aria-hidden="true" style={{ scale, x }} className="h-full w-full object-cover" />
      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-black" />
    </motion.div>
  );
}

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
  const glowX = useTransform(scrollYProgress, [0, 1], reduced ? ["18%", "18%"] : ["4%", "68%"]);
  const exitOpacity = useTransform(scrollYProgress, [0, 0.94, 1], [1, 1, 0.66]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (reduced) return;
    const nextIndex = Math.min(stageCount - 1, Math.max(0, Math.floor(latest * stageCount)));
    if (nextIndex !== activeIndexRef.current) {
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    }
  });

  const items = keys.map((key) => ({
    key,
    title: t(`industries.sections.${key}.title`),
    subtitle: t(`industries.sections.${key}.subtitle`),
    services: (t(`industries.sections.${key}.keyServices`, { returnObjects: true }) as string[]).slice(0, 4),
    image: imageByKey[key],
    lines: getTitleLines(key, t(`industries.sections.${key}.title`)),
  }));
  const active = items[activeIndex];

  return (
    <section ref={sectionRef} id="Industries" className="relative bg-[#0d0d0c] text-[#f2efe7] lg:h-[420svh] motion-reduce:lg:h-auto">
      <motion.div
        style={{ opacity: exitOpacity }}
        className="sticky top-0 hidden min-h-svh overflow-hidden lg:grid lg:grid-cols-[minmax(0,58vw)_minmax(22rem,42vw)] xl:grid-cols-[minmax(0,60vw)_minmax(24rem,40vw)] motion-reduce:lg:hidden"
      >
        <motion.div
          style={{ x: glowX }}
          className="pointer-events-none absolute top-[8%] z-10 h-[36rem] w-[36rem] rounded-full bg-[#c7954b]/12 blur-[120px]"
        />

        <div className="relative z-20 flex min-h-svh min-w-0 flex-col justify-end px-[clamp(2.5rem,4.4vw,6.5rem)] py-[clamp(4rem,7vw,7.5rem)] [container-type:inline-size]">
          <div className="absolute left-[clamp(3rem,5vw,6.5rem)] top-[clamp(4.5rem,8vw,8rem)] flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#c7954b]/86">
            <span className="h-px w-16 bg-[#c7954b]/50" />
            <span>Scroll to explore</span>
            <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.8} />
          </div>

          <div className="relative h-[58svh] min-h-[32rem] max-w-full">
            {items.map((item, index) => (
              <ChapterText key={item.key} item={item} index={index} progress={scrollYProgress} />
            ))}
          </div>

          <div className="relative z-30 mb-1 grid max-w-[48rem] grid-cols-[repeat(3,minmax(0,1fr))] gap-x-6 gap-y-3 border-t border-[#c7954b]/22 pt-6">
            {active.services.map((service, index) => (
              <motion.div
                key={`${active.key}-${service}`}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0.01 : 0.34, delay: index * 0.075, ease }}
                className="grid min-w-0 grid-cols-[2.2rem_minmax(0,1fr)] items-start gap-3 text-sm leading-snug text-[#d8d0c2]/76"
              >
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#c7954b]/78">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 break-words">{service}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative min-h-svh overflow-hidden">
          {items.map((item, index) => (
            <ChapterImage key={item.key} item={item} index={index} progress={scrollYProgress} />
          ))}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0d0d0c_0%,rgba(13,13,12,.82)_14%,rgba(13,13,12,.22)_52%,rgba(13,13,12,.72)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(199,149,75,.16),transparent_42%)]" />

          <div className="absolute left-10 top-12 font-mono text-[clamp(9rem,14vw,17rem)] font-semibold leading-none text-white/[0.035]">
            {String(activeIndex + 1).padStart(2, "0")}
          </div>

          <div className="absolute bottom-12 left-10 right-10">
            <div className="mb-10 grid gap-4">
              {items.map((item, index) => (
                <div key={item.key} className="grid min-w-0 grid-cols-[minmax(4.6rem,5.5rem)_minmax(0,1fr)] items-center gap-4" aria-hidden="true">
                  <span
                    className={`min-w-0 break-words text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-500 ${
                      index === activeIndex ? "text-[#c7954b]" : "text-white/28"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")} {item.title}
                  </span>
                  <span className={`h-px transition-colors duration-500 ${index === activeIndex ? "bg-[#c7954b]" : "bg-white/16"}`} />
                </div>
              ))}
            </div>

            <a
              href="mailto:business@dtopartners.com"
              className="group relative inline-flex min-h-10 items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#f2efe7] transition hover:text-[#c7954b]"
            >
              Discuss search
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              <span className="absolute bottom-0 left-0 h-px w-0 bg-[#c7954b] transition-all duration-300 group-hover:w-36" />
            </a>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-16 px-5 py-20 md:px-8 lg:hidden motion-reduce:lg:grid">
        {items.map((item, index) => (
          <article key={item.key} className="relative min-h-svh overflow-hidden">
            <img src={item.image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-75" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,13,12,.42),rgba(13,13,12,.88)_60%,#0d0d0c_100%)]" />
            <div className="relative z-10 flex min-h-svh flex-col justify-end px-1 pb-10 pt-16">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#c7954b]">
                {String(index + 1).padStart(2, "0")} / EXPERTISE
              </p>
              <p className="mb-4 max-w-sm text-lg leading-snug text-[#d8d0c2]/82">{item.subtitle}</p>
              <h2 className="mb-7 max-w-full text-[clamp(3rem,14.5vw,5.8rem)] font-semibold uppercase leading-[0.9] tracking-normal [overflow-wrap:anywhere]">
                {item.lines.map((line) => (
                  <span key={`${item.key}-mobile-${line}`} className="block max-w-full">
                    {line}
                  </span>
                ))}
              </h2>
              <div className="grid gap-3 border-t border-[#c7954b]/28 pt-5">
                {item.services.map((service, serviceIndex) => (
                  <div key={service} className="grid grid-cols-[2rem_1fr] gap-3 text-sm text-[#d8d0c2]/82">
                    <span className="font-mono text-[0.68rem] text-[#c7954b]">{String(serviceIndex + 1).padStart(2, "0")}</span>
                    <span>{service}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#c7954b]">
                <span>Scroll</span>
                <ArrowDown className="h-3.5 w-3.5" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
