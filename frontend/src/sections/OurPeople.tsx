import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { teamMembers, type TeamMember } from "@/data/team";

gsap.registerPlugin(ScrollTrigger);

const memberCount = teamMembers.length;
const ease = [0.22, 1, 0.36, 1] as const;
const desktopNavOffset = 84;

function splitName(name: string) {
  const parts = name.trim().split(/\s+/);
  return {
    first: parts[0] || name,
    last: parts.slice(1).join(" ") || "",
  };
}

function LineReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        initial={reduced ? false : { y: "108%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, amount: 0.65 }}
        transition={{ duration: reduced ? 0.01 : 0.78, delay, ease }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}

function OurPeopleIntro() {
  const reduced = useReducedMotion();

  return (
    <div className="mx-auto grid max-w-[1540px] content-center px-5 py-20 md:px-8 lg:px-12 xl:py-18">
      <div className="grid gap-8 border-y border-[#f2efe7]/12 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.36fr)] lg:items-end">
        <div>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: reduced ? 0.01 : 0.5, ease }}
            className="mb-7 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#c7954b]"
          >
            <span className="h-px w-14 bg-[#c7954b]/60" />
            <span>Our people</span>
            <span className="ml-auto hidden font-mono text-[#f2efe7]/36 sm:block">05</span>
          </motion.div>

          <h2 className="max-w-[58rem] text-[clamp(4.2rem,10vw,12rem)] font-semibold uppercase leading-[0.82] tracking-normal text-[#f2efe7]">
            <LineReveal>People</LineReveal>
            <LineReveal delay={0.09}>without</LineReveal>
            <LineReveal delay={0.18} className="text-[#c7954b]">
              borders.
            </LineReveal>
          </h2>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: reduced ? 0.01 : 0.58, delay: 0.25, ease }}
          className="grid gap-8"
        >
          <p className="text-[clamp(1.05rem,1.55vw,1.45rem)] leading-snug text-[#d8d0c2]/78">
            DTO's people story is represented here with temporary fictional profiles, built to demonstrate an international,
            editorial team experience before final employee data is available.
          </p>
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#c7954b]">
            <span>Scroll to meet the team</span>
            <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.8} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function DesktopPortraitLayer({ member, index }: { member: TeamMember; index: number }) {
  return (
    <figure
      data-team-portrait
      className={`absolute inset-0 overflow-hidden bg-[#161410] ${index === 0 ? "opacity-100" : "opacity-0"}`}
    >
      <img
        src={member.image}
        alt={member.imageAlt}
        loading={index === 0 ? "eager" : "lazy"}
        sizes="46vw"
        style={{ objectPosition: member.imagePosition || "50% 42%" }}
        className="h-full w-full object-cover grayscale-[8%] saturate-[0.9]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,13,12,.02),rgba(13,13,12,.38)_56%,rgba(13,13,12,.72))]" />
      <figcaption className="absolute bottom-6 left-6 right-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-5 border-t border-white/24 pt-5">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/74">
            {member.location} / {member.region}
          </p>
          <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-white/44">{member.coordinates}</p>
        </div>
        <span className="font-mono text-[clamp(4rem,8vw,8rem)] font-semibold leading-none text-white/16">{member.id}</span>
      </figcaption>
    </figure>
  );
}

function DesktopInformationColumn({ member }: { member: TeamMember }) {
  const { first, last } = splitName(member.name);

  return (
    <article key={member.id} data-team-info className="team-info">
      <div className="team-info__meta">
        <span>Our people</span>
        <span className="team-info__count">
          {member.id} / {String(memberCount).padStart(2, "0")}
        </span>
      </div>

      <motion.div
        key={`${member.id}-body`}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease }}
        className="team-info__body"
      >
        <h3 className="team-info__name">
          <span className="team-info__name-mask">
            <span className="team-info__name-line">{first}</span>
          </span>
          {last && (
            <span className="team-info__name-mask text-[#c7954b]">
              <span className="team-info__name-line">{last}</span>
            </span>
          )}
        </h3>

        <div className="team-info__identity">
          <p>{member.role}</p>
          <p>
            {member.location} - {member.region}
          </p>
        </div>

        <p className="team-info__bio">{member.bio}</p>

        <div className="team-info__expertise">
          <p className="team-info__expertise-label">Expertise</p>
          <div className="team-info__expertise-list">
            {member.expertise.map((item, expertiseIndex) => (
              <div key={item} className="team-info__expertise-row">
                <span className="font-mono text-[0.68rem] text-[#c7954b]/72">
                  {String(expertiseIndex + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">{item}</span>
                <ArrowUpRight className="h-4 w-4 text-[#c7954b]" strokeWidth={1.7} />
              </div>
            ))}
          </div>
        </div>

        <a href={member.linkedin} className="team-info__linkedin group" aria-label={`${member.name} LinkedIn`}>
          LinkedIn
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" strokeWidth={1.7} />
        </a>
      </motion.div>
    </article>
  );
}

