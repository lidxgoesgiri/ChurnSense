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
| Total runs recorded | 248 |

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

### Run 2 — 2026-07-06T07:03:55.473Z · ❌ FAILED
- runId: `92470a85-5213-4fb8-9f57-1b10df26df4c` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  second call should be cached: False
  ```

### Run 3 — 2026-07-06T13:45:24.971Z · ✅ PASSED
- runId: `0f10e2a8-00ad-427c-9fed-301ee4b7851f` (source: cli)

### Run 4 — 2026-07-07T07:25:34.311Z · ✅ PASSED
- runId: `78399902-c924-4f96-9dc2-fb7c1d4d2cb7` (source: cli)

### Run 5 — 2026-07-07T07:45:56.338Z · ❌ FAILED
- runId: `88d56fe2-7365-43fb-9131-c146aa8c404d` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  {"error":"Invalid request origin"}
  ```

### Run 6 — 2026-07-07T07:56:48.268Z · ✅ PASSED
- runId: `ee60e832-5fa2-4d63-8cc0-ba88ab72c1ef` (source: cli)

### Run 7 — 2026-07-07T08:55:25.596Z · ✅ PASSED
- runId: `8a6ec7bf-efee-48b9-81e4-a3f2214ae591` (source: cli)

### Run 8 — 2026-07-07T13:42:21.594Z · ❌ FAILED
- runId: `4959ec2e-5c02-41ac-869d-eefac1bf51b8` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  second call should be cached: False
  ```

### Run 9 — 2026-07-07T13:49:31.354Z · ❌ FAILED
- runId: `7a0d9d18-d084-4ed4-9e9e-7e1e1705fb54` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  second call should be cached: False
  ```

### Run 10 — 2026-07-07T14:46:52.412Z · ✅ PASSED
- runId: `6ea9f630-ffde-42f9-b0fa-365ea59a0af9` (source: cli)

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

### Run 10 — 2026-07-06T07:03:18.538Z · ✅ PASSED
- runId: `d39e4eef-06ef-4c78-8afc-da0cd63ff305` (source: cli)

### Run 11 — 2026-07-06T13:45:14.362Z · ✅ PASSED
- runId: `326b5bc9-3ce8-463c-9873-9fb1da4cc43e` (source: cli)

### Run 12 — 2026-07-07T07:25:02.055Z · ✅ PASSED
- runId: `0b262745-5fee-4d98-8a5e-b8a573262e20` (source: cli)

### Run 13 — 2026-07-07T07:45:56.742Z · ❌ FAILED
- runId: `35f23c47-1368-47ae-8dbc-56a0a223715d` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  expected 200, got 403: {"error":"Invalid request origin"}
  ```

### Run 14 — 2026-07-07T07:56:15.087Z · ✅ PASSED
- runId: `93906061-afff-4158-bc5a-eb1f480e2381` (source: cli)

### Run 15 — 2026-07-07T08:55:14.557Z · ✅ PASSED
- runId: `d9b67563-dd14-4037-9b83-1082fc690c7d` (source: cli)

### Run 16 — 2026-07-07T13:42:47.309Z · ✅ PASSED
- runId: `67b22e18-5a0a-4ccf-bfce-3b7382348038` (source: cli)

### Run 17 — 2026-07-07T13:49:17.433Z · ✅ PASSED
- runId: `b4f2260b-f6a1-4ed2-a55a-5eafdde9faf8` (source: cli)

### Run 18 — 2026-07-07T14:46:59.140Z · ✅ PASSED
- runId: `0ead64f5-b7b3-4b9e-8177-116333f6edbe` (source: cli)

## Test — Guarded: AI model whitelist gateway (Step6)
- **testId:** `1a237a45-8410-4f40-8182-a87331e22d3e` · priority p0 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/1a237a45-8410-4f40-8182-a87331e22d3e

### Run 1 — 2026-07-05T03:54:15.643Z · ✅ PASSED
- runId: `436e8a6d-3a98-4cef-82e6-98ddb95f6dee` (source: cli)

### Run 2 — 2026-07-05T04:17:39.435Z · ✅ PASSED
- runId: `cea789a3-68e6-4cd3-b728-405c3b1031be` (source: cli)

### Run 3 — 2026-07-05T04:19:02.734Z · ✅ PASSED
- runId: `afdfc50e-db62-4958-95c5-f9b4a0af9a75` (source: cli)

### Run 4 — 2026-07-05T05:04:22.764Z · ✅ PASSED
- runId: `fa006719-02c1-483f-a50a-ad5d225e1c92` (source: cli)

### Run 5 — 2026-07-05T14:16:14.892Z · ✅ PASSED
- runId: `20075947-9590-4a35-89c7-48bfdea88c57` (source: cli)

### Run 6 — 2026-07-05T14:47:31.635Z · ✅ PASSED
- runId: `25a91c9b-5788-403d-a4b3-60c39056e1e2` (source: cli)

### Run 7 — 2026-07-05T14:52:26.665Z · ❌ FAILED
- runId: `85b40537-875d-45ca-8f04-2eb60c9c8527` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  expected 400, got 429: {"error":"Too many requests. Please wait a moment and try again."}
  ```

### Run 8 — 2026-07-05T16:45:56.336Z · ✅ PASSED
- runId: `ed53d964-ee34-434e-b7ea-13568663bbfc` (source: cli)

### Run 9 — 2026-07-05T16:48:48.456Z · ✅ PASSED
- runId: `b9d38fd6-6f4a-4c5e-8146-05ce00f33a3a` (source: cli)

### Run 10 — 2026-07-05T16:49:32.161Z · ✅ PASSED
- runId: `02ce3169-0e7b-4027-bc4b-2bb9594f38fd` (source: cli)

### Run 11 — 2026-07-05T16:55:20.319Z · ✅ PASSED
- runId: `558eaa25-6ca3-4298-8c52-6ed1eeb15a5f` (source: cli)

