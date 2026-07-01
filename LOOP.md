# 🔄 LOOP.md — TestSprite Verification Record

> **Auto-generated** by `agent-orchestrator.js` from TestSprite platform data.
> Every testId, runId, verdict, and timestamp below is pulled directly from the
> platform (`test list` + `test result --history`) — none of it is hand-written.

| | |
|---|---|
| Project | **ChurnSense API** (backend) |
| Live URL (target) | https://loop-analytics-nine.vercel.app |
| Repo | https://github.com/lidxgoesgiri/ChurnSense |
| TestSprite project | `3f03871e-9e3d-4452-9811-ea32aaff6fb8` |
| Banked tests | 5 |
| Total runs recorded | 89 |

## Loop
`Edit code` → `git push` → `Vercel auto-redeploy` → `testsprite test rerun --wait` → `read verdict` → `fix` → repeat.

The CLI runs against the live URL (never localhost). Failure detection is fully
automated via the CLI; the code fix is made by the coding agent reading the failure
bundle — this is not self-healing without intervention.

---

## Test — Edge cases: cross-field validation and risk-status boundaries
- **testId:** `74572c64-97f7-44e4-980b-ba321e3c88f3` · priority p1 · latest: ❌ FAILED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/74572c64-97f7-44e4-980b-ba321e3c88f3

### Run 1 — 2026-07-01T12:37:44.086Z · ✅ PASSED
- runId: `3dafa60b-c837-48d8-b739-17f64a4e6995` (source: cli)

### Run 2 — 2026-07-01T14:51:04.027Z · ✅ PASSED
- runId: `7b4b98eb-830c-4ba5-aa1c-fea00a79b902` (source: cli)

### Run 3 — 2026-07-01T15:16:47.111Z · ✅ PASSED
- runId: `ebe25bc4-3edc-4263-87dc-7dc85df3e578` (source: cli)

### Run 4 — 2026-07-01T15:22:04.829Z · ✅ PASSED
- runId: `af7170fb-5b27-4ea1-b256-bc74c5d2e036` (source: cli)

### Run 5 — 2026-07-01T15:24:26.513Z · ✅ PASSED
- runId: `763a7e88-c03c-499a-8a89-1174cfe1bfbc` (source: cli)

### Run 6 — 2026-07-01T15:24:52.919Z · ✅ PASSED
- runId: `e06ab6fc-9e30-46d8-8f6d-7c0a719e1ac3` (source: cli)

### Run 7 — 2026-07-01T15:27:04.062Z · ✅ PASSED
- runId: `087f42e2-716a-4ee0-894c-1e98efd44b31` (source: cli)

### Run 8 — 2026-07-01T15:27:40.169Z · ✅ PASSED
- runId: `8fb1b5bb-a515-4fc6-893a-a39e1c69a9f7` (source: cli)

### Run 9 — 2026-07-01T15:32:51.064Z · ✅ PASSED
- runId: `b9180c8c-e134-4876-904f-b2ffcff9f544` (source: cli)

### Run 10 — 2026-07-01T15:33:16.926Z · ✅ PASSED
- runId: `f7276963-a2ef-4683-9e1c-8047ed4806fb` (source: cli)

### Run 11 — 2026-07-01T15:37:44.887Z · ❌ FAILED
- runId: `b23682be-fb3f-4636-ac40-197496e78a30` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  expected 400, got 200: {"success":true,"projectName":"X","metrics":{"churnRate":5,"retentionRate":-0.125,"arpu":5,"riskStatus":"High"},"timestamp":"2026-07-01T15:37:44.847Z"}
  ```

### Run 12 — 2026-07-01T15:37:47.591Z · ❌ FAILED
- runId: `7bb3b29a-68d6-4123-8d26-1a7a509aed9c` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  expected 400, got 200: {"success":true,"projectName":"X","metrics":{"churnRate":5,"retentionRate":-0.125,"arpu":5,"riskStatus":"High"},"timestamp":"2026-07-01T15:37:47.560Z"}
  ```

## Test — Stateful chain: create project -> list -> metrics -> insight
- **testId:** `fa51e8c8-0121-4a93-aa01-0e7747666d78` · priority p0 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/fa51e8c8-0121-4a93-aa01-0e7747666d78

