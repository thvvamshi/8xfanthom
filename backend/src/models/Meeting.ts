import mongoose, { Schema, Document } from 'mongoose';

export interface IParticipant {
  name: string;
  email?: string;
  avatarUrl?: string;
}

export interface ITranscriptSegment {
  speaker: string;
  startTime: number;
  endTime: number;
  text: string;
}

export interface IActionItem {
  text: string;
  assignee?: string;
  dueDate?: Date;
  completed: boolean;
}

export interface IHighlight {
  startTime: number;
  endTime: number;
  text: string;
  createdAt: Date;
}

export interface IMeetingIntent {
  text: string;
  status: 'covered' | 'partial' | 'missed' | 'pending';
  outcomeStatus?: 'covered' | 'partial' | 'missed';
  evidenceTimestamp?: number;
  evidenceQuote?: string;
  evidenceSpeaker?: string;
  suggestedQuestion?: string;
}

export interface IMeeting extends Document {
  title: string;
  description?: string;
  date: Date;
  duration: number; // in seconds
  meetingType: string;
  participants: IParticipant[];
  recording?: {
    url: string;
    duration: number;
  };
  transcript: ITranscriptSegment[];
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
  actionItems: IActionItem[];
  highlights: IHighlight[];
  intents?: IMeetingIntent[];
  template: string;
  completed?: boolean;
}

const MeetingSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  duration: { type: Number, required: true },
  meetingType: { type: String, required: true },
  template: { type: String, default: 'Standard' },
  participants: [{
    name: { type: String, required: true },
    email: { type: String },
    avatarUrl: { type: String }
  }],
  recording: {
    url: { type: String },
    duration: { type: Number }
  },
  transcript: [{
    speaker: { type: String, required: true },
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
    text: { type: String, required: true }
  }],
  summary: {
    overview: { type: String },
    keyPoints: [{ type: String }],
    decisions: [{ type: String }],
    topics: [{ type: String }],
    executive: {
      strategicPriorities: [{ type: String }],
      risks: [{ type: String }]
    },
    sales: {
      customerNeeds: [{ type: String }],
      painPoints: [{ type: String }],
      objections: [{ type: String }],
      buyingSignals: [{ type: String }]
    },
    interview: {
      candidateStrengths: [{ type: String }],
      concerns: [{ type: String }],
      technicalDiscussion: [{ type: String }],
      recommendation: { type: String }
    }
  },
  actionItems: [{
    text: { type: String, required: true },
    assignee: { type: String },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false }
  }],
  highlights: [{
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  intents: [{
    text: { type: String, required: true },
    status: { type: String, enum: ['covered', 'partial', 'missed', 'pending'], default: 'pending' },
    outcomeStatus: { type: String, enum: ['covered', 'partial', 'missed'] },
    evidenceTimestamp: { type: Number },
    evidenceQuote: { type: String },
    evidenceSpeaker: { type: String },
    suggestedQuestion: { type: String }
  }],
  completed: { type: Boolean, default: false }
}, { timestamps: true });

// Indexes for faster querying
MeetingSchema.index({ title: 'text', 'transcript.text': 'text' });
MeetingSchema.index({ date: -1 });

export default mongoose.model<IMeeting>('Meeting', MeetingSchema);
