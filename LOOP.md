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
| Total runs recorded | 259 |

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

### Run 11 — 2026-07-09T07:17:48.373Z · ✅ PASSED
- runId: `23bee38e-e35f-4270-8d74-efa3df2a7846` (source: cli)

### Run 12 — 2026-07-09T07:28:19.280Z · ✅ PASSED
- runId: `b67f8145-8ddc-477b-9df7-b6dda940f565` (source: cli)

### Run 13 — 2026-07-09T11:14:06.394Z · ✅ PASSED
- runId: `e030dcda-6b44-4f56-8f96-05abc5a23ecc` (source: cli)

### Run 14 — 2026-07-09T11:28:00.364Z · ✅ PASSED
- runId: `24644fe8-4ff4-4e18-8ccb-db122d24ec21` (source: cli)

### Run 15 — 2026-07-09T11:53:37.656Z · ✅ PASSED
- runId: `5711d6f8-d0e8-4200-baf6-da45e7ef8ef3` (source: cli)

### Run 16 — 2026-07-09T18:15:17.485Z · ✅ PASSED
- runId: `8a78bdec-7c7b-4691-bd7f-4a7c915de60b` (source: cli)

### Run 17 — 2026-07-09T18:49:57.441Z · ✅ PASSED
- runId: `353abd38-c715-4659-8a86-69064b7b7936` (source: cli)

### Run 18 — 2026-07-10T03:51:35.497Z · ✅ PASSED
- runId: `a3469e2d-54eb-4485-94c0-4b0f65fd112b` (source: cli)

### Run 19 — 2026-07-10T03:57:44.128Z · ✅ PASSED
- runId: `dd2d9da6-be86-449f-b1eb-ac5e9f513967` (source: cli)

## Test — Guarded: Insights shape + model whitelist (#3)
- **testId:** `b6e4f1d6-0784-4f1e-b7bd-5f18a4279d6a` · priority p0 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/b6e4f1d6-0784-4f1e-b7bd-5f18a4279d6a

### Run 1 — 2026-07-05T16:48:46.942Z · ✅ PASSED
- runId: `51f7b8df-f110-4c6a-bdc9-5e9dccf7a369` (source: cli)

### Run 2 — 2026-07-05T16:55:19.380Z · ✅ PASSED
- runId: `7928f6a3-86a8-4ddb-87ce-69020a42aede` (source: cli)

### Run 3 — 2026-07-06T07:03:18.538Z · ✅ PASSED
- runId: `d39e4eef-06ef-4c78-8afc-da0cd63ff305` (source: cli)

### Run 4 — 2026-07-06T13:45:14.362Z · ✅ PASSED
- runId: `326b5bc9-3ce8-463c-9873-9fb1da4cc43e` (source: cli)

### Run 5 — 2026-07-07T07:25:02.055Z · ✅ PASSED
- runId: `0b262745-5fee-4d98-8a5e-b8a573262e20` (source: cli)

### Run 6 — 2026-07-07T07:45:56.742Z · ❌ FAILED
- runId: `35f23c47-1368-47ae-8dbc-56a0a223715d` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  expected 200, got 403: {"error":"Invalid request origin"}
  ```

### Run 7 — 2026-07-07T07:56:15.087Z · ✅ PASSED
- runId: `93906061-afff-4158-bc5a-eb1f480e2381` (source: cli)

### Run 8 — 2026-07-07T08:55:14.557Z · ✅ PASSED
- runId: `d9b67563-dd14-4037-9b83-1082fc690c7d` (source: cli)

### Run 9 — 2026-07-07T13:42:47.309Z · ✅ PASSED
- runId: `67b22e18-5a0a-4ccf-bfce-3b7382348038` (source: cli)

### Run 10 — 2026-07-07T13:49:17.433Z · ✅ PASSED
- runId: `b4f2260b-f6a1-4ed2-a55a-5eafdde9faf8` (source: cli)

### Run 11 — 2026-07-07T14:46:59.140Z · ✅ PASSED
- runId: `0ead64f5-b7b3-4b9e-8177-116333f6edbe` (source: cli)

### Run 12 — 2026-07-09T07:17:42.609Z · ✅ PASSED
- runId: `b0136e7e-c12a-4462-ac03-9f0830fa5516` (source: cli)

### Run 13 — 2026-07-09T07:28:06.797Z · ✅ PASSED
- runId: `df303f42-1770-4397-bfd2-0d4eaf90712d` (source: cli)

### Run 14 — 2026-07-09T11:14:04.533Z · ✅ PASSED
- runId: `a5e458c4-102b-44e5-b836-0d79a72d6baa` (source: cli)

### Run 15 — 2026-07-09T11:27:53.424Z · ✅ PASSED
- runId: `b0ce353a-3dc1-41ac-ae9f-250bbd0166e0` (source: cli)

### Run 16 — 2026-07-09T11:53:36.782Z · ✅ PASSED
- runId: `c44cd404-b89b-4fcf-ba2f-2fe47bf34bfd` (source: cli)

### Run 17 — 2026-07-09T18:15:16.593Z · ✅ PASSED
- runId: `ae595ce4-d910-472e-8f25-ca356c8712ed` (source: cli)

### Run 18 — 2026-07-09T18:49:46.375Z · ✅ PASSED
- runId: `1923bacc-ac4d-408b-9f83-5a448fe18159` (source: cli)

### Run 19 — 2026-07-10T03:51:08.766Z · ✅ PASSED
- runId: `2bc6ab69-7f94-4eb4-8311-83013b37911f` (source: cli)

### Run 20 — 2026-07-10T03:57:57.482Z · ✅ PASSED
- runId: `d9f48880-4ac5-4ce5-b751-01758476091e` (source: cli)

## Test — Guarded: AI model whitelist gateway (Step6)
- **testId:** `1a237a45-8410-4f40-8182-a87331e22d3e` · priority p0 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/1a237a45-8410-4f40-8182-a87331e22d3e

### Run 1 — 2026-07-05T16:49:32.161Z · ✅ PASSED
- runId: `02ce3169-0e7b-4027-bc4b-2bb9594f38fd` (source: cli)

### Run 2 — 2026-07-05T16:55:20.319Z · ✅ PASSED
- runId: `558eaa25-6ca3-4298-8c52-6ed1eeb15a5f` (source: cli)

### Run 3 — 2026-07-06T07:03:40.745Z · ✅ PASSED
- runId: `ab676688-95fb-469c-95e8-d0d4fbdbf4cf` (source: cli)

### Run 4 — 2026-07-06T13:44:34.475Z · ✅ PASSED
- runId: `74229aae-71d9-4748-b541-9b8fb2e556e5` (source: cli)

### Run 5 — 2026-07-07T07:24:49.612Z · ❌ FAILED
- runId: `8d0edb4e-2a0a-4ca2-89dd-8d955a1ec89b` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  HTTPSConnectionPool(host='loop-analytics-nine.vercel.app', port=443): Read timed out. (read timeout=30)
  ```

