---
title: Exploration and Policy Improvement
permalink: /courses/reinforcement-learning/03-exploration/
date: 2026-09-22
updated: 2026-09-25
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

<h2 id="classification">Classification in literature and my own take.</h2>
<p>Classification in literature follows a top-down approach. The problem I see is that</p>
<ul><li>It does not reflect the intuition for choosing a suitable strategy.</li><li>In many cases there are a lot of grey areas where models cannot be classified uniquely. <a href="https://spinningup.openai.com/en/latest/spinningup/rl_intro2.html">Spinning Up: Kinds of RL Algorithms</a> discusses the limitations of this classification.</li></ul>
<p>I find it better to ask ourselves two questions:</p>
<p><strong>Question 1</strong></p>
<p>Do I have a model for the environment?</p>
<details class="supplementary-proof"><summary>Answer</summary><div class="proof-content"><p><strong>Yes:</strong> optimize for \(V^{\bar\pi}(s)\). <strong>No:</strong> optimize for \(Q^{\bar\pi}(s,a)\).</p><p>Here \(\bar\pi\) is the policy, \(s\) a state, and \(a\) an action. \(V^{\bar\pi}\) is the state-value function and \(Q^{\bar\pi}\) the action-value function.</p></div></details>
<p><strong>Question 2</strong></p>
<p>Am I sampling the actions from the current policy?</p>
<details class="supplementary-proof"><summary>Answer</summary><div class="proof-content"><p><strong>Yes:</strong> on-policy. <strong>No:</strong> off-policy.</p></div></details>
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
<div class="problem-grid">
<article class="exercise" style="grid-column: 1 / -1;"><header class="exercise-head"><div><strong>Exercise 4.1</strong><span>Epsilon-greedy policy improvement</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Consider a discounted Markov decision process with finite nonempty state set \(S\) and finite nonempty action set \(A\), transition probabilities \(P(s'\mid s,a)\), and expected one-step rewards \(r(s,a)\) satisfying \(|r(s,a)|\leq R_{\max}&lt;\infty\). Let \(0\leq\gamma&lt;1\) and \(0\leq\epsilon\leq1\). A policy \(\pi\) is \(\epsilon\)-soft if \(\pi(a\mid s)\geq\epsilon/|A|\) for every \(s\) and \(a\). Define \(Q^\pi(s,a)\) as the expected discounted return after choosing \(a\) in \(s\) and following \(\pi\) thereafter, and \(V^\pi(s)=\sum_a\pi(a\mid s)Q^\pi(s,a)\). At each state choose one action \(a^\ast(s)\in\arg\max_{a\in A}Q^\pi(s,a)\), and define \(\pi'\) by assigning probability \(1-\epsilon+\epsilon/|A|\) to \(a^\ast(s)\) and \(\epsilon/|A|\) to every other action. Prove that \(\pi'\) is \(\epsilon\)-soft and \(V^{\pi'}(s)\geq V^\pi(s)\) for every state.</p></div><div class="answer-panel"><div class="answer-inner"><p>The probabilities defining \(\pi'\) sum to \(1-\epsilon+|A|(\epsilon/|A|)=1\), and each is at least \(\epsilon/|A|\). Thus \(\pi'\) is \(\epsilon\)-soft, including the endpoint \(\epsilon=1\).</p><p>Fix a state \(s\), write \(m=|A|\), and let \(\overline Q=m^{-1}\sum_{a\in A}Q^\pi(s,a)\). The value of \(\pi'\) against \(Q^\pi\) is \((1-\epsilon)Q^\pi(s,a^\ast(s))+\epsilon\overline Q\). If \(\epsilon&lt;1\), the numbers \(\nu(a\mid s)=(\pi(a\mid s)-\epsilon/m)/(1-\epsilon)\) are nonnegative and sum to one. Therefore \(\sum_a\pi(a\mid s)Q^\pi(s,a)=\epsilon\overline Q+(1-\epsilon)\sum_a\nu(a\mid s)Q^\pi(s,a)\leq\epsilon\overline Q+(1-\epsilon)\max_aQ^\pi(s,a)\). This is exactly \(\sum_a\pi'(a\mid s)Q^\pi(s,a)\). If \(\epsilon=1\), the only \(\epsilon\)-soft policy is uniform, and \(\pi'\) is uniform too, so the same inequality holds with equality.</p><p>For a policy \(\eta\), let \(T_\eta v(s)=\sum_a\eta(a\mid s)[r(s,a)+\gamma\sum_{s'}P(s'\mid s,a)v(s')]\) be its Bellman operator. Since \(Q^\pi(s,a)=r(s,a)+\gamma\sum_{s'}P(s'\mid s,a)V^\pi(s')\), the inequality just proved says \(T_{\pi'}V^\pi\geq V^\pi\) pointwise. The operator \(T_{\pi'}\) preserves pointwise order and is a contraction with factor \(\gamma\) in the supremum norm. Iterating gives \(V^\pi\leq T_{\pi'}V^\pi\leq T_{\pi'}^2V^\pi\leq\cdots\), and the iterates converge to the unique fixed point \(V^{\pi'}\). Bounded rewards and \(\gamma&lt;1\) ensure these values are finite. Hence \(V^{\pi'}(s)\geq V^\pi(s)\) for every \(s\).</p></div></div></article>
</div>
<h2 id="sources">References</h2><p class="course-references">Shengbo Eben Li, <em>Reinforcement Learning for Sequential Decision and Optimal Control</em> (2023), Sections 3.1–3.3.</p>
