---
title: Probability and Marginal Distributions
permalink: /courses/copulas/01-probability-and-margins/
updated: 2026-01-01
course_title: Copulas
course_url: /courses/copulas/
course_section_style: theory
section_number: 1
section_kind: Foundations
summary: Joint distribution functions, marginal distributions, and the probability integral transform.
prerequisites: Basic probability and one-variable distribution functions
reading_time: 16 minutes
exercises: 3 exercises
next_section:
  title: "Copulas and Bounds"
  url: /courses/copulas/02-copulas-and-bounds/
date: 2026-01-01
---

<section class="intro-strip"><h2 id="overview">The two pieces of a joint law</h2><p>A pair of random variables carries two kinds of information. Each variable has its own distribution, and the pair has a rule describing how the two variables occur together. Copulas describe the second piece after the first has been placed on a common scale.</p></section>

<h2 id="distribution-functions">Distribution functions and marginal distributions</h2>
<p>For a real-valued random variable \(X\), write \(F(x)=P[X\le x]\). The function \(F\) is right-continuous and nondecreasing, tends to \(0\) at the left end of the real line, and tends to \(1\) at the right end. For a pair \((X,Y)\), the joint distribution function is</p>
<p>\[
H(x,y)=P[X\le x,\;Y\le y].
\]</p>
<p>The one-dimensional distribution functions are called the marginal distributions. They are recovered from \(H\) by taking the other coordinate to infinity:</p>
<p>\[
F(x)=H(x,\infty),\qquad G(y)=H(\infty,y).
\]</p>
<p>If \(x_1\le x_2\) and \(y_1\le y_2\), inclusion and exclusion gives</p>
<p>\[
P[x_1&lt;X\le x_2,\ y_1&lt;Y\le y_2]=H(x_2,y_2)-H(x_1,y_2)-H(x_2,y_1)+H(x_1,y_1).
\]</p>
<p>This quantity is nonnegative. The same condition is the central two-dimensional analogue of monotonicity. <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a></p>

<div class="math-block definition"><span class="block-label">Definition 1.1 <span>2-increasing</span></span><p>A function \(H\) is 2-increasing when its volume on every rectangle, given by the four-term expression above, is nonnegative. A grounded function has value zero when either coordinate is at the lower endpoint.</p></div>

<h2 id="uniform-scale">The uniform scale</h2>
<p>The interval \(I=[0,1]\) is useful because every distribution function takes values there. A percentile answers the question: what fraction of the distribution lies below this value? For a continuous distribution, the [[probability integral transform]] \(U=F(X)\) is uniform on this interval. <a class="course-citation" href="#ref-2" aria-label="Reference 2">[2]</a></p>
<div class="math-block proof"><span class="block-label">Why the transform is uniform</span><p>Fix \(0&lt;u&lt;1\). By continuity and the limits of \(F\), the level set \(\{x:F(x)=u\}\) is a nonempty bounded closed interval, possibly a single point. Let \(b\) be its right endpoint. Monotonicity gives \(F(x)\le u\) exactly when \(x\le b\). Thus</p><p>\[P[F(X)\le u]=P[X\le b]=F(b)=u.\]</p><p>If the level set is an interval, it carries zero probability: the continuous distribution function has no increase across it. This handles flat parts of \(F\). The endpoint probabilities follow by taking limits as \(u\) decreases to zero or increases to one.</p></div>
<p>To go in the other direction, define the [[generalized inverse]] by \(F^{-1}(u)=\inf\{x:F(x)\ge u\}\), for \(0&lt;u&lt;1\). Right-continuity of \(F\) gives \(F^{-1}(u)\le x\) if and only if \(u\le F(x)\). Hence a uniform \(U\) satisfies</p><p>\[P[F^{-1}(U)\le x]=P[U\le F(x)]=F(x).\]</p><p>This inverse sampling identity also holds for discrete distributions. The forward transform \(F(X)\) requires continuity to be uniform, as Exercise 1.4 shows.</p>
<p>Why use this transformation? It removes the units of the marginal distributions. We can represent a temperature, a waiting time, and a loss by percentile values and study how those values occur together.</p>
<div class="math-block proposition"><span class="block-label">Proposition 1.2 <span>Marginal Distributions are boundary sections</span></span><p>If \(H\) is a joint distribution function with marginal distributions \(F,G\), then \(H(x,\infty)=F(x)\), \(H(\infty,y)=G(y)\), and \(H(\infty,\infty)=1\). <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a></p></div>
<div class="math-block proof"><span class="block-label">Proof</span><p>The events \(\{X\le x,Y\le y\}\) increase to \(\{X\le x\}\) as \(y\to\infty\). Continuity from below of probability gives the first identity. The second is identical, and the last follows because the whole sample space is reached when both bounds tend to infinity.</p></div>

<h2 id="worked-example">A joint law and its marginal distributions</h2>
<p>Consider \(H(x,y)=0\) when \(x&lt;0\) or \(y&lt;0\), and \(H(x,y)=(1-e^{-x})(1-e^{-y})\) for \(x,y\ge0\). What do its marginal distributions look like? Taking one argument to infinity gives \(F(x)=1-e^{-x}\) and \(G(y)=1-e^{-y}\) on the nonnegative half-line. For nonnegative rectangle endpoints, the volume factors as \((e^{-x_1}-e^{-x_2})(e^{-y_1}-e^{-y_2})\), so it is nonnegative. After transforming by the two marginal distributions, the factorization becomes the product copula.</p>

<div class="problem-grid">
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 1.3</strong><span>Rectangle probability</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Express \(P[x_1&lt;X\le x_2,y_1&lt;Y\le y_2]\) in terms of \(H\).</p></div><div class="answer-panel"><div class="answer-inner"><p>It equals \(H(x_2,y_2)-H(x_1,y_2)-H(x_2,y_1)+H(x_1,y_1)\), by subtracting the two strips and restoring the lower-left rectangle.</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 1.4</strong><span>Discrete transform</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Let \(X\) equal \(0\) and \(1\), each with probability \(1/2\). Describe the values of \(F(X)\).</p></div><div class="answer-panel"><div class="answer-inner"><p>Here \(F(0)=1/2\) and \(F(1)=1\), each with probability \(1/2\). The transform is therefore discrete, so continuity of the marginal distribution matters.</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 1.5</strong><span>Marginal distribution insufficiency</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Let \(U,V\) be independent uniforms. Compare the marginal distributions and the probability that both coordinates are at most \(1/2\) for the pairs \((U,V)\) and \((U,U)\).</p></div><div class="answer-panel"><div class="answer-inner"><p>Both pairs have uniform marginal distributions. Independence gives \(P[U\le1/2,V\le1/2]=1/4\), whereas \(P[U\le1/2,U\le1/2]=1/2\). Thus the same marginal distributions can accompany different joint laws.</p></div></div></article>
</div>

<h2 id="references">References</h2>
<ol class="course-references">
<li id="ref-1">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), §2.1, Definitions 2.1.1–2.1.2 and Lemma 2.1.5, printed pp. 8–10 (PDF pp. 19–21); §2.3, Theorem 2.3.3, printed p. 18 (PDF p. 29).</li>
<li id="ref-2">Jan-Frederik Mai and Matthias Scherer, <em>Financial Engineering with Copulas Explained</em> (2014), §2.3, printed p. 26 (PDF p. 43), probability integral transform for continuous marginal distributions.</li>
</ol>
