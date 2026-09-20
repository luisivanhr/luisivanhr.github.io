---
title: Quadrant Dependence and Concordance Order
permalink: /courses/copulas/21-dependence-order/
course_title: Copulas
course_url: /courses/copulas/
course_section_style: theory
section_number: 21
section_kind: Dependence theory
summary: Compare copulas pointwise and connect positive quadrant dependence to rank measures.
prerequisites: Copula bounds; concordance measures
reading_time: 15 minutes
exercises: 3 complete solutions
previous_section:
  title: "Extreme-Value Copulas"
  url: /courses/copulas/20-extreme-value-copulas/
next_section:
  title: "Workshop: Calibrating Dependence from Ranks"
  url: /courses/copulas/22-calibration-workshop/
date: 2026-01-01
updated: 2026-01-01
---

<section class="intro-strip" id="motivation"><h2>How can one dependence pattern be stronger?</h2><p>A single coefficient cannot retain every feature of a copula. We can compare two entire copula functions instead. Pointwise comparison asks whether every lower-left rectangle anchored at the origin receives at least as much mass under one model as under another. This leads to [[positive quadrant dependence]] and the [[concordance order]]. Nelsen develops these notions in Sections 2.8 and 5.2.1. <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a> The comparison is useful only after the marginal distributions and the meaning of the coordinates have been fixed.</p></section>

<h2 id="pqd">Positive quadrant dependence</h2>
<div class="math-block definition"><span class="block-label">Definition 21.1 <span>Quadrant dependence</span></span><p>Random variables \(X,Y\) are positively quadrant dependent, abbreviated PQD, when</p><p>\[P(X\le x,Y\le y)\ge P(X\le x)P(Y\le y)\quad\text{for every }x,y.\]</p><p>Reverse the inequality for negative quadrant dependence. This is Definition 5.2.1 and equation (5.2.1). <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a></p></div>

<p>The condition concerns all thresholds, not merely one selected event. Write \(F(x)=P(X\le x)\), \(G(y)=P(Y\le y)\), and \(H(x,y)=P(X\le x,Y\le y)\). By inclusion and exclusion, \(P(X>x,Y>y)=1-F(x)-G(y)+H(x,y)\). Consequently the PQD inequality also says that both large values occur together at least as often as under independence at every pair of thresholds. The two versions are equivalent because their difference from the independent benchmark is the same number \(H(x,y)-F(x)G(y)\).</p>

<div class="math-block proposition"><span class="block-label">Proposition 21.2 <span>Copula criterion</span></span><p>If the marginal distributions are continuous and \(C\) is the unique copula of \((X,Y)\), then \((X,Y)\) is PQD exactly when \(C(u,v)\ge uv\) for every \((u,v)\in[0,1]^2\).</p></div>
<div class="math-block proof"><span class="block-label">Proof</span><p>Sklar's representation gives \(H(x,y)=C(F(x),G(y))\); independence with the same marginal distributions gives \(F(x)G(y)\). Thus the threshold inequality becomes \(C(F(x),G(y))\ge F(x)G(y)\). Continuous distribution functions attain every interior value of \([0,1]\), and copulas are continuous, so the inequality extends to every point of the square. The converse follows by substituting \(F(x),G(y)\). This is the equivalence in equation (5.2.4). <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a></p></div>

<p>For example, the FGM family \(C_\theta(u,v)=uv[1+\theta(1-u)(1-v)]\) is PQD for \(\theta\ge0\) and negatively quadrant dependent for \(\theta\le0\), within its valid parameter range \([-1,1]\). Indeed, \(C_\theta(u,v)-uv=\theta uv(1-u)(1-v)\), whose sign is the sign of \(\theta\) in the interior. At \(\theta=0\) the copula is the product copula. This is a complete, pointwise conclusion for that family; inspecting only a plotted diagonal would be insufficient for a general copula.</p>

<h2 id="order">Comparing two copulas</h2>
<div class="math-block definition"><span class="block-label">Definition 21.3 <span>Concordance order</span></span><p>Write \(C_1\preceq C_2\) when \(C_1(u,v)\le C_2(u,v)\) for every \(u,v\). Definition 2.8.1 calls this the concordance ordering. <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a> Recall the Fréchet bounds \(W(u,v)=\max(u+v-1,0)\) and \(M(u,v)=\min(u,v)\) from Lesson 2. They give \(W\preceq C\preceq M\) for every bivariate copula \(C\).</p></div>

<p>It is a partial order. Two surfaces can cross, leaving neither copula above the other everywhere. Example 2.18 gives a concrete crossing: <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a> \(D=(M+W)/2\) and the product copula \(\Pi(u,v)=uv\). At \((1/4,1/4)\), \(D=1/8>1/16=\Pi\). At \((1/4,3/4)\), \(D=1/8&lt;3/16=\Pi\). Both are valid copulas, yet there is no ordering between them.</p>

<div class="math-block proposition"><span class="block-label">Proposition 21.4 <span>An ordered rank measure</span></span><p>If \(C_1\preceq C_2\), then their population Spearman coefficients satisfy \(\rho_S(C_1)\le\rho_S(C_2)\).</p></div>
<div class="math-block proof"><span class="block-label">Proof</span><p>The formula from Lesson 7 is \(\rho_S(C)=12\int_0^1\int_0^1 C(u,v)\,du\,dv-3\). Integrating a pointwise inequality preserves its direction, and the same constant is subtracted on both sides. The integral formula appears in Section 5.1.2. <a class="course-citation" href="#ref-2" aria-label="Reference 2">[2]</a></p></div>

