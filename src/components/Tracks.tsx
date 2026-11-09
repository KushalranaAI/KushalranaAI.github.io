import { useScroll } from "../hooks/useLenis";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";

/** The three kinds of work on this site, side by side, so nobody has to guess which is which. */
const tracks = [
  {
    id: "work",
    num: "01",
    name: "Professional work",
    what: "Production systems I built at Aviara Labs for real users and real revenue.",
    proof: "Real users · private code · case studies",
  },
  {
    id: "projects",
    num: "02",
    name: "Personal projects",
    what: "Systems I design and build myself to prove production judgment, with measured results.",
    proof: "My own repos · synthetic data · load-tested",
  },
  {
    id: "pathways",
    num: "03",
    name: "Learning pathways",
    what: "Free roadmaps I follow to learn a field end to end, published so others can follow too.",
    proof: "Open source · self-paced · build in public",
  },
] as const;

export function Tracks() {
  const { scrollTo } = useScroll();
  return (
    <section className="tracks" aria-label="How this portfolio is organised">
      <p className="eyebrow">Three kinds of work, kept separate</p>
      <ul className="tracks-grid">
        {tracks.map((t, i) => (
          <li key={t.id}>
            <Reveal delay={i * 0.08} y={20} className="track-wrap">
              <a
                className="track"
                href={`#${t.id}`}
                data-cursor="Go"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(t.id);
                }}
              >
                <span className="track-num">{t.num}</span>
                <b>{t.name}</b>
                <span className="track-what">{t.what}</span>
                <span className="track-proof">{t.proof}</span>
                <span className="track-go" aria-hidden="true">
                  <Icon name="arrow-up-right" />
                </span>
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
