---
title: Gaussian Copulas
course_title: Copulas
course_url: /courses/copulas/
course_section_style: hybrid
section_number: 14
section_kind: Elliptical copula
summary: Construct Gaussian copulas from correlated normal variables and simulate them by a Cholesky factor.
prerequisites: Multivariate copulas, normal distributions, matrix multiplication
reading_time: 18 minutes
exercises: 4 exercises
permalink: /courses/copulas/14-gaussian-copulas/
previous_section:
  title: "Workshop: From Observations to an Empirical Copula"
  url: /courses/copulas/13-empirical-workshop/
next_section:
  title: "Student-t Copulas"
  url: /courses/copulas/15-student-t-copulas/
date: 2026-01-01
updated: 2026-01-01
---

<section class="intro-strip" id="overview"><h2>Normal dependence on the copula scale</h2><p>We begin with a multivariate normal vector and retain only its marginal ranks. The resulting copula depends on the correlation matrix. Means and marginal variances disappear under the probability integral transform.</p></section>

<h2 id="elliptical-bridge">The larger elliptical family</h2>
<p>The [[Gaussian copula]] is one member of an elliptical family. A useful construction starts with a direction \(S\) uniformly distributed on the unit sphere in \(\mathbb R^d\), an independent nonnegative radial variable \(Q\), a vector \(\mu\), and a full-rank matrix \(B\). Set \(X=\mu+QBS\). The direction supplies a symmetric shape; the radial variable determines how far a draw lies from its center. The matrix \(\Sigma=BB^\mathsf T\) describes that shape. This is the full-rank version of the spherical representation used by Mai and Scherer in <em>Simulating Copulas</em>, Chapter 4, especially Section 4.4, Definition 4.5.</p>
<div class="math-block proposition"><span class="block-label">Elliptical bridge <span>Standardizing the shape</span></span><p>Assume \(\Sigma\) is positive definite and the marginal distributions are continuous. Put \(P_{ij}=\Sigma_{ij}/\sqrt{\Sigma_{ii}\Sigma_{jj}}\). Then the copula of \(X\) is unchanged if each coordinate is shifted by \(-\mu_j\) and divided by \(\sqrt{\Sigma_{jj}}\). The resulting elliptical vector has shape matrix \(P\), whose diagonal entries are one.</p></div>
<div class="math-block proof"><span class="block-label">Why this works</span><p>Every divisor is positive. These coordinatewise affine maps are strictly increasing, so they preserve the copula. The transformed shape matrix is \(D^{-1}\Sigma D^{-1}=P\), with \(D_{jj}=\sqrt{\Sigma_{jj}}\). Mai and Scherer state this normalization in Remark 4.3, printed p. 174 (PDF p. 193). The word <em>shape</em> matters: \(\Sigma\) need not itself be a covariance matrix when the radial second moment does not exist.</p></div>
<p>Different radial laws can produce different copulas with the same standardized shape \(P\). Gaussian and Student-t copulas are the two examples in the next lessons. In the bivariate nondegenerate case, with no probability concentrated at either coordinate's center, their population Kendall coefficient has the shared form \(\tau=(2/\pi)\arcsin(P_{12})\), even though their tail behavior can differ. This is Mai and Scherer's Lemma 4.6(3), printed p. 175 (PDF p. 194). A matching Kendall coefficient therefore need not identify the radial law or the probability of joint extremes.</p>

<h2 id="construction">Construction</h2>
<p>Let \(Z=(Z_1,\ldots,Z_d)\) be a centered normal vector with correlation matrix \(R\). Positive semidefiniteness of \(R\) is the compatibility condition that makes this joint normal law possible. Each \(Z_j\) has standard normal distribution, with distribution function \(\Phi\). Set \(U_j=\Phi(Z_j)\). Each \(U_j\) is uniform on \([0,1]\), and the joint distribution of \(U\) is the Gaussian copula</p>
<p>\[C_R(u_1,\ldots,u_d)=\Phi_R\bigl(\Phi^{-1}(u_1),\ldots,\Phi^{-1}(u_d)\bigr).\]</p>
<p>If \(X_j=\mu_j+\sigma_j Z_j\), with \(\sigma_j>0\), then \(F_j(X_j)=\Phi(Z_j)\). Hence the same \(C_R\) is obtained from arbitrary normal marginal distributions. The correlation matrix controls the copula coordinates, while the marginal distributions are supplied later through Sklar's theorem.</p>

