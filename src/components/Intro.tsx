import { useCallback, useEffect, useRef, useState } from "react";
import d1 from "@/assets/dress-1.jpg";
import d2 from "@/assets/dress-2.jpg";
import d4 from "@/assets/dress-4.jpg";
import d6 from "@/assets/dress-6.jpg";
import dTop from "@/assets/intro-top.jpg";
import dBottom from "@/assets/intro-bottom.jpg";

const KEY = "forme-intro-seen";
const T = { collage: 1900, close: 5300 };

type Phase = "hidden" | "loading" | "title" | "look" | "collage" | "close" | "lifting" | "done";

export function Intro() {
  // Start on the cover ("loading") so the dark overlay is present from the first
  // server-rendered paint — otherwise the page's hero ("Defined by form") flashes
  // underneath before the client-side intro mounts. useEffect then either plays
  // the intro or dismisses the cover (reduced motion / already seen).
  const [phase, setPhase] = useState<Phase>("loading");
  const [mobile, setMobile] = useState(false);
  const finished = useRef(false);
  const timers = useRef<number[]>([]);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setPhase("lifting");
    window.setTimeout(() => {
      setPhase("done");
      document.documentElement.style.overflow = "";
    }, 760);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const replay = new URLSearchParams(window.location.search).has("intro");
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      (sessionStorage.getItem(KEY) && !replay)
    ) {
      sessionStorage.setItem(KEY, "1");
      setPhase("done");
      return;
    }
    sessionStorage.setItem(KEY, "1");
    document.documentElement.style.overflow = "hidden";
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    setMobile(isMobile);
    setPhase("loading");

    let cancelled = false;
    const begin = () => {
      if (cancelled) return;
      if (isMobile) {
        setPhase("look");
        timers.current = [window.setTimeout(finish, 5300)];
      } else {
        setPhase("title");
        timers.current = [
          window.setTimeout(() => setPhase("collage"), T.collage),
          window.setTimeout(() => setPhase("close"), T.close),
          window.setTimeout(finish, 6900),
        ];
      }
    };

    // Hold on the dark background until the display serif is ready, so the
    // wordmark and closing line never flash the fallback font and re-shape
    // mid-animation. Capped so a slow/blocked font can't stall the intro.
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
    void Promise.race([fontReady, cap]).then(begin);

    return () => {
      cancelled = true;
      timers.current.forEach((timer) => window.clearTimeout(timer));
      document.documentElement.style.overflow = "";
    };
  }, [finish]);

  if (phase === "hidden" || phase === "done") return null;

  const closing = phase === "close" || phase === "lifting";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-100 overflow-hidden bg-[#1a1410] text-panna"
      onClick={finish}
      style={
        phase === "lifting"
          ? { animation: "veil-lift 0.76s cubic-bezier(0.76,0,0.24,1) forwards" }
          : {}
      }
    >
      {phase === "loading" ? null : mobile ? (
        <MobileReveal />
      ) : (
        <>
          <Frame />
          {phase === "collage" || phase === "close" || phase === "lifting" ? <Collage /> : null}
          <div
            className={`pointer-events-none absolute inset-0 z-10 bg-black/20 backdrop-blur-[6px] transition-opacity duration-[900ms] ${
              closing ? "opacity-100" : "opacity-0"
            }`}
          />
          <Wordmark phase={phase} />
        </>
      )}
      <Texture />
      <button
        type="button"
        onClick={finish}
        className="absolute right-5 bottom-5 z-10 text-[10px] tracking-[0.28em] text-panna/55 uppercase transition-colors hover:text-panna sm:right-7 sm:bottom-7"
      >
        Skip intro
      </button>
    </div>
  );
}

function Frame() {
  return (
    <div style={{ animation: "fade-in 1.2s ease 0.15s both" }}>
      <div className="absolute top-8 left-8 h-3 w-px bg-panna/70 sm:top-12 sm:left-12" />
      <div className="absolute top-8 right-8 h-3 w-px bg-panna/70 sm:top-12 sm:right-12" />
      <div className="absolute bottom-8 left-8 h-3 w-px bg-panna/70 sm:bottom-12 sm:left-12" />
      <div className="absolute right-8 bottom-8 h-3 w-px bg-panna/70 sm:right-12 sm:bottom-12" />
      <p className="absolute top-7 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.32em] text-panna/45 uppercase sm:top-11">
        Formë · Tiranë
      </p>
    </div>
  );
}

// Film grain + vignette — a subtle cinematic overlay across every scene.
function Texture() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(120% 120% at 50% 42%, transparent 52%, rgba(0,0,0,0.5) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}

