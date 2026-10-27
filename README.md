# Tamable Nuxt blog

A [Nuxt](https://nuxt.com) starter for a blog whose posts live in a [Tamable](https://tamable.app) workspace. You write, review and publish in Tamable; this site renders what you published and rebuilds itself when something changes.

It gives you:

- Posts at `/blog/{slug}`, with tags, series, reading time, cover images and the SEO fields you set in Tamable (title, description, canonical URL, Open Graph, JSON-LD)
- Tag pages at `/tags/{tag}` and series pages at `/series` and `/series/{slug}`
- Draft previews at `/preview/{token}`: never cached, never indexed
- An RSS feed (`/rss.xml`), a sitemap and `robots.txt`
- 301 redirects for posts you renamed in Tamable, and optionally for the addresses of an old Ghost blog
- A deploy webhook that checks Tamable's signature before asking your host to rebuild
- Light and dark themes, both driven by CSS variables

Pages are prerendered at build time. A small Node server handles only previews and the deploy webhook.

Everything that talks to Tamable (the read API client, feeds, redirects, the webhook check and a fake Tamable for tests) comes from [@tamable/blog-kit](https://github.com/tamable-app/blog-kit), shared with the Next.js and Astro starters. This repo holds the Nuxt pages, components and styles.

## Quick start

You need Node 22.22.3 or newer, or 24.15 or newer.

```sh
npm install
cp .env.example .env   # then fill it in, see below
npm run dev            # http://localhost:3000
```

To try it without a Tamable workspace, run the fake API, which serves a few made-up posts:

```sh
npm run fake-tamable &
NUXT_TAMABLE_API_URL=http://localhost:4010/api/v1 NUXT_TAMABLE_READ_KEY=fixture npm run dev
```

## Connect it to Tamable

In Tamable, go to **Settings › Sites** (you need to be a workspace owner) and create a site:

| Field | Value |
|---|---|
| Address | `https://yourblog.com` |
| Blog URL pattern | `/blog/{slug}` |
| Preview URL pattern | `https://yourblog.com/preview/{token}` |
| Deploy webhook | `https://yourblog.com/api/deploy` |

Then, on the same page:

1. Create a **read key**. It's shown once: put it in `NUXT_TAMABLE_READ_KEY`.
2. Copy the deploy webhook's **signing secret** into `NUXT_TAMABLE_WEBHOOK_SECRET`.

Tamable's docs cover the [read API](https://docs.tamable.app/read-api), [preview links](https://docs.tamable.app/preview-links) and the [deploy webhook](https://docs.tamable.app/deploy-webhook) in detail.

## Environment variables

Set these on your host. They're read when the site builds and when the server starts, and none of them ends up in browser code.

| Variable | What it is |
|---|---|
| `NUXT_TAMABLE_READ_KEY` | The site's read key. Keep it out of the repo |
| `NUXT_TAMABLE_WEBHOOK_SECRET` | The deploy webhook's signing secret |
| `NUXT_DEPLOY_HOOK_URL` | Your host's build hook: a URL that starts a new build when called with `POST` (Forge, Netlify, Vercel, Cloudflare Pages...) |
| `NUXT_PUBLIC_SITE_URL` | The canonical address, with no trailing slash. Falls back to `url` in `site.config.ts` |
| `NUXT_TAMABLE_API_URL` | Only if you don't use `https://api.tamable.app/api/v1` |
| `NUXT_ALLOW_EMPTY_BLOG` | `true` to allow a build with no published posts. By default the build stops instead, so a misconfigured key can't publish an empty blog |

## How publishing works

1. You publish a post in Tamable, publish changes to one, or delete one.
2. About a minute later, once you've stopped making changes, Tamable calls `/api/deploy` with a signed request.
3. The site checks the signature and the timestamp, then calls `NUXT_DEPLOY_HOOK_URL`.
4. Your host builds the site, which reads every published post from Tamable and prerenders the pages.

If the build fails, your host keeps serving the previous version. It's also worth scheduling a nightly call to the build hook, to catch anything a webhook missed.

You can point Tamable's deploy webhook straight at your host's build hook instead. That's simpler, but anyone who learns the hook's URL can trigger builds; going through `/api/deploy` means only Tamable can.

## Make it yours

- **Name, author and links:** `site.config.ts`. This is also where you turn on Ghost redirects if you're moving from Ghost.
- **Colors, fonts and sizes:** `app/assets/css/tokens.css`. Every color comes from a variable there, for light and dark. Fonts are loaded through `@nuxt/fonts` and listed in `nuxt.config.ts`.
- **Post body styles:** `app/assets/css/prose.css`. In development, `/dev/blocks` shows every block Tamable can send.
- **About page:** `app/pages/about.vue`.
- **Header links:** `app/components/SiteHeader.vue`.

## Deploying

Any host that runs Node works: build with `npm run build`, then start `.output/server/index.mjs` (or `npm start`).

On Laravel Forge with PM2, give Node the absolute path to the environment file. PM2 in cluster mode starts Node from its own working directory, so a relative `--env-file=.env` can stop working after the site's folder changes:

```json
{ "name": "blog", "cwd": "/home/forge/yourblog.com/current", "script": "./.output/server/index.mjs", "node_args": "--env-file=/home/forge/yourblog.com/.env", "instances": 2, "exec_mode": "cluster" }
```

## Development

| Command | Does |
|---|---|
| `npm run lint` | ESLint |
| `npm run typecheck` | `vue-tsc` through Nuxt |
| `npm run build` | Prerenders the site into `.output` |
| `npm start` | Serves `.output` (preview and webhook routes included) |

CI runs lint and type check, then builds against the fake Tamable, so it never needs a read key.

## License

MIT
