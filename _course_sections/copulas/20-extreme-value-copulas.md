---
title: Extreme-Value Copulas
permalink: /courses/copulas/20-extreme-value-copulas/
course_title: Copulas
course_url: /courses/copulas/
course_section_style: theory
section_number: 20
summary: Derive max stability and the Pickands representation for extreme-value copulas.
prerequisites: Gumbel copulas and tail dependence
reading_time: 16 minutes
exercises: 3 worked exercises
previous_section:
  title: "Marshall-Olkin Copulas"
  url: /courses/copulas/19-marshall-olkin/
next_section:
  title: "Quadrant Dependence and Concordance Order"
  url: /courses/copulas/21-dependence-order/
date: 2026-01-01
updated: 2026-01-01
---
<section class="intro-strip"><h2 id="definition">Max stability</h2><p>What must a copula satisfy to describe componentwise maxima? An [[extreme-value copula]] preserves its form under maxima. Equivalently, for every \(t>0\), \[C(u^t,v^t)=C(u,v)^t.\] <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a> This is the copula analogue of a univariate extreme-value limit law.</p></section>
<div class="math-block theorem"><span class="block-label">Theorem 20.1 <span>Pickands representation</span></span><p>A bivariate extreme-value copula has the form \[C(u,v)=\exp\{(\log u+\log v)A(\log v/(\log u+\log v))\},\] where the Pickands function \(A:[0,1]\to[1/2,1]\) is convex and satisfies \(\max(w,1-w)\le A(w)\le1\). Conversely these conditions produce an extreme-value copula. <a class="course-citation" href="#ref-2" aria-label="Reference 2">[2]</a></p></div>
<div class="math-block proof"><span class="block-label">Proof sketch</span><p>Write \(x=-\log u\), \(y=-\log v\), and define the stable-tail function \(\ell(x,y)=-\log C(e^{-x},e^{-y})\). Max stability makes \(\ell\) homogeneous: \(\ell(tx,ty)=t\ell(x,y)\). For \(x+y>0\), homogeneity gives \(\ell(x,y)=(x+y)A(y/(x+y))\), which yields the displayed formula in the interior of the square. The values on the boundary follow by continuous extension. The equivalence between convexity with these bounds and copula validity is the characterization stated in Nelsen, Section 3.3.4. The calculation here derives the homogeneous representation; it does not prove that full characterization.</p></div>
<p>The independence copula has \(A(w)=1\). The comonotone limit has \(A(w)=\max(w,1-w)\). Gumbel has \(A(w)=(w^\theta+(1-w)^\theta)^{1/\theta}\), so its max stability follows directly. The Marshall-Olkin copula supplies an asymmetric extreme-value example.</p>
<h2 id="block-maxima">Block maxima identity</h2>
<p>Take \(n\) independent pairs \((U_i,V_i)\), each with copula \(C\), and define the coordinatewise maxima \(U^\ast=\max_{1\le i\le n}U_i\) and \(V^\ast=\max_{1\le i\le n}V_i\). The transformed maxima \(\widetilde U=(U^\ast)^n\) and \(\widetilde V=(V^\ast)^n\) are uniform because \(P((U^\ast)^n\le u)=P(U_i\le u^{1/n}\ \text{for every }i)=u\). Their joint distribution is
<p>\[P(\widetilde U\le u,\widetilde V\le v)=C(u^{1/n},v^{1/n})^n.\]</p>
<p>For an extreme-value copula this equals \(C(u,v)\) for every \(n\). The generated figure uses the Gumbel copula with \(\theta=2\), 16,000 independent blocks for each \(n\in\{1,8\}\), and overlays the empirical diagonal sections with the exact diagonal sections.</p><figure class="figure-box"><img src="/assets/images/copulas/extreme-value-maxima.svg" alt="Gumbel extreme-value copula block maxima for block sizes one and eight"><figcaption>Empirical diagonal sections after the exact uniform transformation of block maxima, compared with the Gumbel \(\theta=2\) diagonal.</figcaption></figure>
<h2 id="exercises">Exercises</h2>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 20.1</strong><span>Check max stability</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Verify max stability for Gumbel.</p></div><div class="answer-panel"><div class="answer-inner"><p>Replacing \(u,v\) by \(u^t,v^t\) multiplies the exponent by \(t\), so the copula value is raised to \(t\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 20.2</strong><span>Pickands bounds</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Evaluate the bounds at \(w=1/2\).</p></div><div class="answer-panel"><div class="answer-inner"><p>\(1/2\le A(1/2)\le1\). Gumbel at \(\theta=2\) gives \(A(1/2)=1/\sqrt2\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 20.3</strong><span>Block maxima</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>For \(n\) independent pairs with copula \(C\), define \(U^\ast,V^\ast\) as coordinatewise maxima. Find the transformed joint distribution and state the extreme-value equality.</p></div><div class="answer-panel"><div class="answer-inner"><p>The transformed variables are \(\widetilde U=(U^\ast)^n\) and \(\widetilde V=(V^\ast)^n\). Their joint distribution is \(C(u^{1/n},v^{1/n})^n\). Extreme-value max stability gives \(C(u^{1/n},v^{1/n})^n=C(u,v)\). A finite simulation fluctuates around this exact equality because it uses finitely many blocks.</p></div></div></article>
<h2 id="references">References</h2><ol class="course-references">
<li id="ref-1">Jan-Frederik Mai and Matthias Scherer, <em>Simulating Copulas: Stochastic Models, Sampling Algorithms, and Applications</em>, 2nd ed. (2017), §1.2.5, Definition 1.12, printed pp. 52–53 (PDF pp. 71–72): max-stable extreme-value copulas.</li>
<li id="ref-2">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), Definition 3.3.2, Example 3.22, Theorem 3.3.5 and Pickands construction, printed pp. 95–105: representation and convexity bounds.</li>
</ol>
