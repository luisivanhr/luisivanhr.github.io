---
title: Frank Copulas
permalink: /courses/copulas/18-frank-copulas/
course_title: Copulas
course_url: /courses/copulas/
course_section_style: hybrid
section_number: 18
summary: Work with the signed Frank parameter and its conditional simulation formula.
prerequisites: Gumbel copulas
reading_time: 19 minutes
exercises: 3 worked exercises
previous_section:
  title: "Gumbel Copulas"
  url: /courses/copulas/17-gumbel-copulas/
next_section:
  title: "Marshall-Olkin Copulas"
  url: /courses/copulas/19-marshall-olkin/
date: 2026-01-01
updated: 2026-01-01
---
<section class="intro-strip"><h2 id="family">A signed, radially symmetric family</h2><p>How can one represent both positive and negative association with one formula? For \(\theta\in\mathbb R\setminus\{0\}\), \[C_\theta(u,v)=-\frac1\theta\log\left(1+\frac{(e^{-\theta u}-1)(e^{-\theta v}-1)}{e^{-\theta}-1}\right).\] The continuous extension at \(\theta=0\) is \(uv\). Positive and negative [[Frank]] parameters describe positive and negative association.</p></section>
<div class="math-block definition"><span class="block-label">Definition 18.1 <span>Density</span></span><p>Put \(D=e^{-\theta}-1+(e^{-\theta u}-1)(e^{-\theta v}-1)\). Then \[c_\theta(u,v)=\frac{\theta(1-e^{-\theta})e^{-\theta(u+v)}}{D^2}.\]</p></div>
<p>The parameter zero has a well-defined limit even though the displayed formula divides by \(\theta\). As \(\theta\to0\), \(e^{-\theta u}-1=-\theta u+O(\theta^2)\) and \(e^{-\theta}-1=-\theta+O(\theta^2)\). Consequently the fraction inside the logarithm is \(-\theta uv+O(\theta^2)\). Since \(\log(1+w)=w+O(w^2)\), it follows that \(C_\theta(u,v)=uv+O(\theta)\). This is why independence sits at the center of the signed family.</p>
<h2 id="conditional">Conditional inversion</h2><p>Write \(a=e^{-\theta u}\), \(b=e^{-\theta v}\), and \(k=e^{-\theta}-1\). Differentiating \(-\theta^{-1}\log(1+(a-1)(b-1)/k)\) with respect to \(u\) gives the conditional distribution function \[G(v\mid u)=\partial_u C_\theta(u,v)=\frac{a(b-1)}{k+(a-1)(b-1)}.\] Its values at \(v=0\) and \(v=1\) are zero and one. For \(0&lt;u&lt;1\), its derivative in \(v\) is the strictly positive density, so each \(z\in(0,1)\) has exactly one solution \(G(v\mid u)=z\).</p>
<div class="math-block proof"><span class="block-label">Explicit inverse</span><p>Set \(w=b-1\). Solving \(z[k+(a-1)w]=aw\) gives \(w=zk/[a-z(a-1)]\), hence \[b=1+\frac{zk}{a-z(a-1)},\qquad v=-\frac1\theta\log\left(1+\frac{z(e^{-\theta}-1)}{e^{-\theta u}-z(e^{-\theta u}-1)}\right).\] The denominator \(a-z(a-1)=a(1-z)+z\) is positive. The log argument is also positive: it equals \(b=e^{-\theta v}\), where \(v\in(0,1)\) exists uniquely by the endpoint and monotonicity argument above. More directly, at \(z=0\) it equals \(1\), at \(z=1\) it equals \(e^{-\theta}\), and the formula varies continuously and monotonically between those positive endpoints.</p></div>
<p>To simulate a pair, draw independent \(U,Z\sim\operatorname{Uniform}(0,1)\), substitute \(u=U,z=Z\) in the inverse, and return \((U,v)\). The formula applies for either sign of \(\theta\). For \(\theta=0\), return \((U,Z)\). Numerical implementations can evaluate exponential differences with stable small-argument routines when \(\theta\) is near zero.</p>
<h2 id="tails">Tail behavior</h2><p>Expand the diagonal at \(t=0\). The product \((e^{-\theta t}-1)^2=\theta^2t^2+O(t^3)\), while \(k=e^{-\theta}-1\) stays nonzero for fixed \(\theta\ne0\). Expanding the logarithm yields \[C_\theta(t,t)=\frac{\theta}{1-e^{-\theta}}t^2+O(t^3).\] Therefore \(C_\theta(t,t)/t\to0\), so \(\lambda_L=0\). The Frank family is radially symmetric, meaning \(C_\theta(u,v)=u+v-1+C_\theta(1-u,1-v)\). Applying this identity at \(u=v=1-t\) shows that the upper joint survival probability is \(C_\theta(t,t)\), and hence \(\lambda_U=0\) as well. Zero tail coefficients describe asymptotic corner behavior; they do not force \(C_\theta=uv\) for nonzero \(\theta\).</p>
<p>Kendall's tau is obtained from the Archimedean generator integral used in Lessons 16 and 17. It is monotone in \(\theta\), and calibration normally solves the resulting one-dimensional equation numerically. The explicit conditional inverse above avoids a separate numerical root search during simulation.</p>

