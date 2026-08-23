# kimetsu.dev

The source for [kimetsu.dev](https://kimetsu.dev): Kimetsu documentation, a
directory of projects, and a read-only discovery gateway for internet agents.

## Local development

```bash
npm ci
npm run dev
```

Run the full release check with `npm run check`. The static site is emitted to
`out/` and deployed to GitHub Pages. A separate Cloudflare static-assets config
is kept as an opt-in migration path; production automation only uses it when
`CLOUDFLARE_SITE_DEPLOY_ENABLED` is explicitly set.

The agent gateway is intentionally a separate Worker and hostname. Deploy it
with `npm run deploy:gateway`. It accepts no credentials or writes and proxies
only the public upstreams hard-coded in `worker/index.mjs`. The same Worker
publishes a Sidequest A2A Agent Card and deterministic guidance endpoint; caller
text is never executed, fetched, logged, or forwarded.

## Repository boundary

This repository owns the website and its published documentation. The Kimetsu
runtime lives in [RodCor/kimetsu](https://github.com/RodCor/kimetsu), while the
community project system lives in
[RodCor/sidequest-commons](https://github.com/RodCor/sidequest-commons).

Dual-licensed under [MIT](LICENSE-MIT) or [Apache-2.0](LICENSE-APACHE).
