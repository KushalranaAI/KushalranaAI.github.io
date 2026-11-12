/**
 * Personal projects: systems I design and build myself to prove production judgment.
 * Not the same as work at Aviara Labs (cases.ts) and not the same as learning pathways (pathways.ts).
 *
 * Rules: no invented results. `publishes` lists the NAMES of the numbers a project will publish; once a gate
 * passes, add the real values to `results` and flip `status` to "shipped".
 */

export type ProjectStatus = "shipped" | "building" | "next" | "queued" | "planned";

export const statusLabel: Record<ProjectStatus, string> = {
  shipped: "Shipped",
  building: "Building now",
  next: "Up next",
  queued: "Queued",
  planned: "Planned",
};

export interface PersonalProject {
  id: string;
  num: string;
  name: string;
  tagline: string;
  /** The one skill this project is meant to prove. */
  proves: string;
  status: ProjectStatus;
  /** Planned build window. */
  window: string;
  stack: string[];
  /** How it plugs into the other three. */
  connects: string;
  /** Names of the measured numbers this project will publish. */
  publishes: string[];
  /** Real measured values, added after the gate passes. */
  results?: { value: string; label: string }[];
  /** Leave undefined until the GitHub repo exists, so the card never links to a 404. */
  repo?: string;
  caseStudy?: string;
}

export const personalProjects: PersonalProject[] = [
  {
    id: "kynai",
    num: "01",
    name: "KynAI",
    tagline:
      "A terminal-first, multi-agent incident investigator: describe an incident, get a root-cause report with file-and-line evidence.",
    proves: "AI & LLM engineering: agent design, MCP tools, evals, guardrails",
    status: "next",
    window: "Nov 10 – 23, 2026",
    stack: ["Python", "LangGraph", "MCP", "tree-sitter", "SQLite", "LangSmith"],
    connects: "Calls models through Switchboard once it ships. Its reports leave through Relay.",
    publishes: ["Root-cause accuracy", "Culprit file in top 3", "Unsafe-action rate (must be zero)", "Single vs multi-agent, with and without critic"],
    repo: "https://github.com/KushalranaAI/KynAI",
  },
  {
    id: "relay",
    num: "02",
    name: "Relay",
    tagline:
      "Reliable webhook delivery: transactional outbox, signed payloads, retries with backoff, a dead-letter queue and one-click replay.",
    proves: "Backend reliability and TypeScript depth",
    status: "queued",
    window: "Nov 24 – Dec 7, 2026",
    stack: ["TypeScript", "Fastify", "Postgres", "BullMQ", "React", "MCP"],
    connects: "The platform's event backbone. Delivers KynAI reports and Switchboard budget alerts.",
    publishes: ["Zero events lost under worker crashes", "Delivery latency p99 under load", "Triage-agent cause accuracy and replay safety"],
  },
  {
    id: "revsql",
    num: "03",
    name: "RevSQL",
    tagline:
      "A 7–8B open model fine-tuned with QLoRA to turn revenue questions into SQL, benchmarked against a frontier model on accuracy, latency and cost.",
    proves: "LLM fine-tuning and ML evaluation",
    status: "queued",
    window: "Dec 8 – 21, 2026",
    stack: ["Python", "QLoRA", "vLLM", "Postgres", "Weights & Biases", "MCP"],
    connects: "Serves through Switchboard. Its analyst agent and MCP server run against a hotel revenue schema.",
    publishes: ["Execution accuracy vs a frontier model", "Latency p50 / p95 and cost per 1,000 queries", "Which question types fine-tuning fixed, and which it didn't"],
  },
  {
    id: "switchboard",
    num: "04",
    name: "Switchboard",
    tagline:
      "An LLM gateway in Go: one OpenAI-compatible API over hosted and self-hosted models, with routing, failover, budgets and caching.",
    proves: "System design, distributed systems and DevOps",
    status: "queued",
    window: "Dec 22, 2026 – Jan 11, 2027",
    stack: ["Go", "Redis", "Postgres", "Kubernetes", "Terraform", "OpenTelemetry"],
    connects: "The centre of the platform: KynAI and RevSQL send their model calls through it.",
    publishes: ["Gateway overhead p50 / p99", "Max requests per second and concurrent streams per pod", "Time to fail over when the primary provider dies"],
  },
];

export type BuildArea = "ai" | "systems" | "frontend" | "ml";

export const buildAreas: { id: BuildArea; label: string }[] = [
  { id: "ai", label: "AI & agents" },
  { id: "systems", label: "Systems & data" },
  { id: "frontend", label: "Frontend" },
  { id: "ml", label: "Machine learning" },
];

export interface Build {
  id: string;
  name: string;
  blurb: string;
  area: BuildArea;
  status: ProjectStatus;
  stack: string[];
  /** Leave undefined until the repo exists, so the card never links to a 404. */
  repo?: string;
  live?: string;
}

/**
 * Every personal project outside the flagship platform: new side builds and older ones alike.
 * To add one, append an object here. Filters and counts pick it up, and areas with no projects stay hidden.
 * Active and planned work first, shipped work after.
 */
export const builds: Build[] = [
  {
    id: "mcp-gateway",
    name: "MCP Gateway",
    blurb: "A gateway for MCP servers, separate from Switchboard's model gateway.",
    area: "ai",
    status: "planned",
    stack: ["MCP"],
  },
  {
    id: "graphdb",
    name: "GraphDB",
    blurb: "A knowledge-graph database built from scratch, with an in-memory cache.",
    area: "systems",
    status: "planned",
    stack: ["Graph database", "From scratch"],
  },
  {
    id: "kidney",
    name: "Kidney disease classification",
    blurb: "A VGG16 transfer-learning CT-scan classifier with a modular pipeline, MLflow experiment tracking and DVC stages.",
    area: "ml",
    status: "shipped",
    stack: ["TensorFlow", "MLflow", "DVC", "Docker"],
    repo: "https://github.com/KushalranaAI/Kidney-Disease-Classification",
  },
  {
    id: "chicken",
    name: "Chicken disease classification",
    blurb: "A CNN that tells coccidiosis from healthy samples, with versioned data, a Dockerised app and a CI image build.",
    area: "ml",
    status: "shipped",
    stack: ["TensorFlow", "DVC", "Docker", "CI/CD"],
    repo: "https://github.com/KushalranaAI/Chicken-Disease-Classification",
  },
  {
    id: "summarise",
    name: "Text summarisation",
    blurb: "Fine-tunes a Pegasus transformer for dialogue summarisation, as a staged training pipeline with a serving app.",
    area: "ml",
    status: "shipped",
    stack: ["Hugging Face", "Transformers", "NLP"],
    repo: "https://github.com/KushalranaAI/Text-summarization-project",
  },
  {
    id: "barter",
    name: "Barter: content recommender",
    blurb: "Team project. I owned the data pipeline, the recommendation model and its FastAPI service, deployed with Docker.",
    area: "ml",
    status: "shipped",
    stack: ["NLP", "FastAPI", "Docker", "MongoDB"],
    repo: "https://github.com/KushalranaAI/barter_recom",
  },
];