function TeamProgress() {
  return (
    <div className="absolute bottom-7 left-[clamp(2rem,4vw,4.8rem)] right-[clamp(2rem,4vw,4.8rem)] z-20">
      <div className="mb-5 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#f2efe7]/46">
        <span>01</span>
        <div className="h-px bg-[#f2efe7]/14">
          <div data-team-progress-line className="h-px origin-left scale-x-0 bg-[#c7954b]" />
        </div>
        <span>{String(memberCount).padStart(2, "0")}</span>
      </div>
      <div className="grid grid-cols-6 gap-3">
        {teamMembers.map((member, index) => (
          <div
            key={`${member.id}-progress`}
            data-team-progress-item
            className={`min-w-0 ${index === 0 ? "opacity-100" : "opacity-35"}`}
          >
            <div className="mb-2 flex items-center justify-between gap-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[#f2efe7]/64">
              <span>{member.id}</span>
              <span className="hidden truncate md:block">{member.location}</span>
            </div>
            <div className="h-px bg-[#f2efe7]/14">
              <div data-team-progress-segment className={`h-px origin-left bg-[#c7954b] ${index === 0 ? "scale-x-100" : "scale-x-[0.15]"}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DesktopTeamStory() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const setActiveMember = useCallback((index: number) => {
    if (activeIndexRef.current === index) {
      return;
    }

    activeIndexRef.current = index;
    setActiveIndex(index);
  }, []);

  useLayoutEffect(() => {
    if (reduced || !rootRef.current || !stageRef.current) {
      return;
    }

    setActiveMember(0);

    const root = rootRef.current;
    const stage = stageRef.current;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1280px)", () => {
        const portraits = gsap.utils.toArray<HTMLElement>("[data-team-portrait]");
        const progressItems = gsap.utils.toArray<HTMLElement>("[data-team-progress-item]");
        const progressSegments = gsap.utils.toArray<HTMLElement>("[data-team-progress-segment]");
        const progressLine = root.querySelector<HTMLElement>("[data-team-progress-line]");

        gsap.set(portraits, {
          autoAlpha: 0,
          scale: 1.035,
          clipPath: "inset(14% 0% 0% 0%)",
        });
        gsap.set(portraits[0], {
          autoAlpha: 1,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0%)",
        });
        gsap.set(progressItems, { opacity: 0.35 });
        gsap.set(progressItems[0], { opacity: 1 });
        gsap.set(progressSegments, { scaleX: 0.15, transformOrigin: "left center" });
        gsap.set(progressSegments[0], { scaleX: 1 });
        gsap.set(progressLine, { scaleX: 0, transformOrigin: "left center" });

        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            id: "dto-team-story",
            trigger: stage,
            start: () => `top top+=${desktopNavOffset}`,
            end: () => {
              const scrollDistance = Math.round(window.innerHeight * 2.2);

              if (scrollDistance > window.innerHeight * 3) {
                console.warn("[DTO Team] Scroll distance exceeds three viewport heights.", scrollDistance);
              }

              return `+=${scrollDistance}`;
            },
            pin: stage,
            pinSpacing: true,
            scrub: 0.45,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const nextIndex = Math.min(memberCount - 1, Math.max(0, Math.round(self.progress * (memberCount - 1))));
              setActiveMember(nextIndex);
            },
          },
        });

        timeline.to(progressLine, { scaleX: 1, duration: memberCount - 1, ease: "none" }, 0);

        for (let index = 1; index < memberCount; index += 1) {
          const previous = index - 1;
          const position = index - 0.36;

          timeline
            .to(
              portraits[previous],
              {
                autoAlpha: 0,
                scale: 1.025,
                clipPath: "inset(0% 0% 14% 0%)",
                duration: 0.34,
              },
              position,
            )
            .fromTo(
              portraits[index],
              {
                autoAlpha: 0,
                scale: 1.035,
                clipPath: "inset(14% 0% 0% 0%)",
              },
              {
                autoAlpha: 1,
                scale: 1,
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 0.36,
              },
              position,
            )
            .to(progressItems[previous], { opacity: 0.35, duration: 0.14 }, position + 0.05)
            .to(progressItems[index], { opacity: 1, duration: 0.14 }, position + 0.08)
            .to(progressSegments[index], { scaleX: 1, duration: 0.28 }, position + 0.08);
        }

        const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

        return () => {
          window.cancelAnimationFrame(refreshFrame);
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      });

      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, [reduced, setActiveMember]);

  return (
    <div ref={rootRef} className="hidden xl:block">
      <OurPeopleIntro />
      <div ref={stageRef} className="team-stage relative h-[calc(100svh-5.25rem)] min-h-[620px] bg-[#0d0d0c]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,#0d0d0c,rgba(26,22,17,.98)_52%,#090908)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(199,149,75,.08)_1px,transparent_1px),linear-gradient(180deg,rgba(242,239,231,.045)_1px,transparent_1px)] bg-[size:8rem_8rem] opacity-35" />

        <div className="relative z-10 mx-auto grid h-full max-w-[1540px] grid-cols-[minmax(0,46vw)_minmax(0,54vw)] px-12">
          <div className="relative h-full overflow-hidden border-x border-[#f2efe7]/12">
            {teamMembers.map((member, index) => (
              <DesktopPortraitLayer key={member.id} member={member} index={index} />
            ))}
          </div>

          <div className="relative h-full min-w-0">
            <DesktopInformationColumn member={teamMembers[activeIndex]} />
          </div>

          <TeamProgress />
        </div>
      </div>
    </div>
  );
}

function MobileMember({ member }: { member: TeamMember }) {
  const reduced = useReducedMotion();
  const { first, last } = splitName(member.name);

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduced ? 0.01 : 0.58, ease }}
      className="grid gap-6 border-t border-[#f2efe7]/14 pt-8"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#171512] md:aspect-[16/10]">
        <img
          src={member.image}
          alt={member.imageAlt}
          loading="lazy"
          sizes="(min-width: 768px) 80vw, 100vw"
          style={{ objectPosition: member.imagePosition || "50% 42%" }}
          className="h-full w-full object-cover grayscale-[8%] saturate-[0.9]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,13,12,.02),rgba(13,13,12,.58))]" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-5 border-t border-white/24 pt-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/78">
              {member.location} / {member.region}
            </p>
            <p className="mt-2 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-white/46">{member.coordinates}</p>
          </div>
          <span className="font-mono text-6xl font-semibold leading-none text-white/18">{member.id}</span>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c7954b]">
          {member.id} / {String(memberCount).padStart(2, "0")}
        </p>
        <h3 className="mt-4 text-[clamp(2.8rem,12vw,5.2rem)] font-semibold uppercase leading-[0.9] tracking-normal text-[#f2efe7]">
          <span className="block">{first}</span>
          {last && <span className="block text-[#c7954b]">{last}</span>}
        </h3>
        <div className="mt-4 grid gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#d8d0c2]/72">
          <span>{member.role}</span>
          <span>
            {member.location} - {member.region}
          </span>
        </div>
        <p className="mt-5 text-base leading-relaxed text-[#d8d0c2]/78">{member.bio}</p>
        <div className="mt-6 grid gap-3 border-y border-[#f2efe7]/14 py-5">
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.26em] text-[#c7954b]">Expertise</p>
          {member.expertise.map((item, itemIndex) => (
            <div
              key={`${member.id}-mobile-${item}`}
              className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#f2efe7]"
            >
              <span className="font-mono text-[#c7954b]/70">{String(itemIndex + 1).padStart(2, "0")}</span>
              <span className="min-w-0">{item}</span>
              <ArrowUpRight className="h-4 w-4 text-[#c7954b]" strokeWidth={1.7} />
            </div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function MobileStory() {
  const reduced = useReducedMotion();

  return (
    <div className="grid gap-10 px-5 py-20 md:px-8 xl:hidden">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: reduced ? 0.01 : 0.55, ease }}
        className="border-y border-[#f2efe7]/14 py-9"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c7954b]">Our people</p>
        <h2 className="mt-5 text-[clamp(3.4rem,14vw,6rem)] font-semibold uppercase leading-[0.86] tracking-normal text-[#f2efe7]">
          People
          <span className="block">without</span>
          <span className="block text-[#c7954b]">borders.</span>
        </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-[#d8d0c2]/78">
          Fictional demo profiles show how DTO's final team content will read as an international people story.
        </p>
      </motion.div>

      {teamMembers.map((member) => (
        <MobileMember key={`${member.id}-mobile`} member={member} />
      ))}
    </div>
  );
}

export default function OurPeople() {
  return (
    <section id="OurPeople" className="our-people relative overflow-hidden bg-[#0d0d0c] text-[#f2efe7]">
      <DesktopTeamStory />
      <MobileStory />
    </section>
  );
}
