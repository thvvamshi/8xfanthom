import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, CheckSquare } from 'lucide-react';
import type { Meeting } from '../types/meeting';

interface MeetingCardProps {
  meeting: Meeting;
}

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  return `${m} min`;
};

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting }) => {
  return (
    <Link 
      to={`/meetings/${meeting._id}`}
      className="block py-6 border-b border-8x-border/40 hover:bg-8x-surface/50 transition-colors group px-4 -mx-4 rounded-xl"
    >
      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2">
        <h3 className="text-2xl font-serif text-8x-ink truncate group-hover:text-8x-coral transition-colors">
          {meeting.title}
        </h3>
        <span className="text-sm font-bold text-8x-muted mt-1 md:mt-0">
          {formatDate(meeting.date)}
        </span>
      </div>
      
      <div className="flex flex-wrap items-center text-sm text-8x-muted gap-x-6 gap-y-3 mt-3">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border border-8x-border/60 text-8x-ink bg-8x-surface shadow-sm">
          {meeting.meetingType}
        </span>
        <div className="flex items-center">
          <Clock size={14} className="mr-2 opacity-70" />
          {formatDuration(meeting.duration)}
        </div>
        <div className="flex items-center">
          <Users size={14} className="mr-2 opacity-70" />
          {meeting.participants?.length || 0} participants
        </div>
        <div className="flex items-center">
          <CheckSquare size={14} className="mr-2 opacity-70" />
          {meeting.actionItems?.length || 0} actions
        </div>
        <div className="flex items-center text-xs ml-auto font-medium">
          Template: {meeting.template}
        </div>
      </div>
    </Link>
  );
};

export default MeetingCard;
