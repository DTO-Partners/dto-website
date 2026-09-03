import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-scroll";
import { useApplicationForm } from "@/hooks/useApplicationForm";
import { StatusMessages } from "@/components/application/StatusMessages";
import { ApplicationForm } from "@/components/application/ApplicationForm";
import { RevealClip } from "@/components/motion/Reveals";

export default function ApplyForm() {
  const { submissionResult, showSuccess, setShowSuccess } = useApplicationForm();
  const [showForm, setShowForm] = useState(false);
  const reduced = useReducedMotion();

  return (
    <section id="Candidates & Employers" className="relative overflow-hidden bg-[#f2efe7] text-[#11100e]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(199,149,75,.2),transparent_28%),radial-gradient(circle_at_92%_74%,rgba(13,13,12,.11),transparent_32%)]" />
      <div className="mx-auto flex min-h-svh max-w-[1500px] flex-col justify-center px-5 py-24 md:px-8 md:py-32 lg:px-12">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduced ? 0.01 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8f6a3b]"
        >
          Ready
        </motion.p>
        <motion.h2
          initial={reduced ? false : { opacity: 0, y: 38 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.38 }}
          transition={{ duration: reduced ? 0.01 : 0.78, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-6xl text-[clamp(4.2rem,11vw,12rem)] font-semibold uppercase leading-[0.84] tracking-normal"
        >
          <span className="block">The right</span>
          <span className="block">connection</span>
          <span className="block">changes</span>
          <span className="block">everything.</span>
        </motion.h2>

        <div className="mt-12 grid gap-8 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="group text-left"
          >
            <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-[#8f6a3b]">Talent</span>
            <span className="mt-3 inline-flex min-h-12 items-center gap-3 text-3xl font-semibold uppercase transition group-hover:text-[#8f6a3b]">
              Register
              <ArrowUpRight className="h-6 w-6" />
            </span>
          </button>
          <a href="mailto:business@dtopartners.com" className="group text-left">
            <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-[#8f6a3b]">Companies</span>
            <span className="mt-3 inline-flex min-h-12 items-center gap-3 text-3xl font-semibold uppercase transition group-hover:text-[#8f6a3b]">
              Contact
              <ArrowUpRight className="h-6 w-6" />
            </span>
          </a>
          <a href="/login" className="min-h-12 text-sm uppercase tracking-[0.18em] text-[#5f5549] transition hover:text-[#8f6a3b]">
            Already a member? Log in
          </a>
        </div>

        <StatusMessages
          submissionResult={submissionResult}
          showSuccess={showSuccess}
          onDismissSuccess={() => setShowSuccess(false)}
        />

        {showForm && (
          <RevealClip id="ApplicationForm" className="mt-14" delay={0.05}>
            <ApplicationForm />
          </RevealClip>
        )}

        {!showForm && (
          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#71685d]">
            <a className="transition hover:text-[#8f6a3b]" href="mailto:candidates@dtopartners.com">candidates@dtopartners.com</a>
            <a className="transition hover:text-[#8f6a3b]" href="mailto:business@dtopartners.com">business@dtopartners.com</a>
            <Link to="Markets" smooth duration={650} offset={-80} className="cursor-pointer transition hover:text-[#8f6a3b]">
              Network
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
