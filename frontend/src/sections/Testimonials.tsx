import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  location: string;
  industry: string;
  image: string | null;
  placeholder: true;
};

// DEVELOPMENT PLACEHOLDERS ONLY.
// Replace every entry with verified, approved client testimonials and portrait images before production use.
const testimonials: Testimonial[] = [
  {
    quote: "TESTIMONIAL QUOTE PENDING",
    name: "CLIENT NAME",
    role: "ROLE",
    company: "COMPANY",
    location: "LOCATION",
    industry: "INDUSTRY",
    image: null,
    placeholder: true,
  },
  {
    quote: "APPROVED CLIENT STORY PENDING",
    name: "CLIENT NAME",
    role: "ROLE",
    company: "COMPANY",
    location: "LOCATION",
    industry: "INDUSTRY",
    image: null,
    placeholder: true,
  },
  {
    quote: "VERIFIED TESTIMONIAL PENDING",
    name: "CLIENT NAME",
    role: "ROLE",
    company: "COMPANY",
    location: "LOCATION",
    industry: "INDUSTRY",
    image: null,
    placeholder: true,
  },
  {
    quote: "PORTRAIT AND QUOTE PENDING",
    name: "CLIENT NAME",
    role: "ROLE",
    company: "COMPANY",
    location: "LOCATION",
    industry: "INDUSTRY",
    image: null,
    placeholder: true,
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

function splitQuote(quote: string) {
  const words = quote.split(" ");
  if (words.length <= 3) return [quote];
  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
}

function Portrait({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const shapes = [
    "aspect-[3/4] md:mt-10",
    "aspect-[4/5] md:mb-16",
    "aspect-[1/1] md:mt-24",
    "aspect-[3/4] md:mb-6",
  ];

  return (
    <motion.figure
      key={`${testimonial.name}-${index}-portrait`}
      initial={{ clipPath: "inset(100% 0 0 0)", scale: 1.04, opacity: 0 }}
      animate={{ clipPath: "inset(0% 0 0 0)", scale: 1, opacity: 1 }}
      exit={{ clipPath: "inset(0 0 100% 0)", scale: 1.03, opacity: 0 }}
      transition={{ duration: 0.86, ease }}
      className={`relative w-full max-w-[min(76vw,26rem)] overflow-hidden bg-[#151412] md:max-w-[28rem] ${shapes[index % shapes.length]}`}
      aria-label="Development portrait placeholder"
    >
      {testimonial.image ? (
        <img src={testimonial.image} alt={`${testimonial.name} portrait`} className="h-full w-full object-cover grayscale-[18%] saturate-[0.9]" />
      ) : (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#211f1b_0%,#8f6a3b_48%,#ede5d7_100%)] opacity-85" />
          <div className="absolute left-1/2 top-[24%] h-[24%] w-[34%] -translate-x-1/2 rounded-full border border-[#f2efe7]/36 bg-[#f2efe7]/12" />
          <div className="absolute bottom-[-14%] left-1/2 h-[56%] w-[72%] -translate-x-1/2 rounded-t-full border border-[#f2efe7]/30 bg-[#f2efe7]/10" />
          <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-6 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[#f2efe7]">
            <span>Portrait pending</span>
            <span>{String(index + 1).padStart(2, "0")}</span>
          </div>
        </div>
      )}
    </motion.figure>
  );
}

export default function Testimonials() {
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const active = testimonials[activeIndex];
  const quoteLines = useMemo(() => splitQuote(active.quote), [active.quote]);

  useEffect(() => {
    if (reduced || isPaused) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        setActiveIndex((current) => (current + 1) % testimonials.length);
      }
    }, 7200);
    return () => window.clearInterval(timer);
  }, [isPaused, reduced]);

  const navigate = (direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + testimonials.length) % testimonials.length);
  };

  return (
    <section id="Testimonials" className="relative overflow-hidden bg-[#f2efe7] px-5 py-20 text-[#11100e] md:px-8 md:py-24 lg:px-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_16%,rgba(199,149,75,.18),transparent_28%),linear-gradient(180deg,rgba(13,13,12,.04),transparent_34%)]" />
      <div
        className="relative mx-auto max-w-[1500px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduced ? 0.01 : 0.46, ease }}
          className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8f6a3b]"
        >
          Client stories
        </motion.p>

        <motion.h2
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.38 }}
          transition={{ duration: reduced ? 0.01 : 0.64, delay: 0.08, ease }}
          className="mt-8 max-w-5xl overflow-hidden text-[clamp(4rem,8.5vw,9.5rem)] font-semibold uppercase leading-[0.84] tracking-normal"
        >
          <span className="block">Built on</span>
          <span className="block">trust.</span>
        </motion.h2>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[minmax(18rem,0.78fr)_minmax(0,1.22fr)] lg:items-end">
          <div className="relative min-h-[24rem] md:min-h-[30rem]">
            <AnimatePresence mode="wait">
              <Portrait key={activeIndex} testimonial={active} index={activeIndex} />
            </AnimatePresence>
          </div>

          <div className="grid min-w-0 gap-10 lg:pb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeIndex}-quote`}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduced ? undefined : { opacity: 0, y: -18 }}
                transition={{ duration: reduced ? 0.01 : 0.36, ease }}
                className="min-w-0"
              >
                <p className="mb-8 text-[clamp(4rem,9vw,8.5rem)] leading-none text-[#8f6a3b]/45">“</p>
                <blockquote className="max-w-[58rem] text-[clamp(2.45rem,5.15vw,5.6rem)] font-semibold uppercase leading-[0.9] tracking-normal">
                  {quoteLines.map((line, index) => (
                    <span key={`${line}-${index}`} className="block overflow-hidden pb-[0.04em]">
                      <motion.span
                        initial={reduced ? false : { y: "112%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: reduced ? 0.01 : 0.58, delay: index * 0.08, ease }}
                        className="block break-words"
                      >
                        {line}
                      </motion.span>
                    </span>
                  ))}
                </blockquote>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeIndex}-meta`}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: reduced ? 0.01 : 0.42, delay: 0.08, ease }}
                className="grid gap-5 border-t border-[#11100e]/16 pt-6 md:grid-cols-[1fr_auto] md:items-end"
              >
                <div>
                  <p className="text-base font-semibold uppercase tracking-[0.18em] text-[#11100e]">{active.name}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[#5f5549]">
                    {active.role} / {active.company}
                  </p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#8f6a3b]">
                    {active.location} / {active.industry}
                  </p>
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#8a8074]">Development placeholder</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-[#11100e]/12 pt-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center text-[#11100e] transition hover:text-[#8f6a3b] focus:outline-none focus:ring-2 focus:ring-[#8f6a3b]"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className="font-mono text-sm text-[#5f5549]">
              {String(activeIndex + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => navigate(1)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center text-[#11100e] transition hover:text-[#8f6a3b] focus:outline-none focus:ring-2 focus:ring-[#8f6a3b]"
              aria-label="Next testimonial"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid flex-1 grid-cols-4 gap-3 md:max-w-xl">
            {testimonials.map((testimonial, index) => (
              <button
                key={`${testimonial.quote}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group grid min-h-11 gap-2 text-left focus:outline-none focus:ring-2 focus:ring-[#8f6a3b]"
                aria-label={`Show testimonial ${index + 1}`}
                aria-current={activeIndex === index ? "true" : undefined}
              >
                <span className={`font-mono text-xs transition ${activeIndex === index ? "text-[#11100e]" : "text-[#8a8074]"}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={`h-px transition ${activeIndex === index ? "bg-[#8f6a3b]" : "bg-[#11100e]/18 group-hover:bg-[#8f6a3b]/70"}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
