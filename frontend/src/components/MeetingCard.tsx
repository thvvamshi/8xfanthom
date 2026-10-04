import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, CheckSquare, Calendar, Video } from 'lucide-react';
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
      className="block bg-white border border-8x-border/60 rounded-2xl p-6 hover:border-8x-border hover:shadow-sm transition-all duration-200 cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-8x-ink truncate pr-4 group-hover:text-8x-coral transition-colors" title={meeting.title}>
          {meeting.title}
        </h3>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-8x-surface text-8x-muted whitespace-nowrap border border-8x-border/50">
          {meeting.meetingType}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-y-3 text-sm text-8x-muted mb-5">
        <div className="flex items-center space-x-2">
          <Calendar size={16} className="text-8x-muted/70" />
          <span className="font-medium">{formatDate(meeting.date)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock size={16} className="text-8x-muted/70" />
          <span className="font-medium">{formatDuration(meeting.duration)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users size={16} className="text-8x-muted/70" />
          <span className="font-medium">{meeting.participants?.length || 0} participants</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckSquare size={16} className="text-8x-muted/70" />
          <span className="font-medium">{meeting.actionItems?.length || 0} actions</span>
        </div>
      </div>
      
      <div className="flex items-center text-xs text-8x-muted font-medium border-t border-8x-surface pt-4">
        <Video size={14} className="mr-2 text-8x-muted/70" />
        <span>Template: {meeting.template}</span>
      </div>
    </Link>
  );
};

export default MeetingCard;
