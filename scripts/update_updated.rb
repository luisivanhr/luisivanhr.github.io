#!/usr/bin/env ruby
# Updates `updated:` front matter and maintains generated News event entries.

require "date"
require "digest"
require "fileutils"
require "open3"
require "optparse"
require "yaml"

TODAY = Date.today.iso8601
STATE_PATH = "_news_state/news_update_state.yml"
NEWS_INDEX_PATH = "news/index.md"
NEWS_GENERATED_DIR = "_news/generated"

SECTION_LABELS = {
  "about" => "About",
  "achievements" => "Achievements",
  "blog" => "Blog",
  "courses" => "Courses",
  "cv" => "CV",
  "hobbies" => "Hobbies",
  "models" => "Models",
  "news" => "News",
  "presentations" => "Presentations",
  "publications" => "Publications"
}.freeze

LANDING_PAGES = {
  "about" => "about/index.md",
  "achievements" => "achievements/index.md",
  "blog" => "blog/index.md",
  "courses" => "courses/index.md",
  "cv" => "cv/index.md",
  "hobbies" => "hobbies/index.md",
  "models" => "models/index.md",
  "presentations" => "presentations/index.md",
  "publications" => "publications/index.md"
}.freeze

LANDING_URLS = {
  "about" => "/about/",
  "achievements" => "/achievements/",
  "blog" => "/blog/",
  "courses" => "/courses/",
  "cv" => "/cv/",
  "hobbies" => "/hobbies/",
  "models" => "/models/",
  "presentations" => "/presentations/",
  "publications" => "/publications/"
}.freeze

DATA_SOURCES = {
  "presentations" => { path: "_data/presentations.yml", landing: "presentations/index.md", url: "/presentations/" },
  "publications" => { path: "_data/publications.yml", landing: "publications/index.md", url: "/publications/" },
  "hobbies" => { path: "_data/hobbies.yml", landing: "hobbies/index.md", url: "/hobbies/" },
  "cv" => { path: "_data/cv.yml", landing: "cv/index.md", url: "/cv/" }
}.freeze

SCOPE_ROOTS = {
  models: ["_models"],
  courses: ["_courses", "_course_sections"],
  posts: ["_posts"],
  presentations: ["presentations", DATA_SOURCES["presentations"][:path]],
  about: ["about", "_about"],
  publications: ["publications", DATA_SOURCES["publications"][:path]],
  achievements: ["achievements", "_achievements"],
  hobbies: ["hobbies", "_hobbies", DATA_SOURCES["hobbies"][:path]],
  cv: ["cv", DATA_SOURCES["cv"][:path]],
  news: ["_news", "news"]
}.freeze

options = {
  all: false,
  check: false,
  date: TODAY,
  models: false,
  courses: false,
  posts: false,
  presentations: false,
  about: false,
  publications: false,
  achievements: false,
  hobbies: false,
  cv: false,
  news: false
}

parser = OptionParser.new do |opts|
  opts.banner = "Usage: ruby scripts/update_updated.rb [options] [files...]"
  opts.on("--models", "Update model files") { options[:models] = true }
  opts.on("--courses", "Update course and course section files") { options[:courses] = true }
  opts.on("--posts", "Update blog post files") { options[:posts] = true }
  opts.on("--presentations", "--Presentations", "Update presentation section files") { options[:presentations] = true }
  opts.on("--about", "Update about section files") { options[:about] = true }
  opts.on("--publications", "Update publication section files") { options[:publications] = true }
  opts.on("--achievements", "Update achievement section files") { options[:achievements] = true }
  opts.on("--hobbies", "Update hobby section files") { options[:hobbies] = true }
  opts.on("--cv", "Update CV section files") { options[:cv] = true }
  opts.on("--news", "Refresh News metadata without generating News-about-News entries") { options[:news] = true }
  opts.on("--all", "Update every supported file in the selected scope and backfill generated News events") { options[:all] = true }
  opts.on("--check", "Report files and generated News entries that would change without writing") { options[:check] = true }
  opts.on("--date DATE", "Use a specific YYYY-MM-DD date") { |value| options[:date] = Date.iso8601(value).iso8601 }
end
parser.parse!

