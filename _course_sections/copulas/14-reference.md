---
title: Notation, Formula Guide, and References
permalink: /courses/copulas/14-reference/
updated: 2026-01-01
course_title: Copulas
course_url: /courses/copulas/
course_section_style: reference
section_number: 26
section_kind: Reference
summary: A compact guide to notation, assumptions, and the four books used in the course.
prerequisites: Use alongside the course
reading_time: 8 minutes
exercises: See the lesson answer drawers and the empirical workshop
previous_section:
  title: "Workshop: Estimating Dependence with MCMC"
  url: /courses/copulas/25-mcmc-workshop/
next_section:
  title: "Appendix: Background for the Proofs"
  url: /courses/copulas/appendix-background/
date: 2026-01-01
---

<h2 id="notation">Notation</h2>
<p>We use \(P\) or \(\Pr\) for probability and \(E\) for expectation. Unless a lesson states otherwise, copulas are bivariate and their coordinates lie in \(I=[0,1]\). This page collects formulas already developed in the lessons.</p>
<table><thead><tr><th>Symbol</th><th>Meaning</th><th>Lesson</th></tr></thead><tbody>
<tr><td>\(F,G,H\)</td><td>Two marginal distribution functions and their joint distribution function</td><td><a href="/courses/copulas/01-probability-and-margins/">1</a></td></tr>
<tr><td>\(F^{-1}(u)\)</td><td>Generalized inverse \(\inf\{x:F(x)\ge u\}\), for \(0&lt;u&lt;1\)</td><td><a href="/courses/copulas/03-sklars-theorem/">3</a></td></tr>
<tr><td>\(C(u,v)\)</td><td>Joint distribution function with uniform marginal distributions</td><td><a href="/courses/copulas/02-copulas-and-bounds/">2</a></td></tr>
<tr><td>\(\Pi,M,W\)</td><td>Product copula and bivariate upper and lower Fréchet bounds</td><td><a href="/courses/copulas/02-copulas-and-bounds/">2</a></td></tr>
<tr><td>\(c(u,v)\)</td><td>Density of an absolutely continuous copula</td><td><a href="/courses/copulas/04-densities-and-conditioning/">4</a></td></tr>
<tr><td>\(\widehat C\)</td><td>Survival copula</td><td><a href="/courses/copulas/05-constructions/">5</a></td></tr>
<tr><td>\(\varphi,\psi\)</td><td>Decreasing additive Archimedean generator and its inverse; check each domain</td><td><a href="/courses/copulas/06-archimedean-copulas/">6</a>, <a href="/courses/copulas/09-multivariate-copulas/">9</a></td></tr>
<tr><td>\(\tau,\rho_S\)</td><td>Population Kendall and Spearman coefficients</td><td><a href="/courses/copulas/07-concordance/">7</a></td></tr>
<tr><td>\(\lambda_L,\lambda_U\)</td><td>Lower and upper tail-dependence coefficients, when the limits exist</td><td><a href="/courses/copulas/08-tail-dependence/">8</a></td></tr>
<tr><td>\(\pi(\theta),\pi(\theta\mid D)\)</td><td>Prior and posterior densities for a parameter</td><td><a href="/courses/copulas/11-estimation-and-bayes/">11</a></td></tr>
<tr><td>\(C_n,t,r\)</td><td>Empirical copula grid and sample Kendall and Spearman statistics</td><td><a href="/courses/copulas/13-empirical-workshop/">13</a></td></tr>
<tr><td>\(I^d,[0,1]^d\)</td><td>Cartesian products used for d-dimensional copula domains</td><td><a href="/courses/copulas/09-multivariate-copulas/">9</a></td></tr>
<tr><td>\(C_j,\partial_j C\)</td><td>Partial derivative with respect to coordinate \(j\), where it exists</td><td><a href="/courses/copulas/04-densities-and-conditioning/">4</a>, <a href="/courses/copulas/10-simulation/">10</a></td></tr>
<tr><td>\(\prod_i,\Theta,\widehat\theta\)</td><td>Product over observations, allowed parameter values, and an estimated parameter</td><td><a href="/courses/copulas/11-estimation-and-bayes/">11</a></td></tr>
<tr><td>\(\operatorname{VaR}_\alpha,\alpha,\ell\)</td><td>Value at Risk at confidence level \(\alpha\), with loss threshold \(\ell\)</td><td><a href="/courses/copulas/12-financial-applications/">12</a></td></tr>
<tr><td>\(\operatorname{Ran}F\)</td><td>Values attained by \(F\), including endpoint values at infinity under the course convention</td><td><a href="/courses/copulas/03-sklars-theorem/#statement">3</a></td></tr>
<tr><td>\(A\times B\)</td><td>Pairs with first coordinate in \(A\) and second coordinate in \(B\)</td><td><a href="/courses/copulas/02-copulas-and-bounds/#definition">2</a></td></tr>
<tr><td>\(\mathbf1\{A\}\)</td><td>One when the event or condition \(A\) holds; zero otherwise</td><td><a href="/courses/copulas/04-densities-and-conditioning/#mixed-example">4</a></td></tr>
<tr><td>\(\int f\,dL,\ \int\!\int f\,dC\)</td><td>Expectations under the distributions \(L\) and \(C\), respectively</td><td><a href="/courses/copulas/05-constructions/#mixtures">5</a>, <a href="/courses/copulas/07-concordance/">7</a></td></tr>
<tr><td>\(f\sim g,\ o(s)\)</td><td>Ratio \(f/g\) tends to one; a remainder whose ratio to \(s\) tends to zero</td><td><a href="/courses/copulas/08-tail-dependence/#calculations">8</a></td></tr>
<tr><td>\(X\sim L\)</td><td>The random variable \(X\) has distribution \(L\)</td><td><a href="/courses/copulas/10-simulation/#conditional">10</a></td></tr>
<tr><td>\(\Phi,\Phi_R,\Phi^{-1}\)</td><td>Standard normal distribution function, joint standard normal distribution function with correlation matrix \(R\), and normal quantile function</td><td><a href="/courses/copulas/09-multivariate-copulas/#construct">9</a></td></tr>
</tbody></table>

