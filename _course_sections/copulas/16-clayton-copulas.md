---
title: Clayton Copulas
permalink: /courses/copulas/16-clayton-copulas/
course_title: Copulas
course_url: /courses/copulas/
course_section_style: hybrid
section_number: 16
summary: Derive the Clayton family, its association, tails, and frailty simulation.
prerequisites: Archimedean copulas and concordance
reading_time: 15 minutes
exercises: 3 worked exercises
previous_section:
  title: "Student-t Copulas"
  url: /courses/copulas/15-student-t-copulas/
next_section:
  title: "Gumbel Copulas"
  url: /courses/copulas/17-gumbel-copulas/
date: 2026-01-01
updated: 2026-01-01
---
<section class="intro-strip"><h2 id="definition">A lower-tail family</h2><p>The [[Clayton]] generator \(\varphi_\theta(u)=(u^{-\theta}-1)/\theta\) gives, for \(\theta>0\), \[C_\theta(u,v)=(u^{-\theta}+v^{-\theta}-1)^{-1/\theta}.\] The parameter increases lower-tail association.</p></section>
<div class="math-block definition"><span class="block-label">Definition 16.1 <span>Density</span></span><p>For interior coordinates, write \(S=u^{-\theta}+v^{-\theta}-1\). First, the chain rule gives \(\partial_1C=u^{-\theta-1}S^{-1/\theta-1}\). Differentiating this expression in \(v\) contributes the factor \((-1/\theta-1)(-\theta)v^{-\theta-1}\). Thus \[c_\theta(u,v)=(1+\theta)(uv)^{-1-\theta}(u^{-\theta}+v^{-\theta}-1)^{-2-1/\theta}.\] Every factor is positive on the open square.</p></div>
<div class="math-block theorem"><span class="block-label">Theorem 16.2 <span>Kendall's tau</span></span><p>\[\tau_\theta=\frac{\theta}{\theta+2}.\]</p></div>
<div class="math-block proof"><span class="block-label">Proof</span><p>For an Archimedean generator, the concordance integral reduces to \(\tau=1+4\int_0^1\varphi(u)/\varphi'(u)\,du\). Here \(\varphi'(u)=-u^{-\theta-1}\), so \(\varphi/\varphi'=-(u-u^{\theta+1})/\theta\). Integration gives \(\tau=1+4(-1/(2(\theta+2)))=\theta/(\theta+2)\).</p></div>
<p>On the diagonal, \(C(t,t)=t(2-t^\theta)^{-1/\theta}\). Dividing by \(t\) and letting \(t\) decrease to zero gives \(\lambda_L=2^{-1/\theta}\). At the other endpoint, let \(d(t)=C(t,t)\). Differentiation gives \(d'(1)=2\), so l'Hôpital's rule yields \(\lambda_U=\lim_{t\uparrow1}[1-2t+d(t)]/(1-t)=2-d'(1)=0\). The displayed copula, density, concordance formula, and gamma frailty sampler all use \(\theta>0\).</p>
<h2 id="simulation">Frailty and conditional simulation</h2><p>For \(\theta>0\), let \(M\sim\Gamma(1/\theta,1/\theta)\), using shape and rate notation. Its Laplace transform is \(E[e^{-tM}]=(1+\theta t)^{-1/\theta}\), the inverse generator. If \(E_i\) are independent unit exponential variables, set \(U_i=(1+\theta E_i/M)^{-1/\theta}\). Conditional on \(M\), the coordinates are generated from independent exponentials; integrating over the common frailty produces the Clayton dependence. The generated family figure uses \(\theta=2\).</p><figure class="figure-box"><img src="/assets/images/copulas/family-simulation.svg" alt="Simulated Clayton, Gumbel, and Frank copula pairs"><figcaption>Conditional-inversion samples: Clayton and Gumbel at \(\theta=2\), and Frank at \(\theta=5\), with 1,500 pairs shown for each. The Clayton panel concentrates more mass near the lower-left corner; the Gumbel panel concentrates more near the upper-right corner. The next two lessons derive their conditional distributions.</figcaption></figure>
<h2 id="exercises">Exercises</h2>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 16.1</strong><span>Association</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Find \(\theta\) when \(\tau=1/2\).</p></div><div class="answer-panel"><div class="answer-inner"><p>\(\theta/(\theta+2)=1/2\), so \(2\theta=\theta+2\), hence \(\theta=2\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 16.2</strong><span>Tail coefficient</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Compute the lower-tail coefficient at \(\theta=2\).</p></div><div class="answer-panel"><div class="answer-inner"><p>\(\lambda_L=2^{-1/2}\), approximately \(0.7071\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 16.3</strong><span>Frailty transform</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Show the Laplace transform of \(M\sim\Gamma(1/\theta,1/\theta)\).</p></div><div class="answer-panel"><div class="answer-inner"><p>For shape \(a=1/\theta\) and rate \(b=1/\theta\), the gamma Laplace transform is \((b/(b+t))^a\). Substitution gives \((1+\theta t)^{-1/\theta}\).</p></div></div></article>
<p><strong>Source trail.</strong> Nelsen (2006), Section 4.2, Table 4.1 and Section 4.6, printed pp. 116 and 151–157; Section 5.1.1, Corollary 5.1.4 and Example 5.4(a), printed p. 163 (PDF p. 172). Mai and Scherer (2017), Section 2.2.4.4, printed pp. 72–73 (PDF pp. 91–92); the gamma variable is rescaled here to match the additive generator.</p>
