---
title: Deep RL Architectures
permalink: /courses/reinforcement-learning/06-deep-rl/
date: 2026-09-22
updated: 2026-09-25
course_title: A Brief Introduction to Reinforcement Learning
course_url: /courses/reinforcement-learning/
course_section_style: theory
section_number: 8
section_kind: Deep RL strategies
summary: Semi-gradient SARSA and Q-learning; VPG, TRPO, PPO, DDPG, TD3, SAC, and SHAC.
previous_section:
  title: Policy Gradients
  url: /courses/reinforcement-learning/05-policy-gradients/
---

<h2 id="semi-gradient-algorithms">Semi-gradient descent</h2>
<p>When updating the parameter vector \(w\) in TD learning with function approximation, we treat the TD target \(U\) as fixed.</p>
<details class="supplementary-proof"><summary>Algorithm: Semi-gradient SARSA</summary><div class="proof-content">
<p><strong>Inputs.</strong> A differentiable action-value approximation \(Q(s,a;w)\) with parameter vector \(w\), step size \(\alpha&gt;0\), discount factor \(0\leq\gamma\leq1\), and an action-selection policy \(\bar\pi\). Here \(s\) is a state and \(a\) an action. For policy evaluation, \(\bar\pi\) is fixed; for policy improvement, use a policy derived from the current action values, such as an epsilon-greedy policy.</p>
<ol>
<li>Initialize the parameters \(w\).</li>
<li>For each episode, choose the initial state \(s\) and sample \(a\) from \(\bar\pi(\cdot\mid s)\).</li>
<li>Repeat until the episode ends:
<ol>
<li>Execute \(a\). Observe reward \(r\), next state \(s'\), and the indicator \(d'\), which is one if the episode ends and zero otherwise.</li>
<li>If \(d'=1\), set the TD target \(U=r\). Otherwise, sample the next action \(a'\) from \(\bar\pi(\cdot\mid s')\) and set
<p>\[U=r+\gamma Q(s',a';w).\]</p></li>
<li>Update the parameters:
<p>\[w\leftarrow w+\alpha[U-Q(s,a;w)]\nabla_w Q(s,a;w).\]</p>
<p>Here \(\nabla_w\) is the gradient with respect to \(w\). Do not recalculate \(U\) or differentiate it during this update.</p></li>
<li>If the episode continues, set \(s\leftarrow s'\) and \(a\leftarrow a'\).</li>
</ol></li>
</ol>
</div></details>
<details class="supplementary-proof"><summary>Algorithm: Semi-gradient Q-learning</summary><div class="proof-content">
<p><strong>Inputs.</strong> A differentiable action-value approximation \(Q(s,a;w)\), parameter vector \(w\), step size \(\alpha&gt;0\), discount factor \(0\leq\gamma\leq1\), and a behavior policy \(\mu\). Here \(s\) is a state, \(a\) an action, and \(A(s)\) the finite set of actions available at \(s\).</p>
<ol>
<li>Initialize the parameters \(w\).</li>
<li>For each episode, choose the initial state \(s\).</li>
<li>Repeat until the episode ends:
<ol>
<li>Sample \(a\) from \(\mu(\cdot\mid s)\), such as an epsilon-greedy policy derived from the current action values.</li>
<li>Execute \(a\). Observe reward \(r\), next state \(s'\), and the indicator \(d'\), which is one if the episode ends and zero otherwise.</li>
<li>If \(d'=1\), set the TD target \(U=r\). Otherwise, set
<p>\[U=r+\gamma\max_{a'\in A(s')}Q(s',a';w).\]</p></li>
<li>Update the parameters:
<p>\[w\leftarrow w+\alpha[U-Q(s,a;w)]\nabla_w Q(s,a;w).\]</p>
<p>Here \(\nabla_w\) is the gradient with respect to \(w\). Do not recalculate \(U\) or differentiate it during this update.</p></li>
<li>If the episode continues, set \(s\leftarrow s'\).</li>
</ol></li>
</ol>
</div></details>
<h2 id="vpg">Vanilla policy gradient</h2>
<ul><li>On-policy, for continuous or discrete state spaces.</li><li>Samples actions based on the latest version of its stochastic policy.</li><li>Advantage function estimates are based on the infinite-horizon discounted return.</li></ul>
<p>\[\theta_{k+1}=\theta_k+\alpha\left.\nabla_\theta J(\bar\pi_\theta)\right|_{\theta_k}.\]</p>
<h2 id="trpo">Trust Region Policy Optimization (TRPO)</h2>
<p>[[TRPO]]: stochastic policy trained on-policy.</p>
<p>The idea is to take large steps without the performance collapsing.</p>
<details class="supplementary-proof"><summary>TRPO objective and local approximation</summary><div class="proof-content">
<p>\[\theta_{k+1}\in\operatorname*{argmax}_\theta\mathcal L(\theta_k,\theta)\quad\text{subject to}\quad\overline D_{\mathrm{KL}}(\theta\Vert\theta_k)\le\delta,\]</p>
<p>\[\mathcal L(\theta_k,\theta)=\mathbb E_{s,a\sim\bar\pi_{\theta_k}}\left[\frac{\bar\pi_\theta(a\mid s)}{\bar\pi_{\theta_k}(a\mid s)}A^{\bar\pi_{\theta_k}}(s,a)\right],\]</p>
<p>\[\overline D_{\mathrm{KL}}(\theta\Vert\theta_k)=\mathbb E_{s\sim\bar\pi_{\theta_k}}\left[D_{\mathrm{KL}}\bigl(\bar\pi_\theta(\cdot\mid s)\Vert\bar\pi_{\theta_k}(\cdot\mid s)\bigr)\right].\]</p>
<p>The objectives are expanded in Taylor series:</p>
<p>\[\max_\theta g^\top(\theta-\theta_k)\quad\text{subject to}\quad\tfrac12(\theta-\theta_k)^\top H(\theta-\theta_k)\le\delta.\]</p>
<p>The KL-divergence term vanishes at first order at \(\theta=\theta_k\). Here \(g\) is the objective gradient and \(H\) the KL Hessian at \(\theta_k\). For positive-definite \(H\) and \(g\ne0\), this local problem can be analytically solved:</p>
<p>\[\theta_{k+1}=\theta_k+\sqrt{\frac{2\delta}{g^\top H^{-1}g}}H^{-1}g.\]</p>
</div></details>
<h2 id="ppo">Proximal Policy Optimization (PPO)</h2>
<p>[[PPO]]: similar motivation as TRPO.</p>
<ul><li>PPO-penalty: approximately solves a KL-constrained update like TRPO, but instead of making it a hard constraint, it uses it as an annealed penalty.</li><li>[[PPO-clip]]: does not have constraints in the objective. Relies on specialized clipping of the objective function.</li></ul>
<p>Taking multiple steps of minibatch stochastic gradient ascent to maximize the objective. Usually combined with methods like early stopping to prevent the new policy from drifting too far away from the old one.</p>
<details class="supplementary-proof"><summary>PPO-clip objective</summary><div class="proof-content">
<p>\[\theta_{k+1}\in\operatorname*{argmax}_\theta\mathbb E_{s,a\sim\bar\pi_{\theta_k}}[L(s,a,\theta_k,\theta)].\]</p>
<p>Write \(r_\theta=\bar\pi_\theta(a\mid s)/\bar\pi_{\theta_k}(a\mid s)\) and \(A=A^{\bar\pi_{\theta_k}}(s,a)\). Then</p>
<p>\[L=\min\bigl(r_\theta A,\operatorname{clip}(r_\theta,1-\epsilon,1+\epsilon)A\bigr).\]</p>
<p>Can also be written as \(L=\min(r_\theta A,g(\epsilon,A))\), where</p>
<p>\[g(\epsilon,A)=\begin{cases}(1+\epsilon)A,&A\ge0,\\(1-\epsilon)A,&A&lt;0.\end{cases}\]</p>
</div></details>
<h2 id="ddpg">Deep Deterministic Policy Gradient (DDPG)</h2>
<ul><li>Concurrently learns a Q-function and a policy.</li><li>Uses off-policy data and the Bellman equation to learn the Q-function.</li><li>For continuous action spaces using gradients, like Q-learning for continuous action spaces.</li></ul>
<h3 id="replay">Replay buffers</h3>
<p>Set \(D\) of previous experiences. Should be large enough to contain a wide range of experiences, even if they were obtained using an outdated policy, but retaining everything should be avoided as it slows down training.</p>
<p>The replay buffer helps to handle the non-iid data problem.</p>
<h3 id="targets">Target networks</h3>
<p>DDPG makes use of target networks. Write \(\phi\) for the parameters of the Q-function. The target also depends on \(\phi\), which makes training unstable. The solution is to use a set of parameters which comes close to \(\phi\) but with a time delay: a second network called the target network which lags the first, whose parameters are called \(\phi_{\mathrm{targ}}\).</p>
<p>The target network is updated by Polyak averaging, with averaging coefficient \(0\leq\rho&lt;1\):</p>
<p>\[\phi_{\mathrm{targ}}\leftarrow\rho\phi_{\mathrm{targ}}+(1-\rho)\phi.\]</p>
<h3 id="ddpg-q">Q-learning side of DDPG</h3>
<p>If the approximator of \(Q^*(s,a)\) is a neural network \(Q_\phi(s,a)\), and we have collected a set \(D\) of transitions \((s,a,r,s',d)\), where \(d\) indicates whether the next state is terminal, we can set up a squared Bellman-target loss.</p>
<p>\[r+\gamma(1-d)\max_{a'}Q_\phi(s',a')\]</p>
<p>is called the target.</p>
<p>Calculating the maximum over actions in the target is handled by using a target policy network to compute an action that approximately maximizes \(Q_{\phi_{\mathrm{targ}}}\). In the same way as the target Q-function, the target policy network is found by Polyak averaging the policy parameters over the course of training.</p>
<details class="supplementary-proof"><summary>DDPG critic loss</summary><div class="proof-content">
<p>The DDPG critic objective below is the mean Bellman squared error (MBSE): the average squared difference between the current Q estimate and a sampled one-step Bellman target over transitions from the replay set \(D\). The next-state action in this target comes from the target policy.</p>
<p>Q-learning in DDPG minimizes this loss using stochastic gradient descent (SGD):</p>
<p>\[L(\phi,D)=\mathbb E_{(s,a,r,s',d)\sim D}\left[\left(Q_\phi(s,a)-\left(r+\gamma(1-d)Q_{\phi_{\mathrm{targ}}}(s',\mu_{\theta_{\mathrm{targ}}}(s'))\right)\right)^2\right],\]</p>
<p>where \(\mu_{\theta_{\mathrm{targ}}}\) is the target policy.</p>
</div></details>
<h3 id="ddpg-policy">The policy learning side of DDPG</h3>
<p>We want to learn a deterministic policy \(\mu_\theta(s)\) which gives the action that maximizes \(Q_\phi(s,a)\). If we assume \(Q\) is differentiable with respect to the action, we perform gradient ascent to solve</p>
<p>\[\max_\theta\mathbb E_{s\sim D}[Q_\phi(s,\mu_\theta(s))].\]</p>
<p>Note that the Q-function parameters are treated as constants.</p>
<p>For exploration: since the policy is deterministic, noise is added to the actions at training time. Noise is not added at test time.</p>
<h2 id="td3">Twin Delayed DDPG (TD3)</h2>
<p>Standard [[DDPG]] is tuning-sensitive. The learned Q-function can dramatically overestimate Q-values, and the policy breaks.</p>
<p>[[TD3]]: off-policy algorithm for continuous action spaces.</p>
<ul><li><strong>Clipped Double-Q Learning.</strong> Learns two Q-functions and uses the smallest of the two to form the targets.</li><li><strong>Delayed Policy Updates.</strong> Updates the policy and target networks less frequently than the Q-function. One policy update for every two Q-function updates.</li><li><strong>Target Policy Smoothing.</strong> Adds noise to the target action to make it harder for the policy to exploit Q-function errors by smoothing out Q along changes in action.</li></ul>
<details class="supplementary-proof"><summary>TD3 targets and losses</summary><div class="proof-content">
<p>Target policy smoothing:</p>
<p>\[a'(s')=\operatorname{clip}\left(\mu_{\theta_{\mathrm{targ}}}(s')+\operatorname{clip}(\varepsilon,-c,c),a_{\mathrm{Low}},a_{\mathrm{High}}\right),\quad\varepsilon\sim N(0,\sigma^2I).\]</p>
<p>Both Q-functions use a single target:</p>
<p>\[y(r,s',d)=r+\gamma(1-d)\min_{i=1,2}Q_{\phi_{i,\mathrm{targ}}}(s',a'(s')).\]</p>
<p>Then both are learned by regressing to \(y\):</p>
<p>\[L(\phi_i,D)=\mathbb E_{(s,a,r,s',d)\sim D}\left[(Q_{\phi_i}(s,a)-y(r,s',d))^2\right],\qquad i=1,2.\]</p>
<p>Using the smaller Q-value for the targets. The initial diversity at initialization, \(\phi_1^{(0)}\ne\phi_2^{(0)}\), and nonlinear neural network optimization make it so that they have different approximation errors.</p>
</div></details>
<p>Lastly, the policy is learned by maximizing \(Q_{\phi_1}\):</p>
<p>\[\max_\theta\mathbb E_{s\sim D}[Q_{\phi_1}(s,\mu_\theta(s))].\]</p>
<h2 id="sac">Soft Actor-Critic (SAC)</h2>
<ul><li>Stochastic policy.</li><li>Off-policy.</li><li>Incorporates the clipped Double-Q trick.</li></ul>
<p>[[SAC]] utilizes [[entropy regularization]] to maximize a tradeoff between expected return and exploration. Can help to prevent the policy from prematurely converging to a bad local optimum.</p>
<p>In entropy-regularized RL, the agent gets a bonus reward at each timestep proportional to the entropy at that timestep.</p>
<p>\[H(P)=\mathbb E_{x\sim P}[-\log p(x)].\]</p>
<p>\[\bar\pi^*\in\operatorname*{argmax}_{\bar\pi}\mathbb E_{\tau\sim\bar\pi}\left[\sum_{t=0}^\infty\gamma^t\left\{R(s_t,a_t,s_{t+1})+\alpha H(\bar\pi(\cdot\mid s_t))\right\}\right],\]</p>
<p>where \(\alpha&gt;0\) is the tradeoff coefficient.</p>
<p>Once again, the setting is one policy \(\bar\pi_\theta\) and two Q-functions \(Q_{\phi_1},Q_{\phi_2}\). The regularization coefficient \(\alpha\) can either be constant or annealed.</p>
<h3 id="sac-td3">Similar to TD3</h3>
<ul><li>Both Q-functions are learned by regressing to a single shared target.</li><li>The shared target is computed using target Q-networks, obtained by Polyak averaging the Q-network parameters.</li><li>Clipped Double-Q trick.</li></ul>
<h3 id="sac-differences">Different from TD3</h3>
<ul><li>Entropy regularization term.</li><li>The next-state actions come from the current policy instead of a target policy.</li><li>No explicit target policy smoothing.</li></ul>
<details class="supplementary-proof"><summary>Soft values and the SAC critic target</summary><div class="proof-content">
<p>\[V^{\bar\pi}(s)=\mathbb E_{\tau\sim\bar\pi}\left[\sum_{t=0}^\infty\gamma^t\left\{R(s_t,a_t,s_{t+1})+\alpha H(\bar\pi(\cdot\mid s_t))\right\}\mid s_0=s\right].\]</p>
<p>Q also includes entropy bonuses from every timestep except the first.</p>
<p>\[Q^{\bar\pi}(s,a)=\mathbb E\left[\sum_{t=0}^\infty\gamma^tR(s_t,a_t,s_{t+1})+\alpha\sum_{t=1}^\infty\gamma^tH(\bar\pi(\cdot\mid s_t))\mid s_0=s,a_0=a;\ \bar\pi\text{ thereafter}\right].\]</p>
<p>\[V^{\bar\pi}(s)=\mathbb E_{a\sim\bar\pi(\cdot\mid s)}[Q^{\bar\pi}(s,a)]+\alpha H(\bar\pi(\cdot\mid s)).\]</p>
<p>The Bellman equation for \(Q^{\bar\pi}\) is</p>
<p>\[Q^{\bar\pi}(s,a)=\mathbb E_{s'\sim P(\cdot\mid s,a)}[R(s,a,s')+\gamma V^{\bar\pi}(s')].\]</p>
<p>Analyze the contribution of the entropy term:</p>
<p>\[Q^{\bar\pi}(s,a)=\mathbb E_{s',\,a'\sim\bar\pi(\cdot\mid s')}\left[R(s,a,s')+\gamma\left(Q^{\bar\pi}(s',a')-\alpha\log\bar\pi(a'\mid s')\right)\right].\]</p>
<p>The next action is sampled from the policy; \(s'\) and \(r\) come from the replay buffer. Since it is an expectation, we can approximate it with samples. For \(i=1,2\),</p>
<p>\[L(\phi_i,D)=\mathbb E_{(s,a,r,s',d)\sim D,\,\widetilde a'\sim\bar\pi_\theta(\cdot\mid s')}[(Q_{\phi_i}(s,a)-y(r,s',d))^2],\]</p>
<p>where</p>
<p>\[y(r,s',d)=r+\gamma(1-d)\left[\min_{j=1,2}Q_{\phi_{j,\mathrm{targ}}}(s',\widetilde a')-\alpha\log\bar\pi_\theta(\widetilde a'\mid s')\right].\]</p>
</div></details>
<h3 id="sac-policy">Learning the policy</h3>
<p>Policy should act to maximize the expected future return plus expected future entropy.</p>
<p>Reparametrization trick: the sample is</p>
<p>\[\widetilde a_\theta(s,\xi)=\tanh\bigl(\mu_\theta(s)+\sigma_\theta(s)\odot\xi\bigr),\qquad\xi\sim N(0,I).\]</p>
<p>The squashing function, \(\tanh\), ensures that actions are bounded to a finite range. The log-probabilities can still be computed in closed form.</p>
<details class="supplementary-proof"><summary>SAC policy objective</summary><div class="proof-content">
<p>The expectation can be rewritten with parameter-independent noise. SAC uses</p>
<p>\[\max_\theta\mathbb E_{s\sim D,\,\xi\sim N(0,I)}\left[\min_{j=1,2}Q_{\phi_j}(s,\widetilde a_\theta(s,\xi))-\alpha\log\bar\pi_\theta(\widetilde a_\theta(s,\xi)\mid s)\right].\]</p>
<p>The Q-function parameters are held fixed in this policy update. The log-probability is that of the squashed action.</p>
</div></details>
<p>The entropy term explicitly controls exploration. Higher \(\alpha\): more exploration. \(\alpha\) is basically the temperature and requires careful tuning.</p>
<h2 id="shac">Short-Horizon Actor Critic (SHAC)</h2>
<ul><li>Stochastic policy.</li><li>On-policy.</li></ul>
<p>[[SHAC]] learns a policy network \(\bar\pi_\theta\) and a value network \(V_\phi\) and splits the entire task horizon into several sequences of smaller horizons across learning episodes.</p>
<p>Multi-step reward in the subwindow plus a terminal value estimation from the learned critic.</p>
<p>The idea: consider a horizon \(h\) that is much smaller than the terminal horizon \(T\): \(h\ll T\). Instead of propagating the gradient over all the timesteps, it is cut at the horizon \(h\).</p>
<p>This requires differentiating through the simulated transitions and rewards.</p>
<details class="supplementary-proof"><summary>Short-horizon return and actor loss</summary><div class="proof-content">
<p>Consider the full return until termination:</p>
<p>\[G_{0:T}(\theta)=\sum_{t=0}^{T-1}\gamma^t r(s_t,a_t).\]</p>
<p>Its tail is \(G_{h:T}(\theta;s_h(\theta))=\sum_{t=0}^{T-h-1}\gamma^t r(s_{h+t},a_{h+t})\). Then</p>
<p>\[G_{0:T}(\theta)=G_{0:h}(\theta)+\gamma^hG_{h:T}(\theta;s_h(\theta)).\]</p>
<p>Its gradient is</p>
<p>\[\frac{dG_{0:T}}{d\theta}=\frac{dG_{0:h}}{d\theta}+\gamma^h\left[\left.\frac{\partial G_{h:T}}{\partial\theta}\right|_{s_h}+\frac{\partial G_{h:T}}{\partial s_h}\frac{ds_h}{d\theta}\right].\]</p>
<p>SHAC approximates the tail with \(V_{\phi'}(s_h)\) and treats \(\phi'\) as fixed during the actor update.</p>
<p>Computationally, we start with a policy \(\bar\pi_\theta\) and simulate paths of length \(h\). We need to keep the state \(s_h\). The policy loss is computed from these paths:</p>
<p>\[\mathcal L_\theta=-\frac{1}{Nh}\sum_{i=1}^N\left[\sum_{t=t_0}^{t_0+h-1}\gamma^{t-t_0}r(s_t^i,a_t^i)+\gamma^hV_{\phi'}(s_{t_0+h}^i)\right].\]</p>
<p>Then we compute \(\nabla_\theta\mathcal L_\theta\) to optimize \(\bar\pi_\theta\), making sure to cut the computational graph at the block boundary.</p>
<p>After updating the policy, we use the trajectories collected in the current block to train \(V_\phi\) using a mean squared error:</p>
<p>\[\mathcal L_\phi=\mathbb E_s[(V_\phi(s)-\widetilde V(s))^2].\]</p>
<p>\[n=t_0+h-t,\qquad 0\leq\lambda\leq1,\]</p>
<p>\[\widetilde V(s_t)=(1-\lambda)\sum_{k=1}^{n-1}\lambda^{k-1}G_t^k+\lambda^{n-1}G_t^n,\]</p>
<p>where</p>
<p>\[G_t^k=\sum_{\ell=0}^{k-1}\gamma^\ell r_{t+\ell}+\gamma^kV_{\phi'}(s_{t+k})\]</p>
<p>is the \(k\)-step return from time \(t\).</p>
<p>\(\widetilde V(s)\) is treated as constant during critic training.</p>
</div></details>
<h2 id="sources">References</h2><p class="course-references">Josh Achiam, <em>Spinning Up in Deep RL</em>, OpenAI (2018), for VPG, TRPO, PPO, DDPG, TD3, and SAC. Zhiqing Xiao, <em>Reinforcement Learning: Theory and Python Implementation</em> (2024), for deep value-based and actor–critic methods.</p>