<h2 id="formula-guide">Formula guide</h2>
<div class="math-block"><span class="block-label">Joining and separating marginal distributions</span>
<p>\[H(x,y)=C(F(x),G(y)).\]</p>
<p>Every joint law has such a representation. Continuous marginal distributions make the copula unique. With discrete marginal distributions, the values on the attained marginal ranges are uniquely determined. The full copula may have several extensions. <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a></p>
<p>When the required densities exist, \(h(x,y)=c(F(x),G(y))f(x)g(y)\). A copula with mass on a curve requires separate treatment of that singular mass. <a class="course-citation" href="#ref-2" aria-label="Reference 2">[2]</a></p></div>

<div class="math-block"><span class="block-label">Rectangle and survival probabilities</span>
<p>Rectangle probabilities follow from the copula volume. <a class="course-citation" href="#ref-3" aria-label="Reference 3">[3]</a></p>
<p>\[P[a&lt;U\le b,\ d&lt;V\le e]=C(b,e)-C(a,e)-C(b,d)+C(a,d).\]</p>
<p>\[P[U&gt;u,V&gt;v]=1-u-v+C(u,v),\qquad \widehat C(u,v)=u+v-1+C(1-u,1-v).\]</p>
<p>The arguments of a survival copula are marginal survival probabilities. The formula for the joint upper-right event at the original thresholds uses \(C(u,v)\). <a class="course-citation" href="#ref-4" aria-label="Reference 4">[4]</a></p></div>

<div class="math-block"><span class="block-label">Concordance and tails</span>
<p>For continuous marginal distributions, the concordance formulas are <a class="course-citation" href="#ref-5" aria-label="Reference 5">[5]</a></p>
<p>\[\tau=4\int_{[0,1]^2}C\,dC-1,\qquad \rho_S=12\int_0^1\!\int_0^1C(u,v)\,du\,dv-3.\]</p>
<p>The measure \(dC\) is the joint probability law of \((U,V)\). It can be replaced by \(c(u,v)\,du\,dv\) when that law is absolutely continuous.</p>
<p>\[\lambda_L=\lim_{t\downarrow0}\frac{C(t,t)}{t},\qquad \lambda_U=\lim_{t\uparrow1}\frac{1-2t+C(t,t)}{1-t}.\]</p>
<p>These limits describe increasingly extreme thresholds. A finite-threshold conditional probability may differ substantially from its limit. <a class="course-citation" href="#ref-6" aria-label="Reference 6">[6]</a></p></div>

<h2 id="reading-routes">Choose a route</h2>
<p>Start with Lessons 1–8 and try each exercise before opening its answer. Lesson 10 turns the formulas into simulated pairs. Then choose the question you want to study: Lessons 14–19 develop individual families; Lesson 20 studies maxima; Lesson 21 compares dependence patterns; and Lessons 11, 13, 22, and 23 move from observations to estimation and prediction. Lesson 12 applies these ideas to joint defaults. The <a href="/courses/copulas/#semester-route">semester route</a> puts these modules into a weekly sequence.</p>
<p>Prerequisites are elementary probability, single-variable calculus, and enough multivariable calculus to follow a mixed derivative or a double integral. The density-based arguments identify where this calculus is used. The first lessons introduce the joint distribution notation needed throughout.</p>

<p>For optional practice, <a href="/courses/copulas/09a-common-factor-workshop/">Workshop 9A</a> develops a common-factor default-count model. <a href="/courses/copulas/24-mcmc-theory/">Lesson 24</a> and <a href="/courses/copulas/25-mcmc-workshop/">Workshop 25</a> introduce and check MCMC for a copula posterior.</p>

