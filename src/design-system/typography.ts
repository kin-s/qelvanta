export const typeScale = {
  display: { fontSize: "2.5rem", lineHeight: "1.1", fontWeight: 700, fontFamily: "heading" },
  h1: { fontSize: "2rem", lineHeight: "1.2", fontWeight: 700, fontFamily: "heading" },
  h2: { fontSize: "1.5rem", lineHeight: "1.25", fontWeight: 600, fontFamily: "heading" },
  h3: { fontSize: "1.25rem", lineHeight: "1.3", fontWeight: 600, fontFamily: "heading" },
  h4: { fontSize: "1rem", lineHeight: "1.4", fontWeight: 600, fontFamily: "heading" },
  body: { fontSize: "0.875rem", lineHeight: "1.5", fontWeight: 400, fontFamily: "sans" },
  small: { fontSize: "0.8125rem", lineHeight: "1.5", fontWeight: 400, fontFamily: "sans" },
  caption: { fontSize: "0.75rem", lineHeight: "1.4", fontWeight: 500, fontFamily: "sans" },
  overline: {
    fontSize: "0.6875rem",
    lineHeight: "1.4",
    fontWeight: 600,
    fontFamily: "sans",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
  },
} as const;

export type TypeToken = keyof typeof typeScale;