### Run 6 — 2026-07-07T07:45:56.810Z · ❌ FAILED
- runId: `a356ee39-f9ca-46e3-80fd-9ca1bad4223e` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  expected 200, got 403: {"error":"Invalid request origin"}
  ```

### Run 7 — 2026-07-07T07:56:12.382Z · ✅ PASSED
- runId: `3ed17fb4-1d42-4043-b723-5670a5636725` (source: cli)

### Run 8 — 2026-07-07T08:54:53.145Z · ✅ PASSED
- runId: `80b8ec21-aa3d-4f65-8b05-307f177e83f7` (source: cli)

### Run 9 — 2026-07-07T13:42:46.399Z · ✅ PASSED
- runId: `66922bdb-897e-469f-bbe3-a56dff72f71b` (source: cli)

### Run 10 — 2026-07-07T13:49:31.653Z · ✅ PASSED
- runId: `f19c7045-d698-4f75-bd45-94dbec2b016c` (source: cli)

### Run 11 — 2026-07-07T14:46:30.386Z · ✅ PASSED
- runId: `665f14d2-6034-4c51-8509-fbdf1267016b` (source: cli)

### Run 12 — 2026-07-09T07:17:43.014Z · ✅ PASSED
- runId: `ebab9dd7-e703-4125-b079-dbbff1712b61` (source: cli)

### Run 13 — 2026-07-09T07:28:03.303Z · ✅ PASSED
- runId: `19e4ac3c-7fda-488d-be35-70c3a09f9b8b` (source: cli)

### Run 14 — 2026-07-09T11:14:07.133Z · ✅ PASSED
- runId: `5cc8b22c-a19f-4b0b-8353-2719d42b6655` (source: cli)

### Run 15 — 2026-07-09T11:28:06.218Z · ✅ PASSED
- runId: `58722319-c73f-42eb-90aa-0b975a85aaa9` (source: cli)

### Run 16 — 2026-07-09T11:53:42.442Z · ✅ PASSED
- runId: `eefb40b9-f07b-4e91-8b6f-3711aef491a6` (source: cli)

### Run 17 — 2026-07-09T18:15:14.485Z · ✅ PASSED
- runId: `d371b3c4-7ab4-4972-a149-fbfd0063a6e3` (source: cli)

### Run 18 — 2026-07-09T18:49:50.521Z · ✅ PASSED
- runId: `0d089257-c836-4661-ba3a-87a0e7e753b7` (source: cli)

### Run 19 — 2026-07-10T03:51:08.474Z · ✅ PASSED
- runId: `625d9ece-5f10-436b-9f49-14635978d391` (source: cli)

### Run 20 — 2026-07-10T03:58:13.485Z · ✅ PASSED
- runId: `f0e1df8d-9b9c-4026-86fd-000697da07bd` (source: cli)

## Test — Guarded: Chat auth + message limits (#6,#12)
- **testId:** `a24f74ed-149b-4c39-81cb-9ab3cc44833a` · priority p1 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/a24f74ed-149b-4c39-81cb-9ab3cc44833a

### Run 1 — 2026-07-06T13:44:15.518Z · ✅ PASSED
- runId: `27a616e9-cce2-44b6-97a4-5e4fb869a0fd` (source: cli)

### Run 2 — 2026-07-07T07:24:19.779Z · ✅ PASSED
- runId: `dbf90fb9-67f8-4f8a-b372-3d5dc5d534f6` (source: cli)

### Run 3 — 2026-07-07T07:45:56.793Z · ❌ FAILED
- runId: `69730bf0-d7fb-4e61-8811-ff8c01abc62f` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  expected 400, got 403: {"error":"Invalid request origin"}
  ```

### Run 4 — 2026-07-07T07:55:53.070Z · ✅ PASSED
- runId: `a013a062-a2ec-4747-9033-71109499dc0a` (source: cli)

### Run 5 — 2026-07-07T08:54:46.496Z · ✅ PASSED
- runId: `8b80a1ab-512d-4f95-a8d7-16175e887de5` (source: cli)

### Run 6 — 2026-07-07T13:42:16.096Z · ✅ PASSED
- runId: `754b9d88-087b-4c9c-bd2f-846cfdd09833` (source: cli)

### Run 7 — 2026-07-07T13:49:01.108Z · ✅ PASSED
- runId: `0fd0db4e-2af9-4bb4-a935-df8ff010720c` (source: cli)

### Run 8 — 2026-07-07T14:46:25.699Z · ✅ PASSED
- runId: `0fb0e244-4ecd-4e1f-b4c5-0583658b9066` (source: cli)

### Run 9 — 2026-07-09T06:24:55.435Z · ✅ PASSED
- runId: `fca9702f-9e8b-4dd5-a8fc-2d5321491b35` (source: cli)

### Run 10 — 2026-07-09T07:17:38.629Z · ✅ PASSED
- runId: `48521d95-01de-43e9-8032-8225d23d7eb6` (source: cli)

### Run 11 — 2026-07-09T07:27:58.905Z · ✅ PASSED
- runId: `632ed114-8825-4272-82db-ad73149c3bef` (source: cli)

### Run 12 — 2026-07-09T11:13:59.596Z · ✅ PASSED
- runId: `e552fa06-645c-4283-b9a6-442fed8c9617` (source: cli)

### Run 13 — 2026-07-09T11:27:46.727Z · ✅ PASSED
- runId: `ffe4a1a6-af7a-4fb4-af12-499dc156d528` (source: cli)

