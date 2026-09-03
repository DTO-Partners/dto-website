import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-scroll";

interface HeroContentProps {
  readonly isLoaded: boolean;
  readonly onScrollToNext: () => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroContent({ isLoaded, onScrollToNext }: HeroContentProps) {
  const reduced = useReducedMotion();

  return (
    <div className="relative z-10 min-h-svh px-5 pb-7 pt-28 md:px-8 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100svh-8.75rem)] max-w-[1500px] flex-col justify-between">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.7, ease }}
          className="ml-auto hidden text-xs font-semibold uppercase tracking-[0.26em] text-white/74 md:block"
        >
          Europe / Middle East
        </motion.p>

        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 34 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 34 }}
            transition={{ delay: 0.18, duration: 0.9, ease }}
            className="max-w-6xl text-[clamp(4.5rem,10vw,10rem)] font-semibold uppercase leading-[0.86] tracking-normal text-white"
          >
            Talent
            <br />
            Without
            <br />
            Borders.
          </motion.h1>

          <motion.div
            initial={reduced ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : 24 }}
            transition={{ delay: 0.4, duration: 0.75, ease }}
            className="border-l border-white/28 pl-5 text-white"
          >
            <p className="text-sm uppercase tracking-[0.22em] text-white/70">Poland based. International search.</p>
            <Link
              to="Candidates & Employers"
              smooth
              duration={650}
              offset={-90}
              className="mt-8 inline-flex min-h-12 cursor-pointer items-center gap-3 border-b border-white/55 pb-2 text-sm font-semibold uppercase tracking-[0.18em] transition hover:border-white focus:outline-none focus:ring-2 focus:ring-white/70"
            >
              Register
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>

        <button
          onClick={onScrollToNext}
          className="inline-flex min-h-11 w-fit items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/68 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70"
          aria-label="Scroll to next section"
        >
          Scroll
          <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
