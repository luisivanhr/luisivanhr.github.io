---
title: Marshall-Olkin Copulas
course_title: Copulas
course_url: /courses/copulas/
course_section_style: hybrid
section_number: 19
section_kind: Shock model and singular dependence
summary: Derive the Marshall-Olkin survival copula from independent idiosyncratic and common shocks.
prerequisites: Survival functions, exponential distributions, singular copulas
reading_time: 20 minutes
exercises: 4 exercises
permalink: /courses/copulas/19-marshall-olkin/
previous_section:
  title: "Frank Copulas"
  url: /courses/copulas/18-frank-copulas/
next_section:
  title: "Extreme-Value Copulas"
  url: /courses/copulas/20-extreme-value-copulas/
date: 2026-01-01
updated: 2026-01-01
---

<section class="intro-strip" id="overview"><h2>Dependence from a common shock</h2><p>How can one model two lifetimes that sometimes fail together? Each component can fail alone, or both can fail at the same instant. The [[Marshall-Olkin]] common shock creates a singular component in the copula.</p></section>

<h2 id="model">Three independent shocks</h2>
<p>Let \(Z_1,Z_2,Z_{12}\) be independent exponential shock times with rates \(\lambda_1,\lambda_2,\lambda_{12}>0\). The first shock kills component 1 only, the second kills component 2 only, and the third kills both. Define lifetimes</p>
<p>\[X=\min(Z_1,Z_{12}),\qquad Y=\min(Z_2,Z_{12}).\]</p>
<p>For \(x,y\ge0\), the joint survival function is the probability that \(Z_1>x\), \(Z_2>y\), and \(Z_{12}>\max(x,y)\). Independence gives</p>
<p>\[\overline H(x,y)=P(X>x,Y>y)=\exp\{-\lambda_1x-\lambda_2y-\lambda_{12}\max(x,y)\}.\]</p>
<p>The marginal survival functions are \(\overline F(x)=\exp\{-(\lambda_1+\lambda_{12})x\}\) and \(\overline G(y)=\exp\{-(\lambda_2+\lambda_{12})y\}\). Thus each lifetime is exponential, while the common shock remains visible in the joint survival.</p>

<h2 id="copula">The survival copula</h2>
<p>Put \(u=\overline F(x)\), \(v=\overline G(y)\), and define \(a=\lambda_{12}/(\lambda_1+\lambda_{12})\), \(b=\lambda_{12}/(\lambda_2+\lambda_{12})\). Then \(e^{-\lambda_{12}x}=u^a\) and \(e^{-\lambda_{12}y}=v^b\). Using \(\max(x,y)=x+y-\min(x,y)\), we obtain</p>
<p>\[\overline H(x,y)=u\,v\,\min(u^{-a},v^{-b}).\]</p>
<p>Equivalently, the survival copula is</p>
<p>\[\widehat C_{a,b}(u,v)=\min(u^{1-a}v,\;uv^{1-b}).\]</p>
<p>The common shock places positive probability on the curve \(u^a=v^b\). This is the singular component. Away from that curve, the copula also has an absolutely continuous component. The two components coexist because the idiosyncratic shocks spread mass over regions while the common shock makes \(X\) and \(Y\) fail together.</p>

<h2 id="sampling">Exact shock sampler</h2>
<p>We can also calculate the size of the singular component. Condition on the common shock arriving at time \(s\). Both individual shocks must occur later, so</p>
<p>\[P(X=Y)=\int_0^\infty\lambda_{12}e^{-\lambda_{12}s}e^{-\lambda_1s}e^{-\lambda_2s}\,ds=\frac{\lambda_{12}}{\lambda_1+\lambda_2+\lambda_{12}}=\frac{ab}{a+b-ab}.\]</p>
<p>With all three rates equal to one, the probability is \(1/3\). This gives a direct check on the simulation: the full run of 60,000 pairs places \(0.33613\) of its observations on the common-shock curve. A density over the square alone would miss this part of the probability law.</p>
<p>Simulation requires no numerical copula inversion. Draw the three independent exponential shock times, then take the two minima defining \(X,Y\). If uniform copula coordinates are required, transform with \(U=\overline F(X)\) and \(V=\overline G(Y)\) in the survival convention. A draw with \(Z_{12}&lt;Z_1,Z_2\) lies on the simultaneous-failure curve and displays the singular mass directly.</p>
<figure class="figure-box"><img src="/assets/images/copulas/marshall-olkin-simulation.svg" alt="Marshall-Olkin shock simulation"><figcaption>Shock-based Marshall-Olkin simulation with rates \(\lambda_1=\lambda_2=\lambda_{12}=1\). The common-shock draws lie on the singular component after survival transformation.</figcaption></figure>

<h2 id="exercises">Exercises</h2>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 19.1</strong><span>Joint survival.</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Derive \(P(X>x,Y>y)\) from the three shock times.</p></div><div class="answer-panel"><div class="answer-inner"><p>The event is \(\{Z_1>x,Z_2>y,Z_{12}>\max(x,y)\}\). Independence of the shocks gives \(\exp(-\lambda_1x)\exp(-\lambda_2y)\exp(-\lambda_{12}\max(x,y))\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 19.2</strong><span>Marginal survival.</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Find the marginal distribution of \(X\).</p></div><div class="answer-panel"><div class="answer-inner"><p>\(X=\min(Z_1,Z_{12})\), so \(P(X>x)=P(Z_1>x)P(Z_{12}>x)=\exp[-(\lambda_1+\lambda_{12})x]\). Thus \(X\) is exponential with rate \(\lambda_1+\lambda_{12}\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 19.3</strong><span>Singular event.</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>What event produces simultaneous failure?</p></div><div class="answer-panel"><div class="answer-inner"><p>The event is \(Z_{12}&lt;Z_1\) and \(Z_{12}&lt;Z_2\). Then \(X=Y=Z_{12}\), which maps to the curve \(u^a=v^b\) after the survival transformation.</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 19.4</strong><span>Equal rates.</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>For \(\lambda_1=\lambda_2=\lambda_{12}=1\), find \(a,b\) and the marginal rates.</p></div><div class="answer-panel"><div class="answer-inner"><p>\(a=b=1/2\). Both marginal lifetimes are exponential with rate \(1+1=2\).</p></div></div></article>

<p class="source-note">Source: Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), §3.1.1, printed pp. 52–54, PDF pp. 62–64, equations (3.1.1)–(3.1.3), and the discussion of the singular component; Jan-Frederik Mai and Matthias Scherer, <em>Financial Engineering with Copulas Explained</em> (2014), §4.3.1, printed pp. 66–69, PDF pp. 83–86.</p>
