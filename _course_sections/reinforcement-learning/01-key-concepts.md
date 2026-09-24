---
title: Key Concepts
permalink: /courses/reinforcement-learning/01-key-concepts/
date: 2026-09-22
updated: 2026-09-25
course_title: A Brief Introduction to Reinforcement Learning
course_url: /courses/reinforcement-learning/
course_section_style: theory
section_number: 2
section_kind: Foundations
summary: Policies, trajectories, rewards, and expected return.
previous_section:
  title: Motivation
  url: /courses/reinforcement-learning/00-motivation/
next_section:
  title: Value Functions and Bellman Equations
  url: /courses/reinforcement-learning/02-value-functions/
---

<figure><img src="/assets/images/reinforcement-learning/agent-environment.svg" alt="Agent-environment loop: actions, states, and rewards." loading="lazy"><figcaption>Agent, environment, action, state, and reward.</figcaption></figure>
<h2 id="policies">Policies</h2>
<p>Deterministic [[policies]]: \(a_t=\mu(s_t)\). Stochastic policies: \(a_t\sim\bar\pi(\cdot\mid s_t)\).</p>
<p>For deep RL, policies are parametrized:</p>
<p>\[a_t=\mu_\theta(s_t),\qquad a_t\sim\bar\pi_\theta(\cdot\mid s_t).\]</p>
<h3 id="stochastic-policies">Stochastic policies</h3>
<p>Discrete: categorical. Continuous: diagonal Gaussian.</p>
<p>Categorical:</p>
<p>\[\log\bar\pi_\theta(a\mid s)=\bigl[\log P_\theta(s)\bigr]_a.\]</p>
<p>Index \(a\) of the vector of log-softmax probabilities.</p>
<p>Diagonal Gaussian. Mean: \(\mu_\theta(s)\).</p>
<ul><li>Cov. independent of state: \(\Sigma=\operatorname{diag}(\sigma_1^2,\ldots,\sigma_k^2)\).</li><li>Dependent case: \(\log\sigma_\theta(s)\).</li></ul>
<p>For a diagonal Gaussian, sampling uses the [[reparametrization trick]]:</p>
<p>\[a=\mu_\theta(s)+\sigma_\theta(s)\odot z,\qquad z\sim N(0,I).\]</p>
<p>\(\odot\): Hadamard product. \(z\): spherical Gaussian.</p>
<details class="supplementary-proof"><summary>Diagonal Gaussian log-likelihood</summary><div class="proof-content">
<p>The log-likelihood for a \(k\)-dimensional action \(a\):</p>
<p>\[\log\bar\pi_\theta(a\mid s)=-\frac12\left(\sum_{i=1}^k\left[\frac{(a_i-\mu_i)^2}{\sigma_i^2}+2\log\sigma_i\right]+k\log(2\pi)\right).\]</p>
<p>Mean: \(\mu_\theta(s)\). Covariance: \(\operatorname{diag}(\sigma_1^2,\ldots,\sigma_k^2)\). In the state-dependent case, \(\log\sigma_\theta(s)\) is parametrized.</p>
</div></details>
<h2 id="trajectories">Trajectories</h2>
<p>A [[trajectory]] is a sequence of actions and states:</p>
<p>\[\tau=(s_0,a_0,s_1,a_1,\ldots).\]</p>
<p>Initial state distribution: \(s_0\sim\rho_0(\cdot)\). Actions are sampled from a policy.</p>
<p>State transitions:</p>
<ul><li>Deterministic: \(s_{t+1}=f(s_t,a_t)\).</li><li>Stochastic: \(s_{t+1}\sim P(\cdot\mid s_t,a_t)\).</li></ul>
<details class="supplementary-proof"><summary>The state-transition kernel under a policy</summary><div class="proof-content">
<p>Let \(\bar\pi_\theta(da\mid s)\) be the parametrized policy and \(P(ds'\mid s,a)\) the environment kernel.</p>
<p>The policy induces the state-transition kernel</p>
<p>\[K_\theta(s,ds')=\int_A P(ds'\mid s,a)\bar\pi_\theta(da\mid s).\]</p>
<p>For a function \(f\),</p>
<p>\[(K_\theta f)(s)=\int_A\int_S f(s')P(ds'\mid s,a)\bar\pi_\theta(da\mid s)=\mathbb E_\theta[f(s_{t+1})\mid s_t=s].\]</p>
<p>Represents a one-step evolution under \(\bar\pi_\theta\).</p>
</div></details>
<h2 id="return">Reward and return</h2>
<p>\[r_t=R(s_t,a_t,s_{t+1}).\]</p>
<p>Sometimes dependence is simplified. The “\(R\)” is usually reused for denoting several things.</p>
<p>Finite-horizon undiscounted [[return]]:</p>
<p>\[R(\tau)=\sum_{t=0}^{T}r_t.\]</p>
<p>Infinite-horizon discounted return:</p>
<p>\[R(\tau)=\sum_{t=0}^{\infty}\gamma^t r_t,\qquad 0\le\gamma&lt;1.\]</p>
<p>“Myopic”: \(\gamma\to0\). “Farsighted”: \(\gamma\to1\).</p>
<h2 id="objective">The expected return</h2>
<p>We are interested in selecting \(\bar\pi\) such that we optimize expected return.</p>
<p>\[J(\bar\pi)=\mathbb E_{\tau\sim\bar\pi}[R(\tau)].\]</p>
<p>The problem: finding the optimal policy.</p>
<p>\[\bar\pi^*\in\operatorname*{argmax}_{\bar\pi}J(\bar\pi).\]</p>
<details class="supplementary-proof"><summary>Probability of a trajectory</summary><div class="proof-content">
<p>These are computed with respect to the probability measure over trajectories. For the return indexed from \(0\) to \(T\), the trajectory ends at \(s_{T+1}\). In the discrete case,</p>
<p>\[P(\tau\mid\bar\pi)=\rho_0(s_0)\prod_{t=0}^{T}P(s_{t+1}\mid s_t,a_t)\bar\pi(a_t\mid s_t).\]</p>
<p>\[J(\bar\pi)=\int_{\Omega_\tau}R(\tau)\,P(d\tau\mid\bar\pi),\qquad\Omega_\tau=S\times A\times\cdots\times S.\]</p>
<p>Sometimes the joint distribution \(P(s',r\mid s,a)\) is considered; \(P(s'\mid s,a)=\sum_r P(s',r\mid s,a)\) is the marginal in the discrete case.</p>
</div></details>
<h2 id="sources">References</h2><p class="course-references">Shengbo Eben Li, <em>Reinforcement Learning for Sequential Decision and Optimal Control</em> (2023), Chapter 2; Josh Achiam, <em>Spinning Up in Deep RL</em>, OpenAI (2018), “Key Concepts in RL.”</p>
