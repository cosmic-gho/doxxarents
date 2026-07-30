export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  experience: string;
};

export const team: TeamMember[] = [
  {
    slug: "dongo-paul",
    name: "Dongo Paul",
    role: "Co-Founder & Chief Executive Officer",
    image: "/images/team/dongo-paul.jpg",
    bio: "Dongo Paul is the vision behind DOXXARentals, built to make renting in Nigeria safer, faster, and radically more transparent. As CEO, he sets the company's strategic direction — from product and partnerships to fundraising and long-term growth — while keeping the team focused on one goal: a platform renters and landlords can trust.",
    experience:
      "Co-founded DOXXA, a real estate marketing company, before launching DOXXARentals to build the technology platform now transforming how Nigerians rent.",
  },
  {
    slug: "aregbokhai-peter",
    name: "Aregbokhai Peter",
    role: "Co-Founder & Chief Operating Officer",
    image: "/images/team/aregbokhai-peter.jpg",
    bio: "Aregbokhai Peter turns DOXXARentals' strategy into day-to-day execution. As COO, he owns operations, process design, and organizational growth, working to ensure every listing, inspection, and interaction on the platform reflects the same standard of reliability the company promises its users.",
    experience:
      "Co-founded DOXXA, a real estate marketing company, where he built the operational systems and market relationships that now underpin DOXXARentals.",
  },
  {
    slug: "adebudo-jude",
    name: "Adebudo Jude",
    role: "Marketing Director",
    image: "/images/team/adebudo-jude.jpg",
    bio: "Adebudo Jude leads marketing at DOXXARentals, shaping how the platform is discovered, understood, and trusted across Abuja. He builds the campaigns and partnerships that bring landlords, agents, and renters onto one platform, and works to make DOXXARentals a name renters recognize before they even start searching.",
    experience:
      "Leads digital brand growth, customer acquisition, and market expansion campaigns across DOXXARentals' launch markets.",
  },
  {
    slug: "ajomo-bukkola",
    name: "Ajomo Bukkola",
    role: "General Manager",
    image: "/images/team/ajomo-bukkola.jpg",
    bio: "Ajomo Bukkola keeps DOXXARentals running smoothly behind the scenes. As General Manager, he oversees administration, internal coordination, and service quality, making sure the company's day-to-day operations match the polish renters and landlords experience on the platform.",
    experience:
      "Experienced in business operations, administration, and organizational management across growing companies.",
  },
  {
    slug: "patrick",
    name: "Mr. Patrick",
    role: "Lead Web Developer & Technology Expert",
    image: "/images/team/patrick.jpg",
    bio: "Patrick leads development of the DOXXARentals platform, from its architecture to the details users never see but always feel. He's focused on building a secure, fast, and genuinely easy-to-use product for landlords, agents, and renters alike — one built to scale as the company grows into new cities.",
    experience:
      "Specializes in modern web development, platform architecture, and performance optimization for scalable products.",
  },
];
