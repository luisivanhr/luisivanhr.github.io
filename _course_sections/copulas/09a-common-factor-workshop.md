---
title: "Workshop: A Common Factor and Joint Defaults"
updated: 2026-01-01
date: 2026-01-01
course_title: Copulas
course_url: /courses/copulas/
course_section_style: workshop
section_number: "9A"
section_kind: Optional workshop
summary: Use a one-factor Gaussian construction to derive conditional and unconditional joint-default probabilities.
prerequisites: Multivariate copulas and the standard normal distribution
reading_time: 18 minutes
exercises: 3 exercises
permalink: /courses/copulas/09a-common-factor-workshop/
previous_section:
  title: "Multivariate Copulas"
  url: /courses/copulas/09-multivariate-copulas/
next_section:
  title: "Simulating Copulas"
  url: /courses/copulas/10-simulation/
---

<section class="intro-strip" id="overview"><h2>A common market factor</h2><p>We want to model dependence among several borrowers and keep each borrower's default probability fixed. We use one standard normal [[common factor::market factor]] shared by all borrowers and independent factors specific to each borrower, called idiosyncratic factors. The model has \(d=20\) borrowers, marginal default probability \(p=0.1\), and equicorrelation parameter \(\rho=0.3\). We fix a time horizon and count how many borrowers default by that time. This is a simplified portfolio-loss model with equal losses per default. The numerical parameters are chosen for this course illustration. <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a></p></section>

<h2 id="construction">The factor construction</h2>
<p>Let \(d\) be a positive integer, \(0&lt;p&lt;1\), and \(0\le\rho\le1\). Let \(M,\varepsilon_1,\ldots,\varepsilon_d\) be independent standard normal variables. Define, for \(j=1,\ldots,d\),</p>
<p>\[
Z_j=\sqrt{\rho}\,M+\sqrt{1-\rho}\,\varepsilon_j,\qquad U_j=\Phi(Z_j).
\]</p>
<p>A linear combination of independent normal variables is normal. Each \(Z_j\) has mean zero and variance \(\rho+(1-\rho)=1\). For \(j\ne k\), independence of the idiosyncratic factors gives <a class="course-citation" href="#ref-2" aria-label="Reference 2">[2]</a></p>
<p>\[
\operatorname{Cov}(Z_j,Z_k)=\rho\operatorname{Var}(M)=\rho.
\]</p>
<p>Thus the \(Z_j\) form an equicorrelated Gaussian vector, and the \(U_j\) have uniform marginal distributions with the corresponding Gaussian copula. Here \(\Phi\) is the standard normal distribution function, with density \(\phi(m)=e^{-m^2/2}/\sqrt{2\pi}\). The parameter \(\rho\) is the correlation of the normal coordinates; it is generally different from the correlation of the default indicators. To obtain a default indicator at the chosen horizon, set</p>
<p>\[
D_j=\mathbf 1\{U_j\le p\}.
\]</p>
<p>Since \(\Phi\) is increasing, this event is equivalent to \(Z_j\le\Phi^{-1}(p)\). The model therefore preserves \(P(D_j=1)=p\) for every \(j\). The shared factor introduces dependence between borrowers.</p>

<h2 id="conditional">Condition on the market factor</h2>
<p>For \(0\le\rho&lt;1\), given \(M=m\), only \(\varepsilon_j\) remains random in \(Z_j\). Dividing the inequality \(\sqrt{\rho}\,m+\sqrt{1-\rho}\,\varepsilon_j\le\Phi^{-1}(p)\) by the positive coefficient \(\sqrt{1-\rho}\) gives <a class="course-citation" href="#ref-2" aria-label="Reference 2">[2]</a></p>
<p>\[
q(m)=P(D_j=1\mid M=m)=\Phi\left(\frac{\Phi^{-1}(p)-\sqrt{\rho}\,m}{\sqrt{1-\rho}}\right).
\]</p>
<p>For \(0&lt;\rho&lt;1\), a smaller market factor increases \(q(m)\). Thus the same unfavorable factor can raise default probabilities for every borrower. Conditional on \(M=m\), the indicators \(D_1,\ldots,D_d\) are independent Bernoulli variables with success probability \(q(m)\). If \(K=\sum_{j=1}^dD_j\) counts defaults, there are \(\binom{d}{k}\) ways to choose the \(k\) defaulting borrowers. Each such outcome has probability \(q(m)^k(1-q(m))^{d-k}\), so for \(k=0,\ldots,d\),</p>
<p>\[
P(K=k\mid M=m)=\binom{d}{k}q(m)^k(1-q(m))^{d-k}.
\]</p>
<p>For the workshop parameters, substitute \(d=20\), \(p=0.1\), and \(\rho=0.3\) into \(q(m)\). The unconditional count probability is obtained by integrating over the standard normal factor:</p>
<p>\[
P(K=k)=\int_{-\infty}^{\infty}\binom{20}{k}q(m)^k(1-q(m))^{20-k}\phi(m)\,dm.
\]</p>
<p>We can evaluate this one-dimensional integral numerically and compare it with simulated counts. Conditioning on one factor has avoided a twenty-dimensional integration.</p>

