export type Tone = "plain" | "accent" | "accent2" | "ok";

export interface DNode {
  label: string;
  sub?: string;
  tone?: Tone;
}

export interface DRow {
  nodes: DNode[];
  /** Draws a dashed boundary with this label around the row. */
  boundary?: string;
}

export type Diagram =
  | { kind: "flow"; caption: string; rows: DRow[] }
  | {
      kind: "trace";
      caption: string;
      head: [string, string];
      spans: { label: string; start: number; width: number; tool?: boolean }[];
      foot: string[];
    };

export interface CaseLink {
  label: string;
  href: string;
}

export interface CaseStudy {
  id: string;
  num: string;
  title: string;
  /** Short line shown on the card. */
  hook: string;
  tags: string[];
  metrics: { value: string; label: string }[];
  problem: string;
  built: string;
  role?: string;
  /** `**bold**` marks the numbers worth noticing. */
  result: string;
  stack: string[];
  links?: CaseLink[];
  diagram: Diagram;
}

export const cases: CaseStudy[] = [
  {
    id: "rms",
    num: "01",
    title: "AI-powered Revenue Management System",
    hook: "Hotels priced rooms by hand. I built, alone, the ML platform that does it for them across 80+ hotels.",
    tags: ["Machine learning", "SaaS", "Solo build", "2025–26"],
    metrics: [
      { value: "80+", label: "hotels live" },
      { value: "+12%", label: "revenue in 7 months" },
      { value: "$1M+", label: "ARR for the client" },
    ],
    problem:
      "Hotels set room prices by hand from spreadsheets and instinct. Pricing has to react to demand, competitors and business rules, for every property, every day.",
    built:
      "End-to-end ML pipelines on ~18 months of historical data (ingestion, features, training, evaluation, prediction, continuous improvement), served through backend services and REST APIs straight into revenue workflows. Automation runs pricing 24/7 and the client steps in only when an alert fires. Shipped as self-serve SaaS: a hotel onboarding pipeline lets the client add as many properties as they want on their own, so they rely on us only for support.",
    role: "Sole engineer and client owner for SECOMS, a Malaysian hotel technology provider. I ran requirement gathering, project management, development, deployment and client communication: one year to build, then six months of production support and new features.",
    result:
      "Partner hotels grew revenue **12%** and occupancy **9%** in 7 months. The platform brings the client **$1M+ ARR**, projected to reach **~$1.5M** by the end of 2027. It is live in **80+ hotels**, scaling toward **200**.",
    stack: ["Python", "ML pipelines", "Feature engineering", "FastAPI", "PostgreSQL", "Multi-tenant SaaS", "Self-serve onboarding", "Azure"],
    links: [{ label: "Client: SECOMS (Malaysia)", href: "https://www.secoms.com.my/" }],
    diagram: {
      kind: "flow",
      caption: "Data → models → API → pricing decisions around the clock",
      rows: [
        {
          nodes: [
            { label: "Hotel history", sub: "18 months" },
            { label: "Demand signals" },
            { label: "Competitor rates" },
            { label: "Business rules" },
          ],
        },
        { nodes: [{ label: "Feature pipeline → model training → evaluation", tone: "accent" }] },
        { nodes: [{ label: "Pricing intelligence API", sub: "per tenant · per property", tone: "accent2" }] },
        {
          nodes: [
            { label: "Self-serve onboarding", sub: "client adds properties" },
            { label: "24/7 automation", sub: "alerts on exceptions" },
            { label: "80+ hotels live", sub: "+12% revenue · +9% occupancy", tone: "ok" },
          ],
        },
      ],
    },
  },
  {
    id: "cova",
    num: "02",
    title: "COVA: enterprise agentic AI infrastructure",
    hook: "The generative AI layer behind Aviara Connect: agents that answer and act across contracts, invoices and documents.",
    tags: ["Agentic AI", "RAG", "Enterprise"],
    metrics: [
      { value: "Multi-agent", label: "specialised workflows" },
      { value: "Hybrid", label: "vector + SQL retrieval" },
      { value: "Tenant-safe", label: "permission-aware access" },
    ],
    problem:
      "Business answers live in both structured records and unstructured documents, and each user may only see their own tenant's data.",
    built:
      "Production RAG and agent workflows: semantic and vector retrieval, structured database retrieval, hybrid search, tool calling, specialised agents, conversation context and enterprise memory.",
    result:
      "Agents reason across records and documents while staying inside **tenant isolation** and **permission-aware** access boundaries.",
    stack: ["LangChain", "LlamaIndex", "Hybrid search", "Tool calling", "FastAPI", "Django", "PostgreSQL", "MongoDB", "Redis", "Docker", "Azure"],
    links: [
      { label: "COVA", href: "https://aviaralabs.com/product/aviara-connect/cova" },
      { label: "Aviara Connect, the platform COVA runs on", href: "https://aviaralabs.com/product/aviara-connect" },
    ],
    diagram: {
      kind: "flow",
      caption: "Agents route to tools over structured and unstructured data",
      rows: [
        { nodes: [{ label: "User question", sub: "“Which contracts renew next month, and what do they owe?”" }] },
        { nodes: [{ label: "Orchestrator agent · memory · context", tone: "accent" }] },
        { nodes: [{ label: "Contracts agent" }, { label: "Finance agent" }, { label: "Documents agent" }] },
        {
          boundary: "permission-aware · tenant-isolated",
          nodes: [
            { label: "Vector + hybrid search", tone: "accent2" },
            { label: "SQL / Mongo tools", tone: "accent2" },
            { label: "Enterprise memory", tone: "accent2" },
          ],
        },
      ],
    },
  },
  {
    id: "ntpc",
    num: "03",
    title: "NTPC: agentic RAG for enterprise knowledge",
    hook: "Agents that find the answer across 1,000+ documents at India's largest power company, and show exactly where it came from.",
    tags: ["Agentic RAG", "Energy", "2025–26"],
    metrics: [
      { value: "1,000+", label: "documents" },
      { value: "8,000+", label: "daily users (Aviara)" },
      { value: "~4 mo", label: "idea to production" },
    ],
    problem:
      "NTPC is India's largest power generation company. Plant reports, Delegation of Powers (DoP) documents and policies were spread across departments, and engineering, operations and management teams struggled to find the rule or figure they needed.",
    built:
      "A LangGraph agent workflow over a Qdrant vector store: OCR ingestion, hybrid search, reranking, citation guardrails and agent-level governance. Every answer links back to the exact source passage.",
    result:
      "Delivered in about four months (Nov 2025 – Feb 2026). Live in production over **1,000+ documents**, with every answer source-cited. Aviara reports **8,000+ daily users**.",
    stack: ["LangGraph", "Qdrant", "Hybrid search", "Rerankers", "OCR", "Citation guardrails", "Python"],
    links: [{ label: "Case study on aviaralabs.com", href: "https://aviaralabs.com/solutions" }],
    diagram: {
      kind: "flow",
      caption: "Retrieve, rerank, verify citations, then answer",
      rows: [
        { nodes: [{ label: "User question", sub: "“Who can approve a procurement above this limit?”" }] },
        { nodes: [{ label: "LangGraph agent · routing · governance", tone: "accent" }] },
        {
          nodes: [
            { label: "Hybrid search", sub: "Qdrant", tone: "accent2" },
            { label: "Reranker", tone: "accent2" },
            { label: "OCR'd corpus", sub: "1,000+ docs", tone: "accent2" },
          ],
        },
        { nodes: [{ label: "Citation guardrail" }, { label: "Answer + sources", tone: "ok" }] },
      ],
    },
  },
  {
    id: "eye",
    num: "04",
    title: "Aviara Eye: LLMOps and AI observability",
    hook: "When an agent gives a wrong answer you need to see why. Centralised tracing and prompt management for every production GenAI app.",
    tags: ["LLMOps", "Observability"],
    metrics: [
      { value: "Every", label: "production GenAI app" },
      { value: "1 place", label: "to debug agent runs" },
      { value: "Self-hosted", label: "Langfuse" },
    ],
    problem: "Agent failures were black boxes, and prompts were scattered across services.",
    built:
      "A self-hosted Langfuse deployment, instrumenting LLM calls, prompts, tool executions, agent workflows and full execution traces.",
    result:
      "Engineering teams debug failures, inspect agent behaviour, manage prompts centrally and monitor production AI from one place.",
    stack: ["Langfuse", "LLM tracing", "Prompt management", "Agent observability", "LLM evaluation", "Docker"],
    diagram: {
      kind: "trace",
      caption: "An illustrative trace: every step of an agent run, timed and inspectable",
      head: ["trace · contract-renewals", "1.84 s"],
      spans: [
        { label: "agent.run", start: 0, width: 100 },
        { label: "llm.plan", start: 2, width: 18 },
        { label: "tool.sql_query", start: 21, width: 22, tool: true },
        { label: "tool.hybrid_search", start: 21, width: 30, tool: true },
        { label: "rerank", start: 53, width: 12 },
        { label: "llm.answer", start: 66, width: 32 },
      ],
      foot: ["prompt v14", "tokens 3,912", "eval: grounded ✓"],
    },
  },
];
