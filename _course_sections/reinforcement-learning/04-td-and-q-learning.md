---
title: TD Error and Q-learning
permalink: /courses/reinforcement-learning/04-td-and-q-learning/
date: 2026-09-22
updated: 2026-09-23
course_title: A Brief Introduction to Reinforcement Learning
course_url: /courses/reinforcement-learning/
course_section_style: theory
section_number: 6
section_kind: Learning from transitions
summary: TD policy evaluation, one-step TD error, Q-learning, and Expected SARSA.
previous_section:
  title: Monte Carlo Learning
  url: /courses/reinforcement-learning/03a-monte-carlo/
next_section:
  title: Policy Gradients
  url: /courses/reinforcement-learning/05-policy-gradients/
---

<h2 id="td">TD policy evaluation</h2>
<p>It is based on bootstrapping historical samples.</p>
<p>Here \(\alpha\) is the step size. At a terminal state, the bootstrap value is zero.</p>
<p>Starting from the Monte Carlo update:</p>
<p>\[V(s)\leftarrow(1-\alpha)V(s)+\alpha R(\tau)=V(s)+\alpha(R(\tau)-V(s)).\]</p>
<p>Using the self-consistency condition on \(R(\tau)\),</p>
<p>\[V(s)\leftarrow V(s)+\alpha\bigl(r(s,a,s')+\gamma V(s')-V(s)\bigr).\]</p>
<p>This is the [[TD(0)]] algorithm.</p>
<p>The Monte Carlo update uses the sampled return of an episode. The TD update uses the immediate reward and the current estimate \(V(s')\) for the next state. This use of an existing value estimate is bootstrapping.</p>
<div class="math-block theorem"><span class="block-label">One-step [[TD error]]</span><p>\[\delta_t:=r_t+\gamma V(s_{t+1})-V(s_t).\]</p><p>\[V(s_t)\leftarrow V(s_t)+\alpha\delta_t.\]</p></div>
<p>Then policy is optimized using the policy improvement theorem. Can be on-policy (greedy, \(\epsilon\)-greedy, etc.) or off-policy.</p>
<details class="supplementary-proof"><summary>Off-policy evaluation and importance sampling</summary><div class="proof-content">
<p>Consider two-step trajectories. The probabilities to generate them under \(\bar\pi\) and \(\mu\) are</p>
<p>\[P^{\bar\pi}(s',a\mid s)=\bar\pi(a\mid s)P(s'\mid s,a),\qquad P^\mu(s',a\mid s)=\mu(a\mid s)P(s'\mid s,a).\]</p>
<p>Their importance-sampling ratio is \(\rho_{t:t}=\bar\pi(a\mid s)/\mu(a\mid s)\), assuming the behavior policy covers the target policy. Then, if actions are sampled from \(\mu\),</p>
<p>\[\mathbb E_{\bar\pi}[r(s,a,s')\mid s]=\mathbb E_\mu[\rho_{t:t}r(s,a,s')\mid s],\]</p>
<p>\[\mathbb E_{\bar\pi}[V^{\bar\pi}(s')\mid s]=\mathbb E_\mu[\rho_{t:t}V^{\bar\pi}(s')\mid s].\]</p>
<p>The TD evaluation becomes</p>
<p>\[V(s)\leftarrow V(s)+\alpha\bigl(\rho_{t:t}(r+\gamma V(s'))-V(s)\bigr).\]</p>
<p>This method introduces large variance. A method to deal with this:</p>
<p>\[V(s)\leftarrow V(s)+\alpha\rho_{t:t}\bigl(r+\gamma V(s')-V(s)\bigr).\]</p>
<p>It follows from \(\mathbb E_\mu[\rho_{t:t}V(s)\mid s]=V(s)\).</p>
</div></details>
<h2 id="q-learning">Off-policy TD: Q-learning</h2>
<div class="math-block theorem"><span class="block-label">[[Q-learning]]</span><p>\[Q(s_t,a_t)\leftarrow Q(s_t,a_t)+\alpha\left(r_t+\gamma\max_a Q(s_{t+1},a)-Q(s_t,a_t)\right).\]</p></div>
<p>Can be broken down into a one-step TD policy evaluation and a greedy policy search.</p>
<p>\[Q(s_t,a_t)\leftarrow Q(s_t,a_t)+\alpha\left(r_t+\gamma Q(s_{t+1},\bar\pi^g(s_{t+1}))-Q(s_t,a_t)\right),\]</p>
<p>\[\bar\pi^g(s)\in\operatorname*{argmax}_a Q(s,a),\qquad s\in S.\]</p>
<p>Q-learning is a one-step off-policy TD method that does not depend on an importance-sampling transformation.</p>
<p>The behavior policy selects \(a_t\), producing the observed reward \(r_t\) and next state \(s_{t+1}\). The update uses a greedy action at that next state, through \(\max_a Q(s_{t+1},a)\). The action the behavior policy actually takes next need not be greedy.</p>
<details class="supplementary-proof"><summary>Proof of the target identity</summary><div class="proof-content">
<p>Let \((s,a)\in S\times A\) and let \(K(ds',dr\mid s,a)\) be the transition-reward kernel. Let \(\bar\pi^g\) be greedy with respect to \(Q\). Define</p>
<p>\[\nu(ds',dr,da')=K(ds',dr\mid s,a)\mu(da'\mid s'),\]</p>
<p>\[\xi(ds',dr,da')=K(ds',dr\mid s,a)\bar\pi^g(da'\mid s').\]</p>
<p>Assume \(\xi\ll\nu\) and write \(\rho=d\xi/d\nu\). Take a bounded \(Q\) and an integrable reward. Then</p>
<p>\[\begin{aligned}\mathbb E_\nu[r+\gamma\rho Q(s',a')]&=\int r\,K(ds',dr\mid s,a)+\gamma\int Q(s',a')\,d\xi\\&=\int\left[r+\gamma\int Q(s',a')\bar\pi^g(da'\mid s')\right]K(ds',dr\mid s,a)\\&=\int\left[r+\gamma\max_{a'}Q(s',a')\right]K(ds',dr\mid s,a).\end{aligned}\]</p>
<p>This is an identity for the target; it is not a convergence proof.</p>
</div></details>
<h2 id="expected-sarsa">Off-policy TD: Expected SARSA</h2>
<p>Uses the expected value of the next state-action pair instead of the maximum.</p>
<p>\[Q(s_t,a_t)\leftarrow Q(s_t,a_t)+\alpha\left(r_t+\gamma\mathbb E_{a\sim\bar\pi(\cdot\mid s_{t+1})}[Q(s_{t+1},a)]-Q(s_t,a_t)\right).\]</p>
<p>If \(\bar\pi=\bar\pi^g\), [[Expected SARSA]] reduces to Q-learning, i.e. Q-learning ultimately targets \(Q^*\).</p>
<h2 id="cliff">A walker near a cliff</h2>
<p>Consider the walker near a cliff, going from \(S\) to \(G\). Falling into the cliff gives a reward of \(-100\). A route close to the cliff and a route farther away illustrate the difference between the target and behavior policies.</p>
<figure><img src="/assets/images/reinforcement-learning/cliff-walk.svg" alt="Schematic grid with start S and goal G on either side of a cliff. One route runs just above the cliff; another takes a wider route away from it." loading="lazy"><figcaption>The cliff-walking example. The two routes are schematic.</figcaption></figure>
<p>For [[SARSA]], target and behavior are the same. The penalty affects the value of standing near the cliff because the update includes the policy's own next action. Exploration can therefore make the route near the cliff less attractive.</p>
<p>Q-learning uses the greedy next action in its target. It can still observe a fall and update from its penalty, but the next-state maximum does not average over the behavior policy's exploratory actions. The route favored by the greedy target can therefore stay close to the cliff.</p>
<p>The distinction is in the continuation used by the update: SARSA uses the action selected by its policy; Q-learning uses the greedy action. In the language of the example, SARSA accounts for the journey under its behavior policy.</p>
<h2 id="multi-step-returns">Other TD statistics</h2>
<p>We introduce the \(U_t\) statistic for TD, also known as the TD-return. This also holds in the non-tabular parametric case.</p>
<details class="supplementary-proof"><summary>The \(n\)-step TD return</summary><div class="proof-content">
<p>Consider the indicator variables:</p>
<p>\[D_k=\begin{cases}1,&s_k\text{ is terminal},\\0,&s_k\text{ is nonterminal},\end{cases}\qquad C_k=1-D_k.\]</p>
<p>Define the zero-step target as \(U_t^{(0)}=\widehat Q_t\), with \(\widehat Q_t=Q(s_t,a_t;w)\).</p>
<p>The \(n\)-step TD return is given recursively as</p>
<p>\[U_t^{(n)}=r_t+\gamma C_{t+1}U_{t+1}^{(n-1)}.\]</p>
<p>For example:</p>
<p>\[U_t^{(2)}=r_t+\gamma C_{t+1}\bigl(r_{t+1}+\gamma C_{t+2}\widehat Q_{t+2}\bigr).\]</p>
<p>For one step:</p>
<p>\[U_t^{(1)}=r_t+\gamma C_{t+1}\widehat Q_{t+1},\qquad\delta_t=U_t^{(1)}-\widehat Q_t.\]</p>
</div></details>
<h2 id="approximation">Function approximation</h2>
<p>When the state space is not necessarily finite, we can use parametric methods and update the parameters with optimization methods.</p>
<p>We don't optimize state values one by one. Instead, we minimize some objective:</p>
<p>For Monte Carlo learning, \(R(\tau)\) here is the return from the sampled state-action pair:</p>
<p>\[|R(\tau)-Q(s_t,a_t;w)|^2.\]</p>
<p>Then</p>
<p>\[w\leftarrow w-\frac12\alpha_t\nabla_w|R(\tau)-Q(s_t,a_t;w)|^2.\]</p>
<details class="supplementary-proof"><summary>Semi-gradient descent</summary><div class="proof-content">
<p>Consider the sample loss:</p>
<p>\[|U_t-Q(s_t,a_t;w)|^2.\]</p>
<p>When updating \(w\) in TD learning with function approximation, we do not compute the gradients with respect to \(U_t\), in the same way the update equations for TD don't modify \(U_t\).</p>
<p>For Q-learning, \(U_t=r_t+\gamma(1-d_{t+1})\max_a Q(s_{t+1},a;w)\), where \(d_{t+1}\) indicates termination. Treat \(U_t\) as fixed in the parameter update.</p>
</div></details>
<div class="problem-grid">
<article class="exercise"><header class="exercise-head"><div><strong>Recall 1</strong><span>One-step TD error</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>The one-step TD error and the value update.</p></div><div class="answer-panel"><div class="answer-inner"><p>\[\delta_t=r_t+\gamma V(s_{t+1})-V(s_t),\qquad V(s_t)\leftarrow V(s_t)+\alpha\delta_t.\]</p></div></div></article>
<article class="exercise"><header class="exercise-head"><div><strong>Recall 2</strong><span>Expected SARSA</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Expected SARSA with a greedy target policy.</p></div><div class="answer-panel"><div class="answer-inner"><p>If \(\bar\pi=\bar\pi^g\), Expected SARSA reduces to Q-learning.</p><p>\[\mathbb E_{a\sim\bar\pi^g(\cdot\mid s')}Q(s',a)=\max_a Q(s',a).\]</p></div></div></article>
</div>
<h2 id="sources">References</h2><p class="course-references">Shengbo Eben Li, <em>Reinforcement Learning for Sequential Decision and Optimal Control</em> (2023), Sections 4.1–4.3 and Chapter 5.</p>
