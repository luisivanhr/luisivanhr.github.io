---
title: Monte Carlo Learning
permalink: /courses/reinforcement-learning/03a-monte-carlo/
date: 2026-09-22
updated: 2026-09-23
course_title: A Brief Introduction to Reinforcement Learning
course_url: /courses/reinforcement-learning/
course_section_style: theory
section_number: 5
section_kind: Learning from episodes
summary: Samplers, return averages, and importance sampling for on-policy and off-policy learning.
previous_section:
  title: Exploration and Policy Improvement
  url: /courses/reinforcement-learning/03-exploration/
next_section:
  title: TD Error and Q-learning
  url: /courses/reinforcement-learning/04-td-and-q-learning/
---

<h2 id="monte-carlo">Monte Carlo policy improvement</h2>
<p>[[Monte Carlo learning]] has two steps:</p>
<ol><li>Approximate value functions by averaging returns over several episodes.</li><li>Greedy search for actions by using the value functions.</li></ol>
<p>Without an environment model, we use \(Q^{\bar\pi}(s,a)\). With an environment model, we can use \(V^{\bar\pi}(s)\). Both on-policy and off-policy methods consist of a sampler and a trainer.</p>

<h2 id="on-policy-sampling">On-policy sampling and training</h2>
<p><strong>Sampler:</strong> select initial pairs \((s,a)\) to cover \(S\times A\) entirely. The returns with common starts are extracted from the sampled episodes.</p>
<p>After the initial pair, actions are sampled from the policy \(\bar\pi\) being evaluated. Write \(R^{(j)}\) for the return from the starting pair in episode \(j\).</p>
<p><strong>Trainer:</strong> a batch average of returns is computed for each starting pair \((s,a)\):</p>
<div class="math-block theorem"><span class="block-label">Monte Carlo evaluation</span><p>\[\widehat Q^{\bar\pi}(s,a)=\frac1N\sum_{j=1}^N R^{(j)}.\]</p></div>
<p>Here, the \(N\) returns share the same starting pair. The trainer then performs a policy optimization step, using an \(\epsilon\)-greedy search. The improved policy is used to generate the next batch of episodes.</p>
<p>The sampler and trainer therefore use the same policy: the policy generating the episodes is also the policy whose value is estimated.</p>

<h2 id="off-policy-sampling">Off-policy sampling and training</h2>
<p><strong>Sampler:</strong> similar to the on-policy sampler, but paths are simulated from the behavior policy. Samples may come from different behavior policies. They come together with their importance-sampling coefficients.</p>
<p><strong>Trainer:</strong> estimate the value of the target policy from these returns, accounting for the difference between the behavior and target policies. Then use a greedy search for policy improvement.</p>
<p>[[Importance sampling]] is used to calculate expectations through a change of measure. It tells us how to process samples from the behavior policy when calculating a value for the target policy.</p>
<p>For discrete actions, if \(\bar\pi(a\mid s)&gt;0\), we require \(\mu(a\mid s)&gt;0\). Then</p>
<p>\[V^{\bar\pi}(s)=\mathbb E_{a\sim\mu(\cdot\mid s)}\left[\frac{\bar\pi(a\mid s)}{\mu(a\mid s)}Q^{\bar\pi}(s,a)\right].\]</p>
<p>The ratio corrects for the different probabilities of selecting an action. The behavior policy generates samples; the target policy determines the value function being estimated.</p>
<details class="supplementary-proof"><summary>The change-of-measure identity</summary><div class="proof-content">
<p>Let \(P\) be the target distribution and \(M\) the sampling distribution. If \(P\ll M\), the Radon–Nikodym theorem gives the derivative \(dP/dM\). For an integrable function \(f\),</p>
<p>\[\mathbb E_P[f(X)]=\mathbb E_M\left[f(X)\frac{dP}{dM}(X)\right].\]</p>
<p>When the distributions have densities \(p\) and \(m\), the derivative is \(p(x)/m(x)\), on the support of the sampling distribution.</p>
</div></details>

<h2 id="trajectory-weights">Importance weights along a trajectory</h2>
<p>The idea is to compute importance weights. For a state value, the actions from time \(t\) to the last action before termination contribute the product</p>
<p>\[\omega_{t:T-1}=\prod_{i=t}^{T-1}\frac{\bar\pi(a_i\mid s_i)}{\mu(a_i\mid s_i)}.\]</p>
<p>Here, \(T\) is the terminal-state time. For an action value with the starting pair \((s_t,a_t)\) fixed, the product starts at \(t+1\), since that initial action is already given.</p>
<details class="supplementary-proof"><summary>Ordinary and weighted batch averages</summary><div class="proof-content">
<p>For episode \(j\), let \(\rho^{(j)}=\omega^{(j)}_{t+1:T_j-1}\) and let \(R^{(j)}\) be its return from the common starting pair. An empty product equals one. The ordinary batch average is</p>
<p>\[\widehat Q^{\bar\pi}(s,a)=\frac1N\sum_{j=1}^N\rho^{(j)}R^{(j)}.\]</p>
<p>The weighted batch average normalizes the weights:</p>
<p>\[\widehat Q^{\bar\pi}(s,a)=\frac{\sum_{j=1}^N\rho^{(j)}R^{(j)}}{\sum_{j=1}^N\rho^{(j)}},\]</p>
<p>provided that the denominator is positive.</p>
</div></details>
<p>These weights can become unstable as the length of the trajectory increases, especially when both policies differ. For example, an action may have a large probability under \(\bar\pi\) and a small probability under \(\mu\), producing a large ratio.</p>

<details class="supplementary-proof"><summary>Importance-sampling variance</summary><div class="proof-content">
<p>The behavior distribution \(\mu\) can be chosen to minimize the variance.</p>
<p>Let</p>
<p>\[I=\mathbb E_{X\sim P}[f(X)]=\int f(x)p(x)\,dx,\qquad X_1,\ldots,X_N\overset{\mathrm{iid}}{\sim}M.\]</p>
<p>The importance sampling estimator is:</p>
<p>\[\widehat I=\frac1N\sum_{i=1}^N f(X_i)\frac{p(X_i)}{m(X_i)}.\]</p>
<p>Its variance is</p>
<p>\[\operatorname{Var}_M(\widehat I)=\frac1N\left[\int\frac{f(x)^2p(x)^2}{m(x)}\,dx-I^2\right].\]</p>
</div></details>

<h2 id="incremental-update">From return averages to an update</h2>
<p>We can write the Monte Carlo value update as</p>
<p>\[\begin{aligned}V(s)&\leftarrow(1-\alpha)V(s)+\alpha R(\tau)\\&=V(s)+\alpha\bigl(R(\tau)-V(s)\bigr),\end{aligned}\]</p>
<p>where \(R(\tau)\) is the sampled return from \(s\) and \(\alpha\) is the step size. The next section uses the self-consistency condition to replace this return with an immediate reward and an estimate of the next state's value. This gives the TD update.</p>
<h2 id="sources">References</h2><p class="course-references">Shengbo Eben Li, <em>Reinforcement Learning for Sequential Decision and Optimal Control</em> (2023), Sections 3.3–3.4. For importance sampling: James E. Gentle, <em>Random Number Generation and Monte Carlo Methods</em> (1998).</p>
