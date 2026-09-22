---
title: Value Functions and Bellman Equations
permalink: /courses/reinforcement-learning/02-value-functions/
date: 2026-09-22
updated: 2026-09-23
course_title: A Brief Introduction to Reinforcement Learning
course_url: /courses/reinforcement-learning/
course_section_style: theory
section_number: 3
section_kind: Value functions
summary: State values, action values, and policy improvement.
previous_section:
  title: Key Concepts
  url: /courses/reinforcement-learning/01-key-concepts/
next_section:
  title: Exploration and Policy Improvement
  url: /courses/reinforcement-learning/03-exploration/
---

<h2 id="value-functions">Value functions</h2>
<p>On-policy [[value function]]: start at \(s\) and follow \(\bar\pi\).</p>
<p>\[V^{\bar\pi}(s)=\mathbb E_{\tau\sim\bar\pi}[R(\tau)\mid s_0=s].\]</p>
<p>On-policy [[action-value function]]: start at \(s\) and do \(a\), then follow \(\bar\pi\). The first action might not come from the policy.</p>
<p>\[Q^{\bar\pi}(s,a)=\mathbb E[R(\tau)\mid s_0=s,a_0=a;\ \bar\pi\text{ thereafter}].\]</p>
<p>Optimal value function; optimal action-value function:</p>
<p>\[V^*(s)=\max_{\bar\pi}V^{\bar\pi}(s),\qquad Q^*(s,a)=\max_{\bar\pi}Q^{\bar\pi}(s,a).\]</p>
<p>For the discounted equations below, assume bounded rewards and \(0\le\gamma&lt;1\); take finite state and action spaces for the optimal-policy statements.</p>
<h2 id="consistency">Consistency equations</h2>
<p>\[V^{\bar\pi}(s)=\mathbb E_{a\sim\bar\pi(\cdot\mid s)}[Q^{\bar\pi}(s,a)],\qquad V^*(s)=\max_a Q^*(s,a).\]</p>
<details class="supplementary-proof"><summary>Proof of the first consistency equation</summary><div class="proof-content">
<p>Let \(\mathcal F_0=\sigma(s_0)\), \(\mathcal G_0=\sigma(s_0,a_0)\). Then \(\mathcal F_0\subset\mathcal G_0\), and</p>
<p>\[\begin{aligned}\mathbb E[R(\tau)\mid\mathcal F_0]&=\mathbb E[\mathbb E[R(\tau)\mid\mathcal G_0]\mid\mathcal F_0]\\&=\mathbb E[Q^{\bar\pi}(s_0,a_0)\mid\mathcal F_0].\end{aligned}\]</p>
<p>By the definition of the policy, \(P(a_0\in da\mid s_0=s)=\bar\pi(da\mid s)\). Thus</p>
<p>\[V^{\bar\pi}(s)=\int_A Q^{\bar\pi}(s,a)\bar\pi(da\mid s)=\mathbb E_{a\sim\bar\pi(\cdot\mid s)}[Q^{\bar\pi}(s,a)].\]</p>
</div></details>
<h3 id="optimal-action">Optimal Q-function and optimal action</h3>
<details class="supplementary-proof"><summary>Proof: \(V^*(s)=\max_a Q^*(s,a)\)</summary><div class="proof-content">
<p>\[V^{\bar\pi}(s)=\mathbb E_{a\sim\bar\pi(\cdot\mid s)}[Q^{\bar\pi}(s,a)]\]</p>
<p>and \(Q^{\bar\pi}(s,a)\leq Q^*(s,a)\quad\forall a\) by defn.</p>
<p>\[V^{\bar\pi}(s)\leq\max_a Q^*(s,a)\quad\Longrightarrow\quad\max_{\bar\pi}V^{\bar\pi}(s)\leq\max_a Q^*(s,a).\]</p>
<p>Now choose \(a^*\in\operatorname*{argmax}_a Q^*(s,a)\).</p>
<p>Consider a path \(\tau_0=(s,a^*,s_1,a_1,\ldots)\) where \(a_i,s_i\) follow \(\bar\pi^*\) for \(i\geq1\). The expected return is \(Q^*(s,a^*)=\max_a Q^*(s,a)\), but \(V^*(s)\) is the best return over all possible strategies, so</p>
<p>\[V^*(s)\geq Q^*(s,a^*)=\max_a Q^*(s,a).\]</p>
<p>\[\therefore\quad V^*(s)=\max_a Q^*(s,a).\]</p>
</div></details>
<p>\[a^*(s)\in\operatorname*{argmax}_a Q^*(s,a).\]</p>
<p>There could be many maximizers. If there are multiple optima, an optimal policy may randomly select any of them, but there is always an optimal policy which deterministically selects an action.</p>
<h2 id="bellman">Bellman equations</h2>
<p>The value at a state is the expected reward there plus the value wherever we land next:</p>
<div class="math-block theorem"><span class="block-label">[[Bellman equations]]</span>
<p>\[V^{\bar\pi}(s)=\mathbb E_{a\sim\bar\pi(\cdot\mid s),\ s'\sim P(\cdot\mid s,a)}[r(s,a,s')+\gamma V^{\bar\pi}(s')].\]</p>
<p>\[Q^{\bar\pi}(s,a)=\mathbb E_{s'\sim P(\cdot\mid s,a)}\left[r(s,a,s')+\gamma\mathbb E_{a'\sim\bar\pi(\cdot\mid s')}[Q^{\bar\pi}(s',a')]\right].\]</p></div>
<p>Notice that the inner expectation is \(V^{\bar\pi}(s')\). And for the optimal value functions:</p>
<p>\[V^*(s)=\max_a\mathbb E_{s'\sim P(\cdot\mid s,a)}[r(s,a,s')+\gamma V^*(s')],\]</p>
<p>\[Q^*(s,a)=\mathbb E_{s'\sim P(\cdot\mid s,a)}\left[r(s,a,s')+\gamma\max_{a'}Q^*(s',a')\right].\]</p>
<h2 id="advantage">Advantage functions</h2>
<p>Tell the relative advantage of an action. Sometimes telling how good an action is absolutely is not necessary.</p>
<p>\[A^{\bar\pi}(s,a)=Q^{\bar\pi}(s,a)-V^{\bar\pi}(s)\]</p>
<p>is called the [[advantage]] of an action.</p>
<h2 id="improvement">Policy improvement</h2>
<p>Let \(\bar\pi,\widehat\pi\) be two policies and \(V^{\bar\pi},V^{\widehat\pi}\) their respective value functions. Then</p>
<p>\[\bar\pi\le\widehat\pi\quad\Longleftrightarrow\quad V^{\bar\pi}(s)\le V^{\widehat\pi}(s)\quad\forall s\in S.\]</p>
<div class="math-block theorem"><span class="block-label">[[Policy improvement theorem]]</span><p>Let \(\bar\pi\) be the current policy and \(\widehat\pi\) a new policy. Then \(\bar\pi\le\widehat\pi\) if</p><p>\[V^{\bar\pi}(s)\le\mathbb E_{a\sim\widehat\pi(\cdot\mid s)}[Q^{\bar\pi}(s,a)]\quad\forall s\in S.\]</p></div>
<p>The original inequality evaluates one step under \(\widehat\pi\) but then assumes a return to \(\bar\pi\). Repeated substitution shows \(\widehat\pi\) for multiple steps is no worse.</p>
<details class="supplementary-proof"><summary>Proof: contraction and policy improvement</summary><div class="proof-content">
<p>For a policy \(\bar\pi\), define Bellman's operator as</p>
<p>\[(T^{\bar\pi}V)(s)=\mathbb E_{a\sim\bar\pi(\cdot\mid s),\ s'\sim P(\cdot\mid s,a)}[r(s,a,s')+\gamma V(s')].\]</p>
<p>Let \(V,W:S\to\mathbb R\) be bounded. Consider their supremum norm, \(\|V-W\|_\infty=\sup_{s\in S}|V(s)-W(s)|\). For every \(s\in S\),</p>
<p>\[|(T^{\bar\pi}V)(s)-(T^{\bar\pi}W)(s)|\le\gamma\mathbb E[|V(s')-W(s')|]\le\gamma\|V-W\|_\infty.\]</p>
<p>Since \(0\le\gamma&lt;1\), \(T^{\bar\pi}\) is a contraction.</p>
<p>For any bounded initial function \(V\),</p>
<p>\[\lim_{n\to\infty}(T^{\bar\pi})^nV=V^{\bar\pi}\quad\text{in the }\|\cdot\|_\infty\text{ norm},\]</p>
<p>where \(T^{\bar\pi}V^{\bar\pi}=V^{\bar\pi}\).</p>
<p>From the Bellman equation for \(Q^{\bar\pi}\),</p>
<p>\[\mathbb E_{a\sim\widehat\pi(\cdot\mid s)}[Q^{\bar\pi}(s,a)]=(T^{\widehat\pi}V^{\bar\pi})(s).\]</p>
<p>Then we can write the hypothesis as \(V^{\bar\pi}\le T^{\widehat\pi}V^{\bar\pi}\). By the monotonicity of expectation and \(\gamma\ge0\), \(V\le W\) implies \(T^{\widehat\pi}V\le T^{\widehat\pi}W\). Apply Bellman's operator repeatedly:</p>
<p>\[V^{\bar\pi}\le T^{\widehat\pi}V^{\bar\pi}\le(T^{\widehat\pi})^2V^{\bar\pi}\le\cdots\le(T^{\widehat\pi})^nV^{\bar\pi}.\]</p>
<p>By Banach's fixed point theorem, it has a unique fixed point \(V^{\widehat\pi}\). Taking the limit, we get \(V^{\bar\pi}(s)\le V^{\widehat\pi}(s)\) for every \(s\in S\).</p>
</div></details>
<div class="problem-grid"><article class="exercise"><header class="exercise-head"><div><strong>Recall</strong><span>Advantage functions</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>The relative advantage of an action.</p></div><div class="answer-panel"><div class="answer-inner"><p>\[A^{\bar\pi}(s,a)=Q^{\bar\pi}(s,a)-V^{\bar\pi}(s).\]</p></div></div></article></div>
<h2 id="sources">References</h2><p class="course-references">Shengbo Eben Li, <em>Reinforcement Learning for Sequential Decision and Optimal Control</em> (2023), Chapter 2.</p>
