# Meridian Export — Corporate Website

Professional machinery export & logistics website for [Meridian Freight Inc.](https://meridianexport.com)

## Tech Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS 4** with shadcn/ui components
- **Geist** fonts (Sans + Mono)
- **motion** for scroll animations
- **Resend** for transactional email
- **Supabase** for lead storage
- **Vercel** for hosting

## Getting Started

```bash
npm install
cp .env.example .env.local  # then fill in your keys
npm run dev                  # http://localhost:3000
```

## Commands

```bash
npm run dev     # Development server (Turbopack)
npm run build   # Production build
npm run start   # Serve production build
npm run lint    # ESLint
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with all sections |
| `/services` | Services overview |
| `/services/[slug]` | 6 individual service pages (SSG) |
| `/projects` | Project portfolio |
| `/pricing` | Equipment pricing tables |
| `/pricing/calculator` | Freight cost calculator |
| `/about` | Company information |
| `/faq` | Frequently asked questions |
| `/contact` | Contact form |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

## Deployment

Deployed on Vercel. Pushes to `main` auto-deploy to production.

## License

MIT
