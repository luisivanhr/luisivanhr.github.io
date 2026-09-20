---
title: Concordance Measures
updated: 2026-01-01
course_title: Copulas
course_url: /courses/copulas/
course_section_style: theory
section_number: 7
section_kind: Rank dependence
summary: Derive Kendall's tau and Spearman's rho from a copula.
prerequisites: Archimedean copulas
reading_time: 13 minutes
exercises: 3 exercises
permalink: /courses/copulas/07-concordance/
previous_section:
  title: "Archimedean Copulas"
  url: /courses/copulas/06-archimedean-copulas/
next_section:
  title: "Tail Dependence"
  url: /courses/copulas/08-tail-dependence/
date: 2026-01-01
---
<section class="intro-strip" id="overview"><h2>Dependence without units</h2><p>What should remain after the units of measurement change? Ranks answer that question. If \((U_1,U_2)\) has copula \(C\), concordance measures depend on \(C\) alone, so strictly increasing transformations of the marginal distributions leave them unchanged.</p></section>
<div class="math-block definition"><span class="block-label">Definition 7.1 <span>[[Kendall's tau]]</span></span><p>For an independent copy \((V_1,V_2)\), \[\tau_C=P((U_1-V_1)(U_2-V_2)>0)-P((U_1-V_1)(U_2-V_2)&lt;0).\] Equivalently, \(\tau_C=4E[C(U_1,U_2)]-1\). <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a></p></div>
<div class="math-block theorem"><span class="block-label">Theorem 7.2 <span>Integral formula</span></span><p>\[\tau_C=1-4\int_0^1\int_0^1 C_1(u,v)C_2(u,v)\,du\,dv.\]</p></div>
<div class="math-block proof"><span class="block-label">Derivation</span><p>For an independent copy \((V_1,V_2)\), condition on \((U_1,U_2)=(u,v)\). The copy is concordant with \((u,v)\) when it lies in the lower-left rectangle \([0,u]\times[0,v]\) or the upper-right rectangle \((u,1]\times(v,1]\). Their probabilities are \(C(u,v)\) and \(1-u-v+C(u,v)\). The discordant rectangles have total probability \(u+v-2C(u,v)\). Subtracting gives \(4C(u,v)-2u-2v+1\). Taking expectations and using \(E[U_i]=1/2\) yields \(\tau_C=4E[C(U_1,U_2)]-1\). Write the expectation as \(\int\!\int C\,dC\). To see the integration-by-parts step directly, assume first that \(C\) has continuous second partial derivatives. For each \(v\), integrate \(CC_{12}\) with respect to \(u\):</p><p>\[\int_0^1 C C_{12}\,du=[CC_2]_{u=0}^{u=1}-\int_0^1 C_1C_2\,du=v-\int_0^1 C_1C_2\,du.\]</p><p>Here \(C(1,v)=v\), \(C_2(1,v)=1\), and the lower boundary contributes zero. Integrating in \(v\) gives \(E[C(U_1,U_2)]=1/2-\int\!\int C_1C_2\), which proves the stated formula in this smooth case. The formula for arbitrary copulas, including singular ones, is the general result in Mai and Scherer's Lemma 1.6; its partial derivatives are interpreted almost everywhere.</p></div>
<h2 id="rho">Spearman's rho</h2>
<div class="math-block definition"><span class="block-label">Definition 7.3 <span>Spearman's rho</span></span><p>\[\rho_C=\operatorname{Corr}(U_1,U_2)=12E[U_1U_2]-3=12\int_0^1\int_0^1 C(u,v)\,du\,dv-3.\]</p></div>
<p>To obtain the integral formula for \(\rho_C\), use the survival representation of a variable in \([0,1]\): \(U_1U_2=\int_0^1\int_0^1\mathbf 1\{U_1>s,U_2>t\}\,ds\,dt\). Tonelli's theorem gives \(E[U_1U_2]=\int_0^1\int_0^1P(U_1>s,U_2>t)\,ds\,dt\). The joint survival probability is \(1-s-t+C(s,t)\). Integrating the terms \(1-s-t\) gives \(1-1/2-1/2=0\), so \(E[U_1U_2]=\int\!\int C\). Since \(\operatorname{Var}(U_i)=1/12\), \(\rho_C=12E[U_1U_2]-3\). Both measures are zero for independence and one for the comonotone copula. <a class="course-citation" href="#ref-2" aria-label="Reference 2">[2]</a></p>
<h2 id="exercises">Exercises</h2>
<article class="exercise" id="exercise-7-1"><header class="exercise-head"><div><strong>Exercise 7.1</strong><span>Independence.</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Compute both measures for \(\Pi(u,v)=uv\).</p></div><div class="answer-panel"><div class="answer-inner"><p>\(\Pi_1=v,\Pi_2=u\), so \(\tau=1-4(1/4)=0\). Also \(\rho=12(1/4)-3=0\).</p></div></div></article>
<article class="exercise" id="exercise-7-2"><header class="exercise-head"><div><strong>Exercise 7.2</strong><span>Comonotonicity.</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Verify \(\rho_M=1\) for \(M(u,v)=\min(u,v)\).</p></div><div class="answer-panel"><div class="answer-inner"><p>Split along \(u=v\): \(\int\!\int M=2\int_0^1\int_0^v u\,du\,dv=1/3\), hence \(12/3-3=1\).</p></div></div></article>
<article class="exercise" id="exercise-7-3"><header class="exercise-head"><div><strong>Exercise 7.3</strong><span>Rank invariance.</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Why do increasing marginal transformations preserve these measures?</p></div><div class="answer-panel"><div class="answer-inner"><p>They preserve every pairwise order and therefore preserve the probability integral transforms and copula. The displayed formulas are unchanged.</p></div></div></article>
<div id="source-note"></div>
<h2 id="references">References</h2>
<ol class="course-references">
<li id="ref-1">Jan-Frederik Mai and Matthias Scherer, <em>Simulating Copulas: Stochastic Models, Sampling Algorithms, and Applications</em>, second edition (2017), Definitions 1.3–1.4 and Lemmas 1.6–1.7, concordance definitions and integral formulas, printed pp. 30–32 (PDF pp. 49–51).</li>
<li id="ref-2">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), Section 5.1.1, Theorem 5.1.3, printed p. 161 (PDF p. 170), and Section 5.1.2, printed pp. 167–170, Kendall and Spearman formulas.</li>
</ol>
