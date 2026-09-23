# Hampden Park Tennis Club website

Static site for <https://hampdenparktennis.co.uk>, built by Jekyll and hosted free on GitHub Pages. GitHub also provides the HTTPS certificate and renews it automatically.

Membership and court booking are handled by ClubSpark. This site only links to it.

**Volunteers updating content: see [EDITING.md](EDITING.md).**

## Where things are

| Path | What it is |
| --- | --- |
| `index.md`, `sessions.md`, `events.md`, ... | One file per page: front matter plus Markdown text |
| `_notices/` | "What's On" cards on the home page, one file each |
| `_coaches/` | Coach profiles, one file each |
| `_data/club.yml` | Address, emails, ClubSpark and calendar links |
| `_data/membership.yml` | Membership fees |
| `_data/navigation.yml` | Menu items |
| `_layouts/`, `_includes/` | HTML templates |
| `assets/css/style.css` | All styling (one file, no framework) |
| `.pages.yml` | Pages CMS editor config: what volunteers can edit |
| `_config.yml` | Site settings, plus which blocks each page shows (`extras`) |

Page structure (layout, permalinks, extra blocks such as the fees table) is set in `_config.yml` defaults rather than in each page, so the web editor can't remove it.

## Run locally

```
bundle install
bundle exec jekyll serve --livereload
```

Then open <http://localhost:4000>.

## Giving someone edit access

1. Add their GitHub account as a collaborator on the `hptennis/hptennis-website` repository with **Write** access.
2. Send them [EDITING.md](EDITING.md).

## Custom domain / HTTPS

DNS: apex `A` records point to GitHub Pages (185.199.108-111.153) and `www` is a `CNAME` to `hptennis.github.io`. In the repository's Settings → Pages, the custom domain is `hampdenparktennis.co.uk` and **Enforce HTTPS** is ticked. If the certificate ever fails to renew, remove and re-add the custom domain there.
