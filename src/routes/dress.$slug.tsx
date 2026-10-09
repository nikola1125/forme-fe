import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { dresses } from "@/lib/dresses";
import { site } from "@/lib/site";
import { DressCard } from "@/components/DressCard";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/dress/$slug")({
  head: ({ params }) => {
    const dress = dresses.find((d) => d.slug === params.slug);
    const title = dress ? `${dress.name} — Formë Dress Rental, Tiranë` : "Dress — Formë";
    const description = dress
      ? `${dress.name}: ${dress.note} Available for rent in ${site.city} — ${dress.price}.`
      : "A dress from the Formë rental collection.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(dress ? [{ property: "og:image", content: dress.image }] : []),
      ],
    };
  },
  loader: ({ params }) => {
    const dress = dresses.find((d) => d.slug === params.slug);
    if (!dress) throw notFound();
    return { dress };
  },
  component: DressDetail,
});

const spec = (label: string, value: string) => ({ label, value });

function DressDetail() {
  const { slug } = Route.useParams();
  // The loader already 404s on an unknown slug, so this is always defined.
  const dress = dresses.find((d) => d.slug === slug)!;

  const specs = [
    spec("Mood", dress.mood),
    spec("Rental period", site.rental.duration),
    spec("Deposit", "Refundable · 5.000 L"),
    spec("Care", "Cleaning included"),
  ];

  const related = dresses.filter((d) => d.slug !== dress.slug).slice(0, 3);

  const waText = encodeURIComponent(
    `Hi Formë — I'd like to reserve the ${dress.name} dress (${dress.price}).`,
  );

  return (
    <article>
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-7xl px-6 pt-24 md:px-10 md:pt-40"
      >
        <Link
          to="/collection"
          className="link-underline font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          ← The collection
        </Link>
      </nav>

      {/* Main — image + info */}
      <section className="mx-auto max-w-7xl px-6 pt-8 pb-20 md:px-10 md:pt-12 md:pb-28">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
          {/* Image */}
          <div className="relative">
            <div className="overflow-hidden bg-secondary md:sticky md:top-28">
              <img
                src={dress.image}
                alt={`${dress.name} — ${dress.note}`}
                width={1200}
                height={1600}
                className="aspect-[3/4] w-full object-cover"
              />
              {dress.exclusive ? (
                <span className="absolute top-4 left-4 bg-foreground px-3 py-1 font-mono text-[10px] tracking-[0.24em] text-background uppercase">
                  Exclusive
                </span>
              ) : null}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="eyebrow">{dress.mood}</p>
            <h1 className="mt-4 font-display text-4xl leading-[0.95] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {dress.name}
            </h1>
            <p className="mt-5 font-display text-2xl text-accent">{dress.price}</p>

            <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
              {dress.note}
            </p>

            {/* Sizes */}
            <div className="mt-10">
              <p className="eyebrow mb-3">Available sizes</p>
              <div className="flex flex-wrap gap-2">
                {dress.sizes.map((s) => (
                  <span
                    key={s}
                    className="border border-border px-3 py-1.5 text-xs tracking-[0.16em] text-foreground/80 uppercase"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Spec table */}
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-border pt-8">
              {specs.map((s) => (
                <div key={s.label}>
                  <dt className="eyebrow">{s.label}</dt>
                  <dd className="mt-1.5 text-sm text-foreground">{s.value}</dd>
                </div>
              ))}
            </dl>

            {/* Actions */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                to="/booking"
                search={{ dress: dress.name }}
                className="group inline-flex items-center justify-center gap-3 bg-primary px-8 py-4 font-mono text-[11px] tracking-[0.2em] text-primary-foreground uppercase transition-colors hover:bg-accent"
              >
                Reserve this dress
                <span className="transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <a
                href={`https://wa.me/${site.whatsapp}?text=${waText}`}
                target="_blank"
                rel="noreferrer"
                className="link-underline text-center font-mono text-[11px] tracking-[0.2em] text-foreground uppercase sm:text-left"
              >
                Ask on WhatsApp
              </a>
            </div>

            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              {site.rental.fitting}. {site.rental.deposit}. We confirm availability the same day.
            </p>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 ? (
        <section className="border-t border-border">
          <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
            <Reveal>
              <p className="eyebrow">More from the collection</p>
              <h2 className="mt-4 font-display text-3xl tracking-tight text-foreground md:text-4xl">
                You might also like
              </h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-8 lg:grid-cols-3">
              {related.map((d, i) => (
                <Reveal key={d.slug} delay={(i % 3) * 90}>
                  <DressCard dress={d} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
