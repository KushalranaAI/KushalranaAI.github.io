import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { profile, socials } from "../data/profile";
import { useScroll as useSmoothScroll } from "../hooks/useLenis";
import { Icon } from "./Icon";
import { Magnetic } from "./Magnetic";
import { NeuralField } from "./NeuralField";
import { SplitLine } from "./Reveal";

const BADGE = "AI ENGINEER • AGENTS • RAG • LLMOPS • ML • ";

export function Hero({ ready }: { ready: boolean }) {
  const { scrollTo } = useSmoothScroll();
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Photo tilt follows the pointer
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 140, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-11, 11]), { stiffness: 140, damping: 18 });

  // Content drifts up and fades as the hero scrolls away
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0]);

  const fadeUp = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 26 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="top" className="hero" ref={sectionRef} aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true">
        <NeuralField />
        <div className="hero-glow hero-glow-a" />
        <div className="hero-glow hero-glow-b" />
      </div>

      <motion.div className="hero-inner" style={{ y: drift, opacity: fade }}>
        <div className="hero-copy">
          <motion.p className="status" {...fadeUp(0.1)}>
            <span className="pulse" aria-hidden="true" />
            {profile.title} at {profile.company} · {profile.location}
          </motion.p>

          <h1 id="hero-title" className="hero-name">
            <SplitLine text={profile.first} play={ready} delay={0.1} />
            <SplitLine text={profile.last} play={ready} delay={0.35} className="serif grad" />
          </h1>

          <motion.p className="hero-role" {...fadeUp(0.75)}>
            {profile.role} <span aria-hidden="true">/</span> <em>{profile.headline}</em>
          </motion.p>

          <motion.p className="lead" {...fadeUp(0.9)}>
            {profile.intro}
          </motion.p>

          <motion.div className="cta-row" {...fadeUp(1.05)}>
            <Magnetic>
              <button className="btn btn-primary" type="button" onClick={() => scrollTo("work")} data-cursor="Go">
                See my work <Icon name="arrow" />
              </button>
            </Magnetic>
            <Magnetic>
              <a className="btn" href={profile.resume} download>
                <Icon name="download" /> Résumé
              </a>
            </Magnetic>
          </motion.div>

          <motion.ul className="social" aria-label="Profiles" {...fadeUp(1.2)}>
            {socials.map((s) => (
              <li key={s.id}>
                <a href={s.href} target="_blank" rel="noopener" aria-label={s.label} data-cursor={s.label}>
                  <Icon name={s.id as "github"} />
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${profile.email}`} aria-label="Email" data-cursor="Email">
                <Icon name="mail" />
              </a>
            </li>
          </motion.ul>
        </div>

        <motion.div
          className="hero-visual"
          initial={reduce ? false : { opacity: 0, scale: 0.92, y: 40 }}
          animate={ready ? { opacity: 1, scale: 1, y: 0 } : undefined}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onPointerMove={(e) => {
            if (e.pointerType !== "mouse" || reduce) return;
            const r = e.currentTarget.getBoundingClientRect();
            mx.set((e.clientX - r.left) / r.width - 0.5);
            my.set((e.clientY - r.top) / r.height - 0.5);
          }}
          onPointerLeave={() => {
            mx.set(0);
            my.set(0);
          }}
        >
          <motion.div className="portrait" style={{ rotateX: rx, rotateY: ry }} data-cursor="Hi 👋">
            <img src={profile.photo} width={720} height={720} alt={`Portrait of ${profile.name}`} fetchPriority="high" />
            <span className="portrait-shine" aria-hidden="true" />
          </motion.div>

          <svg className="badge" viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <path id="badge-circle" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
            </defs>
            <text>
              <textPath href="#badge-circle" textLength="470" lengthAdjust="spacing">
                {BADGE}
              </textPath>
            </text>
            <circle cx="100" cy="100" r="6" className="badge-dot" />
          </svg>

          <div className="float-card fc-1" aria-hidden="true">
            <span className="dot ok" />
            agent.run(tools=[search, sql, crm])
          </div>
          <div className="float-card fc-2" aria-hidden="true">
            <span className="dot violet" />
            trace · 14 spans · 1.8s
          </div>
        </motion.div>
      </motion.div>

      <motion.button
        className="scroll-cue"
        type="button"
        onClick={() => scrollTo("work")}
        aria-label="Scroll to selected work"
        initial={reduce ? false : { opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ delay: 1.6 }}
      >
        <span>Scroll</span>
        <i aria-hidden="true" />
      </motion.button>
    </section>
  );
}