### Run 12 — 2026-07-06T07:03:40.745Z · ✅ PASSED
- runId: `ab676688-95fb-469c-95e8-d0d4fbdbf4cf` (source: cli)

### Run 13 — 2026-07-06T13:44:34.475Z · ✅ PASSED
- runId: `74229aae-71d9-4748-b541-9b8fb2e556e5` (source: cli)

### Run 14 — 2026-07-07T07:24:49.612Z · ❌ FAILED
- runId: `8d0edb4e-2a0a-4ca2-89dd-8d955a1ec89b` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  HTTPSConnectionPool(host='loop-analytics-nine.vercel.app', port=443): Read timed out. (read timeout=30)
  ```

### Run 15 — 2026-07-07T07:45:56.810Z · ❌ FAILED
- runId: `a356ee39-f9ca-46e3-80fd-9ca1bad4223e` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  expected 200, got 403: {"error":"Invalid request origin"}
  ```

### Run 16 — 2026-07-07T07:56:12.382Z · ✅ PASSED
- runId: `3ed17fb4-1d42-4043-b723-5670a5636725` (source: cli)

### Run 17 — 2026-07-07T08:54:53.145Z · ✅ PASSED
- runId: `80b8ec21-aa3d-4f65-8b05-307f177e83f7` (source: cli)

### Run 18 — 2026-07-07T13:42:46.399Z · ✅ PASSED
- runId: `66922bdb-897e-469f-bbe3-a56dff72f71b` (source: cli)

### Run 19 — 2026-07-07T13:49:31.653Z · ✅ PASSED
- runId: `f19c7045-d698-4f75-bd45-94dbec2b016c` (source: cli)

### Run 20 — 2026-07-07T14:46:30.386Z · ✅ PASSED
- runId: `665f14d2-6034-4c51-8509-fbdf1267016b` (source: cli)

## Test — Guarded: Chat auth + message limits (#6,#12)
- **testId:** `a24f74ed-149b-4c39-81cb-9ab3cc44833a` · priority p1 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/a24f74ed-149b-4c39-81cb-9ab3cc44833a

### Run 1 — 2026-07-05T03:52:00.156Z · ✅ PASSED
- runId: `4155bcff-e166-441b-a4a9-1d6490642ef3` (source: cli)

### Run 2 — 2026-07-05T03:54:04.941Z · ✅ PASSED
- runId: `7d5e39d2-bcff-4a2e-b598-b1fb752cfaff` (source: cli)

### Run 3 — 2026-07-05T04:17:07.379Z · ✅ PASSED
- runId: `29b9a8f7-925c-430e-838b-c667e6e2d918` (source: cli)

### Run 4 — 2026-07-05T04:18:48.046Z · ✅ PASSED
- runId: `99110403-7576-4ba1-bbdc-c1002af529be` (source: cli)

### Run 5 — 2026-07-05T05:04:16.965Z · ✅ PASSED
- runId: `8e26e286-cfef-4a3c-b76f-2a4551ef607f` (source: cli)

### Run 6 — 2026-07-05T14:16:09.389Z · ✅ PASSED
- runId: `45e209dc-94f8-4002-bbe0-d6e51df7bfca` (source: cli)

### Run 7 — 2026-07-05T14:47:29.992Z · ✅ PASSED
- runId: `63cf1ef2-2a25-4c25-ba76-914f43f300eb` (source: cli)

### Run 8 — 2026-07-05T14:52:32.036Z · ✅ PASSED
- runId: `75859d11-dc7f-4c2c-b62e-d8a1b9fbdb0a` (source: cli)

### Run 9 — 2026-07-05T16:48:45.077Z · ✅ PASSED
- runId: `37efe985-9357-4883-b831-0a876d9e2ade` (source: cli)

### Run 10 — 2026-07-05T16:49:37.224Z · ✅ PASSED
- runId: `b0e7c5a5-ea27-4005-b0c6-30818d8d3ba6` (source: cli)

### Run 11 — 2026-07-05T16:55:17.972Z · ✅ PASSED
- runId: `ac2c6602-26dd-4a00-b9c9-362d6f072ffa` (source: cli)

### Run 12 — 2026-07-06T07:02:53.100Z · ✅ PASSED
- runId: `6c8e2fd5-aafb-4d13-a1b8-1955624880f4` (source: cli)

### Run 13 — 2026-07-06T13:44:15.518Z · ✅ PASSED
- runId: `27a616e9-cce2-44b6-97a4-5e4fb869a0fd` (source: cli)

### Run 14 — 2026-07-07T07:24:19.779Z · ✅ PASSED
- runId: `dbf90fb9-67f8-4f8a-b372-3d5dc5d534f6` (source: cli)

