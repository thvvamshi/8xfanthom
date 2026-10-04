# Fathom Product Recon

## 1. Research Method

- **Direct Product Observation:** Core Fathom product flows and UI patterns were reviewed where accessible, including the meeting workspace, transcript, summary, highlights, templates, search, and sharing concepts.

- **Official Documentation:** Public Fathom documentation and support articles were reviewed to verify product capabilities and workflows.

- **Implementation Inference:** Where direct access or account-specific functionality was unavailable, behavior was inferred from official documentation and used as product-design guidance rather than treated as exact observed behavior.

- **Limitations:** We did not have access to a fully authenticated enterprise Fathom environment, so enterprise-specific administration and permission workflows were not treated as directly observed behavior.

The implementation will prioritize behaviors that are directly observed or supported by official documentation. Inferred behavior will be treated as product-design guidance rather than an exact reproduction requirement.

---

## 2. Core User Journey

1. **Meeting Occurs:** A meeting (Zoom, Meet, Teams) happens, and Fathom automatically records.

2. **Dashboard / Meeting History:** The user logs in and sees a dashboard with recent meetings and action items.

3. **Meeting Workspace:** The user selects a meeting and enters the workspace. This is the central hub.

4. **AI Summary:** The user immediately reads the AI-generated summary, topics, and decisions.

5. **Playback & Transcript:** If context is needed, they click on a specific part of the transcript or a highlight, which syncs the video playback.

6. **Action Items:** The user reviews and manages assigned action items.

7. **Sharing:** The user shares a specific clip, highlight, or the entire meeting summary with stakeholders.

---

## 3. Navigation / Information Architecture

The core information architecture should be streamlined.

We will focus on:

- **Dashboard:** The home page showing a quick summary of recent activity and meetings.

- **Meetings (History):** A searchable list of all past meetings.

- **Meeting Workspace:** The detail view of a single meeting containing the recording, transcript, AI summary, actions, and highlights.

- **Search:** A global search across meeting titles, transcripts, and relevant meeting content.

- **Share View:** A public-facing view for shared meetings or clips.

---

## 4. Dashboard

Fathom's dashboard prioritizes recent meetings and immediate action items.

- **Header:** Quick search and user profile.

- **Meeting List:** Displayed as rows/cards showing title, date, duration, participants, and quick action buttons.

- **Empty State:** A clear call to action to connect a calendar or record a first meeting.

- **Our Clone:** We should show recent meetings prominently, a global search bar, and a quick summary of open action items.

The dashboard should primarily help the user answer:

> "What happened recently, and what do I need to act on?"

---

## 5. Meeting Workspace

This is the most critical screen.

- **Layout:** Top header with Meeting Title, Date, Duration, and Participants. Below it, a recording/player area and a structured workspace containing the Transcript and AI Summary.

- **Interactions:**
  - Clicking a transcript line jumps the video to that timestamp.
  - The active transcript line follows the current playback position.
  - The AI summary is divided into clear sections such as Summary, Key Points, Decisions, Topics, and Action Items.
  - Highlighting a transcript section creates a Highlight.
  - Summary points can provide a fast path back to relevant meeting context.

- **Why it's useful:** It transforms an hour-long meeting into a scannable, actionable document within seconds, while retaining the source of truth (the recording) linked directly to the text.

The workspace should feel like the primary product rather than simply a video player with a transcript.

---

## 6. Recording / Playback

- **Features:** Video player, timeline, play/pause controls, volume, and playback speed.

- **Sync:** The timeline is synchronized with the active transcript line.

- **Our Clone:** Since a real recording layer is not required, we will mock the capture layer and use an HTML5 video/audio player with seeded media, synchronized to transcript timestamps.

The recording layer is intentionally simplified so engineering effort can be focused on the core meeting-intelligence experience.

---

## 7. Transcript

- **Layout:** Speaker name, timestamp, and text block.

- **Features:**
  - Search within transcript where useful.
  - Click-to-seek.
  - Active-line highlighting.
  - Highlight creation.

- **Our Clone:** The transcript must support click-to-seek and dynamic highlighting of the active line.

For large transcripts, the implementation should remain readable and performant. Optimization such as virtualization should only be introduced if the seeded data makes it necessary.

