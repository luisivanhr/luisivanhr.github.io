#!/usr/bin/env ruby
# Updates `updated:` in changed model front matter.

require "date"
require "open3"
require "optparse"

options = {
  all: false,
  check: false,
  date: Date.today.iso8601
}

parser = OptionParser.new do |opts|
  opts.banner = "Usage: ruby scripts/update_model_updated.rb [options] [files...]"
  opts.on("--all", "Update every _models/*.md file") { options[:all] = true }
  opts.on("--check", "Report files that would change without writing") { options[:check] = true }
  opts.on("--date DATE", "Use a specific YYYY-MM-DD date") { |value| options[:date] = Date.iso8601(value).iso8601 }
end
parser.parse!

def git_paths(*args)
  stdout, status = Open3.capture2("git", *args)
  return [] unless status.success?

  stdout.lines.map(&:strip).reject(&:empty?)
end

def changed_model_paths
  tracked = git_paths("diff", "--name-only", "--diff-filter=ACMRTUXB", "HEAD", "--", "_models")
  untracked = git_paths("ls-files", "--others", "--exclude-standard", "--", "_models")
  (tracked + untracked).uniq
end

paths = if options[:all]
  Dir.glob("_models/**/*.md")
elsif ARGV.any?
  ARGV
else
  changed_model_paths
end

paths = paths
  .map { |path| path.tr("\\", "/") }
  .select { |path| path.start_with?("_models/") && path.end_with?(".md") && File.file?(path) }
  .uniq

if paths.empty?
  puts "No changed model files found."
  exit 0
end

updated = []
skipped = []

paths.each do |path|
  original = File.read(path)
  match = original.match(/\A---\r?\n(.*?)\r?\n---\r?\n/m)

  unless match
    skipped << "#{path} (missing front matter)"
    next
  end

  front_matter = match[1]
  line_ending = original.include?("\r\n") ? "\r\n" : "\n"

  replacement = if front_matter.match?(/^updated:\s*.*$/)
    front_matter.sub(/^updated:\s*.*$/, "updated: #{options[:date]}")
  elsif front_matter.match?(/^date:\s*.*$/)
    front_matter.sub(/^(date:\s*.*)(\r?\n|$)/, "\\1#{line_ending}updated: #{options[:date]}\\2")
  elsif front_matter.match?(/^title:\s*.*$/)
    front_matter.sub(/^(title:\s*.*)(\r?\n|$)/, "\\1#{line_ending}updated: #{options[:date]}\\2")
  else
    "updated: #{options[:date]}#{line_ending}#{front_matter}"
  end

  next if replacement == front_matter

  next_content = original.sub(front_matter, replacement)
  File.write(path, next_content) unless options[:check]
  updated << path
end

verb = options[:check] ? "Would update" : "Updated"
updated.each { |path| puts "#{verb}: #{path}" }
skipped.each { |message| warn "Skipped: #{message}" }
puts "#{verb} #{updated.length} file#{updated.length == 1 ? '' : 's'}."
