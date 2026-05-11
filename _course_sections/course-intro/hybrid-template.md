---
title: Hybrid Template Placeholder
course_title: Course Intro
course_url: /courses/course-intro/
course_section_style: hybrid
section_number: 3
section_kind: Derivation and computation
summary: A placeholder hybrid section where a short derivation is paired with implementation notes and a diagnostic figure.
prerequisites: Code Template Placeholder
reading_time: 18 minutes
exercises: 1 mixed exercise
sidebar_tools: Hybrid Tools
sidebar_note: Derivation, implementation warning, diagnostic figure
subsections:
  - title: 3.1 Derivation
    url: /courses/course-intro/hybrid-template/#derivation
  - title: 3.2 Implementation
    url: /courses/course-intro/hybrid-template/#implementation
  - title: 3.3 Diagnostic
    url: /courses/course-intro/hybrid-template/#diagnostic
previous_section:
  title: Code Template Placeholder
  url: /courses/course-intro/code-template/
next_section:
  title: Workshop Template Placeholder
  url: /courses/course-intro/workshop-template/
---

<div class="two-column">
  <main>
    <h2 id="derivation">Derivation</h2>

    <div class="math-block proposition">
      <span class="block-label">Proposition 3.1 <span>Placeholder update rule</span></span>
      <p>A placeholder update rule can be written as a mathematical statement and then translated directly into code. In a real course, this is the kind of paragraph where [[convergence::weak convergence]] could be indexed without adding a visible chip by hand.</p>
    </div>

    <div class="math-block proof">
      <span class="block-label">Proof Sketch</span>
      <p>Start with a first-order approximation, isolate the update direction, and replace symbolic quantities with computable estimates.</p>
    </div>

    <h2 id="implementation">Implementation</h2>

    <div class="code-window">
      <header>hybrid_update.py</header>
      <pre><code>direction = compute_direction(state)
step_size = 0.1
new_state = state + step_size * direction</code></pre>
    </div>

    <h2 id="diagnostic">Diagnostic</h2>

    <figure class="figure-box">
      <div class="figure-grid">
        <svg class="plot" viewBox="0 0 640 300" role="img" aria-label="Placeholder diagnostic plot">
          <rect width="640" height="300" fill="#f8fbfc"></rect>
          <g stroke="#d7e2e7" stroke-width="1">
            <path d="M70 35V250M200 35V250M330 35V250M460 35V250M590 35V250"></path>
            <path d="M50 70H600M50 130H600M50 190H600M50 250H600"></path>
          </g>
          <path d="M70 224C150 194 210 177 288 147C360 118 420 86 570 62" fill="none" stroke="#17767d" stroke-width="4"></path>
          <path d="M70 230C138 220 210 205 282 193C360 180 432 171 570 158" fill="none" stroke="#b47d1d" stroke-width="3" stroke-dasharray="8 7"></path>
        </svg>
        <figcaption>A placeholder diagnostic figure showing how this template can keep derivation, code, and visual output in one section.</figcaption>
      </div>
    </figure>
  </main>

  <aside class="rail">
    <section class="rail-card">
      <h3>Notation</h3>
      <p><code>state</code> denotes the current iterate; <code>direction</code> denotes the placeholder update direction.</p>
    </section>
    <section class="rail-card">
      <h3>Implementation Warning</h3>
      <p>Use this rail for small notes that should remain visible while reading the derivation.</p>
    </section>
  </aside>
</div>