scope_keys = SCOPE_ROOTS.keys
if scope_keys.none? { |key| options[key] }
  scope_keys.each { |key| options[key] = true }
end

def normalize_path(path)
  path.tr("\\", "/")
end

def git_paths(*args)
  stdout, status = Open3.capture2("git", *args)
  return [] unless status.success?

  stdout.lines.map(&:strip).reject(&:empty?)
end

def git_blob(path)
  stdout, _stderr, status = Open3.capture3("git", "show", "HEAD:#{path}")
  status.success? ? stdout : nil
end

def git_status_entries(*roots)
  entries = []
  stdout, status = Open3.capture2("git", "diff", "--name-status", "--find-renames", "HEAD", "--", *roots)
  if status.success?
    stdout.each_line do |line|
      parts = line.strip.split(/\t/)
      next if parts.empty?

      code = parts[0]
      if code.start_with?("R")
        old_path = normalize_path(parts[1])
        new_path = normalize_path(parts[2])
        entries << { status: "D", path: old_path, old_path: nil }
        entries << { status: "A", path: new_path, old_path: old_path }
      else
        entries << { status: code[0], path: normalize_path(parts[1] || parts[0]), old_path: nil }
      end
    end
  end

  git_paths("ls-files", "--others", "--exclude-standard", "--", *roots).each do |path|
    entries << { status: "A", path: normalize_path(path), old_path: nil, untracked: true }
  end

  entries
end

def front_matter_match(content)
  content&.match(/\A---\r?\n(.*?)\r?\n---\r?\n/m)
end

def read_document_data(path, deleted: false)
  content = deleted ? git_blob(path) : (File.file?(path) ? File.read(path) : nil)
  match = front_matter_match(content)
  return {} unless match

  YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: true) || {}
rescue Psych::SyntaxError
  {}
end

def without_updated_lines(content)
  content.to_s.gsub(/\r\n?/, "\n").lines.reject { |line| line.match?(/\Aupdated:\s*.*\n?\z/) }.join
end

def only_updated_changed?(path)
  return false unless File.file?(path)

  previous = git_blob(path)
  return false unless previous

  without_updated_lines(previous) == without_updated_lines(File.read(path))
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

def supported_model?(path)
  path.start_with?("_models/") && path.end_with?(".md")
end

def supported_course_parent?(path)
  path.start_with?("_courses/") && path.end_with?(".md")
end

def supported_course_section?(path)
  path.start_with?("_course_sections/") && path.end_with?(".md")
end

def supported_post?(path)
  path.start_with?("_posts/") && path.end_with?(".md")
end

def supported_section_item?(path)
  (path.start_with?("_about/") || path.start_with?("_achievements/") || path.start_with?("_hobbies/")) &&
    path.end_with?(".md")
end

def supported_section_page?(path)
  LANDING_PAGES.value?(path) && path != NEWS_INDEX_PATH
end

def generated_news_path?(path)
  path.start_with?("#{NEWS_GENERATED_DIR}/")
end

def manual_news_path?(path)
  path.start_with?("_news/") && path.end_with?(".md") && !generated_news_path?(path)
end

def course_parent_for(section_path)
  match = section_path.match(%r{\A_course_sections/([^/]+)/})
  return nil unless match

  parent = "_courses/#{match[1]}.md"
  parent if File.file?(parent)
end

def source_kind_for(path)
  return "models" if supported_model?(path)
  return "courses" if supported_course_parent?(path) || supported_course_section?(path)
  return "blog" if supported_post?(path)
  return "about" if path.start_with?("_about/") || path == LANDING_PAGES["about"]
  return "achievements" if path.start_with?("_achievements/") || path == LANDING_PAGES["achievements"]
  return "hobbies" if path.start_with?("_hobbies/") || path == LANDING_PAGES["hobbies"]
  return "presentations" if path == DATA_SOURCES["presentations"][:path] || path == LANDING_PAGES["presentations"]
  return "publications" if path == DATA_SOURCES["publications"][:path] || path == LANDING_PAGES["publications"]
  return "cv" if path == DATA_SOURCES["cv"][:path] || path == LANDING_PAGES["cv"]

  nil
