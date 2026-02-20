import { Theme } from "../Types/CommonTypes";

const ThemeConfig = {
  // Original themes
  [Theme.Light]: {
    bgPrimary: "#f8f9fc",
    bgSecondary: "#ffffff",
    bgGradientStart: "#667eea",
    bgGradientEnd: "#764ba2",
    textPrimary: "#1a202c",
    textSecondary: "#4a5568",
    textTertiary: "#718096",
    glassBg: "rgba(255, 255, 255, 0.15)",
    glassBorder: "rgba(255, 255, 255, 0.25)",
    glassShadow: "rgba(31, 38, 135, 0.15)",
    accentPrimary: "#667eea",
    accentHover: "#5568d3",
  },
  [Theme.Dark]: {
    bgPrimary: "#0f1419",
    bgSecondary: "#1a1f29",
    bgGradientStart: "#4c1d95",
    bgGradientEnd: "#1e1b4b",
    textPrimary: "#f7fafc",
    textSecondary: "#cbd5e0",
    textTertiary: "#a0aec0",
    glassBg: "rgba(26, 31, 41, 0.4)",
    glassBorder: "rgba(255, 255, 255, 0.1)",
    glassShadow: "rgba(0, 0, 0, 0.3)",
    accentPrimary: "#8b5cf6",
    accentHover: "#7c3aed",
  },

  // New themes
  [Theme.AuroraBorealis]: {
    bgPrimary: "#021c1a",
    bgSecondary: "#072926",
    bgGradientStart: "#134e4a",
    bgGradientEnd: "#064e3b",
    textPrimary: "#ecfdf5",
    textSecondary: "#a7f3d0",
    textTertiary: "#6ee7b7",
    glassBg: "rgba(7, 41, 38, 0.45)",
    glassBorder: "rgba(110, 231, 183, 0.12)",
    glassShadow: "rgba(0, 0, 0, 0.35)",
    accentPrimary: "#34d399",
    accentHover: "#10b981",
  },
  [Theme.SunsetBlaze]: {
    bgPrimary: "#150700",
    bgSecondary: "#1f0c03",
    bgGradientStart: "#7c2d12",
    bgGradientEnd: "#450a0a",
    textPrimary: "#fff7ed",
    textSecondary: "#fed7aa",
    textTertiary: "#fdba74",
    glassBg: "rgba(31, 12, 3, 0.45)",
    glassBorder: "rgba(253, 186, 116, 0.12)",
    glassShadow: "rgba(0, 0, 0, 0.40)",
    accentPrimary: "#fb923c",
    accentHover: "#f97316",
  },
  [Theme.MidnightRose]: {
    bgPrimary: "#0d0010",
    bgSecondary: "#160019",
    bgGradientStart: "#831843",
    bgGradientEnd: "#4a044e",
    textPrimary: "#fdf4ff",
    textSecondary: "#f5d0fe",
    textTertiary: "#e879f9",
    glassBg: "rgba(22, 0, 25, 0.45)",
    glassBorder: "rgba(232, 121, 249, 0.12)",
    glassShadow: "rgba(0, 0, 0, 0.38)",
    accentPrimary: "#f0abfc",
    accentHover: "#e879f9",
  },
  [Theme.ArcticSteel]: {
    bgPrimary: "#030d1a",
    bgSecondary: "#071626",
    bgGradientStart: "#1e3a5f",
    bgGradientEnd: "#0c1a3b",
    textPrimary: "#f0f9ff",
    textSecondary: "#bae6fd",
    textTertiary: "#7dd3fc",
    glassBg: "rgba(7, 22, 38, 0.45)",
    glassBorder: "rgba(125, 211, 252, 0.10)",
    glassShadow: "rgba(0, 0, 0, 0.35)",
    accentPrimary: "#60a5fa",
    accentHover: "#3b82f6",
  },
  [Theme.GoldenHour]: {
    bgPrimary: "#0d0900",
    bgSecondary: "#1a1200",
    bgGradientStart: "#78350f",
    bgGradientEnd: "#451a03",
    textPrimary: "#fffbeb",
    textSecondary: "#fde68a",
    textTertiary: "#fcd34d",
    glassBg: "rgba(26, 18, 0, 0.45)",
    glassBorder: "rgba(252, 211, 77, 0.12)",
    glassShadow: "rgba(0, 0, 0, 0.40)",
    accentPrimary: "#fbbf24",
    accentHover: "#f59e0b",
  },
  [Theme.ForestDepths]: {
    bgPrimary: "#011407",
    bgSecondary: "#041f0e",
    bgGradientStart: "#14532d",
    bgGradientEnd: "#052e16",
    textPrimary: "#f0fdf4",
    textSecondary: "#bbf7d0",
    textTertiary: "#86efac",
    glassBg: "rgba(4, 31, 14, 0.45)",
    glassBorder: "rgba(134, 239, 172, 0.10)",
    glassShadow: "rgba(0, 0, 0, 0.38)",
    accentPrimary: "#4ade80",
    accentHover: "#22c55e",
  },
  [Theme.NeonAbyss]: {
    bgPrimary: "#020b18",
    bgSecondary: "#051525",
    bgGradientStart: "#164e63",
    bgGradientEnd: "#1e1b4b",
    textPrimary: "#ecfeff",
    textSecondary: "#a5f3fc",
    textTertiary: "#67e8f9",
    glassBg: "rgba(5, 21, 37, 0.45)",
    glassBorder: "rgba(103, 232, 249, 0.11)",
    glassShadow: "rgba(0, 0, 0, 0.40)",
    accentPrimary: "#22d3ee",
    accentHover: "#06b6d4",
  },
};

