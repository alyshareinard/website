# Tech-Aly website: where we are

Written 2026-10-27, after the site refresh that ran through 2026-09-21. Everything below is pushed to
`main` (latest commit `e43ba1c`) unless it says otherwise.

## Goal

Make the site feel more modern and closer to the kind of work Alysha does (apps, automations, small
games), keep it client-first, and turn the demo apps into something that nudges visitors toward hiring
for custom work.

## What is done

**Design system** (`src/routes/global.css`)
- Dark teal/black theme with orange accents, Space Grotesk headings, Inter body text. Replaces the old
  granite photo background.
- Shared building blocks: `.card`, `.btn-primary`, `.btn-secondary`, `.chip`, `.eyebrow`, `.section-head`.
- Boxes were lightened on 2026-09-21 (`--surface: #1c3237`, brighter borders, soft shadow) because they
  blended into the page. `--surface-2` is the darker inset color used inside cards (inputs, table headers).
- Sticky header and simplified footer (`Header.svelte`, `Footer.svelte`). Nav: Work, Games, About, Services,
  plus a "Get in touch" button.

**Pages**
- **Home:** single hero, tools panel, services, a "work with purpose" band (environment, LGBTQ+ rights,
  women-owned), six client projects, games and apps, demo tools, static testimonials, closing call to action.
- **Games** (`/games`, new): Keesh and Mahjong with drawn art (`GameArt.svelte`), highlights and Play buttons.
  They run on separate Railway servers, so they link out:
  `keesh-production.up.railway.app` and `mahjong-production-5d1d.up.railway.app`.
  Both are in `src/lib/data/portfolio.js`; moving to subdomains later is a one-line change each.
- **Portfolio:** shared cards, all client project text lives in `src/lib/data/portfolio.js`.
- **About:** photos keep their true proportions (fixed 2026-09-21).
- **Contact:** the `#contactForm` anchor now works, and the form accepts `?service=` and `?message=` to pre-fill.

**Demo apps** (each ends with a "Want a custom version?" call to action that pre-fills the contact form
with the visitor's steps, never their data)
- **CSV cleaner** (`/portfolio/csvUpdater`): in-browser, nothing uploaded. Phone and date cleanup, case, find
  and replace, combine and split columns, remove duplicates, before and after previews with changed cells
  highlighted, sample data, correct encoding and Excel-friendly download. Logic is in `src/lib/csv/clean.ts`.
  Says plainly that it is rule-based code, not AI.
- **Feed ranker** (`/portfolio/RSSfeed`, URL kept from the old RSS reader): ranks 15 made-up freelance posts by
  words the visitor picks. Logic is in `src/lib/rank/score.ts`, sample data in `samplePosts.ts`. The old RSS
  reader was removed because its CORS proxy (`corsproxy.io`) now returns 403.
- **Spotify mixer** (`/portfolio/spotifyPlaylistMix`): now a personal tool (noindex, no card), plus a short
  case study on the portfolio page. Logic is in `src/lib/spotify/mix.ts`.

**Security cleanup:** deleted the dead OAuth callback code that logged the Spotify client secret, and removed
all logging of tokens from the live login path.

**Shared:** `src/lib/analytics.ts` sends event names only (never user content) to Simple Analytics.

## Needs Alysha

- **Try the Spotify mixer against the real account** once deployed. It was only tested against a fake
  Spotify. Watch for an error mentioning the developer dashboard (Spotify may limit the app to approved
  accounts), and run a first mix into a test playlist.
- **Delete the extra "Today's Mix!" playlists** in Spotify (the dropdown numbers them).
- **Rotate the Spotify client secret** if the old callback route could ever have run. Nothing uses the secret
  anymore, so it can then be deleted from Vercel.
- **Check Vercel env vars:** the Spotify code accepts `SPOTIFY_CLIENT_ID` and `spotifyRedirectURL`.
- **Read the wording I wrote from the READMEs and source**, especially the Keesh description in
  `src/lib/data/portfolio.js` (player count and rules are deliberately vague), and the Spotify case study.
- **Confirm the deploy** and hard refresh (Cmd+Shift+R) if old styles show.

## Loose ends and ideas

- **Uncommitted, on purpose:** `src/routes/toc/` (Alysha's terms page for her apps) and `.claude/launch.json`
  (preview server config).
- **Unused dependencies** to remove from `package.json`: `moment` and `svelte-carousel` (neither is imported in
  `src/`). The `svelte-carousel` type stub in `src/app.d.ts` and `src/lib/types/svelte-carousel.d.ts` can go too.
- **Unused file:** `src/lib/images/background.jpg` is no longer referenced.
- **Production build:** `npm run build` fails locally because the Vercel adapter rejects Node v24 (it wants 18,
  20 or 22). Not caused by the site changes, but a local build has not been confirmed. Vercel builds are the
  real check.
- **Footer has no privacy link**, because `/privacy` without `?name=` shows the Balzac Cocoa Rater policy. A
  site-wide policy would need its own page.
- **Contact form:** an optional "my business is..." field (environment, LGBTQ+, women-owned) was left out
  because it needs a new Airtable column.
- **Games on their own domains:** DNS can't map paths, so `tech-aly.com/keesh` isn't possible with DNS alone.
  Subdomains (`keesh.tech-aly.com`, `mahjong.tech-aly.com`) need one CNAME each plus a custom domain in Railway.
- **Rename `/portfolio/RSSfeed`** (for example `/portfolio/feedRanker`) with a redirect, since it is no longer an
  RSS reader.
- **More demos in the CSV and ranker style** could follow if wanted.

## Bigger idea, parked

Live feeds for the ranker, framed as "break the algorithm" and aimed at the news and open web rather than
social platforms. The plan, endpoint safeguards and open questions are in
[feed-ranker-live-feeds.md](feed-ranker-live-feeds.md).

## Where things live

| What | Where |
| --- | --- |
| Colors, shared components | `src/routes/global.css` |
| Project, game, app and demo data | `src/lib/data/portfolio.js` |
| CSV cleanup logic | `src/lib/csv/clean.ts` |
| Ranking logic and sample posts | `src/lib/rank/` |
| Spotify mixing logic | `src/lib/spotify/mix.ts` |
| Spotify sign-in | `src/routes/portfolio/spotifyPlaylistMix/spotifyAuth.server.ts` |
| Game art | `src/lib/components/GameArt.svelte` |

## Testing note

The pure logic modules (CSV, ranking, Spotify) were tested with throwaway scripts that are not in the repo.
`npm run check` (svelte-check) was clean at the last commit. If we want these tests to last, adding a small
test setup (for example Vitest) would be a good next step.