### Run 15 — 2026-07-07T07:45:56.793Z · ❌ FAILED
- runId: `69730bf0-d7fb-4e61-8811-ff8c01abc62f` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  expected 400, got 403: {"error":"Invalid request origin"}
  ```

### Run 16 — 2026-07-07T07:55:53.070Z · ✅ PASSED
- runId: `a013a062-a2ec-4747-9033-71109499dc0a` (source: cli)

### Run 17 — 2026-07-07T08:54:46.496Z · ✅ PASSED
- runId: `8b80a1ab-512d-4f95-a8d7-16175e887de5` (source: cli)

### Run 18 — 2026-07-07T13:42:16.096Z · ✅ PASSED
- runId: `754b9d88-087b-4c9c-bd2f-846cfdd09833` (source: cli)

### Run 19 — 2026-07-07T13:49:01.108Z · ✅ PASSED
- runId: `0fd0db4e-2af9-4bb4-a935-df8ff010720c` (source: cli)

### Run 20 — 2026-07-07T14:46:25.699Z · ✅ PASSED
- runId: `0fb0e244-4ecd-4e1f-b4c5-0583658b9066` (source: cli)

## Test — Guarded: CSV quoted/partial/row-limit (#19,#20)
- **testId:** `4dd8880e-945b-4aea-84d5-39936eeaa473` · priority p1 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/4dd8880e-945b-4aea-84d5-39936eeaa473

### Run 1 — 2026-07-05T03:51:59.598Z · ✅ PASSED
- runId: `798c81c5-a256-48d7-b87d-50584973984e` (source: cli)

### Run 2 — 2026-07-05T03:54:04.974Z · ✅ PASSED
- runId: `becb70e5-ee5b-427f-970c-09f4874bd953` (source: cli)

### Run 3 — 2026-07-05T04:17:07.431Z · ✅ PASSED
- runId: `6de12ef8-0f0b-45f5-bf7c-d120de6fbd62` (source: cli)

### Run 4 — 2026-07-05T04:18:48.775Z · ✅ PASSED
- runId: `b7991c8e-781e-4a20-9fe0-60cceeb2307f` (source: cli)

### Run 5 — 2026-07-05T05:04:17.190Z · ✅ PASSED
- runId: `f32bb633-c3a6-4a0b-8597-30fdc2130090` (source: cli)

### Run 6 — 2026-07-05T14:16:09.022Z · ✅ PASSED
- runId: `7d393afe-b0a6-401c-915a-e8c95c8a8d36` (source: cli)

### Run 7 — 2026-07-05T14:47:30.029Z · ✅ PASSED
- runId: `ed1d9454-4bc3-41ae-b1b9-4b59d33cb9c8` (source: cli)

### Run 8 — 2026-07-05T14:52:36.756Z · ✅ PASSED
- runId: `98348485-daf3-4b78-932e-37490d21c61f` (source: cli)

### Run 9 — 2026-07-05T16:48:45.130Z · ✅ PASSED
- runId: `a22bdc6b-c65e-4775-9b5a-b824401067c0` (source: cli)

### Run 10 — 2026-07-05T16:49:42.274Z · ✅ PASSED
- runId: `8d9b44ba-592d-4911-9855-314d607d05d5` (source: cli)

### Run 11 — 2026-07-05T16:55:17.545Z · ✅ PASSED
- runId: `8bdebd43-e559-4679-b979-80829f460e03` (source: cli)

### Run 12 — 2026-07-06T07:02:53.157Z · ✅ PASSED
- runId: `900d3661-c577-460e-b841-9da8d42ba306` (source: cli)

### Run 13 — 2026-07-06T13:44:15.552Z · ✅ PASSED
- runId: `abb1a43d-60bc-4961-b9fe-2cfa9ecee32e` (source: cli)

### Run 14 — 2026-07-07T07:24:19.788Z · ✅ PASSED
- runId: `adf9dc22-b9cc-4742-966a-4f0d048f6a3a` (source: cli)

### Run 15 — 2026-07-07T07:45:56.977Z · ✅ PASSED
- runId: `eb7bf20d-0d32-4d3b-a8bd-6fac3525f477` (source: cli)

### Run 16 — 2026-07-07T07:55:53.056Z · ✅ PASSED
- runId: `5bff006c-090d-41c4-8096-fac5a394b65c` (source: cli)

### Run 17 — 2026-07-07T08:54:46.989Z · ✅ PASSED
- runId: `d8231101-9f99-4587-b091-8e5e4cbebf5a` (source: cli)

### Run 18 — 2026-07-07T13:42:15.614Z · ✅ PASSED
- runId: `55e4ef0c-3793-4abb-8eb4-f891ad7e5bc2` (source: cli)

### Run 19 — 2026-07-07T13:49:00.972Z · ✅ PASSED
- runId: `50fd8f59-8ba8-4cc2-864a-dce853ad7133` (source: cli)

### Run 20 — 2026-07-07T14:46:26.212Z · ✅ PASSED
- runId: `96137469-0e91-4890-a4c8-aa57ca77f54c` (source: cli)

## Test — Guarded: CRUD delete lifecycle (#16)
- **testId:** `2d7b3f6d-f883-4be6-b0e5-440df863fce5` · priority p1 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/2d7b3f6d-f883-4be6-b0e5-440df863fce5

### Run 1 — 2026-07-05T03:52:00.116Z · ✅ PASSED
- runId: `ae6fbe43-d6f7-4ffb-b1ee-0dea5c70e2e6` (source: cli)

### Run 2 — 2026-07-05T03:54:05.210Z · ✅ PASSED
- runId: `78b22a2c-2ed2-402e-9dd1-f927f1f5c05c` (source: cli)

### Run 3 — 2026-07-05T04:17:07.597Z · ✅ PASSED
- runId: `b99cfb58-9f8f-40a2-829d-b0882a28338c` (source: cli)

### Run 4 — 2026-07-05T04:18:48.934Z · ✅ PASSED
- runId: `d5b4ec80-decf-416d-972a-e9b7873b67ba` (source: cli)

### Run 5 — 2026-07-05T05:04:17.304Z · ✅ PASSED
- runId: `32a058f0-28fd-43a6-8f70-285a3e356f7e` (source: cli)

### Run 6 — 2026-07-05T14:16:09.838Z · ✅ PASSED
- runId: `6af435c1-f9d2-4546-8b62-450ddf8dd902` (source: cli)

### Run 7 — 2026-07-05T14:47:30.146Z · ✅ PASSED
- runId: `74ba819b-ac14-4427-a949-6faf11a606e9` (source: cli)

### Run 8 — 2026-07-05T14:52:42.119Z · ✅ PASSED
- runId: `72d7cbe4-52e7-493a-87c0-dc6ff44ecb8e` (source: cli)

### Run 9 — 2026-07-05T16:48:45.236Z · ✅ PASSED
- runId: `49ed4e95-7dda-4ebe-b97c-c31e29115cd3` (source: cli)

### Run 10 — 2026-07-05T16:49:46.983Z · ✅ PASSED
- runId: `d30f09dd-2668-4b4b-92b9-b6600d8252d5` (source: cli)

### Run 11 — 2026-07-05T16:55:17.714Z · ✅ PASSED
- runId: `939c0ed2-f08a-4b5e-bfd8-ae9406f33c99` (source: cli)

### Run 12 — 2026-07-06T07:02:53.470Z · ✅ PASSED
- runId: `ae1e3da3-3d9d-4494-b2eb-532a67846aab` (source: cli)

### Run 13 — 2026-07-06T13:44:15.752Z · ✅ PASSED
- runId: `1716b5f6-5904-4f1c-9a40-448771b7d59c` (source: cli)

### Run 14 — 2026-07-07T07:24:20.848Z · ✅ PASSED
- runId: `d05c5427-c9f3-4b13-a563-9094274a08a2` (source: cli)

### Run 15 — 2026-07-07T07:45:57.349Z · ✅ PASSED
- runId: `eb7e94b6-3043-4696-90ee-33af95043ae8` (source: cli)

### Run 16 — 2026-07-07T07:55:53.665Z · ❌ FAILED
- runId: `157267ae-2ebc-45cd-83ff-b7b8319baed7` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  expected 403 without CSRF, got 200: {"success":true,"deletedId":195}
  ```

