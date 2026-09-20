---
title: Student-t Copulas
course_title: Copulas
course_url: /courses/copulas/
course_section_style: hybrid
section_number: 15
section_kind: Elliptical copula
summary: Build t-copulas from a common inverse-gamma scale and calculate their tail dependence.
prerequisites: Gaussian copulas, t distributions, conditional simulation
reading_time: 20 minutes
exercises: 4 exercises
permalink: /courses/copulas/15-student-t-copulas/
previous_section:
  title: "Gaussian Copulas"
  url: /courses/copulas/14-gaussian-copulas/
next_section:
  title: "Clayton Copulas"
  url: /courses/copulas/16-clayton-copulas/
date: 2026-01-01
updated: 2026-01-01
---

<section class="intro-strip" id="overview"><h2>A common random scale</h2><p>What changes when a Gaussian vector is multiplied by one random scale? A [[Student-t]] vector has the same normal direction as a Gaussian vector, multiplied by one positive random scale. The shared scale creates dependence in magnitudes and simultaneous extremes.</p></section>

<h2 id="mixture">The scale-mixture construction</h2>
<p>Let \(Y\) be a centered normal vector with correlation matrix \(R\). Let \(W\) be independent of \(Y\), with inverse-gamma distribution \(\operatorname{InvGamma}(\nu/2,\nu/2)\). Equivalently, \(1/W\) has a gamma distribution with shape and rate \(\nu/2\). Define</p>
<p>\[X=\sqrt{W}\,Y.\]</p>
<p>Take \(\nu>0\). Each component of \(X\) has a Student-t distribution with \(\nu\) degrees of freedom and unit scale. Its variance is \(\nu/(\nu-2)\) when \(\nu>2\). Applying the distribution function \(t_\nu\) to each coordinate gives the t-copula \(C_{\nu,R}\). In two dimensions, \(R\) has parameter \(\rho\), with \(-1&lt;\rho&lt;1\) for the density calculations below.</p>
<p>The common \(W\) matters. Conditional on \(W\), the components are correlated normal variables. Unconditionally, a large value of \(W\) enlarges both coordinates at once, making joint extremes more likely. For \(\nu>2\), \(\operatorname{Corr}(X)=R\); for \(\nu\le2\), the ordinary correlation is undefined. As \(\nu\) tends to infinity, \(W\) concentrates near one and the t-copula approaches the Gaussian copula.</p>

<h2 id="density">Bivariate density and zero correlation</h2>
<p>Put \(x=t_\nu^{-1}(u)\), \(y=t_\nu^{-1}(v)\), where \(t_\nu\) is the univariate t distribution function. The bivariate t density divided by the two univariate t densities gives the copula density</p>
<p>\[c_{\nu,\rho}(u,v)=\frac{1}{\sqrt{1-\rho^2}}\frac{\Gamma((\nu+2)/2)\Gamma(\nu/2)}{\Gamma((\nu+1)/2)^2}\frac{\left(1+x^2/\nu\right)^{(\nu+1)/2}\left(1+y^2/\nu\right)^{(\nu+1)/2}}{\left(1+(x^2+y^2-2\rho xy)/(\nu(1-\rho^2))\right)^{(\nu+2)/2}}.\]</p>
<p>At \(\rho=0\), \(X_1\) and \(X_2\) are still dependent for finite \(\nu\). The displayed tail formula gives a positive coefficient because \(t_{\nu+1}(-\sqrt{\nu+1})>0\). Their copula therefore differs from the product copula. The dependence disappears only in the Gaussian limit \(\nu\to\infty\), when the common scale becomes constant.</p>

<h2 id="tails">Tail dependence</h2>
<p>The bivariate t-copula is radially symmetric, so its lower and upper tail coefficients are equal. Mai and Scherer give</p>
<p>\[\lambda_L=\lambda_U=2\,t_{\nu+1}\left(-\sqrt{\frac{(\nu+1)(1-\rho)}{1+\rho}}\right).\]</p>
<p>For \(-1&lt;\rho&lt;1\) and finite \(\nu\), this is positive. Increasing \(\nu\) makes the scale less variable and reduces the coefficient toward the Gaussian value zero.</p>

