import { useCallback, useEffect, useRef, useState } from "react";
import { createTimeline, stagger, cubicBezier } from "animejs";
import type { Timeline } from "animejs";
import d1 from "@/assets/dress-1.jpg";
import d2 from "@/assets/dress-2.jpg";
import d4 from "@/assets/dress-4.jpg";
import d6 from "@/assets/dress-6.jpg";
import dTop from "@/assets/intro-top.jpg";
import dBottom from "@/assets/intro-bottom.jpg";

// ---------------------------------------------------------------------------
// Formë intro — choreographed with anime.js (v4).
//
// The whole sequence is ONE anime.js timeline per layout (desktop / mobile),
// so the pacing lives in a single place: durations + absolute time positions.
// Want it slower? Scale the numbers. React only owns three phases:
//   "loading"  — dark cover painted from the first (server) frame so the page
//                hero never flashes underneath before the intro mounts.
//   "play"     — full DOM mounted (elements start hidden via inline styles);
//                an effect builds + plays the timeline.
//   "done"     — overlay unmounts.
// ---------------------------------------------------------------------------

const KEY = "forme-intro-seen";

// Signature easings — kept identical to the old CSS so the feel is unchanged.
const EASE = cubicBezier(0.22, 1, 0.36, 1);
const LIFT_EASE = cubicBezier(0.76, 0, 0.24, 1);

type Phase = "loading" | "play" | "done";

