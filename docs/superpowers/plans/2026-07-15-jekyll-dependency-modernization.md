# Jekyll Dependency Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the complete `TyeolRik.github.io` Jekyll site to the approved current Ruby, Gem, browser, analytics, validation, and GitHub Pages stack without changing published content or established URLs.

**Architecture:** Keep the repository as a server-rendered Jekyll site with Bundler as its only Ruby dependency manager and exact-version CDN assets for the small browser layer. Validate the same production `_site` contract locally and in GitHub Actions, then cut Pages over from the legacy branch builder to a checked artifact only after local and remote checks pass.

**Tech Stack:** Ruby 4.0.6, Bundler 4.0.16, Jekyll 4.4.1, jekyll-paginate-v2 3.0.0, html-proofer 5.2.1, Rouge 4.7.0, Bootstrap 5.3.8, MathJax 4.1.3, Typed.js 3.0.0, Font Awesome Free 7.3.0, GA4, GitHub Actions, GitHub Pages.

## Global Constraints

- Pin Ruby to `4.0.6`, Bundler to `4.0.16`, Jekyll to `4.4.1`, html-proofer to `5.2.1`, and jekyll-paginate-v2 to `3.0.0` in source and lock files.
- Keep Rouge as an indirect dependency at Jekyll's newest compatible release, `4.7.0`; do not add it as a direct Gem.
- Pin Bootstrap to `5.3.8`, MathJax to `4.1.3`, Typed.js to `3.0.0`, and Font Awesome Free to `7.3.0` with HTTPS, exact URLs, SRI, and `crossorigin="anonymous"` where the CDN file is stable.
- Do not add Node, npm, a browser bundler, a theme Gem, or another package manager.
- Preserve all post content and the existing post, tag, category, `/blog/`, `/blog/page2/`, feed, sitemap, 404, and wedding URL shapes.
- Preserve the site's colors, background, section order, content width, desktop appearance, and mobile usability; this is modernization, not redesign.
- Do not change `wedding/` copy, date, account data, gallery, map, or interaction behavior; only add the shared GA4 loader and regression checks.
- Delete `ComputerGraphics/` completely. Do not add a redirect or replacement for `/ComputerGraphics/project3.html`.
- Remove jQuery, jQuery Easing, Hammer.js, Highlight.js, RRSSB, Google+, Universal Analytics, IE8 shims, and protocol-relative asset URLs.
- Load GA4 measurement ID `G-WYMVRPT9ZB` immediately only when `location.hostname === "tyeolrik.github.io"`; local previews must not send events.
- External-link failures are weekly, nonblocking reports with an artifact and no automatic GitHub Issue. Internal-link, asset, HTML, source-contract, and build failures block deployment.
- Do not change the GitHub Pages `legacy` setting until local development and production serves, browser checks, and the no-deploy CI workflow are green.
- If Ruby 4.0.6 exposes an irreducible upstream incompatibility after dependency and removed-stdlib diagnosis, stop and report evidence; do not silently lower Ruby.
- Work on `codex/jekyll-modernization` (or the isolated worktree branch created by the execution skill), use the commit boundaries below, and preserve unrelated user changes.

---

## File Structure

### Runtime and build contract

- Create `.ruby-version`: the one source of truth for the local and Actions Ruby interpreter.
- Modify `Gemfile`: only direct runtime and test Gems, all exact versions.
- Regenerate `Gemfile.lock`: all compatible transitive versions, Ruby 4.0.6, Bundler 4.0.16, and Linux/macOS platforms.
- Modify `_config.yml`: current plugin, pagination, analytics, sharing, icon, and Jekyll settings.
- Modify `blog/index.html`: opt the archive template into jekyll-paginate-v2.
- Create `scripts/check-source`: source, dependency, action-pin, and removal contract.
- Create `scripts/check-site`: html-proofer plus required-output and generated-markup contract.
- Create `scripts/check-tools`: isolated smoke tests for `newpost` and `generate`.

### Browser presentation and behavior

- Modify `_includes/head.html`: Bootstrap 5, Font Awesome 7, HTTPS fonts, MathJax, analytics, and custom styles.
- Modify `_includes/navigation.html`: Bootstrap 5 navbar markup and accessibility attributes.
- Modify `_layouts/index.html`, `_layouts/post.html`, `_layouts/blog.html`, `_layouts/category.html`, `_layouts/tag.html`, `_layouts/error.html`: Bootstrap 5 data/grid/responsive class migration.
- Modify `_includes/header.html`, `_includes/latest-post.html`, `_includes/about.html`, `_includes/timeline.html`, `_includes/contact.html`: Bootstrap 5 grid/image classes.
- Modify `_includes/social-buttons.html`, `_includes/footer.html`, `_includes/share.html`: Font Awesome 7 icons, accessible labels, and native share UI.
- Replace `_includes/js.html`: Bootstrap bundle, Typed constructor, native site behavior, and HTTPS Disqus loaders.
- Replace `_includes/mathjax-support.html`: MathJax 4 configuration and pinned loader.
- Create `js/site.js`: native scroll, navbar-collapse, and share-popup behavior.
- Create `js/analytics.js`: reusable production-host-only GA4 loader for Jekyll pages and wedding.
- Create `_sass/_syntax.scss`: local Rouge token colors.
- Modify `css/grayscale.scss`: Bootstrap 5 selectors, Rouge import, share layout, and removal of gesture styles.
- Modify `wedding/index.html`: one shared analytics script reference; no other wedding changes.

### Local authoring and cleanup

- Modify `scripts/install`, `scripts/serve`, `scripts/serve-production`, `scripts/serve-lan`: strict shells and Bundler-scoped commands.
- Modify `newpost`: validated, repository-relative, testable post creation.
- Modify `generate`: safe, deterministic, repository-relative tag/category generation.
- Delete `scripts/newpost`, `scripts/newpostForMac`, `scripts/generate-tags`, `scripts/generate-categories`, `newpost_deprecated`, `scripts/serve-lan-production`, and `scripts/integrate-personal`.
- Delete `_includes/swipe-instructions.html`, `_includes/syntax-highlight.html`, `css/rrssb.css`, `js/hammer.min.js`, `js/hammer.min.map`, `js/rrssb.min.js`, and `js/typed.min.js`.
- Delete the complete `ComputerGraphics/` tree.
- Delete `.travis.yml` only after local replacement checks exist.
- Modify `.gitignore`, `README.md`, and `scripts/README.md` to match the supported workflow.

### Automation and deployment

- Create `.github/workflows/ci.yml`: blocking build and internal integrity checks, no deployment.
- Create `.github/workflows/external-links.yml`: weekly/manual, nonblocking external-link report artifact.
- Create `.github/workflows/pages.yml`: first manual-only, then a later commit adds the `master` push trigger.

---

### Task 1: Capture the Public Baseline and Pin the Ruby/Gem Graph

**Files:**
- Create: `.ruby-version`
- Create: `scripts/check-source`
- Modify: `Gemfile`
- Modify: `Gemfile.lock`

**Interfaces:**
- Consumes: the approved version table and the existing public site at `https://tyeolrik.github.io`.
- Produces: Ruby `4.0.6`, Bundler `4.0.16`, an exact Gem graph, and executable `scripts/check-source` returning exit 0 only when the runtime contract matches.

- [ ] **Step 1: Start the implementation branch and record clean state**

Run:

```bash
git status --short --branch
git switch -c codex/jekyll-modernization
git status --short --branch
```

Expected: the first command shows no uncommitted files; the last command starts with `## codex/jekyll-modernization`.

- [ ] **Step 2: Record live URL status and visual baselines before changing code**

Run:

```bash
for path in / /blog/ /blog/page2/ /jekyll/2021/04/27/jekyll-2-contemplation-of-using-mathjax-in-github-flavored-markdown.html /tags/mathjax.html /categories/jekyll.html /feed.xml /sitemap.xml /404.html /wedding/ /ComputerGraphics/project3.html; do
  curl -sS -o /dev/null -w "%{http_code} %{url_effective}\n" "https://tyeolrik.github.io${path}"
done
```

Expected: every listed URL, including the not-yet-removed ComputerGraphics page, returns `200`.

Use the in-app browser to capture `/`, `/blog/`, the MathJax post above, and `/wedding/` at 1440×900 and 390×844. Save these temporary references under `/tmp/tyeolrik-baseline/`; do not commit them.

- [ ] **Step 3: Install an exact local Ruby without replacing macOS system Ruby**

Run:

```bash
brew install rbenv ruby-build
rbenv install --skip-existing 4.0.6
eval "$(rbenv init - zsh)"
rbenv shell 4.0.6
ruby --version
gem install bundler -v 4.0.16 --no-document
bundle --version
```

Expected: `ruby 4.0.6` and `Bundler version 4.0.16`. If Ruby compilation or a native extension fails, preserve the full command output and diagnose it before continuing.

- [ ] **Step 4: Write the failing runtime contract**

Create `scripts/check-source` with:

```ruby
#!/usr/bin/env ruby
# frozen_string_literal: true

ROOT = File.expand_path("..", __dir__)

def read(relative_path)
  File.read(File.join(ROOT, relative_path), encoding: "UTF-8")
end

def assert!(condition, message)
  abort "FAIL: #{message}" unless condition
  puts "PASS: #{message}"
end

expected_ruby = "4.0.6"
expected_bundler = "4.0.16"
gemfile = read("Gemfile")
lockfile = read("Gemfile.lock")

assert!(File.exist?(File.join(ROOT, ".ruby-version")), ".ruby-version exists")
assert!(read(".ruby-version").strip == expected_ruby, "Ruby pin is #{expected_ruby}")
assert!(RUBY_VERSION == expected_ruby, "current Ruby is #{expected_ruby}")
assert!(gemfile.include?('ruby "4.0.6"'), "Gemfile Ruby matches")
assert!(gemfile.include?('gem "jekyll", "4.4.1"'), "Jekyll is exact")
assert!(gemfile.include?('gem "jekyll-paginate-v2", "3.0.0"'), "pagination Gem is exact")
assert!(gemfile.include?('gem "html-proofer", "5.2.1"'), "html-proofer is exact")
assert!(lockfile.include?("jekyll (4.4.1)"), "lockfile contains Jekyll 4.4.1")
assert!(lockfile.include?("jekyll-paginate-v2 (3.0.0)"), "lockfile contains pagination 3.0.0")
assert!(lockfile.include?("html-proofer (5.2.1)"), "lockfile contains html-proofer 5.2.1")
assert!(lockfile.include?("rouge (4.7.0)"), "lockfile contains compatible Rouge 4.7.0")
assert!(lockfile.match?(/RUBY VERSION\n   ruby 4\.0\.6(?:p\d+)?/), "lockfile Ruby is 4.0.6")
assert!(lockfile.include?("BUNDLED WITH\n   #{expected_bundler}"), "lockfile Bundler is #{expected_bundler}")
```

