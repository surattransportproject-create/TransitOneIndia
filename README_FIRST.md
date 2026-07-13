# TransitOne India — Deployment Fix

## Why your site was 404ing

Your GitHub repo only contained one file: `TransitOneIndia.jsx.txt`.
There was no `package.json`, no `index.html`, no build config — nothing
that told Vercel this was a deployable app. So the build produced
nothing, and every URL (including `/`) returned NOT_FOUND.

This zip contains the missing project scaffold: `package.json`,
`vite.config.js`, `index.html`, `src/main.jsx`, and `.gitignore`.

## The one thing I couldn't do for you

GitHub blocks automated tools from downloading raw file contents, so
I could not pull your actual `TransitOneIndia.jsx.txt` code into this
package. You'll need to do one manual step to finish the fix.

## What to do (5 minutes)

1. **Download this zip and unzip it.**
2. Go to your existing GitHub repo, open `TransitOneIndia.jsx.txt`,
   click **"Copy raw file"** (or download it).
3. Inside the unzipped folder, create a file at `src/App.jsx` and
   paste in the full contents of `TransitOneIndia.jsx.txt`.
   (No code changes needed — it already ends with
   `export default function TransitOne(){...}`, which is exactly
   what `src/main.jsx` in this package expects to import.)
4. Delete `TransitOneIndia.jsx.txt` — you don't need it anymore.
5. Upload everything to your GitHub repo (drag-and-drop on
   github.com works fine, or use `git add . && git commit && git push`
   if you have git set up locally).
6. Vercel will auto-redeploy. It should detect Vite automatically;
   if not, set **Framework Preset → Vite** in Project Settings.

## One more thing to know

Your component calls `fetch("/api/claude", ...)` for the AI journey
planner and AI chat features. That endpoint doesn't exist yet, so
once the site loads, those two specific features will still fail
until you add a serverless function at `api/claude.js`. That's a
separate, smaller fix — just ask if you want help with it once the
main site is live.