### Run 1 — 2026-07-01T12:20:50.154Z · ✅ PASSED
- runId: `23d74013-6562-4137-8011-6a6d3310ff2b` (source: cli)

### Run 2 — 2026-07-01T12:22:16.419Z · ✅ PASSED
- runId: `a46fa9b1-e07a-4983-9221-26a384184660` (source: cli)

### Run 3 — 2026-07-01T12:22:26.092Z · ✅ PASSED
- runId: `14b5e407-f586-4af0-9018-209438ec6c7d` (source: cli)

### Run 4 — 2026-07-01T12:23:36.952Z · ✅ PASSED
- runId: `b3698abd-cf26-4222-89ac-15883ca4be23` (source: cli)

### Run 5 — 2026-07-01T12:25:38.552Z · ✅ PASSED
- runId: `903f1e6a-ae78-4d50-9048-8fa90d742942` (source: cli)

### Run 6 — 2026-07-01T12:36:11.571Z · ✅ PASSED
- runId: `fd6930fc-cbb2-4df3-ad54-caaae696893c` (source: cli)

### Run 7 — 2026-07-01T14:51:04.066Z · ✅ PASSED
- runId: `b940ac80-eece-4121-9689-281f2d721c8d` (source: cli)

### Run 8 — 2026-07-01T15:16:47.051Z · ✅ PASSED
- runId: `72a9f76e-4d61-4051-88c1-5cb23486855f` (source: cli)

### Run 9 — 2026-07-01T15:22:24.235Z · ✅ PASSED
- runId: `12cec539-1475-42e9-99cf-b43b1cb80fa8` (source: cli)

### Run 10 — 2026-07-01T15:24:41.226Z · ✅ PASSED
- runId: `42d0dc24-014f-4e30-83a7-d5f911be6860` (source: cli)

### Run 11 — 2026-07-01T15:25:01.197Z · ✅ PASSED
- runId: `3f73e70e-36dd-4b3c-9c23-9b618d0c931f` (source: cli)

### Run 12 — 2026-07-01T15:27:18.479Z · ✅ PASSED
- runId: `72261d4b-0e77-4eed-87b6-b1519cbb522b` (source: cli)

### Run 13 — 2026-07-01T15:28:00.465Z · ✅ PASSED
- runId: `830621a2-9356-4cb9-9bd9-00a5158a50aa` (source: cli)

### Run 14 — 2026-07-01T15:33:07.260Z · ✅ PASSED
- runId: `771545e6-7925-4afe-8885-04b57d8366fb` (source: cli)

### Run 15 — 2026-07-01T15:34:24.564Z · ✅ PASSED
- runId: `62383c43-b0db-40d2-a6c5-d46945bda73d` (source: cli)

### Run 16 — 2026-07-01T15:37:46.959Z · ✅ PASSED
- runId: `2f96caea-4b62-49af-98d3-f447eaee96f0` (source: cli)

### Run 17 — 2026-07-01T15:38:07.285Z · ✅ PASSED
- runId: `90d48fa9-b675-45f0-aa28-2ec6263b4fc9` (source: cli)

## Test — Projects API: create persists to Neon and lists back
- **testId:** `b9033df7-8ae6-43e1-b50b-cad996525efa` · priority p1 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/b9033df7-8ae6-43e1-b50b-cad996525efa

### Run 1 — 2026-07-01T08:55:25.655Z · ✅ PASSED
- runId: `71d5ce3c-6579-41b2-91ab-5380da998a5e` (source: cli)

### Run 2 — 2026-07-01T11:51:33.009Z · ✅ PASSED
- runId: `44cd4a2c-8c4c-4eb4-a511-b4150009c1a9` (source: cli)

### Run 3 — 2026-07-01T11:53:46.934Z · ✅ PASSED
- runId: `77b1c4d7-21a5-4fa7-8abb-eec016d558b2` (source: cli)

### Run 4 — 2026-07-01T12:19:33.780Z · ✅ PASSED
- runId: `7fabc693-d3e9-49f0-bc2c-113e12d1dee5` (source: cli)

