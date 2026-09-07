import { Link } from "@tanstack/react-router";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-3xl text-primary" style={{ letterSpacing: "0.2em" }}>
              FORMË
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A distinctive dress collection for rent — {site.city}.
            </p>
          </div>

          <div className="grid gap-8 text-sm sm:grid-cols-2">
            <div className="space-y-2">
              <p className="eyebrow">Visit</p>
              <a
                href={site.maps}
                target="_blank"
                rel="noreferrer"
                className="link-underline block text-foreground/80"
              >
                {site.city}
              </a>
              <p className="text-muted-foreground">By appointment</p>
            </div>
            <div className="space-y-2">
              <p className="eyebrow">Contact</p>
              <a href={`tel:+${site.phoneRaw}`} className="link-underline block text-foreground/80">
                {site.phone}
              </a>
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                className="link-underline block text-foreground/80"
              >
                {site.instagramHandle}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-6 text-xs tracking-widest text-muted-foreground uppercase sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Formë Studio</span>
          <div className="flex gap-6">
            <Link to="/collection" className="hover:text-primary">
              Collection
            </Link>
            <Link to="/booking" className="hover:text-primary">
              Booking
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