Run:

```bash
chmod +x scripts/check-source
./scripts/check-source
```

Expected: FAIL at `.ruby-version exists`.

- [ ] **Step 5: Add the runtime pin and minimal exact Gemfile**

Create `.ruby-version` with exactly:

```text
4.0.6
```

Replace `Gemfile` with:

```ruby
source "https://rubygems.org"

ruby "4.0.6"

gem "jekyll", "4.4.1"
gem "jekyll-paginate-v2", "3.0.0"

group :test do
  gem "html-proofer", "5.2.1"
end
```

- [ ] **Step 6: Resolve all transitive Gems under Ruby 4 and Bundler 4**

Run:

```bash
eval "$(rbenv init - zsh)"
rbenv shell 4.0.6
bundle _4.0.16_ update
bundle _4.0.16_ lock --add-platform arm64-darwin x86_64-darwin x86_64-linux-gnu aarch64-linux-gnu
bundle _4.0.16_ check
bundle exec jekyll --version
bundle exec htmlproofer --version
```

Expected: dependency resolution succeeds; Jekyll reports `4.4.1`; html-proofer reports `5.2.1`; `Gemfile.lock` records Ruby 4.0.6, Bundler 4.0.16, and Rouge 4.7.0. Do not continue on a Ruby 4 compatibility failure.

- [ ] **Step 7: Run the runtime contract and inspect the direct dependency surface**

Run:

```bash
./scripts/check-source
bundle list | rg 'jekyll \(4\.4\.1\)|jekyll-paginate-v2 \(3\.0\.0\)|html-proofer \(5\.2\.1\)|rouge \(4\.7\.0\)'
rg -n 'minima|jemoji|wdm|jekyll-feed|jekyll-paginate \(|^  rouge$|^  webrick' Gemfile Gemfile.lock
```

Expected: every contract line is `PASS`; the four expected versions are listed; the final `rg` returns exit 1 with no direct removed dependency.

- [ ] **Step 8: Commit the runtime graph**

```bash
git add .ruby-version Gemfile Gemfile.lock scripts/check-source
git commit -m "build: pin modern Jekyll toolchain"
```

Expected: one commit with only the four runtime-contract files.

---

### Task 2: Migrate Pagination and Establish the Production Build Contract

**Files:**
- Modify: `_config.yml`
- Modify: `blog/index.html`

**Interfaces:**
- Consumes: `bundle exec jekyll` from Task 1 and the existing `paginator.posts`, `previous_page_path`, and `next_page_path` Liquid interface.
- Produces: `/blog/index.html` plus `/blog/page2/index.html`, five posts per page, newest-first ordering, and no legacy pagination configuration.

- [ ] **Step 1: Add the failing pagination assertions to `scripts/check-source`**

Append before the end of `scripts/check-source`:

```ruby
config = read("_config.yml")
blog_index = read("blog/index.html")
assert!(config.include?("- jekyll-paginate-v2"), "Jekyll loads jekyll-paginate-v2")
assert!(config.include?("per_page: 5"), "pagination keeps five posts per page")
assert!(config.include?('permalink: "/page:num/"'), "pagination keeps /blog/page2/ shape")
assert!(!config.match?(/^paginate:/), "legacy paginate key is absent")
assert!(!config.match?(/^paginate_path:/), "legacy paginate_path is absent")
assert!(blog_index.include?("pagination:\n  enabled: true"), "blog opts into pagination v2")
```

Run: `./scripts/check-source`

Expected: FAIL at `Jekyll loads jekyll-paginate-v2`.

- [ ] **Step 2: Replace the legacy pagination and plugin blocks**

Remove the top-level `paginate: 5`, `paginate_path`, `gems`, legacy `plugins`, and `environment` keys from `_config.yml`. Add this single plugin and pagination configuration near the Blog settings:

```yaml
plugins:
  - jekyll-paginate-v2

pagination:
  enabled: true
  per_page: 5
  permalink: "/page:num/"
  title: ":title - page :num"
  sort_field: "date"
  sort_reverse: true
```

Keep `highlighter: rouge` and the kramdown block. Also correct the malformed 404 key from `+err-404-img` to:

```yaml
err-404-img: "/img/tyeolrik_transparent.png"
```

- [ ] **Step 3: Opt the blog page into the v2 generator**

Change `blog/index.html` front matter to exactly:

```yaml
---
layout: blog
section-type: blog
title: Blog
pagination:
  enabled: true
sitemap:
  priority: 1.0
---
```

Keep the existing `## Blog` body after the closing delimiter.

- [ ] **Step 4: Verify the production build and public pagination path**

Run:

```bash
./scripts/check-source
bundle exec jekyll clean
JEKYLL_ENV=production bundle exec jekyll build --trace
test -f _site/blog/index.html
test -f _site/blog/page2/index.html
rg -n 'href="/blog/page2/"|href="/blog/page2/index.html"' _site/blog/index.html
rg -n 'href="/blog/"|href="/blog/index.html"' _site/blog/page2/index.html
```

Expected: source checks pass, Jekyll exits 0, both files exist, page 1 links to page 2, and page 2 links back to `/blog/`.

- [ ] **Step 5: Commit the pagination migration**

```bash
git add _config.yml blog/index.html scripts/check-source
git commit -m "build: migrate blog pagination to v2"
```

---

### Task 3: Modernize Local Authoring Commands and Remove Obsolete Content

**Files:**
- Create: `scripts/check-tools`
- Modify: `scripts/install`
- Modify: `scripts/serve`
- Modify: `scripts/serve-production`
- Modify: `scripts/serve-lan`
- Modify: `newpost`
- Modify: `generate`
- Delete: `scripts/newpost`
- Delete: `scripts/newpostForMac`
- Delete: `scripts/generate-tags`
- Delete: `scripts/generate-categories`
- Delete: `newpost_deprecated`
- Delete: `scripts/serve-lan-production`
- Delete: `scripts/integrate-personal`
- Delete: `ComputerGraphics/` (entire tree)

**Interfaces:**
- Consumes: `.ruby-version`, the locked Bundler, `_posts` YAML front matter, and optional `JEKYLL_SITE_ROOT` for isolated tests.
- Produces: `./scripts/install`, three Bundler-scoped serve commands, `./newpost "Category Title"`, `./generate`, and `./scripts/check-tools` with exit 0 on both tool smoke tests.

- [ ] **Step 1: Write isolated failing smoke tests for the two Ruby tools**

Create `scripts/check-tools` with:

```ruby
#!/usr/bin/env ruby
# frozen_string_literal: true

require "fileutils"
require "open3"
require "tmpdir"
require "yaml"

ROOT = File.expand_path("..", __dir__)

def run_tool(root, name, *arguments)
  Open3.capture3({ "JEKYLL_SITE_ROOT" => root }, File.join(ROOT, name), *arguments)
end

Dir.mktmpdir("jekyll-tools") do |site_root|
  %w[_posts tags categories].each { |directory| FileUtils.mkdir_p(File.join(site_root, directory)) }
  File.write(
    File.join(site_root, "_posts", "2026-01-01-ruby-1-existing.md"),
    "---\nlayout: post\ntitle: Existing\ncategory: Ruby\ntags:\n  - Jekyll\n---\n"
  )

  stdout, stderr, status = run_tool(site_root, "generate")
  abort stderr unless status.success?
  abort "tag page missing" unless File.exist?(File.join(site_root, "tags", "jekyll.html"))
  abort "category page missing" unless File.exist?(File.join(site_root, "categories", "ruby.html"))
  abort "generate output missing" unless stdout.include?("Generating #jekyll page")

  _stdout, stderr, status = run_tool(site_root, "newpost", "Ruby New Post")
  abort stderr unless status.success?
  created = Dir.glob(File.join(site_root, "_posts", "*-ruby-2-new-post.md"))
  abort "new post filename mismatch" unless created.length == 1
  front_matter = YAML.safe_load(File.read(created.first).split("---", 3)[1])
  abort "new post title mismatch" unless front_matter["title"] == "[Ruby] New Post"
  abort "new post category mismatch" unless front_matter["category"] == "Ruby"
end

puts "PASS: authoring tools"
```

Run:

```bash
chmod +x scripts/check-tools
./scripts/check-tools
```

Expected: FAIL because the existing tools ignore `JEKYLL_SITE_ROOT` or produce a different result.

- [ ] **Step 2: Replace the install and serve scripts with strict Bundler-scoped versions**

Replace `scripts/install` with:

```bash
#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
required_ruby="$(tr -d '[:space:]' < "$root/.ruby-version")"
actual_ruby="$(ruby -e 'print RUBY_VERSION')"

if [[ "$actual_ruby" != "$required_ruby" ]]; then
  printf 'Ruby %s is required; current Ruby is %s. Run: rbenv install %s && rbenv local %s\n' \
    "$required_ruby" "$actual_ruby" "$required_ruby" "$required_ruby" >&2
  exit 1
fi

if ! gem list -i bundler -v 4.0.16 >/dev/null; then
  gem install bundler -v 4.0.16 --no-document
fi

cd "$root"
bundle _4.0.16_ install
```

