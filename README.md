# KOHWEIREN-site

Personal portfolio — plain HTML/CSS with a little vanilla JS. No frameworks, no build step.

## Structure

```
public/   ← all site files (HTML, CSS, JS, assets)
```

## Development

Open `public/index.html` directly in a browser — no local server needed.

## Deploy

1. Go to **Settings → Pages** in this repo.
2. Under *Build and deployment*, set Source to **GitHub Actions**.
3. Push to `main` — the workflow in `.github/workflows/deploy.yml` publishes `public/` automatically.

The live URL will be `https://stephenkwr.github.io/KOHWEIREN-site/`.
