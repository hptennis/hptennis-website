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

## Payment pages

Each file in `store/` is a payment page at `/store/<name>/`, for example `store/wedslights.md` is `/store/wedslights/`. The page sets `title`, `price` (e.g. `"2.00"`) and `code`, a short prefix for the payment reference. The form asks for a date and name and records the request in a Google Sheet via a Google Apps Script ([scripts/payments-sheet.gs](scripts/payments-sheet.gs)). Then:

- **Card (SumUp):** the script creates a SumUp checkout carrying the payer's name and a reference such as `WL2511-JANESMITH-1a2b3c4d`, and the page sends the payer to SumUp's payment page. When SumUp reports the payment, the script marks the row **Paid £2.00**. If a checkout can't be created, the page falls back to the plain SumUp payment link.
- **Bank transfer:** the page shows the bank details and a reference such as `WL2511 JANESMITH`. Tick these off against bank statements.

The SumUp payment link, bank details and the script link are set in `_data/store.yml`, which is also editable in Pages CMS. A payment method only shows once its details are filled in.

**Prices are also set in the script.** The amount charged and recorded comes from the `ITEMS` list at the top of the script, not the web page, so a payer can't change it. When you add a payment page, add its `code` and price there too. The script rejects codes it doesn't know.

### Setting up the Google Sheet and SumUp (once)

1. Create a Google Sheet for payment requests.
2. In the sheet, choose **Extensions → Apps Script**, replace the code with [scripts/payments-sheet.gs](scripts/payments-sheet.gs), and save.
3. Create a SumUp secret API key: **me.sumup.com → Settings → For Developers → Toolkit → API Keys**.
4. In Apps Script, open **Project Settings** (gear icon) → **Script properties** and add `SUMUP_API_KEY` with that key. Never put the key in the website files.
5. Find your merchant code: in the Apps Script editor, choose `findMerchantCode` from the function list, click **Run**, allow the permissions, and read the code from the log. Add it as the script property `SUMUP_MERCHANT_CODE`.
6. Choose **Deploy → New deployment**, select type **Web app**, set *Execute as* to **Me** and *Who has access* to **Anyone**, then click **Deploy**.
7. Copy the **Web app URL** (ends in `/exec`). Add it as the script property `WEB_APP_URL` so SumUp can report payments, and put it in `sheet_script_url` in `_data/store.yml`.
8. Optional safety net: in Apps Script, **Triggers → Add trigger** → `checkPendingPayments`, time-driven, hourly. This re-checks any card payment SumUp hasn't reported.

Requests appear in a "Payment requests" tab. The **Status** column shows *Awaiting bank transfer*, *Awaiting card payment*, *Paid £2.00*, *Card payment failed*, *Expired (not paid)* or *SumUp error: …*. SumUp payment pages expire after 30 minutes.

If the script code changes later, use **Deploy → Manage deployments → Edit → Version: New version → Deploy** so the URL stays the same.

## Custom domain / HTTPS

DNS: apex `A` records point to GitHub Pages (185.199.108-111.153) and `www` is a `CNAME` to `hptennis.github.io`. In the repository's Settings → Pages, the custom domain is `hampdenparktennis.co.uk` and **Enforce HTTPS** is ticked. If the certificate ever fails to renew, remove and re-add the custom domain there.
