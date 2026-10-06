import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import drape from "@/assets/texture-drape.jpg";
import seen1 from "@/assets/seen-1.jpg";
import seen2 from "@/assets/seen-2.jpg";
import seen3 from "@/assets/seen-3.jpg";
import dress3 from "@/assets/dress-3.jpg";
import dress5 from "@/assets/dress-5.jpg";
import dress6 from "@/assets/dress-6.jpg";
import { DressShowcase } from "@/components/DressShowcase";
import { Reveal } from "@/components/Reveal";
import { ScrollGallery, type GallerySlide } from "@/components/ScrollGallery";
import { dresses } from "@/lib/dresses";
import { site } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Formë — Dress Rental Studio, Tiranë" },
      {
        name: "description",
        content:
          "Defined by form. A distinctive collection of dresses for rent in Tiranë — modern elegance, retro charm, soft bohemian ease. Reserve by appointment.",
      },
      { property: "og:title", content: "Formë — Dress Rental Studio, Tiranë" },
      {
        property: "og:description",
        content: "A distinctive dress collection for rent. Defined by form.",
      },
    ],
  }),
  component: Home,
});

const seen: GallerySlide[] = [
  { image: seen1, handle: "@elena.k", note: "Aria — evening in Tiranë" },
  { image: seen2, handle: "@mira.dsn", note: "Vera — summer editorial" },
  { image: seen3, handle: "@lea.styles", note: "Dorë — studio fitting" },
  { image: dress3, handle: "@anna.rr", note: "Lira — golden hour, Blloku" },
  { image: dress5, handle: "@sara.md", note: "Hëna — rooftop in white" },
  { image: dress6, handle: "@ada.form", note: "Mira — dusk at the gallery" },
];

const terms = [
  { k: "Rental period", v: site.rental.duration },
  { k: "Deposit", v: "Refundable" },
  { k: "Fitting", v: "Complimentary" },
];

function Home() {
  const exclusive = dresses.filter((d) => d.exclusive);

  return (
    <>
      {/* Hero — statement left, image right */}
      <section className="relative border-b border-border">
        <div className="grid min-h-dvh md:grid-cols-2">
          <div className="order-2 flex flex-col justify-center px-6 pt-12 pb-16 md:order-1 md:px-12 md:py-24 lg:px-20">
            <p className="eyebrow animate-fade-in" style={{ animationDelay: "0.15s" }}>
              Dress rental studio — {site.city}
            </p>
            <h1
              className="animate-rise mt-6 font-display text-5xl leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
              style={{ animationDelay: "0.3s" }}
            >
              Defined <span className="text-accent">by form</span>
            </h1>
            <p
              className="animate-rise mt-8 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base"
              style={{ animationDelay: "0.5s" }}
            >
              A distinctive dress collection for rent — modern elegance, retro charm and a soft
              bohemian ease, kept in perfect condition.
            </p>
            <div
              className="animate-rise mt-10 flex flex-wrap items-center gap-5"
              style={{ animationDelay: "0.65s" }}
            >
              <Link
                to="/collection"
                className="group inline-flex items-center gap-3 bg-primary px-7 py-4 font-mono text-[11px] tracking-[0.2em] text-primary-foreground uppercase transition-colors hover:bg-accent"
              >
                View collection
                <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                to="/booking"
                className="link-underline font-mono text-[11px] tracking-[0.2em] text-foreground uppercase"
              >
                Reserve a fitting
              </Link>
            </div>
          </div>

          <div className="relative order-1 h-[44vh] overflow-hidden md:order-2 md:h-auto">
            <img
              src={hero}
              alt="A model wearing a gown from the Formë collection"
              width={1600}
              height={1920}
              className="animate-slow-zoom h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent md:bg-gradient-to-r" />
          </div>
        </div>
      </section>

      {/* Rental terms — organized info band */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {terms.map((t) => (
            <div key={t.k} className="px-6 py-8 md:px-10 md:py-10">
              <p className="eyebrow">{t.k}</p>
              <p className="mt-2 font-display text-2xl tracking-tight text-foreground">{t.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Exclusive collection */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
          <Reveal>
            <p className="eyebrow">Exclusive pieces</p>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
              <h2 className="font-display text-4xl tracking-tight text-foreground md:text-5xl">
                Only one of each
              </h2>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                Rental period {site.rental.duration}. {site.rental.deposit}.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 sm:mt-14">
            <DressShowcase dresses={exclusive} layout="masonry" />
          </div>

          <Reveal>
            <Link
              to="/collection"
              className="link-underline mt-14 inline-block font-mono text-[11px] tracking-[0.2em] text-foreground uppercase"
            >
              See the full collection →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* The studio */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
          <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
            <Reveal>
              <p className="eyebrow">The studio</p>
              <h2 className="mt-5 font-display text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
                Fewer dresses, chosen slowly, kept in perfect condition.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
                Each piece is selected for the way it moves and the way it holds a shape. You come
                in, try what calls you, and leave with something made for the evening ahead — for a
                few days, not forever.
              </p>
              <Link
                to="/about"
                className="link-underline mt-8 inline-block font-mono text-[11px] tracking-[0.2em] text-foreground uppercase"
              >
                About Formë →
              </Link>
            </Reveal>
            <Reveal delay={120}>
              <img
                src={drape}
                alt="Satin dress detail in warm light"
                loading="lazy"
                width={1408}
                height={1008}
                className="aspect-[4/3] w-full object-cover"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* As seen on — scroll gallery */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-10 md:px-10 md:pt-28 md:pb-12">
          <Reveal>
            <p className="eyebrow">As seen on</p>
            <h2 className="mt-5 max-w-xl font-display text-4xl tracking-tight text-foreground md:text-5xl">
              Worn, photographed, returned.
            </h2>
          </Reveal>
        </div>

        <ScrollGallery slides={seen} />

        <div className="mx-auto max-w-7xl px-6 pt-10 pb-20 md:px-10 md:pb-28">
          <Reveal>
            <Link
              to="/as-seen-on"
              className="link-underline inline-block font-mono text-[11px] tracking-[0.2em] text-foreground uppercase"
            >
              More looks →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Reserve CTA */}
      <section className="bg-card">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
          <Reveal>
            <p className="eyebrow">Reserve</p>
            <h2 className="mt-6 font-display text-4xl leading-tight tracking-tight text-foreground md:text-6xl">
              Tell us the date.
              <span className="block text-accent">We&apos;ll hold the dress.</span>
            </h2>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
              <Link
                to="/booking"
                className="group inline-flex items-center gap-3 bg-primary px-7 py-4 font-mono text-[11px] tracking-[0.2em] text-primary-foreground uppercase transition-colors hover:bg-accent"
              >
                Booking form
                <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </Link>
              <a
                href={`tel:+${site.phoneRaw}`}
                className="link-underline font-mono text-[11px] tracking-[0.2em] text-foreground uppercase"
              >
                {site.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
