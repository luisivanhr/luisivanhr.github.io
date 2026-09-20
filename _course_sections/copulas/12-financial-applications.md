---
title: Financial Applications and Dependence Uncertainty
permalink: /courses/copulas/12-financial-applications/
course_title: Copulas
course_url: /courses/copulas/
course_section_style: hybrid
section_number: 12
section_kind: Applications and simulation
summary: Use copulas to simulate joint defaults and portfolio losses, then see how dependence assumptions change risk conclusions.
prerequisites: Sklar's theorem; copula simulation; joint probabilities
reading_time: 16 minutes
exercises: 3 worked exercises
subsections:
  - title: Joint events
    url: /courses/copulas/12-financial-applications/#joint-events
  - title: Simulated portfolio loss
    url: /courses/copulas/12-financial-applications/#simulation
  - title: Dependence uncertainty
    url: /courses/copulas/12-financial-applications/#uncertainty
  - title: Exercises
    url: /courses/copulas/12-financial-applications/#exercises
previous_section:
  title: "Estimation and Bayesian Updating"
  url: /courses/copulas/11-estimation-and-bayes/
next_section:
  title: "Workshop: From Observations to an Empirical Copula"
  url: /courses/copulas/13-empirical-workshop/
date: 2026-01-01
updated: 2026-01-01
---

<section class="intro-strip" id="joint-events"><h2>Joint events</h2><p>A lender can estimate each borrower's probability of default over a fixed year yet still face a different question: how often will both default? The answer depends on their joint distribution. Mai and Scherer introduce default-time modeling in Section 1.1.2 and the survival form of Sklar's theorem in Section 1.2.2. Their Chapter 7 studies what can be concluded when marginal distributions are known but dependence is uncertain. Shemyakin and Kniazev give a three-loan motivation in Section 5.7. <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a> <a class="course-citation" href="#ref-2" aria-label="Reference 2">[2]</a></p></section>

<p>Let \(D_1,D_2\) indicate default by the chosen horizon: each is one for default and zero otherwise. We use \(\Pr\) for probability. Write \(p=\Pr(D_1=1)\), \(q=\Pr(D_2=1)\), and \(r=\Pr(D_1=D_2=1)\). The two marginal probabilities alone leave \(r\) undetermined. Basic probability gives a sharp range: the joint event is contained in each individual event, so \(r\leq\min(p,q)\). Also \(\Pr(D_1=1\text{ or }D_2=1)=p+q-r\leq1\), so \(r\geq p+q-1\). Of course \(r\geq0\).</p>

<div class="math-block proposition"><span class="block-label">Proposition 12.1 <span>[[Joint default bounds]]</span></span><p>For any pair of default indicators, \[\max(0,p+q-1)\leq r\leq\min(p,q).\] Both endpoints can be attained by suitable dependence arrangements. These are the event-level Fréchet bounds underlying the joint-default analysis in Mai and Scherer, Sections 2.1 and 7.2. <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a></p></div>
<div class="math-block proof"><span class="block-label">Proof and constructions</span><p>The inequalities follow from the containment and union arguments above. To attain the upper endpoint, take a uniform \(U\) and set \(D_1=\mathbf 1\{U\leq p\}\), \(D_2=\mathbf 1\{U\leq q\}\). Then both default exactly when \(U\leq\min(p,q)\). For the lower endpoint, keep \(D_1=\mathbf 1\{U\leq p\}\) but set \(D_2=\mathbf 1\{U>1-q\}\). Their intervals overlap in length \(\max(0,p+q-1)\). The constructions preserve the required marginal probabilities.</p></div>

<p>The uniform-variable constructions are copula constructions in miniature. Shared \(U\) produces the upper Fréchet copula \(M(u,v)=\min(u,v)\). Pairing \(U\) with \(1-U\) produces the bivariate lower Fréchet copula \(W(u,v)=\max(u+v-1,0)\). Independent uniforms produce \(\Pi(u,v)=uv\), hence \(r=pq\). These are three coherent dependence scenarios. Because default indicators are discrete, their copula representation is not unique outside the marginal ranges; the event probabilities remain well defined. State the modeled events and horizon before naming a copula.</p>

