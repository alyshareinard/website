# Feed ranker: adding live feeds ("build your own algorithm")

Saved 2026-09-21 to pick up later. Nothing here is built yet.

## Where things stand

- The demo at `/portfolio/RSSfeed` (the URL is left over from the old RSS reader) is now a **Feed ranker**.
  It ranks 15 made-up freelance posts using words the visitor picks, shows how far each post moved, and ends
  with a "Want this watching your real sources?" call to action that pre-fills the contact form.
- Code: `src/lib/rank/score.ts` (scoring, tested), `src/lib/rank/samplePosts.ts` (sample data),
  `src/routes/portfolio/RSSfeed/+page.svelte` (UI).
- Why it changed: the old version fetched feeds through `corsproxy.io`, which now returns 403 for every request
  ("Anonymous legacy proxy URLs are no longer supported"), and Upwork dropped its RSS feeds.
- "Option 2" = replace the sample posts with live feeds the visitor chooses. This document is the plan for that.

## How live feeds would work

Browsers can't fetch most feeds directly (cross-origin blocking), so this needs a small server endpoint on our own
Vercel site, roughly `GET /api/feed?url=...`.

1. Visitor pastes a feed URL, or picks a starter feed with one click.
2. The endpoint fetches it server-side, parses RSS or Atom (for example with `fast-xml-parser`), and returns clean
   items: `title`, `link`, `date`, `source`, and a text-only summary. Never raw HTML or the raw feed.
3. The existing `score.ts` runs in the browser on those items, unchanged. `Post` needs a `url` field, and `daysAgo`
   is computed from the item date.
4. Feeds and words are saved in the visitor's browser (localStorage). No accounts.

New UI needed: a feed list (add, remove, refresh), starter-feed buttons, a loading/error state per feed, and
sensible caps on how many items are shown.

### The endpoint must be locked down

It is an open door on our server otherwise:

- Only `http` and `https`; refuse private, loopback and link-local addresses, checked after DNS resolution and
  after every redirect (SSRF protection). Limit redirects.
- Size cap (about 1-2 MB), short timeout (about 5 s), a limit on feeds per request and items per feed.
- Strip HTML from everything returned. The old code injected feed text with `{@html}`; don't repeat that.
- Cache responses for 5-15 minutes (`s-maxage`) and rate limit, so nobody can hammer a third-party site through us.
- The page should say that feed URLs pass through our server and appear in server logs.

Cost is close to nothing to run. Ongoing upkeep is small but real: feeds move, sites block server traffic, so keep
it labelled as a demo. Rough build estimate: one focused session.

## Starter feeds (verify each before shipping)

Likely fine: Hacker News front page (`news.ycombinator.com/rss`), Google News search feeds
(`news.google.com/rss/search?q=...`), blogs and Substack, YouTube channel feeds
(`youtube.com/feeds/videos.xml?channel_id=...`), Mastodon profiles (`.rss`), Bluesky profiles (`/rss`),
GitHub releases (`/releases.atom`), podcasts.

Uncertain: Reddit (`/r/<name>/.rss`). It tends to block or rate limit server IPs, so test from Vercel before
promising it.

No feeds at all (mostly): Instagram, TikTok, X, Facebook, LinkedIn.

## The pitch: "break the algorithm"

Strong hook, because the tool has what platform algorithms lack: rules you wrote, and a visible "why this ranked
here" (the score chips already show that).

Two things to be careful about:

1. **Don't promise "your own algorithm for social media."** The big platforms people are angriest about don't
   publish feeds. Honest version: "your own algorithm for the news and the open web."
2. **It's a simple algorithm.** Keyword scoring doesn't understand synonyms or context and doesn't learn. That is
   a selling point (predictable, transparent, fits the "code, not AI" line), but say it plainly. Ideas that would
   make it feel more like a real algorithm: per-source weights, "must contain" filters, removing duplicates across
   sources, tunable recency decay.

### Two audiences, two framings

- **Free tool, aimed at individuals:** "Build your own algorithm." Shareable, good for attention.
- **Paid work, aimed at businesses:** the same engine watching what matters to them (competitor and industry news,
  leads, mentions, tenders) and sending only the best items to email, Slack or a spreadsheet.

The current call to action on the demo page already leans toward the business framing.

## Open questions for when we pick this up

- Go with the two-audience framing above, or focus on one?
- Which starter feeds are worth including (and does Reddit work from Vercel)?
- Do we want any of the "more like an algorithm" controls in the first version, or ship the basics first?
- Should `/portfolio/RSSfeed` be renamed (for example `/portfolio/feedRanker`) with a redirect?
