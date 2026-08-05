/* GENERATED FROM tokens.json -- DO NOT EDIT. Run scripts/build-tokens.mjs. */
// Portable design tokens (colors as hex). Web consumes the theme via
// src/index.css; mobile (Expo) and any other platform import this object so the
// whole product shares one source of truth.
export const tokens = {
  "color": {
    "light": {
      "background": "#FAFAFA",
      "foreground": "#111827",
      "card": "#FFFFFF",
      "cardForeground": "#111827",
      "popover": "#FFFFFF",
      "popoverForeground": "#111827",
      "primary": "#CC0000",
      "primaryForeground": "#FFFFFF",
      "secondary": "#F3F4F6",
      "secondaryForeground": "#111827",
      "muted": "#F3F4F6",
      "mutedForeground": "#6B7280",
      "accent": "#D97706",
      "accentForeground": "#FFFFFF",
      "destructive": "#EF4444",
      "destructiveForeground": "#FFFFFF",
      "border": "#E5E7EB",
      "input": "#F3F4F6",
      "ring": "#CC0000",
      "chart1": "#CC0000",
      "chart2": "#D97706",
      "chart3": "#3B82F6",
      "chart4": "#10B981",
      "chart5": "#8B5CF6",
      "sidebar": "#FFFFFF",
      "sidebarForeground": "#111827",
      "sidebarBorder": "#E5E7EB",
      "sidebarPrimary": "#CC0000",
      "sidebarPrimaryForeground": "#FFFFFF",
      "sidebarAccent": "#F3F4F6",
      "sidebarAccentForeground": "#111827",
      "sidebarRing": "#CC0000"
    },
    "dark": {
      "background": "#0F1117",
      "foreground": "#F9FAFB",
      "card": "#1A1D27",
      "cardForeground": "#F9FAFB",
      "popover": "#1A1D27",
      "popoverForeground": "#F9FAFB",
      "primary": "#E53E3E",
      "primaryForeground": "#FFFFFF",
      "secondary": "#1F2937",
      "secondaryForeground": "#E5E7EB",
      "muted": "#1F2937",
      "mutedForeground": "#9CA3AF",
      "accent": "#F59E0B",
      "accentForeground": "#111827",
      "destructive": "#EF4444",
      "destructiveForeground": "#FFFFFF",
      "border": "#374151",
      "input": "#1F2937",
      "ring": "#E53E3E",
      "chart1": "#E53E3E",
      "chart2": "#F59E0B",
      "chart3": "#60A5FA",
      "chart4": "#34D399",
      "chart5": "#A78BFA",
      "sidebar": "#111827",
      "sidebarForeground": "#F9FAFB",
      "sidebarBorder": "#374151",
      "sidebarPrimary": "#E53E3E",
      "sidebarPrimaryForeground": "#FFFFFF",
      "sidebarAccent": "#1F2937",
      "sidebarAccentForeground": "#E5E7EB",
      "sidebarRing": "#E53E3E"
    }
  },
  "fontFamily": {
    "sans": [
      "Cairo",
      "sans-serif"
    ],
    "serif": [
      "Georgia",
      "serif"
    ],
    "mono": [
      "Menlo",
      "monospace"
    ]
  },
  "radius": "0.75rem",
  "spacing": "0.25rem"
} as const;

export type Tokens = typeof tokens;
export default tokens;