### Run 14 — 2026-07-09T11:30:11.356Z · ✅ PASSED
- runId: `e401b0a7-9de8-4796-a608-85a5745b3e7a` (source: cli)

### Run 15 — 2026-07-09T11:53:35.955Z · ✅ PASSED
- runId: `8eb2adf4-c9fe-4012-9c69-cdd12ea6f547` (source: cli)

### Run 16 — 2026-07-09T18:15:08.707Z · ✅ PASSED
- runId: `77b10cbe-9646-4b2e-9c9f-adcd9a201483` (source: cli)

### Run 17 — 2026-07-09T18:20:44.445Z · ✅ PASSED
- runId: `bffbbac9-5e33-4d74-aad5-0b7d467fc8d7` (source: cli)

### Run 18 — 2026-07-09T18:49:41.013Z · ✅ PASSED
- runId: `37996479-800a-4148-bb4d-87b6f60cb8a9` (source: cli)

### Run 19 — 2026-07-10T03:50:57.822Z · ✅ PASSED
- runId: `49eba948-4fa1-4c0d-a33e-04fc668fc50f` (source: cli)

### Run 20 — 2026-07-10T03:58:17.200Z · ✅ PASSED
- runId: `64457659-b6df-45dd-97a1-601831688e6d` (source: cli)

## Test — Guarded: CSV quoted/partial/row-limit (#19,#20)
- **testId:** `4dd8880e-945b-4aea-84d5-39936eeaa473` · priority p1 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/4dd8880e-945b-4aea-84d5-39936eeaa473

### Run 1 — 2026-07-05T16:49:42.274Z · ✅ PASSED
- runId: `8d9b44ba-592d-4911-9855-314d607d05d5` (source: cli)

### Run 2 — 2026-07-05T16:55:17.545Z · ✅ PASSED
- runId: `8bdebd43-e559-4679-b979-80829f460e03` (source: cli)

### Run 3 — 2026-07-06T07:02:53.157Z · ✅ PASSED
- runId: `900d3661-c577-460e-b841-9da8d42ba306` (source: cli)

### Run 4 — 2026-07-06T13:44:15.552Z · ✅ PASSED
- runId: `abb1a43d-60bc-4961-b9fe-2cfa9ecee32e` (source: cli)

### Run 5 — 2026-07-07T07:24:19.788Z · ✅ PASSED
- runId: `adf9dc22-b9cc-4742-966a-4f0d048f6a3a` (source: cli)

### Run 6 — 2026-07-07T07:45:56.977Z · ✅ PASSED
- runId: `eb7bf20d-0d32-4d3b-a8bd-6fac3525f477` (source: cli)

### Run 7 — 2026-07-07T07:55:53.056Z · ✅ PASSED
- runId: `5bff006c-090d-41c4-8096-fac5a394b65c` (source: cli)

### Run 8 — 2026-07-07T08:54:46.989Z · ✅ PASSED
- runId: `d8231101-9f99-4587-b091-8e5e4cbebf5a` (source: cli)

### Run 9 — 2026-07-07T13:42:15.614Z · ✅ PASSED
- runId: `55e4ef0c-3793-4abb-8eb4-f891ad7e5bc2` (source: cli)

### Run 10 — 2026-07-07T13:49:00.972Z · ✅ PASSED
- runId: `50fd8f59-8ba8-4cc2-864a-dce853ad7133` (source: cli)

### Run 11 — 2026-07-07T14:46:26.212Z · ✅ PASSED
- runId: `96137469-0e91-4890-a4c8-aa57ca77f54c` (source: cli)

### Run 12 — 2026-07-09T07:17:38.870Z · ✅ PASSED
- runId: `e8f6dc98-8e44-4fa9-a748-65a073f9b8b4` (source: cli)

### Run 13 — 2026-07-09T07:27:59.523Z · ✅ PASSED
- runId: `5a60a107-2c0f-405c-bf68-e757bdd9f091` (source: cli)

### Run 14 — 2026-07-09T11:13:59.746Z · ✅ PASSED
- runId: `58f760b6-d39a-4f88-8ed3-6d4720b00591` (source: cli)

### Run 15 — 2026-07-09T11:27:47.640Z · ✅ PASSED
- runId: `fdadf8ad-6176-4d29-bc74-58451706ba12` (source: cli)

### Run 16 — 2026-07-09T11:53:36.101Z · ✅ PASSED
- runId: `ceda4bbd-0b04-420f-aa7e-0f42c84a98e8` (source: cli)

### Run 17 — 2026-07-09T18:15:08.809Z · ✅ PASSED
- runId: `c1640cdf-9a82-4d1f-8fdf-a025183cf528` (source: cli)

### Run 18 — 2026-07-09T18:49:41.510Z · ✅ PASSED
- runId: `9555f7c0-23c6-472a-a6ad-5edea35d0e1a` (source: cli)

### Run 19 — 2026-07-10T03:50:58.291Z · ✅ PASSED
- runId: `b264f21c-9b19-434b-988d-1771a7bb9259` (source: cli)

### Run 20 — 2026-07-10T03:58:22.092Z · ✅ PASSED
- runId: `a99d8671-bbbb-42c9-b4a6-536eee3daf31` (source: cli)

## Test — Guarded: CRUD delete lifecycle (#16)
- **testId:** `2d7b3f6d-f883-4be6-b0e5-440df863fce5` · priority p1 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/2d7b3f6d-f883-4be6-b0e5-440df863fce5

### Run 1 — 2026-07-05T16:49:46.983Z · ✅ PASSED
- runId: `d30f09dd-2668-4b4b-92b9-b6600d8252d5` (source: cli)

### Run 2 — 2026-07-05T16:55:17.714Z · ✅ PASSED
- runId: `939c0ed2-f08a-4b5e-bfd8-ae9406f33c99` (source: cli)

### Run 3 — 2026-07-06T07:02:53.470Z · ✅ PASSED
- runId: `ae1e3da3-3d9d-4494-b2eb-532a67846aab` (source: cli)

### Run 4 — 2026-07-06T13:44:15.752Z · ✅ PASSED
- runId: `1716b5f6-5904-4f1c-9a40-448771b7d59c` (source: cli)