<h2 id="bivariate-density">The bivariate density</h2>
<p>For \(d=2\), write \(R=\begin{pmatrix}1&\rho\\\rho&1\end{pmatrix}\), with \(-1&lt;\rho&lt;1\). Put \(z_1=\Phi^{-1}(u)\) and \(z_2=\Phi^{-1}(v)\). Dividing the bivariate normal density by the two standard normal marginal densities gives</p>
<p>\[c_\rho(u,v)=\frac{1}{\sqrt{1-\rho^2}}\exp\left\{\frac{2\rho z_1z_2-\rho^2(z_1^2+z_2^2)}{2(1-\rho^2)}\right\}.\]</p>
<p>The quotient is the copula density because the change of variables \(u=\Phi(z_1)\), \(v=\Phi(z_2)\) contributes the two marginal densities. When \(\rho=0\), the exponent is zero and \(c_0(u,v)=1\), so \(C_0(u,v)=uv\). The normal variables are independent, and their uniform transforms remain independent. For positive \(\rho\), mass concentrates around the diagonal. For negative \(\rho\), it concentrates around the counterdiagonal.</p>

<h2 id="sampling">Cholesky sampling</h2>
<p>To simulate in dimension \(d\), factor \(R=LL^\mathsf{T}\), where \(L\) is lower triangular. Draw \(Y\) with independent standard normal components and set \(Z=LY\). Then \(E[Z]=0\) and</p>
<p>\[\operatorname{Cov}(Z)=L\,\operatorname{Cov}(Y)\,L^\mathsf{T}=LL^\mathsf{T}=R.\]</p>
<p>Finally return \(U_j=\Phi(Z_j)\). In the bivariate case, \(L=\begin{pmatrix}1&0\\\rho&\sqrt{1-\rho^2}\end{pmatrix}\), so \(Z_1=Y_1\) and \(Z_2=\rho Y_1+\sqrt{1-\rho^2}Y_2\). At \(\rho=0\), this becomes \(Z_2=Y_2\), giving two independent uniforms after transformation.</p>
<figure class="figure-box"><img src="/assets/images/copulas/gaussian-simulation.svg" alt="Gaussian copula simulation on the unit square"><figcaption>Gaussian copula sample generated from a Cholesky factor. The correlation parameter and coordinate conventions are given in the figure asset.</figcaption></figure>

<h2 id="exercises">Exercises</h2>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 14.1</strong><span>Correlation validity.</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Why must \(R\) be positive semidefinite?</p></div><div class="answer-panel"><div class="answer-inner"><p>For every vector \(a\), \(a^\mathsf{T}Ra=\operatorname{Var}(a^\mathsf{T}Z)\ge0\). Thus every covariance or correlation matrix is positive semidefinite. The condition is also what permits a factorization \(R=LL^\mathsf{T}\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 14.2</strong><span>Independence.</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Show that \(\rho=0\) gives the product copula.</p></div><div class="answer-panel"><div class="answer-inner"><p>The bivariate normal density factors when \(\rho=0\), so \(Z_1,Z_2\) are independent. Applying \(\Phi\) coordinatewise preserves independence, giving \(C_0(u,v)=uv\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 14.3</strong><span>Cholesky coordinates.</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Verify the covariance of \(Z_2=\rho Y_1+\sqrt{1-\rho^2}Y_2\).</p></div><div class="answer-panel"><div class="answer-inner"><p>Independence gives \(\operatorname{Var}(Z_2)=\rho^2+(1-\rho^2)=1\), and \(\operatorname{Cov}(Z_1,Z_2)=\operatorname{Cov}(Y_1,\rho Y_1)=\rho\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 14.4</strong><span>Marginal replacement.</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>If \(U=\Phi(Z_1)\) and \(X=F^{-1}(U)\), what remains unchanged when the continuous marginal distribution \(F\) changes?</p></div><div class="answer-panel"><div class="answer-inner"><p>The copula remains \(C_R\), because the rank coordinate \(U\) is unchanged and the target marginal distribution is continuous, so the copula is uniquely identified. Only the marginal distribution of \(X\) changes.</p></div></div></article>

<p class="source-note">Sources: Jan-Frederik Mai and Matthias Scherer, <em>Simulating Copulas: Stochastic Models, Sampling Algorithms, and Applications</em>, second edition (2017), §4.4, Definition 4.5, Remark 4.3, and Lemma 4.6(3), printed pp. 174–175 (PDF pp. 193–194), for elliptical representation, shape normalization, and Kendall's coefficient. Mai and Scherer, <em>Financial Engineering with Copulas Explained</em> (2014), §4.1, equations (4.1)–(4.2), printed pp. 49–50 (PDF pp. 66–67), for Gaussian construction; Example 2.5.1, printed pp. 30–31 (PDF pp. 47–48), for copula derivatives. The Gaussian construction also follows Nelsen (2006), §2.10, printed pp. 42–49 (PDF pp. 53–60).</p>
