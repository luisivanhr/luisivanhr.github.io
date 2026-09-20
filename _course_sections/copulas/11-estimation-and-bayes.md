---
title: Estimation and Bayesian Updating
permalink: /courses/copulas/11-estimation-and-bayes/
course_title: Copulas
course_url: /courses/copulas/
course_section_style: hybrid
section_number: 11
section_kind: Estimation and inference
summary: Estimate dependence from ranks or a copula likelihood, then update uncertainty about a parameter with Bayes' rule.
prerequisites: Copula densities; Kendall's tau; continuous marginal distributions
reading_time: 16 minutes
exercises: 3 worked exercises
sidebar_tools: Estimation checklist
sidebar_note: Distinguish known marginal distributions, fitted marginal distributions, and rank pseudo-observations.
subsections:
  - title: 11.1 What the data determine
    url: /courses/copulas/11-estimation-and-bayes/#data
  - title: 11.2 Three estimation routes
    url: /courses/copulas/11-estimation-and-bayes/#routes
  - title: 11.3 A normalized Bayesian example
    url: /courses/copulas/11-estimation-and-bayes/#bayes
  - title: 11.4 Exercises
    url: /courses/copulas/11-estimation-and-bayes/#exercises
previous_section:
  title: "Simulating Copulas"
  url: /courses/copulas/10-simulation/
next_section:
  title: "Financial Applications and Dependence Uncertainty"
  url: /courses/copulas/12-financial-applications/
date: 2026-01-01
updated: 2026-01-01
---

<section class="intro-strip" id="data">
  <h2>11.1 What the data determine</h2>
  <p>A copula separates the distributions of individual variables from their dependence. Estimation must preserve that separation. We observe pairs \((x_i,y_i)\). To evaluate a copula density \(c_\theta\), we need inputs on the unit square. If the continuous marginal distributions \(F_X,F_Y\) are known, the inputs are \(u_i=F_X(x_i)\) and \(v_i=F_Y(y_i)\). If the marginal distributions are estimated, their uncertainty and possible misspecification affect the dependence estimate. Mai and Scherer discuss this distinction in Chapter 6, especially Sections 6.2 and 6.3; Shemyakin and Kniazev return to it in Section 7.3. <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a> <a class="course-citation" href="#ref-2" aria-label="Reference 2">[2]</a></p>
</section>

<div class="math-block definition">
  <span class="block-label">Definition 11.1 <span>[[Rank pseudo-observations]]</span></span>
  <p>For a sample of size \(n\) with no ties, let \(R_i\) and \(S_i\) be the ranks of \(x_i\) and \(y_i\) among their respective samples. A convenient interior transformation is \(\widehat u_i=R_i/(n+1)\), \(\widehat v_i=S_i/(n+1)\). These are data-based substitutes for the unobserved probability transforms. They are not independent draws from a known copula after conditioning on the ranks.</p>
</div>

<p>The denominator \(n+1\) keeps every transformed point inside \((0,1)^2\), where many density formulas are easiest to evaluate. Ranks preserve concordance under strictly increasing transformations. Ties, common with rounded or discrete measurements, need an explicit policy because a unique ordering then disappears. The clean formulas below assume continuous marginal distributions and no ties.</p>

<h2 id="routes">11.2 Three estimation routes</h2>
<p>The first route matches a rank measure. For a one-parameter family with theoretical Kendall coefficient \(\tau(\theta)\), compute the empirical coefficient \(\widehat\tau\), then solve \(\tau(\widehat\theta)=\widehat\tau\). For the Gumbel family with \(\theta\geq1\), Mai and Scherer's Example 6.1.1 gives \(\tau(\theta)=1-1/\theta\). Hence \(\widehat\theta=1/(1-\widehat\tau)\), provided \(0\leq\widehat\tau&lt;1\). A negative sample coefficient lies outside this family's range, so the inverse formula does not produce a valid Gumbel estimate.</p>