### Run 5 — 2026-07-01T12:22:16.270Z · ✅ PASSED
- runId: `e9e27e4d-3a54-4980-beb3-784f1f8bdfdb` (source: cli)

### Run 6 — 2026-07-01T12:23:18.022Z · ✅ PASSED
- runId: `4749c0a4-ed77-407b-bee4-d667e2a18da7` (source: cli)

### Run 7 — 2026-07-01T12:23:36.128Z · ✅ PASSED
- runId: `b63e7d44-5eec-4e08-9f4f-db087c63cc20` (source: cli)

### Run 8 — 2026-07-01T12:24:34.714Z · ✅ PASSED
- runId: `ab9567f2-7e55-4cd2-82ac-2299294ab32e` (source: cli)

### Run 9 — 2026-07-01T12:36:10.888Z · ✅ PASSED
- runId: `90f457e8-ae67-437c-beda-cb00e28aa636` (source: cli)

### Run 10 — 2026-07-01T14:51:03.999Z · ✅ PASSED
- runId: `489ea22b-7c4b-4afd-9c7a-afe38639b4ce` (source: cli)

### Run 11 — 2026-07-01T15:16:46.934Z · ✅ PASSED
- runId: `1016eae7-1e18-4f83-b4fd-5426cac40707` (source: cli)

### Run 12 — 2026-07-01T15:22:28.390Z · ✅ PASSED
- runId: `2b7f4979-b109-4ece-969c-6a417675666a` (source: cli)

### Run 13 — 2026-07-01T15:24:26.454Z · ✅ PASSED
- runId: `a15cac54-5a9d-42be-88b3-57850ba43de8` (source: cli)

### Run 14 — 2026-07-01T15:25:06.749Z · ✅ PASSED
- runId: `b97ad884-a42e-4c15-bcad-f1776cb98824` (source: cli)

### Run 15 — 2026-07-01T15:27:04.198Z · ✅ PASSED
- runId: `57e7c220-3545-42b8-9be8-9d70c9311c4a` (source: cli)

### Run 16 — 2026-07-01T15:28:05.642Z · ✅ PASSED
- runId: `6a4d5802-864e-4ab0-a664-6b466b3d57fe` (source: cli)

### Run 17 — 2026-07-01T15:32:51.916Z · ✅ PASSED
- runId: `0c32e366-ccdb-4002-bd5e-6bc19b881775` (source: cli)

### Run 18 — 2026-07-01T15:33:26.613Z · ✅ PASSED
- runId: `4f362035-1f76-42a3-a9d7-ddec5ea0b604` (source: cli)

### Run 19 — 2026-07-01T15:37:45.031Z · ✅ PASSED
- runId: `e2a9223a-cea8-44a3-a897-691fc29bb07b` (source: cli)

### Run 20 — 2026-07-01T15:38:12.741Z · ✅ PASSED
- runId: `be93f2a0-a6fa-41cb-a9cf-45addd08be84` (source: cli)

## Test — Insights + auth: AI insight shape, input validation, dummy login
- **testId:** `27bb1a1a-299f-41aa-bdda-21c03186fc58` · priority p1 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/27bb1a1a-299f-41aa-bdda-21c03186fc58

### Run 1 — 2026-07-01T08:55:30.548Z · ✅ PASSED
- runId: `6770e20e-0da9-4fb8-9e6a-5d80ef2f457d` (source: cli)

### Run 2 — 2026-07-01T11:51:33.473Z · ✅ PASSED
- runId: `6a3588b7-7c95-481f-8532-df9fa71dda51` (source: cli)

### Run 3 — 2026-07-01T11:53:46.320Z · ✅ PASSED
- runId: `6a2efda4-998c-4a70-b1b2-47ee4407b256` (source: cli)

### Run 4 — 2026-07-01T12:19:33.819Z · ✅ PASSED
- runId: `a17a7cef-45cb-4344-9136-9c2166180c0a` (source: cli)

### Run 5 — 2026-07-01T12:22:15.899Z · ✅ PASSED
- runId: `ce1436b0-3812-4732-a166-592e515fc913` (source: cli)

