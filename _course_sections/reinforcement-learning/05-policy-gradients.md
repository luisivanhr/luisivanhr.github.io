---
title: Policy Gradients
permalink: /courses/reinforcement-learning/05-policy-gradients/
date: 2026-09-22
updated: 2026-09-23
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
<div class="problem-grid"><article class="exercise"><header class="exercise-head"><div><strong>Recall</strong><span>Baselines</span></div><button class="answer-button" type="button">Show answer</button></header><div class="exercise-body"><p>Subtracting a state-dependent baseline.</p></div><div class="answer-panel"><div class="answer-inner"><p>We can subtract any baseline without changing the expectation:</p><p>\[\mathbb E_{a\sim\bar\pi_\theta(\cdot\mid s)}[\nabla_\theta\log\bar\pi_\theta(a\mid s)b(s)]=0.\]</p></div></div></article></div>
<h2 id="sources">References</h2><p class="course-references">Josh Achiam, <em>Spinning Up in Deep RL</em>, OpenAI (2018), “Introduction to Policy Optimization.”</p>
