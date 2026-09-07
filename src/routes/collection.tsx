import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DressShowcase } from "@/components/DressShowcase";
import { dresses, moods } from "@/lib/dresses";
import { site } from "@/lib/site";

export const Route = createFileRoute("/collection")({
  head: () => ({
    meta: [
      { title: "The Collection — Formë Dress Rental, Tiranë" },
      {
        name: "description",
        content:
          "Browse the Formë rental collection: silk slips, retro midis and bohemian lace, with prices, sizes and rental terms for each dress.",
      },
      { property: "og:title", content: "The Collection — Formë Dress Rental" },
      {
        property: "og:description",
        content: "Silk slips, retro midis and bohemian lace, available for rent in Tiranë.",
      },
    ],
  }),
  component: Collection,
});

function Collection() {
  const [mood, setMood] = useState<(typeof moods)[number]>("All");
  const shown = mood === "All" ? dresses : dresses.filter((d) => d.mood === mood);

  return (
    <>
      <header className="mx-auto max-w-7xl px-6 pt-28 pb-10 md:px-10 md:pt-52 md:pb-16">
        <p className="eyebrow animate-fade-in">The collection</p>
        <h1 className="animate-rise mt-6 max-w-2xl font-display text-4xl leading-tight text-primary md:text-7xl">
          Every piece, <span className="italic">one of a kind</span>
        </h1>
        <p className="animate-rise mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
          Rental period {site.rental.duration}. {site.rental.deposit}.{" "}
          {site.rental.fitting}.
        </p>

        <div className="mt-10 flex flex-wrap gap-3 md:mt-12">
          {moods.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMood(m)}
              className={`border px-5 py-2 text-[10px] tracking-[0.22em] uppercase transition-colors ${
                mood === m
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground/70 hover:border-clay hover:text-primary"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10 md:pb-36">
        <DressShowcase dresses={shown} />
      </section>
    </>
  );
}