export default ThemeConfig;
// ─────────────────────────────────────────────────────────────
//  1. Aurora Borealis — Teal / Emerald
// ─────────────────────────────────────────────────────────────
export const AuroraBorealisTheme = {
  [Theme.Light]: {
    bgPrimary: "#f0fdf9",
    bgSecondary: "#ffffff",
    bgGradientStart: "#0d9488",
    bgGradientEnd: "#059669",
    textPrimary: "#134e4a",
    textSecondary: "#1f6055",
    textTertiary: "#4d7c72",
    glassBg: "rgba(255, 255, 255, 0.18)",
    glassBorder: "rgba(255, 255, 255, 0.30)",
    glassShadow: "rgba(13, 148, 136, 0.12)",
    accentPrimary: "#0d9488",
    accentHover: "#0f766e",
  },
  [Theme.Dark]: {
    bgPrimary: "#021c1a",
    bgSecondary: "#072926",
    bgGradientStart: "#134e4a",
    bgGradientEnd: "#064e3b",
    textPrimary: "#ecfdf5",
    textSecondary: "#a7f3d0",
    textTertiary: "#6ee7b7",
    glassBg: "rgba(7, 41, 38, 0.45)",
    glassBorder: "rgba(110, 231, 183, 0.12)",
    glassShadow: "rgba(0, 0, 0, 0.35)",
    accentPrimary: "#34d399",
    accentHover: "#10b981",
  },
};

// ─────────────────────────────────────────────────────────────
//  2. Sunset Blaze — Coral / Orange / Red
// ─────────────────────────────────────────────────────────────
export const SunsetBlazeTheme = {
  [Theme.Light]: {
    bgPrimary: "#fff7f2",
    bgSecondary: "#ffffff",
    bgGradientStart: "#f97316",
    bgGradientEnd: "#ef4444",
    textPrimary: "#1c0a00",
    textSecondary: "#7c2d12",
    textTertiary: "#9a3412",

    glassBg: "rgba(255, 255, 255, 0.65)",
    glassBorder: "rgba(0, 0, 0, 0.08)",
    glassShadow: "rgba(15, 23, 42, 0.06)",

    accentPrimary: "#f97316",
    accentHover: "#ea6c0d",
  },
  [Theme.Dark]: {
    bgPrimary: "#150700",
    bgSecondary: "#1f0c03",
    bgGradientStart: "#7c2d12",
    bgGradientEnd: "#450a0a",
    textPrimary: "#fff7ed",
    textSecondary: "#fed7aa",
    textTertiary: "#fdba74",
    glassBg: "rgba(31, 12, 3, 0.45)",
    glassBorder: "rgba(253, 186, 116, 0.12)",
    glassShadow: "rgba(0, 0, 0, 0.40)",
    accentPrimary: "#fb923c",
    accentHover: "#f97316",
  },
};