### Run 5 — 2026-07-07T07:24:20.848Z · ✅ PASSED
- runId: `d05c5427-c9f3-4b13-a563-9094274a08a2` (source: cli)

### Run 6 — 2026-07-07T07:45:57.349Z · ✅ PASSED
- runId: `eb7e94b6-3043-4696-90ee-33af95043ae8` (source: cli)

### Run 7 — 2026-07-07T07:55:53.665Z · ❌ FAILED
- runId: `157267ae-2ebc-45cd-83ff-b7b8319baed7` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  expected 403 without CSRF, got 200: {"success":true,"deletedId":195}
  ```

### Run 8 — 2026-07-07T08:54:46.030Z · ✅ PASSED
- runId: `5f65ff4c-0658-4f5d-abe3-659cbc06be6a` (source: cli)

### Run 9 — 2026-07-07T13:42:16.467Z · ✅ PASSED
- runId: `755a9901-f7ee-4f59-bfff-0f09669f0fa3` (source: cli)

### Run 10 — 2026-07-07T13:49:01.084Z · ✅ PASSED
- runId: `c12c9795-21a1-408d-9f87-5ab819e303fc` (source: cli)

### Run 11 — 2026-07-07T14:46:26.239Z · ✅ PASSED
- runId: `d286b5d4-5c9a-4ef1-9e24-0aa3d138a19a` (source: cli)

### Run 12 — 2026-07-09T07:17:39.090Z · ✅ PASSED
- runId: `01ae4bd0-b464-416b-8907-bd970d7ca49e` (source: cli)

### Run 13 — 2026-07-09T07:27:59.222Z · ✅ PASSED
- runId: `aace1020-11fe-45c9-a5d5-ca1ca146a3fc` (source: cli)

### Run 14 — 2026-07-09T11:14:00.196Z · ✅ PASSED
- runId: `7015a146-d022-44b9-8e3d-88fd995aa9c9` (source: cli)

### Run 15 — 2026-07-09T11:27:47.791Z · ✅ PASSED
- runId: `e0c8ea69-6c73-4fd3-8798-d25ac8a0c908` (source: cli)

### Run 16 — 2026-07-09T11:53:36.502Z · ✅ PASSED
- runId: `7a6aa720-6613-442d-94a0-1a626b41d0ac` (source: cli)

### Run 17 — 2026-07-09T18:15:08.975Z · ✅ PASSED
- runId: `4ab03283-5e34-4a5c-b1f9-1cef3bdabb02` (source: cli)

### Run 18 — 2026-07-09T18:49:41.992Z · ✅ PASSED
- runId: `83087ca7-efb0-45dc-a515-7a7ce7f9d5cb` (source: cli)

### Run 19 — 2026-07-10T03:50:58.114Z · ✅ PASSED
- runId: `574109d2-a1b3-4a0b-b9af-5dfdcfc74d03` (source: cli)

### Run 20 — 2026-07-10T03:58:26.751Z · ✅ PASSED
- runId: `1e6a7263-087b-4360-bb5f-3ddb3aaff263` (source: cli)

## Test — Guarded: Pagination + MRR/LTV schema (#15,#18)
- **testId:** `36f0c5ef-3ecf-467a-b287-2b5bff1faefa` · priority p1 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/36f0c5ef-3ecf-467a-b287-2b5bff1faefa

### Run 1 — 2026-07-05T16:49:51.878Z · ✅ PASSED
- runId: `24af629f-5340-412a-972f-568a71815476` (source: cli)

### Run 2 — 2026-07-05T16:55:17.842Z · ✅ PASSED
- runId: `31e46c01-3708-4b19-9ed9-18ed6162c768` (source: cli)

### Run 3 — 2026-07-06T07:02:53.342Z · ✅ PASSED
- runId: `75919587-a1f2-4484-80a4-16ff167d749f` (source: cli)

### Run 4 — 2026-07-06T13:44:15.067Z · ✅ PASSED
- runId: `3237cb66-eba4-44b7-b62e-1ab11fc189ac` (source: cli)

### Run 5 — 2026-07-07T07:24:21.049Z · ✅ PASSED
- runId: `d8b712ae-0f19-41f2-9469-d26ad72ad4d3` (source: cli)

### Run 6 — 2026-07-07T07:45:57.470Z · ✅ PASSED
- runId: `474e7a91-3cec-4b85-998d-18db2669f684` (source: cli)

### Run 7 — 2026-07-07T07:55:53.815Z · ✅ PASSED
- runId: `69bd20be-830f-4169-8478-f557d2d6df48` (source: cli)

### Run 8 — 2026-07-07T08:54:47.255Z · ✅ PASSED
- runId: `fb777dd2-5b13-4993-a2db-ce3e93109899` (source: cli)

### Run 9 — 2026-07-07T13:42:16.410Z · ✅ PASSED
- runId: `34f34352-02db-4448-bda0-a3c7f9101b8f` (source: cli)

### Run 10 — 2026-07-07T13:49:01.538Z · ✅ PASSED
- runId: `2e9f38c2-bb5b-412e-a30c-57dacdef933a` (source: cli)

### Run 11 — 2026-07-07T14:46:26.383Z · ✅ PASSED
- runId: `8f75150a-263a-45b9-ada5-2f3d02c67a35` (source: cli)

### Run 12 — 2026-07-09T07:17:38.985Z · ✅ PASSED
- runId: `71c1bd52-b381-4b6a-a349-b586de5287bb` (source: cli)

### Run 13 — 2026-07-09T07:27:59.848Z · ✅ PASSED
- runId: `ff4dac43-6444-4c63-83ac-9dd415e6df8a` (source: cli)

### Run 14 — 2026-07-09T11:14:00.130Z · ✅ PASSED
- runId: `d06cf388-ec2e-4215-961e-08e6942f17b9` (source: cli)

### Run 15 — 2026-07-09T11:27:47.898Z · ✅ PASSED
- runId: `96843db7-48e6-4a2f-9821-27c15f221d86` (source: cli)

### Run 16 — 2026-07-09T11:53:36.242Z · ✅ PASSED
- runId: `4ce68146-d34d-44d0-a47a-8bc94f5639d7` (source: cli)

### Run 17 — 2026-07-09T18:15:09.086Z · ✅ PASSED
- runId: `f77a0f16-7c2c-4d29-93ff-69065b834994` (source: cli)

### Run 18 — 2026-07-09T18:49:41.793Z · ✅ PASSED
- runId: `d355d987-8a0d-4bf7-9f06-a54e6145c50b` (source: cli)

### Run 19 — 2026-07-10T03:50:58.762Z · ✅ PASSED
- runId: `c16de9eb-dcee-4d57-8675-1647edacf7a1` (source: cli)

### Run 20 — 2026-07-10T03:58:31.968Z · ✅ PASSED
- runId: `8ab8c533-b8f3-4dcf-ac4a-19d86695f1ba` (source: cli)

## Test — Guarded: CSV batch upload + CSRF
- **testId:** `da8bf044-7278-4513-87af-67811972a7c2` · priority p0 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/da8bf044-7278-4513-87af-67811972a7c2

### Run 1 — 2026-07-05T16:49:56.962Z · ✅ PASSED
- runId: `a3059dda-a7cb-4f4b-bcb5-54911adac739` (source: cli)

### Run 2 — 2026-07-05T16:55:18.496Z · ✅ PASSED
- runId: `5d63e97e-7e5a-4528-b7d8-665d146836a5` (source: cli)

### Run 3 — 2026-07-06T07:02:53.395Z · ✅ PASSED
- runId: `f7bddf20-3840-4433-9bc5-3ca83cbf927b` (source: cli)

### Run 4 — 2026-07-06T13:44:15.883Z · ✅ PASSED
- runId: `dc2d8646-24ae-465a-92b7-750cecbc2ccb` (source: cli)

### Run 5 — 2026-07-07T07:24:20.037Z · ✅ PASSED
- runId: `53bbe0f8-59fe-4905-9765-a69ac6dc0f80` (source: cli)

### Run 6 — 2026-07-07T07:45:57.184Z · ✅ PASSED
- runId: `93d2444a-eed0-4cfa-8fa2-1e637c781105` (source: cli)

### Run 7 — 2026-07-07T07:55:52.641Z · ✅ PASSED
- runId: `24790aa1-c6ca-4ed6-9c5b-08c2b27c2fd0` (source: cli)

### Run 8 — 2026-07-07T08:54:47.369Z · ✅ PASSED
- runId: `6b922ce8-f558-44c1-b5f4-28e3290b3d1e` (source: cli)

### Run 9 — 2026-07-07T13:42:16.720Z · ✅ PASSED
- runId: `392162fe-4a96-4253-a84b-66b7cd448267` (source: cli)

### Run 10 — 2026-07-07T13:49:01.457Z · ✅ PASSED
- runId: `cebc67cf-192d-49e0-ade2-9d522caf4d25` (source: cli)

### Run 11 — 2026-07-07T14:46:26.345Z · ✅ PASSED
- runId: `c6fea064-7b55-45fb-ac7d-77743a4b193b` (source: cli)

### Run 12 — 2026-07-09T07:17:39.109Z · ✅ PASSED
- runId: `10c5f53b-a64f-4b71-a647-255a2f6e3eb3` (source: cli)

### Run 13 — 2026-07-09T07:27:59.432Z · ✅ PASSED
- runId: `23ee27b3-1bb9-4d78-9f64-6643d5145a67` (source: cli)

### Run 14 — 2026-07-09T11:14:00.008Z · ✅ PASSED
- runId: `58acdbed-060f-420c-a26e-5a6915ab56aa` (source: cli)

### Run 15 — 2026-07-09T11:27:47.862Z · ✅ PASSED
- runId: `d3c2ef2b-3065-4707-9490-5e188ff03f15` (source: cli)

### Run 16 — 2026-07-09T11:53:36.740Z · ✅ PASSED
- runId: `49e5154d-d38e-4555-ba57-32aef2b6c1ff` (source: cli)

### Run 17 — 2026-07-09T18:15:09.784Z · ✅ PASSED
- runId: `f613c214-c0b7-4ad0-9224-7278af5ed41a` (source: cli)

### Run 18 — 2026-07-09T18:49:42.242Z · ✅ PASSED
- runId: `badfb05c-3a2f-45ce-be89-7c2ac263fbd1` (source: cli)

### Run 19 — 2026-07-10T03:50:58.482Z · ✅ PASSED
- runId: `f70bb566-8c89-4cfb-9ed0-cd6eb825b8a3` (source: cli)

### Run 20 — 2026-07-10T03:58:37.119Z · ✅ PASSED
- runId: `269f988e-a29c-4692-99a5-c93c81a61d50` (source: cli)

## Test — Guarded: Stateful chain create->list->metrics->insight
- **testId:** `87320b3f-cf42-4442-bac0-8ec3bb4420a9` · priority p0 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/87320b3f-cf42-4442-bac0-8ec3bb4420a9

### Run 1 — 2026-07-05T16:50:03.324Z · ✅ PASSED
- runId: `385e1f8e-36a1-4e7a-94ef-6a8de49744eb` (source: cli)

### Run 2 — 2026-07-05T16:55:18.576Z · ✅ PASSED
- runId: `49f29f2f-bc99-409f-82cd-62fcf3777b97` (source: cli)

### Run 3 — 2026-07-06T07:03:19.375Z · ✅ PASSED
- runId: `a4b51583-117b-4e08-a7bf-bab7022ac03f` (source: cli)

### Run 4 — 2026-07-06T13:44:53.071Z · ✅ PASSED
- runId: `93f2068c-498c-409b-a7c3-27b0d0301baf` (source: cli)

### Run 5 — 2026-07-07T07:24:45.150Z · ✅ PASSED
- runId: `6696bb18-f0fd-48be-ba69-6fdd3e533e4c` (source: cli)

### Run 6 — 2026-07-07T07:45:56.618Z · ❌ FAILED
- runId: `9ea5c485-3dae-4a4f-b49a-e4846ea4c6bf` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  {"error":"Invalid request origin"}
  ```

