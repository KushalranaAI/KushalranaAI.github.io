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
  /** Extra story sections shown between "My role" and "Result" (evaluation, tenancy, how numbers were measured, ...). */
  sections?: { label: string; body: string }[];
  /** Choices made, with the alternative that lost and why. */
  decisions?: { title: string; chose: string; over?: string; why: string }[];
  /** Hard problems: what was seen, what was really wrong, what fixed it. */
  problems?: { title: string; symptom: string; cause: string; fix: string }[];
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
      { value: "+12%", label: "RevPAR vs last year, client-reported" },
      { value: "$1M+", label: "ARR for the client" },
    ],
    problem:
      "Hotels set room prices by hand from spreadsheets and instinct. Pricing has to react to demand and occupancy, for every property, every day. The hard part: competitor rates were missing, and the history the client could give us was static.",
    built:
      "End-to-end ML pipelines on ~18 months of historical data (ingestion, features, training, evaluation, prediction, continuous improvement), served through backend services and REST APIs straight into revenue workflows. Automation runs pricing 24/7 and the client steps in only when an alert fires. Shipped as self-serve SaaS: a hotel onboarding pipeline lets the client add as many properties as they want on their own, so they rely on us only for support.",
    role: "Sole engineer and client owner for SECOMS, a Malaysian hotel technology provider. I ran requirement gathering, project management, development, deployment and client communication: one year to build, then six months of production support and new features.",
    sections: [
      {
        label: "What the model predicts",
        body: "An **XGBoost** regression model recommends a room rate for each room type on each day. Its inputs are the stay date, the room type, the hotel's **current occupancy**, its location and other property metadata. Its output is a baseline price, which a custom dynamic-pricing layer then adjusts.",
      },
      {
        label: "How it is evaluated and kept fresh",
        body: "Models are scored with **R²** and mean absolute error (MAE), with experiments tracked in **MLflow**. In production the R² is about **0.92**, measured by me on live data. Since month three an automated pipeline fetches fresh data and re-checks accuracy; a new model is only deployed to the S3 bucket the live service reads from if it **beats the previous model and clears the accuracy threshold**. **Prometheus and Grafana** watch the running system.",
      },
      {
        label: "How the results were measured",
        body: "The **+12% RevPAR** (revenue per available room) and **+9% occupancy** are the client's own figures, reported to us after about **seven months** across roughly 50 hotels and compared with the same period a year earlier. They are not numbers I computed.",
      },
    ],
    decisions: [
      {
        title: "Which model",
        chose: "XGBoost",
        over: "CatBoost and LightGBM",
        why: "I trained all three tree-based models on the same data and compared them. XGBoost gave the best result, so it went to production.",
      },
      {
        title: "How to separate hotel tenants",
        chose: "A PostgreSQL schema per tenant, with its own URL configuration (Django)",
        over: "Shared tables",
        why: "Each tenant's data is isolated at the database level instead of relying on every query to filter correctly.",
      },
      {
        title: "How to get dynamic prices from limited data",
        chose: "ML baseline plus a custom dynamic-pricing layer",
        why: "With competitor data missing and static history, the model alone could not react day to day. I built a proprietary algorithm on top of the model's baseline to produce the dynamic price. The algorithm itself is confidential and not described here.",
      },
      {
        title: "How to keep the model current",
        chose: "An automated retrain-and-promote pipeline",
        why: "A model only goes live if it beats the previous one and passes the accuracy threshold, so a weaker retrain is never deployed.",
      },
    ],
    problems: [
      {
        title: "Memory climbing to 90% and crashing every four hours",
        symptom:
          "The service reached about 90% memory roughly every four hours and crashed, recovering in 4 to 5 minutes each time. Doubling the server from 4 GB to 8 GB did not fix it, it only delayed the crash.",
        cause:
          "A leak in the code, not a hardware limit. I traced it through a week of Azure logs and tracing, plus a monitoring dashboard I built that showed the reservation backlog sitting completely full. Large DataFrames were not being freed because garbage collection was not clearing them. With 80+ pipelines an hour and three or four running in parallel every 20 to 30 seconds, a run takes 12 to 13 seconds normally but 30 to 35 on a new hotel's first run or when cached third-party data has expired and must be refetched, so data piled up faster than it was released.",
        fix: "Released the DataFrames explicitly and forced garbage collection at the end of every run. Memory now returns to baseline after each run and sits at about 25 to 28% of the 8 GB with 80 hotels running.",
      },
    ],
    result:
      "After about seven months in roughly 50 hotels the client reported **+12% RevPAR** and **+9% occupancy**, compared with the same period a year earlier. The platform is now live in **80+ hotels** in Malaysia, scaling toward **200**, and **30+ of the client's staff** use it. It brings the client **$1M+ ARR**, projected to reach **~$1.5M** by the end of 2027.",
    stack: ["Python", "XGBoost", "ML pipelines", "Feature engineering", "Django", "FastAPI", "PostgreSQL", "MLflow", "Prometheus", "Grafana", "S3", "Schema-per-tenant", "Azure"],
    links: [{ label: "Client: SECOMS (Malaysia)", href: "https://www.secoms.com.my/" }],
    diagram: {
      kind: "flow",
      caption: "Inputs → ML baseline → dynamic pricing → API, retrained automatically",
      rows: [
        {
          nodes: [
            { label: "Stay date" },
            { label: "Room type" },
            { label: "Current occupancy" },
            { label: "Location + metadata" },
          ],
        },
        { nodes: [{ label: "XGBoost baseline price", sub: "R² ≈ 0.92 · retrained and promoted automatically", tone: "accent" }] },
        { nodes: [{ label: "Dynamic-pricing layer", sub: "custom algorithm on top of the baseline", tone: "accent" }] },
        { nodes: [{ label: "Pricing API", sub: "per tenant · own database schema", tone: "accent2" }] },
        {
          nodes: [
            { label: "Self-serve onboarding", sub: "client adds properties" },
            { label: "24/7 automation", sub: "alerts on exceptions" },
            { label: "80+ hotels live", sub: "+12% RevPAR · +9% occupancy (client-reported)", tone: "ok" },
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
    tags: ["Agentic AI", "Multi-agent", "RAG", "Enterprise"],
    metrics: [
      { value: "10×+", label: "lower cost per turn" },
      { value: "~85→100%", label: "accuracy on a ground-truth audit" },
      { value: "1,000+", label: "queries a day in production" },
    ],
    problem:
      "Business answers live in both structured records (counts, dates, owners, values) and unstructured documents (clauses, playbooks), and what each person may see depends on their organisation and role. The first versions were also slow, taking minutes per answer, and sometimes picked the wrong tool.",
    built:
      "A multi-agent system on LangGraph that covers **more than ten business domains** with specialised worker agents and a large library of tools. It routes every question the cheapest way that works, runs on Azure OpenAI with Claude as the fallback, and checks its own answers before they reach the user.",
    role: "I designed the complete architecture and built the agentic operating system end to end, as the sole architect. The wider Aviara Connect platform and its other features are built by a team of four developers.",
    sections: [
      {
        label: "How a question is routed",
        body: "The orchestrator takes the **cheapest route that works**. Questions that match a known shape reuse a stored plan, and questions about a single domain go straight to the right tool, both with **no planning call to a model**. Only unfamiliar questions get a planner, and questions that span several domains are handed to a hierarchy of cooperating agents.",
      },
      {
        label: "Hybrid retrieval",
        body: "Tool descriptions drive the choice, not a separate classifier. Counts, filters, dates and values go to **deterministic database tools** where code computes the numbers and no model is involved. Questions about what a document says go to **vector and hybrid search with reranking**. Simple count and list questions skip document retrieval entirely.",
      },
      {
        label: "Tenant isolation, in layers",
        body: "No single filter does the work. **Identity** comes from the authenticated session into a server-built context that the model cannot supply or override. **Data** is separated per organisation, and **roles** decide what each person sees. Every tool call passes through one policy-checked boundary, and a **final check on the results** drops anything out of scope.",
      },
      {
        label: "Memory stores lessons, never records",
        body: "Memory keeps lessons and preferences, never contract values or old answers. Facts always come from live tools, so memory can **tailor a turn but never authorise one**. It learns only from what the user says, is validated in code, is encrypted at rest and is private to each user. Organisation-wide knowledge lives in a separate shared knowledge base, so one person's lessons never reach another.",
      },
      {
        label: "How quality is checked",
        body: "**Offline:** golden sets for routing, planning and conversations, a faithfulness judge, and an audit against **independently computed ground truth** that rose from the mid-80s to **100%** once its root causes were fixed. **On every live answer:** a deterministic check against the turn's own tool results, a second-model critic only when that check flags a problem, citation checks, and an evidence gate before the answer is written. Accuracy is measured per area against ground truth, not as one headline figure.",
      },
    ],
    decisions: [
      {
        title: "How agents decide what to do",
        chose: "Typed plans with a cheapest-first planner",
        over: "A free-form agent that picks its own tools every turn",
        why: "Free-form made answers vary from run to run. A catalogue of known operations and a planner that tries the cheapest route first made behaviour predictable.",
      },
      {
        title: "Which models do the work",
        chose: "Small models for orchestration, heavy models only for deep analysis",
        why: "It keeps cost predictable. Cost per turn fell by more than ten times.",
      },
      {
        title: "Where numbers come from",
        chose: "Deterministic tools compute every count and value",
        over: "Letting the model work them out",
        why: "In one case the model invented a breakdown by a field that did not exist in the data. Any grouped count must now come from a tool.",
      },
    ],
    problems: [
      {
        title: "Answers taking minutes",
        symptom: "Early answers took one to two minutes, and the agent often picked the wrong tool.",
        cause:
          "Tracing one slow turn showed almost all of its time was spent in the model and almost none in the database, so the database was never the bottleneck. Simple questions went through planning anyway, and a tool that returned nothing triggered a second round of planning that repeated the same work.",
        fix: "Simple questions now go straight to the right tool. I trimmed what is sent to the model, added caching and parallel tool calls, streamed answers as they are written, and rewrote the prompts and tool descriptions to say exactly what the agent can and cannot do. A typical simple question became about 60% faster using half the calls.",
      },
    ],
    result:
      "COVA is in production for **several B2B organisations**, handling **1,000+ queries a day** for dozens of daily users. Simple questions answer in **under ten seconds** and the deepest analyses take around half a minute. Admission control limits concurrent work and returns an error instead of hanging. Cost per turn fell by **more than ten times**.",
    stack: ["LangGraph", "LangChain", "Azure OpenAI", "Claude", "Hybrid search", "Reranking", "Tool calling", "Ragas", "Langfuse", "FastAPI", "Django", "MongoDB", "PostgreSQL", "Redis", "Docker", "Azure"],
    links: [
      { label: "COVA", href: "https://aviaralabs.com/product/aviara-connect/cova" },
      { label: "Aviara Connect, the platform COVA runs on", href: "https://aviaralabs.com/product/aviara-connect" },
    ],
    diagram: {
      kind: "flow",
      caption: "Cheapest route first, layered isolation, every answer verified",
      rows: [
        { nodes: [{ label: "User question", sub: "“Which contracts renew next month, and what do they owe?”" }] },
        { nodes: [{ label: "Orchestrator", sub: "picks the cheapest route that works", tone: "accent" }] },
        {
          nodes: [
            { label: "Known plan", sub: "no planning call" },
            { label: "Direct route", sub: "no planning call" },
            { label: "Planner", sub: "only when needed" },
            { label: "Multi-agent", sub: "cross-domain questions" },
          ],
        },
        {
          boundary: "role-aware · tenant-isolated · policy-checked",
          nodes: [
            { label: "Deterministic DB tools", sub: "code computes the numbers", tone: "accent2" },
            { label: "Vector + hybrid search", sub: "reranked", tone: "accent2" },
            { label: "Memory", sub: "lessons, not records", tone: "accent2" },
          ],
        },
        { nodes: [{ label: "Verify: check · critic if flagged · citations" }, { label: "Streamed answer", tone: "ok" }] },
      ],
    },
  },
  {
    id: "ntpc",
    num: "03",
    title: "NTPC: agentic RAG for enterprise knowledge",
    hook: "Agents that find the answer across hundreds of complex contracts at India's largest power company, and show exactly where it came from.",
    tags: ["Agentic RAG", "Energy", "Led the build", "2025–26"],
    metrics: [
      { value: "92%", label: "overall answer accuracy, up from ~82%" },
      { value: "94–95%", label: "retrieval accuracy" },
      { value: "8,000+", label: "questions a day" },
    ],
    problem:
      "NTPC is India's largest power generation company. Its contracts, Delegation of Powers (DoP) documents and policies were spread across departments. The contracts are dense tables in which several roles each carry different clause-level responsibilities, some are scanned copies with signatures, and engineering, operations and management teams struggled to find the rule or figure they needed.",
    built:
      "A LangGraph agent workflow over a Qdrant vector store: OCR ingestion, hybrid search, reranking, citation guardrails and governance that keeps departments isolated from one another. Every answer links back to the contract and page it came from.",
    role: "I joined when the system answered about 82% of questions correctly and led it from there: the architecture, prompt management, the move to hybrid search with a reranker, a rebuilt ingestion pipeline, and user management and governance.",
    sections: [
      {
        label: "The documents",
        body: "About **800 to 900 English contracts**. Many are complex tables, some are clean text and some are scanned copies with signatures. Roughly **10 to 15%** are really complex, and those drive most of the difficulty.",
      },
      {
        label: "How quality is checked",
        body: "**Offline:** a golden set of about **50 questions I agreed with the NTPC team**, run through a **custom regex-based evaluator I built**, which scores answer correctness, context relevance and retrieval at k. **Live:** every answer carries a reference link, and if it points to the right contract and page the answer is correct. Thumbs up and down on live answers keep checking it. Overall answer accuracy rose from about 82% to **92%**, and retrieval accuracy reached **94 to 95%**.",
      },
      {
        label: "Tracing and cost",
        body: "The system is connected to Aviara Eye, so every run has tracing, LLM cost tracking and managed prompts, and I can see why an agent answered the way it did.",
      },
    ],
    decisions: [
      {
        title: "How to search the contracts",
        chose: "Hybrid search (dense plus keyword) with a reranker",
        over: "Semantic search alone",
        why: "Semantic-only search was stuck at about 82% accuracy. Together with a better ingestion pipeline, hybrid search and a reranker took overall answer accuracy to 92%.",
      },
      {
        title: "Where to invest next",
        chose: "How documents are extracted and stored",
        why: "Every answer depends on what was read out of the contract. A better ingestion pipeline gives the search and the agents cleaner material to work with.",
      },
      {
        title: "What counts as a correct answer",
        chose: "Every answer links to the right contract and page",
        why: "Users can check an answer themselves, and the reference link doubles as the test of correctness. Thumbs up and down then build a live accuracy signal.",
      },
    ],
    problems: [
      {
        title: "Getting the contracts read correctly",
        symptom:
          "Accuracy stalled because the documents are hard to read: multi-role tables, clause-level responsibilities, and scanned copies mixed with digital text. About 10 to 15% of them are truly complex.",
        cause:
          "Quality depends on extraction. If a table or clause is read out wrongly, every later step inherits the mistake, and no single tool read every document type well.",
        fix: "I combined several extraction routes (OCR, a multimodal model, and standard PDF and Word extractors) and checked the extracted data for correctness. The hardest documents still need some manual work, so it is not fully automated.",
      },
    ],
    result:
      "In production at NTPC since February 2026, after a build that started in November 2025. Overall answer accuracy rose from about **82% to 92%** after the move to hybrid search with a reranker and a rebuilt ingestion pipeline, with retrieval accuracy at **94 to 95%**, measured on a golden set built with the client. Every answer links to the contract and page it came from, and the system handles **8,000+ questions a day**.",
    stack: ["LangGraph", "Qdrant", "Hybrid search", "Rerankers", "OCR", "Gemini", "PDF and Word extraction", "Citation guardrails", "Langfuse", "Python"],
    links: [{ label: "Case study on aviaralabs.com", href: "https://aviaralabs.com/solutions" }],
    diagram: {
      kind: "flow",
      caption: "Ingest carefully, retrieve and rerank, verify citations, then answer",
      rows: [
        { nodes: [{ label: "User question", sub: "“Who can approve a procurement above this limit?”" }] },
        { nodes: [{ label: "LangGraph agent · routing · governance", sub: "departments isolated", tone: "accent" }] },
        {
          nodes: [
            { label: "Hybrid search", sub: "Qdrant", tone: "accent2" },
            { label: "Reranker", tone: "accent2" },
            { label: "Structured corpus", sub: "800+ contracts · checked extraction", tone: "accent2" },
          ],
        },
        { nodes: [{ label: "Citation guardrail" }, { label: "Answer + contract and page reference", tone: "ok" }] },
      ],
    },
  },
  {
    id: "eye",
    num: "04",
    title: "Aviara Eye: LLMOps and AI observability",
    hook: "When an agent gives a wrong answer you need to see why. A self-hosted observability platform built on open-source Langfuse, with a workflow builder and a public Python SDK.",
    tags: ["LLMOps", "Observability", "Open-source SDK", "Maintainer"],
    metrics: [
      { value: "~$100/mo", label: "to run, vs ~$250 hosted (est.)" },
      { value: "50,000+", label: "traces a month" },
      { value: "4", label: "production AI projects" },
    ],
    problem:
      "Agent failures were black boxes, prompts were scattered across services, and hosted LLM-observability pricing grows with trace volume across every production project.",
    built:
      "A self-hosted LLM observability platform started from the open-source Langfuse codebase and extended in Node.js and TypeScript. It covers tracing for LLM calls, tools and agent runs, prompt management, evaluation, and cost and latency tracking. On top of it I built a node-based workflow builder as a new module, and I wrote a Python SDK, published on PyPI.",
    role: "I started from the open-source Langfuse code and own the result: I extended its Node.js and TypeScript internals, built the workflow module from scratch, wrote and publish the Python SDK, and maintain all of it. It is used in production at Aviara.",
    sections: [
      {
        label: "What it does for teams",
        body: "Engineers **debug failures**, inspect agent behaviour step by step, manage versioned prompts in one place, score outputs and watch cost and latency. Four production AI projects send it more than **50,000 traces a month**.",
      },
      {
        label: "The workflow builder",
        body: "A **node-based canvas**, in the spirit of Make.com, built with **React Flow**. Users add prompt, model, router and output nodes, connect them to an LLM and lay out their own architecture. **Project managers** use it to build and test different use cases and validate a flow before it ships. Flows have draft and published versions.",
      },
      {
        label: "The Python SDK",
        body: "**aviaraeye** is an **MIT-licensed package on PyPI** (v0.6.0). It wraps Langfuse with drop-in OpenAI and Azure OpenAI clients, auto-instrumentation for Gemini and Claude, multi-agent spans, trace context that survives thread pools and Celery, prompt sync with a read-only drift check for CI, and scoring.",
      },
      {
        label: "What it costs",
        body: "The whole platform (database, Redis and a virtual machine) costs about **$100 a month**. By my estimate, hosted pricing for the same 50,000 traces a month would be about **$250 a month**, so self-hosting is roughly **60% cheaper**, and there is no limit on seats.",
      },
    ],
    decisions: [
      {
        title: "Build or buy",
        chose: "Self-host open-source Langfuse and extend it",
        over: "A hosted observability plan",
        why: "About $100 against an estimated $250 a month at the same volume, with no seat limits, and the freedom to add features such as the workflow builder.",
      },
      {
        title: "How projects adopt it",
        chose: "A Python SDK with drop-in provider clients",
        why: "Existing code gets traced by changing an import, and prompt sync and scoring work the same way in every project.",
      },
      {
        title: "Who can test ideas",
        chose: "A visual workflow builder",
        why: "Project managers can build and test use cases themselves instead of waiting for an engineer.",
      },
    ],
    result:
      "Four production AI projects now send **50,000+ traces a month** through it. It costs about **$100 a month** to run, against an estimated **$250** for hosted pricing at the same volume. Engineers debug failures, manage prompts and watch cost from one place, project managers test workflows on the canvas, and the Python SDK is public on PyPI.",
    stack: ["Langfuse (self-hosted, extended)", "TypeScript", "Node.js", "React Flow", "Python SDK", "Redis", "Docker", "LLM tracing", "Prompt management", "LLM evaluation"],
    links: [{ label: "aviaraeye on PyPI", href: "https://pypi.org/project/aviaraeye/" }],
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
