# Fifth Set Collective — Deployment Guide

How to take this website live on your own domain. The site is a full-stack app
(React front end + Node.js API + MySQL database for the RSVP and contact forms),
so it needs a host that can run a Node.js server — a plain "static website" or
shared cPanel host will not run the forms.

---

## What is in this package

| File | Purpose |
|---|---|
| `Dockerfile` | Builds the whole app into one container — the simplest way to deploy on Railway, Render, Fly.io, or any VPS |
| `.env.example` | Template for the environment variables the server needs |
| `api/lib/migrate.ts` | Creates the database tables automatically on first start — no manual database setup needed |

---

## Option A — Railway (recommended, ~15 minutes)

Railway gives you the Node server and the MySQL database in one place, with
automatic HTTPS. Free trial credit is enough to start; expect ~USD 5–10/month after.

1. **Put the code on GitHub**
   - Create a free account at https://github.com, then a new **private** repository.
   - Upload this project folder (on GitHub: "uploading an existing project", or
     from a terminal: `git init && git add . && git commit -m "site"`, then push).

2. **Create the project on Railway** (https://railway.app)
   - New Project → **Deploy from GitHub repo** → pick your repository.
   - Railway detects the `Dockerfile` and builds automatically.

3. **Add the database**
   - In the same project: **New → Database → MySQL**.
   - Open your web service → **Variables** → add:
     - `DATABASE_URL` → click **Add Reference** and choose the MySQL service's
       `DATABASE_URL` (Railway wires it up for you).
     - `APP_ID` → `fifth-set-collective`
     - `APP_SECRET` → any long random string

4. **Deploy** — Railway redeploys automatically. The server creates the `rsvps`
   and `contact_messages` tables on first boot; watch the deploy logs for
   "Database schema ready." then "Server running".

5. **Point your domain**
   - In the web service → **Settings → Networking → Custom Domain** → enter your
     domain (e.g. `fifthsetcollective.com` and `www.fifthsetcollective.com`).
   - Railway shows a **CNAME** record. Go to your registrar's DNS page
     (Namecheap / GoDaddy / Cloudflare — wherever you bought the domain) and add:
     - `www` → CNAME → the value Railway shows
     - Root domain (`@`) → use your registrar's "ALIAS"/"ANAME"/"CNAME flattening"
       record pointing to the same value (all major registrars support this)
   - HTTPS certificates are issued automatically within a few minutes of DNS
     propagating (can take up to a few hours).

## Option B — Render

1. Push the code to GitHub as above.
2. Render (https://render.com) → **New → Web Service** → connect the repo.
   Render detects the Dockerfile (set **Runtime: Docker** if asked).
3. Render does not include MySQL natively — add a free/external MySQL database
   (e.g. Railway's free-tier MySQL, Aiven, or PlanetScale) and set the same three
   environment variables (`DATABASE_URL`, `APP_ID`, `APP_SECRET`).
4. Custom domain: **Settings → Custom Domains**, then add the CNAME record at
   your registrar as above. HTTPS is automatic.

## Option C — Any VPS (DigitalOcean, Hetzner, etc.)

For someone comfortable with a server, or a developer helping you:

```bash
# on the server, with Docker installed
git clone <your-repo> && cd app
docker build -t fifthset .
docker run -d --name fifthset --restart unless-stopped \
  -p 3000:3000 \
  -e DATABASE_URL="mysql://user:password@host:3306/fifthset" \
  -e APP_ID="fifth-set-collective" \
  -e APP_SECRET="<long-random-string>" \
  fifthset
```

Then put Nginx or Caddy in front for HTTPS (Caddy does it with two lines) and
point your domain's A record at the server IP. MySQL can run on the same box
(`docker run mysql:8`) or a managed instance.

---

## After it is live

- **RSVP / contact entries** land in your MySQL database (`rsvps` and
  `contact_messages` tables). On Railway you can browse them from the database
  service's **Data** tab.
- **Updates**: change the code, push to GitHub — Railway/Render rebuild and
  redeploy automatically.
- **Note**: any test RSVPs submitted through the Kimi preview stay on Kimi's
  hosted database and do not transfer. Your deployment starts with fresh tables.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Deploy logs show "Missing required environment variable" | One of `DATABASE_URL` / `APP_ID` / `APP_SECRET` not set |
| Forms submit but nothing is saved | `DATABASE_URL` is wrong or database not reachable — check it includes the right host/port |
| Domain shows "site can't be reached" | DNS not propagated yet (wait), or record points at the wrong target |
| Everything works on `www.` but not the bare domain | Root-domain ALIAS/ANAME record missing at your registrar |
