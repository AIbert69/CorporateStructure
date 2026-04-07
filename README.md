# Mammoth Holdings — Corporate Structure Dashboard

Interactive dashboard for managing multi-entity corporate structure with AI-powered legal document generation.

## Features

- **Visual org chart** — Parent holding company with subsidiary LLC cards
- **Editable ownership splits** — Click "Edit %" to adjust Albert/Ryan percentages
- **AI document generation** — Generate MOUs, Operating Agreements, and NDAs per venture
- **Real-time stats** — Entity count, completion %, average ownership

## Quick Deploy to Vercel

### 1. Push to GitHub

```bash
cd mammoth-dashboard
git init
git add .
git commit -m "initial commit"
gh repo create mammoth-dashboard --private --push
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import `mammoth-dashboard` repo
4. In **Environment Variables**, add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your API key from [console.anthropic.com](https://console.anthropic.com)
5. Click **Deploy**

Your site is live! Vercel gives you a URL like `mammoth-dashboard.vercel.app`.

### 3. Custom Domain (optional)

In Vercel dashboard → Settings → Domains → add `structure.mammothholdings.com` (or whatever you want).

## Local Development

```bash
# Install dependencies
npm install

# Copy env file and add your API key
cp .env.local.example .env.local
# Edit .env.local with your ANTHROPIC_API_KEY

# Run dev server
npm run dev
# Open http://localhost:3000
```

## Project Structure

```
mammoth-dashboard/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.js      ← Server-side API proxy (keeps key secure)
│   ├── globals.css            ← Styles (Tailwind + custom glass/pill classes)
│   ├── layout.js              ← Root layout with metadata
│   └── page.js                ← Main dashboard (client component)
├── public/
│   └── logo.png               ← Mammoth logo
├── .env.local.example         ← Environment variable template
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
└── tailwind.config.js
```

## How the API Works

1. User clicks "Docs" on a venture card
2. Selects document type (MOU / Operating Agreement / NDA)
3. Frontend calls `/api/generate` (Next.js API route)
4. API route calls Anthropic with your key server-side
5. Generated document returned to frontend
6. User copies to clipboard → sends to attorney for review

**Cost:** ~$0.04-0.08 per document generation (Claude Sonnet)

## Legal Disclaimer

All generated documents are drafts for discussion purposes only and should be reviewed by licensed legal counsel before execution.
