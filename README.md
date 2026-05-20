# Interactive Desk Site

This is a Jekyll static site with an interactive homepage and section pages for academic, teaching, research, and personal content.

## Quick Start

Run the site locally:

```bash
bundle install
bundle exec jekyll serve --host 127.0.0.1 --port 4000
```

Run the full portable validation before publishing:

```bash
ruby scripts/check_site.rb
```

That command builds the site, checks Ruby syntax, parses generated JSON, and scans internal links. GitHub Actions calls the same script, so this is the source of truth for CI.

## Daily Editing Workflow

1. Edit the section's source file or data file.
2. Preview metadata/news changes with the matching dry run:

   ```bash
   ruby scripts/update_updated.rb --check --models
   ```

3. Apply the update when the dry run looks right:

   ```bash
   ruby scripts/update_updated.rb --models
   ```

4. Run the portable check:

   ```bash
   ruby scripts/check_site.rb
   ```

Use `date:` for original creation or publication date. Use `updated:` for the latest meaningful edit. Keep stable `id` values in data files; changing an `id` is treated like deleting one item and adding another.

## Before Publishing Checklist

- Run the site locally and click the edited section.
- Run the matching `scripts/update_updated.rb --check` command.
- Apply the update script only after the dry run looks right.
- Run `ruby scripts/check_site.rb`.
- Confirm new links, images, PDFs, and notebooks open from the generated page.
- Avoid committing `_site/`; it is generated output.

## Source Of Truth

| Type | Sections | Edit here |
| --- | --- | --- |
| Collection-driven | Blog, Models, Courses, Course sections, News | `_posts/`, `_models/`, `_courses/`, `_course_sections/`, `_news/` |
| Data-driven | Publications, Presentations, Achievements, Hobbies, CV | `_data/publications.yml`, `_data/presentations.yml`, `_data/achievements.yml`, `_data/hobbies.yml`, `_data/cv.yml` |
| Hard-coded stable teaser | About | `about/index.md`, `_layouts/about.html`, and homepage-owned markup |
| Generated output | Built site and generated feeds | `_site/`, `_news/generated/`, generated `/data/*.json` output |

Do not recreate old collection folders for Publications, Hobbies, or Achievements. They are intentionally data-driven and do not have homepage hover feeds.

## Section Recipes

| Section | Add or update content | Delete content | Update command |
| --- | --- | --- | --- |
| About | Edit the About page/layout directly. Use this for name, photo, bio, and research-interest copy. | Remove the text, image, or block from the owning markup. | `ruby scripts/update_updated.rb --about` only if you want About metadata/news refreshed. |
| Blog | Add a dated Markdown file in `_posts/`. Use `categories`, `tags`, `summary`, optional `image`, `materials`, `notebook`, and `citation` front matter as needed. | Delete the post file and remove any now-empty category page under `blog/category/`. | `ruby scripts/update_updated.rb --posts` |
| News | Add manual News cards in `_news/` or `_news/manual/`. Generated cards are created by the update script. | Delete manual News files manually. Do not hand-edit generated News unless repairing output. | `ruby scripts/update_updated.rb --news` for News page metadata. Other scopes generate section news. |
| Courses | Add a course parent file in `_courses/`. Use front matter for title, summary, track, status, image, section list, and updates. | Delete the course file, its matching `_course_sections/<course>/` folder, and stale links from course data/navigation. | `ruby scripts/update_updated.rb --courses` |
| Course sections | Add Markdown files under `_course_sections/<course>/`. Use `course_title`, `course_url`, section metadata, and previous/next links. | Delete the section file and remove it from the course parent's `sections` list. | `ruby scripts/update_updated.rb --courses` |
| Models | Add Markdown files in `_models/`. Use `summary`, `image`, `model_type`, `domain`, `language`, `inputs`, `outputs`, `maturity`, `tags`, and `resources`. | Delete the model file and any unused thumbnail/assets. | `ruby scripts/update_updated.rb --models` |
| Publications | Edit `_data/publications.yml`. Keep each `id` stable. Use title, authors, year, category, citation HTML, links, status, summary, and image fields. | Remove the item from the YAML file. | `ruby scripts/update_updated.rb --publications` |
| Presentations | Edit `_data/presentations.yml`. Keep each `id` stable. Use event, format, mode, date labels, links, topics, and filters. | Remove the item from the YAML file. | `ruby scripts/update_updated.rb --presentations` |
| Achievements | Edit `_data/achievements.yml`. Add items under `academic` or `non_academic` groups. | Remove the item from the YAML file. | `ruby scripts/update_updated.rb --achievements` |
| Hobbies | Edit `_data/hobbies.yml`. Use `appid` for Steam games; use `url` plus `image` for non-Steam games. Keep dated coffee, cooking, and book entries in `YYYY-MM-DD` format. | Remove the item from the YAML file and remove unused local images. | `ruby scripts/update_updated.rb --hobbies` |
| CV | Edit `_data/cv.yml`. Keep stable item IDs for timeline entries, action links, skills, languages, and summary bullets. | Remove the item from the YAML file and any unused linked asset. | `ruby scripts/update_updated.rb --cv` |
| Navigation | Edit `_data/nav.yml`. The top nav and classic fallback read from the same file. | Remove the nav entry from `_data/nav.yml`. | Usually none, unless the target section changed too. |
| Blackboard equations | Edit `data/equations.json`. KaTeX is loaded by the default layout. | Remove the equation object from the JSON file. | Run `ruby scripts/check_site.rb` to catch JSON errors. |