<h2 id="simulation">Simulated portfolio loss</h2>
<p>Suppose each of two loans loses one unit if it defaults, and both have one-year default probability \(0.1\). Set \(L=D_1+D_2\). This is an author-created numerical illustration of the loss aggregation and simulation framework in Mai and Scherer, Sections 5.1 and 7.1. A simulated draw starts with a pair \((U,V)\) from the selected copula, converts it to defaults with \(D_1=\mathbf1\{U\leq0.1\}\) and \(D_2=\mathbf1\{V\leq0.1\}\), and adds the indicators. Repeating the draw approximates the distribution of \(L\). <a class="course-citation" href="#ref-1" aria-label="Reference 1">[1]</a></p>

<div class="math-block proposition"><span class="block-label">Proposition 12.2 <span>Two-loan loss distribution</span></span><p>For equal marginal default probability \(p\) and joint default probability \(r\), \[\Pr(L=2)=r,\qquad \Pr(L=1)=2p-2r,\qquad \Pr(L=0)=1-2p+r.\]</p></div>
<div class="math-block proof"><span class="block-label">Proof</span><p>The first probability is the definition of \(r\). Exactly one default has probability \(\Pr(D_1=1,D_2=0)+\Pr(D_1=0,D_2=1)=(p-r)+(p-r)\). The remaining mass gives the zero-default probability. All three are nonnegative precisely when \(\max(0,2p-1)\leq r\leq p\).</p></div>

<p>At \(p=0.1\), the independent scenario has \(r=0.01\), yielding probabilities \((0.81,0.18,0.01)\) for losses \((0,1,2)\). The shared-uniform scenario has \(r=0.1\), yielding \((0.9,0,0.1)\). The opposing-uniform scenario has \(r=0\), yielding \((0.8,0.2,0)\). All three portfolios have the same expected loss, \(E[L]=0.2\), because expectation adds regardless of dependence. Their loss distributions and probabilities of two simultaneous defaults differ sharply.</p>

<p>For a confidence level \(0&lt;\alpha&lt;1\), define the Value at Risk by the quantile convention \(\mathrm{VaR}_{\alpha}(L)=\inf\{\ell:\Pr(L\leq\ell)\geq\alpha\}\). Here \(\ell\) is a possible loss threshold, and \(\mathrm{VaR}_\alpha(L)\) is the smallest threshold whose cumulative probability reaches \(\alpha\). At \(\alpha=0.95\), the independent and opposing-uniform scenarios have value one; the shared-uniform scenario has value two. The mean alone misses this distinction. Mai and Scherer, Section 7.1, use a strict inequality version of the quantile definition to handle optimization at discontinuities. When losses are discrete, equality at a probability jump can change a reported boundary quantile, so a risk report must state its convention. The \(0.95\) values here avoid that boundary ambiguity.</p>

<div class="code-window"><header>Simulation recipe</header><pre><code>for each repetition:
    (u, v) = draw_from_chosen_copula()
    loss = int(u &lt;= 0.1) + int(v &lt;= 0.1)
    record(loss)
estimate each loss probability by its recorded frequency</code></pre></div>

<p>This recipe checks an implementation: empirical frequencies should approach the probabilities above when the corresponding copula is used. In a realistic portfolio, default probabilities and loss amounts vary across loans, and the copula may be estimated. Simulation still follows the same sequence: draw dependent uniforms, transform through the marginal distributions, compute the portfolio outcome, then summarize it. Section 5.1 of Mai and Scherer develops copula simulation, and Section 7.1 discusses simulated aggregate-loss quantiles.</p>

<p>For a portfolio of many loans, the same draw produces a vector \((U_1,\ldots,U_d)\). Loan \(j\) defaults when \(U_j\leq p_j\), and a fixed loss amount \(a_j\) gives simulated total \(L=\sum_j a_j\mathbf1\{U_j\leq p_j\}\). The formula is simple, but the dependence model must be a valid \(d\)-copula. Pairwise correlations chosen separately may fail to form a valid Gaussian correlation matrix, and a bivariate Archimedean generator may fail in higher dimensions. Lesson 9's construction conditions therefore matter directly for financial simulation. Once a valid model is specified, empirical averages estimate expected loss and the sorted loss draws estimate quantiles. The two-loan exact calculation above is a useful benchmark before scaling up.</p>