<h2 id="sampling">Sampling</h2>
<p>Draw \(Y_1,Y_2\) as correlated standard normal variables using the Gaussian Cholesky factor. Independently draw \(W\) from the inverse-gamma law, set \(X_i=\sqrt{W}Y_i\), and return \(U_i=t_\nu(X_i)\). The common \(W\) must be drawn once per pair. Drawing separate scales would change the model and remove the intended common-shock mechanism.</p>

<figure class="figure-box"><img src="/assets/images/copulas/elliptical-comparison.svg" alt="Comparison of Gaussian and Student-t copula samples"><figcaption>Gaussian and Student-t samples with \(\rho=\sqrt{0.5}\), and \(\nu=4\) for Student t. Both have population Kendall coefficient \(0.5\); 1,500 pairs are displayed. In the full simulation of 80,000 pairs, the fractions with both coordinates above \(0.95\) are \(0.02009\) and \(0.02359\), respectively. These finite-threshold probabilities illustrate a difference that their matching concordance does not record.</figcaption></figure>

<h2 id="exercises">Exercises</h2>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 15.1</strong><span>Mixture coordinates.</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Why does \(X=\sqrt{W}Y\) have Student-t marginal distributions?</p></div><div class="answer-panel"><div class="answer-inner"><p>For one coordinate, conditional on \(W=w\), \[f_{X\mid W}(x\mid w)=\frac{1}{\sqrt{2\pi w}}\exp\!\left(-\frac{x^2}{2w}\right).\] With \(W\sim\operatorname{InvGamma}(\nu/2,\nu/2)\), \[f_W(w)=\frac{(\nu/2)^{\nu/2}}{\Gamma(\nu/2)}w^{-\nu/2-1}\exp\!\left(-\frac{\nu}{2w}\right).\] Integrating \(f_{X\mid W}(x\mid w)f_W(w)\) over \(w>0\), then using \(s=(x^2+\nu)/(2w)\), gives \[f_X(x)=\frac{\Gamma((\nu+1)/2)}{\sqrt{\nu\pi}\,\Gamma(\nu/2)}\left(1+\frac{x^2}{\nu}\right)^{-(\nu+1)/2},\] the Student-t density with \(\nu\) degrees of freedom.</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 15.2</strong><span>Zero correlation parameter.</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Explain why \(\rho=0\) does not imply independence for finite \(\nu\).</p></div><div class="answer-panel"><div class="answer-inner"><p>At \(\rho=0\), the tail formula gives \(\lambda_L=\lambda_U=2t_{\nu+1}(-\sqrt{\nu+1})>0\) for every finite \(\nu\). The product copula has both coefficients zero, so the t-copula cannot be independent. The common \(W\) is the construction-level reason: it couples the magnitudes after conditional independence is imposed.</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 15.3</strong><span>Tail coefficient.</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Evaluate the t-copula tail coefficient at \(\rho=0\), \(\nu=1\). Hint: integrate the density \((x^2+2)^{-3/2}\) of the Student-t distribution with two degrees of freedom.</p></div><div class="answer-panel"><div class="answer-inner"><p>The argument is \(-\sqrt{(1+1)(1-0)/(1+0)}=-\sqrt2\). Integrating the stated density gives \(t_2(x)=1/2+x/(2\sqrt{x^2+2})\). Therefore \(\lambda_L=\lambda_U=2t_2(-\sqrt2)=1-1/\sqrt2\), approximately \(0.2929\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 15.4</strong><span>Sampling order.</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>List the simulation steps for one t-copula pair.</p></div><div class="answer-panel"><div class="answer-inner"><p>Draw correlated normals \(Y_1,Y_2\), draw one independent \(W\), set \(X_i=\sqrt W Y_i\), and return \((t_\nu(X_1),t_\nu(X_2))\).</p></div></div></article>

<p class="source-note">Source: Jan-Frederik Mai and Matthias Scherer, <em>Financial Engineering with Copulas Explained</em> (2014), §4.1.2 and equation (4.4), printed pp. 55–57, PDF pp. 72–74; the tail coefficient is stated on printed p. 57, PDF p. 74. The inverse-gamma density and scale-mixture setup appear on printed p. 55, PDF p. 72.</p>