<h2 id="family-guide">Finding a family or method</h2>
<p>We can match a rank coefficient and still obtain different predictions for joint extremes. Use this guide to return to the construction and its assumptions before choosing a formula.</p>
<table><thead><tr><th>Topic</th><th>What the lesson develops</th></tr></thead><tbody>
<tr><td><a href="/courses/copulas/14-gaussian-copulas/">Gaussian</a> and <a href="/courses/copulas/15-student-t-copulas/">Student t</a></td><td>Elliptical constructions, matrix conditions, shared scales, and simulation</td></tr>
<tr><td><a href="/courses/copulas/16-clayton-copulas/">Clayton</a></td><td>Lower-tail dependence, Kendall calibration, and gamma frailty</td></tr>
<tr><td><a href="/courses/copulas/17-gumbel-copulas/">Gumbel</a></td><td>Upper-tail dependence, conditional inversion, and max stability</td></tr>
<tr><td><a href="/courses/copulas/18-frank-copulas/">Frank</a></td><td>Positive and negative parameters and conditional inversion</td></tr>
<tr><td><a href="/courses/copulas/19-marshall-olkin/">Marshall–Olkin</a></td><td>Independent shocks, a survival copula, and singular probability mass</td></tr>
<tr><td><a href="/courses/copulas/20-extreme-value-copulas/">Extreme-value copulas</a></td><td>Block maxima and the Pickands dependence function</td></tr>
<tr><td><a href="/courses/copulas/22-calibration-workshop/">Calibration</a></td><td>How a shared Kendall coefficient leaves the family undetermined</td></tr>
<tr><td><a href="/courses/copulas/23-bayesian-prediction/">Bayesian prediction</a></td><td>Averaging event probabilities over a normalized posterior</td></tr>
</tbody></table>

<h2 id="bibliography">Books used in this course</h2>
<p>Numbered references at the end of each lesson identify the particular results used. Page numbers refer to printed page labels; where a PDF page is also given, it is the one-based position in the supplied file. The PDF offsets vary within Nelsen's file, so printed and PDF page numbers should be read separately.</p>
<ol>
<li id="nelsen"><strong>Roger B. Nelsen (2006).</strong> <em>An Introduction to Copulas</em>, second edition. Springer Series in Statistics. Springer. ISBN 978-0-387-28659-4. The main reference for definitions, Sklar's theorem, constructions, Archimedean copulas, concordance, tails, and empirical copulas. The title page of the supplied second edition places it in Springer Series in Statistics.</li>
<li id="simulation-book"><strong>Jan-Frederik Mai and Matthias Scherer (2017).</strong> <em>Simulating Copulas: Stochastic Models, Sampling Algorithms, and Applications</em>, second edition. Series in Quantitative Finance, volume 6. World Scientific. ISBN 978-981-3149-24-3. Used for simulation methods and their mathematical justification.</li>
<li id="bayes-book"><strong>Arkady Shemyakin and Alexander Kniazev (2017).</strong> <em>Introduction to Bayesian Estimation and Copula Models of Dependence</em>. John Wiley &amp; Sons. Used for parameter estimation, Bayes' rule, and Bayesian copula modeling.</li>
<li id="finance-book"><strong>Jan-Frederik Mai and Matthias Scherer (2014).</strong> <em>Financial Engineering with Copulas Explained</em>. Financial Engineering Explained. Palgrave Macmillan. ISBN 978-1-137-34630-8. Used for estimation methods, dependence uncertainty, simulation, and default modeling.</li>
</ol>
<p>The course's figures are generated from the stated formulas. The small numerical datasets, posterior calculation, and two-loan illustration are worked course examples of the cited methods. They are separate from the empirical datasets discussed in the books.</p>

<div id="formula-sources"></div>
<h2 id="references">References for this guide</h2>
<ol class="course-references">
<li id="ref-1">Roger B. Nelsen, <em>An Introduction to Copulas</em>, second edition, Springer, 2006. <strong>Sklar's Theorem 2.3.3</strong>, printed p. 18 (PDF p. 29).</li>
<li id="ref-2">Jan-Frederik Mai and Matthias Scherer, <em>Financial Engineering with Copulas Explained</em>, Palgrave Macmillan, 2014. Section 6.2, <strong>density factorization</strong>, printed pp. 88–90.</li>
<li id="ref-3">Roger B. Nelsen, <em>An Introduction to Copulas</em>, second edition, Springer, 2006. Definition 2.1.1, <strong>rectangle volume</strong>, printed p. 8 (PDF p. 19).</li>
<li id="ref-4">Roger B. Nelsen, <em>An Introduction to Copulas</em>, second edition, Springer, 2006. Section 2.6, equations (2.6.1)–(2.6.2), <strong>survival copula</strong>, printed p. 32 (PDF p. 43).</li>
<li id="ref-5">Roger B. Nelsen, <em>An Introduction to Copulas</em>, second edition, Springer, 2006. Theorem 5.1.3, printed p. 161 (PDF p. 170), and Section 5.1.2, printed pp. 167–170, <strong>concordance formulas</strong>.</li>
<li id="ref-6">Roger B. Nelsen, <em>An Introduction to Copulas</em>, second edition, Springer, 2006. Theorem 5.4.2, <strong>diagonal tail limits</strong>, printed pp. 214–215 (PDF pp. 223–224).</li>
</ol>
