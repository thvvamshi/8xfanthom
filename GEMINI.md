# 8x Fathom Clone — Agent Instructions

## Project

Build a polished clone of Fathom (AI meeting notetaker) for the 8x Hiring Software Engineer take-home assignment.

Workspace:

`C:\Users\bodav\Desktop\Projects\8xfanthom`

The goal is NOT to reproduce Fathom's backend infrastructure. The goal is to demonstrate strong product judgment, UX/UI quality, speed, and a convincing end-to-end meeting intelligence experience.

---

# Critical Rules

1. Do NOT rebuild unnecessary infrastructure.
2. Prioritize the user-facing product experience.
3. Do NOT implement a real Zoom/Meet/Teams recording bot unless there is substantial time remaining.
4. The assignment explicitly allows the recording/capture layer to be faked or stubbed. If stubbed, document it clearly in the walkthrough.
5. Do NOT add microservices, Kubernetes, queues, Redis, complex vector infrastructure, or other infrastructure unless clearly necessary.
6. Keep the architecture simple and maintainable.
7. Seed the application with realistic meeting data so the deployed product is immediately usable.
8. Never leave the deployed application empty.
9. Do not expose secrets or API keys.
10. Keep `.agent-logs/` untouched after automatic generation. Never manually edit, delete, or fabricate agent logs.
11. Do not modify Phase 0 capture artifacts unless there is a genuine technical reason.
12. Before making large architectural changes, prefer the simplest implementation that satisfies the product requirement.

---

# Product Goal

Create a Fathom-like AI meeting workspace where a user can:

- See recent meetings
- Search meetings
- Open a meeting
- Watch meeting playback
- Read an interactive transcript
- See AI-generated summary
- See topics
- See decisions
- See action items
- See participants
- Highlight important moments
- Change summary templates
- Share a meeting/clip
- Ask questions about meeting content if time permits

The application should feel like a real SaaS product rather than a demo dashboard.

---

# Recommended Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React icons

## Backend

- Node.js
- Express
- TypeScript

## Database

Prefer PostgreSQL if persistence is useful.

Keep the data model simple.

## AI

Use an LLM only where it materially improves the experience.

Do not make the whole application dependent on expensive or unreliable AI calls.

Fallback to seeded/mock AI data when appropriate.

---

# Architecture

Keep the architecture simple:

React Frontend
        |
        v
Express API
        |
        v
PostgreSQL
        |
        v
AI service when needed

The recording layer can be mocked/stubbed.

Do not build a real meeting recorder unless the core product is already complete.

---

# Suggested Repository Structure

```text
8xfanthom/
├── .agent-logs/
├── .agents/
│   ├── hooks.json
│   └── scripts/
│       └── capture.js
├── frontend/
├── backend/
├── docs/
├── tests/
├── .env.example
├── CAPTURE-TEST.md
├── GEMINI.md
├── README.md
└── docker-compose.yml
```

Keep the structure simple. Do not create unnecessary folders.

---

# Core Data Model

A meeting should contain enough data to make the workspace realistic.

Suggested meeting fields:

```text
id
title
date
duration
participants
recordingUrl
thumbnail
summary
topics
decisions
actionItems
transcript
highlights
template
createdAt
```

Transcript entries should contain:

```text
id
speaker
text
timestamp
```

Action items should contain:

```text
id
task
assignee
dueDate
completed
```

Highlights should contain:

```text
id
timestamp
title
note
```

---

# Seed Data

Seed at least 8 realistic meetings.

Recommended examples:

1. Customer Discovery — Acme Corp
2. Product Strategy Sync
3. Engineering Standup
4. Sales Discovery Call
5. Hiring Interview
6. Sprint Planning
7. Customer Success Review
8. Leadership Weekly Meeting

Each meeting should have:

- realistic title
- participants
- duration
- transcript
- timestamps
- summary
- topics
- decisions
- action items
- highlights

The application should look populated immediately after deployment.

---

# P0 — Must Have

These features are the highest priority.

## 1. Dashboard

Show:

- recent meetings
- meeting count
- quick search
- important action items
- recent activity

## 2. Meetings / History

Show:

- meeting list
- date
- duration
- participants
- search/filter
- meeting type if useful

## 3. Meeting Workspace

This is the most important screen.

Include:

- meeting title
- date/time
- participants
- duration
- playback area
- transcript
- AI summary
- topics
- decisions
- action items
- highlights

## 4. Playback + Transcript

The transcript should feel interactive.

Clicking a transcript timestamp should update the playback position.

If actual video/audio is unavailable, use a convincing stubbed player with timeline controls.

## 5. AI Summary

Show:

- summary
- key points
- decisions
- action items
- topics

## 6. Templates

Allow the user to switch between summary styles such as:

- Standard
- Executive
- Sales
- Customer Success
- Project Update

Changing the template should visibly update the summary content.

## 7. Action Items

Users should be able to:

- see action items
- see assignee
- mark completed
- inspect due date

## 8. Highlights

Allow important transcript moments to be highlighted.

## 9. Search

Search across meetings.

Search should return:

- matching meeting
- matching transcript context
- timestamp when available

## 10. Share

Provide a realistic share flow for a meeting or clip.

A real public sharing backend is optional if time is limited.

---

# P1 — Only After P0 Is Stable

Implement these only if the core product is polished:

- Ask AI / Ask Fathom
- transcript citations
- semantic search
- advanced filters
- richer sharing
- meeting analytics

If time becomes tight, cut P1 features first.

---

# Explicitly Deprioritize

Do NOT spend significant time on:

- real Zoom bot
- real Google Meet bot
- Microsoft Teams integration
- speech-to-text pipeline
- calendar OAuth
- Slack integration
- CRM integration
- Kubernetes
- microservices
- complex background job infrastructure
- desktop recorder
- cloud video processing
- complex pgvector/RAG infrastructure

