import { useState } from "react";
import { z } from "zod";
import { dresses } from "@/lib/dresses";
import { site } from "@/lib/site";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z.string().trim().min(6, "Please enter a phone number").max(30),
  dress: z.string().trim().max(60),
  date: z.string().trim().min(1, "Please choose a date").max(20),
  size: z.string().trim().max(10),
  message: z.string().trim().max(500),
});

const inputClass =
  "w-full border-b border-border bg-transparent pb-2 text-sm text-foreground transition-colors [color-scheme:light] placeholder:text-muted-foreground/70 focus:border-clay";

export function BookingForm({ initialDress = "" }: { initialDress?: string }) {
  const [values, setValues] = useState({
    name: "",
    phone: "",
    dress: initialDress,
    date: "",
    size: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const set = (key: keyof typeof values) => (v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    const d = parsed.data;
    const text = [
      `Reservation request — Formë`,
      `Name: ${d.name}`,
      `Phone: ${d.phone}`,
      `Dress: ${d.dress || "Not decided"}`,
      `Size: ${d.size || "—"}`,
      `Date needed: ${d.date}`,
      d.message ? `Note: ${d.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setSent(true);
  };

  return (
    <form onSubmit={submit} className="space-y-10" noValidate>
      <div className="grid gap-10 sm:grid-cols-2">
        <Field label="Full name" error={errors["name"]}>
          <input
            className={inputClass}
            value={values.name}
            onChange={(e) => set("name")(e.target.value)}
            placeholder="Your name"
            maxLength={80}
          />
        </Field>
        <Field label="Phone / WhatsApp" error={errors["phone"]}>
          <input
            className={inputClass}
            value={values.phone}
            onChange={(e) => set("phone")(e.target.value)}
            placeholder="+355 ..."
            maxLength={30}
          />
        </Field>
        <Field label="Dress" error={errors["dress"]}>
          <div className="relative">
            <select
              className={`${inputClass} appearance-none pr-6`}
              value={values.dress}
              onChange={(e) => set("dress")(e.target.value)}
            >
              <option value="">Not decided yet</option>
              {dresses.map((d) => (
                <option key={d.slug} value={d.name}>
                  {d.name} — {d.price}
                </option>
              ))}
            </select>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-0 bottom-2 text-xs text-muted-foreground"
            >
              ▾
            </span>
          </div>
        </Field>
        <Field label="Size" error={errors["size"]}>
          <div className="relative">
            <select
              className={`${inputClass} appearance-none pr-6`}
              value={values.size}
              onChange={(e) => set("size")(e.target.value)}
            >
              <option value="">Select</option>
              {["XS", "S", "M", "L"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-0 bottom-2 text-xs text-muted-foreground"
            >
              ▾
            </span>
          </div>
        </Field>
        <Field label="Date needed" error={errors["date"]}>
          <input
            type="date"
            className={inputClass}
            value={values.date}
            onChange={(e) => set("date")(e.target.value)}
          />
        </Field>
        <Field label="Occasion (optional)" error={errors["message"]}>
          <input
            className={inputClass}
            value={values.message}
            onChange={(e) => set("message")(e.target.value)}
            placeholder="Wedding, shoot, gala…"
            maxLength={500}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="group inline-flex items-center gap-3 bg-primary px-8 py-4 text-[11px] tracking-[0.24em] text-primary-foreground uppercase transition-colors hover:bg-clay"
        >
          {sent ? "Resend request" : "Send request"}
          <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
        </button>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Your request opens in WhatsApp, pre-filled. We reply with availability and hold the dress
          for 24h.
        </p>
      </div>

      {sent ? (
        <p
          role="status"
          className="animate-fade-in border-l-2 border-clay pl-4 text-sm text-foreground"
        >
          Request prepared — send the message in WhatsApp and we&apos;ll confirm shortly.
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow mb-3 block">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}
