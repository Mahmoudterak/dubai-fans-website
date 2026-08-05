# Dubai Fans — Digital Marketing Website

A production-ready standalone React/Vite website for **Dubai Fans** digital marketing agency.

> Extracted from the original pnpm monorepo into a fully independent repository.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 |
| Routing | Wouter |
| State | TanStack Query v5 |
| Animations | Framer Motion |
| UI Components | Radix UI + shadcn/ui |
| Forms | React Hook Form + Zod |
| SEO | Pre-rendered HTML per route |

---

## Getting Started

### Prerequisites
- Node.js ≥ 20
- pnpm ≥ 9

### Install & Run

```bash
pnpm install
pnpm dev
```

Opens at `http://localhost:5173`

### Build for Production

```bash
pnpm build
```

Output is in `dist/`. The build also pre-renders HTML for every route (SEO).

### Preview Production Build

```bash
pnpm preview
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API URL (empty = same origin) |
| `VITE_RECAPTCHA_SITE_KEY` | Google reCAPTCHA v2 site key |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number (no `+`) |

---

## Backend (API Server)

The website calls a separate API server at `/api/*` routes. The API server is **not** included in this repository. Configure `VITE_API_BASE_URL` to point to your deployed API server.

---

## Deployment

### Vercel

1. Import the repository in Vercel
2. Framework preset: **Vite**
3. Build command: `pnpm build:vite`
4. Output directory: `dist`
5. Add environment variables in the Vercel dashboard

### Netlify

1. Connect the repository in Netlify
2. Build command: `pnpm build:vite`
3. Publish directory: `dist`
4. `netlify.toml` handles SPA redirects automatically

### Cloudflare Pages

1. Create a new Pages project
2. Framework preset: **Vite**
3. Build command: `pnpm build:vite`
4. Build output directory: `dist`
5. Deploy

---

## Project Structure

```
dubai-fans-website/
├── public/              # Static assets (images, fonts, favicons)
├── scripts/             # Build-time scripts (prerender, SEO validation)
├── src/
│   ├── components/      # Shared UI components
│   ├── data/            # Static data (courses, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities (fetch, consent, recaptcha)
│   ├── pages/           # Page components (one per route)
│   ├── seo/             # Route metadata + JSON-LD schemas
│   └── vendor/          # Vendored workspace packages
│       ├── api-client-react/   # HTTP API client
│       ├── blog-data/          # Blog posts data
│       └── dubai-fans-ds/      # Design system (tokens + components)
├── .env.example
├── netlify.toml
├── vercel.json
├── vite.config.ts
└── wrangler.toml        # Cloudflare Pages
```

---

## Brand

- Primary: `#CC0000` (red)
- Accent: `#D97706` (gold)
- Background: `#FAFAFA`
- Font: Cairo (Arabic)

---

## License

MIT © Dubai Fans Digital Marketing
