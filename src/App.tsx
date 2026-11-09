import { useCallback, useState } from "react";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Cursor } from "./components/Cursor";
import { Experience } from "./components/Experience";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Nav } from "./components/Nav";
import { Pathways } from "./components/Pathways";
import { Preloader, shouldIntro } from "./components/Preloader";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { Stats } from "./components/Stats";
import { Tracks } from "./components/Tracks";
import { Work } from "./components/Work";
import { profile } from "./data/profile";
import { ScrollProvider } from "./hooks/useLenis";

export default function App() {
  const [intro] = useState(shouldIntro);
  const [ready, setReady] = useState(!intro);
  const onIntroDone = useCallback(() => setReady(true), []);

  return (
    <ScrollProvider>
      <a className="skip-link" href="#work">
        Skip to content
      </a>
      <Cursor />
      {intro && <Preloader onDone={onIntroDone} />}
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <Stats />
        <Tracks />
        <Work />
        <Projects />
        <Pathways />
        <Experience />
        <Skills />
        <About />
        <Contact />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p>Designed &amp; built with React, Motion and Lenis.</p>
        </div>
      </footer>
    </ScrollProvider>
  );
}
