---
title: "Workshop: From Observations to an Empirical Copula"
permalink: /courses/copulas/13-empirical-workshop/
updated: 2026-01-01
course_title: Copulas
course_url: /courses/copulas/
course_section_style: workshop
section_number: 13
section_kind: Guided practice
summary: Build a copula on a rank grid and compute sample concordance by hand.
prerequisites: Lessons 2 and 7; sums and ranks
reading_time: 25 minutes
exercises: 4 exercises with complete answers
previous_section:
  title: "Financial Applications and Dependence Uncertainty"
  url: /courses/copulas/12-financial-applications/
next_section:
  title: "Gaussian Copulas"
  url: /courses/copulas/14-gaussian-copulas/
date: 2026-01-01
---

<section class="intro-strip"><h2 id="observations">What do the observations retain?</h2>
<p>Suppose we observe independent pairs from one continuous bivariate distribution. We can arrange each coordinate in increasing order and record the rank of every observation. This replaces the original units with positions in the sample. We now construct the [[empirical copula]] on this rank grid and compare two ways of measuring its concordance.</p>
<p>The four observations below are an illustrative course dataset. Every calculation is small enough to check by hand. We use Nelsen's empirical copula construction. <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a></p></section>

<div class="course-table-scroll" role="region" aria-label="Observations and their ranks" tabindex="0"><table class="course-table course-table--ranks"><thead><tr><th scope="col">Observation</th><th scope="col">First coordinate</th><th scope="col">Second coordinate</th><th scope="col">First rank</th><th scope="col">Second rank</th></tr></thead>
<tbody><tr><td>A</td><td>2</td><td>10</td><td>1</td><td>1</td></tr><tr><td>B</td><td>5</td><td>30</td><td>2</td><td>3</td></tr><tr><td>C</td><td>8</td><td>20</td><td>3</td><td>2</td></tr><tr><td>D</td><td>11</td><td>40</td><td>4</td><td>4</td></tr></tbody></table></div>

<h2 id="rank-grid">Counting rectangles on a rank grid</h2>
<div class="math-block definition"><span class="block-label">Definition 13.1 <span>Empirical copula on the grid</span></span>
<p>Let \((R_k,S_k)\), \(k=1,\ldots,n\), denote the two ranks, with no ties in either coordinate. For integers \(0\le i,j\le n\), put</p>
<p>\[C_n(i/n,j/n)=\frac1n\sum_{k=1}^n \mathbf 1\{R_k\le i,\ S_k\le j\}.\]</p>
<p>The symbol \(\mathbf 1\{A\}\) equals one when the statement \(A\) holds and zero otherwise. Thus this formula counts points in a lower-left rectangle and divides by the sample size.</p></div>
<p>For our observations, \(C_4(1/2,1/2)=1/4\): among first ranks 1 and 2, only observation A has second rank at most 2. At \((3/4,3/4)\), observations A, B, and C all qualify, so the value is \(3/4\). The complete grid, including its zero boundaries, is</p>
<div class="math-block"><p>\[
\bigl[C_4(i/4,j/4)\bigr]_{i,j=0}^4
=\frac14\begin{pmatrix}
0&0&0&0&0\\
0&1&1&1&1\\
0&1&1&2&2\\
0&1&2&3&3\\
0&1&2&3&4
\end{pmatrix}.
\]</p><p>Rows increase with \(i\); columns increase with \(j\). The final column is \(i/4\), and the final row is \(j/4\). These are precisely the uniform marginal distributions on the grid.</p></div>
<p>A grid rectangle has nonnegative volume because its four-term difference counts the observations inside that rectangle. This is the same inclusion-exclusion calculation used for a population copula.</p>
<p>Our definition specifies grid values. If we extend the counting formula to arbitrary real \(u,v\), the result is a step function with discrete marginal distributions. A continuous copula extension can instead be obtained by bilinear interpolation between adjacent grid values, as in Nelsen's subcopula extension. <a class="course-citation" href="#ref-2" aria-label="Reference 2">[2]</a> Keep the chosen extension explicit whenever evaluating between grid points.</p>

<figure class="figure-box"><img src="/assets/images/copulas/empirical-grid.svg" alt="Four rank points on a four by four grid, with the lower-left half-square highlighted and only one point inside it."><figcaption>The shaded rectangle counts one of the four observations. Its empirical probability is 1/4. Points on the upper and right boundaries are included.</figcaption></figure>

<h2 id="sample-concordance">Two sample summaries</h2>
<p>For Kendall's [[Kendall's tau::sample statistic]] \(t\), compare every unordered pair of observations. A pair is concordant when both coordinates increase together and discordant when one increases while the other decreases. There are \(\binom42=6\) pairs here. Only B and C are discordant. Consequently,</p>
<div class="math-block"><p>\[t=\frac{5-1}{6}=\frac23.\]</p></div>
<p>For Spearman's [[Spearman's rho::sample statistic]] \(r\), compute the ordinary correlation of the two rank lists. Both lists have mean \(5/2\), and each has sum of squared deviations equal to 5. Their cross-product sum is</p>
<div class="math-block"><p>\[
(-3/2)(-3/2)+(-1/2)(1/2)+(1/2)(-1/2)+(3/2)(3/2)=4.
\]</p><p>Therefore \(r=4/5\). The two statistics use different summaries of the ordering, so their numerical values can differ for the same sample. Nelsen relates both statistics to the empirical copula. <a class="course-citation" href="#ref-3" aria-label="Reference 3">[3]</a></p></div>
<p>The empirical copula records more detail than either scalar. It gives the sample mass in every grid rectangle. We can use the same construction for larger samples and evaluate the sums efficiently with a short program.</p>