### Run 6 — 2026-07-01T12:22:35.507Z · ✅ PASSED
- runId: `82b843d7-046b-4f46-b398-9547498c2bfb` (source: cli)

### Run 7 — 2026-07-01T12:23:36.232Z · ✅ PASSED
- runId: `e06c1a71-71b5-466e-b2fe-93a8b115306a` (source: cli)

### Run 8 — 2026-07-01T12:25:39.187Z · ✅ PASSED
- runId: `12160565-70b8-4179-b2e4-2f1e581723c1` (source: cli)

### Run 9 — 2026-07-01T12:36:10.821Z · ✅ PASSED
- runId: `65d828df-4035-4029-8501-d970c218cf7c` (source: cli)

### Run 10 — 2026-07-01T14:51:03.828Z · ✅ PASSED
- runId: `5faab046-6a1d-409d-a496-b3203432f69a` (source: cli)

### Run 11 — 2026-07-01T15:16:46.913Z · ✅ PASSED
- runId: `dbcfc345-b23e-412c-8c47-b2ef7bb64819` (source: cli)

### Run 12 — 2026-07-01T15:22:48.170Z · ✅ PASSED
- runId: `30636911-d097-49e4-b65c-84f48f524ad2` (source: cli)

### Run 13 — 2026-07-01T15:24:33.650Z · ✅ PASSED
- runId: `7d79f44a-03f5-4ab3-9a56-c19603535f40` (source: cli)

### Run 14 — 2026-07-01T15:25:20.516Z · ✅ PASSED
- runId: `068b5b4d-8207-4b44-879e-7783bd36d797` (source: cli)

### Run 15 — 2026-07-01T15:27:05.906Z · ✅ PASSED
- runId: `0af06299-ab89-4028-b2d7-77079b757471` (source: cli)

### Run 16 — 2026-07-01T15:28:10.657Z · ✅ PASSED
- runId: `e262bd2c-bd92-404d-8472-e980240a354d` (source: cli)

### Run 17 — 2026-07-01T15:33:07.486Z · ✅ PASSED
- runId: `3d05f1d0-1966-41d4-b533-a3d5d415e204` (source: cli)

### Run 18 — 2026-07-01T15:33:46.453Z · ✅ PASSED
- runId: `9d816a59-7022-465b-8561-abdb4281fc1b` (source: cli)

### Run 19 — 2026-07-01T15:37:59.478Z · ✅ PASSED
- runId: `fa76f318-ec66-4aa7-8542-5d7a4a25790c` (source: cli)

### Run 20 — 2026-07-01T15:38:29.215Z · ✅ PASSED
- runId: `8dc7b17f-1223-430a-9737-f1da8dfddbf6` (source: cli)

## Test — Metrics API: health, churn calc, and input validation
- **testId:** `b5b10e1a-5f08-4787-b873-d1b22beda16c` · priority p0 · latest: ❌ FAILED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/b5b10e1a-5f08-4787-b873-d1b22beda16c

### Run 1 — 2026-07-01T11:53:46.847Z · ✅ PASSED
- runId: `1b9565b6-81c1-409a-9e47-f10de1396eb5` (source: cli)

### Run 2 — 2026-07-01T12:19:33.751Z · ✅ PASSED
- runId: `b7de45d9-13af-47dc-b7ab-7f7a30d62a77` (source: cli)

### Run 3 — 2026-07-01T12:22:15.566Z · ✅ PASSED
- runId: `8d223bf4-d87b-4f62-8162-547f2a10d0af` (source: cli)

### Run 4 — 2026-07-01T12:22:40.310Z · ✅ PASSED
- runId: `16f9e518-5563-43ed-b094-9a1ae8c42645` (source: cli)

### Run 5 — 2026-07-01T12:23:36.670Z · ✅ PASSED
- runId: `cbdff04b-9406-4313-b5be-5fdd7d415b0a` (source: cli)

### Run 6 — 2026-07-01T12:25:38.795Z · ✅ PASSED
- runId: `27025b7b-fcfd-4848-99eb-9cb346dd01d1` (source: cli)