---

## 8. AI Summary

- **Content:** An overarching summary, followed by structured information such as:
  - Key Points
  - Topics
  - Decisions
  - Action Items

- **Value:** This is the information users should be able to consume quickly instead of watching or reading the entire meeting.

- **Our Clone:** Summaries will initially be pre-generated and stored as structured meeting data rather than depending on a live LLM API.

This ensures the deployed product remains reliable during evaluation.

---

## 9. Templates

- **Fathom Behavior:** Users can switch summary templates to restructure how the AI extracts and presents information.

- **Our Clone:** We will implement four templates:

  1. Standard
  2. Executive
  3. Sales Discovery
  4. Candidate Interview

Changing the template will change the visible summary content dynamically.

For the assessment, template-specific summaries can be pre-seeded rather than generated live.

This provides a reliable product interaction while demonstrating the intended AI-assisted workflow.

---

## 10. Action Items

- **Representation:** Checkbox, task description, assignee, and due date.

- **Interaction:** Users can mark action items complete directly from the workspace or dashboard.

- **Persistence:** Action-item state will be persisted through the backend and MongoDB.

Action items should feel like an actual workflow rather than static text extracted from the summary.

---

## 11. Highlights

- **Fathom Behavior:** Important moments can be flagged during the meeting or in the transcript later. They appear as a distinct list with a title/note and timestamp.

- **Our Clone:** We will allow users to select transcript lines or use a highlight action to create a highlight, which will be saved and displayed alongside the meeting content.

A highlight should retain enough timestamp information to navigate back to the relevant moment.

---

## 12. Search

- **Fathom Behavior:** Search can be used across recorded meeting content.

- **Our Clone:** We will implement global search across:

  - Meeting titles
  - Transcript content
  - Relevant meeting metadata

- **Implementation:** Start with MongoDB text/indexed search appropriate for the seeded dataset.

The goal is fast meeting discovery rather than building a complex semantic-search infrastructure.

---

## 13. Sharing

- **Fathom Behavior:** Users can share meetings, summaries, or specific clips through shareable links with appropriate access controls.

- **Our Clone:** We will implement a simplified "Copy Share Link" flow that opens a public-facing view of the selected meeting.

The share view should demonstrate that the meeting can be consumed outside the main application workspace.

Authentication and advanced permission systems are intentionally outside the core assessment scope.

---

## 14. Large Meeting UX

- **Context:** An 8-person, 1-hour meeting can generate a large transcript.

- **Product Consideration:** The AI summary should provide a fast way to understand the meeting without requiring the user to read the entire transcript.

- **Our Clone:** The summary should be dense and structured, while the transcript should remain easy to navigate through timestamps, speaker labels, search, and active-line highlighting.

- **Performance:** If the seeded large meeting creates a sufficiently large transcript, optimize transcript rendering only if necessary.

The product should demonstrate that the summary is the fast consumption layer while the transcript remains the source of detailed context.

---

## 15. Visual / UX Patterns

- **Colors & Typography:** Clean, modern SaaS aesthetic with a strong sans-serif font, dark text on light backgrounds, and restrained primary/accent colors.

- **Spacing:** Information-dense but not cluttered. Clear borders, subtle elevation, and consistent spacing should separate major sections.

- **Hierarchy:** Important information should be visually obvious without requiring excessive cards or decoration.

- **Interaction:** Hover states, active states, selected transcript lines, playback state, and completed action items should provide clear feedback.

- **Avoid:**
  - Unnecessary gradients
  - Excessive animations
  - Cluttered UI
  - Generic dashboard cards
  - Overly decorative components

Focus on utility, readability, and a polished meeting-intelligence experience.

---

## 16. Seed Data Plan

We will seed **8 realistic meetings** to make the application feel populated immediately.

1. **Customer Discovery - Acme Corp**  
   Template: Sales Discovery

2. **Product Strategy Sync**  
   Template: Executive

3. **Engineering Standup**  
   Template: Standard

4. **Hiring Interview - Frontend Engineer**  
   Template: Candidate Interview

5. **Sprint Planning**  
   Template: Standard

6. **Customer Success Review - Globex**  
   Template: Standard

