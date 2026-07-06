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
| Banked tests | 13 |
| Total runs recorded | 201 |

## Loop
`Edit code` → `git push` → `Vercel auto-redeploy` → `testsprite test rerun --wait` → `read verdict` → `fix` → repeat.

The CLI runs against the live URL (never localhost). Failure detection is fully
automated via the CLI; the code fix is made by the coding agent reading the failure
bundle — this is not self-healing without intervention.

---

## Test — Guarded: Insight cache + schema (#23)
- **testId:** `76521ceb-c018-44de-9460-cb6b48ee47be` · priority p1 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/76521ceb-c018-44de-9460-cb6b48ee47be

### Run 1 — 2026-07-05T16:55:31.015Z · ✅ PASSED
- runId: `4e1d4868-150a-41a4-88d4-a74b0172d264` (source: cli)

## Test — Guarded: Insights shape + model whitelist (#3)
- **testId:** `b6e4f1d6-0784-4f1e-b7bd-5f18a4279d6a` · priority p0 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/b6e4f1d6-0784-4f1e-b7bd-5f18a4279d6a

### Run 1 — 2026-07-05T03:56:21.654Z · ✅ PASSED
- runId: `d1c51c21-39d2-42c7-91f6-7a21b6873279` (source: cli)

### Run 2 — 2026-07-05T04:17:38.853Z · ✅ PASSED
- runId: `5f603946-02ec-4b47-b7fc-190f5e06a118` (source: cli)

### Run 3 — 2026-07-05T04:19:30.082Z · ✅ PASSED
- runId: `5adfb41a-5cb1-44dc-a5f1-2a7e99112f56` (source: cli)

### Run 4 — 2026-07-05T05:04:32.692Z · ✅ PASSED
- runId: `8bd2bbef-1efc-43dc-8663-0a862ed689dc` (source: cli)

### Run 5 — 2026-07-05T14:16:10.630Z · ✅ PASSED
- runId: `1db099a4-5ea0-4c83-b7c5-b1953bdb45a7` (source: cli)

### Run 6 — 2026-07-05T14:47:30.767Z · ✅ PASSED
- runId: `b857adb5-c0bb-4c9f-9997-824d62d89161` (source: cli)

### Run 7 — 2026-07-05T14:52:18.599Z · ✅ PASSED
- runId: `c487ae5a-6876-48b4-9d59-990c41a65175` (source: cli)

### Run 8 — 2026-07-05T16:48:46.942Z · ✅ PASSED
- runId: `51f7b8df-f110-4c6a-bdc9-5e9dccf7a369` (source: cli)

### Run 9 — 2026-07-05T16:55:19.380Z · ✅ PASSED
- runId: `7928f6a3-86a8-4ddb-87ce-69020a42aede` (source: cli)

## Test — Guarded: AI model whitelist gateway (Step6)
- **testId:** `1a237a45-8410-4f40-8182-a87331e22d3e` · priority p0 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/1a237a45-8410-4f40-8182-a87331e22d3e

### Run 1 — 2026-07-05T03:42:29.786Z · ⚠️ BLOCKED
- runId: `836b4e07-e032-4ac7-9eaa-ac5a897dec2b` (source: cli)

### Run 2 — 2026-07-05T03:43:03.959Z · ❌ FAILED
- runId: `a6485f09-a378-418c-a3b8-32570842522e` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  expected 400, got 200: {"success":true,"projectName":"Whitelist Check","metrics":{"churnRate":0.15,"retentionRate":0.85,"arpu":5,"riskStatus":"Medium","mrr":5000,"estimatedLtv":33.33},"trend":{"points":0,"movingAverage":null,"deviation":null,"anomaly":"insufficient-data"},"model":"nvidia/nemotron-3-ultra-550b-a55b:free","insight":{"summary":"Whitelist Check retains 85% of its 1,000 users, but a 15% monthly churn rate signals ongoing leakage. Average revenue per user is only $5, limiting growth potential. The current risk level is assessed as Medium.","recommendation":"Launch a targeted re‑engagement campaign for the 150 churned users, offering a personalized incentive to reactivate them.","riskLevel":"Medium","source":"ai"},"cached":true,"timestamp":"2026-07-05T03:43:03.934Z"}
  ```

### Run 3 — 2026-07-05T03:52:16.286Z · ✅ PASSED
- runId: `3b304b00-fa69-41ab-bf5f-738f973491d1` (source: cli)

### Run 4 — 2026-07-05T03:53:10.478Z · ✅ PASSED
- runId: `41d31217-4555-4d2d-aa6b-7db5f96366a6` (source: cli)

### Run 5 — 2026-07-05T03:54:15.643Z · ✅ PASSED
- runId: `436e8a6d-3a98-4cef-82e6-98ddb95f6dee` (source: cli)

### Run 6 — 2026-07-05T04:17:39.435Z · ✅ PASSED
- runId: `cea789a3-68e6-4cd3-b728-405c3b1031be` (source: cli)

### Run 7 — 2026-07-05T04:19:02.734Z · ✅ PASSED
- runId: `afdfc50e-db62-4958-95c5-f9b4a0af9a75` (source: cli)

### Run 8 — 2026-07-05T05:04:22.764Z · ✅ PASSED
- runId: `fa006719-02c1-483f-a50a-ad5d225e1c92` (source: cli)

### Run 9 — 2026-07-05T14:16:14.892Z · ✅ PASSED
- runId: `20075947-9590-4a35-89c7-48bfdea88c57` (source: cli)

### Run 10 — 2026-07-05T14:47:31.635Z · ✅ PASSED
- runId: `25a91c9b-5788-403d-a4b3-60c39056e1e2` (source: cli)

### Run 11 — 2026-07-05T14:52:26.665Z · ❌ FAILED
- runId: `85b40537-875d-45ca-8f04-2eb60c9c8527` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  expected 400, got 429: {"error":"Too many requests. Please wait a moment and try again."}
  ```

