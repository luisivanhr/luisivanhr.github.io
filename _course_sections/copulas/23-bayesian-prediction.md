---
title: Bayesian Prediction from a Copula Posterior
permalink: /courses/copulas/23-bayesian-prediction/
course_title: Copulas
course_url: /courses/copulas/
course_section_style: hybrid
section_number: 23
section_kind: Posterior prediction
summary: Update a copula parameter with two observations and average future event probabilities over its posterior.
prerequisites: Lesson 11; FGM copula density; elementary integration
reading_time: 17 minutes
exercises: 3 complete solutions
previous_section:
  title: "Workshop: Calibrating Dependence from Ranks"
  url: /courses/copulas/22-calibration-workshop/
next_section:
  title: "MCMC for Bayesian Copula Estimation"
  url: /courses/copulas/24-mcmc-theory/
date: 2026-01-01
updated: 2026-01-01
---

<section class="intro-strip" id="question"><h2>From estimation to a future event</h2><p>Lesson 11 updated a distribution over a copula parameter using one transformed observation. Here the question is predictive: after observing data, what probability should we assign to a new joint event? Bayesian prediction averages the event probability across plausible parameter values, weighted by their posterior probabilities. This posterior-predictive integration is equation (7.5). <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a> The same rule works for a copula event once its likelihood and marginal distributions are specified.</p></section>

<h2 id="setup">A two-observation FGM model</h2>
<p>Consider independent pairs \((U_i,V_i)\), conditional on a common parameter \(\theta\), from the Farlie–Gumbel–Morgenstern copula</p><p>\[C_\theta(u,v)=uv[1+\theta(1-u)(1-v)],\qquad -1\le\theta\le1.\]</p><p>Its density is \(c_\theta(u,v)=1+\theta(1-2u)(1-2v)\). We assume the continuous marginal distributions are known, so the displayed uniforms are genuine probability transforms of the observations. This assumption matters: rank pseudo-observations computed from the same sample do not have this exact independent density likelihood. The source discusses FGM in Section 6.3.3 and Bayesian copula estimation with known or fitted marginal distributions in Section 7.3.5. <a class="course-citation" href="#ref-2" aria-label="Reference 2">[2]</a></p>

<p>Take two transformed observations, \((u_1,v_1)=(1/4,1/4)\) and \((u_2,v_2)=(3/4,3/4)\), and denote this dataset by \(D\). These are an original course illustration, not a dataset from the book. For both pairs, \((1-2u_i)(1-2v_i)=1/4\). Under conditional independence, their likelihood is</p><p>\[L(\theta)=c_\theta(u_1,v_1)c_\theta(u_2,v_2)=(1+\theta/4)^2=1+\theta/2+\theta^2/16.\]</p><p>The continuous-density likelihood evaluates densities at observed points; it does not assign positive probability to an exact point. We put a uniform prior on \([-1,1]\), with density \(\pi(\theta)=1/2\). Bayes' rule requires an explicit normalizing constant. <a class="course-citation" href="#ref-3" aria-label="Reference 3">[3]</a></p>

<div class="math-block proposition"><span class="block-label">Proposition 23.1 <span>Exact posterior</span></span><p>For this illustration,</p><p>\[\pi(\theta\mid D)=\frac{24}{49}\left(1+\frac{\theta}{2}+\frac{\theta^2}{16}\right),\qquad -1\le\theta\le1,\]</p><p>and the posterior mean is \(E[\theta\mid D]=8/49\).</p></div>
<div class="math-block proof"><span class="block-label">Proof</span><p>The marginal likelihood is \(Z=\int_{-1}^{1}\tfrac12 L(t)\,dt=1+1/48=49/48\): the odd term integrates to zero, while \(\int_{-1}^{1}t^2\,dt=2/3\). Dividing \(L(\theta)/2\) by \(49/48\) gives the stated \(24L(\theta)/49\), which integrates to one. For its mean, only \(\theta(\theta/2)\) survives integration, so \(E[\theta\mid D]=(24/49)(1/2)(2/3)=8/49\).</p></div>

<p>The posterior is tilted toward positive association but still spreads over the full parameter interval. In particular, a posterior mean is a summary, not a statement that \(\theta\) is known exactly. The figure shows the prior and the exact posterior, together with the prior and posterior predictive probabilities of the event studied below.</p>
<figure class="figure-box"><img src="/assets/images/copulas/bayesian-predictive.svg" alt="Uniform prior and normalized FGM posterior over theta, with prior and posterior predictive probabilities for a joint lower-left event."><figcaption>Two concordant observations move posterior weight toward positive FGM association. The predictive event probability averages across all parameter values.</figcaption></figure>

<h2 id="prediction">Average a future joint probability</h2>
<div class="math-block definition"><span class="block-label">Definition 23.2 <span>Posterior predictive event probability</span></span><p>For a new pair \((U_*,V_*)\) conditionally independent of the observed data given \(\theta\), and an event \(A\), write \(P_\theta(A)\) for the event probability at a fixed parameter value. Then</p><p>\[P(A\mid D)=\int P_\theta(A)\pi(\theta\mid D)\,d\theta.\]</p><p>This is the event form of the posterior predictive density integral in equation (7.5). <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a> The new pair uses the same copula and known marginal distributions as the observed pairs.</p></div>

