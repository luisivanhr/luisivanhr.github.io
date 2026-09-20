---
title: Copulas and Bounds
permalink: /courses/copulas/02-copulas-and-bounds/
updated: 2026-01-01
course_title: Copulas
course_url: /courses/copulas/
course_section_style: theory
section_number: 2
section_kind: Foundations
summary: The copula definition, rectangle volumes, continuity, and the Fréchet-Hoeffding bounds.
prerequisites: Probability and marginal distributions
reading_time: 18 minutes
exercises: 3 exercises
previous_section:
  title: "Probability and Marginal Distributions"
  url: /courses/copulas/01-probability-and-margins/
next_section:
  title: "Sklar's Theorem"
  url: /courses/copulas/03-sklars-theorem/
date: 2026-01-01
---

<section class="intro-strip"><h2 id="overview">A distribution on the unit square</h2><p>A copula is a joint distribution function on the unit square whose two marginal distributions are uniform. Its rectangle volumes encode dependence. Its boundary values preserve the uniform marginal distributions.</p></section>
<h2 id="definition">Definition</h2>
<div class="math-block definition"><span class="block-label">Definition 2.1 <span>Copula</span></span><p>A two-dimensional [[copula]] is a function \(C:I^2\to I\) satisfying \(C(u,0)=C(0,v)=0\), \(C(u,1)=u\), \(C(1,v)=v\), and \(C(u_2,v_2)-C(u_1,v_2)-C(u_2,v_1)+C(u_1,v_1)\ge0\) whenever \(u_1\le u_2\), \(v_1\le v_2\). <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a></p></div>
<p>What does the [[rectangle volume]] inequality contribute? It says that \(C\) assigns nonnegative mass to every rectangle. The boundary equations are the uniform marginal distributions. The functions \(M(u,v)=\min(u,v)\), \(W(u,v)=\max(u+v-1,0)\), and \(\Pi(u,v)=uv\) give three reference arrangements of that mass.</p>
<h2 id="rectangle-surface">Reading the 2-increasing condition</h2>
<p>Draw the graph of \(C\) as a surface above the unit square. Its height at \((u,v)\) is the cumulative probability \(P(U\le u,V\le v)\). The [[2-increasing condition]] compares four heights, one at each corner of a rectangle. For \(R=(a,b]\times(c,d]\), inclusion and exclusion gives</p>
<p>\[P((U,V)\in R)=C(b,d)-C(a,d)-C(b,c)+C(a,c).\]</p>
<p>Start with the probability below both upper thresholds. Subtract the portions with \(U\le a\) and with \(V\le c\), then add their overlap back once. Requiring the result to be nonnegative for every rectangle is precisely the 2-increasing condition.</p>
<figure class="figure-box"><img src="/assets/images/copulas/copula-rectangle-surface.svg" alt="Independence copula surface with a gold rectangle on the unit square, dotted vertical projections, and a dashed blue boundary and internal grid following the surface between its four lifted corners. Corner heights are A 0.06, B 0.24, C 0.14, D 0.56."><figcaption>The gold rectangle is \((0.2,0.8]\times(0.3,0.7]\). Dotted lines connect its corners to the surface \(\Pi(u,v)=uv\); the dashed blue boundary and internal grid follow the surface above the rectangle. The signs beside the heights indicate their contribution to the rectangle probability.</figcaption></figure>
<p>Here the four heights give \(0.56-0.14-0.24+0.06=0.24\). Independence also gives \((0.8-0.2)(0.7-0.3)=0.24\), as expected. The probability comes from this alternating sum of heights. Increasing separately along each coordinate is a weaker requirement; the definition asks us to check the four-corner inequality as well.</p>
<h2 id="bounds">Fréchet-Hoeffding bounds</h2>
<div class="math-block theorem"><span class="block-label">Theorem 2.2 <span>Copula bounds</span></span><p>Every copula satisfies <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a></p><p>\[
W(u,v)\le C(u,v)\le M(u,v).
\]</p></div>
<div class="math-block proof"><span class="block-label">Proof</span><p>Since \(C(u,v)\le C(u,1)=u\) and \(C(u,v)\le C(1,v)=v\), the upper bound follows. The volume of \([u,1]\times[v,1]\) is \(1-u-v+C(u,v)\), so it is nonnegative and \(C(u,v)\ge u+v-1\). Also \(C(u,v)\ge0\), giving the lower bound.</p></div>
<p>Let \(U\) be uniform. The pair \((U,U)\) has joint distribution \(P[U\le u,U\le v]=\min(u,v)=M(u,v)\), so \(M\) is a copula supported on the diagonal. The pair \((U,1-U)\) has joint probability \(P[1-v\le U\le u]=\max(u+v-1,0)=W(u,v)\). Finally, two independent uniforms have joint probability \(uv=\Pi(u,v)\). These constructions verify that both bounds are themselves copulas in dimension two.</p>
<h2 id="bound-surfaces">The three reference surfaces</h2>
<p>The surfaces below use the same axes, viewing angle, and height scale. At each fixed \((u,v)\), every copula height lies between the lower surface \(W\) and the upper surface \(M\). The independence surface \(\Pi\) gives one intermediate choice.</p>
<figure class="figure-box"><div class="simulation-panels"><img src="/assets/images/copulas/copula-surface-lower.svg" alt="Surface of W: zero below u plus v equals one, then a rising plane." loading="lazy"><img src="/assets/images/copulas/copula-surface-independent.svg" alt="Smooth surface of the independence copula Pi equals u times v." loading="lazy"><img src="/assets/images/copulas/copula-surface-upper.svg" alt="Surface of M equals min of u and v, with a crease along the diagonal." loading="lazy"></div><figcaption>The lower bound, independence copula, and upper bound. Surface height and color both indicate cumulative probability.</figcaption></figure>
<p>The flat part of \(W\) records thresholds for which \(U\le u\) and \(1-U\le v\) cannot occur together. The crease in \(M\) follows the change between \(u\) and \(v\) as the smaller threshold. These are surfaces of distribution functions. The probability laws of \((U,1-U)\) and \((U,U)\) remain concentrated on the counterdiagonal and diagonal of the unit square, respectively.</p>
<h2 id="continuity">A useful continuity estimate</h2>
<div class="math-block lemma"><span class="block-label">Lemma 2.3 <span>Lipschitz estimate</span></span><p>For any copula \(C\), <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a></p><p>\[|C(u_2,v_2)-C(u_1,v_1)|\le |u_2-u_1|+|v_2-v_1|.\]</p></div>
<p>For \(a\le b\), rectangle positivity on \([a,b]\times[0,v]\) and \([a,b]\times[v,1]\) gives \(0\le C(b,v)-C(a,v)\le b-a\). Reversing the endpoints yields \(|C(b,v)-C(a,v)|\le|b-a|\). The same reasoning holds for changes in the second coordinate.</p><p>Now move from \((u_1,v_1)\) to \((u_2,v_1)\), then from \((u_2,v_1)\) to \((u_2,v_2)\). Adding the two bounds gives the displayed estimate. This is the continuity control needed when a copula is specified first on a restricted range.</p>
<figure class="figure-box"><img src="/assets/images/copulas/copula-bounds.svg" alt="Labeled contour lines for the lower bound W, independence, and the upper bound M."><figcaption>Each contour joins points with the same cumulative probability. The three copulas have uniform marginal distributions and different arrangements of probability inside the square.</figcaption></figure>
<div class="problem-grid">
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 2.4</strong><span>Verify a copula</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Verify the rectangle condition for \(\Pi(u,v)=uv\).</p></div><div class="answer-panel"><div class="answer-inner"><p>The volume is \(u_2v_2-u_1v_2-u_2v_1+u_1v_1=(u_2-u_1)(v_2-v_1)\ge0\). The boundary identities are immediate.</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 2.5</strong><span>Bounds at a point</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Find the possible interval for \(C(0.3,0.8)\).</p></div><div class="answer-panel"><div class="answer-inner"><p>The lower bound is \(\max(0.3+0.8-1,0)=0.1\), and the upper bound is \(\min(0.3,0.8)=0.3\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 2.6</strong><span>Convex mixtures</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Show that \(C_q=(1-q)C_0+qC_1\) is a copula for \(0\le q\le1\).</p></div><div class="answer-panel"><div class="answer-inner"><p>Boundary values are preserved by linearity. The rectangle volume is \((1-q)V_{C_0}+qV_{C_1}\ge0\). Hence \(C_q\) satisfies every copula condition.</p></div></div></article>
</div>
<h2 id="references">References</h2>
<ol class="course-references">
<li id="ref-1">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), §2.2, Definition 2.2.2 and Theorems 2.2.3–2.2.4, printed pp. 10–13 (PDF pp. 21–24); §2.1, Definition 2.1.1, printed p. 8 (PDF p. 19).</li>
</ol>
