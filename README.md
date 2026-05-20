# Interactive Desk Site (Jekyll)

## Quick Start

1. Push this repo to GitHub and enable GitHub Pages from the repository root.
2. In Settings > Pages > Custom domain, set your domain if needed and add the matching DNS record.
3. Replace `assets/images/desk/background.png` with your 16:9 desk background.
4. Edit hotspot positions in `_includes/desk-hotspots.svg`.
5. Tweak scene positioning in `assets/css/main.css`.
6. Add real content in the appropriate source of truth: `_posts`, `_models`, `_courses`, `_course_sections`, `_news`, or the relevant `_data/*.yml` file.

## Navigation

Navigation items live in `_data/nav.yml`. The interactive menu and `/classic/` fallback read from the same file.

## Hobbies Page Content

The `/hobbies/` page is data-driven. To add or edit cards, update `_data/hobbies.yml`.

- Add coffee tasting cards under `coffee:`.
- Add recipe cards under `cooking:`.
- Add book cards under `books:`.
- Add game rows under `games:`. Steam games can use `appid`; non-Steam games can use `url` plus `image`.
- Add fitness activity cards under `fitness:`.

Coffee, Cooking & Bread, and Books use a lightweight vault pattern: the newest dated entry is featured first, and the remaining mini deck is sampled from older entries when the page loads. Keep dates in `YYYY-MM-DD` format so the newest card sorts correctly.

Local hobby images should live in `assets/images/hobbies/` and be referenced from `_data/hobbies.yml`, for example:

```yml
image: "/assets/images/hobbies/my-dish.jpg"
```

Only edit `_layouts/hobbies.html`, `assets/js/hobbies.js`, or `assets/css/hobbies.css` when changing the widget structure, card fields, interactions, or visual design.

## Content Source Of Truth

Use one source of truth per section:

- Collection-driven: Blog (`_posts`), Models (`_models`), Courses (`_courses`), Course sections (`_course_sections`), and News (`_news`).
- Data-driven: Publications (`_data/publications.yml`), Presentations (`_data/presentations.yml`), Hobbies (`_data/hobbies.yml`), CV (`_data/cv.yml`), and Achievements (`_data/achievements.yml`).
- Hard-coded stable teaser: About. The homepage About preview and About page are edited directly in their owning markup/layout files.

Publications, Hobbies, and Achievements intentionally do not have collection folders or homepage hover feeds. Do not recreate `_publications`, `_hobbies`, or `_achievements` unless the section architecture changes.

## Course Index Terms

Course index terms are generated from inline markers in course and course-section content:

```md
[[probability measure]]
[[convergence::weak convergence]]
```

Use `[[term]]` for a top-level index entry and `[[parent::subterm]]` for a book-style subentry. Do not maintain a separate complete `index_terms` list in `_courses/*.md`; the Courses directory, course home metadata, search matches, and generated A-Z index all read from the inline markers through `/courses/course-index-data.json`.

## Desk Feeds

JSON feeds are generated at `/data/*.json` through `data/*.json` pages and `_layouts/feed.json.html`. The homepage fetches feeds only for sections that use hover previews or live monitor content, currently Blog, Models, Courses, and News. About uses hard-coded teaser data, while Publications, Presentations, Achievements, Hobbies, and CV navigate directly without hover feeds.

The Models feed powers the rotating desk monitor. It emits the full model list sorted by `updated`; the homepage monitor then keeps a cached session sample of up to eight models: the three most recent image-bearing models plus five randomly sampled older image-bearing models. If no models have images, the same rule falls back to all models.

## Updates and News

The site uses `date:` for original publication or creation date and `updated:` for the latest meaningful edit date. The script `scripts/update_updated.rb` updates front matter and maintains generated News cards for recent site changes.

Run the matching scope before committing content changes:

```bash
ruby scripts/update_updated.rb --models
ruby scripts/update_updated.rb --courses
ruby scripts/update_updated.rb --posts
ruby scripts/update_updated.rb --presentations
ruby scripts/update_updated.rb --publications
ruby scripts/update_updated.rb --achievements
ruby scripts/update_updated.rb --hobbies
ruby scripts/update_updated.rb --cv
```

Useful options:

- `--check` previews metadata and generated News changes without writing files.
- `--date YYYY-MM-DD` sets the update/event date explicitly.
- `--all` refreshes the selected scope and intentionally backfills generated News events.
- If no scope is provided, all supported scopes are checked.
- The presentation scope also accepts `--Presentations` as an alias.

Supported sources:

- Models: `_models/*.md`
- Courses: `_courses/*.md` and `_course_sections/<course>/*.md`
- Blog posts: `_posts/*.md`
- Presentations: `_data/presentations.yml` and `presentations/index.md`
- Publications: `_data/publications.yml` and `publications/index.md`
- Achievements: `_data/achievements.yml` and `achievements/index.md`
- Hobbies: `_data/hobbies.yml` and `hobbies/index.md`
- CV: `_data/cv.yml` and `cv/index.md`
- About: `about/index.md` and `_layouts/about.html`

Generated News cards are written to `_news/generated/`. Manual News cards can be written directly in `_news/` or `_news/manual/`. News collection documents do not render their own detail pages; `/news/` is the aggregator page. If a News card needs more detail, set `source_url` to the page that owns the detail.

Generated News front matter uses this shape:

```yaml
---
title: "Model added: Lagrangian Particle Transport Emulator"
date: 2026-05-20
updated: 2026-05-20
event_id: models:model1:parent_added:2026-05-20
event_type: parent_added
event_label: "Model added"
source_section: models
source_path: _models/model1.md
source_id: model1
source_url: /models/model1/
summary: "Fast surrogate for particle advection studies with coastline masks, flow snapshots, and arrival probability maps."
image: /assets/thumbs/models/model1.png
generated: true
---
```

For generated News summaries, the script uses the first available value in this order:

1. `news_summary`
2. `update_note`
3. `summary`
4. `excerpt`
5. a generated fallback sentence

Add `news_summary` when the News card should say something different from the source page summary:

```yaml
news_summary: "A new transport emulator model was added for particle advection experiments."
```

Use `news_enabled: false` on a source item to prevent generated News for that item.

Data-driven pages need stable per-entry `id` values. The script stores item hashes and prior metadata in `_news_state/news_update_state.yml` so it can detect item-level additions, updates, and deletions without parsing raw Git diffs. This state file is excluded from the generated site. It grows with the current data items, not with every historical update.

User-facing event labels are source-specific:

- Models: `Model added`, `Model updated`, `Model deleted`
- Courses: `Course added`, `Course updated`, `Course deleted`
- Blog: `Post added`, `Post updated`, `Post deleted`
- Data/section entries: `Section added`, `Section updated`, `Section deleted`
- Landing pages: `Page updated`

News is special: it keeps its own `/news/` metadata current, but the script does not generate recursive items such as “News was updated.”

## Blackboard Equations

Add equations to `data/equations.json`. KaTeX is loaded from the CDN in `_layouts/default.html`.

## Generated Output

`_site/` is generated by Jekyll and is intentionally ignored.