<p>Choose \(A=\{U_*\le1/2,V_*\le1/2\}\). At a fixed parameter, its probability is \(C_\theta(1/2,1/2)=\tfrac14(1+\theta/4)\). Averaging this linear function of \(\theta\) over the posterior needs only the posterior mean:</p>
<div class="math-block proposition"><span class="block-label">Proposition 23.3 <span>Predictive joint probability</span></span><p>\[P(U_*\le1/2,V_*\le1/2\mid D)=\frac14\left(1+\frac{8/49}{4}\right)=\frac{51}{196}\approx0.2602.\]</p></div>
<div class="math-block proof"><span class="block-label">Proof</span><p>Linearity of integration gives \(\int C_\theta(1/2,1/2)\pi(\theta\mid D)d\theta=1/4+E[\theta\mid D]/16=1/4+1/98=51/196\). With the original symmetric prior, \(E[\theta]=0\) and the prior predictive probability is \(1/4\). The observed concordant points raise the predictive probability in this particular model.</p></div>

<p>FGM is linear in \(\theta\), so averaging its copula over this posterior happens to produce the copula at the posterior mean for every \((u,v)\). This is a special algebraic feature of the family. For a nonlinear family, averaging event probabilities and plugging a posterior mean into the event formula can differ. Posterior prediction generally calls for the integral itself, with numerical integration or posterior simulation when an exact antiderivative is unavailable.</p>

<p>The event here is a statement about a new pair at the same observation horizon and under the same marginal distributions. If a future observation uses a different horizon or different marginal distributions, its event probability needs those new distributions as inputs. The copula parameter alone does not determine a probability in the original units. For example, with known continuous marginal distributions \(F_X,F_Y\), the predictive probability of \(X_*\le x,Y_*\le y\) is \(\int C_\theta(F_X(x),F_Y(y))\pi(\theta\mid D)d\theta\). This is exactly the same averaging rule applied after converting the thresholds to percentile coordinates. It also shows where uncertainty about the marginal distributions would have to enter a richer Bayesian model.</p>

<p>The optional <a href="/courses/copulas/24-mcmc-theory/">MCMC lesson</a> explains how to approximate posterior averages. Its <a href="/courses/copulas/25-mcmc-workshop/">workshop</a> uses our exact answers to check a sampler. You can also proceed directly to the <a href="/courses/copulas/14-reference/">reference guide</a>.</p>
<h2 id="exercises">Exercises</h2>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 23.1</strong><span>Posterior sign probability</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Under Proposition 23.1, calculate \(P(\theta>0\mid D)\).</p></div><div class="answer-panel"><div class="answer-inner"><p>Integrate the posterior from zero to one: \((24/49)\int_0^1(1+\theta/2+\theta^2/16)d\theta=(24/49)(1+1/4+1/48)=(24/49)(61/48)=61/98\). This exceeds the prior value \(1/2\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 23.2</strong><span>Predict a different rectangle</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Find the posterior predictive probability of \(U_*\le1/4,V_*\le1/4\).</p></div><div class="answer-panel"><div class="answer-inner"><p>At fixed \(\theta\), \(C_\theta(1/4,1/4)=\tfrac1{16}[1+\theta(3/4)^2]=\tfrac1{16}(1+9\theta/16)\). Integrating and using \(E[\theta\mid D]=8/49\) gives \(\tfrac1{16}[1+(9/16)(8/49)]=\tfrac1{16}(1+9/98)=107/1568\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 23.3</strong><span>Why marginal assumptions matter</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Suppose the \((u_i,v_i)\) were ranks divided by \(n+1\) from the same dataset. Which step would cease to be an exact likelihood calculation?</p></div><div class="answer-panel"><div class="answer-inner"><p>The product \(\prod_i c_\theta(u_i,v_i)\) would be a pseudo-likelihood. Each rank depends on the full sample, so the transformed pairs are not conditionally independent draws from the exact copula density. A full likelihood must include the original observations and unknown marginal-distribution parameters, with their own prior if using a full Bayesian model.</p></div></div></article>

<h2 id="references">References</h2><ol class="course-references">
<li id="ref-1">Arkady Shemyakin and Alexander Kniazev, <em>Introduction to Bayesian Estimation and Copula Models of Dependence</em> (2017), §7.2.2, equation (7.5), printed p. 240 (PDF p. 263): posterior predictive integration.</li>
<li id="ref-2">Arkady Shemyakin and Alexander Kniazev, <em>Introduction to Bayesian Estimation and Copula Models of Dependence</em> (2017), §6.3.3, printed p. 203: FGM copula; §7.3.5, printed pp. 250–252: Bayesian estimation with one-step and two-step treatment of marginal distributions.</li>
<li id="ref-3">Arkady Shemyakin and Alexander Kniazev, <em>Introduction to Bayesian Estimation and Copula Models of Dependence</em> (2017), §2.4.3, printed pp. 46–47: posterior normalization. The two observations, posterior polynomial, and predictive event probabilities are original course calculations.</li>
</ol>
