import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Hero } from "./components/Hero";
import { Nav } from "./components/Nav";
import { Pathways } from "./components/Pathways";
import { Projects } from "./components/Projects";
import { Work } from "./components/Work";
import { profile } from "./data/profile";

export default function App() {
  return (
    <>
      <a className="skip-link" href="#work">
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <Work />
        <Projects />
        <Pathways />
        <About />
        <Contact />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p>Designed &amp; built with React and Motion.</p>
        </div>
      </footer>
    </>
  );
}
