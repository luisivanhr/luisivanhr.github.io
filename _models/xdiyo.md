---
title: "xDiyo"
permalink: /models/xdiyo/
date: 2025-02-01 00:00:00 +0900
updated: 2026-09-25
image: /assets/thumbs/models/xdiyo.png
hero_image: /assets/images/xdiyo/match-heatmaps.png
dossier_image: /assets/images/xdiyo/match-heatmaps-square.png
hide_image_title: true
image_alt: "Chelsea and Manchester City heatmaps, with each team's badge above its pitch"
image_fit: contain
summary: "Football analytics for constructing historical features, comparing predictive models, and examining match data."
model_type: Statistical
domain: Sports analytics
language: Python
inputs: Prepared match exports and historical team statistics
outputs: Features, predictions, evaluation reports, and saved models
maturity: "Analytics package 0.1.0 with a local experiment builder"
tags: [football, sports analytics, temporal evaluation, machine learning, Python]
brief: "xDiyo connects prepared football data to configurable experiments. The local experiment builder and Python notebooks use the same pipeline to construct features, evaluate models in time order, and save results for comparison."
purpose: "Study football match data and evaluate predictions under an explicit information schedule."
use_cases:
  - Compare team and league histories
  - Model total match corners
  - Evaluate prediction intervals and count probabilities
  - Inspect match-level errors and spatial activity
limitations: "The analytics loader requires a compatible export with manifests and their referenced relational tables. Prediction accuracy and probability calibration need assessment on the intended data."
resources:
  - label: Source code
    type: source
    url: https://github.com/luisivanhr/xDiyo
  - label: Experiment builder guide
    type: note
    url: https://github.com/luisivanhr/xDiyo/blob/HEAD/docs/analytics/ui.md
  - label: Lasso example notebook
    type: notebook
    url: https://github.com/luisivanhr/xDiyo/blob/HEAD/notebooks/18_lasso_total_corners_pipeline.ipynb
  - label: Quantile example notebook
    type: notebook
    url: https://github.com/luisivanhr/xDiyo/blob/HEAD/notebooks/19_xgboost_quantile_total_corners.ipynb
  - label: Count classifier notebook
    type: notebook
    url: https://github.com/luisivanhr/xDiyo/blob/HEAD/notebooks/20_xgboost_classifier_total_corners.ipynb
---

## What xDiyo does

xDiyo provides a football analysis pipeline from prepared match records to model evaluation. We can select competitions and seasons, construct historical team features, define a prediction target, and compare estimates with subsequent match outcomes. We can save numerical results, interactive reports, and fitted models for later use.

The installable package, `xdiyo-analytics`, is at version 0.1.0 and requires Python 3.11 or later. It includes data loading, feature construction, ratings, temporal splits, training, evaluation, and a local experiment builder. Data collection is outside the packaged analytics workflow. The examples currently emphasize total match corners, with Lasso regression, XGBoost quantiles, and exact-count classification.

## Use cases

### Compare recent form and match context

Rolling averages, variability, exponentially weighted histories, and team ratings summarize different aspects of past performance. We can compare a team's own statistics with those it concedes, examine previous encounters with an opponent, or compare recent results with a league baseline. Features can also describe rest periods and available pregame standings. Their meaning depends on the selected history window and the information cutoff for each fixture.

### Predict totals and examine uncertainty

A Lasso model predicts total corners and reports the coefficients of its standardized inputs. The quantile workflow estimates the 10th, 50th, and 90th percentiles separately, giving a conditional median and a nominal 80% prediction interval. The count classifier assigns probabilities to the integer totals observed during fitting and predicts the most probable count. The reports use evaluation measures suited to each type of prediction.

### Investigate model errors

Match-level reports connect predictions with actual outcomes, team names, and dates. Residual plots and per-league summaries help us identify groups of matches with larger errors or systematic errors at high or low totals. Quantile reports add interval coverage, width, and crossing checks. Classifier reports include count probabilities and flag totals absent from the training data. Saved results support comparisons without rerunning every completed experiment.

