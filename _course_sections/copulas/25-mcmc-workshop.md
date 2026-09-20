---
title: "Workshop: Estimating Dependence with MCMC"
permalink: /courses/copulas/25-mcmc-workshop/
course_title: Copulas
course_url: /courses/copulas/
course_section_style: hybrid
section_number: 25
section_kind: Optional workshop
summary: Implement and check a random-walk Metropolis sampler for the exact FGM posterior from Lesson 23.
prerequisites: Lessons 23 and 24; NumPy arrays and loops
reading_time: 22 minutes
exercises: 3 complete solutions
previous_section:
  title: "MCMC for Bayesian Copula Estimation"
  url: /courses/copulas/24-mcmc-theory/
next_section:
  title: "Notation, Formula Guide, and References"
  url: /courses/copulas/14-reference/
date: 2026-01-01
updated: 2026-01-01
---

<section class="intro-strip" id="question"><h2>Why sample a posterior we can integrate?</h2><p>Lesson 23 gives an exact posterior for the same two observations, \((1/4,1/4)\) and \((3/4,3/4)\). Denote this dataset by \(D\). That exact answer gives us a check for an implementation before we apply MCMC to a posterior without a convenient normalizing constant. The book applies Metropolis to copula estimation in Example 7.3.6. Here we apply that approach to the smaller model already derived in the course. <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a></p></section>

<h2 id="model">The checked target</h2><p>Use the Farlie–Gumbel–Morgenstern density \(c_\theta(u,v)=1+\theta(1-2u)(1-2v)\), \(-1\le\theta\le1\), with a uniform prior on this interval. The two pairs are independent conditional on \(\theta\), and their continuous marginal distributions are known, so these are exact uniform transforms. <a class="course-citation" href="#ref-2" aria-label="Reference 2">[2]</a> For both observations, \((1-2u_i)(1-2v_i)=1/4\), so the likelihood and normalized posterior are</p>
<div class="math-block proposition"><span class="block-label">Proposition 25.1 <span>Exact target density</span></span><p>\[L(\theta)=(1+\theta/4)^2,\qquad \pi(\theta\mid D)=\frac{24}{49}(1+\theta/4)^2,\qquad E[\theta\mid D]=\frac{8}{49}.\]</p></div>
<p>For a new pair conditionally independent of the observations given \(\theta\), the posterior predictive probability from Lesson 23 is \(51/196\) for a new event \(U_*\le1/2,V_*\le1/2\). These are original course calculations using the Lesson 23 data. The book supplies the copula and Bayesian methods. <a class="course-citation" href="#ref-3" aria-label="Reference 3">[3]</a></p>