### Run 12 — 2026-07-05T16:45:56.336Z · ✅ PASSED
- runId: `ed53d964-ee34-434e-b7ea-13568663bbfc` (source: cli)

### Run 13 — 2026-07-05T16:48:48.456Z · ✅ PASSED
- runId: `b9d38fd6-6f4a-4c5e-8146-05ce00f33a3a` (source: cli)

### Run 14 — 2026-07-05T16:49:32.161Z · ✅ PASSED
- runId: `02ce3169-0e7b-4027-bc4b-2bb9594f38fd` (source: cli)

### Run 15 — 2026-07-05T16:55:20.319Z · ✅ PASSED
- runId: `558eaa25-6ca3-4298-8c52-6ed1eeb15a5f` (source: cli)

## Test — Guarded: Chat auth + message limits (#6,#12)
- **testId:** `a24f74ed-149b-4c39-81cb-9ab3cc44833a` · priority p1 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/a24f74ed-149b-4c39-81cb-9ab3cc44833a

### Run 1 — 2026-07-05T03:08:08.200Z · ✅ PASSED
- runId: `c475e691-306f-44b1-b1f9-b116eaea5b67` (source: cli)

### Run 2 — 2026-07-05T03:22:49.773Z · ✅ PASSED
- runId: `cb20c80a-ebee-4f95-9246-5028e0ebef75` (source: cli)

### Run 3 — 2026-07-05T03:25:16.492Z · ✅ PASSED
- runId: `3f4293d2-ad5d-41c4-9548-76b4463de076` (source: cli)

### Run 4 — 2026-07-05T03:52:00.156Z · ✅ PASSED
- runId: `4155bcff-e166-441b-a4a9-1d6490642ef3` (source: cli)

### Run 5 — 2026-07-05T03:54:04.941Z · ✅ PASSED
- runId: `7d5e39d2-bcff-4a2e-b598-b1fb752cfaff` (source: cli)

### Run 6 — 2026-07-05T04:17:07.379Z · ✅ PASSED
- runId: `29b9a8f7-925c-430e-838b-c667e6e2d918` (source: cli)

### Run 7 — 2026-07-05T04:18:48.046Z · ✅ PASSED
- runId: `99110403-7576-4ba1-bbdc-c1002af529be` (source: cli)

### Run 8 — 2026-07-05T05:04:16.965Z · ✅ PASSED
- runId: `8e26e286-cfef-4a3c-b76f-2a4551ef607f` (source: cli)

### Run 9 — 2026-07-05T14:16:09.389Z · ✅ PASSED
- runId: `45e209dc-94f8-4002-bbe0-d6e51df7bfca` (source: cli)

### Run 10 — 2026-07-05T14:47:29.992Z · ✅ PASSED
- runId: `63cf1ef2-2a25-4c25-ba76-914f43f300eb` (source: cli)

### Run 11 — 2026-07-05T14:52:32.036Z · ✅ PASSED
- runId: `75859d11-dc7f-4c2c-b62e-d8a1b9fbdb0a` (source: cli)

### Run 12 — 2026-07-05T16:48:45.077Z · ✅ PASSED
- runId: `37efe985-9357-4883-b831-0a876d9e2ade` (source: cli)

### Run 13 — 2026-07-05T16:49:37.224Z · ✅ PASSED
- runId: `b0e7c5a5-ea27-4005-b0c6-30818d8d3ba6` (source: cli)

### Run 14 — 2026-07-05T16:55:17.972Z · ✅ PASSED
- runId: `ac2c6602-26dd-4a00-b9c9-362d6f072ffa` (source: cli)

## Test — Guarded: CSV quoted/partial/row-limit (#19,#20)
- **testId:** `4dd8880e-945b-4aea-84d5-39936eeaa473` · priority p1 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/4dd8880e-945b-4aea-84d5-39936eeaa473

### Run 1 — 2026-07-05T03:04:55.641Z · ✅ PASSED
- runId: `bdbfff1c-66d4-4c61-81e3-d7c451edc701` (source: cli)

### Run 2 — 2026-07-05T03:22:49.753Z · ✅ PASSED
- runId: `274e139b-7749-4134-8f2e-0efff34c8642` (source: cli)

### Run 3 — 2026-07-05T03:25:16.506Z · ✅ PASSED
- runId: `68ad860f-65fa-43a2-947a-25a047c0becb` (source: cli)

