---
title: A Brief Introduction to Reinforcement Learning
layout: course
permalink: /courses/reinforcement-learning/
date: 2026-09-22
updated: 2026-09-25
summary: A very brief introduction to RL, from policies and value functions to TD error, Q-learning, and deep RL architectures.
excerpt: A two-hour introduction to reinforcement learning.
image: /assets/images/reinforcement-learning/agent-environment.svg
image_alt: An agent sends actions to an environment and receives states and rewards.
course_hero_image: /assets/images/reinforcement-learning/reinforcement_learning_hero_surfaces.svg
course_hero_image_alt: Two value surfaces for the cliff-walking problem.
track: Machine learning
index_url: /courses/reinforcement-learning/index/
course_objective: I would like to give a quick overview of the concepts and the most common architectures in deep RL, with options for readers to explore further in any direction they find interesting.
sections:
  - title: "1. Motivation"
    url: /courses/reinforcement-learning/00-motivation/
  - title: "2. Key Concepts"
    url: /courses/reinforcement-learning/01-key-concepts/
  - title: "3. Value Functions and Bellman Equations"
    url: /courses/reinforcement-learning/02-value-functions/
  - title: "4. Exploration and Policy Improvement"
    url: /courses/reinforcement-learning/03-exploration/
  - title: "5. Monte Carlo Learning"
    url: /courses/reinforcement-learning/03a-monte-carlo/
  - title: "6. TD Error and Q-learning"
    url: /courses/reinforcement-learning/04-td-and-q-learning/
  - title: "7. Policy Gradients"
    url: /courses/reinforcement-learning/05-policy-gradients/
  - title: "8. Deep RL Architectures"
    url: /courses/reinforcement-learning/06-deep-rl/
---

<h2 id="introduction">A very brief introduction to RL</h2>
<p>We are interested in selecting a policy such that we optimize expected return.</p>
<p>This is a very brief introduction to reinforcement learning. Basic probability, statistics, and Markov processes are assumed. Proofs and longer derivations are collapsed and can be read separately.</p>
<p>The course follows selected passages from my <em>Reinforcement Learning</em> notes. These notes are a review of the literature, and the ideas and methods belong to the cited authors. References in each section point to the underlying sources.</p>
