---
layout: model
title: "Hawkes Tools"
permalink: /models/hawkes-tools/
date: 2026-09-23 00:00:00 +0900
updated: 2026-09-23
image: /assets/thumbs/models/hawkes-tools.png
image_alt: "Simulated Hawkes intensity and a periodic baseline, with event times below"
image_fit: contain
summary: "Python tools for simulating event streams, estimating Hawkes interactions, and exploring point-process models through a reproducible gallery."
model_type: Statistical
domain: Hawkes and point processes
language: Python
inputs: Event timestamps or simulation parameters
outputs: Simulated events, intensities, and estimated kernels
maturity: "Version 0.1.0; documented support matrix"
tags: [Hawkes processes, point processes, simulation, statistical inference, Python]
brief: "Hawkes Tools brings simulation, estimation, and diagnostic plots into one standalone Python package. The gallery connects each method to an executable example, from a changing background event rate to multivariate interaction estimates."
purpose: "Study clustered event arrivals and compare simulation or estimation methods on controlled examples and supplied datasets."
use_cases:
  - Simulate periodic event activity
  - Estimate interactions between event streams
  - Compare kernel estimation methods
  - Inspect intensity and residual diagnostics
limitations: "Support varies by estimator. RKHS bandwidth is user-selected. Reproducing random streams from compiled implementations and asynchronous solver-worker behavior are outside the supported scope."
updates:
  - date: 2026-09-23
    title: "Initial model page, repository snapshot, gallery guide, and an original rendering of experiment 19."
resources:
  - label: Source code
    type: source
    url: https://github.com/luisivanhr/hawkes-tools
  - label: View example notebook
    type: notebook
    url: /models/hawkes-tools-gallery/
  - label: Download notebook
    type: notebook
    url: /assets/notebooks/hawkes-tools/gallery.ipynb
  - label: API support and limitations
    type: note
    url: https://github.com/luisivanhr/hawkes-tools/blob/004a1220fdf5be9c11bd55ac8bb534f0d433faf7/PARITY.md
---

## What the package does

Hawkes processes describe event arrivals whose rate depends on earlier events. An event can temporarily increase the rate of further arrivals in its own stream or in another stream. The **baseline** gives the background rate; the **kernel** describes how an event's contribution changes with elapsed time. Together, they let us study recurring activity, clusters, and interactions between streams.

`hawkes-tools` provides simulators, parametric and non-parametric estimators, and plotting helpers for these models. We can generate timestamps from specified parameters, fit supported models to observed timestamps, and inspect estimated kernels or intensities. The package also includes regression, optimization, survival-analysis, and dataset utilities used throughout its gallery.

## Current state

