---
title: Models
layout: default
permalink: /models/
---
<h1>Models</h1>
<ul>
{% for p in site.models %}
  <li><a href="{{ p.url | relative_url }}">{{ p.title }}</a> — <small>{{ p.date | date: "%Y-%m-%d" }}</small></li>
{% endfor %}
</ul>