<p>Kendall's coefficient is also nondecreasing under concordance order, as stated in Lemma 1.6(2). <a class="course-citation" href="#ref-3" aria-label="Reference 3">[3]</a> Its proof is subtler than the one above because \(\tau(C)=4\int C\,dC-1\), where \(dC\) means integration under the probability distribution represented by \(C\). Changing \(C\) changes both the integrand and that distribution. The Spearman proof should therefore not be copied verbatim for Kendall's coefficient.</p>

<p>Taking \(C_1=\Pi\) shows that PQD implies nonnegative Spearman and Kendall coefficients. The reverse implication is unavailable from one scalar: a positive integral of \(C-\Pi\) does not require that difference to be nonnegative everywhere. Likewise, equal coefficients do not establish equality of copulas. The order is stronger because it checks the full unit square. Theorem 5.2.2 gathers several nonnegative association consequences of PQD.</p>

<p>For the FGM illustration, the Spearman formula makes this distinction concrete. Subtract independence and integrate: \(\rho_S(C_\theta)=12\theta[\int_0^1u(1-u)du]^2=12\theta(1/6)^2=\theta/3\). Thus the entire valid FGM range \(-1\le\theta\le1\) covers only \(-1/3\le\rho_S\le1/3\). A value such as \(\rho_S=0.2\) corresponds to \(\theta=0.6\) within this family, and its copula is PQD by Proposition 21.2. We can use the coefficient calculation for calibration. The pointwise sign proof gives the dependence conclusion for the fitted FGM model at every pair of thresholds. Neither conclusion claims that an observed finite-sample coefficient alone proves population PQD.</p>

<details class="supplementary-proof" id="proof-kendall-concordance-order"><summary>Proof</summary><div class="proof-content"><p>Take two independent pairs with copulas \(A\) and \(B\), respectively, and let \(Q(A,B)\) be their probability of concordance minus their probability of discordance. Conditioning on the pair with copula \(A\), the rectangle calculation from Lesson 7 gives \(Q(A,B)=4\int B\,dA-1\): the terms involving the two uniform coordinates each have expectation \(1/2\). Interchanging the two pairs leaves the concordance sign unchanged, so \(Q(A,B)=Q(B,A)\). These are the concordance identities in Theorem 5.1.1 and Corollary 5.1.2. <a class="course-citation" href="#ref-4" aria-label="Reference 4">[4]</a></p><p>If \(B_1\le B_2\) pointwise, integration against the probability measure \(dA\) gives \(Q(A,B_1)\le Q(A,B_2)\). Symmetry gives the same monotonicity in the first argument. Hence, when \(C_1\preceq C_2\),</p><p>\[\tau(C_1)=Q(C_1,C_1)\le Q(C_1,C_2)\le Q(C_2,C_2)=\tau(C_2).\]</p><p>This argument integrates against copula probability measures, so it also covers singular copulas.</p></div></details>
<h2 id="exercises">Exercises</h2>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 21.1</strong><span>Upper-right events</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Assume \(X,Y\) are PQD. Prove \(P(X>x,Y>y)\ge P(X>x)P(Y>y)\).</p></div><div class="answer-panel"><div class="answer-inner"><p>Inclusion and exclusion gives \(P(X>x,Y>y)=1-F(x)-G(y)+H(x,y)\). PQD gives \(H(x,y)\ge F(x)G(y)\), so the right side is at least \((1-F(x))(1-G(y))=P(X>x)P(Y>y)\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 21.2</strong><span>A crossing pair</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>For \(D=(M+W)/2\), verify the two comparisons with \(\Pi\) at \((1/4,1/4)\) and \((1/4,3/4)\). What can you conclude about concordance order?</p></div><div class="answer-panel"><div class="answer-inner"><p>At both points \(M=1/4\) and \(W=0\), so \(D=1/8\). The product values are \(1/16\) and \(3/16\), respectively. One comparison points each way; neither \(D\preceq\Pi\) nor \(\Pi\preceq D\) holds.</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 21.3</strong><span>FGM order</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Show that \(C_{\theta_1}\preceq C_{\theta_2}\) for FGM parameters \(-1\le\theta_1\le\theta_2\le1\).</p></div><div class="answer-panel"><div class="answer-inner"><p>Subtract the formulas: \(C_{\theta_2}(u,v)-C_{\theta_1}(u,v)=(\theta_2-\theta_1)uv(1-u)(1-v)\ge0\) on the unit square. This establishes the pointwise order.</p></div></div></article>

<h2 id="references">References</h2><ol class="course-references">
<li id="ref-1">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), §2.8, Definition 2.8.1 and Example 2.18, printed p. 39 (PDF p. 50): concordance order and crossing; §5.2.1, Definition 5.2.1, equations (5.2.1)–(5.2.4), and Theorem 5.2.2, printed pp. 187–188 (PDF pp. 196–197): quadrant dependence and consequences. The FGM inequalities and exercises are course calculations.</li>
<li id="ref-2">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), §5.1.2, printed pp. 167–170: Spearman's integral formula.</li>
<li id="ref-3">Jan-Frederik Mai and Matthias Scherer, <em>Simulating Copulas: Stochastic Models, Sampling Algorithms, and Applications</em>, 2nd ed. (2017), Lemma 1.6(2), printed p. 31 (PDF p. 50): Kendall monotonicity under concordance order.</li>
<li id="ref-4">Roger B. Nelsen, <em>An Introduction to Copulas</em> (2006), §5.1.1, Theorem 5.1.1 and Corollary 5.1.2, printed pp. 159–160 (PDF pp. 168–169): concordance probability \(Q(A,B)\), its symmetry, and its copula integral.</li>
</ol>
