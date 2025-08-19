---
title: Achievements
layout: default
permalink: /achievements/
---
<h1>Achievements</h1>
<ul>
{% for p in site.achievements %}
  <li><a href="{{ p.url | relative_url }}">{{ p.title }}</a> — <small>{{ p.date | date: "%Y-%m-%d" }}</small></li>
{% endfor %}
</ul>
