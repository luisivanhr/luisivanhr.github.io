---
title: "Workshop: Calibrating Dependence from Ranks"
permalink: /courses/copulas/22-calibration-workshop/
course_title: Copulas
course_url: /courses/copulas/
course_section_style: workshop
section_number: 22
section_kind: Guided calculation
summary: Convert paired observations into ranks, calibrate two copula families, and diagnose what one rank statistic cannot identify.
prerequisites: Kendall's tau; Clayton and Gumbel copulas; rank pseudo-observations
reading_time: 18 minutes
exercises: 4 complete solutions
previous_section:
  title: "Quadrant Dependence and Concordance Order"
  url: /courses/copulas/21-dependence-order/
next_section:
  title: "Bayesian Prediction from a Copula Posterior"
  url: /courses/copulas/23-bayesian-prediction/
date: 2026-01-01
updated: 2026-01-01
---

<section class="intro-strip" id="data"><h2>A five-pair dataset</h2><p>A rank coefficient gives a quick estimate of dependence within a chosen family. It does not choose the family for us. This workshop carries the same observations through two calibrations and then compares their implications in a corner of the unit square. The numbers below are an original course illustration of the rank and method-of-moments procedures in Mai and Scherer, Chapter 6. <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a></p></section>

<p>Suppose five independent pairs from one continuous joint distribution are observed. After sorting the first coordinate, their rank pairs are \((1,1),(2,3),(3,2),(4,5),(5,4)\). The original measurements could have been recorded in different units; their ranks retain the paired ordering. There are no ties. For a density-based follow-up, rank pseudo-observations would be \((R_i/6,S_i/6)\), using \(n+1=6\) to keep all points inside the unit square. Mai and Scherer discuss this scaling in Section 6.3. <a class="course-citation" href="#ref-2" aria-label="Reference 2">[2]</a> Those pseudo-observations are computed jointly from the sample and should not be treated as five exact independent draws from a known copula.</p>

<h2 id="tau">Count concordant and discordant pairs</h2>
<p>With the first ranks in increasing order, a pair is discordant exactly when its second ranks are inverted. The sequence \(1,3,2,5,4\) has two inversions: \(3\) precedes \(2\), and \(5\) precedes \(4\). Out of \(\binom52=10\) unordered pairs, two are discordant and eight are concordant. Thus the no-ties sample Kendall statistic is</p>
<div class="math-block proposition"><span class="block-label">Calculation 22.1 <span>Sample concordance</span></span><p>\[\widehat\tau=\frac{8-2}{10}=0.6.\]</p></div>
<p>Every number in this calculation can be checked from the five rank pairs. Kendall's coefficient summarizes the balance of concordant and discordant pairs; it discards where in the distribution those pairs occurred. In particular, it cannot by itself tell whether dependence is concentrated among small values or large values.</p>

<h2 id="calibration">Calibrate two families</h2>
<p>For the Gumbel–Hougaard family with parameter \(\theta_G\ge1\), the population relation is \(\tau_G=1-1/\theta_G\). Example 6.1.1 applies this formula to a method-of-moments estimate. <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a> Substituting \(0.6\) yields \(\widehat\theta_G=1/(1-0.6)=5/2\).</p>

<p>For Clayton with parameter \(\theta_C>0\), the relation is \(\tau_C=\theta_C/(\theta_C+2)\). It follows from the generator formula in Corollary 5.1.4. <a class="course-citation" href="#ref-3" aria-label="Reference 3">[3]</a> For \(\varphi(t)=(t^{-\theta_C}-1)/\theta_C\), substitute \(\varphi/\varphi'=(t-t^{\theta_C+1})/(-\theta_C)\) into \(\tau=1+4\int_0^1\varphi(t)/\varphi'(t)\,dt\). The integral evaluates to \(-1/[2(\theta_C+2)]\), giving \(\tau_C=\theta_C/(\theta_C+2)\). Solving \(0.6=\theta_C/(\theta_C+2)\) gives \(\widehat\theta_C=3\).</p>

<div class="math-block proposition"><span class="block-label">Calculation 22.2 <span>Two moment fits</span></span><p>\[\widehat\theta_G=\frac{1}{1-\widehat\tau}=2.5,\qquad \widehat\theta_C=\frac{2\widehat\tau}{1-\widehat\tau}=3.\]</p><p>Both fitted families have population Kendall coefficient \(0.6\), by construction. They remain different joint distributions.</p></div>

<h2 id="diagnosis">What the fit leaves open</h2>
<p>At \(u=v=0.1\), the Clayton fit assigns lower-left probability \(C_C(0.1,0.1)=(2(0.1)^{-3}-1)^{-1/3}\), approximately \(0.0794\). The Gumbel fit assigns \(C_G(0.1,0.1)=0.1^{2^{1/2.5}}\), approximately \(0.0479\). Independence would give \(0.01\). These are model probabilities, not empirical estimates of a rare event from five observations. Their difference shows how a shared rank summary can conceal a consequential choice of family.</p>

