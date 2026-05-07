---
title: Classic Navigation
layout: default
permalink: /classic/
---
<h1>{{ site.title }}</h1>
<nav class="classic-nav">
  {% for item in site.data.nav %}
  <a href="{{ item.url | relative_url }}">{{ item.title }}</a>
  {% endfor %}
</nav>
