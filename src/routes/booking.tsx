import { createFileRoute } from "@tanstack/react-router";
import { BookingForm } from "@/components/BookingForm";
import { site } from "@/lib/site";

type BookingSearch = { dress?: string | undefined };

export const Route = createFileRoute("/booking")({
  validateSearch: (search: Record<string, unknown>): BookingSearch => ({
    dress: typeof search["dress"] === "string" ? search["dress"].slice(0, 60) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Reserve a Dress — Formë, Tiranë" },
      {
        name: "description",
        content:
          "Request a Formë dress rental: pick your dress, size and date and we confirm availability on WhatsApp within the day.",
      },
      { property: "og:title", content: "Reserve a Dress — Formë, Tiranë" },
      {
        property: "og:description",
        content: "Pick your dress, size and date — we confirm availability the same day.",
      },
    ],
  }),
  component: Booking,
});

function Booking() {
  const { dress } = Route.useSearch();

  return (
    <section className="mx-auto max-w-6xl px-6 pt-28 pb-20 md:px-10 md:pt-52 md:pb-36">
      <p className="eyebrow animate-fade-in">Booking</p>
      <h1 className="animate-rise mt-6 max-w-2xl font-display text-4xl leading-tight text-primary md:text-7xl">
        Reserve a dress
      </h1>
      <p className="animate-rise mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
        Send a provisional request — no payment now. We check availability and confirm on WhatsApp,
        then hold the dress for 24 hours.
      </p>

      <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-[1.4fr_0.6fr] md:gap-20">
        <BookingForm initialDress={dress ?? ""} />

        <aside className="space-y-10 border-t border-border pt-10 md:border-t-0 md:border-l md:pt-0 md:pl-12">
          <div>
            <p className="eyebrow">Rental terms</p>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>Rental period — {site.rental.duration}</li>
              <li>{site.rental.deposit}</li>
              <li>{site.rental.fitting}</li>
              <li>Cleaning and care included</li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">Direct</p>
            <a
              href={`tel:+${site.phoneRaw}`}
              className="link-underline mt-4 block text-sm text-foreground/80"
            >
              {site.phone}
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="link-underline mt-2 block text-sm text-foreground/80"
            >
              {site.instagramHandle}
            </a>
            <a
              href={site.maps}
              target="_blank"
              rel="noreferrer"
              className="link-underline mt-2 block text-sm text-foreground/80"
            >
              {site.city}
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
