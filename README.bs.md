<p align="center">
  <a href="https://YOUR_DOMAIN.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="CodeForge logo">
    </picture>
  </a>
</p>
<p align="center">CodeForge je open source AI agent za programiranje.</p>
<p align="center">
  <a href="https://YOUR_DOMAIN.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/codeforge-ai"><img alt="npm" src="https://img.shields.io/npm/v/codeforge-ai?style=flat-square" /></a>
  <a href="https://github.com/YOUR_ORG/codeforge/actions/workflows/publish.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/YOUR_ORG/codeforge/publish.yml?style=flat-square&branch=dev" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[![CodeForge Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://YOUR_DOMAIN.ai)

---

### Instalacija

```bash
# YOLO
curl -fsSL https://YOUR_DOMAIN.ai/install | bash

# Package manageri
npm i -g codeforge-ai@latest        # ili bun/pnpm/yarn
scoop install codeforge             # Windows
choco install codeforge             # Windows
brew install anomalyco/tap/codeforge # macOS i Linux (preporučeno, uvijek ažurno)
brew install codeforge              # macOS i Linux (zvanična brew formula, rjeđe se ažurira)
sudo pacman -S codeforge            # Arch Linux (Stable)
paru -S codeforge-bin               # Arch Linux (Latest from AUR)
mise use -g codeforge               # Bilo koji OS
nix run nixpkgs#codeforge           # ili github:YOUR_ORG/codeforge za najnoviji dev branch
```

> [!TIP]
> Ukloni verzije starije od 0.1.x prije instalacije.

### Desktop aplikacija (BETA)

CodeForge je dostupan i kao desktop aplikacija. Preuzmi je direktno sa [stranice izdanja](https://github.com/YOUR_ORG/codeforge/releases) ili sa [codeforge.ai/download](https://YOUR_DOMAIN.ai/download).

| Platforma             | Preuzimanje                           |
| --------------------- | ------------------------------------- |
| macOS (Apple Silicon) | `codeforge-desktop-darwin-aarch64.dmg` |
| macOS (Intel)         | `codeforge-desktop-darwin-x64.dmg`     |
| Windows               | `codeforge-desktop-windows-x64.exe`    |
| Linux                 | `.deb`, `.rpm`, ili AppImage          |

```bash
# macOS (Homebrew)
brew install --cask codeforge-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/codeforge-desktop
```

#### Instalacijski direktorij

Instalacijska skripta koristi sljedeći redoslijed prioriteta za putanju instalacije:

1. `$OPENCODE_INSTALL_DIR` - Prilagođeni instalacijski direktorij
2. `$XDG_BIN_DIR` - Putanja usklađena sa XDG Base Directory specifikacijom
3. `$HOME/bin` - Standardni korisnički bin direktorij (ako postoji ili se može kreirati)
4. `$HOME/.codeforge/bin` - Podrazumijevana rezervna lokacija

```bash
# Primjeri
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://YOUR_DOMAIN.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://YOUR_DOMAIN.ai/install | bash
```

### Agenti

CodeForge uključuje dva ugrađena agenta između kojih možeš prebacivati tasterom `Tab`.

- **build** - Podrazumijevani agent sa punim pristupom za razvoj
- **plan** - Agent samo za čitanje za analizu i istraživanje koda
  - Podrazumijevano zabranjuje izmjene datoteka
  - Traži dozvolu prije pokretanja bash komandi
  - Idealan za istraživanje nepoznatih codebase-ova ili planiranje izmjena

Uključen je i **general** pod-agent za složene pretrage i višekoračne zadatke.
Koristi se interno i može se pozvati pomoću `@general` u porukama.

Saznaj više o [agentima](https://YOUR_DOMAIN.ai/docs/agents).

### Dokumentacija

Za više informacija o konfiguraciji CodeForge-a, [**pogledaj dokumentaciju**](https://YOUR_DOMAIN.ai/docs).

### Doprinosi

Ako želiš doprinositi CodeForge-u, pročitaj [upute za doprinošenje](./CONTRIBUTING.md) prije slanja pull requesta.

### Gradnja na CodeForge-u

Ako radiš na projektu koji je povezan s CodeForge-om i koristi "codeforge" kao dio naziva, npr. "codeforge-dashboard" ili "codeforge-mobile", dodaj napomenu u svoj README da projekat nije napravio CodeForge tim i da nije povezan s nama.

### FAQ

#### Po čemu se razlikuje od Claude Code-a?

Po mogućnostima je vrlo sličan Claude Code-u. Ključne razlike su:

- 100% open source
- Nije vezan za jednog provajdera. Iako preporučujemo modele koje nudimo kroz [CodeForge Zen](https://YOUR_DOMAIN.ai/zen), CodeForge možeš koristiti s Claude, OpenAI, Google ili čak lokalnim modelima. Kako modeli napreduju, razlike među njima će se smanjivati, a cijene padati, zato je nezavisnost od provajdera važna.
- LSP podrška odmah po instalaciji
- Fokus na TUI. CodeForge grade neovim korisnici i kreatori [terminal.shop](https://terminal.shop); pomjeraćemo granice onoga što je moguće u terminalu.
- Klijent/server arhitektura. To, recimo, omogućava da CodeForge radi na tvom računaru dok ga daljinski koristiš iz mobilne aplikacije, što znači da je TUI frontend samo jedan od mogućih klijenata.

---

**Pridruži se našoj zajednici** [Discord](https://discord.gg/codeforge) | [X.com](https://x.com/codeforge)
