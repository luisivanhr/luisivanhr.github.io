---
title: Code Template Placeholder
course_title: Course Intro
course_url: /courses/course-intro/
course_section_style: lab
section_number: 2
section_kind: Code-heavy lab
summary: A placeholder computational lab showing run metadata, code snippets, output notes, and a code-answer drawer.
prerequisites: Theory Template Placeholder
reading_time: 15 minutes
exercises: 1 code exercise
sidebar_tools: Lab Tools
sidebar_note: Notebook, environment notes, code snippets, and diagnostics
lab_summary:
  - label: Language
    value: Python
  - label: Runtime
    value: 2 minutes
  - label: Dependencies
    value: NumPy
  - label: Artifacts
    value: Notebook-ready
subsections:
  - title: 2.1 Lab goal
    url: /courses/course-intro/code-template/#lab-goal
  - title: 2.2 Setup
    url: /courses/course-intro/code-template/#setup
  - title: 2.3 Exercise
    url: /courses/course-intro/code-template/#exercise
previous_section:
  title: Theory Template Placeholder
  url: /courses/course-intro/theory-template/
next_section:
  title: Hybrid Template Placeholder
  url: /courses/course-intro/hybrid-template/
---

<section class="intro-strip" id="lab-goal">
  <h2>Lab Goal</h2>
  <p>This placeholder demonstrates the code-heavy template. It is intended for computational sections where code, diagnostics, and reproducibility matter.</p>
</section>

<h2 id="setup">Setup</h2>

<div class="code-window">
  <header>placeholder_lab.py</header>
  <pre><code>import numpy as np

rng = np.random.default_rng(7)
samples = rng.normal(loc=0.0, scale=1.0, size=1000)
estimate = samples.mean()
print(round(estimate, 4))</code></pre>
</div>

<div class="equation">
  estimate = (1 / n) sum_i x_i
  <small>Placeholder estimator</small>
</div>

<div class="result-panel">
  <h3>Run Notes</h3>
  <dl>
    <dt>Observed behavior</dt>
    <dd>The [[estimation::sample mean]] should be close to zero.</dd>
    <dt>What this tests</dt>
    <dd>Code blocks, result panels, and lab metadata in the page header.</dd>
  </dl>
</div>

<article class="exercise" id="exercise">
  <header class="exercise-head">
    <div>
      <strong>Exercise 2.1</strong>
      <span>Code placeholder.</span>
    </div>
    <button class="answer-button" type="button">Show answer</button>
  </header>
  <div class="exercise-body">
    <p>Modify the simulation so it estimates the sample variance instead of the sample mean.</p>
  </div>
  <div class="answer-panel">
    <div class="answer-inner">
      <div class="code-window">
        <header>solution.py</header>
        <pre><code>variance = samples.var(ddof=1)
print(round(variance, 4))</code></pre>
      </div>
    </div>
  </div>
</article>