### Run 17 — 2026-07-07T08:54:46.030Z · ✅ PASSED
- runId: `5f65ff4c-0658-4f5d-abe3-659cbc06be6a` (source: cli)

### Run 18 — 2026-07-07T13:42:16.467Z · ✅ PASSED
- runId: `755a9901-f7ee-4f59-bfff-0f09669f0fa3` (source: cli)

### Run 19 — 2026-07-07T13:49:01.084Z · ✅ PASSED
- runId: `c12c9795-21a1-408d-9f87-5ab819e303fc` (source: cli)

### Run 20 — 2026-07-07T14:46:26.239Z · ✅ PASSED
- runId: `d286b5d4-5c9a-4ef1-9e24-0aa3d138a19a` (source: cli)

## Test — Guarded: Pagination + MRR/LTV schema (#15,#18)
- **testId:** `36f0c5ef-3ecf-467a-b287-2b5bff1faefa` · priority p1 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/36f0c5ef-3ecf-467a-b287-2b5bff1faefa

### Run 1 — 2026-07-05T03:52:00.074Z · ✅ PASSED
- runId: `98d20328-b7fa-4c5e-9046-b07161db7ae6` (source: cli)

### Run 2 — 2026-07-05T03:54:05.181Z · ✅ PASSED
- runId: `abc63672-2850-481a-a154-af6c71bd9c3c` (source: cli)

### Run 3 — 2026-07-05T04:17:07.120Z · ✅ PASSED
- runId: `e0f0a1f5-90e2-495a-91f9-d2ffbfae8581` (source: cli)

### Run 4 — 2026-07-05T04:18:49.002Z · ✅ PASSED
- runId: `a7076cdd-6a7b-426e-af1d-4f785cfe8350` (source: cli)

### Run 5 — 2026-07-05T05:04:17.322Z · ✅ PASSED
- runId: `6f8d978d-1e43-41ba-9e89-8d3395a2f15c` (source: cli)

### Run 6 — 2026-07-05T14:16:09.443Z · ✅ PASSED
- runId: `dc8971ed-40e6-4511-8c28-45327485f07a` (source: cli)

### Run 7 — 2026-07-05T14:47:30.216Z · ✅ PASSED
- runId: `d8707fd6-6f54-4da8-af1e-f5a2de2e746b` (source: cli)

### Run 8 — 2026-07-05T14:52:47.025Z · ✅ PASSED
- runId: `83d60448-a82b-4f35-ba6a-2bbc9826e059` (source: cli)

### Run 9 — 2026-07-05T16:48:45.428Z · ✅ PASSED
- runId: `7245a076-baef-487a-ad97-d2404ee88ae6` (source: cli)

### Run 10 — 2026-07-05T16:49:51.878Z · ✅ PASSED
- runId: `24af629f-5340-412a-972f-568a71815476` (source: cli)

### Run 11 — 2026-07-05T16:55:17.842Z · ✅ PASSED
- runId: `31e46c01-3708-4b19-9ed9-18ed6162c768` (source: cli)

### Run 12 — 2026-07-06T07:02:53.342Z · ✅ PASSED
- runId: `75919587-a1f2-4484-80a4-16ff167d749f` (source: cli)

### Run 13 — 2026-07-06T13:44:15.067Z · ✅ PASSED
- runId: `3237cb66-eba4-44b7-b62e-1ab11fc189ac` (source: cli)

### Run 14 — 2026-07-07T07:24:21.049Z · ✅ PASSED
- runId: `d8b712ae-0f19-41f2-9469-d26ad72ad4d3` (source: cli)

### Run 15 — 2026-07-07T07:45:57.470Z · ✅ PASSED
- runId: `474e7a91-3cec-4b85-998d-18db2669f684` (source: cli)

### Run 16 — 2026-07-07T07:55:53.815Z · ✅ PASSED
- runId: `69bd20be-830f-4169-8478-f557d2d6df48` (source: cli)

### Run 17 — 2026-07-07T08:54:47.255Z · ✅ PASSED
- runId: `fb777dd2-5b13-4993-a2db-ce3e93109899` (source: cli)

### Run 18 — 2026-07-07T13:42:16.410Z · ✅ PASSED
- runId: `34f34352-02db-4448-bda0-a3c7f9101b8f` (source: cli)

### Run 19 — 2026-07-07T13:49:01.538Z · ✅ PASSED
- runId: `2e9f38c2-bb5b-412e-a30c-57dacdef933a` (source: cli)

### Run 20 — 2026-07-07T14:46:26.383Z · ✅ PASSED
- runId: `8f75150a-263a-45b9-ada5-2f3d02c67a35` (source: cli)

## Test — Guarded: CSV batch upload + CSRF
- **testId:** `da8bf044-7278-4513-87af-67811972a7c2` · priority p0 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/da8bf044-7278-4513-87af-67811972a7c2

