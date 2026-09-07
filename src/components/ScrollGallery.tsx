// src/components/ScrollGallery.tsx
//
// Scroll-driven pinned lookbook gallery.
//
// Architecture:
//   • OUTER: tall wrapper (numImages × 100vh) that creates scroll distance.
//   • INNER: `position:sticky; top:0; height:100vh` — stays pinned while the
//     outer wrapper scrolls past.
//   • Progress = (wrapperScrollTop) / (wrapperHeight - windowHeight), mapped
//     to an active image index via a step function.
//   • Images cross-fade with CSS opacity transitions.  The active image gets a
//     subtle Ken-Burns zoom via a CSS animation (restarted by changing `key`).
//   • Prefers-reduced-motion → plain stacked/grid gallery, no pinning.
//   • SSR → renders first image at full opacity; JS hydration wires the scroll
//     listener.  Images are never hidden before hydration.

import { useEffect, useRef, useState } from "react";

export interface GallerySlide {
  image: string;
  handle: string;
  note: string;
}

interface Props {
  slides: GallerySlide[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function preferReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Zero-pad a number to at least 2 digits.
function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// ---------------------------------------------------------------------------
// Reduced-motion fallback — simple elegant grid, all images visible.
// ---------------------------------------------------------------------------

function StaticGallery({ slides }: Props) {
  return (
    <div className="columns-2 gap-4 sm:columns-3 sm:gap-6">
      {slides.map((slide) => (
        <figure key={slide.handle} className="mb-4 break-inside-avoid sm:mb-6">
          <div className="overflow-hidden bg-secondary">
            <img
              src={slide.image}
              alt={`${slide.handle} wearing a Formë dress`}
              loading="lazy"
              width={1000}
              height={1250}
              className="w-full object-cover"
            />
          </div>
          <figcaption className="mt-3 flex flex-col gap-0.5 text-xs text-muted-foreground">
            <span className="tracking-[0.18em] uppercase">{slide.handle}</span>
            <span>{slide.note}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pinned scroll-driven gallery (full experience)
// ---------------------------------------------------------------------------

function PinnedGallery({ slides }: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  // Start at 0 so SSR renders the first image fully visible.
  const [activeIdx, setActiveIdx] = useState(0);
  const rafRef = useRef<number | null>(null);

  const total = slides.length;

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    function update() {
      if (!outer) return;
      const rect = outer.getBoundingClientRect();
      // Distance scrolled within the outer wrapper (how far the top edge is
      // above the viewport top).
      const scrolled = -rect.top;
      // Total scrollable range = outerHeight − windowHeight (the sticky inner
      // keeps the last viewport worth of outer height in view).
      const range = rect.height - window.innerHeight;

      if (range <= 0) return;

      const progress = Math.min(1, Math.max(0, scrolled / range));
      // Map [0,1] → [0, total-1] with a step function so each slide gets an
      // equal share of the scroll range.
      const raw = progress * total;
      const idx = Math.min(total - 1, Math.floor(raw));

      setActiveIdx(idx);
    }

    function onScroll() {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        update();
      });
    }

    // Run once on mount in case the section is already partially scrolled.
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [total]);

  const slide = slides[activeIdx]!;

  return (
    // Outer: tall enough to give each slide 100 vh of scroll travel.
    // The last slide gets an extra 50 vh so it lingers before unpinning.
    <div
      ref={outerRef}
      style={{ height: `${total * 100 + 50}vh` }}
      aria-label="Scrollable lookbook gallery"
    >
      {/* Inner: pinned viewport-height container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Images — stacked, cross-fade via opacity */}
        {slides.map((s, i) => {
          const isActive = i === activeIdx;
          return (
            <div
              key={s.handle}
              aria-hidden={!isActive}
              className="absolute inset-0 transition-opacity duration-[900ms] ease-in-out"
              style={{ opacity: isActive ? 1 : 0 }}
            >
              {/* Image with Ken-Burns zoom — keying on activeIdx restarts the
                  animation every time this slide becomes active */}
              <img
                key={isActive ? `active-${i}` : `idle-${i}`}
                src={s.image}
                alt={`${s.handle} wearing a Formë dress`}
                loading={i === 0 ? "eager" : "lazy"}
                width={1600}
                height={2000}
                className={[
                  "absolute inset-0 h-full w-full object-cover object-center",
                  isActive ? "animate-gallery-zoom" : "",
                ].join(" ")}
              />
            </div>
          );
        })}

        {/* Gradient overlays — bottom reads caption, left edge for depth */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/20 to-transparent" />

        {/* Caption + handle — animates on slide change */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 md:px-14 md:pb-14">
          <div
            key={`caption-${activeIdx}`}
            className="animate-gallery-caption"
          >
            <p
              className="eyebrow mb-2 text-white/70"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              {slide.handle}
            </p>
            <p
              className="font-display text-2xl italic leading-tight text-white md:text-4xl"
              style={{ textShadow: "0 2px 24px rgba(0,0,0,0.35)" }}
            >
              {slide.note}
            </p>
          </div>
        </div>

        {/* Progress dots — desktop right edge, vertical */}
        <div
          className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 md:flex"
          role="tablist"
          aria-label="Gallery slides"
        >
          {slides.map((s, i) => (
            <button
              key={s.handle}
              role="tab"
              aria-selected={i === activeIdx}
              aria-label={`Slide ${i + 1}: ${s.handle}`}
              title={s.handle}
              // Dots are decorative navigation aids — clicking scrolls to the
              // right position in the outer wrapper.
              onClick={() => {
                const outer = outerRef.current;
                if (!outer) return;
                const outerTop = outer.getBoundingClientRect().top + window.scrollY;
                const range = outer.offsetHeight - window.innerHeight;
                const targetProgress = i / Math.max(1, total - 1);
                window.scrollTo({
                  top: outerTop + targetProgress * range,
                  behavior: "smooth",
                });
              }}
              className={[
                "h-px w-5 transition-all duration-500 ease-in-out",
                i === activeIdx ? "w-10 bg-white" : "bg-white/35 hover:bg-white/55",
              ].join(" ")}
            />
          ))}
        </div>

        {/* Index counter — mobile bottom right */}
        <div
          className="absolute bottom-10 right-6 flex items-baseline gap-1 font-sans text-[10px] tracking-[0.22em] text-white/60 uppercase md:hidden"
          aria-live="polite"
          aria-label={`Image ${activeIdx + 1} of ${total}`}
        >
          <span className="text-white">{pad(activeIdx + 1)}</span>
          <span>/</span>
          <span>{pad(total)}</span>
        </div>

        {/* Scroll hint — fades out after first slide */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 md:flex"
          style={{
            display: "flex",
            opacity: activeIdx === 0 ? 1 : 0,
            transition: "opacity 0.8s ease",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          <span
            className="font-sans text-[9px] tracking-[0.28em] text-white/50 uppercase"
            style={{ writingMode: "vertical-rl" }}
          >
            Scroll
          </span>
          <span className="animate-bounce text-white/40 text-xs">↓</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public component — detects reduced-motion on client, picks the right variant.
// ---------------------------------------------------------------------------

export function ScrollGallery({ slides }: Props) {
  // On SSR: reducedMotion = false → renders PinnedGallery (first image visible,
  // no scroll listener yet).  After hydration, the useEffect below corrects if
  // needed.
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setReducedMotion(preferReducedMotion());
    setHydrated(true);
  }, []);

  // Reduced-motion: plain stacked gallery.
  if (hydrated && reducedMotion) {
    return <StaticGallery slides={slides} />;
  }

  // Default: scroll-driven pinned gallery.
  return <PinnedGallery slides={slides} />;
}
