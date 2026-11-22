/** MAK wordmark geometry: M, an open chevron Λ for the A, and K. Shared by the SVG component and the OG image. */
export const LOGO_PATHS = [
  "M10 90 L10 10 L50 62 L90 10 L90 90", // M
  "M125 90 L165 10 L205 90", // Λ
  "M240 10 L240 90", // K stem
  "M300 10 L242 50 L300 90", // K arms
] as const;

export const LOGO_VIEWBOX = "0 0 310 100";
