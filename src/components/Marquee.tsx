import { marqueeTech } from "../data/profile";

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  // The list is rendered twice so the CSS loop is seamless.
  return (
    <div className={`marquee-row${reverse ? " reverse" : ""}`} aria-hidden="true">
      {[0, 1].map((n) => (
        <ul className="marquee-track" key={n}>
          {items.map((t) => (
            <li key={t}>
              {t}
              <i />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

export function Marquee() {
  const half = Math.ceil(marqueeTech.length / 2);
  return (
    <section className="marquee" aria-label="Technologies I work with">
      <p className="sr-only">Technologies: {marqueeTech.join(", ")}.</p>
      <Row items={marqueeTech.slice(0, half)} />
      <Row items={marqueeTech.slice(half)} reverse />
    </section>
  );
}
