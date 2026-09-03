import { Link } from "react-scroll";
import { Reveal, RevealDivider } from "@/components/motion/Reveals";

const navItems = [
  ["What", "AboutUs"],
  ["Expertise", "Industries"],
  ["Network", "Markets"],
  ["Register", "Candidates & Employers"],
];

export default function Footer() {
  return (
    <footer id="Contact" className="bg-[#161410] px-5 py-10 text-[#f4efe6] md:px-8 lg:px-12">
      <RevealDivider className="mx-auto h-px max-w-[1500px] bg-white/16" />
      <div className="mx-auto grid max-w-[1500px] gap-8 pt-8 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-start">
        <Reveal direction="up">
          <p className="text-2xl font-semibold uppercase tracking-[0.22em]">DTO Partners</p>
          <p className="mt-6 text-sm text-[#a9a094]">DTO Partners Sp. z o.o.</p>
          <p className="mt-2 text-sm text-[#a9a094]">Jana Heweliusza 11/lokal 811, 80-890 Gdansk, Poland</p>
        </Reveal>

        <Reveal delay={0.1} direction="up">
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-[#d7cec0] lg:max-w-[240px]">
            {navItems.map(([label, id]) => (
              <li key={id}>
                <Link to={id} smooth duration={650} offset={-90} className="cursor-pointer text-[#d7cec0] transition hover:text-[#c99a57]">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        </Reveal>

        <Reveal delay={0.18} direction="up">
        <div>
          <div className="grid gap-2 text-sm text-[#d7cec0]">
            <a className="transition hover:text-[#c99a57]" href="mailto:candidates@dtopartners.com">candidates@dtopartners.com</a>
            <a className="transition hover:text-[#c99a57]" href="mailto:business@dtopartners.com">business@dtopartners.com</a>
            <a className="transition hover:text-[#c99a57]" href="tel:+48500785691">+48 500 785 691</a>
          </div>
        </div>
        </Reveal>
      </div>
    </footer>
  );
}
