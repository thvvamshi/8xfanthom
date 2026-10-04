# 8xfanthom

A polished, full-stack meeting intelligence workspace built for the 8x Software Engineer take-home assignment.

8xfanthom focuses on a fast, focused meeting workflow — from playback and transcript exploration to AI summaries, action items, highlights, search, sharing, and outcome tracking.

## Highlights

- **Meeting workspace** with synchronized playback and transcript
- **AI meeting summaries** with multiple templates
- **Meeting Intent** — define priorities and verify what the meeting actually achieved
- **Action items** with persistent completion state
- **Highlights** with timestamp navigation
- **Global search** across meetings and transcripts
- **Shareable meeting views**
- **Responsive UI**
- **Agent session capture** via `.agent-logs/`

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React

### Backend

- Node.js
- Express
- TypeScript
- Mongoose

### Database

- MongoDB

## Architecture

```text
React + TypeScript
        ↓
    REST API
        ↓
Express + TypeScript
        ↓
     MongoDB
```

The architecture is intentionally simple and focused on delivering a complete product experience without unnecessary infrastructure.

## Local Development

### Requirements

- Node.js 18+
- npm
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

Runs on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`.

## Product Decision: Meeting Intent

Most meeting tools tell you **what happened**.

8xfanthom asks:

> **Did this meeting actually achieve what I needed?**

Users define priorities before the meeting, track them during the conversation, and review the final outcome afterward.

```text
Before → Define what matters
   ↓
During → Track what gets covered
   ↓
After → Verify what was achieved
   ↓
Follow-up → Recover what was missed
```

Each priority can be **Covered**, **Partial**, or **Missed**, with direct transcript evidence and timestamp navigation where available.

For the product reasoning and design tradeoffs behind this decision, see [`docs/product-decision.md`](docs/product-decision.md).

## Scope

The project intentionally prioritizes the core meeting experience over infrastructure-heavy features.

Recording, transcription, and AI generation are represented with deterministic seeded data to provide a reliable end-to-end demonstration.

The following are intentionally out of scope:

- Real meeting bots
- Calendar OAuth
- Real-time transcription
- Slack/CRM integrations
- WebSocket infrastructure
- Real-time LLM streaming

This keeps the implementation focused, fast, and maintainable.

## Project Structure

```text
8xfanthom/
├── .agent-logs/
├── .agents/
├── backend/
├── frontend/
├── docs/
├── CAPTURE-TEST.md
├── docker-compose.yml
└── README.md
```

## Development

The project was developed with an emphasis on:

- Product judgment
- Clear scope prioritization
- Full-stack ownership
- UX/UI quality
- Simple, maintainable architecture
- Real-output verification
- AI-assisted development
- Agent session capture

The `.agent-logs/` directory is preserved as part of the 8x assignment requirements.

## License

Built as a software engineering take-home and product demonstration.