Replace `scripts/serve` with:

```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
exec bundle exec jekyll serve --livereload --host 127.0.0.1 --baseurl ""
```

Replace `scripts/serve-production` with:

```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
export JEKYLL_ENV=production
exec bundle exec jekyll serve --host 127.0.0.1 --baseurl "" --trace
```

Replace `scripts/serve-lan` with:

```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
exec bundle exec jekyll serve --livereload --host 0.0.0.0 --baseurl ""
```

Run: `chmod +x scripts/install scripts/serve scripts/serve-production scripts/serve-lan`

- [ ] **Step 3: Replace `newpost` with a validated repository-relative implementation**

Replace `newpost` with:

```ruby
#!/usr/bin/env ruby
# frozen_string_literal: true

require "pathname"
require "yaml"

root = Pathname(ENV.fetch("JEKYLL_SITE_ROOT", __dir__)).expand_path
posts_dir = root.join("_posts")
input = ARGV.join(" ").strip
abort 'Usage: ./newpost "Category Post title"' if input.empty?

category, title = input.split(/\s+/, 2)
abort 'Usage: ./newpost "Category Post title"' if title.nil? || title.strip.empty?

title = title.strip
slug = title.downcase.gsub(/[^[:alnum:]]+/, "-").gsub(/\A-|-\z/, "")
abort "Post title does not produce a filename" if slug.empty?

posts_dir.mkpath
category_pattern = Regexp.new("\\A\\d{4}-\\d{2}-\\d{2}-#{Regexp.escape(category.downcase)}-\\d+-")
sequence = posts_dir.children.count { |path| path.basename.to_s.downcase.match?(category_pattern) } + 1
display_title = category.casecmp("journal").zero? ? "[논문리뷰] #{title}" : "[#{category}] #{title}"
filename = "#{Time.now.strftime('%Y-%m-%d')}-#{category.downcase}-#{sequence}-#{slug}.md"
path = posts_dir.join(filename)

front_matter = {
  "layout" => "post",
  "title" => display_title,
  "section-type" => "post",
  "category" => category,
  "tags" => %w[tag1 tag2]
}

body = +YAML.dump(front_matter)
body << "---\n"
if category.casecmp("journal").zero?
  body << <<~MARKDOWN

    ## Author

    <p style="text-align: center;">Mark Zuckerberg, Bill Gates, Larry Page, Steve Wozniak, Elon Musk</p>

    <p style="text-align: center;">in <i>Some Laboratory or University</i></p>
    <br><br>
    Original Link: [Where did I find](https://web.stanford.edu/~ouster/cgi-bin/papers/ramcloud.pdf)<br>
    Archived Link: [Download in Google Drive](https://drive.google.com/file/d/14W9_7I734yKBpeVaPptRjw0lJ0DdhtXl/view?usp=sharing)

    ## 필자요약

    ## Introduction

    <br>
    <br>
    <br>
    <hr/>
  MARKDOWN
end

File.open(path, File::WRONLY | File::CREAT | File::EXCL) { |file| file.write(body) }
puts path.relative_path_from(root)
```

- [ ] **Step 4: Replace `generate` with safe deterministic front-matter processing**

Replace `generate` with:

```ruby
#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "pathname"
require "set"
require "yaml"

root = Pathname(ENV.fetch("JEKYLL_SITE_ROOT", __dir__)).expand_path
posts_dir = root.join("_posts")
tags_dir = root.join("tags")
categories_dir = root.join("categories")
tags = Set.new
categories = Set.new

def front_matter(path)
  match = File.read(path, encoding: "UTF-8").match(/\A---\s*\n(.*?)\n---\s*\n/m)
  return {} unless match

  YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: true) || {}
end

def page_name(value)
  name = value.to_s.downcase
  abort "Unsafe tag/category name: #{value.inspect}" if name.empty? || name.include?("/") || %w[. ..].include?(name)
  name
end

posts_dir.glob("*.{md,markdown,html}").sort.each do |post|
  data = front_matter(post)
  Array(data["tags"]).each { |tag| tags << [page_name(tag), tag.to_s] }
  category = data["category"]
  categories << [page_name(category), category.to_s] if category
end

tags_dir.mkpath
categories_dir.mkpath

tags.sort.each do |filename, title|
  path = tags_dir.join("#{filename}.html")
  next if path.exist?
  puts "[+] Generating ##{filename} page"
  File.write(path, YAML.dump("layout" => "tag", "section-type" => "tag", "title" => title.downcase) + "---\n## Tag\n")
end

categories.sort.each do |filename, title|
  path = categories_dir.join("#{filename}.html")
  next if path.exist?
  puts "[+] Generating ##{filename} page"
  File.write(path, YAML.dump("layout" => "category", "section-type" => "category", "title" => title) + "---\n## Category\n")
end
```

Run: `chmod +x newpost generate`

- [ ] **Step 5: Delete duplicates, destructive legacy tooling, and ComputerGraphics**

Delete exactly the paths listed in this task's Files section. Use `apply_patch` for tracked text files and `rm -rf ComputerGraphics` only for the approved complete binary-heavy directory removal.

Extend `scripts/check-source` with:

```ruby
removed_paths = %w[
  ComputerGraphics
  newpost_deprecated
  scripts/newpost
  scripts/newpostForMac
  scripts/generate-tags
  scripts/generate-categories
  scripts/serve-lan-production
  scripts/integrate-personal
]
removed_paths.each do |path|
  assert!(!File.exist?(File.join(ROOT, path)), "#{path} is removed")
end
```

- [ ] **Step 6: Run authoring, syntax, and removal tests**

Run:

```bash
./scripts/check-tools
./scripts/check-source
ruby -c newpost
ruby -c generate
ruby -c scripts/check-source
ruby -c scripts/check-tools
find ComputerGraphics -print
rg -n 'ComputerGraphics|project3\.html' --glob '!docs/superpowers/**' .
```

Expected: tool and source checks pass; every Ruby syntax check says `Syntax OK`; `find` reports no directory; `rg` exits 1 with no source reference.

- [ ] **Step 7: Build after cleanup and commit**

Run:

```bash
JEKYLL_ENV=production bundle exec jekyll build --trace
test ! -e _site/ComputerGraphics
```

Expected: build exits 0 and no ComputerGraphics output exists.

```bash
git add -A
git commit -m "chore: remove obsolete site tooling and coursework"
```

---

### Task 4: Migrate Bootstrap 3 Markup and Theme CSS to Bootstrap 5

**Files:**
- Modify: `_includes/head.html`
- Modify: `_includes/navigation.html`
- Modify: `_layouts/index.html`
- Modify: `_layouts/post.html`
- Modify: `_layouts/blog.html`
- Modify: `_layouts/category.html`
- Modify: `_layouts/tag.html`
- Modify: `_layouts/error.html`
- Modify: `_includes/header.html`
- Modify: `_includes/latest-post.html`
- Modify: `_includes/about.html`
- Modify: `_includes/timeline.html`
- Modify: `_includes/contact.html`
- Modify: `css/grayscale.scss`

**Interfaces:**
- Consumes: existing Liquid variables and section IDs, Bootstrap's `Collapse` component, and the unchanged theme Sass variables.
- Produces: Bootstrap 5 navbar/grid/image markup with `#main-navigation`, `.navbar-custom`, `.page-scroll`, and every existing section ID retained for Task 5's native JavaScript.

- [ ] **Step 1: Add failing Bootstrap version and legacy-class checks**

Append to `scripts/check-source`:

```ruby
head = read("_includes/head.html")
bootstrap_sources = Dir.glob(File.join(ROOT, "{_includes,_layouts}", "**", "*.html")).sort.map { |path| File.read(path) }.join("\n")
assert!(head.include?("bootstrap@5.3.8/dist/css/bootstrap.min.css"), "Bootstrap CSS is 5.3.8")
assert!(head.include?("sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"), "Bootstrap CSS SRI is pinned")
assert!(head.include?("fontawesome-free@7.3.0/css/all.min.css"), "Font Awesome is 7.3.0")
assert!(head.include?("sha384-sTlsophtwz/I4myskS3OIJf5VvEojkXKZyBTWZm0YD/K1pN7C5wpBPLyrsbr1SU2"), "Font Awesome SRI is pinned")
%w[col-xs- col-md-offset- navbar-fixed-top img-responsive img-circle center-block data-toggle= data-target= data-spy=].each do |legacy|
  assert!(!bootstrap_sources.include?(legacy), "legacy Bootstrap token #{legacy} is absent")
end
assert!(!bootstrap_sources.include?('class="navbar-toggle"'), "legacy Bootstrap navbar-toggle class is absent")
```

Run: `./scripts/check-source`

Expected: FAIL at `Bootstrap CSS is 5.3.8`.

- [ ] **Step 2: Replace only the dependency/style portion of `_includes/head.html`**

Keep metadata, Open Graph, favicon, web-app, color-browser, and the corrected canonical content. Remove the Universal Analytics block, Bootstrap 3, Font Awesome 4, RRSSB, IE8 conditional block, and syntax-highlight include. Use this dependency block:

```html
  <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
        integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
        crossorigin="anonymous">
  <link href="{{site.baseurl}}/css/grayscale.css" rel="stylesheet">
  {% if page.section-type == "index" %}
  <link href="{{site.baseurl}}/css/timeline.css" rel="stylesheet">
  {% endif %}

  {% include mathjax-support.html %}

  <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@7.3.0/css/all.min.css"
        integrity="sha384-sTlsophtwz/I4myskS3OIJf5VvEojkXKZyBTWZm0YD/K1pN7C5wpBPLyrsbr1SU2"
        crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
```

Do not add the analytics include until Task 7; the old UA block must already be gone.

- [ ] **Step 3: Replace `_includes/navigation.html` with Bootstrap 5 navbar markup**

Use this complete file:

```html
<!-- Navigation Start -->
<nav class="navbar navbar-expand-md navbar-dark navbar-custom fixed-top" aria-label="Primary navigation">
  <div class="container">
    {% if page.section-type == "index" %}
      <a class="navbar-brand page-scroll" href="#page-top">
    {% else %}
      <a class="navbar-brand" href="{{site.baseurl}}/">
    {% endif %}
        <span>
          {% if site.black-favicon %}
            <img src="{{site.baseurl}}{{ site.black-favicon }}" alt="">
          {% endif %}
          {{ site.title }}
        </span>
      </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-navigation"
            aria-controls="main-navigation" aria-expanded="false" aria-label="Toggle navigation">
      <i class="fa-solid fa-bars" aria-hidden="true"></i>
    </button>
    <div class="collapse navbar-collapse justify-content-end" id="main-navigation">
      <ul class="navbar-nav">
        {% if page.section-type == "index" %}
          {% for p in site.pages_list %}
            <li class="nav-item"><a class="nav-link page-scroll" href="#{{ p[1] }}">{{ p[0] }}</a></li>
          {% endfor %}
        {% else %}
          {% for p in site.pages_list %}
            <li class="nav-item">
            {% if p[1] == "latest-post" %}
              {% if page.url == "/blog/index.html" | prepend: site.baseurl %}
                <a class="nav-link page-scroll" href="#page">{{ p[0] }}</a>
              {% else %}
                <a class="nav-link" href="{{site.baseurl}}/blog/">{{ p[0] }}</a>
              {% endif %}
            {% else %}
              <a class="nav-link" href="{{site.baseurl}}/#{{ p[1] }}">{{ p[0] }}</a>
            {% endif %}
            </li>
          {% endfor %}
        {% endif %}
      </ul>
    </div>
  </div>
</nav>
<!-- Navigation End -->
```

- [ ] **Step 4: Apply the exact Bootstrap class mapping to layouts and section includes**

Use `apply_patch` to make every mapping below; do not change surrounding Liquid or content:

```text
col-md-10 col-md-offset-1                 -> col-md-10 offset-md-1
col-md-10 col-md-offset-1 col-xs-10 col-xs-offset-1
                                             -> col-10 offset-1 col-md-10 offset-md-1
col-xs-4 col-sm-3 col-md-2                -> col-4 col-sm-3 col-md-2
col-xs-8 col-sm-9 col-md-10               -> col-8 col-sm-9 col-md-10
img-circle img-responsive                 -> rounded-circle img-fluid
img-responsive center-block fourofour     -> img-fluid mx-auto d-block fourofour
```

In `_layouts/index.html`, replace the body line with:

```html
  <body id="page-top" data-bs-spy="scroll" data-bs-target="#main-navigation" data-bs-offset="151" tabindex="0">
```

The mapping must cover all files listed for this task; verify no legacy token remains.

- [ ] **Step 5: Update the navbar selectors and remove Bootstrap 3-only button styles**

In `css/grayscale.scss`, apply these exact selector/declaration changes inside the existing `.navbar-custom` block:

```diff
-    .navbar-toggle {
+    .navbar-toggler {
         padding: 4px 6px;
         font-size: 16px;
         color: $navbar-color;
+        border-color: rgba($font-color, 0.3);
         &:focus,
         &:active {
             outline: none;
+            box-shadow: none;
         }
     }
@@
-    .nav {
+    .navbar-nav {
         text-align: center;
```

Retain the nested link/active rules, `.navbar-brand`, and `.top-nav-collapse` under their renamed parent. Delete the complete `.btn-default`, `.btn-default:hover`, and `.btn-default:focus` blocks because the only consumer is removed in Task 5. Add:

```scss
[id] {
  scroll-margin-top: 90px;
}
```

- [ ] **Step 6: Build and verify the Bootstrap migration**

Run:

```bash
./scripts/check-source
JEKYLL_ENV=production bundle exec jekyll build --trace
rg -n 'bootstrap@5\.3\.8|data-bs-toggle="collapse"|id="main-navigation"' _site/index.html
rg -n 'bootstrap/3|col-xs-|col-md-offset-|navbar-fixed-top|data-toggle=|data-spy=' _site
```

Expected: source/build pass; the first search finds Bootstrap 5 markup; the second search exits 1.

- [ ] **Step 7: Commit the Bootstrap migration**

```bash
git add _includes/head.html _includes/navigation.html _layouts _includes/header.html _includes/latest-post.html _includes/about.html _includes/timeline.html _includes/contact.html css/grayscale.scss scripts/check-source
git commit -m "feat: migrate site layout to Bootstrap 5"
```

---

### Task 5: Replace the Legacy Browser Stack with Native JavaScript, Typed 3, Shares, and Rouge

**Files:**
- Create: `js/site.js`
- Create: `_sass/_syntax.scss`
- Replace: `_includes/js.html`
- Replace: `_includes/share.html`
- Modify: `_includes/social-buttons.html`
- Modify: `_includes/footer.html`
- Modify: `_layouts/post.html`
- Modify: `_layouts/blog.html`
- Modify: `_config.yml`
- Modify: `css/grayscale.scss`
- Delete: `_includes/swipe-instructions.html`
- Delete: `_includes/syntax-highlight.html`
- Delete: `css/rrssb.css`
- Delete: `js/hammer.min.js`
- Delete: `js/hammer.min.map`
- Delete: `js/rrssb.min.js`
- Delete: `js/typed.min.js`

**Interfaces:**
- Consumes: `#main-navigation`, `.navbar-custom`, `.page-scroll`, `[data-share-popup]`, `.intro-text`, and Bootstrap's global `bootstrap.Collapse`.
- Produces: `js/site.js` with native scroll/menu/popup behavior, `new Typed(...)` for the home header, local Rouge styling, and share links without jQuery or RRSSB.

- [ ] **Step 1: Add failing browser-stack removal and pin checks**

Append to `scripts/check-source`:

```ruby
browser_paths = Dir.glob(File.join(ROOT, "{_includes,_layouts,css,js}", "**", "*"))
  .select { |path| File.file?(path) }
browser_source = browser_paths.sort.map { |path| File.read(path, mode: "rb").force_encoding("UTF-8").scrub }.join("\n")
%w[jquery jquery-easing hammer.min rrssb highlight.js google-plus plus.google.com].each do |legacy|
  assert!(!browser_source.downcase.include?(legacy), "legacy browser dependency #{legacy} is absent")
end
assert!(read("_includes/js.html").include?("bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"), "Bootstrap bundle is 5.3.8")
assert!(read("_includes/js.html").include?("sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"), "Bootstrap bundle SRI is pinned")
assert!(read("_includes/js.html").include?("typed.js@3.0.0/dist/typed.umd.min.js"), "Typed.js is 3.0.0")
assert!(read("_includes/js.html").include?("sha384-Yov59JWOKYHWUHWDFnCDfZuYmSmavoEutcw/+/ltVWuLGFjOmshWw0r0UV2yCwFi"), "Typed.js SRI is pinned")
assert!(read("_includes/js.html").include?("new Typed("), "Typed constructor API is used")
```

Run: `./scripts/check-source`

Expected: FAIL on the first legacy dependency.

- [ ] **Step 2: Create native site behavior in `js/site.js`**

Create the complete file:

```javascript
(() => {
  "use strict";

  const navbar = document.querySelector(".navbar-custom");
  const navigation = document.getElementById("main-navigation");

  const updateNavbar = () => {
    if (navbar) navbar.classList.toggle("top-nav-collapse", window.scrollY > 50);
  };

  const closeNavigation = () => {
    if (!navigation || !navigation.classList.contains("show") || !window.bootstrap) return;
    window.bootstrap.Collapse.getOrCreateInstance(navigation, { toggle: false }).hide();
  };

  document.querySelectorAll('a.page-scroll[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      link.blur();
      closeNavigation();
    });
  });

  document.querySelectorAll("#main-navigation a, .navbar-brand").forEach((link) => {
    link.addEventListener("click", closeNavigation);
  });

  document.querySelectorAll("[data-share-popup]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const width = 580;
      const height = 470;
      const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
      const top = window.screenY + Math.max(0, (window.outerHeight - height) / 3);
      const popup = window.open(
        link.href,
        "share",
        `popup=yes,scrollbars=yes,width=${width},height=${height},left=${left},top=${top}`
      );
      if (popup) popup.focus();
    });
  });

  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });
})();
```

- [ ] **Step 3: Replace `_includes/share.html` with accessible custom share markup**

Use this complete file; it preserves every configured service except Google+:

```html
{% assign share_url = site.url | append: site.baseurl | append: page.url | uri_escape %}
{% assign share_title = page.title | uri_escape %}
<ul class="share-buttons" aria-label="Share this post">
  {% if site.email-share %}
  <li><a class="share-email" href="mailto:?subject={{ share_title }}&amp;body={{ share_url }}" data-proofer-ignore>
    <i class="fa-solid fa-envelope" aria-hidden="true"></i><span>Email</span></a></li>
  {% endif %}
  {% if site.fb-share %}
  <li><a class="share-facebook" href="https://www.facebook.com/sharer/sharer.php?u={{ share_url }}" data-share-popup>
    <i class="fa-brands fa-facebook-f" aria-hidden="true"></i><span>Facebook</span></a></li>
  {% endif %}
  {% if site.twitter-share %}
  <li><a class="share-x" href="https://twitter.com/intent/tweet?url={{ share_url }}&amp;text={{ share_title }}" data-share-popup>
    <i class="fa-brands fa-x-twitter" aria-hidden="true"></i><span>X</span></a></li>
  {% endif %}
  {% if site.linkedin-share %}
  <li><a class="share-linkedin" href="https://www.linkedin.com/sharing/share-offsite/?url={{ share_url }}" data-share-popup>
    <i class="fa-brands fa-linkedin-in" aria-hidden="true"></i><span>LinkedIn</span></a></li>
  {% endif %}
  {% if site.reddit-share %}
  <li><a class="share-reddit" href="https://www.reddit.com/submit?url={{ share_url }}&amp;title={{ share_title }}" target="_blank" rel="noopener">
    <i class="fa-brands fa-reddit-alien" aria-hidden="true"></i><span>Reddit</span></a></li>
  {% endif %}
  {% if site.tumblr-share %}
  <li><a class="share-tumblr" href="https://www.tumblr.com/widgets/share/tool?canonicalUrl={{ share_url }}&amp;title={{ share_title }}" target="_blank" rel="noopener">
    <i class="fa-brands fa-tumblr" aria-hidden="true"></i><span>Tumblr</span></a></li>
  {% endif %}
  {% if site.pinterest-share %}
  <li><a class="share-pinterest" href="https://pinterest.com/pin/create/button/?url={{ share_url }}" target="_blank" rel="noopener">
    <i class="fa-brands fa-pinterest-p" aria-hidden="true"></i><span>Pinterest</span></a></li>
  {% endif %}
  {% if site.pocket-share %}
  <li><a class="share-pocket" href="https://getpocket.com/save?url={{ share_url }}" target="_blank" rel="noopener">
    <i class="fa-brands fa-get-pocket" aria-hidden="true"></i><span>Pocket</span></a></li>
  {% endif %}
  {% if site.vkontakte-share %}
  <li><a class="share-vk" href="https://vk.com/share.php?url={{ share_url }}" data-share-popup>
    <i class="fa-brands fa-vk" aria-hidden="true"></i><span>VK</span></a></li>
  {% endif %}
</ul>
```

Delete `google-plus-share` from `_config.yml`; retain the other share booleans.

- [ ] **Step 4: Replace social icon interpolation with explicit Font Awesome 7 classes**

Change `_config.yml` social entries to:

```yaml
social:
  - title: "Facebook"
    icon: "fa-brands fa-facebook-f"
    url: "https://www.facebook.com/TyeolRik"
  - title: "GitHub"
    icon: "fa-brands fa-github"
    url: "https://github.com/TyeolRik/"
  - title: "RSS"
    icon: "fa-solid fa-rss"
    url: "/feed.xml"
```

Replace `_includes/social-buttons.html` with:

```html
<ul class="list-inline social-buttons">
  {% for network in site.social %}
  <li class="list-inline-item"><a href="{{ network.url }}" target="_blank" rel="noopener" aria-label="{{ network.title }}">
    <i class="{{ network.icon }} fa-fw" aria-hidden="true"></i></a></li>
  {% endfor %}
  {% if site.keybase-in-social %}
  <li class="list-inline-item"><a href="https://keybase.io/{{site.keybase-username}}" target="_blank" rel="noopener" aria-label="Keybase">
    <i class="fa-solid fa-key fa-fw" aria-hidden="true"></i></a></li>
  {% endif %}
</ul>
```

In `_includes/footer.html`, change the Keybase icon class to `fa-solid fa-key` and add `rel="noopener"` to its external target.

- [ ] **Step 5: Replace `_includes/js.html` with pinned Bootstrap, native behavior, Typed 3, and HTTPS Disqus**

Use this complete file:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
        crossorigin="anonymous"></script>
<script src="{{site.baseurl}}/js/site.js"></script>

{% if site.dynamic-typing and page.section-type == "index" %}
<script src="https://cdn.jsdelivr.net/npm/typed.js@3.0.0/dist/typed.umd.min.js"
        integrity="sha384-Yov59JWOKYHWUHWDFnCDfZuYmSmavoEutcw/+/ltVWuLGFjOmshWw0r0UV2yCwFi"
        crossorigin="anonymous"></script>
<script>
  document.addEventListener("DOMContentLoaded", () => {
    new Typed(".intro-text", {
      strings: {{ site.lines | map: "text" | jsonify }},
      typeSpeed: {{ site.type-speed }},
      startDelay: {{ site.start-delay }},
      backDelay: {{ site.delete-delay }},
      shuffle: {{ site.shuffle | jsonify }},
      loop: {{ site.loop | jsonify }},
      loopCount: {% if site.loop-count %}{{ site.loop-count }}{% else %}Infinity{% endif %},
      cursorChar: "|"
    });
  });
</script>
{% endif %}