The assignment explicitly permits a stubbed recording layer.

---

# UX/UI Direction

The product should feel:

- modern
- clean
- professional
- calm
- SaaS-quality
- information-dense without feeling cluttered

Prioritize:

- strong typography
- clear hierarchy
- consistent spacing
- subtle borders
- useful empty/loading/error states
- responsive layout
- keyboard-friendly interactions
- obvious primary actions

Avoid:

- generic dashboard templates
- excessive gradients
- unnecessary animations
- giant cards
- fake metrics that do not help the user
- excessive colors
- clutter

Use Lucide icons instead of manually drawn SVG icons when possible.

---

# Meeting Workspace Layout

Recommended structure:

```text
┌─────────────────────────────────────────────────────────────┐
│ Meeting title                          Share / More         │
│ Date • Duration • Participants                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                 Playback / Timeline                         │
│                                                             │
├──────────────────────────────┬──────────────────────────────┤
│ Transcript                   │ AI Summary                   │
│                              │                              │
│ 10:02 Speaker                │ Summary                      │
│ 10:14 Speaker                │ Key points                   │
│ 10:31 Speaker                │ Decisions                    │
│                              │ Action items                 │
│                              │ Topics                       │
└──────────────────────────────┴──────────────────────────────┘
```

Adapt this layout if a better UX emerges.

---

# Product Judgment

The most important screen is the meeting workspace.

A reviewer should immediately understand:

1. What happened in the meeting?
2. Who attended?
3. What was discussed?
4. What decisions were made?
5. What needs to happen next?
6. Where in the recording/transcript did something important happen?

Optimize the product around those questions.

---

# Development Order

Follow this order:

## Phase 1 — Product Recon

Inspect the real Fathom product and understand:

- navigation
- dashboard
- meeting workspace
- transcript
- summary
- templates
- actions
- highlights
- search
- sharing

Do not copy implementation details. Learn the product patterns.

## Phase 2 — Foundation

Create:

- frontend
- backend
- routing
- database/data layer
- base layout
- seed data

## Phase 3 — Dashboard

Implement the main dashboard and meeting list.

## Phase 4 — Meeting Workspace

Implement the core meeting page.

## Phase 5 — Playback + Transcript

Implement the player and interactive transcript.

## Phase 6 — AI Summary

Implement summary, topics, decisions, and action items.

## Phase 7 — Highlights + Actions

Implement highlighting and action-item interactions.

## Phase 8 — Search

Implement global meeting/transcript search.

## Phase 9 — Share

Implement meeting/clip sharing flow.

## Phase 10 — Polish

Fix:

- responsive layout
- spacing
- typography
- loading states
- errors
- empty states
- navigation
- visual consistency

## Phase 11 — Deploy

Deploy frontend and backend.

Verify the public HTTPS URL works without local setup.

## Phase 12 — README

Document:

- product
- architecture
- setup
- deployment
- seeded data
- recording-layer decision
- tradeoffs
- known limitations

## Phase 13 — Walkthrough

Create a <=5 minute walkthrough.

Camera must be on.

Show:

1. Dashboard
2. Search
3. Meeting workspace
4. Playback/transcript
5. AI summary
6. Action items
7. Highlight
8. Template switching
9. Share flow

Clearly mention that the recording capture layer is stubbed if that is the implementation.

---

# Time Management

The assignment has a 24-hour window.

Use this priority:

```text
P0 product experience
        ↓
visual polish
        ↓
deployment
        ↓
README
        ↓
walkthrough
        ↓
P1 features
        ↓
infrastructure improvements
```

If behind schedule:

1. Cut Ask AI.
2. Cut semantic search.
3. Cut real recording.
4. Cut advanced integrations.
5. Never cut the core meeting workspace.
6. Never cut deployment.
7. Never cut final polish.
8. Never cut the walkthrough.

---

# Git Commit Strategy

Prefer small meaningful commits.

Examples:

```text
feat: initialize fathom clone
feat: add dashboard and meeting history
feat: build meeting workspace
feat: add transcript playback
feat: add ai meeting summary
feat: add action items and highlights
feat: add meeting search
feat: add sharing flow
style: polish meeting workspace
chore: deploy application
docs: update project README
```

Do not commit secrets.

---

# Definition of Done

Before submission verify:

- [ ] Public HTTPS URL works
- [ ] Application loads without local setup
- [ ] Dashboard is populated
- [ ] Meetings are populated
- [ ] Meeting workspace works
- [ ] Transcript works
- [ ] Playback/timeline works
- [ ] Summary works
- [ ] Templates work
- [ ] Action items work
- [ ] Highlights work
- [ ] Search works
- [ ] Share flow works
- [ ] Responsive UI works
- [ ] No obvious console errors
- [ ] README is complete
- [ ] Repository is public
- [ ] `.agent-logs/` is present
- [ ] `CAPTURE-TEST.md` is present
- [ ] Walkthrough is <=5 minutes
- [ ] Camera is on during walkthrough
- [ ] Recording/capture-layer limitation is clearly disclosed

---

# Current Status

Phase 0 — Agent Capture:

COMPLETE.

Verified automatic capture through the Antigravity Agent Harness Stop lifecycle hook.

Verified:

- Canary 1
- Canary 2
- Prompt capture
- Final response capture
- UTC timestamp
- Actual model
- Separate session logs
- No tool calls/diffs/internal reasoning in captured logs

Do NOT redo Phase 0 unless a real issue appears.

Next task:

Phase 1 — Product Recon and Fathom clone foundation.

Do not start Phase 1 unless the user explicitly asks to proceed.
