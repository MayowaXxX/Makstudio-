"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { GoldGlow } from "@/components/brand/GoldGlow";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { SplitReveal, Reveal } from "@/components/ui/SplitReveal";
import { site } from "@/content/site";
import { projectTypes, validateContact, type ContactPayload } from "@/lib/contact";
import { cn } from "@/lib/utils";

type Status = { state: "idle" | "sending" | "success" | "error"; message?: string };

export function Contact() {
  const [errors, setErrors] = useState<Partial<Record<keyof ContactPayload, string>>>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form)) as unknown as ContactPayload;
    const v = validateContact(payload);
    setErrors(v);
    if (Object.keys(v).length) {
      const first = Object.keys(v)[0];
      (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        if (json.errors) setErrors(json.errors);
        setStatus({ state: "error", message: json.error ?? "Something went wrong." });
        return;
      }
      form.reset();
      setStatus({ state: "success", message: "Thank you. Your message is in. I'll reply within two working days." });
    } catch {
      setStatus({ state: "error", message: `Network error. Please email ${site.email} or WhatsApp ${site.whatsapp.display}.` });
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative scroll-mt-16 overflow-hidden pb-28 pt-28 md:pb-40 md:pt-40 cv-auto">
      <GoldGlow className="left-1/2 top-0 h-[60vw] w-[90vw] -translate-x-1/2" />
      <div className="container-luxe">
        <div className="mb-10 flex items-center gap-4">
          <span className="font-display text-xs tracking-[0.2em] text-gold/80">(07)</span>
          <span className="eyebrow">Contact</span>
          <span className="hairline flex-1" />
        </div>
        <SplitReveal
          as="h2"
          id="contact-title"
          text={site.contact.heading}
          className="display text-[clamp(2.6rem,10.5vw,11.5rem)] leading-[0.92]"
          wordClassName="text-gold-gradient"
          accentClassName="accent lowercase text-gold-gradient"
          stagger={0.07}
        />

        <div className="mt-20 grid gap-16 lg:mt-28 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <p className="max-w-md text-lg text-secondary">{site.contact.intro}</p>
            <p className="eyebrow mt-12">Email</p>
            <a href={`mailto:${site.email}`} className="mt-3 inline-block break-all font-serif text-[clamp(1.6rem,2.6vw,2.4rem)] italic text-gold-light transition-colors hover:text-gold">
              {site.email}
            </a>
            <p className="eyebrow mt-10">WhatsApp</p>
            <a
              href={`https://wa.me/${site.whatsapp.number}`}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 inline-flex items-center gap-3 font-serif text-[clamp(1.4rem,2.2vw,2rem)] italic text-gold-light transition-colors hover:text-gold"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden>
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5.1 5.1 0 0 0 1 2.7 11.6 11.6 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.2Z" />
              </svg>
              {site.whatsapp.display}
            </a>
            <p className="eyebrow mt-12">Elsewhere</p>
            <ul className="mt-4 border-t border-line">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-center justify-between border-b border-line py-4 transition-colors hover:text-gold-light"
                  >
                    <span className="font-display text-sm uppercase tracking-[0.22em]">{s.label}</span>
                    <span className="flex items-center gap-3 text-sm text-champagne/70 group-hover:text-gold-light">
                      {s.handle} <ArrowIcon className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <form onSubmit={onSubmit} noValidate className="relative border border-line bg-surface/50 p-6 sm:p-10 md:p-12" aria-describedby="form-status">
              <div className="grid gap-x-8 gap-y-2 md:grid-cols-2">
                <Field label="Name" name="name" error={errors.name}>
                  <input id="name" name="name" autoComplete="name" className="field-input" placeholder="Your name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
                </Field>
                <Field label="Email" name="email" error={errors.email}>
                  <input id="email" name="email" type="email" autoComplete="email" className="field-input" placeholder="you@company.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
                </Field>
                <Field label="Project type" name="projectType" error={errors.projectType}>
                  <Select id="projectType" name="projectType" options={projectTypes} placeholder="Select a service" invalid={!!errors.projectType} />
                </Field>
                <Field label="Budget range" name="budget" error={errors.budget}>
                  <Select id="budget" name="budget" options={site.contact.budgets} placeholder="Select a range" invalid={!!errors.budget} />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Message" name="message" error={errors.message}>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="field-input resize-none"
                      placeholder="The idea, the timeline, links to references…"
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "message-error" : undefined}
                    />
                  </Field>
                </div>
              </div>
              {/* Honeypot */}
              <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="mt-10 flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div id="form-status" role="status" aria-live="polite" className="min-h-6 text-sm">
                  <AnimatePresence mode="wait">
                    {status.message && (
                      <motion.p
                        key={status.state}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={cn(status.state === "error" ? "text-[#F1B8A0]" : "text-gold-light")}
                      >
                        {status.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <Button type="submit" variant="solid" disabled={status.state === "sending"}>
                  {status.state === "sending" ? "Sending…" : "Send enquiry"} <ArrowIcon />
                </Button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, error, children }: { label: string; name: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="relative pb-6">
      <label htmlFor={name} className="eyebrow absolute left-0 top-0 !text-[0.62rem]">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="absolute bottom-0 left-0 text-xs text-[#F1B8A0]">
          {error}
        </p>
      )}
    </div>
  );
}

function Select({ id, name, options, placeholder, invalid }: { id: string; name: string; options: string[]; placeholder: string; invalid: boolean }) {
  return (
    <div className="relative">
      <select id={id} name={name} defaultValue="" className="field-input pr-8 invalid:text-champagne/40" required aria-invalid={invalid} aria-describedby={invalid ? `${id}-error` : undefined}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <svg viewBox="0 0 24 24" className="pointer-events-none absolute bottom-4 right-1 h-3.5 w-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}
