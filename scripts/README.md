# Scripts

- `./scripts/install` — verify Ruby 4.0.6, install Bundler 4.0.16 if needed, and install Jekyll 4.4.1 with `bundle install`.
- `./scripts/serve` — development preview with LiveReload on `127.0.0.1:4000`.
- `./scripts/serve-production` — production-mode preview on `127.0.0.1:4000`.
- `./scripts/serve-lan` — development preview on `0.0.0.0:4000`; it does not modify the firewall.
- `./scripts/check-source` — verify pins, source markup, removals, and tracked-artifact rules.
- `./scripts/check-tools` — test `newpost` and `generate` in a temporary site.
- `bundle exec ruby scripts/check-site` — verify a previously generated `_site` with html-proofer and required-output checks.

Post and taxonomy commands remain at the repository root:

- `./newpost "Category Post title"`
- `./generate`