<h2 id="sampler">Random-walk Metropolis</h2><p>At state \(\theta\), propose \(\theta'=\theta+\varepsilon\), where \(\varepsilon\sim N(0,0.5^2)\). The proposal is symmetric. If \(\theta'\notin[-1,1]\), reject it and retain \(\theta\); do not redraw and do not clip. For an in-range proposal, accept with probability \(\min\{1,\pi(\theta'\mid D)/\pi(\theta\mid D)\}\). Since the prior support is already enforced, the normalizing constant cancels in this ratio. The symmetric proposal and acceptance rule are described in Sections 4.2–4.3. <a class="course-citation" href="#ref-4" aria-label="Reference 4">[4]</a></p>
<details class="simulation-code"><summary>Show Python sampler and numerical checks</summary><div class="code-window"><header>mcmc_fgm.py</header><pre><code>import numpy as np

rng = np.random.default_rng(2026)
theta = 0.0
chain = np.empty(24000)
accepted = 0
for i in range(len(chain)):
    proposal = theta + rng.normal(0.0, 0.5)
    if -1.0 &lt;= proposal &lt;= 1.0:
        ratio = ((1.0 + proposal / 4.0) /
                 (1.0 + theta / 4.0))**2
        if rng.random() &lt; min(1.0, ratio):
            theta = proposal
            accepted += 1
    chain[i] = theta
draws = chain[4000:]
print(accepted / len(chain))
print(draws.mean(), np.mean(0.25 * (1 + draws / 4)))
centered = draws - draws.mean()
r1 = np.dot(centered[1:], centered[:-1]) / np.dot(centered, centered)
print(r1)</code></pre></div></details>
<p>In the code, <code>rng</code> is NumPy's random-number generator and <code>chain</code> records every state, including repeats. The initial state is \(0\); the chain has 24,000 total steps and discards the first 4,000. The remaining 20,000 states include repeated values after rejection. Discarding 4,000 is a choice for this illustration, not a general rule for convergence. We compare the retained chain with the exact density, posterior mean \(8/49\), and predictive value \(51/196\).</p>

<h2 id="diagnostics">Trace, histogram, and uncertainty</h2><p>A trace plot asks whether the chain moves through the supported interval and whether it still shows long periods of sticking. A histogram compares the retained draws with the exact posterior curve. These are first checks, not a proof of convergence. Shemyakin and Kniazev discuss trace plots, bias, variance, and convergence diagnostics in Section 4.5. <a class="course-citation" href="#ref-5" aria-label="Reference 5">[5]</a></p>
<figure class="figure-box"><img src="/assets/images/copulas/mcmc-trace.svg" alt="Trace plot for the random-walk Metropolis FGM posterior"><figcaption>The first 1,500 retained states, iterations 4,001–5,500. The dashed line marks the exact posterior mean. Horizontal segments occur when proposals are rejected.</figcaption></figure>
<figure class="figure-box"><img src="/assets/images/copulas/mcmc-posterior.svg" alt="Histogram and exact density for the FGM posterior"><figcaption>All 20,000 retained states compared with the exact posterior density. The exact curve supplies a direct implementation check.</figcaption></figure>
<p>Successive draws are correlated. An ordinary independent-sample standard error is therefore inappropriate. The book measures this dependence with sample autocorrelation. For retained states \(x_1,\ldots,x_m\) and mean \(\bar x\), its lag-one formula is <a class="course-citation" href="#ref-5" aria-label="Reference 5">[5]</a></p><p>\[r(1)=\frac{\sum_{i=2}^{m}(x_i-\bar x)(x_{i-1}-\bar x)}{\sum_{i=1}^{m}(x_i-\bar x)^2}.\]</p><p>The code gives about \(0.793\), so adjacent values carry considerable shared information. We do not attach an independent-sample error bar to the resulting average. The posterior predictive estimate should average \(C_\theta(1/2,1/2)=\tfrac14(1+\theta/4)\) over retained draws, then compare with \(51/196\). The posterior average is the quantity we want to estimate. The trace, histogram, and autocorrelation help us assess the chain used to estimate it.</p>

<h2 id="output">Read the numerical result</h2>
<p>The acceptance fraction is about \(0.7362\), counting all proposals, including those outside the support. The posterior mean estimate is \(0.16599\), compared with \(8/49\approx0.16327\). Averaging the future-event probabilities gives \(0.260374\), compared with \(51/196\approx0.260204\). These comparisons check this implementation on a known target; they do not certify a general MCMC procedure.</p>
<p>To explore proposal size, rerun the code with standard deviations \(0.05\) and \(3\), keeping the other settings fixed. Compare acceptance, the path through the interval, and the posterior mean. A high acceptance fraction can accompany very small moves. Check the path as well as the final average.</p>

<h2 id="exercises">Exercises</h2>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 25.1</strong><span>Acceptance probability</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>At \(\theta=0\), a proposal gives \(\theta'=0.5\). Compute the acceptance probability.</p></div><div class="answer-panel"><div class="answer-inner"><p>The common factor \(24/49\) cancels. The ratio is \((1+0.5/4)^2/(1+0/4)^2=(9/8)^2=81/64>1\), so the acceptance probability is \(1\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 25.2</strong><span>Change the proposal scale</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Run the sampler with proposal standard deviations \(0.05\), \(0.5\), and \(3\). Compare acceptance fractions and posterior means with \(8/49\). Does the highest acceptance give the closest mean in these runs? Explain the two mechanisms that can slow exploration.</p></div><div class="answer-panel"><div class="answer-inner"><p>The acceptance fractions are approximately \(0.9709\), \(0.7362\), and \(0.2123\); the mean estimates are \(0.19449\), \(0.16599\), and \(0.16572\). The highest acceptance does not give the closest mean here. Small steps are usually accepted but move slowly. Large steps frequently leave the support or enter a lower-density region, so rejection repeats states. One run does not establish an optimal scale; compare traces and repeated runs as well.</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 25.3</strong><span>Predictive averaging</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Given retained draws \(\theta^{(1)},\ldots,\theta^{(m)}\), write the predictive estimator for \(U_*\le1/2,V_*\le1/2\). Why should its uncertainty use correlated-chain methods?</p></div><div class="answer-panel"><div class="answer-inner"><p>Use \(\widehat p=m^{-1}\sum_{k=1}^m \tfrac14(1+\theta^{(k)}/4)\). The draws are successive states of one Markov chain, so they are correlated. An i.i.d. error calculation omits covariance between states. Here the exact value \(51/196\) checks the estimate directly; trace and autocorrelation checks still matter because a close estimate from one run can occur by chance.</p></div></div></article>

<h2 id="references">References</h2>
<ol class="course-references">
<li id="ref-1">Arkady Shemyakin and Alexander Kniazev, <em>Introduction to Bayesian Estimation and Copula Models of Dependence</em> (2017), Section 7.3.5, Example 7.3.6, Metropolis estimation of copula parameters, printed pp. 250–252 (PDF pp. 273–275).</li>
<li id="ref-2">Arkady Shemyakin and Alexander Kniazev, <em>Introduction to Bayesian Estimation and Copula Models of Dependence</em> (2017), Section 6.3.3, FGM copula, printed p. 203 (PDF p. 226); Section 7.3.5, treatment of known or fitted marginal distributions, printed pp. 250–252 (PDF pp. 273–275).</li>
<li id="ref-3">Arkady Shemyakin and Alexander Kniazev, <em>Introduction to Bayesian Estimation and Copula Models of Dependence</em> (2017), Section 7.2.2, equation (7.5), posterior predictive integration, printed p. 240 (PDF p. 263).</li>
<li id="ref-4">Arkady Shemyakin and Alexander Kniazev, <em>Introduction to Bayesian Estimation and Copula Models of Dependence</em> (2017), Sections 4.2–4.3, equations (4.3)–(4.5), Metropolis–Hastings and normal random-walk proposals, printed pp. 126–133 (PDF pp. 149–156).</li>
<li id="ref-5">Arkady Shemyakin and Alexander Kniazev, <em>Introduction to Bayesian Estimation and Copula Models of Dependence</em> (2017), Section 4.5, diagnostics and burn-in, printed pp. 136–143 (PDF pp. 159–166); Section 4.5.1, equation (4.6), sample autocorrelation, printed p. 138 (PDF p. 161).</li>
</ol>
