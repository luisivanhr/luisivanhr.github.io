---
title: Blog
layout: default
permalink: /blog/
---
<h1>Blog</h1>
<ul>
{% for p in site.posts %}
  <li><a href="{{ p.url | relative_url }}">{{ p.title }}</a> — <small>{{ p.date | date: "%Y-%m-%d" }}</small></li>
{% endfor %}
</ul>
