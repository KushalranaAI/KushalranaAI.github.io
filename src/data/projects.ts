/**
 * Personal projects: systems I design and build myself to prove production judgment.
 * Not the same as work at Aviara Labs (cases.ts) and not the same as learning pathways (pathways.ts).
 *
 * Rules: no invented results and no dates. A project is "soon" until its numbers are measured; then add the real
 * values to `results`, flip `status` to "built" and write its case study in projectCases.ts (same `id`).
 */

export type ProjectStatus = "shipped" | "built" | "soon" | "planned";

export const statusLabel: Record<ProjectStatus, string> = {
  shipped: "Shipped",
  built: "Built · measured",
  soon: "Coming soon",
  planned: "Planned",
};

export interface PersonalProject {
  id: string;
  num: string;
  name: string;
  /** Two or three words for the map node. */
  role: string;
  tagline: string;
  /** The one skill this project is meant to prove. */
  proves: string;
  status: ProjectStatus;
  stack: string[];
  /** How it plugs into the other three. */
  connects: string;
  /** Names of the measured numbers a "soon" project will publish. */
  publishes?: string[];
  /** Real measured values. Every one must exist in the project's bench/ folder. */
  results?: { value: string; label: string }[];
  /** Leave undefined until the GitHub repo is public, so the link never 404s. */
  repo?: string;
}

/** Order matters: the platform map lays these out top-left, top-right, bottom-left, bottom-right. */
export const personalProjects: PersonalProject[] = [
  {
    id: "kynai",
    num: "01",
    name: "KynAI",
    role: "Incident investigator",
    tagline:
      "A terminal-first, multi-agent incident investigator: describe an incident, get a root-cause report in which code, not a model, checks every cited file, line and commit.",
    proves: "AI & LLM engineering",
    status: "built",
    stack: ["Python", "LangGraph", "MCP", "tree-sitter", "SQLite FTS5", "FastAPI", "React"],
    connects: "Its reports will leave through Relay, and its model calls move to Switchboard with a config change. Neither is wired yet.",
    results: [
      { value: "21 / 22", label: "incidents with the culprit file in the top 3" },
      { value: "96%", label: "of cited evidence verified by code" },
      { value: "0", label: "unsafe actions executed" },
    ],
    repo: "https://github.com/KushalranaAI/KynAI",
  },
  {
    id: "relay",
    num: "02",
    name: "Relay",
    role: "Webhook delivery",
    tagline:
      "Multi-tenant webhook delivery with Postgres as the queue: signed payloads, retries with backoff, a dead-letter queue and replay.",
    proves: "Backend reliability",
    status: "built",
    stack: ["TypeScript", "Fastify", "PostgreSQL", "Drizzle", "React", "MCP"],
    connects: "The platform's event backbone: it will deliver KynAI reports and Switchboard budget alerts. It accepts events from any client today.",
    results: [
      { value: "0 lost", label: "of 20,000 deliveries while workers were killed every 1.5 s" },
      { value: "2,245 / s", label: "deliveries on one laptop, p99 592 ms" },
      { value: "30 / 30", label: "failure causes triaged, 0 unsafe replays" },
    ],
  },
  {
    id: "switchboard",
    num: "03",
    name: "Switchboard",
    role: "LLM gateway",
    tagline:
      "An LLM gateway in Go: one OpenAI-compatible API over hosted and self-hosted models, with routing, failover, budgets and caching.",
    proves: "System design & distributed systems",
    status: "soon",
    stack: ["Go", "Redis", "Postgres", "Kubernetes", "Terraform", "OpenTelemetry"],
    connects: "The centre of the platform: KynAI and RevSQL will send their model calls through it.",
    publishes: ["Gateway overhead p50 / p99", "Max requests per second and concurrent streams per pod", "Time to fail over when the primary provider dies"],
  },
  {
    id: "revsql",
    num: "04",
    name: "RevSQL",
    role: "Fine-tuned text-to-SQL",
    tagline:
      "A 7–8B open model fine-tuned with QLoRA to turn revenue questions into SQL, benchmarked against a frontier model on accuracy, latency and cost.",
    proves: "LLM fine-tuning & ML evaluation",
    status: "soon",
    stack: ["Python", "QLoRA", "vLLM", "Postgres", "Weights & Biases", "MCP"],
    connects: "Will serve through Switchboard. Its analyst agent and MCP server run against a hotel revenue schema.",
    publishes: ["Execution accuracy vs a frontier model", "Latency p50 / p95 and cost per 1,000 queries", "Which question types fine-tuning fixed, and which it didn't"],
  },
];

/** How the four systems connect. `x`/`y` place the label on the map, in percent. */
export const platformLinks: { a: string; b: string; label: string; x: number; y: number }[] = [
  { a: "kynai", b: "relay", label: "reports", x: 50, y: 25 },
  { a: "kynai", b: "switchboard", label: "model calls", x: 25, y: 50 },
  { a: "switchboard", b: "relay", label: "budget alerts", x: 50, y: 50 },
  { a: "switchboard", b: "revsql", label: "model serving", x: 50, y: 75 },
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
];