<h2 id="exercises">Exercises</h2>
<article class="exercise" id="exercise-13-1"><header class="exercise-head"><div><strong>Exercise 13.1</strong><span>A rectangle away from the origin</span></div><button class="answer-button" type="button">Show answer</button></header>
<div class="exercise-body"><p>Using the displayed grid, find the empirical mass of \((1/4,3/4]\times(1/4,3/4]\). Identify the observations counted.</p></div>
<div class="answer-panel"><div class="answer-inner"><p>The mass is</p><p>\[C_4(3/4,3/4)-C_4(1/4,3/4)-C_4(3/4,1/4)+C_4(1/4,1/4)=\frac{3-1-1+1}{4}=\frac12.\]</p><p>Observations B and C have both ranks in \(\{2,3\}\), so the direct count gives the same answer.</p></div></div></article>

<article class="exercise" id="exercise-13-2"><header class="exercise-head"><div><strong>Exercise 13.2</strong><span>Recover Spearman's statistic from the copula</span></div><button class="answer-button" type="button">Show answer</button></header>
<div class="exercise-body"><p>The empirical-copula formula for Spearman's statistic <a class="course-citation" href="#ref-3" aria-label="Reference 3">[3]</a> gives</p><p>\[r=\frac{12}{n^2-1}\sum_{i=1}^n\sum_{j=1}^n\left[C_n(i/n,j/n)-\frac{ij}{n^2}\right].\]</p><p>Evaluate this expression for the dataset. Then explain why the sum of the grid values can be computed by counting how often each rank point contributes.</p><p><strong>Hint.</strong> A point at rank \((R,S)\) contributes to \((n-R+1)(n-S+1)\) rectangles.</p></div>
<div class="answer-panel"><div class="answer-inner"><p>The four positive rows of the grid sum to \(4/4,6/4,9/4,10/4\), giving \(29/4\). Also \(\sum_{i,j}ij/16=(1+2+3+4)^2/16=25/4\). Hence \(r=(12/15)(29/4-25/4)=4/5\).</p><p>A point is counted exactly when \(i\ge R\) and \(j\ge S\). There are \(n-R+1\) choices of the first index and \(n-S+1\) of the second. Its contribution to the sum of copula values is their product divided by \(n\). Summing these contributions gives the counting argument in the proof. <a class="course-citation" href="#ref-3" aria-label="Reference 3">[3]</a></p></div></div></article>

<article class="exercise" id="exercise-13-3"><header class="exercise-head"><div><strong>Exercise 13.3</strong><span>Increasing changes of units</span></div><button class="answer-button" type="button">Show answer</button></header>
<div class="exercise-body"><p>Replace the first coordinate by its square and the second by its natural logarithm. Determine the new rank pairs, empirical copula grid, and sample concordance statistics.</p></div>
<div class="answer-panel"><div class="answer-inner"><p>All first coordinates are positive, so squaring is strictly increasing on their range. The logarithm is strictly increasing on the positive second coordinates. Both orderings are preserved. The rank pairs remain \((1,1),(2,3),(3,2),(4,4)\), so the empirical grid, \(t=2/3\), and \(r=4/5\) remain unchanged. This is the sample counterpart of increasing-transformation invariance. <a class="course-citation" href="#ref-4" aria-label="Reference 4">[4]</a></p></div></div></article>

<article class="exercise" id="exercise-13-4"><header class="exercise-head"><div><strong>Exercise 13.4</strong><span>A continuous extension</span></div><button class="answer-button" type="button">Show answer</button></header>
<div class="exercise-body"><p>Use bilinear interpolation in the cell \([1/4,1/2]^2\) to compute the extended copula at \((3/8,3/8)\). Compare this with independence at the same point.</p></div>
<div class="answer-panel"><div class="answer-inner"><p>All four corner values are \(1/4\). At the midpoint of a cell, bilinear interpolation averages the four corners with weights \(1/4\), so the extension has value \(1/4\). Independence gives \((3/8)^2=9/64\), which is smaller. This comparison concerns one point of the fitted grid extension; it does not establish a population-wide dependence inequality from four observations.</p></div></div></article>

<div id="sources"></div>
<h2 id="references">References</h2>
<ol class="course-references">
<li id="ref-1">Roger B. Nelsen, <em>An Introduction to Copulas</em>, second edition, Springer, 2006. Section 5.6, Definition 5.6.1, <strong>empirical copula on the grid</strong>, printed p. 219 (PDF p. 228).</li>
<li id="ref-2">Roger B. Nelsen, <em>An Introduction to Copulas</em>, second edition, Springer, 2006. Lemma 2.3.5, <strong>subcopula extension by interpolation</strong>, printed pp. 19–21 (PDF pp. 30–32).</li>
<li id="ref-3">Roger B. Nelsen, <em>An Introduction to Copulas</em>, second edition, Springer, 2006. Section 5.6, Theorem 5.6.2 and equations (5.6.1)–(5.6.5), <strong>sample concordance formulas and counting argument</strong>, printed pp. 220–221 (PDF pp. 229–230).</li>
<li id="ref-4">Roger B. Nelsen, <em>An Introduction to Copulas</em>, second edition, Springer, 2006. Theorem 2.4.3, <strong>invariance under strictly increasing transformations</strong>, printed p. 25 (PDF p. 36).</li>
</ol>
<p>The four observations and their numerical calculations are course illustrations of these results.</p>
