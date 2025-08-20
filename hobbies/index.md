---
title: Hobbies
layout: default
permalink: /hobbies/
---
<h1>Hobbies</h1>
<ul>
{% for p in site.hobbies %}
  <li><a href="{{ p.url | relative_url }}">{{ p.title }}</a> — <small>{{ p.date | date: "%Y-%m-%d" }}</small></li>
{% endfor %}
</ul>