### Run 7 — 2026-07-07T07:56:08.386Z · ✅ PASSED
- runId: `332300df-e913-4a5f-ae26-e0cf344648bf` (source: cli)

### Run 8 — 2026-07-07T08:54:55.001Z · ✅ PASSED
- runId: `47acf577-643d-40a2-9a70-c1817ef400e6` (source: cli)

### Run 9 — 2026-07-07T13:42:31.524Z · ✅ PASSED
- runId: `3e7afade-0c4e-4b27-8375-5afffecac652` (source: cli)

### Run 10 — 2026-07-07T13:49:16.452Z · ✅ PASSED
- runId: `8c9d7107-4a44-48c0-8e92-debff780c56b` (source: cli)

### Run 11 — 2026-07-07T14:46:41.484Z · ✅ PASSED
- runId: `d920e23e-a9d2-4298-b3c1-a166a6893116` (source: cli)

### Run 12 — 2026-07-09T07:17:42.337Z · ✅ PASSED
- runId: `55c49855-6308-42dd-9115-f8fc250f50a6` (source: cli)

### Run 13 — 2026-07-09T07:28:00.876Z · ✅ PASSED
- runId: `2d871210-974b-4fb4-bc35-c14eb8d22119` (source: cli)

### Run 14 — 2026-07-09T11:14:01.566Z · ✅ PASSED
- runId: `52d5ff51-0dcc-4c7c-bf58-c81d1530d6f2` (source: cli)