<div class="math-block proposition">
  <span class="block-label">Proposition 11.2 <span>Likelihood factorization</span></span>
  <p>Suppose \(F_X,F_Y\) have positive densities \(f_X,f_Y\), and copula \(C_\theta\) has density \(c_\theta\). The joint density is</p>
  <p>\[f_{X,Y}(x,y)=c_\theta(F_X(x),F_Y(y))f_X(x)f_Y(y).\]</p>
  <p>For independent observed pairs, the likelihood is the product of these factors over \(i=1,\ldots,n\).</p>
</div>
<div class="math-block proof">
  <span class="block-label">Derivation</span>
  <p>Sklar's formula says \(F_{X,Y}(x,y)=C_\theta(F_X(x),F_Y(y))\). Differentiate first in \(x\) and then in \(y\), using the chain rule. The two derivatives of the marginal distribution functions contribute \(f_X(x)\) and \(f_Y(y)\). This calculation requires the stated differentiability and density assumptions; singular copulas need a different likelihood treatment.</p>
</div>

<p>When the marginal distributions are known, their density factors do not depend on \(\theta\), so maximizing the likelihood over \(\theta\) reduces to maximizing \(\prod_i c_\theta(u_i,v_i)\). When marginal distribution parameters are unknown, full maximum likelihood estimates them jointly with \(\theta\). A two-step procedure, usually abbreviated IFM, first fits the marginal distributions and then inserts their fitted transforms into the copula likelihood. Rank pseudo-observations give a further pseudo-likelihood route. Those plug-in expressions can be useful, but treating the fitted transforms as known ignores the estimation step in an ordinary likelihood calculation. Sections 6.2–6.3 of Mai and Scherer and Section 7.3.4 of Shemyakin and Kniazev distinguish these routes.</p>

<h2 id="bayes">11.3 A normalized Bayesian example</h2>
<p>Bayesian estimation keeps a distribution over the parameter. Given a prior density \(\pi(\theta)\) and a likelihood \(L(\theta;D)\) for data \(D\), the posterior is</p>
<div class="math-block definition">
  <span class="block-label">Definition 11.3 <span>[[Posterior density]]</span></span>
  <p>\[\pi(\theta\mid D)=\frac{L(\theta;D)\pi(\theta)}{\int_\Theta L(t;D)\pi(t)\,dt},\]</p>
  <p>when the denominator is positive and finite. The denominator makes the posterior integrate to one. This is the continuous form of Bayes' rule developed in Shemyakin and Kniazev, Section 2.4.3, and applied to copula parameters in Section 7.3.5. <a class="course-citation" href="#ref-2" aria-label="Reference 2">[2]</a></p>
</div>

<p>Here is an author-created, deliberately small calculation. Consider the Farlie–Gumbel–Morgenstern family \(C_\theta(u,v)=uv[1+\theta(1-u)(1-v)]\), \(-1\leq\theta\leq1\), covered as a basic pair family in Shemyakin and Kniazev, Section 6.3.3. Its density is \(c_\theta(u,v)=1+\theta(1-2u)(1-2v)\). Suppose the marginal distributions are known and one transformed observation is \((u,v)=(1/4,1/4)\). Put a uniform prior on \([-1,1]\), with density \(1/2\). Since \((1-2u)(1-2v)=1/4\), the likelihood is \(L(\theta)=1+\theta/4\).</p>

<div class="math-block proposition">
  <span class="block-label">Proposition 11.4 <span>One-observation posterior</span></span>
  <p>Under this illustration, \(\pi(\theta\mid u,v)=\tfrac12(1+\theta/4)\) for \(-1\leq\theta\leq1\). Its posterior mean is \(1/12\), while the prior mean is zero.</p>
</div>
<div class="math-block proof">
  <span class="block-label">Proof</span>
  <p>The normalizing integral is \(\int_{-1}^{1}(1+t/4)(1/2)\,dt=1\), since the odd term integrates to zero. Thus the displayed density is normalized. Its mean is \(\tfrac12\int_{-1}^{1}\theta(1+\theta/4)\,d\theta=\tfrac18\int_{-1}^{1}\theta^2\,d\theta=1/12\). The concordant observation slightly favors positive dependence. A single point cannot justify a strong conclusion.</p>
