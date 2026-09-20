---
title: Densities and Conditioning
permalink: /courses/copulas/04-densities-and-conditioning/
updated: 2026-01-01
course_title: Copulas
course_url: /courses/copulas/
course_section_style: hybrid
section_number: 4
section_kind: Theory and simulation
summary: Absolutely continuous and singular copulas, conditional distributions, and conditional simulation.
prerequisites: Sklar's theorem and partial derivatives
reading_time: 18 minutes
exercises: 3 exercises
previous_section:
  title: "Sklar's Theorem"
  url: /courses/copulas/03-sklars-theorem/
next_section:
  title: "Constructions"
  url: /courses/copulas/05-constructions/
date: 2026-01-01
---

<section class="intro-strip"><h2 id="overview">Mass on the square</h2><p>A copula may distribute its probability over area, along curves, or through both components. Derivatives describe the area component. Conditional sections provide a direct simulation method.</p></section>
<h2 id="components">Absolutely continuous and singular parts</h2>
<p>Here \((U,V)\) is a pair of uniform variables with joint distribution function \(C\). We use \(\partial_1C=\partial C/\partial u\) and \(\partial_2C=\partial C/\partial v\) for derivatives in the first and second coordinates. “Almost everywhere” means outside a set of area zero when discussing a density on the square, or length zero when discussing a single coordinate.</p>
<p>A copula induces a probability measure on \(I^2\), with uniform measure on every horizontal and vertical strip. The [[absolutely continuous copula::density]] describes the part of the probability that is spread over area. Its density is the almost-everywhere mixed derivative <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a></p>
<p>\[
c(u,v)=\frac{\partial^2 C(u,v)}{\partial u\,\partial v}.
\]</p>
<p>Its accumulated mass is \(A_C(u,v)=\int_0^u\int_0^v c(s,t)\,dt\,ds\). The remainder \(S_C=C-A_C\) is the [[singular component]]. A copula is absolutely continuous when \(C=A_C\), and singular when its mixed derivative is zero almost everywhere. The product copula \(\Pi(u,v)=uv\) has density \(1\). The copula \(M(u,v)=\min(u,v)\) puts its mass on the diagonal \(v=u\), so it is singular.</p>
<div class="math-block proposition"><span class="block-label">Proposition 4.1 <span>Conditional section</span></span><p>For almost every fixed \(u\), the conditional distribution of \(V\) given \(U=u\) is \(C_u(v)=\partial C(u,v)/\partial u\).</p></div>
<p>Why is this derivative useful? A right-continuous version is a distribution function in \(v\), for almost every conditioning value \(u\). Values at jumps are chosen by right-continuity; on an exceptional set of conditioning values of probability zero, any valid conditional law can be assigned. <a class="course-citation" href="#ref-2" aria-label="Reference 2">[2]</a> This statement also covers copulas with singular mass, where a two-dimensional density alone would miss part of the law.</p>
<div class="math-block proof"><span class="block-label">Why a partial derivative appears</span><p>For \(0\le a&lt;b\le1\),</p><p>\[P[a&lt;U\le b,V\le v]=C(b,v)-C(a,v)=\int_a^b\partial_1C(s,v)\,ds.\]</p><p>The last equality uses the absolute continuity of a Lipschitz section. Since \(U\) has uniform density one, this is the integral of a conditional probability over the possible first coordinates. It identifies \(\partial_1C\) as a conditional distribution, with the version qualification above.</p></div>
<details class="supplementary-proof" id="proof-conditional-section"><summary>Proof</summary><div class="proof-content"><p><strong>Conditional-distribution version.</strong> Let \(\mu\) be the probability measure on \(I^2\) induced by \(C\). The uniform first marginal is Lebesgue measure, so, using the probability-kernel construction in the <a href="/courses/copulas/appendix-background/#probability-kernels">probability-kernels background</a>, a conditional probability kernel \(K(s,\cdot)\) for the second coordinate given \(U=s\) satisfies \[\mu\bigl((a,b]\times[0,v]\bigr)=\int_a^b K(s,[0,v])\,ds.\] The left side is \(C(b,v)-C(a,v)\). For fixed \(v\), the function \(s\mapsto C(s,v)\) is 1-Lipschitz, hence absolutely continuous, and its derivative is \(\partial_1C(s,v)\) for almost every \(s\). Comparing the two integral representations gives \[K(s,[0,v])=\partial_1C(s,v)\] for almost every \(s\), first for a countable dense collection of \(v\) and then for every \(v\) at which the two distribution functions are continued right-continuously. Therefore \(v\mapsto\partial_1C(s,v)\), with that version chosen, is a distribution function for the conditional law of \(V\) given \(U=s\), outside a Lebesgue-null set of \(s\). The same argument with the coordinates exchanged gives the corresponding statement for \(\partial_2C(u,v)\).</p><p>If \(C\) is absolutely continuous, then \(K(s,[0,v])=\int_0^v c(s,t)\,dt\) follows from the <a href="/courses/copulas/appendix-background/#measure-tools">measure tools background</a> and Fubini's theorem. When \(C\) has singular mass, the kernel still exists and the derivative statement remains valid. A two-dimensional density alone does not describe the whole conditional law. This is the conditional-derivative result used in Mai and Scherer's Algorithm 1.2. <a class="course-citation" href="#ref-4" aria-label="Reference 4">[4]</a></p></div></details>
<h2 id="mixed-example">A mixture with two kinds of mass</h2>
<p>Consider \(C_q(u,v)=(1-q)uv+q\min(u,v)\), \(0\le q\le1\). This is a convex mixture of two copulas, as in Exercise 2.6. <a class="course-citation" href="#ref-3" aria-label="Reference 3">[3]</a> With probability \(q\), draw one uniform and use it for both coordinates; otherwise draw independent uniforms. Away from the diagonal, the mixed derivative is \(1-q\), so its integral over the square is \(1-q\). The remaining probability \(q\) is on the diagonal. Integrating the density alone therefore recovers only part of the distribution when \(q&gt;0\).</p>
<p>We write \(P[A\mid U=u]\) for the probability of \(A\) under the conditional law at \(U=u\). The indicator \(\mathbf1\{A\}\) equals one when \(A\) holds and zero otherwise. For a fixed interior \(u\), a conditional distribution is</p><p>\[P[V\le v\mid U=u]=(1-q)v+q\mathbf1\{v\ge u\}.\]</p><p>Its jump of size \(q\) at \(v=u\) describes the diagonal component. This course illustration applies Nelsen's absolutely continuous/singular decomposition and convex-sum construction.</p>
<h2 id="simulation">Conditional simulation</h2>
<p>To generate \((U,V)\) with copula \(C\), draw independent uniforms \(u,t\). Regard \(C_u(v)=\partial C(u,v)/\partial u\) as a conditional distribution function, and choose \(v=C_u^{-1}(t)\), using the generalized inverse of this conditional distribution. Then \(X=F^{-1}(u)\), \(Y=G^{-1}(v)\) have joint distribution \(C(F(x),G(y))\).</p>
<div class="code-window"><header>Conditional sampling (pseudocode)</header><pre><code>u, t = independent_uniforms()
v = conditional_inverse(u, t)
x = marginal_inverse_F(u)
y = marginal_inverse_G(v)</code></pre>
<details class="complete-program"><summary>Complete program</summary><div class="program-notes"><p>This program uses the product copula and unit-rate exponential marginal distributions. It defines every function in the preview and compares a simulated joint probability with its exact value. The marginal transformation is developed in <a href="/courses/copulas/10-simulation/#transform">Lesson 10</a>.</p><p>Python 3; standard library only. Copy the full block below into <code>conditional_independence.py</code> and run <code>python conditional_independence.py</code>.</p></div><pre><code>import math
import random