export function Intro() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [mobile, setMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  // Desktop refs
  const frameRef = useRef<HTMLDivElement>(null);
  const colRefs = useRef<Array<HTMLDivElement | null>>([]);
  const imgRefs = useRef<Array<HTMLImageElement | null>>([]);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const tailRef = useRef<HTMLSpanElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  // Mobile refs
  const bandRefs = useRef<Array<HTMLDivElement | null>>([]);
  const bandImgRefs = useRef<Array<HTMLImageElement | null>>([]);
  const mTextRef = useRef<HTMLDivElement>(null);
  const mHeadingRef = useRef<HTMLHeadingElement>(null);

  const tlRef = useRef<Timeline | null>(null);
  const finished = useRef(false);

  // Tear the overlay down (also the timeline's onComplete).
  const dismiss = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    document.documentElement.style.overflow = "";
    setPhase("done");
  }, []);

  // User skipped — stop the timeline and lift immediately.
  const skip = useCallback(() => {
    if (finished.current) return;
    tlRef.current?.pause();
    const el = containerRef.current;
    if (el) {
      createTimeline({ defaults: { ease: LIFT_EASE }, onComplete: dismiss }).add(el, {
        translateY: [0, "-101%"],
        duration: 520,
      });
    } else {
      dismiss();
    }
  }, [dismiss]);

  // Phase 1 — decide whether to play at all, gate on fonts, then mount the DOM.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const replay = new URLSearchParams(window.location.search).has("intro");
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      (sessionStorage.getItem(KEY) && !replay)
    ) {
      sessionStorage.setItem(KEY, "1");
      finished.current = true;
      setPhase("done");
      return;
    }
    sessionStorage.setItem(KEY, "1");
    document.documentElement.style.overflow = "hidden";
    setMobile(window.matchMedia("(max-width: 767px)").matches);

    let cancelled = false;
    // Hold on the dark cover until the display serif is ready, so the wordmark
    // never flashes the fallback font and re-shapes mid-animation. Capped so a
    // slow/blocked font can't stall the intro.
    const fontReady =
      "fonts" in document
        ? Promise.all([
            document.fonts.load('400 1rem "Crowk"'),
            document.fonts.load('italic 400 1rem "Crowk"'),
          ]).then(
            () => undefined,
            () => undefined,
          )
        : Promise.resolve();
    const cap = new Promise<void>((resolve) => window.setTimeout(resolve, 1000));
    void Promise.race([fontReady, cap]).then(() => {
      if (!cancelled) setPhase("play");
    });

    return () => {
      cancelled = true;
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Phase 2 — DOM is mounted and hidden; build + play the anime.js timeline.
  useEffect(() => {
    if (phase !== "play") return;

    const tl = createTimeline({
      defaults: { ease: EASE },
      onComplete: dismiss,
    });

    if (mobile) {
      // Three full-bleed bands slide in (left, right, left) with a slow drift,
      // then the line blends up over them.
      const bands = bandRefs.current.filter(Boolean) as HTMLDivElement[];
      const bandImgs = bandImgRefs.current.filter(Boolean) as HTMLImageElement[];

      tl.add(bands[0]!, { translateX: ["-101%", "0%"], opacity: [0, 1], duration: 1150 }, 0)
        .add(bands[1]!, { translateX: ["101%", "0%"], opacity: [0, 1], duration: 1150 }, 620)
        .add(bands[2]!, { translateX: ["-101%", "0%"], opacity: [0, 1], duration: 1150 }, 1240)
        .add(
          bandImgs,
          { scale: [1.06, 1], duration: 7000, ease: "out(2)", delay: stagger(620) },
          0,
        )
        .add(mTextRef.current!, { opacity: [0, 1], duration: 1400 }, 2550)
        .add(
          mHeadingRef.current!,
          {
            opacity: [0, 1],
            translateY: ["0.5em", "0em"],
            letterSpacing: ["0.34em", "0.06em"],
            duration: 1700,
          },
          2650,
        )
        .add(containerRef.current!, {
          translateY: [0, "-101%"],
          duration: 720,
          ease: LIFT_EASE,
        }, 5600);
    } else {
      const cols = colRefs.current.filter(Boolean) as HTMLDivElement[];
      const imgs = imgRefs.current.filter(Boolean) as HTMLImageElement[];
      const CLOSE = 4200; // columns settled + a held beat
      const LIFT = 6800;
      // Distance for FORMË to glide so its left edge lands near 7vw.
      const wm = wordmarkRef.current!;
      const glideX = wm.offsetWidth / 2 - window.innerWidth * 0.43;

      tl
        // Frame + wordmark arrive on the dark cover.
        .add(frameRef.current!, { opacity: [0, 1], duration: 1200, ease: "out(2)" }, 0)
        .add(wm, { opacity: [0, 1], duration: 1000, ease: "out(2)" }, 120)
        .add(
          h1Ref.current!,
          {
            translateY: ["0.22em", "0em"],
            letterSpacing: ["0.2em", "0.12em"],
            duration: 1100,
          },
          200,
        )
        // Three columns slide in vertically, staggered, behind the wordmark.
        .add(cols[0]!, { translateY: ["-101%", "0%"], opacity: [0, 1], duration: 1800 }, 900)
        .add(cols[1]!, { translateY: ["101%", "0%"], opacity: [0, 1], duration: 1800 }, 1200)
        .add(cols[2]!, { translateY: ["-101%", "0%"], opacity: [0, 1], duration: 1800 }, 1500)
        // Slow Ken-Burns on the imagery for the rest of the intro.
        .add(imgs, { scale: [1.08, 1], duration: 9000, ease: "out(1)", delay: stagger(300) }, 900)
        // Blur the imagery so the text reads, then glide FORMË to the left as
        // "your perfect dress" slides in beside it.
        .add(veilRef.current!, { opacity: [0, 1], duration: 900, ease: "out(2)" }, CLOSE)
        .add(wm, { translateX: [0, glideX], duration: 1400 }, CLOSE)
        .add([eyebrowRef.current!, ruleRef.current!], { opacity: [1, 0], duration: 500 }, CLOSE)
        .add(
          tailRef.current!,
          { translateX: [64, 0], opacity: [0, 1], duration: 1300 },
          CLOSE + 150,
        )
        // Hold the final composition, then lift the whole veil away.
        .add(containerRef.current!, { translateY: [0, "-101%"], duration: 760, ease: LIFT_EASE }, LIFT);
    }

    tlRef.current = tl;
    return () => {
      tl.pause();
      tlRef.current = null;
    };
  }, [phase, mobile, dismiss]);

  if (phase === "done") return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 z-100 overflow-hidden bg-[#1a1410] text-panna"
      onClick={skip}
    >
      {phase === "loading" ? null : mobile ? (
        // --- Mobile ---------------------------------------------------------
        <div className="flex h-full flex-col">
          {[dTop, d1, dBottom].map((src, i) => (
            <div
              key={src}
              ref={(el) => {
                bandRefs.current[i] = el;
              }}
              className={`relative overflow-hidden ${i === 1 ? "flex-[1.4]" : "flex-1"}`}
              style={{ opacity: 0, transform: i === 1 ? "translateX(101%)" : "translateX(-101%)" }}
            >
              <img
                ref={(el) => {
                  bandImgRefs.current[i] = el;
                }}
                src={src}
                alt=""
                className={`h-full w-full ${i === 1 ? "object-contain" : "object-cover"}`}
                style={{ transform: "scale(1.06)" }}
              />
            </div>
          ))}

          <div
            ref={mTextRef}
            className="absolute inset-0 flex items-center justify-center px-8 text-center"
            style={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(85% 65% at 50% 50%, rgba(26,20,16,0.76) 0%, rgba(26,20,16,0.26) 100%)",
              }}
            />
            <h2
              ref={mHeadingRef}
              className="relative font-display text-4xl leading-tight text-panna"
              style={{ opacity: 0 }}
            >
              Formë your <span className="text-accent">perfect dress</span>
            </h2>
          </div>
        </div>
      ) : (
        // --- Desktop --------------------------------------------------------
        <>
          <div ref={frameRef} style={{ opacity: 0 }}>
            <div className="absolute top-8 left-8 h-3 w-px bg-panna/70 sm:top-12 sm:left-12" />
            <div className="absolute top-8 right-8 h-3 w-px bg-panna/70 sm:top-12 sm:right-12" />
            <div className="absolute bottom-8 left-8 h-3 w-px bg-panna/70 sm:bottom-12 sm:left-12" />
            <div className="absolute right-8 bottom-8 h-3 w-px bg-panna/70 sm:right-12 sm:bottom-12" />
            <p className="absolute top-7 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.32em] text-panna/45 uppercase sm:top-11">
              Formë · Tiranë
            </p>
          </div>

          {/* Collage — three full-height columns */}
          <div className="absolute inset-0 flex">
            {[d2, d6, d4].map((src, i) => (
              <div
                key={src}
                ref={(el) => {
                  colRefs.current[i] = el;
                }}
                className="relative h-full flex-1 overflow-hidden"
                style={{ opacity: 0, transform: i === 1 ? "translateY(101%)" : "translateY(-101%)" }}
              >
                <img
                  ref={(el) => {
                    imgRefs.current[i] = el;
                  }}
                  src={src}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ transform: "scale(1.08)" }}
                />
              </div>
            ))}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />
          </div>

          {/* Blur veil — lifts the text off the imagery once it settles */}
          <div
            ref={veilRef}
            className="pointer-events-none absolute inset-0 z-10 bg-black/20 backdrop-blur-[6px]"
            style={{ opacity: 0 }}
          />

          {/* Wordmark — flex-centered, then glides left via the timeline */}
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <div ref={wordmarkRef} className="relative" style={{ opacity: 0 }}>
              <div
                className="pointer-events-none absolute -inset-x-3/4 -inset-y-full -z-10"
                style={{ background: "radial-gradient(closest-side, rgba(20,15,12,0.62), transparent)" }}
              />
              <p
                ref={eyebrowRef}
                className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] tracking-[0.34em] text-panna/55 uppercase"
              >
                Dress rental studio
              </p>
              <h1
                ref={h1Ref}
                className="font-display text-[clamp(4.5rem,13vw,9rem)] leading-none text-panna"
                style={{ letterSpacing: "0.2em" }}
              >
                FORMË
              </h1>
              <div ref={ruleRef} className="mx-auto mt-7 h-px w-24 bg-panna/50" />
              {/* wrapper handles vertical centering so the timeline animates
                  only translateX on the text itself */}
              <div className="absolute top-0 bottom-0 left-full ml-6 flex items-center">
                <span
                  ref={tailRef}
                  className="whitespace-nowrap font-display text-[clamp(1.4rem,3.4vw,2.6rem)] leading-none tracking-tight text-accent"
                  style={{ opacity: 0, transform: "translateX(64px)" }}
                >
                  your perfect dress
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      <Texture />
      <button
        type="button"
        onClick={skip}
        className="absolute right-5 bottom-5 z-30 text-[10px] tracking-[0.28em] text-panna/55 uppercase transition-colors hover:text-panna sm:right-7 sm:bottom-7"
      >
        Skip intro
      </button>
    </div>
  );
}

// Film grain + vignette — a subtle cinematic overlay across the scene.
function Texture() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: "radial-gradient(120% 120% at 50% 42%, transparent 52%, rgba(0,0,0,0.5) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.06] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}