### Run 1 — 2026-07-05T03:51:58.334Z · ✅ PASSED
- runId: `375eaf88-5698-4def-9fc5-1446c72f18d9` (source: cli)

### Run 2 — 2026-07-05T03:54:05.374Z · ✅ PASSED
- runId: `8c12d6fb-bced-4661-b122-b322a1321693` (source: cli)

### Run 3 — 2026-07-05T04:17:07.770Z · ✅ PASSED
- runId: `dbcc8dcc-6dfa-4959-8310-054057af9179` (source: cli)

### Run 4 — 2026-07-05T04:18:49.013Z · ✅ PASSED
- runId: `890c0b63-5bd8-4ab2-b108-286c176952d7` (source: cli)

### Run 5 — 2026-07-05T05:04:16.349Z · ✅ PASSED
- runId: `a7ba54b1-ef91-49ed-8f39-71b402f96bd5` (source: cli)

### Run 6 — 2026-07-05T14:16:09.878Z · ✅ PASSED
- runId: `26f16a07-fab7-4d2b-a5c6-91f7fe5e9a90` (source: cli)

### Run 7 — 2026-07-05T14:47:30.225Z · ✅ PASSED
- runId: `36ef0ad9-befa-4820-80b5-8d8fb1dba396` (source: cli)

### Run 8 — 2026-07-05T14:52:52.336Z · ✅ PASSED
- runId: `fe019a4d-0aa1-4c8c-a962-fb7640fc1414` (source: cli)

### Run 9 — 2026-07-05T16:48:45.243Z · ✅ PASSED
- runId: `f9fa83bc-001b-4f09-b808-667a4716bd39` (source: cli)

### Run 10 — 2026-07-05T16:49:56.962Z · ✅ PASSED
- runId: `a3059dda-a7cb-4f4b-bcb5-54911adac739` (source: cli)

### Run 11 — 2026-07-05T16:55:18.496Z · ✅ PASSED
- runId: `5d63e97e-7e5a-4528-b7d8-665d146836a5` (source: cli)

### Run 12 — 2026-07-06T07:02:53.395Z · ✅ PASSED
- runId: `f7bddf20-3840-4433-9bc5-3ca83cbf927b` (source: cli)

### Run 13 — 2026-07-06T13:44:15.883Z · ✅ PASSED
- runId: `dc2d8646-24ae-465a-92b7-750cecbc2ccb` (source: cli)

### Run 14 — 2026-07-07T07:24:20.037Z · ✅ PASSED
- runId: `53bbe0f8-59fe-4905-9765-a69ac6dc0f80` (source: cli)

### Run 15 — 2026-07-07T07:45:57.184Z · ✅ PASSED
- runId: `93d2444a-eed0-4cfa-8fa2-1e637c781105` (source: cli)

### Run 16 — 2026-07-07T07:55:52.641Z · ✅ PASSED
- runId: `24790aa1-c6ca-4ed6-9c5b-08c2b27c2fd0` (source: cli)

### Run 17 — 2026-07-07T08:54:47.369Z · ✅ PASSED
- runId: `6b922ce8-f558-44c1-b5f4-28e3290b3d1e` (source: cli)

### Run 18 — 2026-07-07T13:42:16.720Z · ✅ PASSED
- runId: `392162fe-4a96-4253-a84b-66b7cd448267` (source: cli)

### Run 19 — 2026-07-07T13:49:01.457Z · ✅ PASSED
- runId: `cebc67cf-192d-49e0-ade2-9d522caf4d25` (source: cli)

### Run 20 — 2026-07-07T14:46:26.345Z · ✅ PASSED
- runId: `c6fea064-7b55-45fb-ac7d-77743a4b193b` (source: cli)

## Test — Guarded: Stateful chain create->list->metrics->insight
- **testId:** `87320b3f-cf42-4442-bac0-8ec3bb4420a9` · priority p0 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/87320b3f-cf42-4442-bac0-8ec3bb4420a9

### Run 1 — 2026-07-05T03:54:07.701Z · ✅ PASSED
- runId: `bd9e48c4-22f0-45e9-bc55-1a0f8d045c6e` (source: cli)

### Run 2 — 2026-07-05T04:17:25.917Z · ✅ PASSED
- runId: `95648aca-d71c-419b-9a32-a85b9d06ca13` (source: cli)

### Run 3 — 2026-07-05T04:19:23.910Z · ✅ PASSED
- runId: `5b900921-ff42-4222-8d55-5ad490c57199` (source: cli)

### Run 4 — 2026-07-05T05:04:18.771Z · ✅ PASSED
- runId: `9e09fa1a-a7ea-4d39-8b8b-53d07f79f00c` (source: cli)

### Run 5 — 2026-07-05T14:16:16.951Z · ✅ PASSED
- runId: `3192eb81-88b2-4653-8d3d-13c254c79f25` (source: cli)

### Run 6 — 2026-07-05T14:47:29.190Z · ✅ PASSED
- runId: `6f415332-ef1c-4a46-8c57-eecad12b3bb6` (source: cli)

### Run 7 — 2026-07-05T14:52:56.680Z · ❌ FAILED
- runId: `5451da26-f1eb-4b96-b0f8-15774a2f64ab` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  {"error":"Too many requests. Please wait a moment and try again."}
  ```

### Run 8 — 2026-07-05T16:45:59.622Z · ✅ PASSED
- runId: `b0f1baaf-fc21-4bcd-80e1-fc2ad423ee4d` (source: cli)

### Run 9 — 2026-07-05T16:48:45.828Z · ✅ PASSED
- runId: `4e4d4f73-8df7-4710-bc7d-55ad870ed658` (source: cli)

### Run 10 — 2026-07-05T16:50:03.324Z · ✅ PASSED
- runId: `385e1f8e-36a1-4e7a-94ef-6a8de49744eb` (source: cli)

### Run 11 — 2026-07-05T16:55:18.576Z · ✅ PASSED
- runId: `49f29f2f-bc99-409f-82cd-62fcf3777b97` (source: cli)

### Run 12 — 2026-07-06T07:03:19.375Z · ✅ PASSED
- runId: `a4b51583-117b-4e08-a7bf-bab7022ac03f` (source: cli)

### Run 13 — 2026-07-06T13:44:53.071Z · ✅ PASSED
- runId: `93f2068c-498c-409b-a7c3-27b0d0301baf` (source: cli)

### Run 14 — 2026-07-07T07:24:45.150Z · ✅ PASSED
- runId: `6696bb18-f0fd-48be-ba69-6fdd3e533e4c` (source: cli)

### Run 15 — 2026-07-07T07:45:56.618Z · ❌ FAILED
- runId: `9ea5c485-3dae-4a4f-b49a-e4846ea4c6bf` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  {"error":"Invalid request origin"}
  ```