<p>The asymptotic tail coefficients sharpen the distinction. At the fitted parameters, Clayton has lower-tail coefficient \(2^{-1/3}\), about \(0.794\), and upper-tail coefficient zero. Gumbel has lower-tail coefficient zero and upper-tail coefficient \(2-2^{1/2.5}\), about \(0.680\). The formulas are derived in Lesson 8 from the Table 4.1 family formulas and Section 5.4 diagonal limits. <a class="course-citation" href="#ref-4" aria-label="Reference 4">[4]</a> A sample of five cannot estimate these limits reliably. Even in a much larger sample, tail-coefficient estimation needs sufficiently extreme observations and uncertainty assessment.</p>

<p>A practical continuation is to inspect the rank scatter, compare empirical copula values with each fitted surface, and simulate samples from both models at the same size. The simulation comparison asks whether the observed features are typical under each proposed copula. Mai and Scherer develop copula simulation and several estimation routes, including rank transformation and copula likelihood. <a class="course-citation" href="#ref-5" aria-label="Reference 5">[5]</a> If a model also specifies marginal distributions, their fit deserves separate attention: errors in marginal estimation can affect the dependence fit. The two calibrated values above are point estimates conditional on each family; they do not provide a confidence interval or select a winner.</p>

<h2 id="exercises">Exercises</h2>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 22.1</strong><span>Rank count</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>For second-rank sequence \(1,2,4,3,5\) after sorting first ranks, compute sample Kendall's coefficient.</p></div><div class="answer-panel"><div class="answer-inner"><p>Only \(4,3\) is an inversion. Of ten pairs, nine are concordant and one discordant, so \(\widehat\tau=(9-1)/10=0.8\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 22.2</strong><span>Two inversions of one statistic</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>At \(\widehat\tau=1/2\), find Gumbel and positive Clayton method-of-moments parameters.</p></div><div class="answer-panel"><div class="answer-inner"><p>Gumbel gives \(\theta_G=1/(1-1/2)=2\). Clayton gives \(\theta_C=2(1/2)/(1-1/2)=2\). Equal numerical parameter values here do not make the two copula functions equal.</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 22.3</strong><span>Tail comparison</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>At the parameter values in Exercise 22.2, identify which fitted family has lower-tail dependence and which has upper-tail dependence.</p></div><div class="answer-panel"><div class="answer-inner"><p>Clayton with \(\theta_C=2\) has \(\lambda_L=2^{-1/2}\) and \(\lambda_U=0\). Gumbel with \(\theta_G=2\) has \(\lambda_L=0\) and \(\lambda_U=2-\sqrt2\). Both fit the same \(\tau=1/2\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 22.4</strong><span>Boundary of the family</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>A sample has \(\widehat\tau=-0.2\). Explain why the positive Clayton and Gumbel formulas used here do not give an interior fit.</p></div><div class="answer-panel"><div class="answer-inner"><p>For \(\theta_C>0\), Clayton's \(\tau_C=\theta_C/(\theta_C+2)>0\). For \(\theta_G\ge1\), Gumbel's \(\tau_G=1-1/\theta_G\ge0\). Neither range contains \(-0.2\); a different family or a boundary analysis is needed.</p></div></div></article>

<h2 id="references">References</h2><ol class="course-references">
<li id="ref-1">Jan-Frederik Mai and Matthias Scherer, <em>Financial Engineering with Copulas Explained</em> (2014), §6.1 and Example 6.1.1, printed pp. 86–87: rank method of moments and Gumbel inversion. The five pairs and numerical estimates in this lesson are course illustrations.</li>
<li id="ref-2">Jan-Frederik Mai and Matthias Scherer, <em>Financial Engineering with Copulas Explained</em> (2014), §6.3 and Example 6.3.3, printed pp. 91–94: pseudo-observations scaled by \(n+1\).</li>
<li id="ref-3">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), Corollary 5.1.4 and equation (5.1.9), printed p. 163 (PDF p. 172): Archimedean Kendall formula.</li>
<li id="ref-4">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), Table 4.1, printed p. 116 (PDF p. 126), and Theorem 5.4.2, printed pp. 214–215 (PDF pp. 223–224): family formulas and tail calculations.</li>
<li id="ref-5">Jan-Frederik Mai and Matthias Scherer, <em>Financial Engineering with Copulas Explained</em> (2014), §5.1, printed pp. 78–83: copula simulation; Chapters 5–6: simulation and estimation routes.</li>
</ol>