rng = random.Random(2026)

def independent_uniforms():
    return rng.random(), rng.random()

def conditional_inverse(u, t):
    # Product copula: C(u, v) = u*v, so C_u(v) = v.
    return t

def marginal_inverse_F(u):
    # Unit-rate exponential marginal distribution.
    return -math.log1p(-u)

def marginal_inverse_G(v):
    return -math.log1p(-v)

n = 20_000
joint_count = 0
for _ in range(n):
    u, t = independent_uniforms()
    v = conditional_inverse(u, t)
    x = marginal_inverse_F(u)
    y = marginal_inverse_G(v)
    joint_count += (x &gt; 1 and y &gt; 1)

print("Simulated P(X &gt; 1, Y &gt; 1):", joint_count / n)
print("Exact probability:", math.exp(-2))</code></pre></details></div>
<p>For the product copula, \(C_u(v)=v\), so \(v=t\) and the two uniforms are independent. For a non-product copula, the conditional inverse changes with \(u\); that change is exactly what reproduces the desired dependence. Nelsen's worked example applies the same procedure explicitly.</p>
<div class="problem-grid">
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 4.2</strong><span>Product density</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Find the density of \(\Pi(u,v)=uv\).</p></div><div class="answer-panel"><div class="answer-inner"><p>\(\partial\Pi/\partial u=v\), and then \(\partial^2\Pi/\partial v\partial u=1\). Thus the density is constant on \(I^2\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 4.3</strong><span>Singular support</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Where is the mass of \(M(u,v)=\min(u,v)\) supported?</p></div><div class="answer-panel"><div class="answer-inner"><p>On the main diagonal \(\{(u,v):v=u\}\). Rectangles strictly above or below that diagonal have zero \(M\)-measure, and the mixed derivative is zero away from the diagonal.</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 4.4</strong><span>Conditional algorithm</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>For the mixture \(C_q\) with \(q=1/3\), how much probability does its density account for, and what is \(P[V\le1/2\mid U=1/2]\)?</p></div><div class="answer-panel"><div class="answer-inner"><p>The density is \(2/3\), so it accounts for mass \(2/3\). The conditional probability is \((2/3)(1/2)+(1/3)=2/3\). The extra term comes from the atom at the conditioning coordinate.</p></div></div></article>
</div>
<h2 id="references">References</h2>
<ol class="course-references">
<li id="ref-1">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), §2.4, equation (2.4.1) and Example 2.11, printed p. 27 (PDF p. 38).</li>
<li id="ref-2">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), §2.9, equation (2.9.1) and conditional sampling steps, printed p. 41 (PDF p. 52).</li>
<li id="ref-3">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), §3.2.4, equation (3.2.4), printed p. 72 (PDF p. 82).</li>
<li id="ref-4">Jan-Frederik Mai and Matthias Scherer, <em>Simulating Copulas: Stochastic Models, Sampling Algorithms, and Applications</em>, second edition (2017), §1.1.3, Algorithm 1.2 and the conditional-derivative justification, printed pp. 22–24 (PDF pp. 41–43).</li>
</ol>
