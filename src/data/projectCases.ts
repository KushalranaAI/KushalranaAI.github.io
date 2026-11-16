import type { CaseStudy } from "./cases";

/**
 * Case studies for the personal projects that are built and measured. `id` matches projects.ts.
 * Every number here comes from that project's bench/ folder. Do not round up, and keep the caveats.
 */

// KynAI dev-split baseline, bench/20261112T060445Z-dev-full-gpt-6-luna: [id, fault, culprit file in top 3, evidence validity, steps]
const kynaiRuns: [string, string, boolean, number, number][] = [
  ["g-001", "Memory leak", true, 0.985, 55],
  ["g-002", "Memory leak", true, 0.971, 21],
  ["g-004", "Memory leak", true, 0.966, 19],
  ["g-005", "Memory leak", true, 0.957, 59],
  ["g-007", "Stale prices", false, 0.988, 59],
  ["g-008", "Stale prices", true, 0.982, 58],
  ["g-010", "Stale prices", true, 0.985, 59],
  ["g-011", "Stale prices", true, 0.903, 20],
  ["g-013", "Date rules skipped", true, 1, 59],
  ["g-014", "Date rules skipped", true, 0.955, 57],
  ["g-016", "Date rules skipped", true, 0.956, 54],
  ["g-018", "Slow query", true, 1, 55],
  ["g-019", "Slow query", true, 0.947, 19],
  ["g-021", "Slow query", true, 0.893, 20],
  ["g-022", "Slow query", true, 1, 21],
  ["g-023", "Pool exhaustion", true, 0.968, 20],
  ["g-024", "Pool exhaustion", true, 1, 21],
  ["g-026", "Pool exhaustion", true, 1, 37],
  ["g-028", "Bad config", true, 0.971, 17],
  ["g-029", "Bad config", true, 0.927, 59],
  ["g-031", "Bad config", true, 0.952, 23],
  ["g-032", "Bad config", true, 0.877, 58],
];

