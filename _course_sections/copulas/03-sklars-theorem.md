---
title: Sklar's Theorem
permalink: /courses/copulas/03-sklars-theorem/
updated: 2026-01-01
course_title: Copulas
course_url: /courses/copulas/
course_section_style: theory
section_number: 3
section_kind: Central theorem
summary: How a copula joins arbitrary marginal distributions and when that copula is unique.
prerequisites: Copulas and bounds
reading_time: 20 minutes
exercises: 3 exercises
previous_section:
  title: "Copulas and Bounds"
  url: /courses/copulas/02-copulas-and-bounds/
next_section:
  title: "Densities and Conditioning"
  url: /courses/copulas/04-densities-and-conditioning/
date: 2026-01-01
---

<section class="intro-strip"><h2 id="overview">Separating marginal distributions from dependence</h2><p>Sklar's theorem gives the basic factorization of a joint distribution. The marginal distributions carry the individual scales. The copula joins their percentile coordinates.</p></section>
<h2 id="statement">The theorem</h2>
<p>For marginal distribution functions \(F,G\), \(\operatorname{Ran}F\) denotes the range of \(F\) on the extended real line. We include the endpoint limits \(F(-\infty)=0\) and \(F(\infty)=1\), even when no finite argument gives those values. Thus \(\operatorname{Ran}F\) contains all values \(F(x)\) for \(x\in\mathbb R\), the set of real numbers, together with zero and one. The Cartesian product \(\operatorname{Ran}F\times\operatorname{Ran}G\) consists of pairs \((u,v)\) with \(u\) in the first range and \(v\) in the second. These are the copula arguments supplied by the marginal distributions, including their endpoint limits.</p>
<div class="math-block theorem"><span class="block-label">Theorem 3.1 <span>[[Sklar's theorem]]</span></span><p>Let \(H\) be a joint distribution function with marginal distributions \(F\) and \(G\). There exists a copula \(C\) such that <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a></p><p>\[
H(x,y)=C(F(x),G(y)).
\]</p><p>If \(F\) and \(G\) are continuous, \(C\) is unique. In general it is uniquely determined on \(\operatorname{Ran}F\times\operatorname{Ran}G\). Conversely, this formula defines a joint distribution with marginal distributions \(F,G\) whenever \(C\) is a copula.</p></div>
<p>How should we use the formula? A known joint law produces a copula, and a chosen copula together with two marginal distributions produces a joint law. The theorem separates the part fixed by the individual variables from the part fixed by their dependence.</p>
<h2 id="proof">Proof for continuous marginal distributions</h2>
<p>Assume first that \(F,G\) are continuous. Define \(U=F(X)\), \(V=G(Y)\), and let \(C\) be their joint distribution function. Lesson 1 shows that both coordinates are uniform. Consequently \(C\) is a copula.</p>
<div class="math-block proof"><span class="block-label">The representation</span><p>For a fixed \(x\), monotonicity gives \(\{X\le x\}\subseteq\{F(X)\le F(x)\}\). Both events have probability \(F(x)\): the first by definition, the second because \(F(X)\) is uniform. Their difference therefore has probability zero. Applying the same argument to \(Y\) shows that their two intersections agree up to a null set, meaning an event of probability zero. Thus</p><p>\[H(x,y)=P[F(X)\le F(x),G(Y)\le G(y)]=C(F(x),G(y)).\]</p><p>Every value in \((0,1)\) is attained by each continuous marginal distribution. The displayed equation therefore fixes \(C\) on \((0,1)^2\). The Lipschitz estimate from Lesson 2 extends uniqueness to the boundary. This proves existence and uniqueness for continuous marginal distributions, including marginal distributions with flat parts.</p></div>
<h2 id="general-margins">What changes with jumps?</h2>
<p>For arbitrary marginal distributions, define \(\widetilde C(F(x),G(y))=H(x,y)\), allowing infinite endpoints to include values zero and one. This definition is consistent: for any two points, rectangle probabilities imply</p><p>\[|H(x_2,y_2)-H(x_1,y_1)|\le|F(x_2)-F(x_1)|+|G(y_2)-G(y_1)|.\]</p><p>When both marginal values agree, the right-hand side is zero. Thus the chosen representatives cannot change \(\widetilde C\). Its rectangle volumes are nonnegative and its marginal distributions have the required values on this restricted domain. Such an object is called a [[subcopula]].</p>
<p>Lemma 2.3.5 extends a subcopula to the whole square: first take its continuous extension to the closure of the domain, then interpolate bilinearly across the remaining gaps. <a class="course-citation" href="#ref-2" aria-label="Reference 2">[2]</a> This gives the existence part of the general theorem. Why can the extension vary? In a gap, the marginal distributions never attain the new values, so different extensions can produce the same joint law.</p>
<h2 id="converse">The converse and inversion</h2>
<p>Now choose a copula \(C\) and any marginal distributions \(F,G\). The rectangle volume of \(H(x,y)=C(F(x),G(y))\) equals the copula volume on \([F(x_1),F(x_2)]\times[G(y_1),G(y_2)]\), which is nonnegative. Right-continuity follows from right-continuity of the marginal distributions and continuity of \(C\). The boundary limits are \(H(x,\infty)=C(F(x),1)=F(x)\), \(H(\infty,y)=G(y)\), and zero when either argument tends to minus infinity. Therefore \(H\) is the required joint distribution.</p>
<p>For continuous marginal distributions and \(0&lt;u,v&lt;1\), use the generalized inverse from Lesson 1. Since \(F(F^{-1}(u))=u\) and \(G(G^{-1}(v))=v\),</p><p>\[C(u,v)=H(F^{-1}(u),G^{-1}(v)).\]</p><p>Boundary values follow by continuity. Ordinary inverses suffice when the marginal distributions are strictly increasing. <a class="course-citation" href="#ref-3" aria-label="Reference 3">[3]</a> For discontinuous marginal distributions, this formula cannot determine a unique full copula because the attained ranges have gaps.</p>
<div class="problem-grid">
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 3.2</strong><span>Independence</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>If \(C=\Pi\), what is \(H\) in terms of \(F,G\)?</p></div><div class="answer-panel"><div class="answer-inner"><p>\(H(x,y)=\Pi(F(x),G(y))=F(x)G(y)\). This is the factorization for independence.</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 3.3</strong><span>Continuous inversion</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Assume \(F,G\) are continuous and strictly increasing. Recover \(C(u,v)\) from \(H\).</p></div><div class="answer-panel"><div class="answer-inner"><p>Put \(x=F^{-1}(u)\) and \(y=G^{-1}(v)\). Then \(C(u,v)=H(F^{-1}(u),G^{-1}(v))\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 3.4</strong><span>Why uniqueness can fail</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Suppose both marginal distributions are unit steps, so each range is \(\{0,1\}\). On what set is the copula fixed by \(H\)?</p></div><div class="answer-panel"><div class="answer-inner"><p>It is fixed only on \(\{0,1\}\times\{0,1\}\). Every copula has the same required boundary values there, so many copulas can extend the same subcopula.</p></div></div></article>
</div>
<h2 id="references">References</h2>
<ol class="course-references">
<li id="ref-1">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), §2.1, range and Cartesian-product notation, printed pp. 7–8 (PDF pp. 18–19); §2.3, Theorem 2.3.3 and Lemma 2.3.4, printed p. 18 (PDF p. 29).</li>
<li id="ref-2">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), §2.3, Lemma 2.3.5, printed pp. 19–20 (PDF pp. 30–31).</li>
<li id="ref-3">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), Section 2.3, Definition 2.3.6, quasi-inverse, printed p. 21 (PDF p. 32).</li>
</ol>
