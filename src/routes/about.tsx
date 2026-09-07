import { createFileRoute, Link } from "@tanstack/react-router";
import studio from "@/assets/studio.jpg";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "The Studio — Formë, Tiranë" },
      {
        name: "description",
        content:
          "Formë is a dress rental studio in Tiranë. How renting works: choose, fit, wear for three days, return. By appointment.",
      },
      { property: "og:title", content: "The Studio — Formë, Tiranë" },
      {
        property: "og:description",
        content: "A dress rental studio in Tiranë. Choose, fit, wear, return.",
      },
    ],
  }),
  component: About,
});

const steps = [
  {
    n: "01",
    title: "Choose",
    body: "Browse the collection online or come by the studio. Tell us the date and the occasion.",
  },
  {
    n: "02",
    title: "Fit",
    body: `${site.rental.fitting}. Small adjustments and styling are included.`,
  },
  {
    n: "03",
    title: "Wear",
    body: `The dress is yours for ${site.rental.duration}. ${site.rental.deposit}.`,
  },
  {
    n: "04",
    title: "Return",
    body: "Bring it back as it is — cleaning and care are handled by us.",
  },
];

function About() {
  return (
    <>
      <header className="mx-auto max-w-7xl px-6 pt-28 pb-10 md:px-10 md:pt-52 md:pb-16">
        <p className="eyebrow animate-fade-in">The studio</p>
        <h1 className="animate-rise mt-6 max-w-3xl font-display text-4xl leading-tight text-primary md:text-7xl">
          A small collection, <span className="italic">carefully kept</span>
        </h1>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-10 md:pb-24">
        <Reveal>
          <img
            src={studio}
            alt="Interior of the Formë studio with a wooden rail of ivory and caramel dresses"
            loading="lazy"
            width={1408}
            height={1008}
            className="w-full object-cover"
          />
        </Reveal>

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-2 md:gap-16">
          <Reveal>
            <h2 className="font-display text-3xl leading-snug text-primary md:text-4xl">
              Renting, not owning.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Formë began with a simple idea: the most beautiful dresses are worn once or twice, then
              left hanging. So we built a collection meant to travel between evenings — modern
              elegance, retro charm and a soft bohemian ease, kept in the condition it deserves.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Every fitting happens in the studio, by appointment, one guest at a time.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <dl className="divide-y divide-border border-t border-border">
              {steps.map((s) => (
                <div key={s.n} className="flex gap-8 py-7">
                  <dt className="eyebrow pt-1">{s.n}</dt>
                  <dd>
                    <p className="font-display text-2xl text-primary">{s.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-16 grid gap-10 border-t border-border pt-12 sm:grid-cols-3 md:mt-24 md:pt-14">
            <div>
              <p className="eyebrow">Visit</p>
              <a
                href={site.maps}
                target="_blank"
                rel="noreferrer"
                className="link-underline mt-3 block text-sm text-foreground/80"
              >
                {site.city}
              </a>
            </div>
            <div>
              <p className="eyebrow">Call</p>
              <a
                href={`tel:+${site.phoneRaw}`}
                className="link-underline mt-3 block text-sm text-foreground/80"
              >
                {site.phone}
              </a>
            </div>
            <div>
              <p className="eyebrow">Follow</p>
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                className="link-underline mt-3 block text-sm text-foreground/80"
              >
                {site.instagramHandle}
              </a>
            </div>
          </div>
          <Link
            to="/booking"
            className="group mt-14 inline-flex items-center gap-3 bg-primary px-8 py-4 text-[11px] tracking-[0.24em] text-primary-foreground uppercase transition-colors hover:bg-clay"
          >
            Book a fitting
            <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </Link>
        </Reveal>
      </section>
    </>
  );
}
