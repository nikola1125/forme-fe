import { useEffect, useState } from "react";
import { DressCard } from "@/components/DressCard";
import { Reveal } from "@/components/Reveal";
import type { Dress } from "@/lib/site";

type Layout = "rail" | "masonry" | "gallery";

const STORAGE_KEY = "forme-dress-layout-2";

const options: { id: Layout; label: string }[] = [
  { id: "masonry", label: "Grid" },
  { id: "rail", label: "Rail" },
  { id: "gallery", label: "Gallery" },
];

// Each layout is a distinct *mobile* presentation of the dresses. From `sm` up
// they all collapse to the same responsive grid, so the switcher only changes
// anything on phones — desktop is untouched.
const containerClass: Record<Layout, string> = {
  // Swipeable horizontal rail, bled to the screen edges, next dress peeking in.
  rail: "flex snap-x snap-mandatory gap-4 overflow-x-auto no-scrollbar pr-6 pb-4 sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:pr-0 sm:pb-0 lg:grid-cols-3",
  // Immersive one-at-a-time gallery — larger cards, centered snap.
  gallery:
    "flex snap-x snap-mandatory gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3",
  // Clean even 2-up grid on mobile, 3-up on large screens.
  masonry: "grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-8 lg:grid-cols-3",
};

function itemClass(layout: Layout): string {
  // rail = compact filmstrip (~2 dresses in view); gallery = one immersive card;
  // grid (masonry) = aligned even columns, no per-item offset.
  if (layout === "rail") return "snap-start shrink-0 w-[46%] sm:w-auto";
  if (layout === "gallery") return "snap-center shrink-0 w-[86%] sm:w-auto";
  return "";
}

export function DressShowcase({
  dresses,
  layout: forcedLayout,
}: {
  dresses: Dress[];
  // Pin the section to one layout (no switcher). Omit for the switchable grid.
  layout?: Layout;
}) {
  const [chosen, setChosen] = useState<Layout>("masonry");

  useEffect(() => {
    if (forcedLayout) return; // pinned — ignore the saved preference
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "rail" || saved === "masonry" || saved === "gallery") {
      setChosen(saved);
    }
  }, [forcedLayout]);

  const choose = (next: Layout) => {
    setChosen(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage failures (e.g. private mode) — the choice just won't persist.
    }
  };

  const layout = forcedLayout ?? chosen;

  return (
    <div>
      {!forcedLayout ? (
        <div className="mb-8 flex items-center gap-3 sm:hidden">
          <span className="eyebrow">View</span>
          <div className="flex gap-1" role="group" aria-label="Dress layout">
            {options.map((o) => (
              <button
                key={o.id}
                type="button"
                aria-pressed={chosen === o.id}
                onClick={() => choose(o.id)}
                className={`border px-3 py-1.5 text-[10px] tracking-[0.16em] uppercase transition-colors ${
                  chosen === o.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-foreground/70 hover:border-clay hover:text-primary"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className={containerClass[layout]}>
        {dresses.map((dress, i) => (
          <div key={dress.slug} className={itemClass(layout)}>
            <Reveal delay={layout === "masonry" ? (i % 2) * 90 : 0}>
              <DressCard dress={dress} />
            </Reveal>
          </div>
        ))}
      </div>
    </div>
  );
}