7. **Leadership Weekly**  
   Template: Executive

8. **Q3 Roadmap Review**  
   Template: Executive

Each meeting should eventually contain:

- realistic participants
- meeting date/time
- duration
- recording/media reference
- realistic transcript with timestamps
- structured summary
- topics
- decisions
- action items
- highlights
- template-specific summary content

At least one seeded meeting should represent the large-meeting scenario:

- approximately 8 participants
- approximately 1 hour
- sufficiently detailed transcript
- multiple decisions and action items

The seed data should feel believable rather than generic placeholder content.

---

## 17. P0 / P1 / CUT

### P0 — MUST BUILD

- Dashboard & Meeting History
- Meeting Workspace
- Mocked Recording / Player experience synchronized with Transcript
- AI Summary
- Summary Templates with template switching
- Action Items
- Highlights
- Global Search
- Simple Share flow
- Realistic seeded meeting data
- Publicly accessible deployed application

### P1 — BUILD IF TIME

- Ask AI chat interface for meeting context
- Semantic search across meetings
- Advanced dashboard filtering
- Additional meeting insights
- More advanced sharing controls

### CUT — DO NOT BUILD

- Real Zoom/Meet recording bots
- Real Microsoft Teams recording bots
- Real speech-to-text pipeline
- Complex background job queues
- Real Calendar OAuth
- Slack/CRM integrations
- Kubernetes
- Microservices
- Complex vector infrastructure
- Enterprise authentication/permission systems

**Reason:** The assignment explicitly allows the recording layer to be faked or stubbed. Real-time video processing, OAuth, and enterprise infrastructure are large time sinks that do not demonstrate the core frontend/product UX within a 24-hour rebuild.

---

## 18. Product Judgment

### 1. What are the 3 most important screens?

**1. Meeting Workspace**

The core product experience combining recording, transcript, AI summary, action items, and highlights.

**2. Dashboard / Meeting History**

The primary entry point for discovering recent meetings and opening the right meeting.

**3. Search**

Allows users to quickly find information across meetings and reinforces the product's value as a meeting knowledge system.

The Share View remains an important P0 feature, but it is secondary to the core meeting consumption and discovery experience.

---

### 2. What is the single most important user interaction?

Clicking a transcript line or relevant summary point and having the recording jump precisely to that moment.

This connects the AI-generated information back to the original meeting context.

---

### 3. What makes Fathom useful beyond a simple transcript?

The structured AI summary and extracted action items allow users to understand the important parts of a meeting without manually reviewing the entire transcript.

---

### 4. What should our clone do especially well?

The Meeting Workspace should feel polished, fast, and tightly integrated:

```text
Recording
    +
Transcript
    +
AI Summary
    +
Action Items
    +
Highlights
```

These should feel like parts of one workflow rather than separate features.

---

### 5. What can be convincingly mocked?

- Recording/capture layer
- Video/audio processing
- Transcript generation
- AI summary generation
- Calendar connection

The visible product experience should still behave realistically.

---

### 6. What should NOT be built?

The actual Zoom/Google Meet/Microsoft Teams recording infrastructure.

The assignment explicitly allows this to be stubbed.

---

### 7. What should we build first?

The technical foundation first, followed immediately by:

1. MongoDB data model
2. Realistic seed data
3. Meeting Workspace
4. Playback/transcript synchronization

This ensures the highest-value product experience is implemented early.

---

### 8. What feature would provide the strongest "wow" moment?

Changing the Summary Template and watching the meeting summary immediately change from one structured format to another.

For example:

```text
Standard
    ↓
Sales Discovery
```

The visible summary should reorganize around the selected use case.

---

### 9. What feature can be cut first if we are running out of time?

The first features to reduce or remove are:

1. Ask AI
2. Semantic search
3. Advanced filtering

The core Meeting Workspace should not be compromised.

---

### 10. What would make the clone look like a real product instead of a coding assignment?

- High-quality realistic seed data
- Excellent typography
- Consistent spacing
- Strong information hierarchy
- Smooth transcript/playback interactions
- Clear hover and active states
- Useful empty/error states
- Responsive behavior
- Reliable API interactions
- A polished Meeting Workspace
- A working public HTTPS deployment

---

