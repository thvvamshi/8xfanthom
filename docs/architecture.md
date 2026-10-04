# Fathom Clone Architecture

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Express
- MongoDB
- Mongoose

## Architecture

```text
React
  ↓
Express REST API
  ↓
Controller
  ↓
Service
  ↓
Mongoose
  ↓
MongoDB Atlas
```

## Decisions

- **Recording:** The meeting recording layer is intentionally stubbed. We use seeded media (HTML5 video/audio) synchronized with transcript timestamps to emulate the product experience without building a real Zoom/Meet bot. Real recording bots are intentionally out of scope for this focused 24-hour assignment.
- **AI:** AI summaries will initially be seeded/pre-generated for reliability during evaluation.
- **Seed Data:** The database is populated using a seed script that clears and populates the Meeting collection with realistic mockup data across multiple meeting templates.
- **Search:** Will rely on MongoDB text search capabilities.
- **Authentication:** Authentication is intentionally omitted to focus on the core product experience.

## Deployment Direction

- **Frontend:** Vercel/Netlify
- **Backend:** Render/Railway
- **Database:** MongoDB Atlas
