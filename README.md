# Evidence Lens

Offline inspection of evidence-aware AI evaluation results. Open `dist/EvidenceLens.html` in a desktop browser, or extract the downloadable ZIP and open `EvidenceLens.html`. No installation, account, model download, API key or server is needed to use the app.

**Engineering preview. Not validated demand, a proven business or an automatic AI evaluator.**

## The problem this tests

A November 17, 2026 r/mlops post describes a bicycle-photo triage prototype whose evaluation rubric rewarded plausible defect claims even when a mechanic said the photo did not support them. The author wanted to separate evidence sufficiency from answer quality without rewarding blanket refusal. That is a specific reported workflow, not a request for this app, an authenticated buyer or a purchase commitment. See [docs/evidence.md](docs/evidence.md).

Evidence Lens tests a narrow convenience hypothesis: can teams inspect their own reviewed results more easily in a single local file than by assembling custom scorers and reports? Existing tools already cover much of the underlying evaluation space. No new metric or unique market is claimed.

## What it does

- Imports strict CSV or JSONL, preserving IDs as strings.
- Separates human evidence labels (`sufficient`, `insufficient`, `unknown`) from observed decisions (`answer`, `abstain`, `error`, `truncated`).
- Keeps answer correctness separate, and only accepts quality labels for answers with sufficient evidence.
- Displays unsupported answers, unnecessary abstentions, reviewed answer accuracy, coverage, completion and known-correct useful yield, with explicit numerators and denominators.
- Retains unreviewed evidence, missing quality labels and execution failures visibly. No silent passes, zero-denominator zeros or combined safety score.
- Filters by run, group and outcome; inspect the underlying notes and IDs.
- Compares matching IDs across two runs. Conflicting evidence/group labels are excluded and listed, as are unmatched IDs. No automatic winner or significance test.
- Downloads an audit JSON and filtered JSONL. Downloaded files contain notes and IDs, so review before sharing.
- Includes a clearly synthetic example contrasting answer-everything, refuse-everything and a mixed policy.
- Rejects invalid input rather than quietly coercing it. Per-input generation tokens discard superseded asynchronous file reads.

## Input

Required fields: `id`, `run`, `evidence`, `decision`. Optional: `correct`, `group`, `note`.

```csv
id,run,evidence,decision,correct,group,note
case-1,baseline,sufficient,answer,true,clear-photo,Human reviewed
case-2,baseline,insufficient,answer,,blurred-photo,Claim beyond available evidence
case-3,baseline,sufficient,abstain,,clear-photo,Answerable but declined
```

JSONL uses objects with the same fields; `correct` must be a JSON boolean or null, not a string. CSV `correct` must be `true`, `false` or empty. Unknown headers/keys, duplicate IDs within a run, malformed CSV, unsupported values and contradictory correctness fields are errors. Up to 50,000 rows / 20 MiB UTF-8 text. Blank group values become `(ungrouped)`.

Human reviewers must establish sufficiency against the evidence the evaluated system was allowed to use. A substantive guess is an `answer`, even if paired with a disclaimer. Failed or cut-off execution is `error` or `truncated`, not a refusal. Do not use the app to make clinical decisions or infer hidden evidence. Use anonymized data.

## Metric definitions

| Metric | Numerator / denominator |
|---|---|
| Unsupported-answer rate | Answers / completed cases labeled insufficient |
| Unnecessary-abstention rate | Abstentions / completed cases labeled sufficient |
| Reviewed answer accuracy | Correct / quality-reviewed sufficient-evidence answers |
| Coverage | Answers / completed known-evidence cases |
| Completion | Answers plus abstentions / all records |
| Known-correct useful yield | Known-correct sufficient-evidence answers / all sufficient-evidence records |

Completed means answer or abstain. Unknown evidence is excluded from behavior denominators. Execution failures remain in completion and useful-yield denominators where applicable. Missing answer quality is not treated as correct. A zero denominator displays **Not measurable**, not 0%. Useful yield is a conservative count of known-correct results in this sample, not an estimate of unreviewed performance.

## Privacy and security

The app is self-contained, makes no runtime network requests, has no telemetry, and writes no browser storage. A restrictive Content Security Policy blocks network connections. Imported strings are rendered through text nodes, never HTML. Files and pasted content remain in memory until cleared or the tab closes. This is not forensic secure erasure and cannot protect against browser extensions or a compromised device. JSON downloads contain the imported notes and IDs. There are no bundled credentials, real user data, model weights or remote scripts.

## Limits

This does not judge image sufficiency, classify responses automatically, run models, select thresholds, annotate images, provide provider-specific import adapters, store projects, or claim statistical significance. Comparisons assume matching IDs refer to the same experiment inputs; IDs alone cannot prove this. Labels may be wrong, subjective or inconsistent. Convenience and adoption remain untested. It is not a replacement for Braintrust, domain review or selective-prediction research.

Verified locally in Linux Chromium only. Windows, macOS, mobile operating systems, Firefox and WebKit have not been tested. Responsive viewport checks are not claims of testing a real phone. No hosted deployment or CI is configured.

## Development and checks

Node.js 22 was used for the local checks. Development test dependencies are separate from the dependency-free app.

```sh
npm ci
npm run build
npm test
npx playwright install chromium
npm run test:browser
```

`core.js` owns parsing, validation, metrics and matched-case comparison. `app.js` owns the interface and file-read handling. `template.html` owns layout and explanatory copy. `build.js` creates the standalone artifact. `tests/core.test.js` and `tests/browser.spec.js` reproduce the checks.

Local v0.1.1 checks: 39 unit tests and 12 Chromium browser tests, including 200 generated CSV round trips, 50,000-row import, matched-ID exclusion, failed/truncated/unknown records, HTML-injection handling, stale file reads, JSON download and 320/390/1280px responsive checks. See source tests rather than treating the counts as evidence of completeness.

## Rights

No license granting reuse has been selected. Source-visible is not the same as open-source. Third-party software used in development retains its own licenses. No third-party product code is copied into the application.

## v0.1.1 cleanup

Clear and input replacement now remove rendered records and run labels from the hidden results DOM, rather than only hiding them. This improves cleanup; it is still not forensic secure erasure. A browser regression covers the old behavior. An additional deterministic reference test compares four rates across 1,000 generated datasets.
