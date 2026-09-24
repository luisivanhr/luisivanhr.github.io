---
title: Motivation
permalink: /courses/reinforcement-learning/00-motivation/
date: 2026-09-22
updated: 2026-09-25
course_title: A Brief Introduction to Reinforcement Learning
course_url: /courses/reinforcement-learning/
course_section_style: theory
section_number: 1
section_kind: Dynamic programming and fixed points
summary: Dynamic programming, Bellman equations, and why fixed-point iterations can help us solve them.
next_section:
  title: Key Concepts
  url: /courses/reinforcement-learning/01-key-concepts/
---

<h2 id="dynamic-programming">Dynamic programming</h2>
<p>Before going into reinforcement learning, I would like to introduce two ideas that we will use throughout the course: [[dynamic programming]] and fixed points. We can start with a problem in which we know how our actions affect the state, and then consider what changes when we need to learn from experience.</p>
<p>Suppose we observe a state \(x_t\) and choose an action \(a_t\) at each time \(t=0,1,\ldots,T-1\). This action has a cost \(c_t(x_t,a_t)\) and takes us to the next state according to</p>
<p>\[x_{t+1}=F_t(x_t,a_t).\]</p>
<p>Our objective is to minimize the accumulated cost, including the cost \(g(x_T)\) assigned to the final state:</p>
<p>\[\sum_{t=0}^{T-1}c_t(x_t,a_t)+g(x_T).\]</p>
<p>We could compare all possible sequences of actions \((a_0,a_1,\ldots,a_{T-1})\), but this becomes difficult as the number of decisions grows. If we already knew the optimal cost from each possible next state, we could use it to choose the current action.</p>
<p>Let \(V_t(x)\) denote the optimal cost from state \(x\) at time \(t\). For each action, we add its immediate cost to the optimal cost of continuing from the state it produces. We then choose the action with the smallest total. Assuming the minimum is attained, this gives</p>
<div class="math-block theorem"><span class="block-label">Backward recursion</span><p>\[V_t(x)=\min_a\left\{c_t(x,a)+V_{t+1}\bigl(F_t(x,a)\bigr)\right\}.\]</p></div>
<p>We already know the value at the final time: \(V_T(x)=g(x)\), since there are no decisions left. We can therefore compute \(V_{T-1}\), use it to compute \(V_{T-2}\), and continue backward until we reach \(V_0\). This is the idea of dynamic programming: solve the remaining problem first and use its solution to make the current decision.</p>

