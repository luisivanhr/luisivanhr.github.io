---
title: "Appendix: Background for the Proofs"
permalink: /courses/copulas/appendix-background/
date: 2026-01-01
updated: 2026-01-01
course_title: Copulas
course_url: /courses/copulas/
course_section_style: reference
section_number: A
section_kind: Optional background
summary: The integration, conditioning, and approximation tools used in the expanded proofs.
prerequisites: Elementary probability and calculus; consult each item when a proof links here
reading_time: 10 minutes
exercises: See the exercises in the linked lessons
previous_section:
  title: Notation, Formula Guide, and References
  url: /courses/copulas/14-reference/
---

<section class="intro-strip"><h2 id="overview">Tools to consult when needed</h2><p>The expanded proofs use a few results from analysis and probability. We state the general background here and keep the copula arguments in their lessons. The references identify where the supplied books state or use these tools; those books do not prove every general analysis result. The approximation calculations at the end are included to make the course proof in Lesson 20 self-contained.</p></section>

<h2 id="measure-tools">Integration and limits</h2>
<p>A set has Lebesgue measure zero if its length, area, or higher-dimensional volume is zero. “Almost everywhere” allows an exception on such a set. Integrating a bounded function over a null set contributes zero. A countable union of null sets is still null, which lets us impose derivative identities at all rational thresholds outside one exceptional set.</p>
<p><strong>Lipschitz sections.</strong> If \(|h(x)-h(y)|\le L|x-y|\) on an interval, then \(h\) is absolutely continuous, has a derivative almost everywhere, and satisfies \(h(b)-h(a)=\int_a^b h'(s)\,ds\). In particular, \(|h'|\le L\) almost everywhere. Copula sections have \(L=1\). These facts justify the derivative calculations in <a href="/courses/copulas/04-densities-and-conditioning/#proof-conditional-section">Lesson 4</a>. Nelsen uses almost-everywhere differentiation in Theorem 2.2.7. <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a></p>
<p><strong>Interchanging integrals.</strong> Tonelli's theorem allows the order of integration to be exchanged for a nonnegative measurable function. Fubini's theorem does the same for a function whose absolute value has finite integral. An expectation is also an integral, so the rules apply to expressions such as \(E[\int f(X,t)\,dt]\). Bounded integrands on probability spaces satisfy the integrability condition. Mai and Scherer use this interchange in their proof of the Spearman formula. <a class="course-citation" href="#ref-2" aria-label="Reference 2">[2]</a></p>
<p><strong>Passing a limit through an integral.</strong> Dominated convergence applies when \(f_n\to f\) almost everywhere and \(|f_n|\le g\) for a single integrable function \(g\). Then \(\int f_n\to\int f\). On a probability space, a common finite bound suffices. For nonnegative functions increasing pointwise, monotone convergence gives the same conclusion without an integrable dominating function.</p>
<p><strong>Stieltjes integration by parts.</strong> If \(G\) is a distribution function supported on \([0,1]\) and \(h\) is absolutely continuous there, then
\[
\int_{[0,1]}h(u)\,dG(u)=h(1)-\int_0^1G(u)h'(u)\,du.
\]
The left side is expectation under \(G\), including any atoms at the endpoints. This follows by writing \(h(x)=h(1)-\int_x^1h'(u)\,du\) and applying Fubini. The formula is used in <a href="/courses/copulas/07-concordance/#proof-kendall-arbitrary-copulas">Lesson 7</a>. Nelsen also uses Stieltjes integration by parts in the Archimedean Kendall calculation. <a class="course-citation" href="#ref-3" aria-label="Reference 3">[3]</a></p>

<h2 id="probability-kernels">Conditional probability kernels</h2>
<p>For real-valued random variables, a regular conditional law \(K(u,B)\) gives the conditional probability that the second variable lies in a measurable set \(B\), given first coordinate \(u\). For each \(u\), \(B\mapsto K(u,B)\) is a probability measure; for each \(B\), \(u\mapsto K(u,B)\) is measurable. Such a version exists for the real and finite-dimensional variables used here and is determined only up to sets of conditioning values of probability zero.</p>
<p>If \((U,V)\) has copula \(C\), the first marginal is uniform. The defining identity is
\[
P(U\in A,V\in B)=\int_A K(u,B)\,du.
\]
Consequently, an integrable \(f\) satisfies
\[
E[f(U,V)]=\int_0^1\left(\int_{[0,1]}f(u,v)\,K(u,dv)\right)du.
\]
This is the conditional integration rule, also called disintegration. It applies to singular as well as absolutely continuous joint laws. <a href="/courses/copulas/04-densities-and-conditioning/#proof-conditional-section">Lesson 4</a> identifies the conditional distribution function with a version of a copula partial derivative. Mai and Scherer use that identity in the conditional sampling method. <a class="course-citation" href="#ref-4" aria-label="Reference 4">[4]</a></p>

<h2 id="laplace-transforms">Bernstein's Laplace-transform theorem</h2>
<p>Let \(\psi:[0,\infty)\to[0,1]\) be continuous, with \(\psi(0)=1\) and \(\psi(t)\to0\) as \(t\to\infty\). It is completely monotone, meaning \((-1)^k\psi^{(k)}(t)\ge0\) for all integers \(k\ge0\) and \(t>0\), if and only if
\[
\psi(t)=E[e^{-tA}]
\]
for a positive random variable \(A\). This is Bernstein's theorem as stated by Mai and Scherer. <a class="course-citation" href="#ref-5" aria-label="Reference 5">[5]</a> It is the background representation used in <a href="/courses/copulas/09-multivariate-copulas/#construct">Lesson 9</a>; the construction of the resulting copula is proved there. The endpoint conditions specify a probability law of total mass one with no mass at zero.</p>

<h2 id="approximation">Two approximation tools</h2>
<p>The following calculations support the full proof of the Pickands characterization in <a href="/courses/copulas/20-extreme-value-copulas/#proof-pickands-characterization">Lesson 20</a>. Nelsen states that characterization; the approximation argument below is part of the course derivation. <a class="course-citation" href="#ref-6" aria-label="Reference 6">[6]</a></p>
<p><strong>Smoothing in logarithmic coordinates.</strong> For a continuous function \(h\) on the positive quadrant, let
\[
h_\varepsilon(x,y)=\int_{\mathbb R^2}h(e^a x,e^b y)\,\eta_\varepsilon(a,b)\,da\,db,
\]
where \(\eta_\varepsilon\) is nonnegative, smooth, has integral one, and vanishes outside \(|a|,|b|\le\varepsilon\). Such averaging functions can be obtained by rescaling a smooth bump function. With \(x=e^r,y=e^s\), this is convolution with a smooth compactly supported function in \((r,s)\); changing integration variables transfers derivatives to that function. Thus \(h_\varepsilon\) is smooth. Uniform continuity on compact subsets gives \(h_\varepsilon\to h\) locally uniformly. Every linear equality or inequality preserved by the coordinate rescalings is preserved by the nonnegative average. Lesson 20 checks this explicitly for homogeneity and rectangle inequalities.</p>
<p><strong>Bernstein polynomials.</strong> For a continuous \(f\) on \([0,1]\), put
\[
B_nf(w)=\sum_{k=0}^n f(k/n)\binom nk w^k(1-w)^{n-k}.
\]
Equivalently, \(B_nf(w)=E[f(K/n)]\) for \(K\) binomial with parameters \(n,w\). Since \(E[K/n]=w\) and \(\operatorname{Var}(K/n)=w(1-w)/n\le1/(4n)\), the probability that \(|K/n-w|>\delta\) is at most \(1/(4n\delta^2)\). Uniform continuity of \(f\), followed by this bound on the remaining event, proves uniform convergence \(B_nf\to f\).</p>
<p>If \(f\) is convex, its discrete second differences \(f((k+2)/n)-2f((k+1)/n)+f(k/n)\) are nonnegative. Twice differentiating the polynomial gives their weighted sum with nonnegative binomial weights and factor \(n(n-1)\). Thus \(B_nf\) is convex. Its endpoint values equal those of \(f\), and Jensen's inequality gives \(B_nf(w)\ge f(E[K/n])=f(w)\). These facts supply exactly the approximation properties used in Lesson 20.</p>

<h2 id="references">References</h2>
<ol class="course-references">
<li id="ref-1">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), §2.2, Theorem 2.2.4 and Theorem 2.2.7, printed pp. 11–14 (PDF pp. 22–25): Lipschitz bounds and almost-everywhere partial derivatives.</li>
<li id="ref-2">Jan-Frederik Mai and Matthias Scherer, <em>Simulating Copulas: Stochastic Models, Sampling Algorithms, and Applications</em>, second edition (2017), Lemma 1.7(4), printed pp. 31–32 (PDF pp. 50–51): Fubini's theorem in the Spearman calculation.</li>
<li id="ref-3">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), Corollary 5.1.4 and equations (5.1.10)–(5.1.11), printed p. 163 (PDF p. 172): integration by parts against the Kendall distribution function.</li>
<li id="ref-4">Jan-Frederik Mai and Matthias Scherer, <em>Simulating Copulas: Stochastic Models, Sampling Algorithms, and Applications</em>, second edition (2017), §1.1.3, Algorithm 1.2 and its conditional-distribution identity, printed pp. 22–24 (PDF pp. 41–43). This is an application of conditional laws; the general existence theorem for probability kernels is background.</li>
<li id="ref-5">Jan-Frederik Mai and Matthias Scherer, <em>Simulating Copulas: Stochastic Models, Sampling Algorithms, and Applications</em>, second edition (2017), §2.2.1, Theorem 2.1, printed p. 64 (PDF p. 83): Bernstein's theorem, stated there with references for its general proof.</li>
<li id="ref-6">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), §3.3.4, equation (3.3.12) and the Pickands-function conditions, printed p. 98 (PDF p. 108): the characterization proved in Lesson 20.</li>
</ol>