### Run 15 — 2026-07-09T11:27:51.937Z · ✅ PASSED
- runId: `d60fcaf0-911e-479d-ac67-a0015b5abe54` (source: cli)

### Run 16 — 2026-07-09T11:53:36.495Z · ✅ PASSED
- runId: `25050dd9-8ee5-406d-8019-3c6b194ac898` (source: cli)

### Run 17 — 2026-07-09T18:15:13.936Z · ✅ PASSED
- runId: `16b5211d-42bf-4b54-ac13-d3246578861b` (source: cli)

### Run 18 — 2026-07-09T18:49:47.129Z · ✅ PASSED
- runId: `644f4de2-94af-46f1-9b6a-e55694dc64f6` (source: cli)

### Run 19 — 2026-07-10T03:51:13.301Z · ✅ PASSED
- runId: `ef394acc-5b26-4a6f-910c-e57651d5011b` (source: cli)

### Run 20 — 2026-07-10T03:58:50.181Z · ✅ PASSED
- runId: `30807ef1-016e-440c-b53a-67a0a7f9d7d1` (source: cli)

## Test — Guarded: Projects persist + CSRF
- **testId:** `33cf2c68-e994-43fe-bf0e-c5de93112c1c` · priority p1 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/33cf2c68-e994-43fe-bf0e-c5de93112c1c

### Run 1 — 2026-07-05T16:50:08.432Z · ✅ PASSED
- runId: `45064f83-9696-4d8e-b0f4-d46056c90f87` (source: cli)

### Run 2 — 2026-07-05T16:55:17.748Z · ✅ PASSED
- runId: `b6524873-1623-4a81-b7f2-542f04604f35` (source: cli)

### Run 3 — 2026-07-06T07:02:53.126Z · ✅ PASSED
- runId: `7b12c830-0667-48a5-a5ad-2538840ae7fc` (source: cli)

### Run 4 — 2026-07-06T13:44:15.715Z · ✅ PASSED
- runId: `aedc770b-c8fc-4101-817f-ec8b504e4bc6` (source: cli)

### Run 5 — 2026-07-07T07:24:20.777Z · ✅ PASSED
- runId: `23e4a4d3-612e-4b00-87ad-b5cade8ee7cf` (source: cli)

### Run 6 — 2026-07-07T07:45:57.142Z · ✅ PASSED
- runId: `bd23c0d7-e7f9-410b-84b8-c61ac6e55558` (source: cli)

### Run 7 — 2026-07-07T07:55:52.747Z · ✅ PASSED
- runId: `e318874c-f38e-4501-a6fb-c2b6ce64fb61` (source: cli)

### Run 8 — 2026-07-07T08:54:47.279Z · ✅ PASSED
- runId: `8ae4bb95-3b53-4b8c-9a02-03ac2e4a8a16` (source: cli)

### Run 9 — 2026-07-07T13:42:16.553Z · ✅ PASSED
- runId: `97b22271-6548-4d7c-ad8e-b64e07927824` (source: cli)

### Run 10 — 2026-07-07T13:49:01.203Z · ✅ PASSED
- runId: `fa02f55c-64b7-4a53-a621-9e50be56a04c` (source: cli)

### Run 11 — 2026-07-07T14:46:26.285Z · ✅ PASSED
- runId: `e61a832b-1a02-4e3a-82ab-4620aeecb80b` (source: cli)

### Run 12 — 2026-07-09T07:17:38.909Z · ✅ PASSED
- runId: `adf4cfea-ad2f-41c4-a79d-2d11e8e4f500` (source: cli)

### Run 13 — 2026-07-09T07:27:58.522Z · ✅ PASSED
- runId: `cd70e93e-2bb2-4799-a84e-edfc50b22e96` (source: cli)

### Run 14 — 2026-07-09T11:13:59.870Z · ✅ PASSED
- runId: `212c3cd3-0b2f-4610-ab23-8f12049ec1a8` (source: cli)

### Run 15 — 2026-07-09T11:27:47.449Z · ✅ PASSED
- runId: `93bb4b91-fa81-4b2d-b149-66c9c9d4f235` (source: cli)

### Run 16 — 2026-07-09T11:53:36.238Z · ✅ PASSED
- runId: `ecdec066-edf3-4b4b-bb7a-ca92c3682561` (source: cli)

### Run 17 — 2026-07-09T18:15:08.977Z · ✅ PASSED
- runId: `e0b9c02a-a113-44e6-bd54-4ebe717ef367` (source: cli)

### Run 18 — 2026-07-09T18:49:42.090Z · ✅ PASSED
- runId: `3b0b6941-ce9e-44f6-8605-3207ae970faa` (source: cli)

### Run 19 — 2026-07-10T03:50:58.140Z · ✅ PASSED
- runId: `68061559-e14e-4fed-a0d8-31c072d6b100` (source: cli)

### Run 20 — 2026-07-10T03:58:55.714Z · ✅ PASSED
- runId: `e52b9440-5b66-41c0-ad30-98cda1de8b8a` (source: cli)

