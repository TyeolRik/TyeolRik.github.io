# TyeolRik.github.io

Source for [https://tyeolrik.github.io](https://tyeolrik.github.io), a Jekyll blog deployed with GitHub Pages Actions.

## Requirements

- Ruby 4.0.6
- Bundler 4.0.16
- Jekyll 4.4.1 (installed through Bundler)

With Homebrew and rbenv:

```sh
brew install rbenv ruby-build
rbenv install 4.0.6
rbenv local 4.0.6
./scripts/install
```

## Local preview

```sh
./scripts/serve
```

Open <http://127.0.0.1:4000>. The production-mode preview is:

```sh
./scripts/serve-production
```

To listen on the LAN without firewall or root changes:

```sh
./scripts/serve-lan
```

## Verification

```sh
./scripts/check-source
./scripts/check-tools
JEKYLL_ENV=production bundle exec jekyll build --trace
bundle exec ruby scripts/check-site
```

Internal failures block CI and deployment. External links are audited by the weekly `External links` workflow and its report artifact; they do not block Pages.

## Authoring

```sh
./newpost "Category Post title"
./generate
```

## Deployment

Pull requests run build and integrity checks without deploying. Merges to `master` deploy the verified `_site` artifact through GitHub Actions after the initial manual Pages cutover.

## Analytics

GA4 measurement ID `G-WYMVRPT9ZB` loads only on `tyeolrik.github.io`, so local previews do not generate analytics traffic.

## License

Theme ancestry and licensing are documented in [LICENSE](LICENSE).
