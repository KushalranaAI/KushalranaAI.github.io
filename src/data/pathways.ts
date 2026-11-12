export type PathwayTag = "genai" | "ml" | "systems";

export interface Pathway {
  id: string;
  title: string;
  blurb: string;
  stats: string[];
  stack: string[];
  tags: PathwayTag[];
  /** Screenshot under /public. Projects without one render a generated visual. */
  image?: string;
  visual?: "rag";
  alt?: string;
  live?: string;
  repo: string;
}

/**
 * Learning pathways: free, open-source roadmaps I follow and publish so other engineers can learn a field end to end.
 * These are NOT personal projects (see projects.ts). To add one, append an object here:
 * the rail and the count pick it up. Put the newest first.
 */
export const pathways: Pathway[] = [
  {
    id: "ai-path",
    title: "AI Engineer Path",
    blurb:
      "From writing software to shipping AI in production, with a Studio sandbox for designing agents, RAG and GPU serving.",
    stats: ["17 levels", "22 guided projects", "15 simulators"],
    stack: ["React", "TypeScript", "Agents · RAG · inference"],
    tags: ["genai"],
    image: "/assets/img/projects/ai-engineer-path.png",
    alt: "AI Engineer Path home page with an animated agent pipeline diagram",
    live: "https://kushalranaai.github.io/AI-engineering/",
    repo: "https://github.com/KushalranaAI/AI-engineering",
  },
  {
    id: "rag",
    title: "All-in-One RAG Tutorials",
    blurb:
      "30 days from a first embedding to multi-agent systems on MCP: hybrid search, reranking, evals, Graph RAG and guardrails.",
    stats: ["30 days", "15 projects", "Offline test suite"],
    stack: ["Claude API", "MCP", "Multi-agent", "FastAPI"],
    tags: ["genai"],
    visual: "rag",
    live: "https://kushalranaai.github.io/All-in-One-RAG_tutorials/",
    repo: "https://github.com/KushalranaAI/All-in-One-RAG_tutorials",
  },
  {
    id: "llm",
    title: "LLM Engineering 1 → 100",
    blurb:
      "How LLMs work and how to ship them, from a single neuron to LLM system design. Every topic has the maths and a live simulation.",
    stats: ["9 modules", "394 topics", "40 simulations"],
    stack: ["Next.js", "TypeScript", "Transformers · RAG · agents"],
    tags: ["genai"],
    image: "/assets/img/projects/llm-1-to-100.png",
    alt: "LLM Engineering 1 to 100 home page with a live LLM serving diagram",
    live: "https://kushalranaai.github.io/Learn_llm/",
    repo: "https://github.com/KushalranaAI/Learn_llm",
  },
  {
    id: "system-learn",
    title: "System Learn",
    blurb:
      "Wire load balancers, caches, queues and databases on a canvas, push traffic, break things and watch p99 latency and cost react.",
    stats: ["19 modules", "129 lessons", "21 simulations"],
    stack: ["TypeScript", "React", "Kafka · Raft · sagas"],
    tags: ["systems"],
    image: "/assets/img/projects/system-learn.webp",
    alt: "System Learn home page with a live load-balancer diagram",
    live: "https://kushalranaai.github.io/system_learn/",
    repo: "https://github.com/KushalranaAI/system_learn",
  },
  {
    id: "ml",
    title: "Machine Learning 1 → 100",
    blurb:
      "Classical ML derived from the maths and built from scratch: a NumPy library tested against scikit-learn, plus a C++17 port.",
    stats: ["58 lessons", "16 visualisers", "98.4% MNIST CNN"],
    stack: ["NumPy", "C++17", "Next.js", "From scratch"],
    tags: ["ml"],
    image: "/assets/img/projects/ml-1-to-100.webp",
    alt: "Machine Learning 1 to 100 interactive lab showing a matrix transformation",
    live: "https://kushalranaai.github.io/machine-learning-1-to-100/",
    repo: "https://github.com/KushalranaAI/machine-learning-1-to-100",
  },
  {
    id: "python",
    title: "Python Projects",
    blurb:
      "20 end-to-end builds, from a guessing game to an interpreter and a search engine, each with a Flask UI, tests and a guide.",
    stats: ["20 projects", "Flask UIs", "pytest"],
    stack: ["Python", "OOP", "Flask", "pytest"],
    tags: ["systems"],
    image: "/assets/img/projects/python-projects.webp",
    alt: "Python Projects learning hub home page",
    repo: "https://github.com/KushalranaAI/Python-Projects",
  },
  {
    id: "oop",
    title: "OOP in Python, C++ & JavaScript",
    blurb:
      "How objects really work in three languages, with step-through memory traces and a method-lookup explorer (MRO, vtables, prototypes).",
    stats: ["3 languages", "5 projects", "Memory traces"],
    stack: ["Python", "C++20", "JavaScript", "Flask"],
    tags: ["systems"],
    image: "/assets/img/projects/oop.webp",
    alt: "OOP course showing a step-through memory trace of object creation",
    live: "https://kushalranaai.github.io/OOP-All-In-One/",
    repo: "https://github.com/KushalranaAI/OOP-All-In-One",
  },
];
