import { motion, useReducedMotion } from "motion/react";
import { pathways, type Pathway } from "../data/pathways";
import { socials } from "../data/profile";
import { mediumUrl, posts } from "../data/writing";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";

function RagVisual() {
  const steps = ["Docs", "Chunk", "Embed", "Hybrid + rerank", "Agents · MCP"];
  return (
    <div className="rag-visual" aria-hidden="true">
      <div className="rag-flow">
        {steps.map((s, i) => (
          <span key={s} className={i === 3 ? "hl" : i === 4 ? "hl2" : ""} style={{ ["--d" as string]: `${i * 0.35}s` }}>
            {s}
          </span>
        ))}
      </div>
      <div className="rag-code">
        <span>$</span> claude mcp add nimbus-docs -- python mcp_servers/docs_server.py
        <br />
        <span>✓</span> 30 days · 15 projects · offline test suite
      </div>
    </div>
  );
}

function PathwayCard({ p, index }: { p: Pathway; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      className="lab-card"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="lab-media">
        {p.image ? <img src={p.image} width={1200} height={750} loading="lazy" alt={p.alt ?? ""} /> : <RagVisual />}
        <span className="lab-index" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="lab-body">
        <h3>{p.title}</h3>
        <p>{p.blurb}</p>
        <ul className="lab-stats">
          {p.stats.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div className="project-links">
          {p.live && (
            <a className="project-link" href={p.live} target="_blank" rel="noopener">
              <Icon name="external" /> Start learning
            </a>
          )}
          <a className="project-link" href={p.repo} target="_blank" rel="noopener">
            <Icon name="github" /> Repository
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export function Pathways() {
  return (
    <section className="section" id="learning" aria-labelledby="learning-title">
      <div className="container">
        <header className="section-head">
          <Reveal>
            <p className="eyebrow">03 · Learning</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="learning-title">
              I learn in public, <em className="serif">for free.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="section-lead">
              When I learn a field, I publish the route as an open-source course with runnable projects and simulators, and I write up
              what I learn, so anyone can follow it.
            </p>
          </Reveal>
        </header>

        <div className="path-grid">
          {pathways.map((p, i) => (
            <PathwayCard key={p.id} p={p} index={i} />
          ))}
        </div>
        <p className="lab-foot">
          {pathways.length} pathways, all free on{" "}
          <a href={socials[0]!.href} target="_blank" rel="noopener">
            GitHub
          </a>
          .
        </p>

        <div className="flagship-head writing-head">
          <h3 className="subhead">Writing</h3>
          <a className="project-link" href={mediumUrl} target="_blank" rel="noopener">
            <Icon name="external" /> All posts on Medium
          </a>
        </div>
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.href}>
              <a href={post.href} target="_blank" rel="noopener">
                <span className="post-date">{post.date}</span>
                <span className="post-title">{post.title}</span>
                <span className="post-topic">{post.topic}</span>
                <Icon name="arrow-up-right" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
