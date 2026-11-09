export const profile = {
  name: "Kushal Rana",
  first: "Kushal",
  last: "Rana",
  role: "Software Engineer · AI & Backend",
  company: "Aviara Labs",
  title: "SDE II",
  location: "Noida, India",
  email: "kushalrana448@gmail.com",
  resume: "/Kushal_Rana_Resume.pdf",
  photo: "/assets/img/kushal.webp",
  headline: "I build AI systems, and the scalable backends they run on.",
  intro:
    "I work across the AI stack, from LLM fine-tuning to agentic systems, and design distributed, scalable backends with solid system design and low-level design. I own it end to end: an ML revenue platform I built solo, running in 80+ hotels, enterprise agentic RAG, and LLM observability for the teams that run it.",
} as const;

export interface Social {
  id: string;
  label: string;
  href: string;
}

export const socials: Social[] = [
  { id: "github", label: "GitHub", href: "https://github.com/KushalranaAI" },
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/kushal-rana" },
  { id: "x", label: "X", href: "https://x.com/KushalranaAI" },
  { id: "medium", label: "Medium", href: "https://kushalrana448.medium.com/" },
  { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@naaku-o2x" },
];

export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export const stats: Stat[] = [
  { value: 80, suffix: "+", label: "hotels running my ML pricing platform, scaling toward 200" },
  { value: 1, prefix: "$", suffix: "M+", label: "ARR the pricing platform brings our client" },
  { value: 12, prefix: "+", suffix: "%", label: "RevPAR for partner hotels vs last year, occupancy up 9% (client-reported)" },
  { value: 7, label: "open-source learning pathways on RAG, LLMs, ML, systems and Python" },
];

export const certs = [
  {
    title: "AWS Certified Machine Learning Engineer, Associate",
    href: "https://www.credly.com/badges/059455e3-be6a-442d-915a-e6f356022950/linked_in_profile",
    logo: "/assets/img/certs/aws.svg",
    issuer: "AWS",
  },
  {
    title: "Machine Learning Specialization, DeepLearning.AI",
    href: "https://www.coursera.org/account/accomplishments/specialization/certificate/RFH4YLMKEJTV",
    logo: "/assets/img/certs/deeplearning-ai.png",
    issuer: "DeepLearning.AI",
  },
  {
    title: "System Design Masterclass (2025)",
    href: "https://www.udemy.com/certificate/UC-6e4f94e7-b582-415e-be33-b4802fe1b974/",
    logo: "/assets/img/certs/udemy.svg",
    issuer: "Udemy",
  },
  {
    title: "Docker Mastery: Kubernetes + Docker Swarm",
    href: "https://www.udemy.com/certificate/UC-839367c8-e0f0-47f3-b411-947fc33622ab/",
    logo: "/assets/img/certs/udemy.svg",
    issuer: "Udemy",
  },
];

export const education = [
  {
    title: "B.Tech, Computer Science & Engineering",
    school: "I.K. Gujral Punjab Technical University",
    when: "2020–2024",
    grade: "CGPA 8.0/10",
  },
  {
    title: "Class 12, Non-medical & medical (PCMB), CBSE",
    school: "Gov. Boys Senior Secondary School",
    when: "Apr 2018 – May 2019",
    grade: "78%",
  },
  {
    title: "Class 10, CBSE",
    school: "Victor Public School",
    when: "Apr 2016 – May 2017",
    grade: "80%",
  },
];

export const nav = [
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "pathways", label: "Learning" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export const marqueeTech = [
  "LangGraph", "RAG", "FastAPI", "MCP", "Qdrant", "PyTorch", "Langfuse", "PostgreSQL",
  "Azure", "Docker", "Kubernetes", "LlamaIndex", "MLflow", "Redis", "Django", "TensorFlow",
];
