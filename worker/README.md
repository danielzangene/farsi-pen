# Farsi Pen API (Cloudflare Worker)

One free Worker gives the app three optional features. The app hides each one until
`NEXT_PUBLIC_API_URL` points at this Worker.

| Route | What it does |
|---|---|
| `POST /tutor` | AI conversation partner. Proxies to NVIDIA's API (`integrate.api.nvidia.com`) so the key never reaches the browser. Rate-limited per visitor and per day. |
| `GET/PUT /sync/:code` | Progress sync between devices. The code is random (130 bits); no email, name or account. |
| `POST /feedback` | Feedback and content reports. |
| `GET /health` | `{ ok, tutor }` |

## Set up (once)

```bash
cd worker
npx wrangler login
npx wrangler kv namespace create KV        # paste the id into wrangler.toml
npx wrangler secret put NVIDIA_API_KEY     # key from build.nvidia.com
npx wrangler deploy
```

Then set the repository variable `NEXT_PUBLIC_API_URL` (e.g. `https://farsi-pen-api.<you>.workers.dev`) for the Pages build.

## Read feedback

```bash
npx wrangler kv key list --binding KV --prefix fb: --remote
npx wrangler kv key get --binding KV --remote "<key>"
```

Privacy: rate limits use a daily-rotating salted hash of the IP; nothing else about the visitor is stored.
