export interface Role {
  id: string;
  company: string;
  title: string;
  date: string;
  place: string;
  summary: string;
  points: string[];
}

export const roles: Role[] = [
  {
    id: "sde2",
    company: "Aviara Labs",
    title: "Software Development Engineer II",
    date: "Apr 2026 – Present",
    place: "Noida",
    summary:
      "Own the AI architecture across the company's platforms: revenue ML, the COVA agent layer and Aviara Eye.",
    points: [
      "Solo-built and run a multi-tenant hotel revenue platform, from requirements and client management to deployment. It is live in 80+ hotels; the client reports RevPAR up 12% and occupancy up 9% year on year.",
      "Architected production RAG and multi-agent workflows with tenant isolation and permission-aware retrieval.",
      "Established LLM tracing and prompt management across all generative AI apps.",
    ],
  },
  {
    id: "sde1",
    company: "Aviara Labs",
    title: "Software Development Engineer I",
    date: "Aug 2024 – Apr 2026",
    place: "Noida",
    summary: "Grew from shipping features to owning AI components, backend services and production architecture.",
    points: [
      "Shipped ML and deep learning models, document processing, retrieval and generative AI features.",
      "Built NTPC's agentic RAG system, now live in production, with source-cited answers over 1,000+ documents.",
      "Built backend services, data pipelines, database schemas and APIs used across production platforms.",
      "Made development reproducible with Docker, Git, Azure, MLflow, DVC and CI/CD.",
    ],
  },
  {
    id: "rapid",
    company: "Rapid Autobots",
    title: "Associate AI Developer",
    date: "Jan 2024 – Jul 2024",
    place: "Kerala (remote)",
    summary: "Built a conversational AI platform for a drop-shipping e-commerce business.",
    points: [
      "Contextual AI workflows over product, order and customer data with OpenAI, LangChain and FastAPI.",
      "Backend integrations and automated reporting, containerised with Docker.",
    ],
  },
];