### Run 16 — 2026-07-07T07:56:08.386Z · ✅ PASSED
- runId: `332300df-e913-4a5f-ae26-e0cf344648bf` (source: cli)

### Run 17 — 2026-07-07T08:54:55.001Z · ✅ PASSED
- runId: `47acf577-643d-40a2-9a70-c1817ef400e6` (source: cli)

### Run 18 — 2026-07-07T13:42:31.524Z · ✅ PASSED
- runId: `3e7afade-0c4e-4b27-8375-5afffecac652` (source: cli)

### Run 19 — 2026-07-07T13:49:16.452Z · ✅ PASSED
- runId: `8c9d7107-4a44-48c0-8e92-debff780c56b` (source: cli)

### Run 20 — 2026-07-07T14:46:41.484Z · ✅ PASSED
- runId: `d920e23e-a9d2-4298-b3c1-a166a6893116` (source: cli)

## Test — Guarded: Projects persist + CSRF
- **testId:** `33cf2c68-e994-43fe-bf0e-c5de93112c1c` · priority p1 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/33cf2c68-e994-43fe-bf0e-c5de93112c1c

### Run 1 — 2026-07-05T03:51:58.714Z · ✅ PASSED
- runId: `07160c0b-8cea-4985-a6f0-9b74cbb50cd1` (source: cli)

### Run 2 — 2026-07-05T03:54:05.095Z · ✅ PASSED
- runId: `d53cb637-c505-4767-85a7-48cc26105f06` (source: cli)

### Run 3 — 2026-07-05T04:17:07.627Z · ✅ PASSED
- runId: `ad68449d-8113-4672-8650-a1876ec01e85` (source: cli)

### Run 4 — 2026-07-05T04:18:48.749Z · ✅ PASSED
- runId: `c5c6bc0e-623b-481a-81a2-d3e207d47769` (source: cli)

### Run 5 — 2026-07-05T05:04:17.234Z · ✅ PASSED
- runId: `e7ceded7-e385-42a0-a16c-31ce2eecbdf1` (source: cli)

### Run 6 — 2026-07-05T14:16:09.326Z · ✅ PASSED
- runId: `4b4dbc92-079a-48dc-a895-f43b7a0c7d78` (source: cli)

### Run 7 — 2026-07-05T14:47:30.037Z · ✅ PASSED
- runId: `dfc6456e-0c95-47c3-9a68-f26c4f1c92cf` (source: cli)

### Run 8 — 2026-07-05T14:53:02.428Z · ✅ PASSED
- runId: `8892b2d9-18d0-4db0-8734-3753974896cc` (source: cli)

### Run 9 — 2026-07-05T16:48:45.213Z · ✅ PASSED
- runId: `cd600398-b64e-4cb3-9021-217d85a676d8` (source: cli)

### Run 10 — 2026-07-05T16:50:08.432Z · ✅ PASSED
- runId: `45064f83-9696-4d8e-b0f4-d46056c90f87` (source: cli)

### Run 11 — 2026-07-05T16:55:17.748Z · ✅ PASSED
- runId: `b6524873-1623-4a81-b7f2-542f04604f35` (source: cli)

### Run 12 — 2026-07-06T07:02:53.126Z · ✅ PASSED
- runId: `7b12c830-0667-48a5-a5ad-2538840ae7fc` (source: cli)

### Run 13 — 2026-07-06T13:44:15.715Z · ✅ PASSED
- runId: `aedc770b-c8fc-4101-817f-ec8b504e4bc6` (source: cli)

### Run 14 — 2026-07-07T07:24:20.777Z · ✅ PASSED
- runId: `23e4a4d3-612e-4b00-87ad-b5cade8ee7cf` (source: cli)

### Run 15 — 2026-07-07T07:45:57.142Z · ✅ PASSED
- runId: `bd23c0d7-e7f9-410b-84b8-c61ac6e55558` (source: cli)

### Run 16 — 2026-07-07T07:55:52.747Z · ✅ PASSED
- runId: `e318874c-f38e-4501-a6fb-c2b6ce64fb61` (source: cli)

### Run 17 — 2026-07-07T08:54:47.279Z · ✅ PASSED
- runId: `8ae4bb95-3b53-4b8c-9a02-03ac2e4a8a16` (source: cli)

### Run 18 — 2026-07-07T13:42:16.553Z · ✅ PASSED
- runId: `97b22271-6548-4d7c-ad8e-b64e07927824` (source: cli)

### Run 19 — 2026-07-07T13:49:01.203Z · ✅ PASSED
- runId: `fa02f55c-64b7-4a53-a621-9e50be56a04c` (source: cli)

### Run 20 — 2026-07-07T14:46:26.285Z · ✅ PASSED
- runId: `e61a832b-1a02-4e3a-82ab-4620aeecb80b` (source: cli)

## Test — Guarded: Edge cases + risk boundaries
- **testId:** `159574eb-5b29-4880-bfad-0449ec44206f` · priority p1 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/159574eb-5b29-4880-bfad-0449ec44206f

### Run 1 — 2026-07-05T03:51:59.468Z · ✅ PASSED
- runId: `2da173cc-0ad5-448f-8125-7d3b07dfccce` (source: cli)

