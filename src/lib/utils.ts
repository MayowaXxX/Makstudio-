export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** Splits "Directing the *Future*" into segments, flagging *accent* words. */
export function parseAccent(text: string): { text: string; accent: boolean }[] {
  return text
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith("*") && part.endsWith("*")
        ? { text: part.slice(1, -1), accent: true }
        : { text: part, accent: false },
    );
}

/** Plain text with the *accent* markers removed (for aria-labels and metadata). */
export const stripAccent = (text: string) => text.replace(/\*/g, "");

export const pad2 = (n: number) => String(n).padStart(2, "0");