</div>

<p>The example conditions on genuinely known marginal distributions. If the transforms came from estimated marginal distributions or ranks, placing a prior only on \(\theta\) and multiplying copula densities would be a two-stage approximation. A full Bayesian model instead assigns a joint prior to all unknown marginal distribution and copula parameters and uses the full joint density. Shemyakin and Kniazev, Section 7.3.5, explicitly discuss both one-step and two-step approaches. In larger models the normalizing integral is rarely available in closed form; their Chapter 4 develops Monte Carlo methods for working with a posterior. One should still define the target posterior before choosing an algorithm.</p>

<p>A posterior mean summarizes the center of the posterior. Its spread and probabilities describe uncertainty. In the one-observation illustration, the posterior probability of positive association is \(9/16\), which is only modestly above one half. The posterior also assigns mass to negative values. Reporting only \(1/12\) would hide that uncertainty. With additional independent pairs and known marginal distributions, the likelihood becomes \(\prod_i[1+\theta(1-2u_i)(1-2v_i)]\); multiply it by the prior and normalize over \([-1,1]\). Each point contributes according to its location in the unit square. A point near the center contributes little, since one of the factors \(1-2u_i\) or \(1-2v_i\) is near zero. The copula likelihood therefore uses the full pattern of observations. For rank matching, we summarize that pattern with one statistic.</p>

<figure class="figure-box"><img src="/assets/images/copulas/bayesian-update.svg" alt="Uniform prior and slightly increasing posterior density over the FGM parameter from minus one to one."><figcaption>One concordant observation tilts the uniform prior toward positive values. Both curves integrate to one.</figcaption></figure>
<h2 id="exercises">11.4 Exercises</h2>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 11.1</strong><span>Rank calibration</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>A sample has empirical Kendall coefficient \(\widehat\tau=0.6\). Estimate the Gumbel parameter. What happens if \(\widehat\tau=-0.1\)?</p></div><div class="answer-panel"><div class="answer-inner"><p>For \(0.6\), \(\widehat\theta=1/(1-0.6)=2.5\). The Gumbel family considered here has \(\theta\geq1\) and therefore \(\tau\geq0\). The negative coefficient has no exact solution in this family; inspect another family or discuss boundary fitting.</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 11.2</strong><span>Posterior probability</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>For Proposition 11.4, find the posterior probability that \(\theta>0\).</p></div><div class="answer-panel"><div class="answer-inner"><p>Integrate the normalized posterior: \(\Pr(\theta>0\mid D)=\tfrac12\int_0^1(1+\theta/4)\,d\theta=\tfrac12(1+1/8)=9/16\). The data raise the probability above its prior value \(1/2\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 11.3</strong><span>A discordant observation</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Keep the same prior and known marginal distributions, but observe \((u,v)=(1/4,3/4)\). Find the normalized posterior and its mean.</p></div><div class="answer-panel"><div class="answer-inner"><p>Now \((1-2u)(1-2v)=-1/4\), so \(L(\theta)=1-\theta/4\). Its prior average is one, giving \(\pi(\theta\mid D)=\tfrac12(1-\theta/4)\) on \([-1,1]\). The mean is \(-\tfrac18\int_{-1}^{1}\theta^2d\theta=-1/12\).</p></div></div></article>
<div id="source-note"></div>
<h2 id="references">References</h2>
<ol class="course-references">
<li id="ref-1">Jan-Frederik Mai and Matthias Scherer, <em>Financial Engineering with Copulas Explained</em> (2014), Chapter 6, Sections 6.1–6.3, estimation from ranks and likelihoods, printed pp. 85–94.</li>
<li id="ref-2">Arkady Shemyakin and Alexander Kniazev, <em>Introduction to Bayesian Estimation and Copula Models of Dependence</em> (2017), Sections 2.4.3, 6.3.3, and 7.3.4–7.3.5, Bayes' rule, the FGM family, and copula estimation, printed pp. 46–47, 203–204, 249–252.</li>
</ol>
<p>The FGM observation and its arithmetic are original illustrations of these sourced methods.</p>
