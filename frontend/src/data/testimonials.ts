export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  image: string | null;
  verified: boolean;
};

// DEVELOPMENT PLACEHOLDERS ONLY.
// Replace these with verified, approved DTO client testimonials before production use.
export const testimonials: Testimonial[] = [
  {
    id: "pending-01",
    quote: "Approved client quote pending. Replace this card with verified testimonial content.",
    name: "Client name pending",
    role: "Role pending",
    company: "Company pending",
    image: null,
    verified: false,
  },
  {
    id: "pending-02",
    quote: "Verified testimonial pending. This layout is ready for a short client story.",
    name: "Client name pending",
    role: "Role pending",
    company: "Company pending",
    image: null,
    verified: false,
  },
  {
    id: "pending-03",
    quote: "Client approval pending. Add a concise quote once DTO has confirmed the wording.",
    name: "Client name pending",
    role: "Role pending",
    company: "Company pending",
    image: null,
    verified: false,
  },
  {
    id: "pending-04",
    quote: "Portrait and testimonial pending. Use this structure for real client proof.",
    name: "Client name pending",
    role: "Role pending",
    company: "Company pending",
    image: null,
    verified: false,
  },
  {
    id: "pending-05",
    quote: "Short testimonial pending. Keep final quotes focused, specific, and approved.",
    name: "Client name pending",
    role: "Role pending",
    company: "Company pending",
    image: null,
    verified: false,
  },
  {
    id: "pending-06",
    quote: "Client story pending. Replace placeholder identity and avatar with real assets.",
    name: "Client name pending",
    role: "Role pending",
    company: "Company pending",
    image: null,
    verified: false,
  },
];
