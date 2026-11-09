export interface SkillGroup {
  id: string;
  title: string;
  blurb: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "genai",
    title: "Generative AI & agents",
    blurb: "Agents, retrieval and the glue that makes LLMs useful in production.",
    items: ["LLMs", "RAG", "Agentic AI", "Multi-agent systems", "MCP", "Tool calling", "Hybrid & semantic search", "Prompt engineering", "LangChain", "LlamaIndex", "Vector databases"],
  },
  {
    id: "ml",
    title: "Machine learning & CV",
    blurb: "From classical models to deep learning, evaluated and shipped as pipelines.",
    items: ["Classical ML", "Deep learning", "Computer vision", "NLP", "PyTorch", "TensorFlow", "Feature engineering", "Model evaluation", "ML pipelines"],
  },
  {
    id: "ops",
    title: "LLMOps & MLOps",
    blurb: "Tracing, prompts, evaluation and experiment tracking so AI stays debuggable.",
    items: ["Langfuse", "LangSmith", "LLM tracing", "Prompt management", "LLM evaluation", "MLflow", "DVC", "Airflow"],
  },
  {
    id: "backend",
    title: "Backend & APIs",
    blurb: "The services other teams depend on.",
    items: ["Python", "FastAPI", "Django", "REST API design", "Microservices", "SQL", "JavaScript", "C++"],
  },
  {
    id: "data",
    title: "Data & storage",
    blurb: "Where structured records, documents and vectors live.",
    items: ["PostgreSQL", "MongoDB", "Redis", "Vector databases"],
  },
  {
    id: "cloud",
    title: "Cloud, DevOps & design",
    blurb: "Deploying, scaling and designing multi-tenant systems.",
    items: ["Azure", "Docker", "Kubernetes", "GitHub Actions", "CI/CD", "Linux", "Multi-tenant SaaS", "System design"],
  },
];