{% if site.disqus-shortname and jekyll.environment == "production" %}
  {% if page.section-type == "post" %}
  <script>
    (() => {
      const script = document.createElement("script");
      script.src = "https://{{ site.disqus-shortname }}.disqus.com/embed.js";
      script.async = true;
      script.dataset.timestamp = String(Date.now());
      document.head.appendChild(script);
    })();
  </script>
  {% endif %}
  {% if page.section-type == "post" or page.section-type == "blog" or page.section-type == "index" or page.section-type == "tag" %}
  <script id="dsq-count-scr" src="https://{{ site.disqus-shortname }}.disqus.com/count.js" async></script>
  {% endif %}
{% endif %}
```

- [ ] **Step 6: Add local Rouge styles and custom share layout**

Create `_sass/_syntax.scss` with a scoped Monokai Sublime palette for Jekyll/Rouge output:

```scss
.highlight {
  color: #f8f8f2;
  background: #272822;

  .c, .ch, .cm, .cp, .cpf, .c1, .cs { color: #75715e; }
  .err, .gr, .gt { color: #960050; }
  .k, .kc, .kd, .kn, .kp, .kr, .kt, .o, .ow, .nt { color: #f92672; }
  .na, .nc, .nd, .ne, .nf { color: #a6e22e; }
  .nb, .bp, .sr { color: #f6aa11; }
  .no, .vc, .vg, .vi { color: #66d9ef; }
  .m, .mb, .mf, .mh, .mi, .il, .mo, .se, .sc, .ss { color: #ae81ff; }
  .s, .sa, .sb, .dl, .sd, .s2, .sh, .si, .sx, .s1 { color: #e6db74; }
  .gd, .gi { color: #49483e; }
  .gh { color: #999999; }
  .go { color: #888888; }
  .gp { color: #555555; }
  .gu { color: #aaaaaa; }
  .ge { font-style: italic; }
  .ges { font-weight: bold; font-style: italic; }
  .gs { font-weight: bold; }
}
```

Add `@import "syntax";` after the existing imports in `css/grayscale.scss`. Delete all swipe animation/instruction styles from `@-webkit-keyframes swipe` through `.ok-btn`. Add:

```scss
.share-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 8px;
  padding: 0;
  margin: 40px 0;
  list-style: none;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 42px;
    padding: 8px 10px;
    color: #fff;
    border-radius: 2px;
    font: 700 12px Montserrat, "Helvetica Neue", Helvetica, Arial, sans-serif;
    text-transform: uppercase;
  }

  a:hover, a:focus { color: #fff; filter: brightness(0.85); }
  .share-email { background: #0a88ff; }
  .share-facebook { background: #306199; }
  .share-x { background: #111; }
  .share-linkedin { background: #0077b5; }
  .share-reddit { background: #ff4500; }
  .share-tumblr { background: #35465c; }
  .share-pinterest { background: #bd081c; }
  .share-pocket { background: #ef4056; }
  .share-vk { background: #4c75a3; }
}
```

- [ ] **Step 7: Remove gesture includes and all vendored legacy browser files**

Delete `{% include swipe-instructions.html %}` from `_layouts/post.html` and `_layouts/blog.html`. Delete every file in the task's Delete list. Remove `enable-gesture-navigation` and `syntax-highlight` from `_config.yml`.

- [ ] **Step 8: Build and prove the legacy stack is absent**

Run:

```bash
./scripts/check-source
JEKYLL_ENV=production bundle exec jekyll build --trace
rg -n 'bootstrap@5\.3\.8/dist/js/bootstrap\.bundle|min.js|typed.js@3\.0\.0|new Typed|/js/site\.js' _site/index.html
rg -ni 'jquery|hammer|min\.js.*rrssb|highlight\.js|google-plus|plus\.google\.com|site\.\.loop' _site
```

Expected: source/build pass; current scripts are found; the legacy search exits 1.

- [ ] **Step 9: Commit the native browser stack**

```bash
git add -A
git commit -m "feat: replace legacy browser dependencies"
```

---

### Task 6: Upgrade MathJax to 4.1.3

**Files:**
- Replace: `_includes/mathjax-support.html`
- Modify: `scripts/check-source`

**Interfaces:**
- Consumes: existing `$...$`, `$$...$$`, `\(...\)`, and `\[...\]` post notation.
- Produces: `window.MathJax` configuration declared before the exact MathJax 4.1.3 loader, with code/pre blocks skipped.

- [ ] **Step 1: Add failing MathJax contract checks**

Append to `scripts/check-source`:

```ruby
mathjax = read("_includes/mathjax-support.html")
assert!(mathjax.include?("window.MathJax ="), "MathJax configuration uses the v4 API")
assert!(mathjax.include?("mathjax@4.1.3/tex-mml-chtml.js"), "MathJax is 4.1.3")
assert!(mathjax.include?("sha384-OrHfGTnIbkl0do3N76qW/uWr38o91N05sbSPuYBPLH+hG8X/dNSrjZf3AGjzrCwC"), "MathJax SRI is pinned")
assert!(!mathjax.include?("MathJax.Hub"), "MathJax v2 API is absent")
```

Run: `./scripts/check-source`

Expected: FAIL at the v4 API assertion.

- [ ] **Step 2: Replace the MathJax include**

Use this complete file:

```html
<script>
  window.MathJax = {
    tex: {
      inlineMath: [["\\(", "\\)"], ["$", "$"]],
      displayMath: [["\\[", "\\]"], ["$$", "$$"]],
      processEscapes: true
    },
    options: {
      skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"]
    }
  };
</script>
<script id="MathJax-script"
        async
        src="https://cdn.jsdelivr.net/npm/mathjax@4.1.3/tex-mml-chtml.js"
        integrity="sha384-OrHfGTnIbkl0do3N76qW/uWr38o91N05sbSPuYBPLH+hG8X/dNSrjZf3AGjzrCwC"
        crossorigin="anonymous"></script>
```

- [ ] **Step 3: Build and verify ordering in a generated post**

Run:

```bash
./scripts/check-source
JEKYLL_ENV=production bundle exec jekyll build --trace
post=_site/jekyll/2021/04/27/jekyll-2-contemplation-of-using-mathjax-in-github-flavored-markdown.html
test -f "$post"
ruby -e 'html = File.read(ARGV.fetch(0)); abort unless html.index("window.MathJax") < html.index("mathjax@4.1.3")' "$post"
```

Expected: all checks exit 0 and configuration precedes the loader.

- [ ] **Step 4: Commit the MathJax upgrade**

```bash
git add _includes/mathjax-support.html scripts/check-source
git commit -m "feat: upgrade MathJax to version 4"
```

---

### Task 7: Add Production-Only GA4 to Jekyll and Wedding

**Files:**
- Create: `js/analytics.js`
- Modify: `_config.yml`
- Modify: `_includes/head.html`
- Modify: `wedding/index.html`
- Modify: `scripts/check-source`

**Interfaces:**
- Consumes: a script element with `data-measurement-id` and `location.hostname`.
- Produces: a shared loader that creates `window.dataLayer`, defines `window.gtag`, loads Google Tag, and sends the default `page_view` only on `tyeolrik.github.io`.

- [ ] **Step 1: Add failing analytics contract checks**

Append to `scripts/check-source`:

```ruby
config = read("_config.yml")
head = read("_includes/head.html")
wedding = read("wedding/index.html")
assert!(config.include?('google-analytics-id: "G-WYMVRPT9ZB"'), "GA4 measurement ID is configured")
assert!(head.include?('data-measurement-id="{{ site.google-analytics-id }}"'), "Jekyll head loads shared analytics")
assert!(wedding.include?('data-measurement-id="G-WYMVRPT9ZB"'), "wedding loads shared analytics")
assert!(read("js/analytics.js").include?('window.location.hostname !== "tyeolrik.github.io"'), "analytics has the production hostname guard")
assert!(!head.include?("UA-89622772-1"), "Universal Analytics is absent")
```

Run: `./scripts/check-source`

Expected: FAIL at the GA4 configuration assertion.

- [ ] **Step 2: Create the shared immediate GA4 loader**

Create `js/analytics.js`:

```javascript
(() => {
  "use strict";

  const loader = document.currentScript;
  const measurementId = loader && loader.dataset.measurementId;
  if (!measurementId || window.location.hostname !== "tyeolrik.github.io") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", measurementId);

  const tag = document.createElement("script");
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(tag);
})();
```

- [ ] **Step 3: Wire the measurement ID into both heads**

Replace the old `google-tracking-id` setting with:

```yaml
google-analytics-id: "G-WYMVRPT9ZB"
```

Add this before `</head>` in `_includes/head.html`:

```html
  <script src="{{site.baseurl}}/js/analytics.js" data-measurement-id="{{ site.google-analytics-id }}"></script>
```

Add this immediately after the stylesheet in `wedding/index.html`:

```html
    <script src="/js/analytics.js" data-measurement-id="G-WYMVRPT9ZB"></script>
```

Do not change any other wedding line.

- [ ] **Step 4: Verify generated analytics markup and local non-transmission logic**

Run:

```bash
./scripts/check-source
JEKYLL_ENV=production bundle exec jekyll build --trace
rg -n 'G-WYMVRPT9ZB|/js/analytics\.js' _site/index.html _site/wedding/index.html
rg -n 'UA-89622772-1|analytics\.js.*google-analytics\.com' _site
```

Expected: both generated pages contain GA4 and the shared loader; the UA search exits 1. In the local browser, `window.dataLayer` remains undefined because the hostname is `127.0.0.1`.

- [ ] **Step 5: Commit analytics**

```bash
git add _config.yml _includes/head.html wedding/index.html js/analytics.js scripts/check-source
git commit -m "feat: add production-only GA4 tracking"
```

---

### Task 8: Add the Complete Site Integrity Contract and Current Documentation

**Files:**
- Create: `scripts/check-site`
- Modify: `scripts/check-source`
- Modify: `.gitignore`
- Replace: `README.md`
- Replace: `scripts/README.md`
- Delete: `.travis.yml`

**Interfaces:**
- Consumes: a production `_site` directory, html-proofer 5.2.1, all source contracts, and authoring smoke tests.
- Produces: a single local verification sequence used unchanged by Actions and documentation matching actual commands.

- [ ] **Step 1: Create the generated-site checker**

Create `scripts/check-site`:

```ruby
#!/usr/bin/env ruby
# frozen_string_literal: true

require "html-proofer"

ROOT = File.expand_path("..", __dir__)
SITE = File.join(ROOT, "_site")

def assert!(condition, message)
  abort "FAIL: #{message}" unless condition
  puts "PASS: #{message}"
end

required = %w[
  index.html
  blog/index.html
  blog/page2/index.html
  jekyll/2021/04/27/jekyll-2-contemplation-of-using-mathjax-in-github-flavored-markdown.html
  tags/mathjax.html
  categories/jekyll.html
  feed.xml
  sitemap.xml
  404.html
  wedding/index.html
  js/site.js
  js/analytics.js
]

assert!(Dir.exist?(SITE), "_site exists")
required.each { |path| assert!(File.exist?(File.join(SITE, path)), "#{path} exists") }
assert!(!File.exist?(File.join(SITE, "ComputerGraphics", "project3.html")), "ComputerGraphics output is absent")

index = File.read(File.join(SITE, "index.html"), encoding: "UTF-8")
wedding = File.read(File.join(SITE, "wedding", "index.html"), encoding: "UTF-8")
assert!(index.include?("bootstrap@5.3.8"), "generated home uses Bootstrap 5.3.8")
assert!(index.include?("typed.js@3.0.0"), "generated home uses Typed.js 3.0.0")
assert!(index.include?("mathjax@4.1.3"), "generated home uses MathJax 4.1.3")
assert!(index.include?("fontawesome-free@7.3.0"), "generated home uses Font Awesome 7.3.0")
assert!(index.include?("G-WYMVRPT9ZB") && wedding.include?("G-WYMVRPT9ZB"), "GA4 is present on home and wedding")

generated_html = Dir.glob(File.join(SITE, "**", "*.html")).sort.map { |path| File.read(path, encoding: "UTF-8") }.join("\n")
%w[UA-89622772-1 plus.google.com jquery-1.11 hammer.min.js rrssb.min.js highlight.js].each do |legacy|
  assert!(!generated_html.downcase.include?(legacy.downcase), "generated HTML omits #{legacy}")
end
assert!(!generated_html.match?(/(?:src|href)=["']\/\//), "generated assets do not use protocol-relative URLs")

HTMLProofer.check_directory(
  SITE,
  {
    disable_external: true,
    enforce_https: true,
    ignore_empty_alt: true,
    ignore_empty_mailto: true
  }
).run

puts "PASS: generated site integrity"
```

Run:

```bash
chmod +x scripts/check-site
bundle exec jekyll clean
JEKYLL_ENV=production bundle exec jekyll build --trace
bundle exec ruby scripts/check-site
```

Expected: all required outputs and html-proofer checks pass. Any reported internal URL, anchor, script, stylesheet, or image must be corrected at its source before continuing.

- [ ] **Step 2: Finish the source contract for all forbidden code and generated artifacts**

Append to `scripts/check-source`:

```ruby
tracked = IO.popen(["git", "-C", ROOT, "ls-files"], &:read).lines.map(&:strip)
%w[_site .jekyll-cache .sass-cache].each do |artifact|
  assert!(tracked.none? { |path| path == artifact || path.start_with?("#{artifact}/") }, "#{artifact} is not tracked")
end

source_markup = Dir.glob(File.join(ROOT, "{_includes,_layouts}", "**", "*.html")).sort.map { |path| File.read(path) }.join("\n")
assert!(!source_markup.match?(/(?:src|href)=["']\/\//), "source assets do not use protocol-relative URLs")
%w[html5shiv respond.js UA-89622772-1].each do |legacy|
  assert!(!source_markup.include?(legacy), "#{legacy} is absent")
end
assert!(Dir.glob(File.join(ROOT, "_posts", "*")).count == 93, "all 93 posts remain")
assert!(Dir.glob(File.join(ROOT, "tags", "*.html")).count == 152, "all 152 tag pages remain")
assert!(Dir.glob(File.join(ROOT, "categories", "*.html")).count == 24, "all 24 category pages remain")
```

Run: `./scripts/check-source`

Expected: every line is `PASS`.

- [ ] **Step 3: Normalize `.gitignore` for current Jekyll output**

Retain editor exclusions and ensure these exact project entries exist:

```gitignore
_site/
.jekyll-cache/
.jekyll-metadata
.sass-cache/
.bundle/
vendor/bundle/
Gemfile.lock.old
```

Remove obsolete `_deploy/*`, `Rakefile`, `test/`, and `marry/` entries unless a currently tracked user file requires one; do not ignore `Gemfile.lock`.

- [ ] **Step 4: Replace the project README with repository-specific instructions**

Use this structure and exact commands in `README.md`:

````markdown
# TyeolRik.github.io

Source for [https://tyeolrik.github.io](https://tyeolrik.github.io), a Jekyll blog deployed with GitHub Pages Actions.

## Requirements

- Ruby 4.0.6
- Bundler 4.0.16

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
````

Write the Markdown with `apply_patch` so the outer plan fence does not become part of the file.

- [ ] **Step 5: Replace `scripts/README.md` with the supported command reference**

Use:

```markdown
# Scripts

- `./scripts/install` — verify Ruby 4.0.6, install Bundler 4.0.16 if needed, and run `bundle install`.
- `./scripts/serve` — development preview with LiveReload on `127.0.0.1:4000`.
- `./scripts/serve-production` — production-mode preview on `127.0.0.1:4000`.
- `./scripts/serve-lan` — development preview on `0.0.0.0:4000`; it does not modify the firewall.
- `./scripts/check-source` — verify pins, source markup, removals, and tracked-artifact rules.
- `./scripts/check-tools` — test `newpost` and `generate` in a temporary site.
- `bundle exec ruby scripts/check-site` — verify a previously generated `_site` with html-proofer and required-output checks.

Post and taxonomy commands remain at the repository root:

- `./newpost "Category Post title"`
- `./generate`
```

- [ ] **Step 6: Delete Travis after its replacement passes**

Run the full local replacement first:

```bash
./scripts/check-source
./scripts/check-tools
JEKYLL_ENV=production bundle exec jekyll build --trace
bundle exec ruby scripts/check-site
```

Expected: all commands exit 0. Then delete `.travis.yml`; run `./scripts/check-source` again and expect exit 0.

- [ ] **Step 7: Commit validation and documentation**

```bash
git add .gitignore README.md scripts/README.md scripts/check-source scripts/check-site .travis.yml
git commit -m "test: add local Jekyll integrity checks"
```

---

### Task 9: Perform the Required Local Serve and Browser Regression Gate

**Files:**
- Modify only if a verified regression requires a source correction in Tasks 4–8.

**Interfaces:**
- Consumes: `./scripts/serve`, `./scripts/serve-production`, Task 1 screenshots, and all automatic checks.
- Produces: evidence that development and production Jekyll servers, desktop/mobile layouts, browser interactions, local GA guard, and static assets work before any Actions or Pages change.

- [ ] **Step 1: Run the clean automatic local gate**

Run:

```bash
./scripts/install
./scripts/check-source
./scripts/check-tools
bundle exec jekyll clean
JEKYLL_ENV=production bundle exec jekyll build --trace
bundle exec ruby scripts/check-site
git status --short
```

Expected: every command exits 0 and only intentional source changes, if any, appear in status.

- [ ] **Step 2: Start the development server first, as required**

Run `./scripts/serve` in a persistent terminal session.

Expected terminal line: `Server address: http://127.0.0.1:4000/` and no build exception.

Use the in-app browser at 1440×900 and 390×844 to verify:

```text
http://127.0.0.1:4000/
http://127.0.0.1:4000/blog/
http://127.0.0.1:4000/blog/page2/
http://127.0.0.1:4000/jekyll/2021/04/27/jekyll-2-contemplation-of-using-mathjax-in-github-flavored-markdown.html
http://127.0.0.1:4000/tags/mathjax.html
http://127.0.0.1:4000/categories/jekyll.html
http://127.0.0.1:4000/404.html
http://127.0.0.1:4000/wedding/
```

Check navbar open/close, smooth scrolling, Typed animation, pagination in both directions, Rouge colors, inline/block MathJax, share popup, wedding gallery, copy button, countdown, console errors, and failed network requests. Confirm `window.dataLayer` is undefined and no request goes to `googletagmanager.com` locally. Compare home/blog/post/wedding against Task 1 screenshots at both viewport sizes.

- [ ] **Step 3: Start and inspect the production-mode server**

Stop the development session cleanly, run `./scripts/serve-production`, and repeat the home, blog, post, 404, and wedding checks.

Expected: server starts at `127.0.0.1:4000`; production-only Disqus scripts appear on applicable pages; GA still does not load because the hostname guard is independent of Jekyll environment.

- [ ] **Step 4: Re-run checks after browser-driven corrections**

If a regression was found, apply the smallest source correction in its owning file and repeat Steps 1–3. The gate is complete only with no console error, no missing asset, no internal integrity failure, and no unexplained baseline layout change.

- [ ] **Step 5: Commit any local-gate correction separately**

If no correction was needed, do not create an empty commit. If corrections were needed:

```bash
git add -u -- _includes _layouts _sass css js _config.yml wedding scripts
git commit -m "fix: resolve local site regressions"
```

The scoped `git add -u` stages only tracked corrections in the site implementation areas; verify `git diff --cached --name-only` contains no `_site` or unrelated path before committing.

---

### Task 10: Add Non-Deploying CI and Weekly External-Link Reporting

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/external-links.yml`
- Modify: `scripts/check-source`

**Interfaces:**
- Consumes: exact Ruby/Bundler lock, `scripts/check-source`, `scripts/check-tools`, production build, and `scripts/check-site`.
- Produces: blocking `CI` checks with no deployment and nonblocking weekly/manual `External links` artifacts.

- [ ] **Step 1: Add failing workflow-source assertions**

Append to `scripts/check-source`:

```ruby
action_pins = {
  "actions/checkout" => "9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0", # v7.0.0
  "ruby/setup-ruby" => "8e41b362d2589a22a44c1cfa214b3c83052c195b" # v1.318.0
}
workflows = Dir.glob(File.join(ROOT, ".github", "workflows", "*.yml")).sort.map { |path| File.read(path) }.join("\n")
action_pins.each do |name, sha|
  assert!(workflows.include?("#{name}@#{sha}"), "#{name} is pinned to #{sha}")
end
assert!(File.exist?(File.join(ROOT, ".github/workflows/ci.yml")), "CI workflow exists")
assert!(File.exist?(File.join(ROOT, ".github/workflows/external-links.yml")), "external-link workflow exists")
```

Run: `./scripts/check-source`

Expected: FAIL because the workflows do not exist.

- [ ] **Step 2: Create the no-deploy CI workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0
      - name: Set up Ruby
        uses: ruby/setup-ruby@8e41b362d2589a22a44c1cfa214b3c83052c195b # v1.318.0
        with:
          ruby-version: "4.0.6"
          bundler: "4.0.16"
          bundler-cache: true
      - name: Check Ruby scripts
        run: |
          ruby -c newpost
          ruby -c generate
          ruby -c scripts/check-source
          ruby -c scripts/check-tools
          ruby -c scripts/check-site
      - name: Check source and authoring tools
        run: |
          ./scripts/check-source
          ./scripts/check-tools
      - name: Build production site
        env:
          JEKYLL_ENV: production
        run: bundle exec jekyll build --trace
      - name: Check generated site
        run: bundle exec ruby scripts/check-site
```

- [ ] **Step 3: Create the nonblocking weekly external-link workflow**

Create `.github/workflows/external-links.yml`:

```yaml
name: External links

on:
  schedule:
    - cron: "17 18 * * 0"
  workflow_dispatch:

permissions:
  contents: read

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0
      - name: Set up Ruby
        uses: ruby/setup-ruby@8e41b362d2589a22a44c1cfa214b3c83052c195b # v1.318.0
        with:
          ruby-version: "4.0.6"
          bundler: "4.0.16"
          bundler-cache: true
      - name: Build production site
        env:
          JEKYLL_ENV: production
        run: bundle exec jekyll build --trace
      - name: Audit external links
        id: audit
        continue-on-error: true
        shell: bash
        run: |
          set -o pipefail
          bundle exec htmlproofer ./_site --ignore-empty-alt --ignore-empty-mailto 2>&1 | tee external-links.log
      - name: Add result to summary
        if: always()
        run: |
          if [[ "${{ steps.audit.outcome }}" == "success" ]]; then
            echo "## External links: pass" >> "$GITHUB_STEP_SUMMARY"
          else
            echo "## External links: findings reported" >> "$GITHUB_STEP_SUMMARY"
            echo "Download the external-links artifact for details." >> "$GITHUB_STEP_SUMMARY"
          fi
      - name: Upload report
        if: always()
        uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1
        with:
          name: external-links
          path: external-links.log
          if-no-files-found: error
          retention-days: 14
```

Extend the `action_pins` hash with:

```ruby
"actions/upload-artifact" => "043fb46d1a93c77aae656e7c1c64a875d1fc6a0a" # v7.0.1
```

- [ ] **Step 4: Parse workflows and rerun the complete local gate**

Run:

```bash
ruby -e 'require "yaml"; Dir[".github/workflows/*.yml"].each { |path| YAML.parse_file(path); puts "PASS: #{path}" }'
./scripts/check-source
./scripts/check-tools
JEKYLL_ENV=production bundle exec jekyll build --trace
bundle exec ruby scripts/check-site
```

Expected: both workflow YAML files parse and the full local gate exits 0.

- [ ] **Step 5: Commit CI without any Pages deployment**

```bash
git add .github/workflows/ci.yml .github/workflows/external-links.yml scripts/check-source
git commit -m "ci: add Jekyll build and link checks"
```

Run: `rg -n 'deploy-pages|upload-pages-artifact|pages: write' .github/workflows`

Expected: exit 1; no deployment capability exists yet.

---

### Task 11: Push the Feature Branch and Prove Remote CI Before Pages Changes

**Files:**
- No source changes unless CI exposes a reproducible issue.

**Interfaces:**
- Consumes: all local-green commits and the public GitHub repository.
- Produces: a pull request whose `CI` check is green while Pages remains `build_type: legacy`.

- [ ] **Step 1: Verify local branch and Pages precondition**

Run:

```bash
git status --short --branch
git log --oneline origin/master..HEAD
gh api repos/TyeolRik/TyeolRik.github.io/pages --jq '{build_type: .build_type, status: .status}'
```

Expected: clean `codex/jekyll-modernization`; intentional commits are listed; Pages is `{"build_type":"legacy","status":"built"}`.

- [ ] **Step 2: Push and open the implementation PR**

Run:

```bash
git push -u origin codex/jekyll-modernization
gh pr create \
  --base master \
  --head codex/jekyll-modernization \
  --title "Modernize Jekyll and GitHub Pages toolchain" \
  --body "Updates Ruby, Bundler, Jekyll, pagination, browser dependencies, GA4, local tooling, and CI. Removes ComputerGraphics and the approved legacy stack. Pages remains on the legacy builder until CI and a separate manual deployment workflow are verified."
```

Expected: GitHub returns the new PR URL.

- [ ] **Step 3: Watch CI and preserve Pages legacy mode**

Run:

```bash
gh pr checks --watch
gh api repos/TyeolRik/TyeolRik.github.io/pages --jq '.build_type'
```

Expected: `CI` passes; external-links is not required; Pages still prints `legacy`.

- [ ] **Step 4: Fix only reproducible CI differences, if present**

For a failure, inspect it with:

```bash
gh run list --workflow CI --branch codex/jekyll-modernization --limit 5
gh run view --log-failed
```

Reproduce the failing command locally, apply the minimum correction, rerun the full Task 9 gate, commit with `fix: resolve CI environment mismatch`, push, and repeat Step 3. Do not add a Pages workflow until CI is green.

---

### Task 12: Add a Manual-Only Pages Workflow in a Separate Commit and Merge

**Files:**
- Create: `.github/workflows/pages.yml`
- Modify: `scripts/check-source`

**Interfaces:**
- Consumes: the green CI build contract and official Pages artifact/deploy actions.
- Produces: a `workflow_dispatch`-only build/deploy workflow on `master`; no source push can start it yet.

- [ ] **Step 1: Add the workflow pin contract before the workflow**

Extend `action_pins` in `scripts/check-source` with:

```ruby
"actions/configure-pages" => "45bfe0192ca1faeb007ade9deae92b16b8254a0d", # v6.0.0
"actions/upload-pages-artifact" => "fc324d3547104276b827a68afc52ff2a11cc49c9", # v5.0.0
"actions/deploy-pages" => "cd2ce8fcbc39b97be8ca5fce6e763baed58fa128" # v5.0.0
```

Add:

```ruby
pages_workflow = File.join(ROOT, ".github/workflows/pages.yml")
assert!(File.exist?(pages_workflow), "Pages workflow exists")
pages_source = File.exist?(pages_workflow) ? File.read(pages_workflow) : ""
assert!(pages_source.include?("workflow_dispatch:"), "Pages supports manual dispatch")
```

Run: `./scripts/check-source`

Expected: FAIL at `Pages workflow exists`.

- [ ] **Step 2: Create the manual-only Pages workflow**

Create `.github/workflows/pages.yml`:

```yaml
name: Deploy Pages

on:
  workflow_dispatch:

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    permissions:
      contents: read
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0
      - name: Set up Ruby
        uses: ruby/setup-ruby@8e41b362d2589a22a44c1cfa214b3c83052c195b # v1.318.0
        with:
          ruby-version: "4.0.6"
          bundler: "4.0.16"
          bundler-cache: true
      - name: Configure Pages
        uses: actions/configure-pages@45bfe0192ca1faeb007ade9deae92b16b8254a0d # v6.0.0
      - name: Check source and tools
        run: |
          ./scripts/check-source
          ./scripts/check-tools
      - name: Build production site
        env:
          JEKYLL_ENV: production
        run: bundle exec jekyll build --trace
      - name: Check generated site
        run: bundle exec ruby scripts/check-site
      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@fc324d3547104276b827a68afc52ff2a11cc49c9 # v5.0.0
        with:
          path: _site

  deploy:
    needs: build
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Pages
        id: deployment
        uses: actions/deploy-pages@cd2ce8fcbc39b97be8ca5fce6e763baed58fa128 # v5.0.0
```

- [ ] **Step 3: Assert that the first workflow cannot deploy on push**

Append to `scripts/check-source`:

```ruby
pages_on_block = pages_source[/\A.*?^concurrency:/m].to_s
assert!(!pages_on_block.match?(/^\s*push:/), "initial Pages workflow is manual-only")
```

Run:

```bash
ruby -e 'require "yaml"; YAML.parse_file(".github/workflows/pages.yml"); puts "PASS: pages workflow YAML"'
./scripts/check-source
JEKYLL_ENV=production bundle exec jekyll build --trace
bundle exec ruby scripts/check-site
```

Expected: YAML and every local gate pass; the manual-only assertion passes.

- [ ] **Step 4: Commit and push this workflow separately**

```bash
git add .github/workflows/pages.yml scripts/check-source
git commit -m "ci: add manual GitHub Pages deployment"
git push
gh pr checks --watch
```

Expected: the existing PR receives a new green CI run; `Deploy Pages` does not start because the event is a PR/push, not manual dispatch.

- [ ] **Step 5: Merge the green modernization PR**

Run:

```bash
gh pr merge --squash --delete-branch
git switch master
git pull --ff-only origin master
gh api repos/TyeolRik/TyeolRik.github.io/pages --jq '.build_type'
```

Expected: merge succeeds, local master is current, and Pages still prints `legacy` because no setting or manual run has changed it.

---

### Task 13: Cut Pages Over Manually, Verify Production, Then Enable Push Deployment

**Files:**
- Modify in follow-up branch: `.github/workflows/pages.yml`
- Modify in follow-up branch: `scripts/check-source`

**Interfaces:**
- Consumes: manual-only Pages workflow on `master`, GitHub Pages REST settings, and the live production verification list.
- Produces: first successful artifact deployment, `build_type: workflow`, a later reviewed `master` push trigger, public URL validation, ComputerGraphics 404, and GA4 page_view evidence.

- [ ] **Step 1: Switch Pages to workflow mode only after all preconditions are green**

Run:

```bash
gh run list --workflow CI --branch master --limit 1
gh api repos/TyeolRik/TyeolRik.github.io/pages --jq '{build_type: .build_type, status: .status}'
gh api --method PUT repos/TyeolRik/TyeolRik.github.io/pages -F build_type=workflow
gh api repos/TyeolRik/TyeolRik.github.io/pages --jq '.build_type'
```

Expected: the latest master CI is successful; the before value is `legacy`; the final value is `workflow`.

- [ ] **Step 2: Run the first deployment manually and watch both jobs**

Run:

```bash
gh workflow run pages.yml --ref master
run_id="$(gh run list --workflow pages.yml --branch master --limit 1 --json databaseId --jq '.[0].databaseId')"
gh run watch "$run_id" --exit-status
```

Expected: build, source/tools checks, Jekyll build, generated-site check, artifact upload, and deploy all succeed. If it fails, keep the automatic push trigger disabled, inspect `gh run view "$run_id" --log-failed`, restore legacy mode with `gh api --method PUT repos/TyeolRik/TyeolRik.github.io/pages -F build_type=legacy`, verify the last published site still responds, and correct through a reviewed branch before retrying the cutover.

- [ ] **Step 3: Verify the public site and intentional removal**

Run:

```bash
for path in / /blog/ /blog/page2/ /jekyll/2021/04/27/jekyll-2-contemplation-of-using-mathjax-in-github-flavored-markdown.html /tags/mathjax.html /categories/jekyll.html /feed.xml /sitemap.xml /404.html /wedding/; do
  curl -sS -o /dev/null -w "%{http_code} %{url_effective}\n" "https://tyeolrik.github.io${path}"
done
curl -sS -o /dev/null -w "%{http_code}\n" https://tyeolrik.github.io/ComputerGraphics/project3.html
gh api repos/TyeolRik/TyeolRik.github.io/pages --jq '{build_type: .build_type, status: .status, html_url: .html_url}'
```

Expected: core URLs return `200`; ComputerGraphics returns `404`; Pages reports `build_type: workflow` and `status: built`.

Repeat Task 9's desktop/mobile browser checks on the public URL. Confirm no console errors or failed current CDN assets. Use GA4 Realtime or Google Tag Assistant to confirm a `page_view` for measurement ID `G-WYMVRPT9ZB` from `tyeolrik.github.io`; this is the only manual analytics evidence required.

- [ ] **Step 4: Manually run the external-link report once**

Run:

```bash
gh workflow run external-links.yml --ref master
run_id="$(gh run list --workflow external-links.yml --branch master --limit 1 --json databaseId --jq '.[0].databaseId')"
gh run watch "$run_id"
```

Expected: the workflow completes without blocking deployment and publishes the `external-links` artifact even when individual external URLs fail.

- [ ] **Step 5: Create the follow-up branch and add the master push trigger**

Run:

```bash
git switch -c codex/enable-pages-push
```

Change only the `on` block in `.github/workflows/pages.yml` to:

```yaml
on:
  push:
    branches: [master]
  workflow_dispatch:
```

Replace the manual-only assertion in `scripts/check-source` with:

```ruby
assert!(pages_on_block.match?(/^\s*push:/), "Pages deploys on master push")
assert!(pages_source.include?("branches: [master]"), "Pages push trigger is limited to master")
```

- [ ] **Step 6: Validate, commit, and merge the push-trigger follow-up**

Run:

```bash
ruby -e 'require "yaml"; YAML.parse_file(".github/workflows/pages.yml"); puts "PASS: pages workflow YAML"'
./scripts/check-source
JEKYLL_ENV=production bundle exec jekyll build --trace
bundle exec ruby scripts/check-site
git add .github/workflows/pages.yml scripts/check-source
git commit -m "ci: deploy Pages on master updates"
git push -u origin codex/enable-pages-push
gh pr create --base master --head codex/enable-pages-push --title "Enable Pages deployment on master" --body "Enables automatic Pages artifact deployment only after the first manual workflow deployment and production verification succeeded."
gh pr checks --watch
gh pr merge --squash --delete-branch
```

Expected: CI passes, the follow-up PR merges, and the resulting master push starts `Deploy Pages`.

- [ ] **Step 7: Verify automatic deployment and final repository state**

Run:

```bash
git switch master
git pull --ff-only origin master
run_id="$(gh run list --workflow pages.yml --branch master --limit 1 --json databaseId --jq '.[0].databaseId')"
gh run watch "$run_id" --exit-status
gh api repos/TyeolRik/TyeolRik.github.io/pages --jq '{build_type: .build_type, status: .status}'
git status --short --branch
```

Expected: automatic Pages run passes; API reports `workflow` and `built`; local master is clean and synchronized. Repeat the core URL and ComputerGraphics status checks from Step 3 to close the implementation.
