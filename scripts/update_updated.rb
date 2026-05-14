#!/usr/bin/env ruby
# Updates `updated:` front matter for models, courses, course sections, blog posts, and presentations.

require "date"
require "open3"
require "optparse"

options = {
  all: false,
  check: false,
  courses: false,
  date: Date.today.iso8601,
  models: false,
  posts: false,
  presentations: false
}

PRESENTATION_DATA_PATH = "_data/presentations.yml"
PRESENTATION_INDEX_PATH = "presentations/index.md"

parser = OptionParser.new do |opts|
  opts.banner = "Usage: ruby scripts/update_updated.rb [options] [files...]"
  opts.on("--models", "Update model files") { options[:models] = true }
  opts.on("--courses", "Update course and course section files") { options[:courses] = true }
  opts.on("--posts", "Update blog post files") { options[:posts] = true }
  opts.on("--presentations", "--Presentations", "Update presentation section files") { options[:presentations] = true }
  opts.on("--all", "Update every supported file in the selected scope") { options[:all] = true }
  opts.on("--check", "Report files that would change without writing") { options[:check] = true }
  opts.on("--date DATE", "Use a specific YYYY-MM-DD date") { |value| options[:date] = Date.iso8601(value).iso8601 }
end
parser.parse!

if !options[:models] && !options[:courses] && !options[:posts] && !options[:presentations]
  options[:models] = true
  options[:courses] = true
  options[:posts] = true
  options[:presentations] = true
end

def git_paths(*args)
  stdout, status = Open3.capture2("git", *args)
  return [] unless status.success?

  stdout.lines.map(&:strip).reject(&:empty?)
end

def changed_paths_for(*roots)
  tracked = git_paths("diff", "--name-only", "--diff-filter=ACMRTUXB", "HEAD", "--", *roots)
  untracked = git_paths("ls-files", "--others", "--exclude-standard", "--", *roots)
  (tracked + untracked).uniq
end

def normalize_path(path)
  path.tr("\\", "/")
end

def supported_model?(path)
  path.start_with?("_models/") && path.end_with?(".md") && File.file?(path)
end

def supported_course?(path)
  (path.start_with?("_courses/") || path.start_with?("_course_sections/")) &&
    path.end_with?(".md") &&
    File.file?(path)
end

def supported_post?(path)
  path.start_with?("_posts/") && path.end_with?(".md") && File.file?(path)
end

def supported_presentation?(path)
  path.start_with?("presentations/") && path.end_with?(".md") && File.file?(path)
end

def presentation_source?(path)
  path == PRESENTATION_DATA_PATH && File.file?(path)
end

def presentation_index_path
  File.file?(PRESENTATION_INDEX_PATH) ? PRESENTATION_INDEX_PATH : nil
end

def course_parent_for(section_path)
  match = section_path.match(%r{\A_course_sections/([^/]+)/})
  return nil unless match

  parent = "_courses/#{match[1]}.md"
  File.file?(parent) ? parent : nil
end

def front_matter_match(content)
  content.match(/\A---\r?\n(.*?)\r?\n---\r?\n/m)
end

def updated_front_matter(front_matter, date, line_ending)
  if front_matter.match?(/^updated:\s*.*$/)
    front_matter.sub(/^updated:\s*.*$/, "updated: #{date}")
  elsif front_matter.match?(/^date:\s*.*$/)
    front_matter.sub(/^(date:\s*.*)(\r?\n|$)/, "\\1#{line_ending}updated: #{date}\\2")
  elsif front_matter.match?(/^title:\s*.*$/)
    front_matter.sub(/^(title:\s*.*)(\r?\n|$)/, "\\1#{line_ending}updated: #{date}\\2")
  else
    "updated: #{date}#{line_ending}#{front_matter}"
  end
end

def write_updated(path, date, check:)
  original = File.read(path)
  match = front_matter_match(original)
  return [:skipped, "#{path} (missing front matter)"] unless match

  front_matter = match[1]
  line_ending = original.include?("\r\n") ? "\r\n" : "\n"
  replacement = updated_front_matter(front_matter, date, line_ending)
  return [:unchanged, path] if replacement == front_matter

  File.write(path, original.sub(front_matter, replacement)) unless check
  [:updated, path]
end

paths = if options[:all]
  selected = []
  selected.concat(Dir.glob("_models/**/*.md")) if options[:models]
  if options[:courses]
    selected.concat(Dir.glob("_courses/**/*.md"))
    selected.concat(Dir.glob("_course_sections/**/*.md"))
  end
  selected.concat(Dir.glob("_posts/**/*.md")) if options[:posts]
  selected.concat(Dir.glob("presentations/**/*.md")) if options[:presentations]
  selected
elsif ARGV.any?
  ARGV
else
  selected = []
  selected.concat(changed_paths_for("_models")) if options[:models]
  selected.concat(changed_paths_for("_courses", "_course_sections")) if options[:courses]
  selected.concat(changed_paths_for("_posts")) if options[:posts]
  selected.concat(changed_paths_for("presentations", PRESENTATION_DATA_PATH)) if options[:presentations]
  selected
end

paths = paths.map { |path| normalize_path(path) }
if options[:presentations]
  presentation_paths = paths
    .select { |path| presentation_source?(path) }
    .map { presentation_index_path }
    .compact
  paths.concat(presentation_paths)
end

paths = paths.select do |path|
  (options[:models] && supported_model?(path)) ||
    (options[:courses] && supported_course?(path)) ||
    (options[:posts] && supported_post?(path)) ||
    (options[:presentations] && supported_presentation?(path))
end

if options[:courses]
  parent_paths = paths
    .select { |path| path.start_with?("_course_sections/") }
    .map { |path| course_parent_for(path) }
    .compact
  paths.concat(parent_paths)
end

paths = paths.uniq.sort

if paths.empty?
  puts "No changed supported files found."
  exit 0
end

updated = []
skipped = []

paths.each do |path|
  status, message = write_updated(path, options[:date], check: options[:check])
  updated << message if status == :updated
  skipped << message if status == :skipped
end

verb = options[:check] ? "Would update" : "Updated"
updated.each { |path| puts "#{verb}: #{path}" }
skipped.each { |message| warn "Skipped: #{message}" }
puts "#{verb} #{updated.length} file#{updated.length == 1 ? '' : 's'}."
