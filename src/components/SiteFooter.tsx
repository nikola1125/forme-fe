import { Link } from "@tanstack/react-router";
import { site } from "@/lib/site";

const linkClass = "text-muted-foreground transition-colors hover:text-foreground";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <p className="font-display text-2xl text-foreground" style={{ letterSpacing: "0.2em" }}>
              FORMË
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A distinctive dress collection for rent — {site.city}.
            </p>
          </div>

          <div>
            <p className="eyebrow">Explore</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/collection" className={linkClass}>
                  Collection
                </Link>
              </li>
              <li>
                <Link to="/as-seen-on" className={linkClass}>
                  As Seen On
                </Link>
              </li>
              <li>
                <Link to="/about" className={linkClass}>
                  Studio
                </Link>
              </li>
              <li>
                <Link to="/booking" className={linkClass}>
                  Booking
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow">Visit</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href={site.maps} target="_blank" rel="noreferrer" className={linkClass}>
                  {site.city}
                </a>
              </li>
              <li className="text-muted-foreground">By appointment</li>
            </ul>
          </div>

          <div>
            <p className="eyebrow">Contact</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href={`tel:+${site.phoneRaw}`} className={linkClass}>
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={site.instagram} target="_blank" rel="noreferrer" className={linkClass}>
                  {site.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Formë Studio</span>
          <span>Defined by form</span>
        </div>
      </div>
    </footer>
  );
}
