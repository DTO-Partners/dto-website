import teamDemo01 from "@/assets/team/team-demo-01.png";
import teamDemo02 from "@/assets/team/team-demo-02.png";
import teamDemo03 from "@/assets/team/team-demo-03.png";
import teamDemo04 from "@/assets/team/team-demo-04.png";
import teamDemo05 from "@/assets/team/team-demo-05.png";
import teamDemo06 from "@/assets/team/team-demo-06.png";

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  location: string;
  region: string;
  coordinates: string;
  bio: string;
  expertise: string[];
  image: string;
  imageAlt: string;
  imagePosition?: string;
  linkedin: string;
};

// TEMPORARY DEMO TEAM DATA
// Replace with real DTO Partners team information before production.
// Names, roles, locations, biographies, expertise areas, coordinates, LinkedIn links,
// and portraits below are fictional placeholders created only to test the section design.
export const teamMembers: TeamMember[] = [
  {
    id: "01",
    name: "Alexandra Moreau",
    role: "Managing Partner",
    location: "Luxembourg",
    region: "Europe",
    coordinates: "49.6116 N / 6.1319 E",
    bio: "Leads senior mandates across regulated markets, aligning executive expectations with discreet cross-border search.",
    expertise: ["Executive Search", "Leadership Advisory", "Financial Services"],
    image: teamDemo01,
    imageAlt: "Fictional demo portrait of Alexandra Moreau",
    imagePosition: "50% 42%",
    linkedin: "#",
  },
  {
    id: "02",
    name: "Theo Whitaker-Singh",
    role: "Director, International Talent Strategy",
    location: "London",
    region: "United Kingdom",
    coordinates: "51.5072 N / 0.1276 W",
    bio: "Builds search strategies for complex international appointments where timing, discretion and market fluency matter.",
    expertise: ["Talent Mapping", "Board Search", "Market Intelligence", "Candidate Engagement"],
    image: teamDemo02,
    imageAlt: "Fictional demo portrait of Theo Whitaker-Singh",
    imagePosition: "50% 42%",
    linkedin: "#",
  },
  {
    id: "03",
    name: "Mina Kato",
    role: "Partner, Client Advisory",
    location: "Paris",
    region: "Europe",
    coordinates: "48.8566 N / 2.3522 E",
    bio: "Advises client teams through role definition, shortlist calibration and final-stage selection decisions.",
    expertise: ["Client Advisory", "Assessment", "Transformation Hiring"],
    image: teamDemo03,
    imageAlt: "Fictional demo portrait of Mina Kato",
    imagePosition: "50% 42%",
    linkedin: "#",
  },
  {
    id: "04",
    name: "Malik Mensah",
    role: "Senior Search Consultant",
    location: "Dubai",
    region: "Middle East",
    coordinates: "25.2048 N / 55.2708 E",
    bio: "Connects regional hiring needs with international candidate markets across operational, commercial and leadership roles.",
    expertise: ["Middle East Search", "Commercial Leadership"],
    image: teamDemo04,
    imageAlt: "Fictional demo portrait of Malik Mensah",
    imagePosition: "50% 39%",
    linkedin: "#",
  },
  {
    id: "05",
    name: "Clara Vandenberg",
    role: "Principal Consultant, People & Markets",
    location: "Brussels",
    region: "Europe",
    coordinates: "50.8503 N / 4.3517 E",
    bio: "Focuses on people, context and evidence: the details that turn a promising introduction into a durable match.",
    expertise: ["People Advisory", "Sector Research", "Offer Navigation", "Onboarding"],
    image: teamDemo05,
    imageAlt: "Fictional demo portrait of Clara Vandenberg",
    imagePosition: "50% 42%",
    linkedin: "#",
  },
  {
    id: "06",
    name: "Rafael Nasser",
    role: "Associate Partner",
    location: "Madrid",
    region: "Europe",
    coordinates: "40.4168 N / 3.7038 W",
    bio: "Supports cross-market searches from brief to acceptance, keeping clients and candidates aligned through decisive moments.",
    expertise: ["Cross-Border Search", "Candidate Relations", "Executive Briefing"],
    image: teamDemo06,
    imageAlt: "Fictional demo portrait of Rafael Nasser",
    imagePosition: "50% 40%",
    linkedin: "#",
  },
];
