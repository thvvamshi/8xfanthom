import mongoose from 'mongoose';
import { config } from './config/env';
import Meeting from './models/Meeting';

const seedData = [
  {
    title: 'Customer Discovery - Acme Corp',
    meetingType: 'Sales',
    template: 'Sales Discovery',
    date: new Date('2023-10-15T10:00:00Z'),
    duration: 3600,
    participants: [
      { name: 'Sarah Chen', email: 'sarah@8xfathom.example' },
      { name: 'Mike Ross', email: 'mike@acmecorp.example' }
    ],
    recording: { type: 'mock', url: '/mock-media/acme-discovery.mp4', duration: 3600 },
    transcript: [
      { speaker: 'Sarah Chen', startTime: 10, endTime: 15, text: 'Thanks for joining, Mike. What brings you to us today?' },
      { speaker: 'Mike Ross', startTime: 16, endTime: 30, text: 'Our main pain point is tracking action items across various sales calls. We keep losing track of commitments.' },
      { speaker: 'Sarah Chen', startTime: 32, endTime: 45, text: 'We definitely solve that. What timeline are you looking at for implementation?' },
      { speaker: 'Mike Ross', startTime: 47, endTime: 55, text: 'Ideally within this quarter.' },
      { speaker: 'Sarah Chen', startTime: 180, endTime: 195, text: 'Let me show you a quick demo of how we handle follow-ups automatically.' },
      { speaker: 'Mike Ross', startTime: 200, endTime: 215, text: 'That looks very smooth. Can it integrate directly with our CRM?' },
      { speaker: 'Sarah Chen', startTime: 218, endTime: 240, text: 'Yes, we have out-of-the-box integrations with Salesforce, HubSpot, and a few others.' },
      { speaker: 'Sarah Chen', startTime: 800, endTime: 820, text: 'So moving on to the pricing model, we have tier-based plans depending on your team size.' },
      { speaker: 'Mike Ross', startTime: 1120, endTime: 1128, text: 'At that price point, I think we can get internal approval without much pushback.' },
      { speaker: 'Sarah Chen', startTime: 1130, endTime: 1145, text: 'Great. Let me send over the technical documentation for your engineering team to review.' },
      { speaker: 'Mike Ross', startTime: 1500, endTime: 1520, text: 'One question: how long does onboarding usually take for a team of our size?' },
      { speaker: 'Sarah Chen', startTime: 1522, endTime: 1550, text: 'Usually about two weeks from contract signature to full deployment.' },
      { speaker: 'Sarah Chen', startTime: 1865, endTime: 1872, text: 'How are you currently evaluating us against competitors?' },
      { speaker: 'Mike Ross', startTime: 1873, endTime: 1885, text: 'We mentioned it briefly to the board, but there is no conclusion yet on who else we will look at.' },
      { speaker: 'Sarah Chen', startTime: 2500, endTime: 2520, text: 'Just doing a time check, we have about 15 minutes left. Any other questions?' },
      { speaker: 'Mike Ross', startTime: 2525, endTime: 2540, text: 'I think that covers most of it. We should definitely schedule a PoC kickoff.' },
      { speaker: 'Sarah Chen', startTime: 3400, endTime: 3415, text: 'Alright, I will get those invites sent out right away. Thanks for your time today, Mike.' },
      { speaker: 'Mike Ross', startTime: 3418, endTime: 3425, text: 'Thanks Sarah. Talk soon.' }
    ],
    summary: {
      overview: 'Acme Corp is evaluating our platform to solve their action-item tracking issues in sales calls.',
      keyPoints: ['Pain point: action item tracking', 'Timeline: this quarter'],
      decisions: ['Agreed to run a proof of concept next week'],
      topics: ['Customer Needs', 'Timeline', 'Next Steps'],
      sales: {
        customerNeeds: ['Better tracking of post-call action items'],
        painPoints: ['Losing track of commitments made on sales calls', 'Manual data entry into CRM'],
        objections: ['Time to implement', 'Integration with existing CRM'],
        buyingSignals: ['Asked for timeline', 'Agreed to PoC']
      }
    },
    actionItems: [
      { text: 'Send technical documentation to Mike', assignee: 'Sarah Chen', dueDate: new Date('2023-10-17'), completed: false },
      { text: 'Schedule PoC kickoff', assignee: 'Sarah Chen', dueDate: new Date('2023-10-20'), completed: true }
    ],
    highlights: [
      { startTime: 16, endTime: 30, text: 'Our main pain point is tracking action items across various sales calls.', createdAt: new Date() }
    ],
    intents: [
      {
        text: 'Confirm the renewal timeline',
        status: 'covered',
        outcomeStatus: 'covered',
        evidenceTimestamp: 1120,
        evidenceQuote: 'At that price point, I think we can get internal approval without much pushback.',
        evidenceSpeaker: 'Mike Ross',
        suggestedQuestion: 'Could we clarify the main concern with the proposed pricing?'
      },
      {
        text: 'Understand the customer\'s pricing concerns',
        status: 'partial',
        outcomeStatus: 'partial',
        evidenceTimestamp: 1865,
        evidenceQuote: 'We mentioned it briefly to the board, but there is no conclusion yet on who else we will look at.',
        evidenceSpeaker: 'Mike Ross',
        suggestedQuestion: 'Who else are you currently evaluating?'
      },
      {
        text: 'Identify the final decision maker',
        status: 'missed',
        outcomeStatus: 'missed',
        suggestedQuestion: 'Before we wrap, can we confirm the renewal timeline and what the next step looks like?'
      }
    ]
  },
  {
    title: 'Product Strategy Sync',
    meetingType: 'Internal',
    template: 'Executive',
    date: new Date('2023-10-16T14:00:00Z'),
    duration: 2700,
    participants: [
      { name: 'David Lee', email: 'david@8xfathom.example' },
      { name: 'Elena Smith', email: 'elena@8xfathom.example' }
    ],
    recording: { type: 'mock', url: '/mock-media/product-strategy.mp4', duration: 2700 },
    transcript: [
      { speaker: 'David Lee', startTime: 10, endTime: 25, text: 'We need to finalize the Q4 roadmap today.' },
      { speaker: 'Elena Smith', startTime: 27, endTime: 40, text: 'Agreed. The enterprise SSO feature should be our top priority based on customer requests.' },
      { speaker: 'David Lee', startTime: 42, endTime: 55, text: 'Okay, let\'s commit to delivering SSO by November.' }
    ],
    summary: {
      overview: 'Alignment on the Q4 product roadmap, heavily prioritizing Enterprise SSO.',
      keyPoints: ['Enterprise SSO is the most requested feature', 'Target delivery is November'],
      decisions: ['Enterprise SSO is the #1 priority for Q4'],
      topics: ['Q4 Roadmap', 'Enterprise SSO']
    },
    actionItems: [
      { text: 'Update Jira with Q4 epic', assignee: 'David Lee', dueDate: new Date('2023-10-18'), completed: false }
    ],
    highlights: [
      { startTime: 42, endTime: 55, text: 'Okay, let\'s commit to delivering SSO by November.', createdAt: new Date() }
    ]
  },
  {
    title: 'Engineering Standup',
    meetingType: 'Internal',
    template: 'Standard',
    date: new Date('2023-10-17T09:30:00Z'),
    duration: 900,
    participants: [
      { name: 'Elena Smith', email: 'elena@8xfathom.example' },
      { name: 'John Doe', email: 'john@8xfathom.example' },
      { name: 'Jane Roe', email: 'jane@8xfathom.example' }
    ],
    recording: { type: 'mock', url: '/mock-media/eng-standup.mp4', duration: 900 },
    transcript: [
      { speaker: 'John Doe', startTime: 10, endTime: 20, text: 'I am working on the database migration today.' },
      { speaker: 'Jane Roe', startTime: 21, endTime: 30, text: 'I fixed the authentication bug and will review John\'s PR.' },
      { speaker: 'Elena Smith', startTime: 32, endTime: 40, text: 'No blockers on my end.' }
    ],
    summary: {
      overview: 'Daily engineering standup covering DB migration and auth fixes.',
      keyPoints: ['Auth bug is fixed', 'DB migration is ongoing'],
      decisions: [],
      topics: ['Updates', 'Blockers']
    },
    actionItems: [
      { text: 'Review DB migration PR', assignee: 'Jane Roe', dueDate: new Date('2023-10-17'), completed: false }
    ],
    highlights: []
  },
  {
    title: 'Hiring Interview - Frontend Engineer',
    meetingType: 'Interview',
    template: 'Candidate Interview',
    date: new Date('2023-10-18T13:00:00Z'),
    duration: 3600,
    participants: [
      { name: 'Elena Smith', email: 'elena@8xfathom.example' },
      { name: 'Alex Johnson', email: 'alex.candidate@example.com' }
    ],
    recording: { type: 'mock', url: '/mock-media/interview.mp4', duration: 3600 },
    transcript: [
      { speaker: 'Elena Smith', startTime: 10, endTime: 30, text: 'Can you walk me through your experience with React performance optimization?' },
      { speaker: 'Alex Johnson', startTime: 32, endTime: 90, text: 'In my last role, we had a large list rendering issue. I implemented virtual scrolling which reduced load time by 60%.' },
      { speaker: 'Elena Smith', startTime: 92, endTime: 110, text: 'That sounds solid. How do you handle state management across complex apps?' },
      { speaker: 'Alex Johnson', startTime: 112, endTime: 150, text: 'I prefer using Zustand or Redux Toolkit depending on the scale.' }
    ],
    summary: {
      overview: 'Interview with Alex Johnson for the Frontend Engineer role.',
      keyPoints: ['Strong React performance experience', 'Familiar with Zustand and Redux'],
      decisions: ['Recommend to advance to final round'],
      topics: ['Performance Optimization', 'State Management', 'Recommendation'],
      interview: {
        candidateStrengths: ['Deep knowledge of React rendering', 'Practical experience with virtual scrolling', 'Good communication'],
        concerns: ['No backend experience mentioned yet'],
        technicalDiscussion: ['Discussed state management (Zustand, Redux Toolkit)', 'List rendering optimizations'],
        recommendation: 'Strong Hire. Proceed to final round.'
      }
    },
    actionItems: [
      { text: 'Submit candidate scorecard', assignee: 'Elena Smith', dueDate: new Date('2023-10-19'), completed: false }
    ],
    highlights: [
      { startTime: 32, endTime: 90, text: 'Implemented virtual scrolling which reduced load time by 60%.', createdAt: new Date() }
    ]
  },
  {
    title: 'Sprint Planning',
    meetingType: 'Internal',
    template: 'Standard',
    date: new Date('2023-10-19T10:00:00Z'),
    duration: 2700,
    participants: [
      { name: 'David Lee', email: 'david@8xfathom.example' },
      { name: 'Elena Smith', email: 'elena@8xfathom.example' },
      { name: 'John Doe', email: 'john@8xfathom.example' }
    ],
    recording: { type: 'mock', url: '/mock-media/sprint-planning.mp4', duration: 2700 },
    transcript: [
      { speaker: 'David Lee', startTime: 10, endTime: 25, text: 'Our sprint goal is completing the SSO integration.' },
      { speaker: 'John Doe', startTime: 27, endTime: 40, text: 'I can take the backend SAML setup.' },
      { speaker: 'Elena Smith', startTime: 42, endTime: 55, text: 'I will handle the login UI changes.' }
    ],
    summary: {
      overview: 'Planning Sprint 24 with a focus on SSO integration.',
      keyPoints: ['Sprint goal: SSO integration', 'John on backend, Elena on frontend'],
      decisions: ['Approved sprint backlog'],
      topics: ['Sprint Goal', 'Task Assignment']
    },
    actionItems: [
      { text: 'Start backend SAML setup', assignee: 'John Doe', dueDate: new Date('2023-10-25'), completed: false },
      { text: 'Implement login UI', assignee: 'Elena Smith', dueDate: new Date('2023-10-25'), completed: false }
    ],
    highlights: []
  },
  {
    title: 'Customer Success Review - Globex',
    meetingType: 'Customer',
    template: 'Standard',
    date: new Date('2023-10-20T11:00:00Z'),
    duration: 1800,
    participants: [
      { name: 'Emily White', email: 'emily@8xfathom.example' },
      { name: 'Tom Black', email: 'tom@globex.example' }
    ],
    recording: { type: 'mock', url: '/mock-media/cs-review.mp4', duration: 1800 },
    transcript: [
      { speaker: 'Emily White', startTime: 10, endTime: 25, text: 'How has the adoption been since our last check-in?' },
      { speaker: 'Tom Black', startTime: 27, endTime: 50, text: 'Usage is up, but some users are confused about the template switching.' },
      { speaker: 'Emily White', startTime: 52, endTime: 65, text: 'I will send over a quick video tutorial on that.' }
    ],
    summary: {
      overview: 'Monthly check-in with Globex. Adoption is increasing but training is needed on templates.',
      keyPoints: ['Usage is increasing', 'Confusion around template switching'],
      decisions: [],
      topics: ['Adoption', 'Training']
    },
    actionItems: [
      { text: 'Send template tutorial to Tom', assignee: 'Emily White', dueDate: new Date('2023-10-21'), completed: true }
    ],
    highlights: [
      { startTime: 27, endTime: 50, text: 'Usage is up, but some users are confused about the template switching.', createdAt: new Date() }
    ]
  },
  {
    title: 'Leadership Weekly',
    meetingType: 'Internal',
    template: 'Executive',
    date: new Date('2023-10-23T09:00:00Z'),
    duration: 3600,
    participants: [
      { name: 'David Lee', email: 'david@8xfathom.example' },
      { name: 'Sarah Chen', email: 'sarah@8xfathom.example' },
      { name: 'Elena Smith', email: 'elena@8xfathom.example' },
      { name: 'Emily White', email: 'emily@8xfathom.example' },
      { name: 'Mark Taylor', email: 'mark@8xfathom.example' },
      { name: 'Lisa Wong', email: 'lisa@8xfathom.example' },
      { name: 'James Wilson', email: 'james@8xfathom.example' },
      { name: 'Anna Brown', email: 'anna@8xfathom.example' }
    ],
    recording: { type: 'mock', url: '/mock-media/leadership.mp4', duration: 3600 },
    transcript: [
      { speaker: 'David Lee', startTime: 0, endTime: 25, text: 'Welcome everyone to our Leadership Weekly sync. We have a packed agenda today.' },
      { speaker: 'David Lee', startTime: 25, endTime: 50, text: 'Let\'s kick things off with business performance and priorities for the month.' },
      { speaker: 'Sarah Chen', startTime: 55, endTime: 90, text: 'I can take that. We hit our MRR target for October. Enterprise sales are really driving the growth.' },
      { speaker: 'Sarah Chen', startTime: 92, endTime: 120, text: 'We closed three major deals this week, which puts us 15% ahead of our quarterly projections.' },
      { speaker: 'Mark Taylor', startTime: 125, endTime: 180, text: 'That aligns with what we\'re seeing on the marketing side. ROI has improved 15% due to the new ad campaign.' },
      { speaker: 'David Lee', startTime: 185, endTime: 210, text: 'Excellent. Any risks on the pipeline we should be aware of?' },
      { speaker: 'Sarah Chen', startTime: 212, endTime: 260, text: 'Our mid-market pipeline is slightly softer than expected. We need more top-of-funnel leads there.' },
      { speaker: 'Mark Taylor', startTime: 265, endTime: 300, text: 'We can reallocate some ad spend to target mid-market next week.' },
      { speaker: 'David Lee', startTime: 500, endTime: 530, text: 'Alright, let\'s transition to product updates. Elena, how are we looking?' },
      { speaker: 'Elena Smith', startTime: 535, endTime: 590, text: 'Engineering is on track for the SSO release, no major blockers so far.' },
      { speaker: 'Elena Smith', startTime: 595, endTime: 640, text: 'We completed the security audit yesterday and everything passed with flying colors.' },
      { speaker: 'James Wilson', startTime: 645, endTime: 680, text: 'That\'s great to hear. Support has been getting a lot of tickets asking for SSO.' },
      { speaker: 'David Lee', startTime: 1000, endTime: 1050, text: 'What about infrastructure? We had some latency issues last week.' },
      { speaker: 'Elena Smith', startTime: 1055, endTime: 1120, text: 'We scaled up the database read replicas, which completely resolved the peak load latency.' },
      { speaker: 'Emily White', startTime: 1200, endTime: 1260, text: 'Moving on to customer feedback, overall sentiment is very positive on the new UI.' },
      { speaker: 'Emily White', startTime: 1265, endTime: 1320, text: 'However, customer churn is slightly up in the SMB segment, we are analyzing why.' },
      { speaker: 'Anna Brown', startTime: 1325, endTime: 1380, text: 'I\'ll dive into the data. I will prepare a churn report by Friday so we can review the root causes.' },
      { speaker: 'David Lee', startTime: 1500, endTime: 1560, text: 'Great. We need to decide on the Q1 hiring budget. Are we expanding the sales team?' },
      { speaker: 'Lisa Wong', startTime: 1565, endTime: 1620, text: 'Finance approves adding two more Account Executives given the enterprise growth.' },
      { speaker: 'Sarah Chen', startTime: 1625, endTime: 1670, text: 'That\'s exactly what we need to sustain this momentum.' },
      { speaker: 'David Lee', startTime: 1710, endTime: 1750, text: 'Decision made. We will open the reqs today.' },
      { speaker: 'David Lee', startTime: 2000, endTime: 2060, text: 'Let\'s discuss the Q1 roadmap quickly. Are we still prioritizing the mobile app?' },
      { speaker: 'Elena Smith', startTime: 2065, endTime: 2130, text: 'Yes, but it requires a dedicated mobile engineer. We need to open a headcount for that as well.' },
      { speaker: 'Lisa Wong', startTime: 2135, endTime: 2180, text: 'I can approve one mobile engineering headcount for November.' },
      { speaker: 'David Lee', startTime: 3000, endTime: 3050, text: 'Before we wrap up, any other risks or blockers?' },
      { speaker: 'James Wilson', startTime: 3055, endTime: 3120, text: 'Support volume is spiking due to the new features. We might need better self-serve documentation.' },
      { speaker: 'Emily White', startTime: 3125, endTime: 3180, text: 'I\'ll work with product marketing to update the knowledge base this week.' },
      { speaker: 'David Lee', startTime: 3500, endTime: 3550, text: 'Alright, great meeting everyone. Let\'s execute on these action items.' },
      { speaker: 'David Lee', startTime: 3555, endTime: 3590, text: 'See you all next week.' }
    ],
    summary: {
      overview: 'Weekly leadership sync covering MRR, marketing ROI, engineering updates, and hiring budgets.',
      keyPoints: ['October MRR target achieved', 'SSO release on track', 'SMB churn is slightly elevated'],
      decisions: ['Approved hiring for two new Account Executives'],
      topics: ['Revenue', 'Marketing', 'Engineering', 'Hiring', 'Customer Success'],
      executive: {
        strategicPriorities: ['Sustain enterprise growth', 'Deliver SSO feature to unlock enterprise deals', 'Address SMB churn'],
        risks: ['Soft mid-market pipeline', 'Spike in support volume due to new features']
      }
    },
    actionItems: [
      { text: 'Open reqs for 2 Account Executives', assignee: 'Sarah Chen', dueDate: new Date('2023-10-24'), completed: false },
      { text: 'Prepare SMB churn report', assignee: 'Anna Brown', dueDate: new Date('2023-10-27'), completed: false }
    ],
    highlights: [
      { startTime: 62, endTime: 120, text: 'We hit our MRR target for October.', createdAt: new Date() },
      { startTime: 1610, endTime: 1700, text: 'Finance approves adding two more Account Executives.', createdAt: new Date() }
    ]
  },
  {
    title: 'Q3 Roadmap Review',
    meetingType: 'Internal',
    template: 'Executive',
    date: new Date('2023-10-24T14:00:00Z'),
    duration: 2700,
    participants: [
      { name: 'David Lee', email: 'david@8xfathom.example' },
      { name: 'Elena Smith', email: 'elena@8xfathom.example' },
      { name: 'Sarah Chen', email: 'sarah@8xfathom.example' }
    ],
    recording: { type: 'mock', url: '/mock-media/roadmap.mp4', duration: 2700 },
    transcript: [
      { speaker: 'David Lee', startTime: 10, endTime: 45, text: 'Looking back at Q3, we delivered 80% of our planned features.' },
      { speaker: 'Elena Smith', startTime: 50, endTime: 90, text: 'The missing 20% was delayed due to unexpected infrastructure scale issues, which are now resolved.' },
      { speaker: 'Sarah Chen', startTime: 95, endTime: 130, text: 'Sales is happy with what was shipped, especially the new analytics dashboard.' }
    ],
    summary: {
      overview: 'Review of Q3 roadmap delivery. 80% completion rate with positive sales feedback.',
      keyPoints: ['80% of features delivered', 'Infra issues resolved', 'Analytics dashboard well received'],
      decisions: ['Roll over the remaining 20% to Q4'],
      topics: ['Delivery Metrics', 'Infrastructure', 'Sales Feedback']
    },
    actionItems: [
      { text: 'Add incomplete Q3 items to Q4 backlog', assignee: 'Elena Smith', dueDate: new Date('2023-10-25'), completed: false }
    ],
    highlights: [
      { startTime: 10, endTime: 45, text: 'Looking back at Q3, we delivered 80% of our planned features.', createdAt: new Date() }
    ]
  }
];

const seedDatabase = async () => {
  try {
    if (!config.databaseUrl) {
      throw new Error('DATABASE_URL is not defined');
    }
    await mongoose.connect(config.databaseUrl);
    console.log('Connected to MongoDB Atlas for seeding');

    await Meeting.deleteMany({});
    console.log('Cleared existing meetings');

    const inserted = await Meeting.insertMany(seedData);
    console.log(`Successfully seeded ${inserted.length} meetings`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
