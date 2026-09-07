import { createFileRoute, Link } from "@tanstack/react-router";
import seen1 from "@/assets/seen-1.jpg";
import seen2 from "@/assets/seen-2.jpg";
import seen3 from "@/assets/seen-3.jpg";
import dress3 from "@/assets/dress-3.jpg";
import dress5 from "@/assets/dress-5.jpg";
import dress6 from "@/assets/dress-6.jpg";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export const Route = createFileRoute("/as-seen-on")({
  head: () => ({
    meta: [
      { title: "As Seen On — Formë Dress Rental, Tiranë" },
      {
        name: "description",
        content:
          "Formë dresses on creators and clients across Tiranë — weddings, editorials and evenings out, styled from the rental collection.",
      },
      { property: "og:title", content: "As Seen On — Formë Dress Rental" },
      {
        property: "og:description",
        content: "Formë dresses worn by creators and clients across Tiranë.",
      },
    ],
  }),
  component: AsSeenOn,
});

const looks = [
  { image: seen1, handle: "@elena.k", dress: "Aria", note: "Evening in Tiranë" },
  { image: seen2, handle: "@mira.dsn", dress: "Vera", note: "Summer editorial" },
  { image: seen3, handle: "@lea.styles", dress: "Dorë", note: "Studio fitting" },
  { image: dress3, handle: "@anna.rr", dress: "Olea", note: "Coastal wedding" },
  { image: dress5, handle: "@sara.md", dress: "Rosa", note: "Engagement dinner" },
  { image: dress6, handle: "@ada.form", dress: "Noir", note: "Gallery opening" },
];

function AsSeenOn() {
  return (
    <>
      <header className="mx-auto max-w-7xl px-6 pt-28 pb-10 md:px-10 md:pt-52 md:pb-16">
        <p className="eyebrow animate-fade-in">As seen on</p>
        <h1 className="animate-rise mt-6 max-w-2xl font-display text-4xl leading-tight text-primary md:text-7xl">
          The dresses, <span className="italic">out in the world</span>
        </h1>
        <p className="animate-rise mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
          Tag us at{" "}
          <a href={site.instagram} target="_blank" rel="noreferrer" className="link-underline">
            {site.instagramHandle}
          </a>{" "}
          and your look may appear here.
        </p>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10 md:pb-36">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-8 lg:grid-cols-3">
          {looks.map((look, i) => (
            <Reveal key={look.handle} delay={(i % 3) * 100}>
              <figure className="group">
                <div className="overflow-hidden bg-secondary">
                  <img
                    src={look.image}
                    alt={`${look.handle} wearing the ${look.dress} dress from Formë`}
                    loading="lazy"
                    width={1000}
                    height={1250}
                    className="aspect-4/5 w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                </div>
                <figcaption className="mt-4 flex flex-col gap-0.5 text-xs text-muted-foreground sm:flex-row sm:items-baseline sm:justify-between">
                  <span className="tracking-[0.18em] uppercase">{look.handle}</span>
                  <span className="font-display text-base text-primary">{look.dress}</span>
                </figcaption>
                <p className="mt-1 text-xs text-muted-foreground">{look.note}</p>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <Link
            to="/booking"
            className="link-underline mt-16 inline-block text-[11px] tracking-[0.24em] text-primary uppercase"
          >
            Reserve your look
          </Link>
        </Reveal>
      </section>
    </>
  );
}
