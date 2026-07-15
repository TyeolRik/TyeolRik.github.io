# frozen_string_literal: true

require "set"

require_relative "check-site-paths"

failures = []

check = lambda do |label, expected, &block|
  actual = block.call
  if actual == expected
    puts "PASS: #{label}"
  else
    failures << "#{label}: expected #{expected.inspect}, got #{actual.inspect}"
  end
end

candidate_fixtures = {
  "normalizes root-relative dot segments" => [
    "/x/../Tags/MFC.html",
    "posts/example.html",
    ["Tags/MFC.html", "Tags/MFC.html/index.html"]
  ],
  "normalizes encoded dot segments" => [
    "/x/%2E%2E/Tags/MFC.html",
    "posts/example.html",
    ["Tags/MFC.html", "Tags/MFC.html/index.html"]
  ],
  "normalizes document-relative dot segments" => [
    "../Tags/MFC.html",
    "posts/example.html",
    ["Tags/MFC.html", "Tags/MFC.html/index.html"]
  ],
  "adds an index candidate for a slashless directory" => [
    "/Blog",
    "posts/example.html",
    ["Blog", "Blog/index.html"]
  ],
  "uses only the index candidate for a trailing-slash directory" => [
    "/Blog/",
    "posts/example.html",
    ["Blog/index.html"]
  ],
  "preserves an encoded slash within a URL segment" => [
    "/Assets/Icon%2FLogo.png",
    "posts/example.html",
    ["Assets/Icon%2FLogo.png", "Assets/Icon%2FLogo.png/index.html"]
  ],
  "preserves encoded query and fragment delimiters" => [
    "/Assets/What%3FNow%23.png",
    "posts/example.html",
    ["Assets/What%3FNow%23.png", "Assets/What%3FNow%23.png/index.html"]
  ],
  "decodes an encoded space for filesystem matching" => [
    "/Assets/My%20File.png",
    "posts/example.html",
    ["Assets/My File.png", "Assets/My File.png/index.html"]
  ],
  "decodes encoded UTF-8 for filesystem matching" => [
    "/Assets/%E2%98%83.png",
    "posts/example.html",
    ["Assets/☃.png", "Assets/☃.png/index.html"]
  ],
  "does not decode percent escapes inherited from the source directory" => [
    "Asset.png",
    "Posts/%2F/example.html",
    ["Posts/%2F/Asset.png", "Posts/%2F/Asset.png/index.html"]
  ]
}

candidate_fixtures.each do |label, (reference, source_path, expected)|
  check.call(label, expected) { SitePathChecker.target_candidates(reference, source_path) }
end

site_files = Set.new(
  %w[
    tags/mfc.html
    blog/index.html
    assets/icon/logo.png
    assets/icon%2Flogo.png
    assets/what%3Fnow%23.png
    assets/my\ file.png
    posts/%2F/asset.png
  ]
)
site_files_by_casefold = site_files.group_by(&:downcase)

mismatch_fixtures = {
  "detects case mismatch after root-relative dot normalization" => [
    "/x/../Tags/MFC.html",
    "posts/example.html",
    ["tags/mfc.html"]
  ],
  "accepts exact case after root-relative dot normalization" => [
    "/x/../tags/mfc.html",
    "posts/example.html",
    []
  ],
  "detects a slashless directory index case mismatch" => [
    "/Blog",
    "posts/example.html",
    ["blog/index.html"]
  ],
  "accepts an exact slashless directory index" => [
    "/blog",
    "posts/example.html",
    []
  ],
  "does not conflate an encoded slash with a path separator" => [
    "/Assets/Icon%2FLogo.png",
    "posts/example.html",
    ["assets/icon%2Flogo.png"]
  ],
  "does not conflate encoded query and fragment delimiters" => [
    "/Assets/What%3FNow%23.png",
    "posts/example.html",
    ["assets/what%3Fnow%23.png"]
  ],
  "detects case mismatch after decoding an encoded space" => [
    "/Assets/My%20File.png",
    "posts/example.html",
    ["assets/my file.png"]
  ],
  "preserves source-directory percent escapes during matching" => [
    "Asset.png",
    "Posts/%2F/example.html",
    ["posts/%2F/asset.png"]
  ]
}

mismatch_fixtures.each do |label, (reference, source_path, expected)|
  check.call(label, expected) do
    SitePathChecker.case_mismatches(reference, source_path, site_files, site_files_by_casefold)
  end
end

abort "FAIL: path fixtures\n#{failures.join("\n")}" unless failures.empty?

puts "PASS: #{candidate_fixtures.length + mismatch_fixtures.length} path fixtures"