## Test — Guarded: Edge cases + risk boundaries
- **testId:** `159574eb-5b29-4880-bfad-0449ec44206f` · priority p1 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/159574eb-5b29-4880-bfad-0449ec44206f

### Run 1 — 2026-07-05T16:50:13.086Z · ✅ PASSED
- runId: `c661b1e9-cb67-43a8-8bb7-e7048775e143` (source: cli)

### Run 2 — 2026-07-05T16:55:17.774Z · ✅ PASSED
- runId: `ca361021-3ae0-4ddc-b733-4affce930d49` (source: cli)

### Run 3 — 2026-07-06T07:02:53.096Z · ✅ PASSED
- runId: `85f29858-dee0-40b4-b8d4-c9bd4e4d112a` (source: cli)

### Run 4 — 2026-07-06T13:44:15.680Z · ✅ PASSED
- runId: `deca8a3c-589c-4c5f-adb8-7c603bfe8551` (source: cli)

### Run 5 — 2026-07-07T07:24:19.804Z · ✅ PASSED
- runId: `9a53e3e6-5d53-4269-bc7a-2f77582122b4` (source: cli)

### Run 6 — 2026-07-07T07:45:57.094Z · ✅ PASSED
- runId: `a4eac4c5-e38f-4ad3-8f6d-4f061849402e` (source: cli)

### Run 7 — 2026-07-07T07:55:53.264Z · ✅ PASSED
- runId: `4c4ea027-35eb-4f1c-8d85-aa6e7c2177bc` (source: cli)

### Run 8 — 2026-07-07T08:54:46.639Z · ✅ PASSED
- runId: `178a0f32-4501-45d4-900c-4a3ce15e111c` (source: cli)

### Run 9 — 2026-07-07T13:42:16.793Z · ✅ PASSED
- runId: `38e59811-bc23-4ad9-87ef-52bd37feea73` (source: cli)

### Run 10 — 2026-07-07T13:49:01.247Z · ✅ PASSED
- runId: `2f98b4e5-97e8-44c5-87db-fc4f43fd0704` (source: cli)

### Run 11 — 2026-07-07T14:46:26.259Z · ✅ PASSED
- runId: `6438046b-41ec-479e-9a8a-65bea8a3a441` (source: cli)

### Run 12 — 2026-07-09T07:17:39.080Z · ✅ PASSED
- runId: `f6334def-c57c-47ac-9c86-9ea4e47cd54a` (source: cli)

### Run 13 — 2026-07-09T07:27:58.925Z · ✅ PASSED
- runId: `e5493fd5-69f0-400a-b62f-38c07d3fe3bf` (source: cli)

### Run 14 — 2026-07-09T11:13:59.891Z · ✅ PASSED
- runId: `e54376d1-5881-46ae-acfa-0431cd332249` (source: cli)

### Run 15 — 2026-07-09T11:27:47.539Z · ✅ PASSED
- runId: `2f8f7afb-d20b-4a36-a3d0-67419a77d605` (source: cli)

### Run 16 — 2026-07-09T11:53:35.659Z · ✅ PASSED
- runId: `81957475-ee70-4f15-868f-5847540c93cb` (source: cli)

### Run 17 — 2026-07-09T18:15:08.943Z · ✅ PASSED
- runId: `0e4842f3-82d3-48cf-938c-f64f88f54841` (source: cli)

### Run 18 — 2026-07-09T18:49:41.543Z · ✅ PASSED
- runId: `29148fae-7531-419b-9662-ffaba25352b9` (source: cli)

### Run 19 — 2026-07-10T03:50:57.608Z · ✅ PASSED
- runId: `b419caed-5f01-44a8-a94f-a3dbc5a6ee7a` (source: cli)

### Run 20 — 2026-07-10T03:59:00.621Z · ✅ PASSED
- runId: `bc9ecd9d-a892-48ac-b38c-6d8c71ae3b66` (source: cli)

## Test — Guarded: Metrics API + body size (#8,#11)
- **testId:** `cd31cfd5-eb6a-4dd3-9f2c-e86cbcd3ab2e` · priority p0 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/cd31cfd5-eb6a-4dd3-9f2c-e86cbcd3ab2e

### Run 1 — 2026-07-05T16:50:18.181Z · ✅ PASSED
- runId: `a00f81ce-7a6e-4236-9685-85d4eb004a44` (source: cli)

### Run 2 — 2026-07-05T16:55:18.353Z · ✅ PASSED
- runId: `08bc1270-55ef-4abe-80eb-a50c29998552` (source: cli)

### Run 3 — 2026-07-06T07:02:53.287Z · ✅ PASSED
- runId: `c726044e-2a18-47fd-8f0e-6e69a29c0cae` (source: cli)

### Run 4 — 2026-07-06T13:44:15.768Z · ✅ PASSED
- runId: `7e072f63-811e-47df-812a-6fd274398874` (source: cli)

### Run 5 — 2026-07-07T07:24:20.463Z · ✅ PASSED
- runId: `b92190e0-cad9-4e0c-a494-4b4aba84a31c` (source: cli)

### Run 6 — 2026-07-07T07:45:56.860Z · ✅ PASSED
- runId: `a0c57499-eff9-4114-9075-afe5ce7b07d3` (source: cli)

### Run 7 — 2026-07-07T07:55:53.291Z · ✅ PASSED
- runId: `b3219aee-add1-439a-b5c4-e43fea588a6a` (source: cli)

### Run 8 — 2026-07-07T08:54:47.341Z · ✅ PASSED
- runId: `4c90386a-274b-4a42-a48d-3095cb99ece1` (source: cli)

### Run 9 — 2026-07-07T13:42:16.288Z · ✅ PASSED
- runId: `8d1f4a99-1984-451a-bdf2-1eebc3804e28` (source: cli)

### Run 10 — 2026-07-07T13:49:01.149Z · ✅ PASSED
- runId: `4e06982c-7829-4396-919d-c1ee9083c61a` (source: cli)

### Run 11 — 2026-07-07T14:46:26.339Z · ✅ PASSED
- runId: `96149234-91b8-4a4b-92a2-eafee8a6bee9` (source: cli)

### Run 12 — 2026-07-09T07:17:39.209Z · ✅ PASSED
- runId: `360dad13-b789-4a79-888c-ac25ec6d8bb7` (source: cli)

