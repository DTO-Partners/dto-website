import { motion, useReducedMotion } from "framer-motion";
import { testimonials, type Testimonial } from "@/data/testimonials";

function Avatar({ item }: { item: Testimonial }) {
  if (item.image) {
    return <img src={item.image} alt={`${item.name} portrait`} className="h-11 w-11 rounded-full object-cover grayscale-[12%] saturate-[0.92]" />;
  }

  return (
    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#11100e]/10 bg-[#e8dfd1] text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#8f6a3b]">
      TBD
    </div>
  );
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article className="group flex h-[205px] w-[292px] shrink-0 flex-col justify-between rounded-[14px] border border-[#11100e]/10 bg-[#f8f3ea] p-5 shadow-[0_14px_40px_rgba(17,16,14,.06)] transition duration-300 hover:-translate-y-0.5 hover:border-[#8f6a3b]/35 hover:shadow-[0_18px_50px_rgba(17,16,14,.09)] md:h-[210px] md:w-[360px]">
      <div>
        <p className="text-3xl leading-none text-[#8f6a3b]">“</p>
        <p className="mt-2 text-[1.02rem] leading-snug text-[#24211d]">{item.quote}</p>
      </div>

      <div className="border-t border-[#11100e]/10 pt-4">
        <div className="flex items-center gap-3">
          <Avatar item={item} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold uppercase tracking-[0.14em] text-[#11100e]">{item.name}</p>
            <p className="mt-1 truncate text-xs uppercase tracking-[0.12em] text-[#6d6358]">
              {item.role} / {item.company}
            </p>
          </div>
        </div>
        {!item.verified && <p className="mt-3 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#9b8060]">Development placeholder</p>}
      </div>
    </article>
  );
}

function MarqueeRow({ items, reverse = false }: { items: Testimonial[]; reverse?: boolean }) {
  const doubled = [...items, ...items];

  return (
    <div className="testimonial-row-mask w-full min-w-0 overflow-x-auto py-1 md:overflow-hidden">
      <div className={`testimonial-row-track flex w-max gap-6 ${reverse ? "testimonial-row-track--reverse" : ""}`}>
        {doubled.map((item, index) => (
          <TestimonialCard key={`${item.id}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const reduced = useReducedMotion();
  const firstRow = testimonials.slice(0, 4);
  const secondRow = [...testimonials.slice(3), ...testimonials.slice(0, 1)];

  return (
    <section id="Testimonials" className="relative overflow-hidden bg-[#f2efe7] px-5 py-16 text-[#11100e] md:px-8 md:py-20 lg:px-12">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(13,13,12,.035),transparent_34%,rgba(13,13,12,.035))]" />
      <div className="relative mx-auto max-w-[1500px]">
        <div className="mb-9 md:mb-11">
          <div>
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.55 }}
              transition={{ duration: reduced ? 0.01 : 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8f6a3b]"
            >
              Client stories
            </motion.p>
            <motion.h2
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: reduced ? 0.01 : 0.58, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 text-[clamp(3rem,5.8vw,6rem)] font-semibold uppercase leading-[0.86] tracking-normal"
            >
              Built on trust.
            </motion.h2>
          </div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduced ? 0.01 : 0.62, ease: [0.22, 1, 0.36, 1] }}
          className="grid min-w-0 gap-6"
        >
          <MarqueeRow items={firstRow} />
          <div className="min-w-0 translate-x-8 md:translate-x-16">
            <MarqueeRow items={secondRow} reverse />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
