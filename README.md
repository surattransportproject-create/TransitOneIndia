# TransitOne India — Deploy to Vercel

This folder is a ready-to-deploy Vite + React project containing the full TransitOne India platform.

## 1. Quick deploy (no local setup needed)

1. Go to **vercel.com** → sign up / log in (free).
2. Click **Add New → Project**.
3. Choose **"Deploy without Git"** (drag-and-drop) — or push this folder to a GitHub repo first and import it (recommended for future updates).
4. If dragging the folder: zip this whole directory and drag it onto the Vercel import screen.
5. Vercel auto-detects the **Vite** framework from `vercel.json` — no extra config needed.
6. Click **Deploy**. You'll get a live URL like `https://transitone-india.vercel.app` in under a minute.

## 2. Enable the AI features (Journey Planner + AI Chat)

The AI Journey Planner and AI Chat Assistant call Claude through a secure serverless function at `/api/claude` (see `api/claude.js`). Your API key is **never exposed to the browser** — it stays server-side.

To activate it:

1. Get an API key from **console.anthropic.com** (Anthropic's developer console).
2. In your Vercel project → **Settings → Environment Variables**, add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-...` (your key)
3. Redeploy (Vercel → Deployments → ⋯ → Redeploy), or just push a new commit if using GitHub.

Without this key set, the rest of the site works perfectly — only the AI Journey Planner and AI Chat will show a friendly error until the key is added.

## 3. Local development (optional)

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Note: the `/api/claude` serverless function only runs when deployed on Vercel (or via `vercel dev`), not with plain `vite dev`.

To test the API route locally:

```bash
npm i -g vercel
vercel dev
```

## 4. Custom domain

In Vercel → your project → **Settings → Domains**, add your own domain (e.g. `transitone.in`) and follow the DNS instructions Vercel provides.

## 5. What's inside

```
├── index.html          ← page shell
├── src/
│   ├── main.jsx         ← React mount point
│   └── App.jsx           ← the entire TransitOne platform (all tabs, modals, components)
├── api/
│   └── claude.js          ← serverless proxy to Anthropic's API (keeps your key secret)
├── package.json
├── vite.config.js
└── vercel.json
```

## 6. Notes on the QR code

The Payment screen currently shows a **placeholder QR code** (not a real scannable UPI code), since the original real QR image was intentionally removed for privacy. If you want to accept real payments, replace the placeholder SVG in `src/App.jsx` (search for `UPI QR PANEL`) with your own UPI QR image and ID.