### Run 13 — 2026-07-09T07:27:58.955Z · ✅ PASSED
- runId: `262d4d5c-089c-40fa-b49c-1dfe07e5292f` (source: cli)

### Run 14 — 2026-07-09T11:13:59.999Z · ✅ PASSED
- runId: `bd6b9e3e-fe93-4c49-ab3b-19e52bfa6203` (source: cli)

### Run 15 — 2026-07-09T11:27:47.705Z · ✅ PASSED
- runId: `a1f6600c-92d0-45be-bb6b-8c9d44a46e40` (source: cli)

### Run 16 — 2026-07-09T11:53:36.115Z · ✅ PASSED
- runId: `9f0235ba-5e3d-4877-a61b-8193754210eb` (source: cli)

### Run 17 — 2026-07-09T18:15:09.029Z · ✅ PASSED
- runId: `7016a75b-bd98-44dc-a7f5-ca61865866c5` (source: cli)

### Run 18 — 2026-07-09T18:49:41.351Z · ✅ PASSED
- runId: `4fbc8de6-ffba-48d3-809e-3f3a1f3a33ba` (source: cli)

### Run 19 — 2026-07-10T03:50:58.293Z · ✅ PASSED
- runId: `90b17772-183a-4c96-9321-1c41634175c4` (source: cli)

### Run 20 — 2026-07-10T03:59:06.554Z · ✅ PASSED
- runId: `552e42b9-385d-4986-8bf6-d25bf491ad26` (source: cli)

## Test — Guarded: auth, cookie-signing & CSRF
- **testId:** `1f856ba7-1490-4ceb-945e-ab453827e714` · priority p0 · latest: ✅ PASSED
- **dashboard:** https://www.testsprite.com/dashboard/tests/3f03871e-9e3d-4452-9811-ea32aaff6fb8/test/1f856ba7-1490-4ceb-945e-ab453827e714

### Run 1 — 2026-07-05T16:50:23.104Z · ✅ PASSED
- runId: `1fd04b0b-6b08-4602-bc8e-7fef6b9b969f` (source: cli)

### Run 2 — 2026-07-05T16:55:17.327Z · ✅ PASSED
- runId: `00ef5df1-9c95-44d3-8505-8857133f3c90` (source: cli)

### Run 3 — 2026-07-06T07:02:53.397Z · ✅ PASSED
- runId: `3f775f06-ab6f-4fc6-8978-a3c23471875b` (source: cli)

### Run 4 — 2026-07-06T13:44:15.842Z · ✅ PASSED
- runId: `f6b2c49f-468a-49ae-b841-17cceb826fc6` (source: cli)

### Run 5 — 2026-07-07T07:24:20.861Z · ✅ PASSED
- runId: `f9491b32-523b-49e0-85ec-873f601f7b9d` (source: cli)

### Run 6 — 2026-07-07T07:45:57.231Z · ✅ PASSED
- runId: `d44e74a1-2d93-4a39-a743-a830a7f9ce9d` (source: cli)

### Run 7 — 2026-07-07T07:55:53.462Z · ❌ FAILED
- runId: `6367fb22-4ae0-44d7-a74e-3a3736c5b16f` (source: cli)
- failure bundle — rootCauseHypothesis:
  ```json
  projects without CSRF expected 403, got 201: {"success":true,"project":{"id":194,"createdAt":"2026-07-07T07:55:53.430Z","projectName":"Auth Check","totalUsers":1000,"activeUsers":850,"churnedUsers":150,"monthlyRevenue":5000,"metrics":{"churnRate":0.15,"retentionRate":0.85,"arpu":5,"riskStatus":"Medium","mrr":5000,"estimatedLtv":33.33}}}
  ```

### Run 8 — 2026-07-07T08:54:46.803Z · ✅ PASSED
- runId: `19c506a3-0fd7-4971-81b5-9fac07bb9a74` (source: cli)

### Run 9 — 2026-07-07T13:42:16.415Z · ✅ PASSED
- runId: `2bd55c8e-1d7b-4665-b94a-75962cf33d70` (source: cli)

### Run 10 — 2026-07-07T13:49:01.554Z · ✅ PASSED
- runId: `0f9d22b0-d49f-4172-961c-bbe0ca01df68` (source: cli)

### Run 11 — 2026-07-07T14:46:26.222Z · ✅ PASSED
- runId: `ade14283-b0e7-47f9-81a0-d2b04c121b57` (source: cli)

### Run 12 — 2026-07-09T07:17:38.996Z · ✅ PASSED
- runId: `acca7e3c-47e6-41ac-8af3-c55d24abd020` (source: cli)

### Run 13 — 2026-07-09T07:27:59.122Z · ✅ PASSED
- runId: `3f7c60f1-8624-440a-abcc-3de8a3fd4c85` (source: cli)

### Run 14 — 2026-07-09T11:13:59.837Z · ✅ PASSED
- runId: `44972a2f-4876-4df5-b294-f4fd2a18345e` (source: cli)

### Run 15 — 2026-07-09T11:27:47.179Z · ✅ PASSED
- runId: `2b00df2b-b49d-4c17-84ab-763b89af7359` (source: cli)

### Run 16 — 2026-07-09T11:53:35.835Z · ✅ PASSED
- runId: `65d633d2-b77e-4d3d-a6a1-5ff6ee794c91` (source: cli)

### Run 17 — 2026-07-09T18:15:09.239Z · ✅ PASSED
- runId: `1123f180-7c96-450e-be98-c2c95b1058cd` (source: cli)

### Run 18 — 2026-07-09T18:49:41.868Z · ✅ PASSED
- runId: `cc3e5080-2c72-426e-9ed7-09a829cc04f5` (source: cli)

### Run 19 — 2026-07-10T03:50:58.443Z · ✅ PASSED
- runId: `92a9182e-749a-4296-a200-b87280a77d59` (source: cli)

### Run 20 — 2026-07-10T03:59:22.637Z · ✅ PASSED
- runId: `f45df96d-a1a5-42cd-bf40-1c5381ed2b1d` (source: cli)

---

_Regenerated at 2026-07-10T03:59:44.166Z · HEAD 11674a5_
