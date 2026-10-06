import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const nav = [
  { to: "/collection", label: "Collection" },
  { to: "/as-seen-on", label: "As Seen On" },
  { to: "/about", label: "Studio" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full border-b transition-colors duration-500 ${
        solid ? "border-border bg-background/80 backdrop-blur-xl" : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link
          to="/"
          className="font-display text-lg text-foreground"
          style={{ letterSpacing: "0.3em" }}
          onClick={() => setOpen(false)}
        >
          FORMË
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            Instagram
          </a>
          <Link
            to="/booking"
            className="bg-primary px-5 py-2.5 font-mono text-[10px] tracking-[0.2em] text-primary-foreground uppercase transition-colors hover:bg-accent"
          >
            Book
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-8 w-8 flex-col items-end justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-px w-6 bg-foreground transition-transform duration-500 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-px bg-foreground transition-all duration-500 ${open ? "w-6 -translate-y-[3.5px] -rotate-45" : "w-4"}`}
          />
        </button>
      </div>

      <div
        className={`overflow-hidden border-border bg-background/95 backdrop-blur-xl transition-[max-height] duration-700 md:hidden ${
          open ? "max-h-96 border-b" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-5 px-6 py-8">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="font-display text-2xl text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/booking"
            onClick={() => setOpen(false)}
            className="font-display text-2xl text-accent"
          >
            Booking
          </Link>
          <a href={site.instagram} target="_blank" rel="noreferrer" className="eyebrow pt-2">
            {site.instagramHandle}
          </a>
        </nav>
      </div>
    </header>
  );
}
