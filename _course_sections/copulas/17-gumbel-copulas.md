---
title: Gumbel Copulas
permalink: /courses/copulas/17-gumbel-copulas/
course_title: Copulas
course_url: /courses/copulas/
course_section_style: hybrid
section_number: 17
summary: Study the Gumbel-Hougaard family and its upper-tail and extreme-value structure.
prerequisites: Clayton copulas
reading_time: 20 minutes
exercises: 3 worked exercises
previous_section:
  title: "Clayton Copulas"
  url: /courses/copulas/16-clayton-copulas/
next_section:
  title: "Frank Copulas"
  url: /courses/copulas/18-frank-copulas/
date: 2026-01-01
updated: 2026-01-01
---
<section class="intro-strip"><h2 id="family">The upper-tail family</h2><p>What changes when the generator uses a power of \(-\log u\)? For \(\theta\ge1\), \(\varphi_\theta(u)=(-\log u)^\theta\) gives \[C_\theta(u,v)=\exp\{-((-\log u)^\theta+(-\log v)^\theta)^{1/\theta}\}.\] <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a> The [[Gumbel]] parameter controls the arrangement of simultaneous upper extremes.</p></section>
<div class="math-block definition"><span class="block-label">Definition 17.1 <span>Density</span></span><p>Writing \(x=-\log u\), \(y=-\log v\), and \(A=x^\theta+y^\theta\), differentiation gives \[c_\theta(u,v)=C_\theta(u,v)\frac{A^{1/\theta-2}}{uv}x^{\theta-1}y^{\theta-1}\left(A^{1/\theta}+\theta-1\right).\] This formula applies in the open unit square; its boundary values are interpreted by limits.</p></div>
<p>To see where the factors arise, first differentiate the exponent \(A^{1/\theta}\). Since \(\partial_u x=-1/u\), the first copula derivative is \[\partial_u C_\theta(u,v)=\frac{C_\theta(u,v)}{u}x^{\theta-1}A^{1/\theta-1}.\] Differentiating this expression in \(v\) gives two terms. The derivative of \(C_\theta\) contributes \(A^{2/\theta-2}\), while the derivative of \(A^{1/\theta-1}\) contributes \((\theta-1)A^{1/\theta-2}\). Factoring their sum produces Definition 17.1. This also explains why the density is nonnegative for \(\theta\geq1\).</p>
<div class="math-block theorem"><span class="block-label">Theorem 17.2 <span>Kendall and upper tail</span></span><p>\[\tau_\theta=1-\frac1\theta,\qquad \lambda_U=2-2^{1/\theta},\qquad\lambda_L=0.\]</p></div>
<div class="math-block proof"><span class="block-label">Proof</span><p>The Archimedean concordance formula is \(\tau=1+4\int_0^1\varphi(u)/\varphi'(u)\,du\). <a class="course-citation" href="#ref-2" aria-label="Reference 2">[2]</a> Here \(\varphi'(u)=-\theta(-\log u)^{\theta-1}/u\), so \[\frac{\varphi(u)}{\varphi'(u)}=\frac{u\log u}{\theta},\qquad \int_0^1\frac{u\log u}{\theta}\,du=-\frac{1}{4\theta}.\] Integration by parts gives the latter integral: \(\int_0^1u\log u\,du=[u^2\log u/2-u^2/4]_0^1=-1/4\). Thus \(\tau=1-1/\theta\). On the diagonal \(C(u,u)=u^{2^{1/\theta}}\). Expanding \(u^a=1-a(1-u)+o(1-u)\) at one gives \(\lambda_U=2-2^{1/\theta}\); dividing \(C(u,u)\) by \(u\) at zero gives \(\lambda_L=0\), since \(2^{1/\theta}>1\) for every finite \(\theta\).</p></div>
<h2 id="extreme-value">Extreme-value connection</h2><p>Why does this family belong to extreme-value theory? It is max-stable: \(C(u^t,v^t)=C(u,v)^t\) for \(t>0\). <a class="course-citation" href="#ref-3" aria-label="Reference 3">[3]</a> <a class="course-citation" href="#ref-4" aria-label="Reference 4">[4]</a> Indeed, replacing \(u,v\) by \(u^t,v^t\) multiplies each logarithm by \(t\), and the homogeneous expression \(A^{1/\theta}\) also gains a factor \(t\). With \(u=e^{-x}\) and \(v=e^{-y}\), the stable-tail exponent is \((x^\theta+y^\theta)^{1/\theta}\). The case \(\theta=1\) reduces to \(C(u,v)=uv\); larger \(\theta\) gives positive upper-tail dependence while every finite parameter has zero lower-tail coefficient.</p>
<h2 id="conditional">Conditional simulation</h2><p>For continuous uniforms, \(G(v\mid u)=\Pr(V\leq v\mid U=u)=\partial_u C_\theta(u,v)\). <a class="course-citation" href="#ref-5" aria-label="Reference 5">[5]</a> With \(x=-\log u\), \(y=-\log v\), and \(A=x^\theta+y^\theta\), the derivative above gives \[G(v\mid u)=\frac{C_\theta(u,v)}{u}x^{\theta-1}A^{1/\theta-1}.\] This is a distribution function in \(v\) for each interior \(u\). It increases from zero as \(v\downarrow0\) to one as \(v\uparrow1\): when \(y=0\), \(A=x^\theta\) and \(C_\theta(u,1)=u\), making the displayed expression one. Its derivative in \(v\) is the nonnegative density \(c_\theta(u,v)\). Thus the sampling algorithm is concrete: draw independent uniforms \(U,Z\), hold \(u=U\) fixed, and bisect \(v\in[0,1]\) until \(G(v\mid u)=Z\) to the desired tolerance. Return \((U,v)\). At \(\theta=1\), \(G(v\mid u)=v\), so the second draw is simply \(V=Z\).</p>

<h2 id="simulation-example">A reproducible simulation</h2>
<p>Let us apply this inversion to the same independent uniform draws at three parameter values. At \(\theta=1\), we recover independence. At \(\theta=2\) and \(4\), the pairs concentrate increasingly near the diagonal, particularly in the upper-right corner. Both marginal distributions remain uniform.</p>
<p>The code implements the conditional distribution just derived. Each bisection step keeps the half-interval containing the solution. Sixty steps make the interval shorter than \(2^{-60}\), before allowing for floating-point rounding. The calculation uses interior coordinates to evaluate the logarithms and is intended for the moderate parameter values shown here.</p>
<details class="simulation-code"><summary>Show Python simulation code</summary><div class="code-window"><header>Gumbel sampler (NumPy)</header><pre><code>import numpy as np

def sample_gumbel(theta, n, seed=20260922):
    rng = np.random.default_rng(seed)
    u, z = rng.random((2, n))
    u = np.maximum(u, np.finfo(float).eps)
    x = -np.log(u)
    lo, hi = np.zeros(n), np.ones(n)
    for _ in range(60):
        v = (lo + hi) / 2
        a = x**theta + (-np.log(v))**theta
        g = np.exp(-a**(1/theta)) / u
        g *= x**(theta-1) * a**(1/theta-1)
        lo = np.where(g &lt; z, v, lo)
        hi = np.where(g &lt; z, hi, v)
    return u, (lo + hi) / 2

u, v = sample_gumbel(2, 20_000)
print(np.mean((u &gt; 0.9) &amp; (v &gt; 0.9)))</code></pre></div></details>
<figure class="figure-box"><div class="simulation-panels"><img src="/assets/images/copulas/gumbel-simulation-1.svg" alt="Gumbel copula simulation with parameter 1" loading="lazy"><img src="/assets/images/copulas/gumbel-simulation-2.svg" alt="Gumbel copula simulation with parameter 2" loading="lazy"><img src="/assets/images/copulas/gumbel-simulation-4.svg" alt="Gumbel copula simulation with parameter 4" loading="lazy"></div><figcaption>First 1,500 pairs from 20,000 simulated pairs per panel. Each panel uses the same independent uniform inputs with a different parameter.</figcaption></figure>
<p>For a numerical check, consider \(P(U>0.9,V>0.9)=1-2(0.9)+C(0.9,0.9)\). The table compares this exact probability with the simulated fraction. The Monte Carlo standard error is \(\sqrt{p(1-p)/n}\), using the exact event probability \(p\) and \(n=20{,}000\).</p>
<table><thead><tr><th>Parameter</th><th>Exact probability</th><th>Simulated fraction</th><th>Monte Carlo SE</th></tr></thead><tbody>
<tr><td>1</td><td>0.01000</td><td>0.00935</td><td>0.00070</td></tr>
<tr><td>2</td><td>0.06157</td><td>0.05865</td><td>0.00170</td></tr>
<tr><td>4</td><td>0.08224</td><td>0.07855</td><td>0.00194</td></tr>
</tbody></table>
<p>At \(\theta=2\), the code prints \(0.05865\), compared with the exact value \(0.06157\). The difference is about 1.7 Monte Carlo standard errors. The increase across parameters agrees with the greater upper-tail association derived above. These are joint probabilities at a fixed threshold; the limiting coefficient \(\lambda_U\) describes a different calculation.</p>
<h2 id="exercises">Exercises</h2>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 17.1</strong><span>Parameter from tau</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Find \(\theta\) when \(\tau=0.75\).</p></div><div class="answer-panel"><div class="answer-inner"><p>\(1-1/\theta=.75\), so \(\theta=4\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 17.2</strong><span>Upper tail</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Compute \(\lambda_U\) for \(\theta=2\).</p></div><div class="answer-panel"><div class="answer-inner"><p>\(\lambda_U=2-\sqrt2\), approximately \(0.5858\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 17.3</strong><span>Max stability</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Verify max stability from the displayed formula.</p></div><div class="answer-panel"><div class="answer-inner"><p>Replacing \(u,v\) by \(u^t,v^t\) multiplies both \(-\log\) terms by \(t\). The outer exponent becomes \(t\) times the original, so \(C(u^t,v^t)=C(u,v)^t\).</p></div></div></article>
<h2 id="references">References</h2><ol class="course-references">
<li id="ref-1">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), §4.2, Table 4.1, printed pp. 116–119 (PDF pp. 126–129): Gumbel generator and family. The density and conditional derivative here are direct differentiations of its family formula.</li>
<li id="ref-2">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), §5.1.1, Example 5.4(b), printed p. 164 (PDF p. 173): Kendall's tau for Gumbel.</li>
<li id="ref-3">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), §3.3, Definition 3.3.2 and Example 3.22, printed pp. 95–98: extreme-value copulas.</li>
<li id="ref-4">Jan-Frederik Mai and Matthias Scherer, <em>Simulating Copulas: Stochastic Models, Sampling Algorithms, and Applications</em>, 2nd ed. (2017), §1.2.5, Definition 1.12, printed pp. 52–53 (PDF pp. 71–72): max stability.</li>
<li id="ref-5">Jan-Frederik Mai and Matthias Scherer, <em>Simulating Copulas: Stochastic Models, Sampling Algorithms, and Applications</em>, 2nd ed. (2017), §1.1.3, Algorithm 1.2, printed p. 23 (PDF p. 42): conditional sampling.</li>
</ol>
