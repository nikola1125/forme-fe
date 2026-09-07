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

function Home() {
  const exclusive = dresses.filter((d) => d.exclusive);

  return (
    <>
      {/* Hero */}
      <section className="relative grain min-h-screen overflow-hidden">
        <img
          src={hero}
          alt="Model wearing a cream silk gown from the Formë collection in a sunlit plaster room"
          width={1600}
          height={1920}
          className="animate-slow-zoom absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-r from-panna/95 via-panna/55 to-transparent" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-6 pb-20 md:px-10 md:pb-28">
          <p className="eyebrow animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Dress rental studio · {site.city}
          </p>
          <h1
            className="animate-rise mt-6 max-w-3xl font-display text-5xl leading-[1.05] text-primary sm:text-6xl md:text-8xl"
            style={{ animationDelay: "0.35s" }}
          >
            Defined
            <span className="block italic">by form</span>
          </h1>
          <p
            className="animate-rise mt-8 max-w-md text-sm leading-relaxed text-foreground/80 md:text-base"
            style={{ animationDelay: "0.55s" }}
          >
            A distinctive dress collection for rent — inspired by modern elegance, retro charm and a
            soft bohemian aesthetic.
          </p>
          <div
            className="animate-rise mt-10 flex flex-wrap items-center gap-8"
            style={{ animationDelay: "0.7s" }}
          >
            <Link
              to="/collection"
              className="group inline-flex items-center gap-3 bg-primary px-8 py-4 text-[11px] tracking-[0.24em] text-primary-foreground uppercase transition-colors hover:bg-clay"
            >
              View collection
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/booking"
              className="link-underline text-[11px] tracking-[0.24em] text-primary uppercase"
            >
              Reserve a fitting
            </Link>
          </div>
        </div>
      </section>

      {/* Ethos */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-36">
        <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-16">
          <Reveal>
            <p className="eyebrow">The studio</p>
            <h2 className="mt-6 font-display text-3xl leading-snug text-primary md:text-5xl">
              Fewer dresses, chosen slowly, kept in perfect condition.
            </h2>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
              Each piece is selected for the way it moves and the way it holds a shape. You come in,
              try what calls you, and leave with something that feels made for the evening ahead —
              for a few days, not forever.
            </p>
            <Link
              to="/about"
              className="link-underline mt-10 inline-block text-[11px] tracking-[0.24em] text-primary uppercase"
            >
              About Formë
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <img
              src={drape}
              alt="Champagne satin dress draped over an antique wooden chair in warm light"
              loading="lazy"
              width={1408}
              height={1008}
              className="w-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* Exclusive */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-32">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Exclusive pieces</p>
                <h2 className="mt-5 font-display text-3xl text-primary md:text-5xl">
                  Only one of each
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                Rental period {site.rental.duration}. {site.rental.deposit}.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 sm:mt-16">
            <DressShowcase dresses={exclusive} layout="rail" />
          </div>

          <Reveal>
            <Link
              to="/collection"
              className="link-underline mt-16 inline-block text-[11px] tracking-[0.24em] text-primary uppercase"
            >
              See the full collection
            </Link>
          </Reveal>
        </div>
      </section>

      {/* As seen on */}
      <section>
        {/* Section header — standard page rhythm, above the pinned gallery */}
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-10 md:px-10 md:pt-32 md:pb-14">
          <Reveal>
            <p className="eyebrow">As seen on</p>
            <h2 className="mt-5 max-w-xl font-display text-3xl text-primary md:text-5xl">
              Worn, photographed, returned.
            </h2>
          </Reveal>
        </div>

        {/* Full-bleed scroll-driven lookbook gallery */}
        <ScrollGallery slides={seen} />

        {/* "More looks" link — below the gallery, standard padding */}
        <div className="mx-auto max-w-7xl px-6 pt-10 pb-16 md:px-10 md:pt-14 md:pb-32">
          <Reveal>
            <Link
              to="/as-seen-on"
              className="link-underline inline-block text-[11px] tracking-[0.24em] text-primary uppercase"
            >
              More looks
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-36">
          <Reveal>
            <p className="eyebrow">Reserve</p>
            <h2 className="mt-6 font-display text-4xl leading-tight text-primary md:text-6xl">
              Tell us the date.
              <span className="block italic">We&apos;ll hold the dress.</span>
            </h2>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
              <Link
                to="/booking"
                className="group inline-flex items-center gap-3 bg-primary px-8 py-4 text-[11px] tracking-[0.24em] text-primary-foreground uppercase transition-colors hover:bg-clay"
              >
                Booking form
                <span className="transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <a
                href={`tel:+${site.phoneRaw}`}
                className="link-underline text-[11px] tracking-[0.24em] text-primary uppercase"
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