### Run 7 — 2026-07-01T12:36:10.870Z · ❌ FAILED
- runId: `d0472734-413e-4c6a-806b-68fe4232eff3` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  expected field-level validation message, got: {"error":"Missing or invalid fields","details":{"formErrors":[],"fieldErrors":{"totalUsers":["Total users must be greater than 0"]}}}
  ```

### Run 8 — 2026-07-01T14:51:03.597Z · ❌ FAILED
- runId: `902e3437-5443-4f19-aeaf-035e196411aa` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  expected field-level validation message, got: {"error":"Missing or invalid fields","details":{"formErrors":[],"fieldErrors":{"totalUsers":["Total users must be greater than 0"]}}}
  ```

### Run 9 — 2026-07-01T15:16:46.782Z · ❌ FAILED
- runId: `7b0d12a8-259d-4f3e-ab47-d7af3337252c` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  expected field-level validation message, got: {"error":"Missing or invalid fields","details":{"formErrors":[],"fieldErrors":{"totalUsers":["Total users must be greater than 0"]}}}
  ```

### Run 10 — 2026-07-01T15:22:52.854Z · ❌ FAILED
- runId: `f393461f-91d4-4438-9224-5941ea8dce1b` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  expected field-level validation message, got: {"error":"Missing or invalid fields","details":{"formErrors":[],"fieldErrors":{"totalUsers":["Total users must be greater than 0"]}}}
  ```

### Run 11 — 2026-07-01T15:23:16.513Z · ❌ FAILED
- runId: `0dad642d-de72-4207-8012-e0c363f0deeb` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  expected field-level validation message, got: {"error":"Missing or invalid fields","details":{"formErrors":[],"fieldErrors":{"totalUsers":["Total users must be greater than 0"]}}}
  ```

### Run 12 — 2026-07-01T15:24:26.560Z · ❌ FAILED
- runId: `a9c86c7c-488b-45ab-be4c-1adde2f03692` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  expected field-level validation message, got: {"error":"Missing or invalid fields","details":{"formErrors":[],"fieldErrors":{"totalUsers":["Total users must be greater than zero"]}}}
  ```

### Run 13 — 2026-07-01T15:25:25.982Z · ❌ FAILED
- runId: `4164f956-f05d-4ad5-a525-a32604ecfd30` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  expected field-level validation message, got: {"error":"Missing or invalid fields","details":{"formErrors":[],"fieldErrors":{"totalUsers":["Total users must be greater than zero"]}}}
  ```

### Run 14 — 2026-07-01T15:25:46.667Z · ❌ FAILED
- runId: `401ab375-4a6a-42c9-99d8-9c1e8f8565a6` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  expected field-level validation message, got: {"error":"Missing or invalid fields","details":{"formErrors":[],"fieldErrors":{"totalUsers":["Total users must be greater than zero"]}}}
  ```

### Run 15 — 2026-07-01T15:27:03.877Z · ✅ PASSED
- runId: `7a5df951-ab0c-4061-b071-6f9ccae790e9` (source: cli)

### Run 16 — 2026-07-01T15:28:15.057Z · ✅ PASSED
- runId: `9720601c-3923-4c8b-99bc-2947a8540f67` (source: cli)

### Run 17 — 2026-07-01T15:32:51.553Z · ✅ PASSED
- runId: `b79ce102-3702-4596-bbe4-4074cfe7a79a` (source: cli)

### Run 18 — 2026-07-01T15:33:52.019Z · ✅ PASSED
- runId: `67a1c34e-ea72-4a86-8acb-d48896bdbe91` (source: cli)

### Run 19 — 2026-07-01T15:37:44.740Z · ❌ FAILED
- runId: `d5fb8bc9-fde5-4425-9392-776976a30d90` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  {'churnRate': 0.15, 'retentionRate': 1, 'arpu': 5, 'riskStatus': 'Medium'}
  ```

### Run 20 — 2026-07-01T15:38:34.939Z · ❌ FAILED
- runId: `01415647-db2c-4cdd-939e-f14270bff42d` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  {'churnRate': 0.15, 'retentionRate': 1, 'arpu': 5, 'riskStatus': 'Medium'}
  ```

---

_Regenerated at 2026-07-01T15:38:50.743Z · HEAD 8cdaa33_