<h2 id="optimality">Bellman's principle of optimality</h2>
<p>The recursion relies on [[Bellman's principle of optimality]]. If we follow an optimal strategy and reach some intermediate state, the remaining decisions must be optimal for the problem starting there. If a better continuation were available, we could use it to reduce the cost of the original strategy, contradicting its optimality.</p>
<p>For example, consider a shortest-path problem. If \(c(x,y)\) is the cost of moving from \(x\) to \(y\), the optimal remaining cost satisfies</p>
<p>\[V(x)=\min_y\{c(x,y)+V(y)\},\]</p>
<p>with the value at the destination fixed. Choosing the next location requires both the cost of reaching it and the cost of continuing from there.</p>
<p>We can apply the same idea to a Markov decision process. Here we maximize rewards, and an action can lead to different next states. Consider finite state and action spaces, bounded rewards, and a discount factor \(0\leq\gamma&lt;1\). The optimal value function satisfies</p>
<p>\[V^*(s)=\max_a\left\{r(s,a)+\gamma\sum_{s'}P(s'\mid s,a)V^*(s')\right\}.\]</p>
<p>Here \(r(s,a)\) is the expected immediate reward and \(P(s'\mid s,a)\) is the transition probability. We average the value of the possible next states and discount it by \(\gamma\). Notice that \(V^*\) appears on both sides: the values we want to find must reproduce themselves under this update.</p>

<h2 id="fixed-points">Fixed points</h2>
<p>An object that remains unchanged under a transformation is called a [[fixed point]]. For an operator \(\mathcal T\), this means</p>
<p>\[\mathcal T(x^*)=x^*.\]</p>
<p>Consider a debt with balance \(D_n\). Each period, interest is added and then we make a fixed payment:</p>
<p>\[D_{n+1}=(1+r)D_n-p,\]</p>
<p>where \(r&gt;0\) now denotes the interest rate and \(p&gt;0\) is the payment. We can regard \(\mathcal T(D)=(1+r)D-p\) as an operator on the balance. Its fixed point is a debt that remains unchanged after adding interest and making the payment:</p>
<p>\[D^*=(1+r)D^*-p,\qquad D^*=\frac{p}{r}.\]</p>
<p>At \(D^*=p/r\), each payment exactly covers the interest, so the debt never decreases. Equivalently, for a given initial debt \(D_0&gt;0\), the critical payment is \(p^*=rD_0\). A larger payment eventually pays off the debt; a smaller one allows it to grow. When paying off the debt, the last payment is reduced to the amount still owed, including interest.</p>
<p>The fixed point exists, but applying the update repeatedly does not necessarily lead us to it. Subtracting the fixed-point equation from the debt update gives</p>
<p>\[D_{n+1}-D^*=(1+r)(D_n-D^*).\]</p>
<p>Any difference from \(D^*\) is multiplied by \(1+r&gt;1\) at each step. Unless we start exactly at the fixed point, the linear update takes us farther away from it. This is an unstable fixed point.</p>

<h2 id="bellman-fixed-point">The Bellman fixed point</h2>
<p>For the Markov decision process above, we can define an operator that takes a value function and performs one Bellman update:</p>
<p>\[(\mathcal TV)(s)=\max_a\left\{r(s,a)+\gamma\mathbb E[V(S')\mid s,a]\right\}.\]</p>
<p>This is the [[Bellman optimality operator]]. The Bellman equation says that \(\mathcal TV^*=V^*\). We would like to find this fixed point by starting from an initial value function and repeatedly applying \(\mathcal T\). The debt example shows why we need to check how the update affects differences between its inputs.</p>
<p>Take two value functions \(V\) and \(W\), and measure their distance by the largest absolute difference across states: \(\|V-W\|_\infty=\max_s|V(s)-W(s)|\). After one Bellman update,</p>
<div class="math-block theorem"><span class="block-label">Contraction</span><p>\[\|\mathcal TV-\mathcal TW\|_\infty\leq\gamma\|V-W\|_\infty.\]</p></div>
<p>Averaging over next states cannot increase the largest difference, and discounting reduces it by a factor \(\gamma&lt;1\). The Bellman operator is therefore a contraction.</p>
<details class="supplementary-proof"><summary>Proof of the contraction inequality</summary><div class="proof-content">
<p>For a fixed state, compare the expressions defining \(\mathcal TV\) and \(\mathcal TW\) at the same action. Their immediate rewards cancel. The difference between the maxima is bounded by the largest of these differences:</p>
<p>\[\begin{aligned}|(\mathcal TV)(s)-(\mathcal TW)(s)|&\leq\gamma\max_a\left|\mathbb E[V(S')-W(S')\mid s,a]\right|\\&\leq\gamma\|V-W\|_\infty.\end{aligned}\]</p>
<p>Taking the maximum over states gives the inequality.</p>
</div></details>
<p>Under the finite, discounted assumptions above, this contraction has a unique fixed point. Repeated updates converge to it:</p>
<p>\[V_{n+1}=\mathcal TV_n,\qquad V_n\longrightarrow V^*.\]</p>
<p>This procedure is called value iteration. The debt operator multiplies distances by \(1+r&gt;1\). For the Bellman operator, the distance after an update is at most \(\gamma\) times the previous distance. This contraction is what allows us to compute the optimal value function by iteration.</p>
<h2 id="learning">Learning from experience</h2>
<p>So far, we have assumed that we know the model needed to compute the Bellman update. In reinforcement learning, we often do not know the transition probabilities. We have to learn from the states, actions, and rewards that we observe. The optimal value functions still satisfy the same relations. For the optimal action-value function, we have</p>
<p>\[Q^*(s,a)=r(s,a)+\gamma\mathbb E\left[\max_{a'}Q^*(S',a')\mid s,a\right].\]</p>
<p>This is the equation we will use in Q-learning. Before getting there, we will introduce the basic concepts and then see how sampled experience can be used to estimate the values in these equations.</p>
<h2 id="sources">References</h2><p class="course-references">For the dynamic programming and Bellman framework: Dimitri P. Bertsekas and Steven E. Shreve, <em>Stochastic Optimal Control: The Discrete-Time Case</em> (1978); Shengbo Eben Li, <em>Reinforcement Learning for Sequential Decision and Optimal Control</em> (2023), Chapter 2.</p>
