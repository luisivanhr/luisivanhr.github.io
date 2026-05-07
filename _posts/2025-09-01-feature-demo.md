---
layout: post
title: "A short note on stable laws and score matching"
date: 2025-09-01
categories: [Research]
tags: [Probability, ScoreMatching, HeavyTails]
image: /assets/thumbs/blog/blog1.png
post_style: paper
post_kind: "Research note"
reading_time: "8 min read"
summary: "A compact walkthrough of a numerical experiment, with enough mathematical context to make the assumptions, notation, and result easy to scan before reading the full derivation."
materials: "Notebook, code, citations"
notebook: /assets/notebooks/Levy2.html
citation: "Nolan, J. P. Stable Distributions: Models for Heavy Tailed Data. Hyvarinen, A. Estimation of non-normalized statistical models by score matching."
sidebar_label: "Post Tools"
---

<section class="abstract">
  <h2>Abstract</h2>
  <p>We compare a simple neural approximation to a stable density against a score-based estimator. The point is not to claim a new method, but to document where the approximation breaks and how the diagnostic changes with tail index.</p>
</section>

## Setup

Let \(X_\alpha\) denote a centered stable random variable with characteristic exponent \(\alpha\). The numerical task is to recover a smooth approximation of the score from simulated samples.

<div class="equation">
$$
\varphi_{X_\alpha}(t) = \exp\{-\sigma^\alpha |t|^\alpha\}, \quad 0 < \alpha \leq 2
$$
<small>Equation 1</small>
</div>

<div class="theorem">
  <span class="label">Proposition</span>
  For fixed \(\sigma\), the fitted score becomes increasingly sensitive to the truncation window as \(\alpha\) approaches one.
</div>

## Diagnostic Figure

<figure class="figure">
  <div class="figure-grid">
    <svg class="plot" viewBox="0 0 640 300" role="img" aria-label="Density and score diagnostic plot">
      <rect width="640" height="300" fill="#f8fbfc"></rect>
      <g stroke="#d7e2e7" stroke-width="1">
        <path d="M60 30V250M180 30V250M300 30V250M420 30V250M540 30V250"></path>
        <path d="M40 70H600M40 130H600M40 190H600M40 250H600"></path>
      </g>
      <path d="M48 232C106 230 136 215 172 176C216 128 254 76 312 72C370 68 408 116 452 162C494 205 530 226 594 231" fill="none" stroke="#17767d" stroke-width="5"></path>
      <path d="M48 224C110 219 144 202 182 168C232 122 270 96 318 98C366 100 400 132 438 172C480 214 524 238 594 244" fill="none" stroke="#8b2f3d" stroke-width="3" stroke-dasharray="8 8"></path>
      <text x="46" y="276" fill="#5f6e78" font-size="15">tail index alpha</text>
      <text x="470" y="52" fill="#17767d" font-size="15">empirical</text>
      <text x="470" y="76" fill="#8b2f3d" font-size="15">fit</text>
    </svg>
    <figcaption class="caption">Figure 1. The paper-first template gives figures a formal caption and enough whitespace to read like a short technical article.</figcaption>
  </div>
</figure>

## References

<section class="references">
  <ol>
    <li>Nolan, J. P. Stable Distributions: Models for Heavy Tailed Data.</li>
    <li>Hyvarinen, A. Estimation of non-normalized statistical models by score matching.</li>
  </ol>
</section>
