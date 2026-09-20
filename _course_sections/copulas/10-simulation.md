---
title: Simulating Copulas
updated: 2026-01-01
course_title: Copulas
course_url: /courses/copulas/
course_section_style: hybrid
section_number: 10
section_kind: Simulation and diagnostics
summary: Simulate bivariate copulas conditionally, then transform uniforms into application marginals.
prerequisites: Multivariate copulas
reading_time: 15 minutes
exercises: 3 exercises
permalink: /courses/copulas/10-simulation/
previous_section:
  title: "Workshop: A Common Factor and Joint Defaults"
  url: /courses/copulas/09a-common-factor-workshop/
next_section:
  title: "Estimation and Bayesian Updating"
  url: /courses/copulas/11-estimation-and-bayes/
date: 2026-01-01
---
<section class="intro-strip" id="conditional"><h2>conditional sampling</h2><p>For a bivariate copula, the right-continuous version of the partial derivative \(\partial_2C(u,v)\) is a conditional distribution function of \(U_1\) given \(U_2=v\) for almost every \(v\). Since a simulated \(U_2\) avoids any exceptional null set with probability one, this gives a general algorithm. <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a></p></section>
<div class="math-block theorem"><span class="block-label">Theorem 10.1 <span>Conditional algorithm</span></span><p>Draw \(U_2\sim U[0,1]\), draw \(V\sim U[0,1]\) independently, set \(F_{1|2}(u)=\partial_2C(u,U_2)\) using that valid conditional version, and return \((F_{1|2}^{[-1]}(V),U_2)\). The result has copula \(C\). <a class="course-citation" href="#ref-2" aria-label="Reference 2">[2]</a></p></div>
<div class="math-block proof"><span class="block-label">Proof</span><p>Conditionally on \(U_2=v\), generalized inverse sampling gives \(U_1\) distribution \(F_{1|2}\). Integrating this conditional law against the uniform law of \(v\) gives \(P(U_1\le u,U_2\le v)=C(u,v)\).</p></div>
<div class="code-window"><header>conditional_copula.py</header><pre><code>u2 = uniform()
v_independent = uniform()
u1 = generalized_inverse(lambda u: dC_du2(u, u2), v_independent)
return u1, u2</code></pre></div>
<h2 id="clayton-sampling">An explicit Clayton sampler</h2>
<p>For \(\theta&gt;0\), write \(A=u^{-\theta}+v^{-\theta}-1\). Differentiation gives \(\partial_1 C_\theta(u,v)=u^{-\theta-1}A^{-1-1/\theta}\). To draw the second coordinate given \(U=u\), set this expression equal to a fresh uniform \(z\) and solve:</p><p>\[A=z^{-\theta/(1+\theta)}u^{-\theta},\qquad v=\left[1+u^{-\theta}\{z^{-\theta/(1+\theta)}-1\}\right]^{-1/\theta}.\]</p><p>Both uniforms lie in \((0,1)\). This is the conditional algorithm with the coordinates exchanged. The displayed scatter sample was generated from this formula, then checked by inserting each sampled pair back into the conditional distribution.</p>
<div class="code-window"><header>Clayton sampler (NumPy)</header><pre><code>import numpy as np
rng = np.random.default_rng(20260920)
u, z = rng.random((2, 20_000))
u = np.maximum(u, np.nextafter(0.0, 1.0))
z = np.maximum(z, np.nextafter(0.0, 1.0))
theta = 2.0
v = (1 + u**(-theta) * (z**(-theta/(theta+1)) - 1))**(-1/theta)
x, y = -np.log1p(-u), -np.log1p(-v)
print(np.mean((x &gt; 1) &amp; (y &gt; 1)))  # 0.2367</code></pre></div>
<h2 id="transform">Marginal applications</h2><p>Once \((U_1,U_2)\) is simulated, set \(X_i=F_i^{-1}(U_i)\). For exponential lifetimes with rate \(\beta_i\), \(X_i=-\log(1-U_i)/\beta_i\). The copula controls the joint ranks. We then use the inverse marginal distributions to obtain the required units. The figure shows a reproducible scatter sample from the Clayton copula with \(\theta=2\) and 20,000 simulated pairs, with the first 1,200 displayed.</p><figure class="figure-box"><img src="/assets/images/copulas/simulated-pairs.svg" alt="Scatter plot of a Clayton copula sample with theta equal to 2"><figcaption>The same 1,200 simulated pairs on the uniform scale (left) and with unit-rate exponential marginal distributions (right).</figcaption></figure><p>For unit exponential marginal distributions, put \(t=1-\exp(-1)\). The event \(X>1\) is \(U>t\), so the exact finite-threshold probability is the copula survival value \(1-2t+C(t,t)\). For Clayton \(\theta=2\), \(C(t,t)=(2t^{-2}-1)^{-1/2}\), which gives \(P(X>1,Y>1)=0.23543\). The generated sample gives \(0.2367\), with reported Monte Carlo standard error \(0.00300\). The difference is consistent with simulation error at this sample size. <a class="course-citation" href="#ref-3" aria-label="Reference 3">[3]</a></p>
<h2 id="frailty">Frailty route</h2><p>For Archimedean copulas whose inverse generator \(\psi=\varphi^{-1}\) is completely monotone, a shared nonnegative frailty variable gives a second route: draw the frailty, draw conditionally independent variables, then apply the marginal transform. This is often easier than numerically inverting a conditional distribution and explains why complete monotonicity supports every dimension. The frailty law must be chosen from the inverse generator's Laplace-transform representation; it should not be guessed from the bivariate formula.</p>
<h2 id="exercises">Exercises</h2>
<article class="exercise" id="exercise-10-1"><header class="exercise-head"><div><strong>Exercise 10.1</strong><span>Independence algorithm.</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Apply the conditional algorithm to \(C(u,v)=uv\).</p></div><div class="answer-panel"><div class="answer-inner"><p>\(\partial_2C(u,v)=u\), so its generalized inverse is the identity map. Thus \(U_1=V\) and \(U_2\) are independent uniforms.</p></div></div></article>
<article class="exercise" id="exercise-10-2"><header class="exercise-head"><div><strong>Exercise 10.2</strong><span>Exponential marginal distribution.</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Show that \(X=-\log(1-U)/\beta\) is exponential with rate \(\beta\).</p></div><div class="answer-panel"><div class="answer-inner"><p>For \(x\ge0\), \(P(X\le x)=P(U\le1-e^{-\beta x})=1-e^{-\beta x}\).</p></div></div></article>
<article class="exercise" id="exercise-10-3"><header class="exercise-head"><div><strong>Exercise 10.3</strong><span>Finite-threshold check.</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>For the Clayton sample above, compare the empirical frequency of \(X>1,Y>1\) with its exact finite-threshold probability. Why is this preferable to comparing directly with a limiting tail coefficient?</p></div><div class="answer-panel"><div class="answer-inner"><p>The exact target is \(1-2t+(2t^{-2}-1)^{-1/2}\), with \(t=1-e^{-1}\), equal to \(0.23543\). Compare the empirical frequency \(0.2367\) with this value and its Monte Carlo error. A tail coefficient is a limit as the threshold tends to an endpoint, so it is not the exact probability at \(X>1\).</p></div></div></article>
<div id="source-note"></div>
<h2 id="references">References</h2>
<ol class="course-references">
<li id="ref-1">Jan-Frederik Mai and Matthias Scherer, <em>Simulating Copulas: Stochastic Models, Sampling Algorithms, and Applications</em>, second edition (2017), Section 1.1.3, Algorithm 1.2, conditional derivative, right-continuous version, generalized inverse, and bivariate sampling, printed pp. 22–24 (PDF pp. 41–43).</li>
<li id="ref-2">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), Section 2.9, equation (2.9.1) and conditional sampling steps, printed p. 41 (PDF p. 52).</li>
<li id="ref-3">Jan-Frederik Mai and Matthias Scherer, <em>Simulating Copulas: Stochastic Models, Sampling Algorithms, and Applications</em>, second edition (2017), Section 2.2, Algorithm 2.1, shared frailty construction of extendible Archimedean copulas, printed pp. 61–62 (PDF pp. 80–81).</li>
</ol>
