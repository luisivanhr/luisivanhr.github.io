---
title: News
layout: default
permalink: /news/
---
<h1>News</h1>
<ul>
{% for p in site.news %}
  <li><a href="{{ p.url | relative_url }}">{{ p.title }}</a> — <small>{{ p.date | date: "%Y-%m-%d" }}</small></li>
{% endfor %}
</ul>
