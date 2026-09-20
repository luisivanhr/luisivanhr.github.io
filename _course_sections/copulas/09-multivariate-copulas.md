---
title: Multivariate Copulas
updated: 2026-01-01
course_title: Copulas
course_url: /courses/copulas/
course_section_style: theory
section_number: 9
section_kind: Higher dimensional dependence
summary: Extend copulas to d dimensions and identify construction constraints.
prerequisites: Tail dependence
reading_time: 14 minutes
exercises: 3 exercises
permalink: /courses/copulas/09-multivariate-copulas/
previous_section:
  title: "Tail Dependence"
  url: /courses/copulas/08-tail-dependence/
next_section:
  title: "Workshop: A Common Factor and Joint Defaults"
  url: /courses/copulas/09a-common-factor-workshop/
date: 2026-01-01
---
<section class="intro-strip" id="definition"><h2>The d-dimensional object</h2><p>What must a higher-dimensional dependence function preserve? A \(d\)-copula is a distribution function \(C:[0,1]^d\to[0,1]\) whose every one-dimensional marginal distribution is uniform. Equivalently, fixing all coordinates except coordinate \(j\) at one gives \(C(1,\ldots,1,u_j,1,\ldots,1)=u_j\), \(C\) vanishes whenever a coordinate is zero, and \(C\) is \(d\)-increasing. <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a></p></section>
<div class="math-block theorem"><span class="block-label">Theorem 9.1 <span>Multivariate Sklar representation</span></span><p>If \(F\) has marginal distributions \(F_1,\ldots,F_d\), then \(F(x_1,\ldots,x_d)=C(F_1(x_1),\ldots,F_d(x_d))\) for a copula \(C\). If the marginal distributions are continuous, \(C\) is unique.</p></div>
<p>The \(d\)-increasing condition assigns a nonnegative alternating sum to every axis-aligned box. In dimension three, the sum has eight corner values, with signs determined by inclusion and exclusion. The tempting formula \(W_d(u)=\max(1-d+\sum_j u_j,0)\) is a valid lower bound, but it is not generally a \(d\)-copula for \(d>2\). A pointwise formula can have the right marginal distributions and still fail a box-probability test.</p>
<h2 id="construct">Supported constructions</h2>
<div class="math-block definition"><span class="block-label">Definition 9.2 <span>Gaussian copula</span></span><p>Let \(Z\) be multivariate normal with correlation matrix \(R\). Each \(Z_j\) is standard normal, so \(U_j=\Phi(Z_j)\) is uniform. Therefore the joint distribution of \(U\) is \[C_R(u)=\Phi_R(\Phi^{-1}(u_1),\ldots,\Phi^{-1}(u_d)).\] Positive semidefiniteness of \(R\) is the compatibility condition because it is what makes \(R\) a valid correlation matrix. <a class="course-citation" href="#ref-2" aria-label="Reference 2">[2]</a></p></div>
<div class="math-block theorem"><span class="block-label">Theorem 9.3 <span>A construction valid in every dimension</span></span><p>Let \(\psi:[0,\infty)\to(0,1]\) be continuous, strictly decreasing, satisfy \(\psi(0)=1\) and \(\lim_{t\to\infty}\psi(t)=0\), and be [[completely monotone]]: \((-1)^k\psi^{(k)}(t)\ge0\) for every integer \(k\ge0\) and \(t&gt;0\). Put \(\varphi=\psi^{-1}\). Then</p><p>\[C(u_1,\ldots,u_d)=\psi\!\left(\sum_{j=1}^d\varphi(u_j)\right)\]</p><p>is a copula in every dimension, with boundary values supplied by continuity. Nelsen's Theorem 4.6.2 gives the all-dimensions characterization in terms of the inverse generator. <a class="course-citation" href="#ref-3" aria-label="Reference 3">[3]</a></p></div>
<div class="math-block proof"><span class="block-label">Construction from a shared positive variable</span><p>The Laplace-transform characterization cited below represents \(\psi(t)=E[e^{-tA}]\) for a positive random variable \(A\). The endpoint limit zero excludes mass at \(A=0\). Given \(A\), take independent unit-rate exponentials \(E_1,\ldots,E_d\), and set \(U_j=\psi(E_j/A)\). Since \(\psi\) decreases, <a class="course-citation" href="#ref-4" aria-label="Reference 4">[4]</a></p><p>\[P[U_j\le u_j\mid A]=P[E_j\ge A\varphi(u_j)\mid A]=e^{-A\varphi(u_j)}.\]</p><p>Conditional independence now gives \(P[U_j\le u_j\text{ for all }j\mid A]=\exp[-A\sum_j\varphi(u_j)]\). Taking expectation produces the displayed \(C\). Its marginal probability is \(E[e^{-A\varphi(u)}]=\psi(\varphi(u))=u\). This constructs the joint law and checks its marginal distributions directly.</p></div>
<p>The shared variable \(A\) introduces dependence even though the exponentials are independent conditionally on it. This is the [[frailty construction]] used in simulation. The condition concerns the inverse generator \(\psi\). Convexity of the additive generator \(\varphi\), sufficient in dimension two, does not by itself guarantee a model in every dimension.</p>
<p>For an application of this construction, try the optional <a href="/courses/copulas/09a-common-factor-workshop/">common-factor workshop</a>. To stay on the main route, continue to <a href="/courses/copulas/10-simulation/">Lesson 10</a>.</p>
<h2 id="exercises">Exercises</h2>
<article class="exercise" id="exercise-9-1"><header class="exercise-head"><div><strong>Exercise 9.1</strong><span>Marginal distribution check.</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Check the first marginal distribution of \(C_R\).</p></div><div class="answer-panel"><div class="answer-inner"><p>Sending all other \(u_j\) to one sends their normal quantiles to infinity, leaving \(\Phi(\Phi^{-1}(u_1))=u_1\).</p></div></div></article>
<article class="exercise" id="exercise-9-2"><header class="exercise-head"><div><strong>Exercise 9.2</strong><span>Lower-bound warning.</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Show that \(W_3\) fails the box-probability condition on \([1/2,1]^3\). <strong>Hint.</strong> Group the eight corners by how many coordinates equal one.</p></div><div class="answer-panel"><div class="answer-inner"><p>At \((1,1,1)\), the value is 1. At each of the three corners with two coordinates equal to 1 and one equal to \(1/2\), the value is \(1/2\). Corners with one or no coordinates equal to 1 have value zero. The alternating box volume is therefore \(1-3(1/2)+3(0)-0=-1/2\). A negative probability is impossible, so \(W_3\) is not a copula.</p></div></div></article>
<article class="exercise" id="exercise-9-3"><header class="exercise-head"><div><strong>Exercise 9.3</strong><span>Correlation validity.</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Why can three pairwise correlations fail to define a Gaussian copula?</p></div><div class="answer-panel"><div class="answer-inner"><p>Every correlation matrix must satisfy \(a^TRa\ge0\), because this expression is the variance of \(\sum_j a_j Z_j\). If all three off-diagonal entries are \(-0.9\), each pairwise value lies in \([-1,1]\), but for \(a=(1,1,1)^T\) the quadratic form is \(3+6(-0.9)=-2.4\). Thus these three values cannot be correlations of one Gaussian vector.</p></div></div></article>
<div id="source-note"></div>
<h2 id="references">References</h2>
<ol class="course-references">
<li id="ref-1">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), Section 2.10, multivariate copulas and Sklar's theorem, printed pp. 42–49 (PDF pp. 53–60).</li>
<li id="ref-2">Jan-Frederik Mai and Matthias Scherer, <em>Simulating Copulas: Stochastic Models, Sampling Algorithms, and Applications</em>, second edition (2017), Sections 4.4–4.5, elliptical and Gaussian copulas, printed pp. 174–176 (PDF pp. 193–195).</li>
<li id="ref-3">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), Section 4.6, Definition 4.6.1 and Theorem 4.6.2, completely monotone inverse-generator condition, printed pp. 151–152 (PDF pp. 161–162).</li>
<li id="ref-4">Jan-Frederik Mai and Matthias Scherer, <em>Simulating Copulas: Stochastic Models, Sampling Algorithms, and Applications</em>, second edition (2017), Section 2.2.1, Theorems 2.1–2.2, Laplace transforms and extendible Archimedean copulas, printed pp. 63–64 (PDF pp. 82–83).</li>
</ol>
