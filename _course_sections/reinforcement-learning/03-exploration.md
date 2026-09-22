---
title: Exploration and Policy Improvement
permalink: /courses/reinforcement-learning/03-exploration/
date: 2026-09-22
updated: 2026-09-23
course_title: A Brief Introduction to Reinforcement Learning
course_url: /courses/reinforcement-learning/
course_section_style: theory
section_number: 4
section_kind: Policies
summary: Greedy policies, exploration, and the distinction between target and behavior policies.
previous_section:
  title: Value Functions and Bellman Equations
  url: /courses/reinforcement-learning/02-value-functions/
next_section:
  title: Monte Carlo Learning
  url: /courses/reinforcement-learning/03a-monte-carlo/
---

<h2 id="iteration">Indirect RL</h2>
<p>[[Policy iteration]]:</p><ol><li>Evaluate \(V^{\bar\pi}(s)\).</li><li>Improve \(\bar\pi\).</li></ol>
<p>[[Value iteration]]: solve Bellman's optimality equation by the fixed point method. Then find the optimal policy by greedy search.</p>
<p>Policy evaluation and policy improvement are separate steps. When the environment model is unknown, Monte Carlo learning estimates the value functions from sampled episodes. Before describing that procedure, we introduce the policies used to select actions.</p>
<h2 id="greedy">Greedy policies</h2>
<p>[[Greedy policy]]: deterministic, non-exploratory. Choose one maximizer \(a^*\in\operatorname*{argmax}_a Q(s,a)\).</p>
<p>\[\bar\pi^g(a\mid s)=\begin{cases}1,&a=a^*,\\0,&\text{otherwise}.\end{cases}\]</p>
<p>The greedy policy satisfies the policy improvement theorem (PIT).</p>
<details class="supplementary-proof"><summary>Greedy policy improvement</summary><div class="proof-content">
<p>The greedy policy is deterministic, so</p>
<p>\[V^{\bar\pi^g}(s)=Q^{\bar\pi^g}(s,\bar\pi^g(s))\leq\max_aQ^{\bar\pi^g}(s,a).\]</p>
<p>\[\bar\pi^g_{\mathrm{new}}(s)\in\operatorname*{argmax}_aQ^{\bar\pi^g}(s,a),\]</p>
<p>\[\max_aQ^{\bar\pi^g}(s,a)=Q^{\bar\pi^g}(s,\bar\pi^g_{\mathrm{new}}(s)).\]</p>
</div></details>
<p>[[Epsilon-greedy policy]]: \(\epsilon\in[0,1]\) is the exploration rate.</p>
<p>\[\bar\pi^\epsilon(a\mid s)=\begin{cases}1-\epsilon+\dfrac{\epsilon}{|A|},&a=a^*,\\\dfrac{\epsilon}{|A|},&\text{otherwise}.\end{cases}\]</p>
<p>In practice, annealing is done on the \(\epsilon\) parameter. It explores actions by sampling uniformly.</p>
<details class="supplementary-proof"><summary>Boltzmann policy</summary><div class="proof-content"><p>Weights actions by their action value for exploration.</p><p>\[\bar\pi^{\mathrm{br}}(a\mid s)=\frac{\exp(\tau^{-1}Q(s,a))}{\sum_{a'\in A}\exp(\tau^{-1}Q(s,a'))},\qquad\tau&gt;0.\]</p><p>Becomes greedy as \(\tau\to0\) and exploration-only uniform as \(\tau\to\infty\).</p></div></details>
<h2 id="dilemma">Model-free RL dilemma</h2>
<p>[[Exploration-exploitation dilemma]]: aim to learn an optimal policy, but behave non-optimally to explore all potential actions.</p>
<h3 id="on-policy">On-policy</h3>
<p>In [[on-policy learning]], the policy used to generate samples is also the policy being evaluated and improved. A soft greedy policy adds exploration at the cost of optimality.</p>
<p>With an \(\epsilon\)-greedy policy, the greedy action is selected with probability \(1-\epsilon\), and a uniformly sampled action is selected with probability \(\epsilon\). This uniform choice also includes the greedy action, giving it total probability \(1-\epsilon+\epsilon/|A|\).</p>
<p>The value function therefore includes the exploratory actions taken by this policy. Policy improvement changes the policy used to collect the next samples.</p>
<h3 id="off-policy">Off-policy</h3>
<p>[[Off-policy learning]] uses two policies:</p><ul><li>A [[target policy]] \(\bar\pi\), whose value function we estimate. It can be deterministic or stochastic; a greedy target policy pursues optimality.</li><li>A stochastic [[behavior policy]] \(\mu\) to explore the environment and generate samples.</li></ul>
<p>The behavior policy determines the actions taken during sampling. The target policy determines the actions represented in the value function. Samples may come from different behavior policies.</p>
<p>Every action possibly selected by the target policy must be taken at least occasionally by the behavior policy.</p>
<p>For discrete actions, this coverage condition is</p>
<p>\[\bar\pi(a\mid s)&gt;0\quad\Longrightarrow\quad\mu(a\mid s)&gt;0.\]</p>
<p>Importance sampling accounts for the difference between the two policies when estimating expectations. The next section applies this idea to Monte Carlo learning, with the formal change-of-measure identity available in a collapsed derivation.</p>
<div class="problem-grid"><article class="exercise"><header class="exercise-head"><div><strong>Recall</strong><span>Off-policy</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Target policy; behavior policy.</p></div><div class="answer-panel"><div class="answer-inner"><p>Greedy target policy \(\bar\pi\) to pursue optimality. Stochastic behavior policy \(\mu\) to explore the environment.</p></div></div></article></div>
<h2 id="sources">References</h2><p class="course-references">Shengbo Eben Li, <em>Reinforcement Learning for Sequential Decision and Optimal Control</em> (2023), Sections 3.1–3.3.</p>