// ─────────────────────────────────────────────────────────────
//  3. Midnight Rose — Pink / Fuchsia / Deep Purple
// ─────────────────────────────────────────────────────────────
export const MidnightRoseTheme = {
  light: {
    bgPrimary: "#fdf2f8",
    bgSecondary: "#ffffff",
    bgGradientStart: "#ec4899",
    bgGradientEnd: "#a855f7",
    textPrimary: "#1a0010",
    textSecondary: "#831843",
    textTertiary: "#9d174d",
    glassBg: "rgba(255, 255, 255, 0.18)",
    glassBorder: "rgba(255, 255, 255, 0.30)",
    glassShadow: "rgba(236, 72, 153, 0.13)",
    accentPrimary: "#ec4899",
    accentHover: "#db2777",
  },
  dark: {
    bgPrimary: "#0d0010",
    bgSecondary: "#160019",
    bgGradientStart: "#831843",
    bgGradientEnd: "#4a044e",
    textPrimary: "#fdf4ff",
    textSecondary: "#f5d0fe",
    textTertiary: "#e879f9",
    glassBg: "rgba(22, 0, 25, 0.45)",
    glassBorder: "rgba(232, 121, 249, 0.12)",
    glassShadow: "rgba(0, 0, 0, 0.38)",
    accentPrimary: "#f0abfc",
    accentHover: "#e879f9",
  },
};

// ─────────────────────────────────────────────────────────────
//  4. Arctic Steel — Sky Blue / Slate
// ─────────────────────────────────────────────────────────────
export const ArcticSteelTheme = {
  light: {
    bgPrimary: "#f0f4ff",
    bgSecondary: "#ffffff",
    bgGradientStart: "#3b82f6",
    bgGradientEnd: "#1d4ed8",
    textPrimary: "#0f172a",
    textSecondary: "#1e3a5f",
    textTertiary: "#3b5a8a",
    glassBg: "rgba(255, 255, 255, 0.16)",
    glassBorder: "rgba(255, 255, 255, 0.28)",
    glassShadow: "rgba(59, 130, 246, 0.13)",
    accentPrimary: "#3b82f6",
    accentHover: "#2563eb",
  },
  dark: {
    bgPrimary: "#030d1a",
    bgSecondary: "#071626",
    bgGradientStart: "#1e3a5f",
    bgGradientEnd: "#0c1a3b",
    textPrimary: "#f0f9ff",
    textSecondary: "#bae6fd",
    textTertiary: "#7dd3fc",
    glassBg: "rgba(7, 22, 38, 0.45)",
    glassBorder: "rgba(125, 211, 252, 0.10)",
    glassShadow: "rgba(0, 0, 0, 0.35)",
    accentPrimary: "#60a5fa",
    accentHover: "#3b82f6",
  },
};

// ─────────────────────────────────────────────────────────────
//  5. Golden Hour — Amber / Gold / Warm Brown
// ─────────────────────────────────────────────────────────────
export const GoldenHourTheme = {
  light: {
    bgPrimary: "#fffbeb",
    bgSecondary: "#ffffff",
    bgGradientStart: "#f59e0b",
    bgGradientEnd: "#d97706",
    textPrimary: "#1c1400",
    textSecondary: "#78350f",
    textTertiary: "#92400e",
    glassBg: "rgba(255, 255, 255, 0.20)",
    glassBorder: "rgba(255, 255, 255, 0.40)",
    glassShadow: "rgba(245, 158, 11, 0.14)",
    accentPrimary: "#f59e0b",
    accentHover: "#d97706",
  },
  dark: {
    bgPrimary: "#0d0900",
    bgSecondary: "#1a1200",
    bgGradientStart: "#78350f",
    bgGradientEnd: "#451a03",
    textPrimary: "#fffbeb",
    textSecondary: "#fde68a",
    textTertiary: "#fcd34d",
    glassBg: "rgba(26, 18, 0, 0.45)",
    glassBorder: "rgba(252, 211, 77, 0.12)",
    glassShadow: "rgba(0, 0, 0, 0.40)",
    accentPrimary: "#fbbf24",
    accentHover: "#f59e0b",
  },
};