### Run 4 — 2026-07-05T03:51:59.598Z · ✅ PASSED
- runId: `798c81c5-a256-48d7-b87d-50584973984e` (source: cli)

### Run 5 — 2026-07-05T03:54:04.974Z · ✅ PASSED
- runId: `becb70e5-ee5b-427f-970c-09f4874bd953` (source: cli)

### Run 6 — 2026-07-05T04:17:07.431Z · ✅ PASSED
- runId: `6de12ef8-0f0b-45f5-bf7c-d120de6fbd62` (source: cli)

### Run 7 — 2026-07-05T04:18:48.775Z · ✅ PASSED
- runId: `b7991c8e-781e-4a20-9fe0-60cceeb2307f` (source: cli)

### Run 8 — 2026-07-05T05:04:17.190Z · ✅ PASSED
- runId: `f32bb633-c3a6-4a0b-8597-30fdc2130090` (source: cli)

### Run 9 — 2026-07-05T14:16:09.022Z · ✅ PASSED
- runId: `7d393afe-b0a6-401c-915a-e8c95c8a8d36` (source: cli)

### Run 10 — 2026-07-05T14:47:30.029Z · ✅ PASSED
- runId: `ed1d9454-4bc3-41ae-b1b9-4b59d33cb9c8` (source: cli)

### Run 11 — 2026-07-05T14:52:36.756Z · ✅ PASSED
- runId: `98348485-daf3-4b78-932e-37490d21c61f` (source: cli)

### Run 12 — 2026-07-05T16:48:45.130Z · ✅ PASSED
- runId: `a22bdc6b-c65e-4775-9b5a-b824401067c0` (source: cli)

### Run 13 — 2026-07-05T16:49:42.274Z · ✅ PASSED
- runId: `8d9b44ba-592d-4911-9855-314d607d05d5` (source: cli)

### Run 14 — 2026-07-05T16:55:17.545Z · ✅ PASSED
- runId: `8bdebd43-e559-4679-b979-80829f460e03` (source: cli)

## Test — Guarded: CRUD delete lifecycle (#16)
- **testId:** `2d7b3f6d-f883-4be6-b0e5-440df863fce5` · priority p1 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/2d7b3f6d-f883-4be6-b0e5-440df863fce5

### Run 1 — 2026-07-05T03:04:44.233Z · ✅ PASSED
- runId: `cd125f16-fd76-4c17-9411-9d62094448e0` (source: cli)

### Run 2 — 2026-07-05T03:22:49.836Z · ✅ PASSED
- runId: `dd1a4e49-fe69-4352-9a0f-fa94c5274409` (source: cli)

### Run 3 — 2026-07-05T03:25:16.851Z · ✅ PASSED
- runId: `5452bf5a-1095-4b93-8ac0-eadb8c3c650a` (source: cli)

### Run 4 — 2026-07-05T03:52:00.116Z · ✅ PASSED
- runId: `ae6fbe43-d6f7-4ffb-b1ee-0dea5c70e2e6` (source: cli)

### Run 5 — 2026-07-05T03:54:05.210Z · ✅ PASSED
- runId: `78b22a2c-2ed2-402e-9dd1-f927f1f5c05c` (source: cli)

### Run 6 — 2026-07-05T04:17:07.597Z · ✅ PASSED
- runId: `b99cfb58-9f8f-40a2-829d-b0882a28338c` (source: cli)

### Run 7 — 2026-07-05T04:18:48.934Z · ✅ PASSED
- runId: `d5b4ec80-decf-416d-972a-e9b7873b67ba` (source: cli)

### Run 8 — 2026-07-05T05:04:17.304Z · ✅ PASSED
- runId: `32a058f0-28fd-43a6-8f70-285a3e356f7e` (source: cli)

### Run 9 — 2026-07-05T14:16:09.838Z · ✅ PASSED
- runId: `6af435c1-f9d2-4546-8b62-450ddf8dd902` (source: cli)

### Run 10 — 2026-07-05T14:47:30.146Z · ✅ PASSED
- runId: `74ba819b-ac14-4427-a949-6faf11a606e9` (source: cli)

### Run 11 — 2026-07-05T14:52:42.119Z · ✅ PASSED
- runId: `72d7cbe4-52e7-493a-87c0-dc6ff44ecb8e` (source: cli)

### Run 12 — 2026-07-05T16:48:45.236Z · ✅ PASSED
- runId: `49ed4e95-7dda-4ebe-b97c-c31e29115cd3` (source: cli)

### Run 13 — 2026-07-05T16:49:46.983Z · ✅ PASSED
- runId: `d30f09dd-2668-4b4b-92b9-b6600d8252d5` (source: cli)

### Run 14 — 2026-07-05T16:55:17.714Z · ✅ PASSED
- runId: `939c0ed2-f08a-4b5e-bfd8-ae9406f33c99` (source: cli)

## Test — Guarded: Pagination + MRR/LTV schema (#15,#18)
- **testId:** `36f0c5ef-3ecf-467a-b287-2b5bff1faefa` · priority p1 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/36f0c5ef-3ecf-467a-b287-2b5bff1faefa

### Run 1 — 2026-07-05T03:04:36.701Z · ✅ PASSED
- runId: `82afb0bb-f0a4-4842-bb95-4e794cdcda8e` (source: cli)