This page describes repository commit [`004a122`](https://github.com/luisivanhr/hawkes-tools/tree/004a1220fdf5be9c11bd55ac8bb534f0d433faf7). Its package metadata declares **version 0.1.0** and **Python 3.11 or later**, with NumPy, SciPy, Matplotlib, and Numba as required dependencies. Numba compiles numerical routines on first use, so initial execution includes compilation time. PyTorch is an optional dependency for the PyTorch-backed cumulant learners.

The Hawkes API includes exponential, sum-exponential, power-law, and time-function kernels. Estimation methods include likelihood and least-squares models, expectation-maximization (EM), conditional-law estimation, basis kernels, cumulant matching, and a univariate reproducing kernel Hilbert space (RKHS) estimator. The [support matrix](https://github.com/luisivanhr/hawkes-tools/blob/004a1220fdf5be9c11bd55ac8bb534f0d433faf7/PARITY.md) specifies the supported methods and exclusions for each family.

The [repository README](https://github.com/luisivanhr/hawkes-tools/blob/004a1220fdf5be9c11bd55ac8bb534f0d433faf7/README.md) records a stabilization baseline of 260 passing tests, 171 passing source-backed Hawkes behavior cases, and a successful run of the original 25 gallery examples. These are the repository's reported results. The linked notebook also includes an additional RKHS example. Test coverage establishes specific implementation checks; suitability for a new dataset still requires model assessment.

## Hawkes simulation with a periodic baseline

The featured figure comes from **Hawkes Process With Non-Constant Baseline Simulation**, experiment 19 in the gallery. It follows one event stream over six periods. The background rate repeats every 100 time units and ranges from 0.04 to approximately 0.20. Each event adds an exponentially decaying contribution to the intensity, with decay rate 0.1 and total area 0.5 under its kernel.

<figure>
  <a href="{{ '/assets/images/hawkes-tools/nonconstant-baseline.png' | relative_url }}">
    <img src="{{ '/assets/images/hawkes-tools/nonconstant-baseline.png' | relative_url }}" alt="A simulated Hawkes process showing event-driven intensity peaks above a periodic background rate, with event times below" loading="lazy">
  </a>
  <figcaption>Experiment 19, rendered from the simulated process. The baseline gives the repeating background rate; the intensity includes excitation from previous events. Event marks locate the simulated arrivals. Time and rate use the simulation's own units.</figcaption>
</figure>

The baseline changes on a regular schedule, and simulated events create additional peaks in the intensity. We can use this example to construct controlled experiments that combine periodic activity and event clustering. The figure illustrates a specified simulation; it does not estimate these components from observed data.

## Use cases

We can use the package to analyze observed event times, simulate event sequences, and compare estimation methods. The supplied Bund financial dataset provides an example with observed events. Other event logs can be organized into timestamp streams for each event type.

### Study relationships between financial event streams

Given separate timestamp streams for price movements or trades, we can estimate how activity in one stream relates to subsequent arrivals in another. Conditional-law and parametric estimators produce kernel curves and their integrals, which summarize interactions over time. The supplied Bund data show how to organize observations into daily realizations with different event counts. The estimated interactions describe dependence within the model and do not establish causality.

### Model recurring activity and event clustering

Service requests or operational incidents may have recurring busy periods and short bursts of activity. We can study these patterns using a periodic background rate and excitation from previous events. The package supports simulation with time-varying baselines and estimation of piecewise periodic baselines with sum-exponential kernels. Baseline and kernel plots show how the fitted model represents each component. Their interpretation depends on the specified period and kernel family.

### Test estimators under controlled conditions

We can specify background rates, interaction strengths, kernel shapes, and observation lengths, then generate repeated event sequences. Fitting models to these sequences lets us compare estimates with the values used to generate the data and examine sensitivity to sample size or regularization. We can use these comparisons to develop an inference method or check an analysis pipeline before applying it to observed data.

### Estimate kernel shapes

Non-parametric methods let us estimate how an event's contribution changes over time without choosing a single exponential kernel. EM, basis-kernel methods, and the univariate RKHS estimator provide different representations of this contribution. Basis-kernel methods express interactions as weighted combinations of shared component functions. We can inspect the estimated kernels for delayed peaks or effects that persist over longer intervals. The chosen support length sets the longest lag represented by the estimate; the RKHS estimator also requires a user-selected bandwidth that sets its lag-bin width.

### Inspect intensity and residual behavior

Intensity plots show when a model assigns high or low event rates. Time-rescaling diagnostics integrate the conditional intensity between events. A quantile-quantile (QQ) plot compares these increments with the quantiles of an exponential distribution with mean one. The [diagnostic notebook](https://github.com/luisivanhr/hawkes-tools/blob/004a1220fdf5be9c11bd55ac8bb534f0d433faf7/examples/hawkes_time_rescaling_gof.ipynb) includes checks using both generating and fitted intensities for univariate models across several kernel families. The gallery's intensity example uses the generating simulator for its QQ plot, so that plot alone does not assess the fitted learner.

## Run the examples

Clone the [repository](https://github.com/luisivanhr/hawkes-tools), open its root directory, and install the package into a suitable Python environment:

```bash
python -m pip install -e .
```

The [example notebook]({{ '/models/hawkes-tools-gallery/' | relative_url }}) displays the plots on this site. We can expand its code panels or [download the notebook]({{ '/assets/notebooks/hawkes-tools/gallery.ipynb' | relative_url }}) to run it in Jupyter. The website edition includes installation instructions and uses the same experiment code and parameters with a common plot style. Run its setup cells before selecting an example.

The source scripts under `examples/` also provide individual entry points. Smaller supplied datasets are bundled; managed external datasets can require a download and a writable cache. Consult the README for dataset sizes before loading the largest examples.

The snapshot links preserve the version described here. Consult the live repository for updates and the latest usage notes.