## 19. Implementation Mapping

| Feature | Fathom behavior | Our implementation | Priority | Reason |
|---------|-----------------|--------------------|----------|--------|
| Workspace | Meeting detail workspace | React workspace with recording, transcript, summary, actions, and highlights | P0 | Core product experience |
| Playback | Meeting recording | HTML5 video/audio with seeded media | P0 | Provides source context |
| Transcript | Timestamped transcript | React transcript with click-to-seek and active-line synchronization | P0 | Core navigation interaction |
| AI Summary | Structured AI-generated summary | Pre-seeded structured JSON | P0 | Primary value proposition |
| Templates | Different summary formats | Seeded template-specific summary views | P0 | Strong demo interaction |
| Highlights | Save important moments | Transcript-line highlight creation with timestamps | P0 | Core meeting workflow |
| Action Items | Extracted tasks and assignees | MongoDB-backed action items with completion state | P0 | Productivity value |
| Search | Search across meeting content | MongoDB indexed/text search | P0 | Meeting discovery |
| Sharing | Share meeting/clip | Simplified public share view | P0 | Required product flow |
| Capture | Meeting bot | Mocked/stubbed capture layer | CUT | Explicitly allowed by assignment |

---

## 20. Assessment Constraints

The implementation is intentionally optimized for the 24-hour assignment window.

### Priorities

- Deliver a polished, believable product experience.
- Prioritize the Meeting Workspace and core meeting interactions.
- Use realistic seeded data instead of empty states.
- Make the application publicly accessible for evaluation.
- Keep the implementation simple enough to explain during the walkthrough.
- Preserve `.agent-logs/` as required by the assignment.
- Ensure the final application works without requiring the evaluator to configure external services.

### Deliberate Tradeoffs

The following are intentionally mocked or simplified:

- Meeting capture/recording
- Calendar integration
- Speech-to-text
- AI generation
- Authentication
- Advanced permissions

These decisions allow engineering effort to remain focused on the core Fathom meeting-intelligence experience.

### Engineering Principle

Prefer a reliable, polished implementation over a technically complex implementation that cannot be completed, deployed, and demonstrated within the assignment time limit.

---

## 21. Recommended Implementation Order

### Phase 2 — Foundation

- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Express + TypeScript
- MongoDB + Mongoose
- Environment configuration
- API foundation
- Application shell

### Phase 3 — Data Model & Seed Data

- Meeting schema
- Transcript structure
- Summary structure
- Action items
- Highlights
- Template-specific summaries
- Seed 8 realistic meetings

### Phase 4 — Dashboard & Meeting History

- Recent meetings
- Meeting list
- Meeting metadata
- Action item overview
- Search entry point
- Empty/loading/error states

### Phase 5 — Meeting Workspace & Playback

- Recording/player
- Transcript
- Timestamp synchronization
- Click-to-seek
- Active transcript line
- Meeting navigation

### Phase 6 — AI Summary & Templates

- Structured summary
- Key points
- Decisions
- Topics
- Summary template switcher
- Template-specific content

### Phase 7 — Action Items & Highlights

- Action item display
- Complete/incomplete state
- Assignee
- Due date
- Transcript highlights
- Highlight navigation

### Phase 8 — Search

- Global search
- Meeting title search
- Transcript search
- Search result navigation
- Useful empty states

### Phase 9 — Sharing, Polish & Deployment

- Share flow
- Public share view
- UI polish
- Responsive improvements
- Loading/error states
- Browser testing
- Production deployment
- Final walkthrough preparation

---

## 22. Final Product Principle

The final product should not attempt to reproduce every part of Fathom.

Instead, it should demonstrate strong product judgment by focusing on the smallest set of experiences that communicate the core value:

> **Open a meeting and understand everything important about it quickly, while being able to jump back to the original conversation whenever more context is needed.**

The core loop is:

```text
Discover Meeting
      ↓
Open Meeting Workspace
      ↓
Understand AI Summary
      ↓
Review Decisions / Actions
      ↓
Jump to Transcript / Recording
      ↓
Highlight Important Moment
      ↓
Share
```

If this loop feels polished, fast, and believable, the clone will demonstrate the core Fathom experience effectively within the assignment constraints.