<h2 id="limits">Two checks on the parameter</h2>
<p>At \(\rho=0\), \(Z_j=\varepsilon_j\), so \(q(m)=p\) for every \(m\). Integrating the conditional binomial law then gives the ordinary binomial distribution with parameters \(d\) and \(p\). At \(\rho=1\), the idiosyncratic term disappears and all \(Z_j=M\). Every default indicator is then identical, so \(K\) is \(0\) or \(d\). The conditional formula divides by \(\sqrt{1-\rho}\), so the endpoint \(\rho=1\) must be handled by this separate argument. For every \(\rho\in[0,1]\), linearity of expectation gives</p>
<p>\[
E[K]=\sum_{j=1}^dE[D_j]=dp=20(0.1)=2.
\]</p>
<p>Dependence changes the distribution of the count around this fixed mean. The figure compares independence with the common-factor model. The circles show frequencies from 100,000 independently simulated portfolios.</p>
<figure class="figure-box"><img src="/assets/images/copulas/common-factor-defaults.svg" alt="Common-factor default count distribution for twenty borrowers"><figcaption>Common-factor defaults for \(d=20\), \(p=0.1\), and \(\rho=0.3\). Bars show the binomial probabilities for independence and numerical integration for the common-factor model. Circles show simulated frequencies for the latter.</figcaption></figure>

<p>For these parameters, numerical integration gives \(P(K\ge5)\approx0.13837\); the simulated frequency is \(0.13841\). Under independence, the probability is about \(0.04317\). Both models still have mean count \(2\). For the simulated event frequency, the independent-portfolio Monte Carlo standard error is about \(0.00109\), calculated as \(\sqrt{r(1-r)/100000}\) with \(r\approx0.13837\).</p>

<h2 id="sampler">Compact sampler</h2>
<p>The following code implements the construction. The final integral uses the binomial survival function, <code>binom.sf(4, d, q)</code>, to calculate the conditional probability of at least five defaults. One draw of \(M\) is shared across all twenty borrowers; the idiosyncratic normals are drawn separately.</p>
<details class="simulation-code"><summary>Show Python simulation code</summary><div class="code-window"><header>common_factor_defaults.py</header><pre><code>import numpy as np
from scipy.stats import norm, binom
from scipy.integrate import quad

rng = np.random.default_rng(2026)
n, d, p, rho = 100_000, 20, 0.1, 0.3
market = rng.normal(size=(n, 1))
eps = rng.normal(size=(n, d))
z = np.sqrt(rho) * market + np.sqrt(1 - rho) * eps
counts = (z &lt;= norm.ppf(p)).sum(axis=1)
print(np.mean(counts &gt;= 5))  # 0.13841

def q(m):
    return norm.cdf((norm.ppf(p) - np.sqrt(rho) * m) / np.sqrt(1 - rho))

probability, error = quad(
    lambda m: binom.sf(4, d, q(m)) * norm.pdf(m), -np.inf, np.inf)
print(probability)  # about 0.13837003</code></pre></div></details>

<h2 id="exercises">Exercises</h2>
<article class="exercise" id="exercise-9a-1"><header class="exercise-head"><div><strong>Exercise 9A.1</strong><span>Correlation calculation</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Verify that the factor construction has unit variance and pairwise correlation \(\rho\).</p></div><div class="answer-panel"><div class="answer-inner"><p>For one coordinate, \(\operatorname{Var}(Z_j)=\rho+(1-\rho)=1\). For \(j\ne k\), the idiosyncratic terms are independent and independent of \(M\), so \(\operatorname{Cov}(Z_j,Z_k)=\rho\operatorname{Var}(M)=\rho\). Since both variances equal one, the correlation is \(\rho\).</p></div></div></article>
<article class="exercise" id="exercise-9a-2"><header class="exercise-head"><div><strong>Exercise 9A.2</strong><span>A neutral market factor</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>For the workshop parameters and \(M=0\), compute \(q(0)\), \(E[K\mid M=0]\), and \(P(K=0\mid M=0)\). Why can the conditional default probability differ from the marginal probability \(0.1\)? You may use a normal-distribution calculator.</p></div><div class="answer-panel"><div class="answer-inner"><p>We obtain \(q(0)=\Phi(\Phi^{-1}(0.1)/\sqrt{0.7})\approx0.06279\). Conditional on this factor, \(K\) is binomial, so \(E[K\mid M=0]=20q(0)\approx1.25585\) and \(P(K=0\mid M=0)=(1-q(0))^{20}\approx0.27335\). The marginal probability averages \(q(M)\) over all market factors. Its value \(E[q(M)]=0.1\) does not require \(q(0)=0.1\).</p></div></div></article>
<article class="exercise" id="exercise-9a-3"><header class="exercise-head"><div><strong>Exercise 9A.3</strong><span>Endpoint checks</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Describe the count distribution at \(\rho=0\) and \(\rho=1\), keeping \(d\) and \(p\) general.</p></div><div class="answer-panel"><div class="answer-inner"><p>At \(\rho=0\), the indicators are independent and \(K\sim\operatorname{Binomial}(d,p)\). At \(\rho=1\), every indicator is equal, so \(P(K=d)=p\), \(P(K=0)=1-p\), and all intermediate counts have probability zero. In both cases \(E[K]=dp\).</p></div></div></article>

<h2 id="references">References</h2>
<ol class="course-references">
<li id="ref-1">Jan-Frederik Mai and Matthias Scherer, <em>Financial Engineering with Copulas Explained</em> (2014), §8.2.1, portfolio-loss definition (8.4), printed pp. 121–122 (PDF pp. 138–139).</li>
<li id="ref-2">Jan-Frederik Mai and Matthias Scherer, <em>Financial Engineering with Copulas Explained</em> (2014), Example 8.2.5, one-factor Gaussian model, conditional default probability, binomial count, and normal-factor integral, printed pp. 123–124 (PDF pp. 140–141).</li>
</ol>
