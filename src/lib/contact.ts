import { site } from "@/content/site";

export type ContactPayload = {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  /** Honeypot — must stay empty. */
  website?: string;
};

export const projectTypes = [...site.services.map((s) => s.title), "Something else"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Shared client/server validation. Returns field → message. */
export function validateContact(p: Partial<ContactPayload>): Partial<Record<keyof ContactPayload, string>> {
  const errors: Partial<Record<keyof ContactPayload, string>> = {};
  if (!p.name || p.name.trim().length < 2) errors.name = "Please tell me your name.";
  if (!p.email || !EMAIL_RE.test(p.email.trim())) errors.email = "Please enter a valid email address.";
  if (!p.projectType || !projectTypes.includes(p.projectType)) errors.projectType = "Choose a project type.";
  if (!p.budget || !site.contact.budgets.includes(p.budget)) errors.budget = "Choose a budget range.";
  if (!p.message || p.message.trim().length < 10) errors.message = "A few more words about the project, please.";
  if (p.message && p.message.length > 5000) errors.message = "Please keep it under 5,000 characters.";
  return errors;
}