### Run 2 — 2026-07-05T03:54:04.966Z · ✅ PASSED
- runId: `871998b6-88cf-4c03-a050-f90db07906ee` (source: cli)

### Run 3 — 2026-07-05T04:17:07.514Z · ✅ PASSED
- runId: `20a9f576-7e66-41c1-9d14-f0aaf8a7388c` (source: cli)

### Run 4 — 2026-07-05T04:18:49.035Z · ✅ PASSED
- runId: `6f3d7062-3255-485c-b8fd-921fd629a89e` (source: cli)

### Run 5 — 2026-07-05T05:04:16.891Z · ✅ PASSED
- runId: `0913e375-d218-4d27-a6cc-a691bf7fb7f1` (source: cli)

### Run 6 — 2026-07-05T14:16:09.629Z · ✅ PASSED
- runId: `0913851d-7ca9-4f9c-bcec-0196d31eb3a0` (source: cli)

### Run 7 — 2026-07-05T14:47:29.249Z · ✅ PASSED
- runId: `e67c9b89-9cb2-4220-adb1-4cf12b4bc19d` (source: cli)

### Run 8 — 2026-07-05T14:53:07.034Z · ✅ PASSED
- runId: `1b1c284b-0d5c-4946-934d-9c15d92b4ba5` (source: cli)

### Run 9 — 2026-07-05T16:48:43.759Z · ✅ PASSED
- runId: `48f4153d-9a1b-40af-b7b2-87e6b3e0aa4a` (source: cli)

### Run 10 — 2026-07-05T16:50:13.086Z · ✅ PASSED
- runId: `c661b1e9-cb67-43a8-8bb7-e7048775e143` (source: cli)

### Run 11 — 2026-07-05T16:55:17.774Z · ✅ PASSED
- runId: `ca361021-3ae0-4ddc-b733-4affce930d49` (source: cli)

### Run 12 — 2026-07-06T07:02:53.096Z · ✅ PASSED
- runId: `85f29858-dee0-40b4-b8d4-c9bd4e4d112a` (source: cli)

### Run 13 — 2026-07-06T13:44:15.680Z · ✅ PASSED
- runId: `deca8a3c-589c-4c5f-adb8-7c603bfe8551` (source: cli)

### Run 14 — 2026-07-07T07:24:19.804Z · ✅ PASSED
- runId: `9a53e3e6-5d53-4269-bc7a-2f77582122b4` (source: cli)

### Run 15 — 2026-07-07T07:45:57.094Z · ✅ PASSED
- runId: `a4eac4c5-e38f-4ad3-8f6d-4f061849402e` (source: cli)

### Run 16 — 2026-07-07T07:55:53.264Z · ✅ PASSED
- runId: `4c4ea027-35eb-4f1c-8d85-aa6e7c2177bc` (source: cli)

### Run 17 — 2026-07-07T08:54:46.639Z · ✅ PASSED
- runId: `178a0f32-4501-45d4-900c-4a3ce15e111c` (source: cli)

### Run 18 — 2026-07-07T13:42:16.793Z · ✅ PASSED
- runId: `38e59811-bc23-4ad9-87ef-52bd37feea73` (source: cli)

### Run 19 — 2026-07-07T13:49:01.247Z · ✅ PASSED
- runId: `2f98b4e5-97e8-44c5-87db-fc4f43fd0704` (source: cli)

### Run 20 — 2026-07-07T14:46:26.259Z · ✅ PASSED
- runId: `6438046b-41ec-479e-9a8a-65bea8a3a441` (source: cli)

## Test — Guarded: Metrics API + body size (#8,#11)
- **testId:** `cd31cfd5-eb6a-4dd3-9f2c-e86cbcd3ab2e` · priority p0 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/cd31cfd5-eb6a-4dd3-9f2c-e86cbcd3ab2e

### Run 1 — 2026-07-05T03:52:00.375Z · ✅ PASSED
- runId: `bc86a826-ed59-40c8-b619-ae025ea1ecba` (source: cli)

### Run 2 — 2026-07-05T03:54:05.224Z · ✅ PASSED
- runId: `563fdeec-a8d3-49ba-b83a-954c25b46548` (source: cli)

### Run 3 — 2026-07-05T04:17:07.661Z · ✅ PASSED
- runId: `906028a9-ff01-4658-b594-74a075215945` (source: cli)

### Run 4 — 2026-07-05T04:18:48.898Z · ✅ PASSED
- runId: `b7dbfb44-06b6-4a13-821b-4a3e9ccdf28b` (source: cli)

### Run 5 — 2026-07-05T05:04:17.183Z · ✅ PASSED
- runId: `4d71dcb7-c915-453c-a2f7-732bfa49105d` (source: cli)

### Run 6 — 2026-07-05T14:16:09.847Z · ✅ PASSED
- runId: `d93e7edf-2e0f-43a7-a339-ad2501b758e5` (source: cli)

### Run 7 — 2026-07-05T14:47:30.136Z · ✅ PASSED
- runId: `cd48acdc-d8be-44cc-b191-411a06159f1c` (source: cli)

### Run 8 — 2026-07-05T14:53:13.509Z · ✅ PASSED
- runId: `d62f329e-12b6-40e6-8377-7494f930e18d` (source: cli)

### Run 9 — 2026-07-05T16:48:45.363Z · ✅ PASSED
- runId: `17c74cb6-be79-4797-9e6c-7ecc6f334ed5` (source: cli)

### Run 10 — 2026-07-05T16:50:18.181Z · ✅ PASSED
- runId: `a00f81ce-7a6e-4236-9685-85d4eb004a44` (source: cli)

### Run 11 — 2026-07-05T16:55:18.353Z · ✅ PASSED
- runId: `08bc1270-55ef-4abe-80eb-a50c29998552` (source: cli)

### Run 12 — 2026-07-06T07:02:53.287Z · ✅ PASSED
- runId: `c726044e-2a18-47fd-8f0e-6e69a29c0cae` (source: cli)

