import { Link } from "@tanstack/react-router";
import type { Dress } from "@/lib/site";

export function DressCard({ dress }: { dress: Dress }) {
  return (
    <article className="group">
      <Link
        to="/dress/$slug"
        params={{ slug: dress.slug }}
        aria-label={`View ${dress.name}`}
        className="relative block overflow-hidden bg-secondary"
      >
        <img
          src={dress.image}
          alt={`${dress.name} — ${dress.note}`}
          loading="lazy"
          width={1008}
          height={1408}
          className="aspect-[3/4] w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
        {dress.exclusive ? (
          <span className="absolute top-3 left-3 bg-foreground px-2.5 py-1 font-mono text-[10px] tracking-[0.22em] text-background uppercase sm:top-4 sm:left-4 sm:px-3 sm:tracking-[0.24em]">
            Exclusive
          </span>
        ) : null}
      </Link>

      <div className="mt-4 flex flex-col gap-0.5 sm:mt-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h3 className="font-display text-lg text-primary sm:text-2xl">
          <Link to="/dress/$slug" params={{ slug: dress.slug }} className="transition-colors hover:text-accent">
            {dress.name}
          </Link>
        </h3>
        <span className="text-xs text-muted-foreground sm:text-sm">{dress.price}</span>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:mt-2 sm:text-sm">
        {dress.note}
      </p>
      <div className="mt-3 flex items-center justify-between gap-2 sm:mt-4">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {dress.sizes.map((s) => (
            <span
              key={s}
              className="border border-border px-1.5 py-0.5 text-[10px] tracking-[0.16em] text-foreground/70 uppercase sm:px-2"
            >
              {s}
            </span>
          ))}
        </div>
        <span className="eyebrow shrink-0">{dress.mood}</span>
      </div>
      <Link
        to="/booking"
        search={{ dress: dress.name }}
        className="link-underline mt-4 inline-block text-[11px] tracking-[0.22em] text-primary uppercase sm:mt-5 sm:text-xs"
      >
        Reserve
      </Link>
    </article>
  );
}
