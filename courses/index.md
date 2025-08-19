---
title: Courses
layout: default
permalink: /courses/
---
<h1>Courses</h1>
<ul>
{% for p in site.courses %}
  <li><a href="{{ p.url | relative_url }}">{{ p.title }}</a> — <small>{{ p.date | date: "%Y-%m-%d" }}</small></li>
{% endfor %}
</ul>
