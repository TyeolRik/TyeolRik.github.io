# frozen_string_literal: true

require "uri"

module SitePathChecker
  PRESERVED_ESCAPED_BYTES = (
    ":/?#[]@!$&'()*+,;=\\".bytes + (0..31).to_a + [127]
  ).freeze

  module_function

  def target_candidates(reference, source_path)
    return [] if reference.nil? || reference.empty? || reference.start_with?("#", "//")

    uri = URI.parse(reference)
    return [] if uri.scheme || uri.host || uri.path.nil? || uri.path.empty?

    absolute = uri.path.start_with?("/")
    source_directory = File.dirname(source_path)
    segments = if absolute || source_directory == "."
                 []
               else
                 source_directory.split("/")
               end

    uri.path.split("/", -1).each do |encoded_segment|
      segment = decode_reference_segment(encoded_segment)
      case segment
      when "", "."
        next
      when ".."
        if segments.empty?
          return [] unless absolute
        else
          segments.pop
        end
      else
        segments << segment
      end
    end

    relative_path = segments.join("/")
    return ["index.html"] if relative_path.empty?
    return [File.join(relative_path, "index.html")] if uri.path.end_with?("/")

    [relative_path, File.join(relative_path, "index.html")]
  rescue URI::InvalidURIError
    []
  end

  def case_mismatches(reference, source_path, site_files, site_files_by_casefold)
    candidates = target_candidates(reference, source_path)
    return [] if candidates.empty? || candidates.any? { |candidate| site_files.include?(candidate) }

    candidates.flat_map { |candidate| site_files_by_casefold.fetch(candidate.downcase, []) }.uniq
  end

  def decode_reference_segment(segment)
    decoded = String.new(capacity: segment.bytesize, encoding: Encoding::BINARY)
    offset = 0

    segment.to_enum(:scan, /%([0-9A-Fa-f]{2})/).each do
      match = Regexp.last_match
      decoded << segment.byteslice(offset, match.begin(0) - offset)
      byte = match[1].to_i(16)
      if PRESERVED_ESCAPED_BYTES.include?(byte)
        decoded << match[0]
      else
        decoded << byte
      end
      offset = match.end(0)
    end
    decoded << segment.byteslice(offset, segment.bytesize - offset)
    decoded.force_encoding(Encoding::UTF_8)

    return decoded if decoded.valid_encoding?

    segment.gsub(/%([0-9A-Fa-f]{2})/) do |escape|
      byte = Regexp.last_match(1).to_i(16)
      if byte.between?(32, 126) && !PRESERVED_ESCAPED_BYTES.include?(byte)
        byte.chr
      else
        escape
      end
    end
  end
  private_class_method :decode_reference_segment
end