### Run 2 — 2026-07-05T03:22:50.001Z · ✅ PASSED
- runId: `a1bb2955-971b-4405-a676-2a6695257673` (source: cli)

### Run 3 — 2026-07-05T03:25:16.757Z · ✅ PASSED
- runId: `627a0c4b-6229-4fcb-8a36-7188cc86cf6c` (source: cli)

### Run 4 — 2026-07-05T03:52:00.074Z · ✅ PASSED
- runId: `98d20328-b7fa-4c5e-9046-b07161db7ae6` (source: cli)

### Run 5 — 2026-07-05T03:54:05.181Z · ✅ PASSED
- runId: `abc63672-2850-481a-a154-af6c71bd9c3c` (source: cli)

### Run 6 — 2026-07-05T04:17:07.120Z · ✅ PASSED
- runId: `e0f0a1f5-90e2-495a-91f9-d2ffbfae8581` (source: cli)

### Run 7 — 2026-07-05T04:18:49.002Z · ✅ PASSED
- runId: `a7076cdd-6a7b-426e-af1d-4f785cfe8350` (source: cli)

### Run 8 — 2026-07-05T05:04:17.322Z · ✅ PASSED
- runId: `6f8d978d-1e43-41ba-9e89-8d3395a2f15c` (source: cli)

### Run 9 — 2026-07-05T14:16:09.443Z · ✅ PASSED
- runId: `dc8971ed-40e6-4511-8c28-45327485f07a` (source: cli)

### Run 10 — 2026-07-05T14:47:30.216Z · ✅ PASSED
- runId: `d8707fd6-6f54-4da8-af1e-f5a2de2e746b` (source: cli)

### Run 11 — 2026-07-05T14:52:47.025Z · ✅ PASSED
- runId: `83d60448-a82b-4f35-ba6a-2bbc9826e059` (source: cli)

### Run 12 — 2026-07-05T16:48:45.428Z · ✅ PASSED
- runId: `7245a076-baef-487a-ad97-d2404ee88ae6` (source: cli)

### Run 13 — 2026-07-05T16:49:51.878Z · ✅ PASSED
- runId: `24af629f-5340-412a-972f-568a71815476` (source: cli)

### Run 14 — 2026-07-05T16:55:17.842Z · ✅ PASSED
- runId: `31e46c01-3708-4b19-9ed9-18ed6162c768` (source: cli)

## Test — Guarded: CSV batch upload + CSRF
- **testId:** `da8bf044-7278-4513-87af-67811972a7c2` · priority p0 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/da8bf044-7278-4513-87af-67811972a7c2

### Run 1 — 2026-07-02T13:33:46.763Z · ✅ PASSED
- runId: `56e49227-afa4-4cd0-b1dd-9c40c524ba98` (source: cli)

### Run 2 — 2026-07-02T14:01:35.166Z · ✅ PASSED
- runId: `529fd054-a72b-458e-8d06-9f9058e10182` (source: cli)

### Run 3 — 2026-07-04T12:05:01.587Z · ✅ PASSED
- runId: `2921c6d6-8f09-4677-8d9e-bfff4ce168ae` (source: cli)

### Run 4 — 2026-07-04T12:13:32.827Z · ✅ PASSED
- runId: `c41001a5-af38-40ca-b1e6-fc39cbf248b0` (source: cli)

### Run 5 — 2026-07-04T12:35:26.587Z · ✅ PASSED
- runId: `19b56658-c119-49e8-9ce0-6b2a72b630b7` (source: cli)

### Run 6 — 2026-07-04T17:42:26.924Z · ✅ PASSED
- runId: `e33fce03-c9ae-44b1-b6a8-ea3c24c76041` (source: cli)

### Run 7 — 2026-07-04T18:03:11.597Z · ✅ PASSED
- runId: `54b518b4-1244-473a-99d6-2b3581db952f` (source: cli)

### Run 8 — 2026-07-05T03:22:50.037Z · ✅ PASSED
- runId: `3f8504a4-c84d-4fb4-84df-08621160feca` (source: cli)

### Run 9 — 2026-07-05T03:25:16.772Z · ✅ PASSED
- runId: `cc343cb8-33e2-4805-a49c-e4c1629731cf` (source: cli)

### Run 10 — 2026-07-05T03:51:58.334Z · ✅ PASSED
- runId: `375eaf88-5698-4def-9fc5-1446c72f18d9` (source: cli)

### Run 11 — 2026-07-05T03:54:05.374Z · ✅ PASSED
- runId: `8c12d6fb-bced-4661-b122-b322a1321693` (source: cli)

### Run 12 — 2026-07-05T04:17:07.770Z · ✅ PASSED
- runId: `dbcc8dcc-6dfa-4959-8310-054057af9179` (source: cli)

### Run 13 — 2026-07-05T04:18:49.013Z · ✅ PASSED
- runId: `890c0b63-5bd8-4ab2-b108-286c176952d7` (source: cli)

### Run 14 — 2026-07-05T05:04:16.349Z · ✅ PASSED
- runId: `a7ba54b1-ef91-49ed-8f39-71b402f96bd5` (source: cli)

