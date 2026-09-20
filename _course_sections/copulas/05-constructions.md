---
title: Constructions
permalink: /courses/copulas/05-constructions/
updated: 2026-01-01
course_title: Copulas
course_url: /courses/copulas/
course_section_style: hybrid
section_number: 5
section_kind: Construction and examples
summary: Inversion, convex mixtures, survival transformations, and the FGM family.
prerequisites: Sklar's theorem and copula densities
reading_time: 20 minutes
exercises: 3 exercises
previous_section:
  title: "Densities and Conditioning"
  url: /courses/copulas/04-densities-and-conditioning/
next_section:
  title: "Archimedean Copulas"
  url: /courses/copulas/06-archimedean-copulas/
date: 2026-01-01
---

<section class="intro-strip"><h2 id="overview">Building new copulas</h2><p>There are several reliable construction principles. Inversion extracts a copula from a joint law. Convex sums mix existing copulas. A simple polynomial family gives a tractable example for calculation and simulation.</p></section>
<h2 id="inversion">Inversion</h2>
<p>When \(H\) has continuous marginal distributions \(F,G\), use their generalized inverses for \(0&lt;u,v&lt;1\). Sklar's theorem then gives:</p>
<p>\[
C(u,v)=H(F^{-1}(u),G^{-1}(v)).
\]</p>
<p>Boundary values are supplied by continuity. Why invert? We may find it easier to write a joint model in its original units and compare its dependence on the unit square. The same idea applies to survival functions. Nelsen's Marshall-Olkin example uses a survival copula for lifetimes because common shocks are naturally expressed through \(P[X>x,Y>y]\). <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a></p>
<h2 id="survival">The survival copula</h2>
<p>Let \((U,V)\) have copula \(C\). The transformed coordinates \((1-U,1-V)\) are again uniform. Their copula, called the [[survival copula]], is <a class="course-citation" href="#ref-2" aria-label="Reference 2">[2]</a></p><p>\[\widehat C(u,v)=u+v-1+C(1-u,1-v).\]</p><div class="math-block proof"><span class="block-label">Derivation</span><p>The event \(\{1-U\le u,1-V\le v\}\) asks for \(U\ge1-u\) and \(V\ge1-v\). Inclusion-exclusion gives \(1-(1-u)-(1-v)+C(1-u,1-v)\). Uniform marginal distributions have no point masses, so strict versus non-strict threshold inequalities do not change these probabilities.</p></div>
<p>For continuous lifetimes with distribution functions \(F,G\), put \(S_X(x)=1-F(x)\), \(S_Y(y)=1-G(y)\). The same calculation gives \(P[X&gt;x,Y&gt;y]=\widehat C(S_X(x),S_Y(y))\). This form will be useful when discussing default times in Lesson 12.</p>
<h2 id="mixtures">Convex sums</h2>
<p>The notation \(\int f(q)\,dL(q)\) means an average of \(f(q)\) when the parameter \(q\) has probability distribution \(L\). For finitely many possible values \(q_i\) with probabilities \(p_i\), it is the weighted sum \(\sum_i p_i f(q_i)\).</p>
<div class="math-block theorem"><span class="block-label">Theorem 5.1 <span>Mixture construction</span></span><p>If \(C_q\) is a family of copulas, \(q\mapsto C_q(u,v)\) is measurable for every \((u,v)\), and \(L\) is a probability distribution on the parameter, then</p><p>\[
\widetilde C(u,v)=\int C_q(u,v)\,dL(q)
\]</p><p>is a copula.</p></div>
<div class="math-block proof"><span class="block-label">Proof</span><p>Each boundary value passes through the integral unchanged. The rectangle volume of \(\widetilde C\) is the integral of the nonnegative rectangle volumes of \(C_q\). Hence it is nonnegative, and all copula conditions hold.</p></div>
<p>A finite convex combination is the special case of a discrete mixing distribution. It combines dependence patterns while preserving the uniform marginal distributions because each component has those same boundary values. <a class="course-citation" href="#ref-3" aria-label="Reference 3">[3]</a></p>
<h2 id="fgm">The Farlie-Gumbel-Morgenstern family</h2>
<p>A useful polynomial construction is the [[Farlie-Gumbel-Morgenstern copula]], abbreviated FGM: <a class="course-citation" href="#ref-4" aria-label="Reference 4">[4]</a></p><p>\[C_\theta(u,v)=uv\{1+\theta(1-u)(1-v)\}.\]</p><p>The grounded and marginal conditions hold for every real \(\theta\). Differentiating gives</p><p>\[c_\theta(u,v)=1+\theta(1-2u)(1-2v).\]</p><p>On the square, each factor \(1-2u,1-2v\) belongs to \([-1,1]\). Hence \(c_\theta\ge1-|\theta|\), which is nonnegative when \(-1\le\theta\le1\). Integrating this density over a rectangle proves the rectangle condition.</p><p>The parameter range is also necessary. If \(\theta&gt;1\), the density is negative in a small rectangle near \((0,1)\); if \(\theta&lt;-1\), it is negative near \((0,0)\). In either case that rectangle would have negative mass. Thus precisely \(\theta\in[-1,1]\) gives copulas. The value \(\theta=0\) is independence. Positive parameters increase lower-left cumulative probabilities relative to independence, since \(C_\theta(u,v)-uv=\theta uv(1-u)(1-v)\).</p><p>This tractable density will let us calculate a Bayesian posterior explicitly in Lesson 11. Its simplicity also limits the dependence it can express; it is useful to compare its range of concordance with richer families.</p>
<div class="problem-grid">
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 5.2</strong><span>Inversion</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Let \(F,G\) be continuous and strictly increasing, and let \(H(x,y)=C(F(x),G(y))\). Apply inversion to recover \(C\).</p></div><div class="answer-panel"><div class="answer-inner"><p>Set \(x=F^{-1}(u)\), \(y=G^{-1}(v)\). Then \(H(F^{-1}(u),G^{-1}(v))=C(u,v)\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 5.3</strong><span>Mixture marginal distributions</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Show that \(\widetilde C=(1-q)C_0+qC_1\) has uniform marginal distributions.</p></div><div class="answer-panel"><div class="answer-inner"><p>\(\widetilde C(u,1)=(1-q)u+qu=u\), and \(\widetilde C(1,v)=v\). At zero, both terms vanish. The rectangle condition follows from the convex combination of volumes.</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 5.4</strong><span>FGM values</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Compute \(C_\theta(1/2,1/2)\) for \(\theta=0,1,-1\).</p></div><div class="answer-panel"><div class="answer-inner"><p>Since \(uv=1/4\) and \((1-u)(1-v)=1/4\), \(C_\theta=\frac14(1+\theta/4)\). The values are \(1/4\), \(5/16\), and \(3/16\).</p></div></div></article>
</div>
<h2 id="references">References</h2>
<ol class="course-references">
<li id="ref-1">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), §3.1, inversion equation (3.1.1), printed p. 52 (PDF p. 62).</li>
<li id="ref-2">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), §2.6, survival-copula equations (2.6.1)–(2.6.2), printed p. 32 (PDF p. 43).</li>
<li id="ref-3">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), §3.2.4, convex-sum equation (3.2.4), printed p. 72 (PDF p. 82).</li>
<li id="ref-4">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), Example 3.12 and equation (3.2.10), printed pp. 77–78 (PDF pp. 87–88), for the Farlie-Gumbel-Morgenstern formula and parameter range.</li>
</ol>
