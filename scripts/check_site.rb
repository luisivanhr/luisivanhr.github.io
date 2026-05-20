#!/usr/bin/env ruby
# Provider-agnostic validation entrypoint for local runs and CI.

require "cgi"
require "fileutils"
require "json"
require "pathname"
require "uri"
require "yaml"

ROOT = File.expand_path("..", __dir__)
SITE_DIR = "_site"

$stdout.sync = true
$stderr.sync = true

Dir.chdir(ROOT)

def run!(*cmd)
  puts "\n$ #{cmd.join(' ')}"
  system(*cmd)
  abort "Command failed: #{cmd.join(' ')}" unless $?.success?
end

def config
  @config ||= YAML.safe_load(File.read("_config.yml"), aliases: true) || {}
end

def baseurl
  @baseurl ||= config.fetch("baseurl", "").to_s.sub(%r{/\z}, "")
end

def ignored_url?(raw_url)
  url = raw_url.to_s.strip
  return true if url.empty? || url.start_with?("#", "//")
  return true if url.match?(/\A(?:mailto|tel|javascript|data|blob):/i)

  uri = URI.parse(url)
  uri.scheme && !same_site_uri?(uri)
rescue URI::InvalidURIError
  false
end

def same_site_uri?(uri)
  site = config["url"].to_s
  return false if site.empty?

  site_uri = URI.parse(site)
  uri.scheme == site_uri.scheme && uri.host == site_uri.host
rescue URI::InvalidURIError
  false
end

def clean_url_path(raw_url)
  url = raw_url.to_s.strip.sub(/[?#].*\z/, "")
  return "/" if url.empty?

  uri = URI.parse(url)
  path = uri.scheme ? uri.path : url
  path = "/" if path.nil? || path.empty?

  if baseurl != "" && (path == baseurl || path.start_with?("#{baseurl}/"))
    path = path.delete_prefix(baseurl)
    path = "/" if path.empty?
  end

  path
rescue URI::InvalidURIError
  raw_url.to_s.strip.sub(/[?#].*\z/, "")
end

def resolve_site_path(page_path, raw_url)
  path = clean_url_path(raw_url)
  relative =
    if path.start_with?("/")
      path.delete_prefix("/")
    else
      page_relative = page_path.delete_prefix("#{SITE_DIR}/")
      Pathname.new(File.join(File.dirname(page_relative), path)).cleanpath.to_s
    end

  relative = CGI.unescape(relative)
  target = File.join(SITE_DIR, relative)
  candidates = []
  candidates << File.join(target, "index.html") if path.end_with?("/") || File.directory?(target)
  candidates << target
  candidates << "#{target}.html" if File.extname(target).empty?
  candidates
end

def parse_generated_json!
  json_files = Dir.glob(File.join(SITE_DIR, "**/*.json"))
  json_files.each do |path|
    JSON.parse(File.read(path))
  rescue JSON::ParserError => error
    abort "Invalid generated JSON: #{path}\n#{error.message}"
  end
  puts "Parsed #{json_files.length} generated JSON file#{json_files.length == 1 ? '' : 's'}."
end

def check_internal_links!
  failures = []
  html_files = Dir.glob(File.join(SITE_DIR, "**/*.html")).reject { |path| path.include?("/assets/notebooks/") || path.include?("\\assets\\notebooks\\") }

  html_files.each do |page_path|
    content = File.read(page_path)
    content.scan(/\b(?:href|src)\s*=\s*(['"])(.*?)\1/i) do |_quote, raw_url|
      next if ignored_url?(raw_url)

      candidates = resolve_site_path(page_path, raw_url)
      next if candidates.any? { |candidate| File.file?(candidate) }

      failures << "#{page_path.delete_prefix("#{SITE_DIR}/")}: #{raw_url}"
    end
  end

  if failures.any?
    warn "Broken internal links or assets:"
    failures.uniq.sort.each { |failure| warn "  - #{failure}" }
    abort "Internal link scan failed with #{failures.uniq.length} broken reference#{failures.uniq.length == 1 ? '' : 's'}."
  end

  puts "Scanned #{html_files.length} generated HTML file#{html_files.length == 1 ? '' : 's'} for internal href/src references."
end

def check_ruby_syntax!
  ruby_files = Dir.glob("**/*.rb").reject do |path|
    path.start_with?("_site/", ".bundle/", "vendor/") || path.include?("/vendor/")
  end
  ruby_files.each { |path| run!("ruby", "-c", path) }
end

FileUtils.rm_rf(SITE_DIR)
run!("bundle", "exec", "jekyll", "build")
check_ruby_syntax!
parse_generated_json!
check_internal_links!
puts "\nSite checks passed."