### Run 15 — 2026-07-05T14:16:09.878Z · ✅ PASSED
- runId: `26f16a07-fab7-4d2b-a5c6-91f7fe5e9a90` (source: cli)

### Run 16 — 2026-07-05T14:47:30.225Z · ✅ PASSED
- runId: `36ef0ad9-befa-4820-80b5-8d8fb1dba396` (source: cli)

### Run 17 — 2026-07-05T14:52:52.336Z · ✅ PASSED
- runId: `fe019a4d-0aa1-4c8c-a962-fb7640fc1414` (source: cli)

### Run 18 — 2026-07-05T16:48:45.243Z · ✅ PASSED
- runId: `f9fa83bc-001b-4f09-b808-667a4716bd39` (source: cli)

### Run 19 — 2026-07-05T16:49:56.962Z · ✅ PASSED
- runId: `a3059dda-a7cb-4f4b-bcb5-54911adac739` (source: cli)

### Run 20 — 2026-07-05T16:55:18.496Z · ✅ PASSED
- runId: `5d63e97e-7e5a-4528-b7d8-665d146836a5` (source: cli)

## Test — Guarded: Stateful chain create->list->metrics->insight
- **testId:** `87320b3f-cf42-4442-bac0-8ec3bb4420a9` · priority p0 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/87320b3f-cf42-4442-bac0-8ec3bb4420a9

### Run 1 — 2026-07-02T14:01:50.106Z · ✅ PASSED
- runId: `ee3e2e09-68ee-4dfa-9876-7f65773eaad0` (source: cli)

### Run 2 — 2026-07-04T12:05:12.954Z · ✅ PASSED
- runId: `8c53ee43-66bd-4211-9c3c-6723d5d2619f` (source: cli)

### Run 3 — 2026-07-04T12:13:36.420Z · ✅ PASSED
- runId: `566051e9-06eb-44a1-8c9e-fc6d4b8d5fbb` (source: cli)

### Run 4 — 2026-07-04T12:35:53.582Z · ✅ PASSED
- runId: `7af22483-0ef5-45cb-9dd7-0a6a7d9248f5` (source: cli)

### Run 5 — 2026-07-04T17:42:44.962Z · ✅ PASSED
- runId: `6f466b86-515f-4deb-975e-f104f8c4eecd` (source: cli)

### Run 6 — 2026-07-04T18:03:41.324Z · ✅ PASSED
- runId: `6e404604-795a-4643-a12d-06f4d11a8972` (source: cli)

### Run 7 — 2026-07-05T03:23:19.391Z · ✅ PASSED
- runId: `da6b1b07-6bd1-4059-a3cc-24b43f28ad05` (source: cli)

### Run 8 — 2026-07-05T03:25:45.620Z · ✅ PASSED
- runId: `a7239a6e-ee83-4eae-b431-67dc3e0a72dc` (source: cli)

### Run 9 — 2026-07-05T03:52:10.784Z · ✅ PASSED
- runId: `82123c95-b895-4b0c-8911-202b07bb9fc1` (source: cli)

### Run 10 — 2026-07-05T03:54:07.701Z · ✅ PASSED
- runId: `bd9e48c4-22f0-45e9-bc55-1a0f8d045c6e` (source: cli)

### Run 11 — 2026-07-05T04:17:25.917Z · ✅ PASSED
- runId: `95648aca-d71c-419b-9a32-a85b9d06ca13` (source: cli)

### Run 12 — 2026-07-05T04:19:23.910Z · ✅ PASSED
- runId: `5b900921-ff42-4222-8d55-5ad490c57199` (source: cli)

### Run 13 — 2026-07-05T05:04:18.771Z · ✅ PASSED
- runId: `9e09fa1a-a7ea-4d39-8b8b-53d07f79f00c` (source: cli)

### Run 14 — 2026-07-05T14:16:16.951Z · ✅ PASSED
- runId: `3192eb81-88b2-4653-8d3d-13c254c79f25` (source: cli)

### Run 15 — 2026-07-05T14:47:29.190Z · ✅ PASSED
- runId: `6f415332-ef1c-4a46-8c57-eecad12b3bb6` (source: cli)

