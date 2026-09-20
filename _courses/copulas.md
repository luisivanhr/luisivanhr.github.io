---
title: Copulas
layout: course
permalink: /courses/copulas/
date: 2026-01-01
updated: 2026-01-01
summary: A course on dependence, from joint distributions and Sklar's theorem to simulation, Bayesian estimation, and financial applications.
excerpt: Learn copulas through definitions, worked derivations, original figures, and exercises with answers.
image: /assets/images/copulas/gumbel-cover.svg
image_alt: Contours of the Gumbel copula with parameter two
track: Probability and statistics
status: Complete course
audience: Undergraduates with elementary probability and calculus
latest_update: Twenty-three lessons, a reference guide, and worked exercises
index_url: /courses/copulas/index/
sections:
  - title: "1. Probability and Marginal Distributions"
    url: /courses/copulas/01-probability-and-margins/
    meta: Foundations
  - title: "2. Copulas and Bounds"
    url: /courses/copulas/02-copulas-and-bounds/
    meta: Foundations
  - title: "3. Sklar's Theorem"
    url: /courses/copulas/03-sklars-theorem/
    meta: Central theorem
  - title: "4. Densities and Conditioning"
    url: /courses/copulas/04-densities-and-conditioning/
    meta: Theory and simulation
  - title: "5. Constructions"
    url: /courses/copulas/05-constructions/
    meta: Construction and examples
  - title: "6. Archimedean Copulas"
    url: /courses/copulas/06-archimedean-copulas/
    meta: Generator based dependence
  - title: "7. Concordance Measures"
    url: /courses/copulas/07-concordance/
    meta: Rank dependence
  - title: "8. Tail Dependence"
    url: /courses/copulas/08-tail-dependence/
    meta: Extremal dependence
  - title: "9. Multivariate Copulas"
    url: /courses/copulas/09-multivariate-copulas/
    meta: Higher dimensional dependence
  - title: "10. Simulating Copulas"
    url: /courses/copulas/10-simulation/
    meta: Simulation and diagnostics
  - title: "11. Estimation and Bayesian Updating"
    url: /courses/copulas/11-estimation-and-bayes/
    meta: Estimation and inference
  - title: "12. Financial Applications and Dependence Uncertainty"
    url: /courses/copulas/12-financial-applications/
    meta: Applications and simulation
  - title: "13. Workshop: From Observations to an Empirical Copula"
    url: /courses/copulas/13-empirical-workshop/
    meta: Guided practice
  - title: "14. Gaussian Copulas"
    url: /courses/copulas/14-gaussian-copulas/
    meta: Elliptical copula
  - title: "15. Student-t Copulas"
    url: /courses/copulas/15-student-t-copulas/
    meta: Elliptical copula
  - title: "16. Clayton Copulas"
    url: /courses/copulas/16-clayton-copulas/
    meta: Theory and applications
  - title: "17. Gumbel Copulas"
    url: /courses/copulas/17-gumbel-copulas/
    meta: Theory and applications
  - title: "18. Frank Copulas"
    url: /courses/copulas/18-frank-copulas/
    meta: Theory and applications
  - title: "19. Marshall-Olkin Copulas"
    url: /courses/copulas/19-marshall-olkin/
    meta: Shock model and singular dependence
  - title: "20. Extreme-Value Copulas"
    url: /courses/copulas/20-extreme-value-copulas/
    meta: Theory and applications
  - title: "21. Quadrant Dependence and Concordance Order"
    url: /courses/copulas/21-dependence-order/
    meta: Dependence theory
  - title: "22. Workshop: Calibrating Dependence from Ranks"
    url: /courses/copulas/22-calibration-workshop/
    meta: Guided calculation
  - title: "23. Bayesian Prediction from a Copula Posterior"
    url: /courses/copulas/23-bayesian-prediction/
    meta: Posterior prediction
  - title: "24. Notation, Formula Guide, and References"
    url: /courses/copulas/14-reference/
    meta: Reference
updates:
  - title: Foundations, extensions, figures, and worked exercises
    date: January 2026
    url: /courses/copulas/01-probability-and-margins/
---

<h2 id="purpose">What this course develops</h2>
<p>Knowing the distribution of each variable leaves a further question: how do the variables behave together? A [[copula]] describes their joint law on a common percentile scale. We begin with rectangle probabilities and build the theory needed to construct models, quantify dependence, and simulate observations.</p>
<p>The main route follows Roger B. Nelsen's <em>An Introduction to Copulas</em>, second edition. Selected modules use the three companion books listed in the <a href="/courses/copulas/14-reference/#bibliography">bibliography</a>. Each lesson gives the source locations for its results. Definitions and derivations are included in the course, so the books can serve as further reading.</p>

<h2 id="route">How to study</h2>
<p>Read Lessons 1–8 in sequence to build the core theory, and try the exercises before opening their answers. The later lessons let us study particular families, simulate from them, and see how estimation changes the conclusions we draw. You can follow the semester route below or select a module using its prerequisites. The reference guide and the index help you return to a formula when you need it.</p>
<p>You will use elementary probability, derivatives, and integrals. We introduce joint distribution functions before using them and state the additional assumptions needed for density calculations. Complete proofs are given for the central calculations developed here. More general results are identified as cited theorems when their full proofs fall outside the course.</p>
<p>The figures are original computations of the displayed models. Short code examples support the simulation material; most lessons focus on theory, intuition, and worked calculations.</p>

<h2 id="semester-route">A semester route</h2>
<p>The course has 23 lessons and a reference guide. The schedule below spreads them over 14 weeks, leaving time to work through the calculations. Two short lessons in a week can be read together; the exercises determine how much time you spend with each topic.</p>
<div class="course-table-scroll" role="region" aria-label="Semester reading schedule" tabindex="0"><table class="course-table course-table--schedule"><thead><tr><th scope="col">Weeks</th><th scope="col">Lessons</th><th scope="col">What to work on</th></tr></thead><tbody>
<tr><td>1–2</td><td>1–3</td><td>Joint distributions, copula bounds, and Sklar's theorem</td></tr>
<tr><td>3–4</td><td>4–6</td><td>Conditional laws, constructions, and Archimedean generators</td></tr>
<tr><td>5–6</td><td>7–10</td><td>Concordance, tails, higher dimensions, and simulation</td></tr>
<tr><td>7–8</td><td>14–15</td><td>Gaussian and Student t copulas: shared structure and different extremes</td></tr>
<tr><td>9–10</td><td>16–18</td><td>Clayton, Gumbel, and Frank: derive, compare, and simulate</td></tr>
<tr><td>11</td><td>19–20</td><td>Common shocks and block maxima</td></tr>
<tr><td>12</td><td>11, 13, 22</td><td>Estimation, empirical ranks, and calibration</td></tr>
<tr><td>13</td><td>21, 23</td><td>Dependence order and Bayesian prediction</td></tr>
<tr><td>14</td><td>12 and review</td><td>Apply the models to joint defaults and revisit the assumptions</td></tr>
</tbody></table></div>
<p>For a shorter route, finish Lessons 1–8 and 10, then choose one family from Lessons 14–19. For a project, reproduce a simulation figure, check its marginal distributions, and compare an empirical rectangle probability with the formula. Lessons 13 and 22 show how to report what the calculation establishes and what still depends on the selected family.</p>
