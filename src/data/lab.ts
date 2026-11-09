export type LabTag = "genai" | "ml" | "systems";

export const labFilters: { id: "all" | LabTag; label: string }[] = [
  { id: "all", label: "All" },
  { id: "genai", label: "GenAI & agents" },
  { id: "ml", label: "ML & CV" },
  { id: "systems", label: "Backend & systems" },
];

export interface LabProject {
  id: string;
  title: string;
  blurb: string;
  stats: string[];
  stack: string[];
  tags: LabTag[];
  /** Screenshot under /public. Projects without one render a generated visual. */
  image?: string;
  visual?: "rag";
  alt?: string;
  live?: string;
  repo: string;
}

/**
 * Personal projects and open-source platforms. To add a new project, append an object here:
 * the rail, the filters and the count all pick it up. Put the newest first.
 */
export const labProjects: LabProject[] = [
  {
    id: "ai-path",
    title: "AI Engineer Path",
    blurb:
      "Learn AI engineering by building it, from writing software to shipping AI systems in production. Includes a Studio sandbox to design and simulate agents, RAG and GPU serving.",
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
      "A 30-day course from your first embedding to multi-agent systems on MCP: hybrid search, reranking, evaluation, agentic and corrective RAG, Graph RAG and guardrails.",
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
      "How large language models work and how to ship them, from a single neuron to LLM system design. Every topic comes with the maths and a live simulation.",
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
      "Learn system design by building it. Wire load balancers, caches, queues and databases on a canvas, push traffic, break things on purpose and watch p99 latency and cost react.",
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
      "All of classical ML, derived from the maths and implemented from scratch: a NumPy library tested against scikit-learn, a C++17 port and 5 projects on real data.",
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
      "20 end-to-end projects, from a guessing game to an interpreter, a search engine and an online shop. Each has its own Flask UI, a test suite and a step-by-step build guide.",
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
      "How objects really work in three languages: step-through memory traces, a method-lookup explorer (MRO, vtables, prototype chains) and 5 projects with identical output.",
    stats: ["3 languages", "5 projects", "Memory traces"],
    stack: ["Python", "C++20", "JavaScript", "Flask"],
    tags: ["systems"],
    image: "/assets/img/projects/oop.webp",
    alt: "OOP course showing a step-through memory trace of object creation",
    live: "https://kushalranaai.github.io/OOP-All-In-One/",
    repo: "https://github.com/KushalranaAI/OOP-All-In-One",
  },
];

export interface EarlierProject {
  title: string;
  blurb: string;
  stack: string;
  tags: LabTag[];
  repo: string;
}

export const earlierProjects: EarlierProject[] = [
  {
    title: "KynAI: data analyst agent",
    blurb:
      "Upload a dataset and ask questions. A LangChain ReAct agent with a Python tool cleans the data, analyses it and draws charts, all behind a FastAPI service.",
    stack: "LangChain · OpenAI · FastAPI · Docker",
    tags: ["genai", "systems"],
    repo: "https://github.com/KushalranaAI/KynAI",
  },
  {
    title: "Kidney disease classification",
    blurb: "A VGG16 transfer-learning CT-scan classifier with a modular pipeline, MLflow experiment tracking and DVC stages.",
    stack: "TensorFlow · MLflow · DVC · Docker",
    tags: ["ml"],
    repo: "https://github.com/KushalranaAI/Kidney-Disease-Classification",
  },
  {
    title: "Chicken disease classification",
    blurb: "A CNN that tells coccidiosis from healthy samples, with versioned data (DVC), a Dockerised app and a GitHub Actions image build.",
    stack: "TensorFlow · DVC · Docker · CI/CD",
    tags: ["ml"],
    repo: "https://github.com/KushalranaAI/Chicken-Disease-Classification",
  },
  {
    title: "Text summarisation",
    blurb: "Fine-tunes a Pegasus transformer for dialogue summarisation, as a staged training pipeline with a serving app.",
    stack: "Hugging Face · Transformers · NLP",
    tags: ["ml", "genai"],
    repo: "https://github.com/KushalranaAI/Text-summarization-project",
  },
  {
    title: "Barter: content recommender",
    blurb: "A team project. I owned the data (MongoDB Atlas, NLTK cleaning), the recommendation model and its FastAPI service, deployed with Docker.",
    stack: "NLP · FastAPI · Docker · MongoDB",
    tags: ["ml", "systems"],
    repo: "https://github.com/KushalranaAI/barter_recom",
  },
  {
    title: "Django recipe API",
    blurb: "A test-driven REST API with custom users, token auth and recipes, running in Docker Compose.",
    stack: "Django · DRF · Docker · TDD",
    tags: ["systems"],
    repo: "https://github.com/KushalranaAI/Django-All-in-One",
  },
];