export const projectCases: CaseStudy[] = [
  {
    id: "kynai",
    num: "01",
    title: "KynAI: a multi-agent incident investigator",
    hook: "Describe an incident in the terminal and get a root-cause report in which code, not a model, checks every cited file, line and commit.",
    tags: ["AI agents", "Personal project", "Synthetic benchmark", "2026"],
    metrics: [
      { value: "21 / 22", label: "incidents with the culprit file in the top 3 (tuning split)" },
      { value: "96%", label: "of cited evidence verified by code" },
      { value: "0", label: "unsafe actions executed" },
    ],
    problem:
      "When production breaks, the on-call engineer spends the first hour joining four things by hand: the code, recent changes, logs and metrics. The work is mechanical but slow, and the answer is often one commit or one function. Chat assistants guess without evidence, a real repo is far bigger than a model's context window, and an agent with an open shell is not acceptable near production.",
    built:
      "A command-line tool that runs inside a repo. You describe the incident, and a team of agents reads the code, git history, logs and metrics, then writes a report that ranks the likely causes, shows the evidence for each, suggests a fix as a diff it **never applies**, and says plainly what it did **not** check. Around it: a session store with resume, a read-only dashboard, MCP in both directions with two MCP servers I wrote, and an eval harness with a demo service full of seeded faults.",
    role: "A personal project, built outside work. The design, the safety model and the evaluation method are mine. It uses no code, data or internals from my employer, and all incident data is synthetic.",
    sections: [
      {
        label: "How an investigation runs",
        body: "A **planner** reads the incident, maps the repo and picks specialists. A **code explorer**, a **change analyst** and a **log and metrics analyst** work in parallel. A **synthesizer** ranks the hypotheses, and a **critic** rejects any claim without evidence and sends the gaps back to the planner. Then a verifier checks every citation, a person approves, and the report is written. A single-agent mode runs the same tools in one loop, as the baseline the multi-agent design has to beat.",
      },
      {
        label: "Evidence or it didn't happen",
        body: "Every tool records each file range, commit and log line it actually showed to an agent. The **verifier is plain code, not a model**: a citation counts only if it points inside something an agent really read. Anything else is dropped or marked unverified, never shown as fact. In one real run, **56 of 60** citations passed; the four that were dropped pointed at log ranges no agent had opened.",
      },
      {
        label: "Safety is enforced in code, not in prompts",
        body: "Tools sit in three tiers. Read-only tools run freely. Anything else on a short allowlist needs a **yes from the person at the keyboard**. File writes, an open shell, running code and installing packages are **forbidden, with no flag to override**. Secrets are redacted before any text reaches a model, a log or a report, and the API key lives in the OS keychain. Two incidents in the measured run carry prompt-injection bait: both were solved with **0 escalation attempts and 0 unsafe actions**.",
      },
      {
        label: "Repos bigger than the context window",
        body: "KynAI builds a **repo map** (file tree plus a tree-sitter symbol index) and a full-text index in SQLite, then pulls in code only when an agent asks for it, inside a token budget. There is **no vector database**: incidents usually carry exact anchors such as an error string, a function name or a path in a stack trace, and evidence needs an exact file and line, not a fuzzy chunk.",
      },
      {
        label: "How it is measured",
        body: "A small hotel-pricing style service with **32 seeded faults across six fault types**, one git branch per incident, each with a known culprit file and commit. They are split into 22 for tuning and 10 held out. Scoring is done by code, not by a model judging a model. The first baseline ran the full multi-agent system on the **22 tuning incidents**, once each: culprit file ranked first in **18**, in the top three in **21**, culprit commit in the top three in **21**, at a median of about **45 steps and 5 minutes** per incident.",
      },
    ],
    decisions: [
      {
        title: "How agents find code",
        chose: "Repo map, symbol index and full-text search",
        over: "Embeddings and a vector database",
        why: "Incidents contain exact strings to search for, and a citation needs an exact line range. I will add semantic search only if an ablation shows misses that it would have fixed.",
      },
      {
        title: "How much the agent may do",
        chose: "Tiered tools, an allowlist and human approval",
        over: "Sandboxed code execution",
        why: "A prompt is not a security boundary, so the policy lives in the tool registry. The cost is real: KynAI cannot reproduce a bug by running code, so some causes stay hypotheses, and the report says so.",
      },
      {
        title: "How agents call tools",
        chose: "A tool call is data inside a typed step",
        over: "Each provider's native function calling",
        why: "One contract works the same across Claude, OpenAI-compatible endpoints and local models, and a scripted fake model can drive the whole test suite offline.",
      },
      {
        title: "How quality is judged",
        chose: "Seeded faults with known answers, scored by code",
        over: "A model grading the reports",
        why: "A model judging a model is circular. With a known culprit file and commit, a run is right or wrong, and anyone can rerun it.",
      },
    ],
    problems: [
      {
        title: "One model call stalled for 72 minutes",
        symptom: "One benchmark incident ended as a partial report. A single model call had hung for 4,317 seconds and used up the run's time budget.",
        cause: "The SDK's timeout applies to each network read, not to the whole request, so a connection that keeps trickling never times out.",
        fix: "A hard wall-clock deadline around every model call, capped at whatever time the run has left, with a test.",
      },
      {
        title: "A hostile repo could run code through git blame",
        symptom: "My own security audit found that a repo under investigation could execute a command on the engineer's machine.",
        cause: "git blame honoured text-conversion drivers set in the repo's own .gitattributes file, so a file in the repo decided what git ran.",
        fix: "Every git log, show, diff and blame call is now hardened in one place, and a red-team test with canary files proves it, including a positive control that shows the canary does fire without the fix.",
      },
    ],
    runs: {
      caption: "22 incidents, one run each. Hover or focus a square.",
      cells: kynaiRuns.map(([id, group, hit, validity, steps]) => ({
        id,
        group,
        state: id === "g-026" ? "partial" : hit ? "hit" : "miss",
        note:
          (id === "g-026" ? "culprit found, but the report is partial: one model call stalled" : hit ? "culprit file in the top 3" : "culprit file not in the top 3") +
          ` · ${(validity * 100).toFixed(1)}% of evidence verified · ${steps} steps`,
      })),
    },
    limits: [
      "**These are tuning-split numbers.** The 10 held-out incidents have not been run, so nothing here shows how it does on faults it was not tuned on.",
      "**No ablations yet.** Single agent, no critic and no index have not been run, so I cannot yet say what the multi-agent design adds.",
      "**The benchmark is synthetic and mine.** Faults I wrote are faults I could imagine, and each incident ran once, so there is no measure of variance.",
      "**Cost is unknown and token use is high.** Each step resends the history, so one incident used roughly 230k to 910k tokens, and half the runs ended near the 60-step cap.",
      "**Not released yet.** It runs from source; the PyPI package and the hosted replay demo are not out.",
    ],
    result:
      "The v1 code base is built and tested offline on three operating systems. On the first measured baseline, the culprit file was in the top three for **21 of 22** incidents and ranked first for **18**, **96%** of cited evidence passed the code verifier, and there were **0 unsafe actions**. These are tuning-split numbers on a synthetic benchmark; the held-out run and the ablations come next.",
    stack: ["Python", "LangGraph", "pydantic", "tree-sitter", "SQLite FTS5", "MCP", "Typer", "FastAPI", "React", "TypeScript", "LangSmith", "Playwright"],
    links: [
      { label: "Repository", href: "https://github.com/KushalranaAI/KynAI" },
      { label: "Raw benchmark results", href: "https://github.com/KushalranaAI/KynAI/tree/main/bench" },
    ],
    diagram: {
      kind: "flow",
      caption: "Specialists gather evidence, a critic challenges it, code verifies it, a person approves",
      rows: [
        { nodes: [{ label: "Incident", sub: "“pricing worker crashes every few hours since Friday”" }] },
        { nodes: [{ label: "Planner", sub: "maps the repo, picks specialists", tone: "accent" }] },
        {
          boundary: "read-only tools · secrets redacted · step, token and cost budget",
          nodes: [
            { label: "Code explorer", sub: "search, read, blame", tone: "accent2" },
            { label: "Change analyst", sub: "git log and diffs", tone: "accent2" },
            { label: "Log and metrics analyst", sub: "files or MCP", tone: "accent2" },
          ],
        },
        { nodes: [{ label: "Synthesizer", sub: "ranks hypotheses" }, { label: "Critic", sub: "sends gaps back to the planner", tone: "accent" }] },
        { nodes: [{ label: "Evidence verifier", sub: "code, not a model" }, { label: "Human approval" }] },
        { nodes: [{ label: "Report", sub: "ranked causes · checked evidence · fix as a diff, never applied", tone: "ok" }] },
      ],
    },
  },
  {
    id: "relay",
    num: "02",
    title: "Relay: webhook delivery that survives crashes",
    hook: "Multi-tenant webhook delivery where Postgres is the queue. Workers were killed 23 times mid-run and no event was lost.",
    tags: ["Backend reliability", "Personal project", "TypeScript", "2026"],
    metrics: [
      { value: "0 lost", label: "of 20,000 deliveries, with a worker killed every 1.5 s" },
      { value: "2,245 / s", label: "deliveries on one laptop, p99 592 ms" },
      { value: "30 / 30", label: "failure causes triaged, 0 unsafe replays (rules baseline)" },
    ],
    problem:
      "Systems need to notify customer endpoints reliably. The naive version, sending an HTTP request after the database commit, loses events when a process crashes in between, and lets one failing receiver slow everyone else down. Receivers can also be slow, down or hostile.",
    built:
      "A webhook delivery service: an API that accepts events, workers that deliver them to every subscribed endpoint, and a dashboard to watch and replay them. Each request is **signed**, failures **retry with backoff**, anything that keeps failing is **dead-lettered and can be replayed**, and an endpoint that fails for a whole window is switched off automatically. A triage agent explains why an endpoint is failing, and an MCP server lets other agents inspect and, with an explicit switch, replay deliveries.",
    role: "A personal project, built outside work. The design and the test method are mine. All traffic is synthetic, from a receiver simulator that fails on purpose.",
    sections: [
      {
        label: "How an event is delivered",
        body: "One database transaction writes the event and **one delivery row per subscribed endpoint**, and only then does the API answer. That table **is the queue**: workers claim rows with a lock that skips rows another worker holds, under a short lease. A worker signs the payload, posts it and records the attempt. A failure is retried with exponential backoff and jitter, honouring the receiver's Retry-After header, and after the last attempt the delivery is dead-lettered for replay.",
      },
      {
        label: "How zero loss is proven",
        body: "A crash test starts the API, four workers and a receiver that fails **20% of requests**, then kills a random worker outright every 1.5 seconds. Across **20,000 deliveries and 23 kills**, it compared the events the API accepted with the events each endpoint acknowledged: **0 lost**. There were 649 duplicates (3.2%), which is what at-least-once delivery allows; receivers dedupe on a stable event id. **255 expired leases** were picked up and delivered by another worker.",
      },
      {
        label: "Throughput",
        body: "With a healthy receiver and four workers, **40,000 deliveries** drained at **2,245 a second**, with event-to-delivery latency of **78 ms at the median and 592 ms at p99**. The API, workers, receiver and Postgres all shared one laptop CPU, so read these as relative numbers, not cloud capacity.",
      },
      {
        label: "One bad receiver cannot hurt the rest",
        body: "Each endpoint has a **concurrency cap** and workers claim **round-robin across endpoints**, so a slow endpoint cannot hold every worker and a large backlog cannot starve a small tenant. Destination addresses are checked **at connect time**, private and metadata ranges are blocked, and redirects are never followed, so a URL that looked safe when saved cannot be repointed at an internal service.",
      },
      {
        label: "The triage agent",
        body: "Given a failing endpoint, it reads the recent attempts and returns the likely cause (receiver down, signing-secret mismatch, payload change, rate limiting or a problem on Relay's side), the evidence and a draft note for the customer. **Rules decide the cause**; a model, if configured, may only refine the wording. **Whether a replay is offered is decided in code**: never while the latest attempt is failing or the endpoint is disabled. On 30 scenarios with known causes it got **30 right with 0 unsafe replays**.",
      },
    ],
    decisions: [
      {
        title: "Where the queue lives",
        chose: "The deliveries table in Postgres is the queue",
        over: "Redis and BullMQ, which was my first plan",
        why: "A second store needs a publisher to copy events into it, and that hop is itself a place to lose or duplicate events. One transaction now covers accepting the event and fanning it out.",
      },
      {
        title: "What delivery promises",
        chose: "At-least-once, with a stable id on every attempt",
        over: "Exactly-once",
        why: "Exactly-once is not achievable over HTTP. A stable id lets the receiver drop the duplicates that a crash at the wrong moment creates.",
      },
      {
        title: "How a crashed worker is recovered",
        chose: "A lease stored on the row in the database",
        over: "Acknowledgements held in worker memory",
        why: "A killed worker then holds nothing that matters. Its lease expires and the delivery goes back to pending.",
      },
      {
        title: "When to check a destination URL",
        chose: "At connect time, on every request",
        over: "Once, when the URL is saved",
        why: "DNS rebinding and redirects both get past a check made at save time.",
      },
    ],
    problems: [
      {
        title: "A worker that had lost its lease could still change endpoint state",
        symptom: "After another worker had taken over a delivery, the first worker could still mark the endpoint as failing.",
        cause: "Finishing a delivery did not check that the worker still owned the row.",
        fix: "Completion now changes endpoint state only if the worker still holds the lease. The test for it fails if the check is removed.",
      },
      {
        title: "Timeouts were labelled as network errors",
        symptom: "The triage eval missed two scenarios. Receiver timeouts were being recorded as “network_error:23”, not as timeouts.",
        cause: "The timeout rejects with an error whose code is a number, so it fell through to the generic network-error label.",
        fix: "Fixed the classification and added a regression test. The eval caught this before any real traffic did.",
      },
    ],
    limits: [
      "**Not deployed.** The Azure Terraform is written but has never been applied, so every number comes from one laptop.",
      "**The triage score is a baseline, not a held-out result.** I wrote the rules alongside the 30 scenarios, and the model-assisted version has not been measured.",
      "**The per-endpoint cap is soft.** Two workers claiming at the same moment can each see room and briefly exceed it.",
      "**Workers poll.** They check every 100 ms instead of being notified, which adds up to one poll of latency.",
      "**Not connected to KynAI yet, and the code is not public yet.**",
    ],
    result:
      "Relay is built and tested on one machine. Under repeated worker kills and a receiver failing a fifth of requests it lost **0 of 20,000** deliveries, it drained **2,245 deliveries a second** with a healthy receiver, and its triage rules named the cause in **30 of 30** scenarios without offering an unsafe replay. Deploying it and measuring it in the cloud come next.",
    stack: ["TypeScript", "Node.js", "Fastify", "PostgreSQL", "Drizzle", "React", "TanStack Query", "Tailwind", "MCP", "Standard Webhooks", "Vitest", "Terraform"],
    diagram: {
      kind: "flow",
      caption: "Commit first, deliver from the table, recover from the lease",
      rows: [
        { nodes: [{ label: "POST /v1/events" }] },
        { nodes: [{ label: "One transaction", sub: "event row + one delivery row per endpoint, then 202", tone: "accent" }] },
        {
          boundary: "per-endpoint cap · round-robin across endpoints · URL checked at connect time",
          nodes: [
            { label: "Worker claims a row", sub: "skips locked rows · takes a lease", tone: "accent2" },
            { label: "Sign and POST", sub: "HMAC-SHA256", tone: "accent2" },
            { label: "Record the attempt", tone: "accent2" },
          ],
        },
        {
          nodes: [
            { label: "2xx: delivered", tone: "ok" },
            { label: "Failed: retry", sub: "backoff + jitter" },
            { label: "Out of attempts: dead-letter", sub: "replay later" },
          ],
        },
        { nodes: [{ label: "Worker killed", sub: "its lease expires and the delivery is claimed again", tone: "accent" }] },
      ],
    },
  },
];
