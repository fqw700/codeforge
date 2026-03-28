const stage = process.env.SST_STAGE || "dev"

export default {
  url: stage === "production" ? "https://YOUR_DOMAIN.ai" : `https://${stage}.codeforge.ai`,
  console: stage === "production" ? "https://YOUR_DOMAIN.ai/auth" : `https://${stage}.codeforge.ai/auth`,
  email: "contact@anoma.ly",
  socialCard: "https://social-cards.sst.dev",
  github: "https://github.com/YOUR_ORG/codeforge",
  discord: "https://YOUR_DOMAIN.ai/discord",
  headerLinks: [
    { name: "app.header.home", url: "/" },
    { name: "app.header.docs", url: "/docs/" },
  ],
}
