import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const nav = [
  { to: "/collection", label: "Collection" },
  { to: "/as-seen-on", label: "As Seen On" },
  { to: "/about", label: "Studio" },
  { to: "/booking", label: "Booking" },
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
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-700 ${
        solid ? "bg-panna/85 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <Link
          to="/"
          className="font-display text-xl text-primary"
          style={{ letterSpacing: "0.24em" }}
          onClick={() => setOpen(false)}
        >
          FORMË
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="link-underline text-xs tracking-[0.2em] text-foreground/80 uppercase transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="link-underline text-xs tracking-[0.2em] text-foreground/80 uppercase hover:text-primary"
          >
            Instagram
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-8 w-8 flex-col items-end justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-px w-6 bg-primary transition-transform duration-500 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-px bg-primary transition-all duration-500 ${open ? "w-6 -translate-y-[3.5px] -rotate-45" : "w-4"}`}
          />
        </button>
      </div>

      <div
        className={`overflow-hidden border-border bg-panna/95 backdrop-blur-md transition-[max-height] duration-700 md:hidden ${
          open ? "max-h-96 border-b" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-5 px-6 py-8">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="font-display text-2xl text-primary"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="eyebrow pt-2"
          >
            {site.instagramHandle}
          </a>
        </nav>
      </div>
    </header>
  );
}
