export const brandColors = {
  obsidianBlack: "#111111",
  deepCharcoal: "#191919",
  graphite: "#242424",
  champagneGold: "#C6A66B",
  softGold: "#D8BE8A",
  ivory: "#F5F0E7",
  mutedGrey: "#A6A29A",
  borderGrey: "#353535",
  success: "#38B982",
  warning: "#E5A84B",
  danger: "#E06B67",
  info: "#68A9D8",
  goldDeep: "#A98545",
  ivoryBg: "#F5F3EF",
} as const;

export const statusColors = {
  success: brandColors.success,
  warning: brandColors.warning,
  danger: brandColors.danger,
  info: brandColors.info,
} as const;

export const radius = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
} as const;

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
} as const;