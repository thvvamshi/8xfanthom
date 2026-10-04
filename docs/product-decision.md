# Product Decision: Meeting Intent/Outcome Tracking

## The Problem

Most meeting assistants are good at answering:

> What happened in this meeting?

They summarize conversations, extract action items, and make transcripts searchable.

But that does not answer another important question:

> Did the meeting actually achieve what I needed?

In a long or multi-person meeting, an important priority can be discussed briefly, left unresolved, or never mentioned at all. A summary can describe the conversation without making that distinction clear.

## The Decision

8xfanthom introduces **Meeting Intent**.

Before a meeting, users define the outcomes that matter.

During the meeting, those priorities can be tracked against the conversation.

After the meeting, the product shows what was actually achieved.

```text
Before
Define what matters
        ↓
During
Track what gets covered
        ↓
After
Verify what was achieved
        ↓
Follow-up
Recover what was missed
```

## What Is an Intent?

An intent is an outcome the user wants from the meeting.

For example:

```text
Confirm the renewal timeline
Understand the customer's pricing concerns
Identify the final decision maker
```

This is different from a topic or agenda item.

```text
Topic:
Pricing

Agenda:
Discuss pricing

Intent:
Understand whether the customer accepts the proposed pricing.
```

The intent is outcome-oriented rather than simply describing what will be discussed.

## Outcome States

Each intent can end in one of three states:

### Covered

The meeting sufficiently addressed the priority.

### Partial

The priority was discussed, but the conversation did not fully resolve it.

### Missed

The priority was not addressed.

Where evidence is available, the outcome connects back to:

- Timestamp
- Speaker
- Transcript evidence

Users can open the evidence and jump directly to the relevant point in the meeting.

## Before the Meeting

Users define a small set of priorities before starting.

```text
MEETING INTENT

What do you need to accomplish?

[ Confirm the renewal timeline ]
[ Understand pricing concerns ]
[ Identify the decision maker ]

+ Add another priority
```

The goal is to establish what success means before the conversation begins.

## During the Meeting

The product provides lightweight progress visibility:

```text
MEETING INTENT

✓ Pricing concerns
⚠ Competitor comparison
○ Renewal timeline

2 of 3 covered
```

If an important priority has not been discussed, the user can choose to bring it up.

The system may provide a deterministic suggested question, but it does not automatically speak, interrupt the meeting, schedule anything, or take external actions.

The user remains in control.

## After the Meeting

The completed meeting shows the final outcome:

```text
MEETING OUTCOME

3 priorities
2 addressed · 1 missed

✓ Pricing concerns
  Discussed and clarified
  18:42 · Sarah Chen

⚠ Competitor comparison
  Mentioned briefly
  31:08 · Marcus Lee

✕ Renewal timeline
  Not discussed
```

Missed priorities can provide a lightweight follow-up path.

## Important Product Principle

Playback position and final meeting outcome are intentionally separate.

```text
Current playback position
          ≠
Historical meeting outcome
```

For example, after completing a meeting at 56:58, a user can seek back to 10:00 without changing the final outcome.

This prevents normal navigation from mutating historical meeting results.

## Why This Was Prioritized

The assignment could be expanded with many infrastructure-heavy features such as real meeting bots, transcription pipelines, calendar integrations, external actions, or real-time AI.

Instead, the project prioritizes a smaller product idea that improves the core meeting workflow.

The goal was to build:

- A clear user problem
- A differentiated product decision
- A complete end-to-end experience
- Evidence-based outcomes
- A simple implementation
- A polished UX

rather than spreading the available time across many partially implemented integrations.

## Scope Tradeoffs

The following were intentionally not built:

- Real Zoom / Google Meet / Teams recording
- Real-time speech-to-text
- Calendar OAuth
- Slack or CRM integrations
- Automatic external actions
- WebSocket infrastructure
- Real-time LLM streaming

The core experience uses deterministic seeded meeting data so the product can demonstrate the complete workflow reliably.

## Product Principle

The central idea is simple:

> **A meeting assistant should not only tell you what happened. It should help you understand whether the meeting accomplished what mattered.**