Only edit layout, CSS, or JavaScript files when changing structure, behavior, or visual design. Normal content changes should stay in collections or `_data/*.yml`.

## Asset Locations And Naming

Use lowercase kebab-case names, for example `renewal-hawkes-poster.jpg` or `copula-intro-notebook.html`. Prefer root-relative paths in content and data files, such as `/assets/thumbs/models/model-name.png`.

| Asset type | Recommended location |
| --- | --- |
| Site default images | `assets/images/` |
| Desk background | `assets/images/desk/` |
| Hobby images | `assets/images/hobbies/` |
| Publication images | `assets/images/publications/` |
| Blog thumbnails | `assets/thumbs/blog/` |
| Model thumbnails | `assets/thumbs/models/` |
| Homepage/feed thumbnails | `assets/thumbs/` or `assets/thumbs/hover-feeds/` |
| Notebook exports | `assets/notebooks/` |
| Icons | `assets/icons/` |

If an asset is only used by one content item, name it after that item. If an asset is shared, give it a generic name and avoid deleting it during cleanup.

## Data File Examples

Use these as shape references, not strict schemas. Keep indentation consistent and keep `id` values stable.

Publication:

```yaml
- id: renewal-hawkes-rates
  date: 2025-07-01
  updated: 2025-07-01
  title: "Renewal Hawkes Process Convergence Rates"
  authors: "Luis Ivan Hernandez Ruiz"
  year: 2025
  category: "Hawkes processes"
  citation_html: "Author. <em>Journal or preprint</em>, 2025."
  url: "https://example.com"
  summary: "One-sentence public summary."
  summary_image: "/assets/images/publications/renewal-hawkes-rates.jpg"
```

Presentation:

```yaml
- id: renewal-hawkes-talk
  date: 2025-03-24
  updated: 2025-03-24
  title: "Renewal Hawkes Processes"
  event: "Workshop or seminar name"
  format: "talk"
  date_label: "2025/03/24"
  date_start: "2025-03-24"
  slides_url: "https://example.com/slides.pdf"
  topics: ["Hawkes processes"]
```

Achievement:

```yaml
academic:
  - title: "Scholarships and Awards"
    icon: "award"
    items:
      - id: mext-scholarship
        date: 2024-04-01
        updated: 2024-04-01
        title: "MEXT Scholarship"
        summary: "Short factual description."
```

Hobby entry:

```yaml
coffee:
  - id: ethiopia-guji-natural
    date: 2026-05-14
    title: "Ethiopia Guji Natural"
    roaster: "Roaster name"
    summary: "Short tasting note."
    image: "/assets/images/hobbies/ethiopia-guji-natural.jpg"
```

CV entry:

```yaml
education:
  - id: kyoto-doctor
    date: 2024-03-31
    updated: 2024-03-31
    year: "2024"
    title: "Doctor in Mathematics - Kyoto University"
    summary: "Short description of the program or thesis area."
```

## News And Updates

`scripts/update_updated.rb` updates `updated:` metadata and maintains generated News cards. Use `--check` before writing files.

Common scopes:

```bash
ruby scripts/update_updated.rb --models
ruby scripts/update_updated.rb --courses
ruby scripts/update_updated.rb --posts
ruby scripts/update_updated.rb --publications
ruby scripts/update_updated.rb --presentations
ruby scripts/update_updated.rb --achievements
ruby scripts/update_updated.rb --hobbies
ruby scripts/update_updated.rb --cv
```