// Persistent wordmark: centered while the columns slide in behind it, then it
// travels to the left as "your perfect dress" fades in beside it.
function Wordmark({ phase }: { phase: Phase }) {
  const closing = phase === "close" || phase === "lifting";
  return (
    <div className="pointer-events-none absolute inset-0 z-20" style={{ animation: "fade-in 1s ease both" }}>
      <div
        className={`absolute top-1/2 -translate-y-1/2 transition-[left,transform] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          closing ? "left-[7vw]" : "left-1/2 -translate-x-1/2"
        }`}
      >
        <div className="relative">
          {/* soft backdrop so the wordmark reads over the images */}
          <div
            className="pointer-events-none absolute -inset-x-3/4 -inset-y-full -z-10"
            style={{ background: "radial-gradient(closest-side, rgba(20,15,12,0.62), transparent)" }}
          />
          <p
            className={`absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] tracking-[0.34em] text-panna/55 uppercase transition-opacity duration-500 ${
              closing ? "opacity-0" : "opacity-100"
            }`}
          >
            Dress rental studio
          </p>
          <h1
            className="font-display text-[clamp(4.5rem,13vw,9rem)] leading-none tracking-[0.08em] text-panna"
            style={{ animation: "intro-wordmark 1.1s cubic-bezier(0.22,1,0.36,1) 0.1s both" }}
          >
            FORMË
          </h1>
          <div
            className={`mx-auto mt-7 h-px w-24 bg-panna/50 transition-opacity duration-500 ${
              closing ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute top-1/2 left-full ml-6 -translate-y-1/2 whitespace-nowrap font-display text-[clamp(1.4rem,3.4vw,2.6rem)] leading-none tracking-tight text-accent transition-[opacity,transform] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              closing ? "opacity-100" : "translate-x-16 opacity-0"
            }`}
          >
            your perfect dress
          </span>
        </div>
      </div>
    </div>
  );
}

function Collage() {
  return (
    <div className="absolute inset-0 flex">
      <CollageColumn src={d2} animation="intro-slide-in-top" delay="0.15s" />
      <CollageColumn src={d6} animation="intro-slide-in-bottom" delay="0.45s" />
      <CollageColumn src={d4} animation="intro-slide-in-top" delay="0.75s" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />
      <p
        className="absolute bottom-[8%] left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-panna uppercase"
        style={{ animation: "fade-in 0.8s ease 1s both" }}
      >
        Modern · retro · bohemian
      </p>
    </div>
  );
}

// Full-height column that slides in vertically (top→bottom or bottom→top).
function CollageColumn({
  src,
  animation,
  delay,
}: {
  src: string;
  animation: string;
  delay: string;
}) {
  return (
    <div className="relative h-full flex-1 overflow-hidden">
      <div
        className="h-full w-full overflow-hidden opacity-0"
        style={{ animation: `${animation} 1.8s cubic-bezier(0.22,1,0.36,1) ${delay} both` }}
      >
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          style={{ animation: `intro-kenburns 9s ease-out ${delay} both` }}
        />
      </div>
    </div>
  );
}

// Mobile-only intro: three full-height images stack in a column and slide in
// (left, then right, then left) with a slow Ken-Burns drift, then the closing
// line blends in over them.
function MobileReveal() {
  return (
    <div className="flex h-full flex-col">
      <MobileBand src={dTop} animation="intro-slide-in-left" delay="0.25s" />
      <MobileBand
        src={d1}
        animation="intro-slide-in-right"
        delay="0.9s"
        fit="contain"
        flex="flex-[1.4]"
      />
      <MobileBand src={dBottom} animation="intro-slide-in-left" delay="1.55s" />

      <div
        className="absolute inset-0 flex items-center justify-center px-8 text-center opacity-0"
        style={{ animation: "fade-in 1.5s ease 2.7s both" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(85% 65% at 50% 50%, rgba(26,20,16,0.76) 0%, rgba(26,20,16,0.26) 100%)",
          }}
        />
        <h2
          className="relative font-display text-4xl leading-tight text-panna"
          style={{ animation: "intro-text-blend 1.8s cubic-bezier(0.22,1,0.36,1) 2.85s both" }}
        >
          Formë your <span className="text-accent">perfect dress</span>
        </h2>
      </div>
    </div>
  );
}

function MobileBand({
  src,
  animation,
  delay,
  fit = "cover",
  flex = "flex-1",
}: {
  src: string;
  animation: string;
  delay: string;
  fit?: "cover" | "contain";
  flex?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${flex}`}>
      <div
        className="h-full w-full overflow-hidden opacity-0"
        style={{ animation: `${animation} 1.1s cubic-bezier(0.22,1,0.36,1) ${delay} both` }}
      >
        <img
          src={src}
          alt=""
          className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
          style={{ animation: `intro-kenburns 7s ease-out ${delay} both` }}
        />
      </div>
    </div>
  );
}