end

def slugify(value)
  value.to_s.downcase.gsub(/['"]/, "").gsub(/[^a-z0-9]+/, "-").gsub(/\A-|-+\z/, "")
end

def titleize_slug(slug)
  slug.to_s.split("-").map(&:capitalize).join(" ")
end

def path_slug(path)
  File.basename(path, ".md").sub(/\A\d{4}-\d{2}-\d{2}-/, "")
end

def jekyll_url_for(path)
  if supported_model?(path)
    "/models/#{path_slug(path)}/"
  elsif supported_course_parent?(path)
    "/courses/#{path_slug(path)}/"
  elsif supported_course_section?(path)
    "/courses/#{path.sub(%r{\A_course_sections/}, "").sub(/\.md\z/, "")}/"
  elsif supported_post?(path)
    slug = path_slug(path)
    if (match = File.basename(path).match(/\A(\d{4})-(\d{2})-(\d{2})-/))
      "/#{match[1]}/#{match[2]}/#{match[3]}/#{slug}/"
    else
      "/blog/"
    end
  elsif path.start_with?("_about/")
    "/about/"
  elsif path.start_with?("_achievements/")
    "/achievements/#{path_slug(path)}/"
  elsif path.start_with?("_hobbies/")
    "/hobbies/#{path_slug(path)}/"
  else
    LANDING_URLS[source_kind_for(path)] || "/"
  end
end

def event_type_for(path, status)
  action = status == "D" ? "deleted" : (status == "A" ? "added" : "updated")
  if supported_course_section?(path) || supported_section_item?(path)
    "section_#{action}"
  elsif supported_section_page?(path)
    "page_updated"
  else
    "parent_#{action}"
  end
end

def event_label(event_type)
  event_type.tr("_", " ").capitalize
end

def item_kind_for(section, event_type)
  return "section" unless event_type.start_with?("parent_")

  case section
  when "blog"
    "post"
  when "courses"
    "course"
  when "models"
    "model"
  else
    SECTION_LABELS[section].to_s.downcase
  end
end

def display_event_label(section, event_type)
  action = event_type.split("_").last
  if event_type.start_with?("parent_")
    "#{item_kind_for(section, event_type)} #{action}".capitalize
  elsif event_type.start_with?("section_")
    "Section #{action}"
  elsif event_type == "page_updated"
    "Page updated"
  else
    event_label(event_type)
  end
end

def summarize_event(event_type, title, section_label, parent_title = nil)
  case event_type
  when "parent_added"
    "#{title} is now available in #{section_label}."
  when "parent_updated"
    "#{title} has been updated in #{section_label}."
  when "parent_deleted"
    "#{title} has been removed from #{section_label}."
  when "section_added"
    parent_title ? "#{title} has been added to #{parent_title} in #{section_label}." : "#{title} has been added in #{section_label}."
  when "section_updated"
    parent_title ? "#{title} in #{parent_title} has been updated in #{section_label}." : "#{title} has been updated in #{section_label}."
  when "section_deleted"
    parent_title ? "#{title} has been removed from #{parent_title} in #{section_label}." : "#{title} has been removed from #{section_label}."
  when "page_updated"
    "#{section_label} has been updated."
  else
    "#{title} has changed in #{section_label}."
  end
end

def make_event(section:, event_type:, source_path:, source_id:, title:, date:, summary:, url:, image: nil)
  clean_source_id = slugify(source_id)
  event_id = "#{section}:#{clean_source_id}:#{event_type}:#{date}"
  {
    "event_id" => event_id,
    "event_type" => event_type,
    "event_label" => display_event_label(section, event_type),
    "title" => title,
    "summary" => summary,
    "date" => date,
    "updated" => date,
    "source_section" => section,
    "source_path" => source_path,
    "source_id" => clean_source_id,
    "url" => url,
    "source_url" => url,
    "image" => image,
    "generated" => true
  }
end

def content_event_for(entry, date)
  path = entry[:path]
  return nil if generated_news_path?(path) || manual_news_path?(path) || path == NEWS_INDEX_PATH
  return nil unless supported_model?(path) || supported_course_parent?(path) || supported_course_section?(path) ||
                    supported_post?(path) || supported_section_item?(path) || supported_section_page?(path)

  section = source_kind_for(path)
  return nil unless section

  deleted = entry[:status] == "D"
  data = read_document_data(path, deleted: deleted)
  event_type = event_type_for(path, entry[:status])
  source_id = data["id"] || path_slug(path)
  item_title = data["news_title"] || data["title"] || titleize_slug(path_slug(path))
  section_label = SECTION_LABELS[section]
  event_title = if event_type == "page_updated"
                  "#{section_label} updated"
                else
                  "#{display_event_label(section, event_type)}: #{item_title}"
                end

  parent_title = nil
  if supported_course_section?(path)
    parent_path = course_parent_for(path)
    parent_data = parent_path ? read_document_data(parent_path) : {}
    parent_title = parent_data["title"] || titleize_slug(path.split("/")[1])
  end

  summary = data["news_summary"] || data["update_note"] || data["summary"] || data["excerpt"] ||
            summarize_event(event_type, item_title, section_label, parent_title)
  url = deleted ? (LANDING_URLS[section] || "/") : (data["source_url"] || data["url"] || jekyll_url_for(path))
  image = data["news_image"] || data["feed_image"] || data["image"]

  make_event(
    section: section,
    event_type: event_type,
    source_path: path,
    source_id: source_id,
    title: event_title,
    date: date,
    summary: summary,
    url: url,
    image: image
  )
end

def normalize_for_hash(value)
  case value
  when Hash
    value.keys.map(&:to_s).sort.each_with_object({}) do |key, result|
      result[key] = normalize_for_hash(value[key] || value[key.to_sym])
    end
  when Array
    value.map { |item| normalize_for_hash(item) }
  when Date, Time
    value.iso8601
  else
    value
  end
end

def data_item_hash(item)
  Digest::SHA256.hexdigest(YAML.dump(normalize_for_hash(item)))
end

def data_item_enabled?(item)
  ![false, "false", "FALSE", 0, "0"].include?(item["news_enabled"])
end

def first_present(*values)
  values.find { |value| !value.nil? && value.to_s.strip != "" }
end

def collect_data_items(value, source, config, parent_key = nil, items = [])
  case value
  when Array
    value.each { |child| collect_data_items(child, source, config, parent_key, items) }
  when Hash
    if value["id"]
      id = value["id"].to_s
      title = first_present(value["news_title"], value["title"], value["name"], value["category"], value["language"], value["label"], id)
      date = first_present(value["date"], value["sort_date"], value["date_start"], value["updated"], TODAY)
      updated = first_present(value["updated"], date)
      summary = first_present(value["news_summary"], value["update_note"], value["summary"], value["description"], value["event"], value["authors"])
      image = first_present(value["news_image"], value["image"], value["summary_image"], value["cover"])
      items << {
        "id" => id,
        "hash" => data_item_hash(value),
        "title" => title.to_s,
        "date" => date.to_s,
        "updated" => updated.to_s,
        "summary" => summary.to_s,
        "image" => image&.to_s,
        "enabled" => data_item_enabled?(value),
        "source_path" => config[:path],
        "url" => first_present(value["source_url"], value["url"], config[:url]).to_s,
        "category" => parent_key.to_s
      }
    end

    value.each do |key, child|
      collect_data_items(child, source, config, key, items) if child.is_a?(Array) || child.is_a?(Hash)
    end
  end

  items
end

def current_data_items(source, config)
  return {} unless File.file?(config[:path])

  loaded = YAML.safe_load(File.read(config[:path]), permitted_classes: [Date, Time], aliases: true) || {}
  collect_data_items(loaded, source, config).each_with_object({}) do |item, result|
    result[item["id"]] = item
  end
rescue Psych::SyntaxError
  {}
end

def load_state
  return { "version" => 1, "data_items" => {} } unless File.file?(STATE_PATH)

  YAML.safe_load(File.read(STATE_PATH), permitted_classes: [Date, Time], aliases: true) || { "version" => 1, "data_items" => {} }
rescue Psych::SyntaxError
  { "version" => 1, "data_items" => {} }
end

def write_state(state, check:)
  return [:unchanged, STATE_PATH] if check

  next_content = YAML.dump(state)
  return [:unchanged, STATE_PATH] if File.file?(STATE_PATH) && File.read(STATE_PATH) == next_content

  FileUtils.mkdir_p(File.dirname(STATE_PATH))
  File.write(STATE_PATH, next_content)
  [:updated, STATE_PATH]
end

def data_event_title(source, event_type, title)
  "#{display_event_label(source, event_type)}: #{title}"
end

def data_event_summary(event_type, item, section)
  section_label = SECTION_LABELS[section]
  return item["summary"] if item["summary"] && item["summary"].strip != ""

  summarize_event(event_type, item["title"], section_label)
end

def data_events_for(source, current_items, previous_items, state_known, date, all:)
  events = []

  if all
    current_items.each_value do |item|
      next unless item["enabled"]

      events << make_event(
        section: source,
        event_type: "section_added",
        source_path: item["source_path"],
        source_id: item["id"],
        title: data_event_title(source, "section_added", item["title"]),
        date: item["date"] || date,
        summary: data_event_summary("section_added", item, source),
        url: item["url"],
        image: item["image"]
      )
    end
    return events
  end

  return events unless state_known

  current_items.each do |id, item|
    previous = previous_items[id]
    next unless item["enabled"]

    event_type = if previous.nil? || previous["enabled"] == false
                   "section_added"
                 elsif previous["hash"] != item["hash"]
                   "section_updated"
                 end
    next unless event_type

    events << make_event(
      section: source,
      event_type: event_type,
      source_path: item["source_path"],
      source_id: id,
      title: data_event_title(source, event_type, item["title"]),
      date: date,
      summary: data_event_summary(event_type, item, source),
      url: item["url"],
      image: item["image"]
    )
  end

  previous_items.each do |id, item|
    next if current_items.key?(id)
    next if item["enabled"] == false

    events << make_event(
      section: source,
      event_type: "section_deleted",
      source_path: item["source_path"],
      source_id: id,
      title: data_event_title(source, "section_deleted", item["title"]),
      date: date,
      summary: summarize_event("section_deleted", item["title"], SECTION_LABELS[source]),
      url: LANDING_URLS[source],
      image: item["image"]
    )
  end

  events
end

def generated_news_file_path(event)
  "#{NEWS_GENERATED_DIR}/#{slugify(event["event_id"])}.md"
end

def news_front_matter(event)
  data = event.reject { |_key, value| value.nil? || value == "" }
  YAML.dump(data).sub(/\A---\s*\n/, "")
end

def build_news_markdown(event)
  "---\n#{news_front_matter(event)}---\n#{event["summary"]}\n"
end

def write_generated_news(event, check:)
  path = generated_news_file_path(event)
  content = build_news_markdown(event)
  return [:unchanged, path] if File.file?(path) && File.read(path) == content

  unless check
    FileUtils.mkdir_p(NEWS_GENERATED_DIR)
    File.write(path, content)
  end
  [:updated, path]
end

def existing_news_dates
  Dir.glob("_news/**/*.md").filter_map do |path|
    data = read_document_data(normalize_path(path))
    value = data["date"]
    Date.iso8601(value.to_s).iso8601 if value
  rescue Date::Error
    nil
  end
end

def sync_news_index_updated(extra_dates, check:)
  return [:unchanged, NEWS_INDEX_PATH] unless File.file?(NEWS_INDEX_PATH)

  latest = (existing_news_dates + extra_dates.compact).max
  return [:unchanged, NEWS_INDEX_PATH] unless latest

  write_updated(NEWS_INDEX_PATH, latest, check: check)
end

def selected_all_paths(options)
  paths = []
  paths.concat(Dir.glob("_models/**/*.md")) if options[:models]
  if options[:courses]
    paths.concat(Dir.glob("_courses/**/*.md"))
    paths.concat(Dir.glob("_course_sections/**/*.md"))
  end
  paths.concat(Dir.glob("_posts/**/*.md")) if options[:posts]
  paths.concat(Dir.glob("presentations/**/*.md")) if options[:presentations]
  paths.concat(Dir.glob("_about/**/*.md")) if options[:about]
  paths << LANDING_PAGES["about"] if options[:about]
  paths.concat(Dir.glob("_achievements/**/*.md")) if options[:achievements]
  paths << LANDING_PAGES["achievements"] if options[:achievements]
  paths.concat(Dir.glob("_hobbies/**/*.md")) if options[:hobbies]
  paths << LANDING_PAGES["hobbies"] if options[:hobbies]
  paths << LANDING_PAGES["publications"] if options[:publications]
  paths << LANDING_PAGES["presentations"] if options[:presentations]
  paths << LANDING_PAGES["cv"] if options[:cv]
  paths
end

selected_roots = scope_keys.select { |key| options[key] }.flat_map { |key| SCOPE_ROOTS[key] }.uniq

entries =
  if options[:all]
    selected_all_paths(options).map { |path| { status: "A", path: normalize_path(path), old_path: nil, all: true } }
  elsif ARGV.any?
    ARGV.map do |path|
      normalized = normalize_path(path)
      { status: File.file?(normalized) ? "M" : "D", path: normalized, old_path: nil }
    end
  else
    git_status_entries(*selected_roots)
  end

entries = entries.uniq { |entry| [entry[:status], entry[:path]] }

paths_to_update = []
landing_updates = []
events = []

entries.each do |entry|
  path = entry[:path]
  status = entry[:status]
  current_file = status != "D" && File.file?(path)

  if current_file && (supported_model?(path) || supported_course_parent?(path) || supported_course_section?(path) ||
                      supported_post?(path) || supported_section_item?(path) || supported_section_page?(path))
    paths_to_update << path
  end

  section = source_kind_for(path)
  landing_updates << LANDING_PAGES[section] if section && LANDING_PAGES[section] && path != LANDING_PAGES[section]

  if supported_course_section?(path)
    paths_to_update << course_parent_for(path)
    landing_updates << LANDING_PAGES["courses"]
  end

  event = only_updated_changed?(path) ? nil : content_event_for(entry, options[:date])
  events << event if event
end

selected_data_sources = DATA_SOURCES.select { |source, _config| options[source.to_sym] }
changed_data_paths = entries.map { |entry| entry[:path] } & selected_data_sources.values.map { |config| config[:path] }

state = load_state
state["version"] = 1
state["data_items"] ||= {}

selected_data_sources.each do |source, config|
  current_items = current_data_items(source, config)
  state_known = state["data_items"].key?(source)
  previous_items = state["data_items"][source] || {}

  if options[:all] || changed_data_paths.include?(config[:path])
    events.concat(data_events_for(source, current_items, previous_items, state_known, options[:date], all: options[:all]))
    landing_updates << config[:landing]
  end

  state["data_items"][source] = current_items
end

paths = (paths_to_update + landing_updates).compact.uniq
paths.select! { |path| File.file?(path) && path.end_with?(".md") && path != NEWS_INDEX_PATH && !generated_news_path?(path) && !manual_news_path?(path) }
paths.sort!

updated = []
skipped = []
unchanged_generated = 0

paths.each do |path|
  status, message = write_updated(path, options[:date], check: options[:check])
  updated << message if status == :updated
  skipped << message if status == :skipped
end

events.uniq! { |event| event["event_id"] }

events.each do |event|
  status, path = write_generated_news(event, check: options[:check])
  if status == :updated
    updated << path
  else
    unchanged_generated += 1
  end
end

news_status, news_message = sync_news_index_updated(events.map { |event| event["date"] }, check: options[:check])
updated << news_message if news_status == :updated

state_status, state_message = write_state(state, check: options[:check])
updated << state_message if state_status == :updated

verb = options[:check] ? "Would update" : "Updated"

if updated.empty? && skipped.empty? && events.empty?
  puts "No changed supported files found."
else
  updated.each { |path| puts "#{verb}: #{path}" }
  skipped.each { |message| warn "Skipped: #{message}" }
  puts "#{verb} #{updated.length} file#{updated.length == 1 ? '' : 's'}."
  puts "Generated #{events.length} news event#{events.length == 1 ? '' : 's'}#{unchanged_generated.positive? ? " (#{unchanged_generated} already current)" : ""}."
end