## Build an experiment locally

The [experiment builder](https://github.com/luisivanhr/xDiyo/blob/HEAD/docs/analytics/ui.md) configures the same `FootballExperiment` pipeline used from Python. Its forms cover data, features, targets, evaluation splits, models, and reports. **Prepare** constructs the dataset and previews its columns and folds before fitting. **Run experiment** executes the submitted configuration and retains its results.

We can save experiment recipes and export them as Python code or notebooks. This lets us configure an experiment in the local interface, then inspect or extend its calculation in code. The builder runs on the user's machine and needs its Python process to remain active.

The [Lasso notebook](https://github.com/luisivanhr/xDiyo/blob/HEAD/notebooks/18_lasso_total_corners_pipeline.ipynb) makes each stage explicit, including preprocessing and model persistence. The [quantile notebook](https://github.com/luisivanhr/xDiyo/blob/HEAD/notebooks/19_xgboost_quantile_total_corners.ipynb) expands the historical feature set and interval diagnostics. The [classifier notebook](https://github.com/luisivanhr/xDiyo/blob/HEAD/notebooks/20_xgboost_classifier_total_corners.ipynb) adds chronological parameter selection and optional class balancing.

## Evaluate predictions in time order

Historical features exclude the match being predicted and matches with the same kickoff time. By default, a match recorded as finished is eligible if its kickoff precedes the prediction cutoff. This retrospective rule does not establish when its result or statistics became available. Prediction lead times and explicit availability records can impose a stricter schedule. Pregame context, such as standings, is used as stored; the cutoff does not reconstruct earlier versions of that context.

The corner examples reserve a later season for evaluation. When model selection is enabled, candidate comparisons use earlier seasons. Preprocessing and fitted feature selection are learned from the corresponding training data. A fixed model can use newly eligible matches to update the history for later test fixtures without being refitted.

An optional final refit is separate from evaluation. Once it includes former test outcomes, that fitted model is intended for subsequent fixtures. Repeatedly adjusting a model after inspecting the same holdout makes that holdout part of model selection.

## Match heatmaps

Chelsea hosted Manchester City on April 12, 2026. The figure shows Chelsea on the left and Manchester City on the right, using 721 and 1,005 recorded spatial points respectively, including goalkeeper points.

Each heatmap is normalized by its team's point count and smoothed using the same settings. Both plots use one color scale, with turquoise, amber, and pink indicating increasing concentrations of points. The square preview rotates both pitches together to fit the panel.

<figure>
  <a href="{{ '/assets/images/xdiyo/match-heatmaps.png' | relative_url }}">
    <img src="{{ '/assets/images/xdiyo/match-heatmaps.png' | relative_url }}" alt="xDiyo: Chelsea home heatmap and Manchester City away heatmap on a shared density scale" loading="lazy">
  </a>
  <figcaption>Chelsea and Manchester City, Premier League 2025–26. Team badges identify the corresponding heatmaps.</figcaption>
</figure>

The heatmaps describe the distribution of recorded points. They do not represent continuous player tracking or model predictions.

## Data requirements and starting point

The analytics loader reads export manifests and their referenced relational tables under `_tables/`. Keep these files together when preparing a workspace so that the loader can resolve the selected competitions and seasons.

With a compatible export available, clone the [repository](https://github.com/luisivanhr/xDiyo), install the documented dependencies from its root, and open the builder:

```bash
python -m pip install -e ".[test,reporting,training,notebook]"
xdiyo-ui --workspace .
```

Start with a small selection of leagues and seasons and inspect the available fields. Missing source statistics limit the features that can be constructed.

Lasso can predict fractional or negative totals, independently fitted quantiles can cross, and class-weighted probabilities need calibration assessment. Use the reports to examine these properties on the selected data.
