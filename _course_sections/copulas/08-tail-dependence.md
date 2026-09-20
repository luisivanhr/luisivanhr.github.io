---
title: Tail Dependence
updated: 2026-01-01
course_title: Copulas
course_url: /courses/copulas/
course_section_style: theory
section_number: 8
section_kind: Extremal dependence
summary: Define tail coefficients and calculate them for Clayton and Gumbel families.
prerequisites: Concordance measures
reading_time: 13 minutes
exercises: 3 exercises
permalink: /courses/copulas/08-tail-dependence/
previous_section:
  title: "Concordance Measures"
  url: /courses/copulas/07-concordance/
next_section:
  title: "Multivariate Copulas"
  url: /courses/copulas/09-multivariate-copulas/
date: 2026-01-01
---
<section class="intro-strip" id="overview"><h2>Joint extremes</h2><p>How often do two coordinates enter the same extreme region? Correlation can be moderate while simultaneous extremes are rare or common. [[tail dependence]] coefficients isolate that question on the copula scale. <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a></p></section>
<div class="math-block definition"><span class="block-label">Definition 8.1 <span>Tail coefficients</span></span><p>\[\lambda_L=\lim_{u\downarrow0}\frac{C(u,u)}u,\qquad \lambda_U=\lim_{u\uparrow1}\frac{C(u,u)-2u+1}{1-u}.\]</p><p>When they exist, these equal \(P(U_1\le u\mid U_2\le u)\) in the lower limit and \(P(U_1>u\mid U_2>u)\) in the upper limit. <a class="course-citation" href="#ref-2" aria-label="Reference 2">[2]</a></p></div>
<h2 id="calculations">Calculations</h2>
<div class="math-block theorem"><span class="block-label">Theorem 8.2 <span>Clayton tails</span></span><p>For Clayton parameter \(\theta>0\), \(\lambda_L=2^{-1/\theta}\) and \(\lambda_U=0\). <a class="course-citation" href="#ref-3" aria-label="Reference 3">[3]</a></p></div>
<div class="math-block proof"><span class="block-label">Proof</span><p>On the diagonal, \(C(u,u)=(2u^{-\theta}-1)^{-1/\theta}\). As \(u\downarrow0\), \(2u^{-\theta}-1\sim2u^{-\theta}\), so \(C(u,u)/u\to2^{-1/\theta}\). For the upper coefficient write \(u=1-s\). Since \(u^{-\theta}=1+\theta s+o(s)\), the diagonal becomes \((1+2\theta s+o(s))^{-1/\theta}=1-2s+o(s)\). Therefore \(C(u,u)-2u+1=o(s)\), and division by \(1-u=s\) gives \(\lambda_U=0\).</p></div>
<div class="math-block theorem"><span class="block-label">Theorem 8.3 <span>Gumbel tails</span></span><p>For Gumbel parameter \(\theta\ge1\), \(\lambda_L=0\) and \(\lambda_U=2-2^{1/\theta}\).</p></div>
<div class="math-block proof"><span class="block-label">Proof</span><p>The diagonal is \(C(u,u)=u^a\), where \(a=2^{1/\theta}\). For every finite \(\theta\ge1\), \(a>1\), and for \(\theta>1\) the quotient \(u^{a}/u=u^{a-1}\) tends to zero. At \(\theta=1\), it equals \(u\) and also tends to zero. For the upper limit put \(u=1-s\). The expansion \(u^a=1-as+o(s)\) gives \(C(u,u)-2u+1=(2-a)s+o(s)\), hence \(\lambda_U=2-a=2-2^{1/\theta}\).</p></div>
<p>Thus Clayton concentrates joint lower extremes and Gumbel joint upper extremes. The accompanying tail-probability figure uses parameter \(2\) for both families. The survival copula exchanges upper and lower coefficients.</p>
<figure class="figure-box"><img src="/assets/images/copulas/tail-probabilities.svg" alt="Lower and upper conditional threshold probabilities for independence, Clayton and Gumbel with parameter two."><figcaption>The lower-tail coefficient is the left endpoint limit in the left panel. The upper-tail coefficient is the right endpoint limit in the right panel. Interior values are finite-threshold probabilities.</figcaption></figure>
<h2 id="exercises">Exercises</h2>
<article class="exercise" id="exercise-8-1"><header class="exercise-head"><div><strong>Exercise 8.1</strong><span>Clayton limit.</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Evaluate \(\lambda_L\) at \(\theta=1\).</p></div><div class="answer-panel"><div class="answer-inner"><p>\(2^{-1/\theta}=2^{-1}=1/2\).</p></div></div></article>
<article class="exercise" id="exercise-8-2"><header class="exercise-head"><div><strong>Exercise 8.2</strong><span>Gumbel independence limit.</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>What happens to \(\lambda_U\) at \(\theta=1\)?</p></div><div class="answer-panel"><div class="answer-inner"><p>\(2-2^{1}=0\), matching the product copula.</p></div></div></article>
<article class="exercise" id="exercise-8-3"><header class="exercise-head"><div><strong>Exercise 8.3</strong><span>Interpretation.</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Interpret \(\lambda_L=0.25\).</p></div><div class="answer-panel"><div class="answer-inner"><p>At very small thresholds, the conditional probability that one uniform variable is below the threshold given that the other is below it approaches 0.25.</p></div></div></article>
<div id="source-note"></div>
<h2 id="references">References</h2>
<ol class="course-references">
<li id="ref-1">Jan-Frederik Mai and Matthias Scherer, <em>Simulating Copulas: Stochastic Models, Sampling Algorithms, and Applications</em>, second edition (2017), Definition 1.6, tail dependence and its conditional-probability interpretation, printed pp. 33–35 (PDF pp. 52–54).</li>
<li id="ref-2">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), Section 5.4, Definition 5.4.1 and Theorem 5.4.2, diagonal limit formulas, printed pp. 214–215 (PDF pp. 223–224).</li>
<li id="ref-3">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), Table 4.1, Clayton and Gumbel–Hougaard family formulas, printed p. 116 (PDF p. 126).</li>
</ol>
<p>The Clayton and Gumbel–Hougaard tail limits are course calculations from the cited family formulas.</p>
