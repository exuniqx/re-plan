export const theme = {
  colors: {
    primary: "#176584",
    secondary: "#B2BDE5",

    background: "#F8FAFC",
    surface: "#FFFFFF",

    textPrimary: "#1E293B",
    textSecondary: "#647289",

    border: "#E2E8F0",

    success: "#10B981",
    warning: "#F59E0B",

    white: "#FFFFFF",
  },

  spacing: {
    screen: 20,
    section: 24,
    gap: 16,
    small: 8,
  },

  radius: {
    button: 12,
    card: 12,
    input: 8,
  },

  typography: {
    header: {
      fontSize: 24,
      fontWeight: "700" as const,
    },

    section: {
      fontSize: 18,
      fontWeight: "600" as const,
    },

    body: {
      fontSize: 16,
      fontWeight: "400" as const,
    },

    caption: {
      fontSize: 13,
      fontWeight: "400" as const,
    },
  },
};
