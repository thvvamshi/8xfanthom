export interface Meeting {
  _id: string;
  title: string;
  description?: string;
  date: string;
  duration: number;
  meetingType: string;
  participants: Array<{ name: string; email?: string; avatarUrl?: string }>;
  recording?: { url: string; duration: number };
  transcript: Array<{ speaker: string; startTime: number; endTime: number; text: string }>;
  summary?: {
    overview: string;
    keyPoints: string[];
    decisions: string[];
    topics: string[];
    executive?: {
      strategicPriorities?: string[];
      risks?: string[];
    };
    sales?: {
      customerNeeds?: string[];
      painPoints?: string[];
      objections?: string[];
      buyingSignals?: string[];
    };
    interview?: {
      candidateStrengths?: string[];
      concerns?: string[];
      technicalDiscussion?: string[];
      recommendation?: string;
    };
  };
  actionItems: Array<{ _id: string; text: string; assignee?: string; dueDate?: string; completed: boolean }>;
  highlights: Array<{ _id: string; startTime: number; endTime: number; text: string; createdAt: string }>;
  intents?: Array<{ 
    _id: string; 
    text: string; 
    status: 'covered' | 'partial' | 'missed' | 'pending'; 
    outcomeStatus?: 'covered' | 'partial' | 'missed';
    evidenceTimestamp?: number; 
    evidenceQuote?: string; 
    evidenceSpeaker?: string; 
    suggestedQuestion?: string; 
  }>;
  template: string;
  completed?: boolean;
}

export interface SearchResult {
  meetingId: string;
  title: string;
  matchType: 'title' | 'transcript';
  snippet: string;
  speaker: string | null;
  timestamp: number | null;
}
