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
      className="block bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 truncate pr-4" title={meeting.title}>
          {meeting.title}
        </h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
          {meeting.meetingType}
        </span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-1.5">
          <Calendar size={16} className="text-gray-400" />
          <span>{formatDate(meeting.date)}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <Clock size={16} className="text-gray-400" />
          <span>{formatDuration(meeting.duration)}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <Users size={16} className="text-gray-400" />
          <span>{meeting.participants?.length || 0} participants</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <CheckSquare size={16} className="text-gray-400" />
          <span>{meeting.actionItems?.length || 0} actions</span>
        </div>
      </div>
      
      <div className="flex items-center text-xs text-gray-500 border-t border-gray-100 pt-3 mt-1">
        <Video size={14} className="mr-1.5" />
        <span>Template: {meeting.template}</span>
      </div>
    </Link>
  );
};

export default MeetingCard;