Useful options:

- `--check` previews changes without writing.
- `--date YYYY-MM-DD` sets the update/event date.
- `--all` refreshes the selected scope and intentionally backfills generated News events.
- No scope means all supported scopes are checked.

Generated News files live in `_news/generated/`. Manual News files can live in `_news/` or `_news/manual/`. News does not render individual detail pages; `/news/` is the aggregator. If a card needs more detail, set `source_url` to the page that owns the detail.

For generated News summaries, the script uses the first available field:

1. `news_summary`
2. `update_note`
3. `summary`
4. `excerpt`
5. generated fallback text

Use `news_summary` when the News card should say something different from the page summary:

```yaml
news_summary: "A new transport emulator model was added for particle advection experiments."
```

Use `news_enabled: false` on a source item to suppress generated News for that item.

The script stores data-item history in `_news_state/news_update_state.yml`. Do not hand-edit it during normal work.

## Course Index Terms

Course index terms are generated from inline markers in course and course-section content:

```md
[[probability measure]]
[[convergence::weak convergence]]
```

Use `[[term]]` for a top-level index entry. Use `[[parent::subterm]]` for a book-style subentry. Do not maintain a separate complete `index_terms` list in `_courses/*.md`; the Courses directory, course home metadata, search matches, and generated A-Z index read from `/courses/course-index-data.json`.

## Shareable Filter URLs

Landing pages with client-side search or filters can initialize from URL query parameters. The URL is read only on page load; it does not update while typing.

| Page | Parameters |
| --- | --- |
| Blog | `q`, `category`, `year`, `month` |
| Publications | `q`, `category`, `year` |
| Presentations | `q`, `format`, `year`, `month` |
| Models | `q`, `type`, `sort` |
| Courses directory | `q`, `sort` |
| Course index pages | `q` |

Examples:

```text
/blog/?q=Wasserstein
/blog/?q=Wasserstein&category=research
/publications/?q=%22Exact%20Publication%20Title%22
/presentations/?format=poster&year=2023
/models/?type=simulation&q=transport
/courses/?q=copula
/courses/course-intro/index/?q=Markov
```

Use normal `q` values for broad search. Wrap the full `q` value in quotes for exact title or exact term matching where supported. Invalid filter values are ignored.

## Homepage Feeds And Desk Details

JSON feeds are generated through `data/*.json` pages and `_layouts/feed.json.html`. The homepage currently fetches feeds for Blog, Models, Courses, and News. Publications, Presentations, Achievements, Hobbies, and CV navigate directly without hover feeds.

The Models feed powers the rotating desk monitor. It emits the full model list sorted by `updated`; the homepage samples up to eight image-bearing models per session: the three most recent plus five randomly selected older models. If no models have images, the same rule falls back to all models.

To change homepage hotspot locations, edit `_includes/desk-hotspots.svg`. To change the desk background, replace `assets/images/desk/background.png`. To change equations on the blackboard, edit `data/equations.json`.

## Validation And CI

Use this command before publishing:

```bash
ruby scripts/check_site.rb
```

It runs:

- `bundle exec jekyll build`
- Ruby syntax checks for project Ruby scripts
- generated JSON parse checks under `_site`
- internal `href` and `src` link checks against `_site`

GitHub Actions is intentionally thin. `.github/workflows/site-ci.yml` installs Ruby dependencies and calls `ruby scripts/check_site.rb`.

## Migration To Another Host

This site is static. GitHub Pages is only the current host.

To migrate:

1. Keep the Jekyll build command:

   ```bash
   bundle exec jekyll build
   ```

2. Deploy the generated `_site/` folder to the new host.
3. Keep `ruby scripts/check_site.rb` in the new CI pipeline.
4. Update `_config.yml`:
   - `url` should match the new domain.
   - `baseurl` should be empty for a root domain or set to the subpath for subdirectory hosting.
5. Reuse the same validation command in GitLab CI, Netlify, Vercel, Cloudflare Pages, Azure Pipelines, or a local deploy script.

The important rule is that CI should call the repo script, not reimplement the checks in provider-specific YAML.

## Generated Output

`_site/` is generated by Jekyll and is intentionally ignored. Do not edit it directly.

Generated feed JSON appears under `_site/data/` after a build. The source files are the `data/*.json` Jekyll pages and `_layouts/feed.json.html`.
