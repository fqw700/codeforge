/**
 * Application-wide constants and configuration
 */
export const config = {
  // Base URL
  baseUrl: "https://YOUR_DOMAIN.ai",

  // GitHub
  github: {
    repoUrl: "https://github.com/YOUR_ORG/codeforge",
    starsFormatted: {
      compact: "120K",
      full: "120,000",
    },
  },

  // Social links
  social: {
    twitter: "https://x.com/codeforge",
    discord: "https://discord.gg/codeforge",
  },

  // Static stats (used on landing page)
  stats: {
    contributors: "800",
    commits: "10,000",
    monthlyUsers: "5M",
  },
} as const