<h2 id="simulation-example">A reproducible simulation</h2>
<p>Let us simulate negative association, independence, and positive association with \(\theta=-5,0,5\). Using the same independent uniform inputs in each panel makes the effect of the parameter easier to see. The negative case concentrates pairs toward opposite corners; the positive case concentrates them toward the diagonal.</p>
<p>The code follows the explicit inverse above. NumPy's <code>expm1(x)</code> evaluates \(e^x-1\), and <code>log1p(x)</code> evaluates \(\log(1+x)\), with better accuracy near zero than direct subtraction or addition. The separate zero-parameter branch returns independent uniforms. This short implementation is intended for the moderate parameter values displayed here.</p>
<details class="simulation-code"><summary>Show Python simulation code</summary><div class="code-window"><header>Frank sampler (NumPy)</header><pre><code>import numpy as np

def sample_frank(theta, n, seed=20260922):
    rng = np.random.default_rng(seed)
    u, z = rng.random((2, n))
    if theta == 0:
        return u, z
    a = np.exp(-theta * u)
    w = z * np.expm1(-theta) / (a * (1-z) + z)
    v = -np.log1p(w) / theta
    return u, v

u, v = sample_frank(5, 20_000)
print(np.mean((u &gt; 0.9) &amp; (v &gt; 0.9)))</code></pre></div></details>
<figure class="figure-box"><div class="simulation-panels"><img src="/assets/images/copulas/frank-simulation--5.svg" alt="Frank copula simulation with parameter -5" loading="lazy"><img src="/assets/images/copulas/frank-simulation-0.svg" alt="Frank copula simulation with parameter 0" loading="lazy"><img src="/assets/images/copulas/frank-simulation-5.svg" alt="Frank copula simulation with parameter 5" loading="lazy"></div><figcaption>First 1,500 pairs from 20,000 simulated pairs per panel. Each panel uses the same independent uniform inputs with a different parameter.</figcaption></figure>
<p>For a numerical check, consider \(P(U>0.9,V>0.9)=1-2(0.9)+C(0.9,0.9)\). The table compares this exact probability with the simulated fraction. The Monte Carlo standard error is \(\sqrt{p(1-p)/n}\), using the exact event probability \(p\) and \(n=20{,}000\).</p>
<table><thead><tr><th>Parameter</th><th>Exact probability</th><th>Simulated fraction</th><th>Monte Carlo SE</th></tr></thead><tbody>
<tr><td>-5</td><td>0.00057</td><td>0.00065</td><td>0.00017</td></tr>
<tr><td>0</td><td>0.01000</td><td>0.00935</td><td>0.00070</td></tr>
<tr><td>5</td><td>0.03389</td><td>0.03325</td><td>0.00128</td></tr>
</tbody></table>
<p>At \(\theta=5\), the code prints \(0.03325\), close to the exact value \(0.03389\). The negative parameter makes the joint upper-right event much less frequent than under independence. The positive parameter makes it more frequent even though every finite-parameter Frank copula has zero limiting tail coefficients.</p>
<h2 id="exercises">Exercises</h2>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 18.1</strong><span>Independence limit</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Find the limit of \(C_\theta(u,v)\) as \(\theta\to0\) by expanding the exponentials and logarithm.</p></div><div class="answer-panel"><div class="answer-inner"><p>For fixed \(u,v\), \(e^{-\theta u}-1=-\theta u+O(\theta^2)\), \(e^{-\theta v}-1=-\theta v+O(\theta^2)\), and \(e^{-\theta}-1=-\theta+O(\theta^2)\). Their quotient is \(-\theta uv+O(\theta^2)\). Thus \(\log(1-\theta uv+O(\theta^2))=-\theta uv+O(\theta^2)\), and multiplication by \(-1/\theta\) gives \(C_\theta(u,v)=uv+O(\theta)\to uv\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 18.2</strong><span>Density check</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Why must the density integrate to one?</p></div><div class="answer-panel"><div class="answer-inner"><p>It is the mixed derivative of a copula with uniform marginal distributions. Integrating first in \(u\) and then \(v\) gives \(C(1,1)-C(0,1)-C(1,0)+C(0,0)=1\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 18.3</strong><span>Tail interpretation</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Does zero tail dependence imply independence?</p></div><div class="answer-panel"><div class="answer-inner"><p>No. Every finite-parameter Frank copula has zero tail coefficients, while \(\theta\ne0\) changes the dependence over the interior of the square.</p></div></div></article>
<p><strong>Source trail.</strong> Nelsen (2006), Section 4.2, Table 4.1 and note (4.2.5), printed pp. 116–119, PDF pp. 126–129 (Frank family and radial symmetry); Section 5.1.1, printed pp. 158–164 (Archimedean Kendall formula); Section 2.7, Theorem 2.7.3, printed pp. 37–38, PDF pp. 48–49 (radial-symmetry identity). Mai and Scherer (2017), Section 1.1.3, Algorithm 1.2, printed p. 23, PDF p. 42 (conditional inversion sampling). The density, explicit inverse, independence limit, and diagonal expansion here follow by algebra and differentiation from the cited family formula.</p>
