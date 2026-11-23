# Evidence ledger, checked November 23, 2026

## Lead selected for a bounded engineering experiment

### Original workflow report
- URL: https://www.reddit.com/r/mlops/comments/1xykfu0/how_do_you_score_insufficient_visual_evidence_in/
- Site/type: Reddit r/mlops, firsthand self-report by observed handle u/AwakeFlask. Identity and commercial status unverified.
- Original timestamp read from live page: November 17, 2026 13:28:13 UTC.
- Read: full original post and visible replies, including OP follow-up, in a browser on November 23.
- What it supports: a reported bicycle-photo triage prototype used Braintrust evaluation; a mechanic's review disagreed with favorable scores on outputs whose photos lacked enough detail. OP considered separate assessability labels and answer-quality scoring, and wanted to avoid rewarding blanket requests for more information.
- Follow-up: OP said the mechanic could help define component-specific visibility criteria. Other handles suggested explicit labels or an initial evidence check. These are advice, not verified independent customers.
- What it does not support: demand for Evidence Lens, willingness to adopt a new tool, budget, repeated usage, willingness to pay or independent confirmation of the report.
- Our interpretation: a local inspection tool may make evidence/action errors easier to see in reviewed exports. The post did not request this implementation.

### Official existing platform capability
- URL: https://docs.braintrust.dev/evaluate/custom-code
- Site/type: official Braintrust documentation, fetched in full.
- Supports: custom numeric scorers and categorical classifiers can implement application-specific logic in SDK, CLI-pushed code or UI.
- Implication: the original platform can implement this workflow. Evidence Lens is a proposed convenience, not a capability that Braintrust lacks.
- URL: https://docs.braintrust.dev/best-practices/scorers
- Site/type: official design guidance, fetched in full.
- Supports: task-specific clear criteria and scorer calibration. No claim that this app improves existing Braintrust results.

### Selective-prediction overlap
- URL: https://github.com/ercedut/selective-prediction-toolkit
- Type: repository and README, fetched in full.
- Supports: existing risk/coverage, AURC/AUGRC and calibrated threshold workflows.
- Distinction being tested: human-labeled evidence sufficiency and explicit observed answer/abstention decisions, not confidence threshold selection. Metrics are not novel.
- URL: https://github.com/Daveyuwang/caat
- Type: repository and README, fetched in full.
- Supports: saved-prediction evaluation, calibration, per-group results and routing/audit workflows already exist.
- Implication: do not expand into a generic calibration toolkit.

### Abstention benchmark overlap
- URL: https://github.com/jcartu/lil-abstain-bench
- Type: repository and README, fetched in full. Repository metadata says created November 16, 2026.
- Supports: an existing model-running benchmark addresses epistemic abstention, explicit non-ok response handling and paired comparisons on fixed suites.
- Distinction being tested: a team's own human-reviewed task results, no endpoint or model run. Not a claim of superiority.
- URL: https://github.com/tjromack/spancheck
- Type: repository and README, fetched in full.
- Supports: existing RAG evaluation/audit tooling includes grounding and abstention, so do not market the broad area as empty.

### Research context
- URL: https://arxiv.org/html/2604.14799v1
- Type: research manuscript, fetched in full; title concerns abstention in multimodal reasoning systems.
- Supports: multimodal evidence insufficiency and abstention are established research topics. The manuscript's quantitative results were not independently reproduced and are not used to claim this app's effectiveness.

## Other candidates screened, not selected

### Small-model error exploration
- Original fresh report: https://www.reddit.com/r/learnmachinelearning/comments/1y3nf3q/our_exercise_classifier_keeps_missing_obvious/
- Timestamp from current feed: November 23, 2026 16:54:03 UTC. Full post and visible reply read.
- Observed handle u/hardachiever reports a graduation-project pose-feature Random Forest missing incorrect repetitions despite tuning; asks for diagnosis, not a dashboard.
- User-provided figures in that report: 349 repetitions, 70 people, participant-separated 5-fold CV, Macro F1 about 0.75, 30/67 incorrect repetitions detected and 8 false alarms. These are not independently verified.
- Rejected generic dashboard because close solutions exist: https://harmanpreetsingh.me/projects/ml-failure-lab and https://github.com/uber/manifold/ . Both original pages fetched. These document upload-based error/slice analysis with feature comparisons or threshold tools. No rehabilitation or clinical product is being built.

### Grader correctness
- Firsthand engineering report: https://ciq.com/blog/measuring-local-llm-cost-grader-bugs-limits
- Dated November 17, 2026, full page fetched. Author reports four silent grader bugs changing local-model rankings. This is a report, not a request for software or independently reproduced result.
- Rejected a generic grader mutation toolkit because close tools already exist, originals fetched: https://github.com/egnaro9/evalmut and https://sieve.apothuru.com/ and https://github.com/FikriAlfaraby/judge-mutants .

### Coding-agent loops
- Firsthand report: https://tsvinc.dev/posts/how-local-agents-failed/ , November 17, 2026, full page fetched.
- Related guard implementation: https://tsvinc.dev/posts/doom-loop-never-asked/ , November 3, 2026, full page fetched.
- Existing upstream work: https://github.com/anomalyco/opencode/pull/61328 , full page fetched, returned open-state metadata with a November 16 update.
- Rejected simple loop detector because the reporting author already built a guard and upstream work addresses the same problem. We have not reproduced the incidents or verified current merge state through a repository clone.

### Generic LLM evaluation harness
- Promotional post: https://dev.to/litmustools/i-got-tired-of-breaking-my-llm-app-with-one-small-prompt-change-so-i-built-a-450-line-eval-4546 , November 11, 2026, full page fetched.
- Documents an existing small evaluator product. Vendor language and purchase price are not buyer demand.

### Learning model internals
- Fresh question: https://www.reddit.com/r/learnmachinelearning/comments/1y3lcq5/coming_from_karpathys_makemore_how_to_actually/ , November 23, full page fetched.
- Existing educational code: https://github.com/karpathy/nanochat and https://github.com/karpathy/llm.c , original pages fetched.
- No unmet new-product need established. Do not infer paid training compute fits the free-only requirement.

## Validation still missing

No outreach has been sent. No adopter, real imported evaluation file, repeat use or willingness to pay is established. The demo is synthetic. A useful next question is whether the r/mlops author's existing Braintrust views already meet their needs, or whether an offline two-axis review is useful. Any outreach wording and recipient require user review before sending, and subreddit rules must permit it. No earnings, donations or payment accounts are configured. Do not imply affiliation or endorsement from the source authors or existing tools.

## Participation check, November 24, 2026

Expanded live r/mlops rules at https://www.reddit.com/r/mlops/ prohibit agent-posted discourse. No automated post/comment or cold-DM workaround is planned for this community. No outreach has been sent. The source author profile at https://www.reddit.com/user/AwakeFlask/ was readable and consistent with the observed handle and post, but this does not authenticate identity, independence or purchase intent. A human-led conversation or a different permitted research venue would be needed.
