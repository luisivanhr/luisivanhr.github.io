---
title: Policy Gradients
permalink: /courses/reinforcement-learning/05-policy-gradients/
date: 2026-09-22
updated: 2026-09-25
course_title: A Brief Introduction to Reinforcement Learning
course_url: /courses/reinforcement-learning/
course_section_style: theory
section_number: 7
section_kind: Policy optimization
summary: Direct policy optimization, reward-to-go, and baselines.
previous_section:
  title: TD Error and Q-learning
  url: /courses/reinforcement-learning/04-td-and-q-learning/
next_section:
  title: Deep RL Architectures
  url: /courses/reinforcement-learning/06-deep-rl/
---

<h2 id="optimization">Policy optimization</h2>
<p>The problem is maximizing the expected return:</p>
<p>\[J(\bar\pi_\theta)=\mathbb E_{\tau\sim\bar\pi_\theta}[R(\tau)].\]</p>
<p>We want to update</p>
<p>\[\theta_{k+1}=\theta_k+\alpha\left.\nabla_\theta J(\bar\pi_\theta)\right|_{\theta_k}.\]</p>
<div class="math-block theorem"><span class="block-label">Basic [[policy gradient]]</span><p>\[\nabla_\theta J(\bar\pi_\theta)=\mathbb E_{\tau\sim\bar\pi_\theta}\left[\sum_{t=0}^{T}\nabla_\theta\log\bar\pi_\theta(a_t\mid s_t)R(\tau)\right].\]</p></div>
<p>Here the trajectory contains the transitions for \(t=0,\ldots,T\), and \(R(\tau)=\sum_{t=0}^T r_t\).</p>
<details class="supplementary-proof"><summary>Proof: the log-derivative trick</summary><div class="proof-content">
<p>Assume a differentiable policy with parameter-independent support, integrable derivatives, and permission to interchange differentiation and integration. The initial distribution and environment transitions do not depend on \(\theta\).</p>
<p>Log-derivative “trick”: \(\nabla_\theta p_\theta(\tau)=p_\theta(\tau)\nabla_\theta\log p_\theta(\tau)\). Then</p>
<p>\[\nabla_\theta\log p_\theta(\tau)=\sum_{t=0}^T\nabla_\theta\log\bar\pi_\theta(a_t\mid s_t).\]</p>
<p>Let \(\mu\) be a reference measure and \(p_\theta=dP_\theta/d\mu\). The basic policy gradient is given as</p>
<p>\[\begin{aligned}\nabla_\theta J(\bar\pi_\theta)&=\nabla_\theta\int R(\tau)p_\theta(\tau)\,d\mu(\tau)\\&=\int R(\tau)\nabla_\theta p_\theta(\tau)\,d\mu(\tau)\\&=\int R(\tau)\nabla_\theta\log p_\theta(\tau)p_\theta(\tau)\,d\mu(\tau)\\&=\mathbb E_{\tau\sim\bar\pi_\theta}[R(\tau)\nabla_\theta\log p_\theta(\tau)].\end{aligned}\]</p>
</div></details>
<h2 id="reward-to-go">Reward-to-go</h2>
<p>Actions are only reinforced based on rewards obtained after they are taken.</p>
<p>\[\widehat R_t=\sum_{t'=t}^T R(s_{t'},a_{t'},s_{t'+1})\]</p>
<p>is called “[[reward-to-go]]”. The gradient can be written</p>
<p>\[\nabla_\theta J(\bar\pi_\theta)=\mathbb E_{\tau\sim\bar\pi_\theta}\left[\sum_{t=0}^T\nabla_\theta\log\bar\pi_\theta(a_t\mid s_t)\widehat R_t\right].\]</p>
<h2 id="baselines">Baselines in policy gradients</h2>
<p>For any function \(b\) that depends only on the state \(s\),</p>
<p>\[\mathbb E_{a_t\sim\bar\pi_\theta(\cdot\mid s_t)}[\nabla_\theta\log\bar\pi_\theta(a_t\mid s_t)b(s_t)]=0.\]</p>
<p>So we can subtract any [[baseline]] without changing the expectation.</p>
<p>\[\nabla_\theta J(\bar\pi_\theta)=\mathbb E\left[\sum_{t=0}^T\nabla_\theta\log\bar\pi_\theta(a_t\mid s_t)\bigl(\widehat R_t-b(s_t)\bigr)\right].\]</p>
<p>A common choice for the baseline is \(V^{\bar\pi}(s_t)\). In practice \(V^{\bar\pi}(s_t)\) cannot be computed exactly, so it needs to be approximated, e.g. \(V_\phi(s_t)\), which is updated concurrently with the policy. Usually,</p>
<p>\[\phi_k\in\operatorname*{argmin}_{\phi}\mathbb E_{s_t,\widehat R_t\sim\bar\pi_{\theta_k}}\left[(V_\phi(s_t)-\widehat R_t)^2\right].\]</p>
<details class="supplementary-proof"><summary>Expected grad-log-prob lemma</summary><div class="proof-content"><p>Suppose that \(P_\theta\) is a parametrized probability distribution over a random variable \(x\). Under the differentiation assumptions above,</p><p>\[\mathbb E_{x\sim P_\theta}[\nabla_\theta\log p_\theta(x)]=\int\nabla_\theta p_\theta(x)\,dx=\nabla_\theta1=0.\]</p><p>At a fixed state, \(b(s)\) is constant with respect to the action, giving the baseline identity.</p></div></details>
<h2 id="remarks">Remarks</h2>
<p>We have seen that the policy gradient has a general form</p>
<p>\[\nabla_\theta J(\bar\pi_\theta)=\mathbb E_{\tau\sim\bar\pi_\theta}\left[\sum_{t=0}^T\nabla_\theta\log\bar\pi_\theta(a_t\mid s_t)\Phi_t\right],\]</p>
<p>where \(\Phi_t\) could be</p>
<p>\[\Phi_t=R(\tau),\qquad\Phi_t=\sum_{t'=t}^T R(s_{t'},a_{t'},s_{t'+1}),\]</p>
<p>or</p>
<p>\[\Phi_t=\sum_{t'=t}^T R(s_{t'},a_{t'},s_{t'+1})-b(s_t).\]</p>
<p>Other choices are:</p>
<p>\[\Phi_t=Q_t^{\bar\pi_\theta}(s_t,a_t),\qquad \Phi_t=A_t^{\bar\pi_\theta}(s_t,a_t).\]</p>
<p>\[A_t^{\bar\pi_\theta}(s_t,a_t)=Q_t^{\bar\pi_\theta}(s_t,a_t)-V_t^{\bar\pi_\theta}(s_t)\]</p>
<p>is called the advantage of an action.</p>
<details class="supplementary-proof"><summary>Value functions for the remaining return</summary><div class="proof-content">
<p>\[Q_t^{\bar\pi_\theta}(s,a)=\mathbb E_{\bar\pi_\theta}[\widehat R_t\mid s_t=s,a_t=a],\qquad V_t^{\bar\pi_\theta}(s)=\mathbb E_{\bar\pi_\theta}[\widehat R_t\mid s_t=s].\]</p>
</div></details>
<ul><li>Data distribution depends on the parameters.</li><li>The loss does not reflect performance. It seems counterintuitive, but it is better to track other metrics like expected return.</li></ul>
<div class="problem-grid">
<article class="exercise" style="grid-column: 1 / -1;"><header class="exercise-head"><div><strong>Exercise 7.1</strong><span>Infinite-horizon discounted policy gradient</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Let \(S\) and \(A\) be measurable state and action spaces, and let \(\theta\) range over an open set \(\Theta\subseteq\mathbb R^d\), where \(d\) is the parameter dimension. The environment has transition kernel \(P(ds'\mid s,a)\) and a one-step reward kernel, both independent of \(\theta\). Write \(S_t,A_t,R_t\) for the state, action, and reward at time \(t\). The conditional reward mean is \(r(s,a)=\mathbb E[R_t\mid S_t=s,A_t=a]\), and \(\sup_{t,s,a}\mathbb E[|R_t|\mid S_t=s,A_t=a]\leq R_{\max}&lt;\infty\). The initial-state distribution \(\rho_0\) is also independent of \(\theta\). A stochastic policy is a probability kernel with density \(\pi_\theta(da\mid s)=\pi_\theta(a\mid s)\lambda(da\mid s)\) relative to a fixed reference measure \(\lambda(da\mid s)\). Assume the density is differentiable in \(\theta\) for \(\lambda\)-almost every \(a\) and has parameter-independent support. Assume \(\theta\mapsto\pi_\theta(\cdot\mid s)\) is continuously differentiable in total variation uniformly over \(s\), so the induced reward function and transition operator are continuously differentiable in sup norm and operator norm, respectively. Assume differentiation may pass through the integrals and discounted resolvent series, and that policy scores and score-value products are integrable. A trajectory follows \(\rho_0\), the policy, and the environment; \(S_t,A_t,R_t\) denote its state, action, and reward at time \(t\), and \(\mathbb E_{\rho_0,\pi_\theta}\) denotes expectation over this trajectory law. Let \(0\leq\gamma&lt;1\) and \(J(\theta)=\mathbb E_{\rho_0,\pi_\theta}[\sum_{t=0}^{\infty}\gamma^tR_t]\).</p><p>Define the policy Bellman operator on bounded measurable state functions and prove it is a contraction. Use its fixed point and resolvent to derive the infinite-horizon policy-gradient formula for \(J(\theta)\). Express the result through a normalized discounted occupancy measure. Finally, write the empirical estimator based on \(N\) sampled trajectories observed through nonnegative integer cutoff \(T\), using \(\widehat Q_t\) for an action-value estimate. Explain how finite \(T\) and an estimated \(\widehat Q_t\) affect its interpretation.</p><p><em>Hint:</em> Differentiate the Bellman fixed-point equation, then solve the resulting linear equation with a convergent operator series.</p></div><div class="answer-panel"><div class="answer-inner"><p>Let \(B\subseteq S\) be measurable. Define the policy transition kernel and its operator by</p><p>\[K_\theta(s,B)=\int_A P(B\mid s,a)\pi_\theta(da\mid s),\qquad (K_\theta v)(s)=\int_A\pi_\theta(da\mid s)\int_S P(ds'\mid s,a)v(s').\]</p><p>For a bounded measurable function \(v:S\to\mathbb R\), write \(\|v\|_\infty=\sup_{s\in S}|v(s)|\). Also define</p><p>\[r_\theta(s)=\int_A r(s,a)\pi_\theta(da\mid s),\qquad T_\theta v=r_\theta+\gamma K_\theta v.\]</p><p>Since \(K_\theta\) is a probability kernel, \(\|K_\theta v-K_\theta w\|_\infty\leq\|v-w\|_\infty\) for any bounded measurable \(v,w\). Hence \(\|T_\theta v-T_\theta w\|_\infty\leq\gamma\|v-w\|_\infty\). The operator \(T_\theta\) is a contraction on the Banach space of bounded measurable functions, so it has a unique bounded fixed point \(V^\theta=V^{\pi_\theta}\). The exact action value is</p><p>\[Q^\theta(s,a)=Q^{\pi_\theta}(s,a)=r(s,a)+\gamma\int_S P(ds'\mid s,a)V^\theta(s').\]</p><p>Let \(I\) be the identity operator and define \(K_\theta^0=I\), with \(K_\theta^t\) the \(t\)-fold composition for integers \(t\geq1\). The inverse has the convergent Neumann series</p><p>\[(I-\gamma K_\theta)^{-1}=\sum_{t=0}^{\infty}\gamma^tK_\theta^t,\qquad V^\theta=(I-\gamma K_\theta)^{-1}r_\theta.\]</p><p>Convergence is in operator norm because \(\|\gamma K_\theta\|\leq\gamma&lt;1\). Differentiate the fixed-point equation in the Banach space of bounded measurable functions to obtain</p><p>\[\nabla_\theta V^\theta=b_\theta+\gamma K_\theta\nabla_\theta V^\theta,\qquad b_\theta(s)=\int_A\nabla_\theta\pi_\theta(a\mid s)Q^\theta(s,a)\lambda(da\mid s).\]</p><p>Because \(P\) and \(r\) do not depend on \(\theta\), the derivative through the policy density multiplies \(r(s,a)+\gamma\int_S P(ds'\mid s,a)V^\theta(s')=Q^\theta(s,a)\). Solving the linear equation gives</p><p>\[\nabla_\theta V^\theta=(I-\gamma K_\theta)^{-1}b_\theta=\sum_{t=0}^{\infty}\gamma^tK_\theta^t b_\theta.\]</p><p>Define the discounted state-occupancy measure, for measurable \(B\subseteq S\), by</p><p>\[\eta_\gamma^\theta(B)=\sum_{t=0}^{\infty}\gamma^t(\rho_0K_\theta^t)(B),\qquad d_\gamma^\theta=(1-\gamma)\eta_\gamma^\theta.\]</p><p>Here \(\rho_0K_\theta^t\) is the law of \(S_t\), so \(\eta_\gamma^\theta\) has total mass \(1/(1-\gamma)\) and \(d_\gamma^\theta\) is a probability measure. Since \(J(\theta)=\int_S\rho_0(ds)V^\theta(s)\), the resolvent formula gives</p><p>\[\nabla_\theta J(\theta)=\int_S\eta_\gamma^\theta(ds)\int_A\nabla_\theta\pi_\theta(a\mid s)Q^\theta(s,a)\lambda(da\mid s)=\frac{1}{1-\gamma}\int_Sd_\gamma^\theta(ds)\int_A\pi_\theta(da\mid s)\psi_\theta(s,a)Q^\theta(s,a),\]</p><p>where \(\psi_\theta(s,a)=\nabla_\theta\log\pi_\theta(a\mid s)\) is the policy score on the policy support. Differentiability and the fixed support give \(\nabla_\theta\pi_\theta(a\mid s)=\pi_\theta(a\mid s)\psi_\theta(s,a)\) there. In \(Q^\theta\), the continuation value is multiplied by \(\gamma\).</p><p>Let \(N\) be a positive integer. Generate \(N\) independent trajectories from \(\rho_0\), the policy, and the environment. For trajectory \(i\), let \(S_{it}\) and \(A_{it}\) be the state and action at time \(t\), and let \(\widehat Q_{it}\) estimate the exact infinite-horizon value \(Q^\theta(S_{it},A_{it})\). The empirical estimator through cutoff \(T\) is</p><p>\[\widehat{\nabla_\theta J}_{N,T}=\frac{1}{N}\sum_{i=1}^{N}\sum_{t=0}^{T}\gamma^t\psi_\theta(S_{it},A_{it})\widehat Q_{it}.\]</p><p>With exact \(Q^\theta\) and an untruncated discounted trajectory sum, the corresponding estimator is</p><p>\[\frac{1}{N}\sum_{i=1}^{N}\sum_{t=0}^{\infty}\gamma^t\psi_\theta(S_{it},A_{it})Q^\theta(S_{it},A_{it}),\]</p><p>whose expectation is \(\nabla_\theta J(\theta)\) under the stated integrability conditions. A finite \(T\) omits later discounted terms, and estimated \(\widehat Q_{it}\) adds action-value estimation error. The finite empirical expression approximates the infinite-horizon gradient; it is unbiased for that gradient only under additional conditions that account for both truncation and action-value estimation.</p></div></div></article>
</div>
<h2 id="sources">References</h2><p class="course-references">Josh Achiam, <em>Spinning Up in Deep RL</em>, OpenAI (2018), “Introduction to Policy Optimization.”</p>