<figure class="figure-box"><img src="/assets/images/copulas/default-loss.svg" alt="Grouped bars for zero, one and two defaults under opposing, independent and shared uniforms."><figcaption>All three scenarios have expected loss 0.2. Their probabilities of two defaults are 0, 0.01, and 0.1.</figcaption></figure>
<p>The optional <a href="/courses/copulas/09a-common-factor-workshop/">common-factor workshop</a> carries out a twenty-loan count calculation and compares simulation with a conditional-binomial integral.</p>
<h2 id="uncertainty">Dependence uncertainty</h2>
<p>Choosing a family and parameter gives a model of dependence. A small history may not determine either reliably. Mai and Scherer, Chapter 7, explicitly frame this as dependence uncertainty. Moving a parameter to the edge of one family need not find the greatest portfolio risk over every admissible joint distribution. The event bound concerns one joint event, for which the Fréchet endpoints are exact. A quantile of a sum has a different objective, and the optimizing dependence can be more intricate.</p>

<p>For default times, distinguish the distribution copula from the survival copula. If \(T_1,T_2\) are times to default and \(S_j(t)=\Pr(T_j>t)\), a survival copula \(\widehat C\) joins probabilities of surviving beyond thresholds: \(\Pr(T_1>t_1,T_2>t_2)=\widehat C(S_1(t_1),S_2(t_2))\). The probability that both have defaulted by \(t\) instead comes from the joint distribution of \((T_1,T_2)\). Section 1.2.2 of Mai and Scherer gives the survival version of Sklar's theorem. Keeping the two events distinct prevents a mistaken switch between joint survival and joint default.</p>

<h2 id="exercises">Exercises</h2>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 12.1</strong><span>Bounds with unequal marginal distributions</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Two one-year default probabilities are \(p=0.2\) and \(q=0.35\). Give the sharp bounds for joint default and the independent value.</p></div><div class="answer-panel"><div class="answer-inner"><p>The lower bound is \(\max(0,0.2+0.35-1)=0\), and the upper bound is \(\min(0.2,0.35)=0.2\). Under independence, \(r=pq=0.07\). The uniform interval constructions in Proposition 12.1 attain the endpoints.</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 12.2</strong><span>Loss probabilities</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>With \(p=0.1\) for each loan and \(r=0.04\), compute the probabilities of zero, one, and two losses. Check the expected loss.</p></div><div class="answer-panel"><div class="answer-inner"><p>Proposition 12.2 gives \(\Pr(L=0)=1-0.2+0.04=0.84\), \(\Pr(L=1)=0.2-0.08=0.12\), and \(\Pr(L=2)=0.04\). They sum to one. The mean is \(0(0.84)+1(0.12)+2(0.04)=0.20\), equal to \(p+p\).</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Exercise 12.3</strong><span>Read a survival statement</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>At a fixed horizon, each of two borrowers survives with probability \(0.9\), and both survive with probability \(0.84\). What is the probability both default? What is the probability at least one defaults?</p></div><div class="answer-panel"><div class="answer-inner"><p>Each default probability is \(0.1\). Inclusion-exclusion gives \(\Pr(\text{both default})=1-0.9-0.9+0.84=0.04\). The event at least one defaults is the complement of both surviving, so its probability is \(1-0.84=0.16\).</p></div></div></article>
<div id="source-note"></div>
<h2 id="references">References</h2>
<ol class="course-references">
<li id="ref-1">Jan-Frederik Mai and Matthias Scherer, <em>Financial Engineering with Copulas Explained</em> (2014), Sections 1.1.2, 1.2.2, 2.1, 5.1, 7.1, and 7.2, default times, survival copulas, dependence bounds, simulation, and dependence uncertainty; printed pp. 6, 11–12, 19–21, 78–83, 105–112, and 112–116, respectively.</li>
<li id="ref-2">Arkady Shemyakin and Alexander Kniazev, <em>Introduction to Bayesian Estimation and Copula Models of Dependence</em> (2017), Section 5.7, three-loan motivation, printed pp. 186–192.</li>
</ol>
<p>The two-loan numbers and the three exercises are original illustrations of the sourced framework.</p>