### Run 16 — 2026-07-05T14:52:56.680Z · ❌ FAILED
- runId: `5451da26-f1eb-4b96-b0f8-15774a2f64ab` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  {"error":"Too many requests. Please wait a moment and try again."}
  ```

### Run 17 — 2026-07-05T16:45:59.622Z · ✅ PASSED
- runId: `b0f1baaf-fc21-4bcd-80e1-fc2ad423ee4d` (source: cli)

### Run 18 — 2026-07-05T16:48:45.828Z · ✅ PASSED
- runId: `4e4d4f73-8df7-4710-bc7d-55ad870ed658` (source: cli)

### Run 19 — 2026-07-05T16:50:03.324Z · ✅ PASSED
- runId: `385e1f8e-36a1-4e7a-94ef-6a8de49744eb` (source: cli)

### Run 20 — 2026-07-05T16:55:18.576Z · ✅ PASSED
- runId: `49f29f2f-bc99-409f-82cd-62fcf3777b97` (source: cli)

## Test — Guarded: Projects persist + CSRF
- **testId:** `33cf2c68-e994-43fe-bf0e-c5de93112c1c` · priority p1 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/33cf2c68-e994-43fe-bf0e-c5de93112c1c

### Run 1 — 2026-07-02T13:33:46.062Z · ✅ PASSED
- runId: `38dcce6f-4364-4b2b-bbea-b43b10dff2d2` (source: cli)

### Run 2 — 2026-07-02T14:01:34.976Z · ✅ PASSED
- runId: `70547440-d490-4c20-9aca-4e0a56676f5e` (source: cli)

### Run 3 — 2026-07-04T12:05:01.448Z · ✅ PASSED
- runId: `7f9afcae-4247-4e8f-afdc-8ff61b8b988d` (source: cli)

### Run 4 — 2026-07-04T12:13:32.867Z · ✅ PASSED
- runId: `d671c31b-86fd-4b84-8e12-bc5abd661424` (source: cli)

### Run 5 — 2026-07-04T12:35:27.253Z · ✅ PASSED
- runId: `445b8cbf-d4ae-4609-947f-e6684265599c` (source: cli)

### Run 6 — 2026-07-04T17:42:26.865Z · ✅ PASSED
- runId: `af62884f-ff20-4dc1-a2d7-1677ec050820` (source: cli)

### Run 7 — 2026-07-04T18:03:11.400Z · ✅ PASSED
- runId: `a17dc246-d385-45d7-8c9a-ff23347cc0ee` (source: cli)

### Run 8 — 2026-07-05T03:22:49.923Z · ✅ PASSED
- runId: `789b2828-dde7-4ba1-93b2-6974d04aee23` (source: cli)

### Run 9 — 2026-07-05T03:25:16.908Z · ✅ PASSED
- runId: `fa1b4ae6-fb81-449b-840d-49ee01950e66` (source: cli)

### Run 10 — 2026-07-05T03:51:58.714Z · ✅ PASSED
- runId: `07160c0b-8cea-4985-a6f0-9b74cbb50cd1` (source: cli)

### Run 11 — 2026-07-05T03:54:05.095Z · ✅ PASSED
- runId: `d53cb637-c505-4767-85a7-48cc26105f06` (source: cli)

### Run 12 — 2026-07-05T04:17:07.627Z · ✅ PASSED
- runId: `ad68449d-8113-4672-8650-a1876ec01e85` (source: cli)

### Run 13 — 2026-07-05T04:18:48.749Z · ✅ PASSED
- runId: `c5c6bc0e-623b-481a-81a2-d3e207d47769` (source: cli)

### Run 14 — 2026-07-05T05:04:17.234Z · ✅ PASSED
- runId: `e7ceded7-e385-42a0-a16c-31ce2eecbdf1` (source: cli)

### Run 15 — 2026-07-05T14:16:09.326Z · ✅ PASSED
- runId: `4b4dbc92-079a-48dc-a895-f43b7a0c7d78` (source: cli)

### Run 16 — 2026-07-05T14:47:30.037Z · ✅ PASSED
- runId: `dfc6456e-0c95-47c3-9a68-f26c4f1c92cf` (source: cli)

### Run 17 — 2026-07-05T14:53:02.428Z · ✅ PASSED
- runId: `8892b2d9-18d0-4db0-8734-3753974896cc` (source: cli)

### Run 18 — 2026-07-05T16:48:45.213Z · ✅ PASSED
- runId: `cd600398-b64e-4cb3-9021-217d85a676d8` (source: cli)

### Run 19 — 2026-07-05T16:50:08.432Z · ✅ PASSED
- runId: `45064f83-9696-4d8e-b0f4-d46056c90f87` (source: cli)

### Run 20 — 2026-07-05T16:55:17.748Z · ✅ PASSED
- runId: `b6524873-1623-4a81-b7f2-542f04604f35` (source: cli)

## Test — Guarded: Edge cases + risk boundaries
- **testId:** `159574eb-5b29-4880-bfad-0449ec44206f` · priority p1 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/159574eb-5b29-4880-bfad-0449ec44206f

### Run 1 — 2026-07-02T13:33:46.739Z · ✅ PASSED
- runId: `51d804bb-8215-43ed-b741-75bbcc402af9` (source: cli)

### Run 2 — 2026-07-02T14:01:34.949Z · ✅ PASSED
- runId: `8cdab78b-e592-4588-9570-da9bbbcae3d5` (source: cli)

### Run 3 — 2026-07-04T12:05:01.072Z · ✅ PASSED
- runId: `4c6d68ee-f22b-425f-b099-b794d146b720` (source: cli)

### Run 4 — 2026-07-04T12:13:32.629Z · ✅ PASSED
- runId: `1b3d865c-908f-463e-acdd-2178a31bac22` (source: cli)

### Run 5 — 2026-07-04T12:35:27.186Z · ✅ PASSED
- runId: `eb5bf9b2-fb05-4231-bc87-ebc544ae1b80` (source: cli)

### Run 6 — 2026-07-04T17:42:26.840Z · ✅ PASSED
- runId: `d669db9a-bc8c-4aef-a352-a71dbf46d3c6` (source: cli)

### Run 7 — 2026-07-04T18:03:11.319Z · ✅ PASSED
- runId: `010e4075-e23f-4a6b-bddf-da6dd78fbae4` (source: cli)

### Run 8 — 2026-07-05T03:22:49.812Z · ✅ PASSED
- runId: `a956a54f-2170-40a1-b298-7fa5969b84cf` (source: cli)

### Run 9 — 2026-07-05T03:25:16.432Z · ✅ PASSED
- runId: `91b00333-cb0f-4fc0-8b50-22137e83cbe2` (source: cli)

### Run 10 — 2026-07-05T03:51:59.468Z · ✅ PASSED
- runId: `2da173cc-0ad5-448f-8125-7d3b07dfccce` (source: cli)

### Run 11 — 2026-07-05T03:54:04.966Z · ✅ PASSED
- runId: `871998b6-88cf-4c03-a050-f90db07906ee` (source: cli)

### Run 12 — 2026-07-05T04:17:07.514Z · ✅ PASSED
- runId: `20a9f576-7e66-41c1-9d14-f0aaf8a7388c` (source: cli)

### Run 13 — 2026-07-05T04:18:49.035Z · ✅ PASSED
- runId: `6f3d7062-3255-485c-b8fd-921fd629a89e` (source: cli)

### Run 14 — 2026-07-05T05:04:16.891Z · ✅ PASSED
- runId: `0913e375-d218-4d27-a6cc-a691bf7fb7f1` (source: cli)

### Run 15 — 2026-07-05T14:16:09.629Z · ✅ PASSED
- runId: `0913851d-7ca9-4f9c-bcec-0196d31eb3a0` (source: cli)

### Run 16 — 2026-07-05T14:47:29.249Z · ✅ PASSED
- runId: `e67c9b89-9cb2-4220-adb1-4cf12b4bc19d` (source: cli)

### Run 17 — 2026-07-05T14:53:07.034Z · ✅ PASSED
- runId: `1b1c284b-0d5c-4946-934d-9c15d92b4ba5` (source: cli)

### Run 18 — 2026-07-05T16:48:43.759Z · ✅ PASSED
- runId: `48f4153d-9a1b-40af-b7b2-87e6b3e0aa4a` (source: cli)

### Run 19 — 2026-07-05T16:50:13.086Z · ✅ PASSED
- runId: `c661b1e9-cb67-43a8-8bb7-e7048775e143` (source: cli)

### Run 20 — 2026-07-05T16:55:17.774Z · ✅ PASSED
- runId: `ca361021-3ae0-4ddc-b733-4affce930d49` (source: cli)

## Test — Guarded: Metrics API + body size (#8,#11)
- **testId:** `cd31cfd5-eb6a-4dd3-9f2c-e86cbcd3ab2e` · priority p0 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/cd31cfd5-eb6a-4dd3-9f2c-e86cbcd3ab2e

### Run 1 — 2026-07-02T13:33:47.005Z · ✅ PASSED
- runId: `af035cfd-19d4-48ff-95db-7f154fd159f6` (source: cli)

### Run 2 — 2026-07-02T14:01:35.009Z · ✅ PASSED
- runId: `60e30938-9d68-4f99-869b-005191bca186` (source: cli)

### Run 3 — 2026-07-04T12:05:01.342Z · ✅ PASSED
- runId: `af817485-0b49-49b6-9ecc-2b22f242df77` (source: cli)

### Run 4 — 2026-07-04T12:13:33.052Z · ✅ PASSED
- runId: `8f3a4eda-a286-4cab-b5c8-eb85b0d2b7b4` (source: cli)

### Run 5 — 2026-07-04T12:35:27.212Z · ✅ PASSED
- runId: `60b1dcc0-0f29-4bf0-8823-405c7fc64669` (source: cli)

### Run 6 — 2026-07-04T17:42:26.930Z · ✅ PASSED
- runId: `2c2d76cb-4bc8-4c4f-895c-64e291bbd8b8` (source: cli)

### Run 7 — 2026-07-04T18:03:11.499Z · ✅ PASSED
- runId: `9cddae17-f656-4ebe-8031-4be31e13bde7` (source: cli)

### Run 8 — 2026-07-05T03:22:49.898Z · ✅ PASSED
- runId: `e0e94bfb-aab2-413d-b26e-3d5ee8e30d9a` (source: cli)

### Run 9 — 2026-07-05T03:25:17.011Z · ✅ PASSED
- runId: `096ab2a4-0f15-4cf9-9f7b-45363cf5655c` (source: cli)

### Run 10 — 2026-07-05T03:52:00.375Z · ✅ PASSED
- runId: `bc86a826-ed59-40c8-b619-ae025ea1ecba` (source: cli)

### Run 11 — 2026-07-05T03:54:05.224Z · ✅ PASSED
- runId: `563fdeec-a8d3-49ba-b83a-954c25b46548` (source: cli)

### Run 12 — 2026-07-05T04:17:07.661Z · ✅ PASSED
- runId: `906028a9-ff01-4658-b594-74a075215945` (source: cli)

### Run 13 — 2026-07-05T04:18:48.898Z · ✅ PASSED
- runId: `b7dbfb44-06b6-4a13-821b-4a3e9ccdf28b` (source: cli)

### Run 14 — 2026-07-05T05:04:17.183Z · ✅ PASSED
- runId: `4d71dcb7-c915-453c-a2f7-732bfa49105d` (source: cli)

### Run 15 — 2026-07-05T14:16:09.847Z · ✅ PASSED
- runId: `d93e7edf-2e0f-43a7-a339-ad2501b758e5` (source: cli)

### Run 16 — 2026-07-05T14:47:30.136Z · ✅ PASSED
- runId: `cd48acdc-d8be-44cc-b191-411a06159f1c` (source: cli)

### Run 17 — 2026-07-05T14:53:13.509Z · ✅ PASSED
- runId: `d62f329e-12b6-40e6-8377-7494f930e18d` (source: cli)

### Run 18 — 2026-07-05T16:48:45.363Z · ✅ PASSED
- runId: `17c74cb6-be79-4797-9e6c-7ecc6f334ed5` (source: cli)

### Run 19 — 2026-07-05T16:50:18.181Z · ✅ PASSED
- runId: `a00f81ce-7a6e-4236-9685-85d4eb004a44` (source: cli)

### Run 20 — 2026-07-05T16:55:18.353Z · ✅ PASSED
- runId: `08bc1270-55ef-4abe-80eb-a50c29998552` (source: cli)

## Test — Guarded: auth, cookie-signing & CSRF
- **testId:** `1f856ba7-1490-4ceb-945e-ab453827e714` · priority p0 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/1f856ba7-1490-4ceb-945e-ab453827e714

### Run 1 — 2026-07-02T13:33:47.086Z · ✅ PASSED
- runId: `3883d6f6-b698-4067-883e-0dd2915c5508` (source: cli)

### Run 2 — 2026-07-02T14:01:35.253Z · ✅ PASSED
- runId: `253b37ae-cbf8-4ec7-8e2d-9272efce4f76` (source: cli)

### Run 3 — 2026-07-04T12:05:01.712Z · ✅ PASSED
- runId: `fd3e7010-fb61-431b-8a4a-d73cedefeb9a` (source: cli)

### Run 4 — 2026-07-04T12:13:32.864Z · ✅ PASSED
- runId: `498b6aa8-fcec-4bd0-b79d-df365bebe2f9` (source: cli)

### Run 5 — 2026-07-04T12:35:27.279Z · ✅ PASSED
- runId: `94f76fbd-5759-4159-9cb3-0728b3a04be2` (source: cli)

### Run 6 — 2026-07-04T17:42:26.870Z · ✅ PASSED
- runId: `c426c811-b779-433b-9825-523987f8a52e` (source: cli)

### Run 7 — 2026-07-04T18:03:11.581Z · ✅ PASSED
- runId: `6a3fe4de-6771-441a-aa3b-6c04c1fb9b35` (source: cli)

### Run 8 — 2026-07-05T03:22:50.054Z · ✅ PASSED
- runId: `07b459a5-16c9-419a-a32c-0bf6edea570a` (source: cli)

### Run 9 — 2026-07-05T03:25:16.738Z · ✅ PASSED
- runId: `f4ad6b62-4624-4e0c-979e-5acd99452cac` (source: cli)

### Run 10 — 2026-07-05T03:52:00.472Z · ✅ PASSED
- runId: `b3edc3d9-7ad3-4ba2-8821-6a4d74a2b991` (source: cli)

### Run 11 — 2026-07-05T03:54:04.968Z · ✅ PASSED
- runId: `0e32a44c-d7c0-4835-9951-3b8d3f11cc57` (source: cli)

### Run 12 — 2026-07-05T04:17:07.802Z · ✅ PASSED
- runId: `627287d6-9a36-47ff-ab99-cb07d90dad42` (source: cli)

### Run 13 — 2026-07-05T04:18:48.932Z · ✅ PASSED
- runId: `b067cc61-5665-4307-bd42-bde6babcaa0e` (source: cli)

### Run 14 — 2026-07-05T05:04:17.363Z · ✅ PASSED
- runId: `27ec07fa-d65c-4a98-aa65-4689e0c93078` (source: cli)

### Run 15 — 2026-07-05T14:16:09.909Z · ✅ PASSED
- runId: `371de230-a431-49e9-89a2-f2cb991b3e00` (source: cli)

### Run 16 — 2026-07-05T14:47:30.196Z · ✅ PASSED
- runId: `84087f2e-200b-40c8-ba96-94e5128ed3ec` (source: cli)

### Run 17 — 2026-07-05T14:53:19.326Z · ✅ PASSED
- runId: `6080903d-801c-4f41-9c57-d716352dd553` (source: cli)

### Run 18 — 2026-07-05T16:48:45.465Z · ✅ PASSED
- runId: `0d390028-f260-4cea-adf7-ca5e8c681313` (source: cli)

### Run 19 — 2026-07-05T16:50:23.104Z · ✅ PASSED
- runId: `1fd04b0b-6b08-4602-bc8e-7fef6b9b969f` (source: cli)

### Run 20 — 2026-07-05T16:55:17.327Z · ✅ PASSED
- runId: `00ef5df1-9c95-44d3-8505-8857133f3c90` (source: cli)

---

_Regenerated at 2026-07-05T16:56:57.547Z · HEAD 82068ea_
