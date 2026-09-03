import { motion, useReducedMotion } from "framer-motion";

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  placeholder: true;
};

// DEVELOPMENT PLACEHOLDERS ONLY.
// Replace every entry with verified, approved client testimonials before production use.
const testimonialData: Testimonial[] = [
  {
    quote: "TESTIMONIAL CONTENT",
    author: "CLIENT NAME",
    role: "ROLE / COMPANY",
    placeholder: true,
  },
  {
    quote: "TESTIMONIAL CONTENT",
    author: "CLIENT NAME",
    role: "ROLE / COMPANY",
    placeholder: true,
  },
  {
    quote: "TESTIMONIAL CONTENT",
    author: "CLIENT NAME",
    role: "ROLE / COMPANY",
    placeholder: true,
  },
];

const marqueeItems = [...testimonialData, ...testimonialData];

export default function Testimonials() {
  const reduced = useReducedMotion();

  return (
    <section id="Testimonials" className="overflow-hidden bg-[#f2efe7] py-20 text-[#11100e] md:py-24">
      <div className="mx-auto max-w-[1500px] px-5 md:px-8 lg:px-12">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduced ? 0.01 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8f6a3b]"
        >
          Testimonials
        </motion.p>
        <motion.h2
          initial={reduced ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.38 }}
          transition={{ duration: reduced ? 0.01 : 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 text-[clamp(4.2rem,11vw,12rem)] font-semibold uppercase leading-[0.84] tracking-normal"
        >
          <span className="block">Built on</span>
          <span className="block">trust.</span>
        </motion.h2>
      </div>

      <motion.div
        initial={reduced ? false : { clipPath: "inset(0 100% 0 0)" }}
        whileInView={{ clipPath: "inset(0 0% 0 0)" }}
        viewport={{ once: true, amount: 0.24 }}
        transition={{ duration: reduced ? 0.01 : 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10"
      >
        <div className="testimonial-marquee group overflow-x-auto md:overflow-hidden" tabIndex={0}>
          <div className="testimonial-track flex w-max gap-12 px-5 md:px-8 lg:px-12">
            {marqueeItems.map((item, index) => (
              <article
                key={`${item.author}-${index}`}
                className="w-[min(76vw,680px)] shrink-0 py-8"
                aria-label={item.placeholder ? "Development testimonial placeholder" : undefined}
              >
                <p className="text-[clamp(2.4rem,5vw,5.8rem)] font-semibold uppercase leading-[0.92] tracking-normal">
                  "{item.quote}"
                </p>
                <div className="mt-8 flex items-end justify-between gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8f6a3b]">{item.author}</p>
                    <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[#6d6358]">{item.role}</p>
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9b9082]">Development placeholder</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
