import { useCallback, useEffect, useRef, useState } from "react";
import d1 from "@/assets/dress-1.jpg";
import d2 from "@/assets/dress-2.jpg";
import d4 from "@/assets/dress-4.jpg";
import d6 from "@/assets/dress-6.jpg";

const KEY = "forme-intro-seen";

// Scene timeline (ms from start) — tweak these to retime the sequence.
const T = { s2: 1100, s3: 2300, s4: 3500, lift: 4700 };

type Phase = "hidden" | "s1" | "s2" | "s3" | "s4" | "lifting" | "done";

const BG = "#1a1410"; // warm espresso

export function Intro() {
  const [phase, setPhase] = useState<Phase>("hidden");
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setPhase("lifting");
    window.setTimeout(() => {
      setPhase("done");
      document.documentElement.style.overflow = "";
    }, 700);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || sessionStorage.getItem(KEY)) {
      sessionStorage.setItem(KEY, "1");
      setPhase("done");
      return;
    }
    sessionStorage.setItem(KEY, "1");
    document.documentElement.style.overflow = "hidden";
    setPhase("s1");
    const timers = [
      window.setTimeout(() => setPhase("s2"), T.s2),
      window.setTimeout(() => setPhase("s3"), T.s3),
      window.setTimeout(() => setPhase("s4"), T.s4),
      window.setTimeout(finish, T.lift),
    ];
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      document.documentElement.style.overflow = "";
    };
  }, [finish]);

  if (phase === "hidden" || phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      onClick={finish}
      className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: BG,
        ...(phase === "lifting"
          ? { animation: "veil-lift 0.7s cubic-bezier(0.76,0,0.24,1) forwards" }
          : {}),
      }}
    >
      {phase === "s1" ? <SceneTitle /> : null}
      {phase === "s2" ? <SceneFramed img={d1} /> : null}
      {phase === "s3" ? <SceneCollage left={d2} center={d6} right={d4} /> : null}
      {phase === "s4" || phase === "lifting" ? <SceneOutro /> : null}

      <button
        type="button"
        onClick={finish}
        className="absolute right-6 bottom-6 z-10 text-[11px] tracking-[0.24em] text-white/55 uppercase transition-colors hover:text-white"
      >
        Skip
      </button>
    </div>
  );
}

function SceneTitle() {
  return (
    <div className="relative px-6 text-center">
      <p
        className="text-[11px] tracking-[0.34em] text-panna/50 uppercase"
        style={{ animation: "fade-in 0.7s ease both" }}
      >
        Dress rental studio · Tiranë
      </p>
      <h1
        className="mt-5 font-display text-6xl text-panna sm:text-8xl"
        style={{ letterSpacing: "0.16em", animation: "rise 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s both" }}
      >
        FORMË
      </h1>
    </div>
  );
}

function SceneFramed({ img }: { img: string }) {
  return (
    <div className="relative flex flex-col items-center px-6">
      <div
        className="aspect-[3/4] w-[62vw] max-w-[300px] overflow-hidden bg-black/30"
        style={{ animation: "intro-panel 0.9s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        <img
          src={img}
          alt=""
          className="h-full w-full object-cover"
          style={{ animation: "slow-zoom 2.6s cubic-bezier(0.22,1,0.36,1) both" }}
        />
      </div>
      <p
        className="mt-6 text-[10px] tracking-[0.34em] text-panna/70 uppercase"
        style={{ animation: "fade-in 0.8s ease 0.45s both" }}
      >
        Modern · Retro · Bohemian
      </p>
    </div>
  );
}

function SceneCollage({ left, center, right }: { left: string; center: string; right: string }) {
  return (
    <div className="relative flex h-[74vh] max-h-[560px] w-[80vw] max-w-[320px] flex-col items-stretch gap-2 sm:h-[62vh] sm:w-full sm:max-w-[860px] sm:flex-row sm:px-4">
      <div
        className="relative flex-1 overflow-hidden"
        style={{ animation: "intro-reveal-l 0.7s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        <img src={left} alt="" className="h-full w-full object-cover" />
      </div>
      <div
        className="relative flex-1 overflow-hidden sm:flex-[1.35]"
        style={{ animation: "intro-panel 0.75s cubic-bezier(0.22,1,0.36,1) 0.12s both" }}
      >
        <img src={center} alt="" className="h-full w-full object-cover" />
      </div>
      <div
        className="relative flex-1 overflow-hidden"
        style={{ animation: "intro-reveal-r 0.7s cubic-bezier(0.22,1,0.36,1) 0.24s both" }}
      >
        <img src={right} alt="" className="h-full w-full object-cover" />
      </div>
    </div>
  );
}

function SceneOutro() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ animation: "fade-in 0.8s ease both" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 32% 30%, #e0c199 0%, #c98f63 34%, #6b4c34 72%, #241a13 100%)",
        }}
      />
      <h2
        className="relative px-6 text-center font-display text-4xl text-panna sm:text-6xl"
        style={{ letterSpacing: "0.04em", animation: "rise 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s both" }}
      >
        Defined <span className="italic">by form</span>
      </h2>
    </div>
  );
}