// ─────────────────────────────────────────────────────────────
//  6. Forest Depths — Green / Sage / Moss
// ─────────────────────────────────────────────────────────────
export const ForestDepthsTheme = {
  light: {
    bgPrimary: "#f3faf3",
    bgSecondary: "#ffffff",
    bgGradientStart: "#16a34a",
    bgGradientEnd: "#15803d",
    textPrimary: "#052e16",
    textSecondary: "#14532d",
    textTertiary: "#166534",
    glassBg: "rgba(255, 255, 255, 0.16)",
    glassBorder: "rgba(255, 255, 255, 0.28)",
    glassShadow: "rgba(22, 163, 74, 0.12)",
    accentPrimary: "#16a34a",
    accentHover: "#15803d",
  },
  dark: {
    bgPrimary: "#011407",
    bgSecondary: "#041f0e",
    bgGradientStart: "#14532d",
    bgGradientEnd: "#052e16",
    textPrimary: "#f0fdf4",
    textSecondary: "#bbf7d0",
    textTertiary: "#86efac",
    glassBg: "rgba(4, 31, 14, 0.45)",
    glassBorder: "rgba(134, 239, 172, 0.10)",
    glassShadow: "rgba(0, 0, 0, 0.38)",
    accentPrimary: "#4ade80",
    accentHover: "#22c55e",
  },
};

// ─────────────────────────────────────────────────────────────
//  7. Obsidian Ember — Charcoal / Crimson Red
// ─────────────────────────────────────────────────────────────
export const ObsidianEmberTheme = {
  light: {
    bgPrimary: "#f9f6f5",
    bgSecondary: "#ffffff",
    bgGradientStart: "#dc2626",
    bgGradientEnd: "#1c1917",
    textPrimary: "#0c0a09",
    textSecondary: "#44403c",
    textTertiary: "#78716c",
    glassBg: "rgba(255, 255, 255, 0.15)",
    glassBorder: "rgba(255, 255, 255, 0.25)",
    glassShadow: "rgba(220, 38, 38, 0.12)",
    accentPrimary: "#dc2626",
    accentHover: "#b91c1c",
  },
  dark: {
    bgPrimary: "#0a0808",
    bgSecondary: "#120e0e",
    bgGradientStart: "#450a0a",
    bgGradientEnd: "#1c1412",
    textPrimary: "#fafaf9",
    textSecondary: "#d6d3d1",
    textTertiary: "#a8a29e",
    glassBg: "rgba(18, 14, 14, 0.50)",
    glassBorder: "rgba(255, 255, 255, 0.08)",
    glassShadow: "rgba(0, 0, 0, 0.50)",
    accentPrimary: "#f87171",
    accentHover: "#ef4444",
  },
};

// ─────────────────────────────────────────────────────────────
//  8. Neon Abyss — Deep Navy / Cyan / Electric
// ─────────────────────────────────────────────────────────────
export const NeonAbyssTheme = {
  light: {
    bgPrimary: "#f0faff",
    bgSecondary: "#ffffff",
    bgGradientStart: "#0891b2",
    bgGradientEnd: "#6366f1",
    textPrimary: "#0c1a2e",
    textSecondary: "#164e63",
    textTertiary: "#155e75",
    glassBg: "rgba(255, 255, 255, 0.17)",
    glassBorder: "rgba(255, 255, 255, 0.30)",
    glassShadow: "rgba(8, 145, 178, 0.14)",
    accentPrimary: "#0891b2",
    accentHover: "#0e7490",
  },
  dark: {
    bgPrimary: "#020b18",
    bgSecondary: "#051525",
    bgGradientStart: "#164e63",
    bgGradientEnd: "#1e1b4b",
    textPrimary: "#ecfeff",
    textSecondary: "#a5f3fc",
    textTertiary: "#67e8f9",
    glassBg: "rgba(5, 21, 37, 0.45)",
    glassBorder: "rgba(103, 232, 249, 0.11)",
    glassShadow: "rgba(0, 0, 0, 0.40)",
    accentPrimary: "#22d3ee",
    accentHover: "#06b6d4",
  },
};