### Run 13 — 2026-07-06T13:44:15.768Z · ✅ PASSED
- runId: `7e072f63-811e-47df-812a-6fd274398874` (source: cli)

### Run 14 — 2026-07-07T07:24:20.463Z · ✅ PASSED
- runId: `b92190e0-cad9-4e0c-a494-4b4aba84a31c` (source: cli)

### Run 15 — 2026-07-07T07:45:56.860Z · ✅ PASSED
- runId: `a0c57499-eff9-4114-9075-afe5ce7b07d3` (source: cli)

### Run 16 — 2026-07-07T07:55:53.291Z · ✅ PASSED
- runId: `b3219aee-add1-439a-b5c4-e43fea588a6a` (source: cli)

### Run 17 — 2026-07-07T08:54:47.341Z · ✅ PASSED
- runId: `4c90386a-274b-4a42-a48d-3095cb99ece1` (source: cli)

### Run 18 — 2026-07-07T13:42:16.288Z · ✅ PASSED
- runId: `8d1f4a99-1984-451a-bdf2-1eebc3804e28` (source: cli)

### Run 19 — 2026-07-07T13:49:01.149Z · ✅ PASSED
- runId: `4e06982c-7829-4396-919d-c1ee9083c61a` (source: cli)

### Run 20 — 2026-07-07T14:46:26.339Z · ✅ PASSED
- runId: `96149234-91b8-4a4b-92a2-eafee8a6bee9` (source: cli)

## Test — Guarded: auth, cookie-signing & CSRF
- **testId:** `1f856ba7-1490-4ceb-945e-ab453827e714` · priority p0 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/1f856ba7-1490-4ceb-945e-ab453827e714

### Run 1 — 2026-07-05T03:52:00.472Z · ✅ PASSED
- runId: `b3edc3d9-7ad3-4ba2-8821-6a4d74a2b991` (source: cli)

### Run 2 — 2026-07-05T03:54:04.968Z · ✅ PASSED
- runId: `0e32a44c-d7c0-4835-9951-3b8d3f11cc57` (source: cli)

### Run 3 — 2026-07-05T04:17:07.802Z · ✅ PASSED
- runId: `627287d6-9a36-47ff-ab99-cb07d90dad42` (source: cli)

### Run 4 — 2026-07-05T04:18:48.932Z · ✅ PASSED
- runId: `b067cc61-5665-4307-bd42-bde6babcaa0e` (source: cli)

### Run 5 — 2026-07-05T05:04:17.363Z · ✅ PASSED
- runId: `27ec07fa-d65c-4a98-aa65-4689e0c93078` (source: cli)

### Run 6 — 2026-07-05T14:16:09.909Z · ✅ PASSED
- runId: `371de230-a431-49e9-89a2-f2cb991b3e00` (source: cli)

### Run 7 — 2026-07-05T14:47:30.196Z · ✅ PASSED
- runId: `84087f2e-200b-40c8-ba96-94e5128ed3ec` (source: cli)

### Run 8 — 2026-07-05T14:53:19.326Z · ✅ PASSED
- runId: `6080903d-801c-4f41-9c57-d716352dd553` (source: cli)

### Run 9 — 2026-07-05T16:48:45.465Z · ✅ PASSED
- runId: `0d390028-f260-4cea-adf7-ca5e8c681313` (source: cli)

### Run 10 — 2026-07-05T16:50:23.104Z · ✅ PASSED
- runId: `1fd04b0b-6b08-4602-bc8e-7fef6b9b969f` (source: cli)

### Run 11 — 2026-07-05T16:55:17.327Z · ✅ PASSED
- runId: `00ef5df1-9c95-44d3-8505-8857133f3c90` (source: cli)

### Run 12 — 2026-07-06T07:02:53.397Z · ✅ PASSED
- runId: `3f775f06-ab6f-4fc6-8978-a3c23471875b` (source: cli)

### Run 13 — 2026-07-06T13:44:15.842Z · ✅ PASSED
- runId: `f6b2c49f-468a-49ae-b841-17cceb826fc6` (source: cli)

### Run 14 — 2026-07-07T07:24:20.861Z · ✅ PASSED
- runId: `f9491b32-523b-49e0-85ec-873f601f7b9d` (source: cli)

### Run 15 — 2026-07-07T07:45:57.231Z · ✅ PASSED
- runId: `d44e74a1-2d93-4a39-a743-a830a7f9ce9d` (source: cli)

### Run 16 — 2026-07-07T07:55:53.462Z · ❌ FAILED
- runId: `6367fb22-4ae0-44d7-a74e-3a3736c5b16f` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  projects without CSRF expected 403, got 201: {"success":true,"project":{"id":194,"createdAt":"2026-07-07T07:55:53.430Z","projectName":"Auth Check","totalUsers":1000,"activeUsers":850,"churnedUsers":150,"monthlyRevenue":5000,"metrics":{"churnRate":0.15,"retentionRate":0.85,"arpu":5,"riskStatus":"Medium","mrr":5000,"estimatedLtv":33.33}}}
  ```

### Run 17 — 2026-07-07T08:54:46.803Z · ✅ PASSED
- runId: `19c506a3-0fd7-4971-81b5-9fac07bb9a74` (source: cli)

### Run 18 — 2026-07-07T13:42:16.415Z · ✅ PASSED
- runId: `2bd55c8e-1d7b-4665-b94a-75962cf33d70` (source: cli)

### Run 19 — 2026-07-07T13:49:01.554Z · ✅ PASSED
- runId: `0f9d22b0-d49f-4172-961c-bbe0ca01df68` (source: cli)

### Run 20 — 2026-07-07T14:46:26.222Z · ✅ PASSED
- runId: `ade14283-b0e7-47f9-81a0-d2b04c121b57` (source: cli)

---

_Regenerated at 2026-07-07T14:49:01.604Z · HEAD cb6d155_
