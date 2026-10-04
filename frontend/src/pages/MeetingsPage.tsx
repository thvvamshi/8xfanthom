import { useEffect, useState } from 'react';
import { getMeetings } from '../lib/api';
import type { Meeting } from '../types/meeting';
import MeetingCard from '../components/MeetingCard';
import { Loader2, AlertCircle } from 'lucide-react';

const MeetingsPage = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMeetings();
        setMeetings(data);
      } catch (err) {
        setError('Failed to load meeting history. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  return (
    <div className="w-full">
      <div className="mb-20">
        <h1 className="text-5xl md:text-7xl font-serif text-8x-ink mb-6 tracking-tight leading-none">Meetings</h1>
        <p className="text-lg text-8x-muted max-w-lg leading-relaxed">
          Your conversation history, in one place.
        </p>
      </div>
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 bg-transparent">
          <Loader2 className="h-10 w-10 text-8x-coral animate-spin mb-4" />
        </div>
      )}

      {error && (
        <div className="flex items-start space-x-3 bg-red-50/50 p-6 rounded-xl border border-red-100 mb-8">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-bold">Error</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-white border border-red-200 text-red-700 hover:bg-red-50 rounded-lg text-sm font-bold transition-colors shadow-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {!isLoading && !error && meetings.length === 0 && (
        <div className="text-center py-24 border-b border-t border-8x-border/40">
          <h3 className="text-xl font-bold text-8x-ink mb-2">No meetings yet</h3>
          <p className="text-8x-muted mb-6">You don't have any recorded meetings in your history.</p>
        </div>
      )}

      {!isLoading && !error && meetings.length > 0 && (
        <div className="border-t border-8x-border/40 pt-8">
          <div className="text-xs font-bold text-8x-muted tracking-widest uppercase mb-6">
            Showing {meetings.length} {meetings.length === 1 ? 'meeting' : 'meetings'}
          </div>
          <div className="flex flex-col">
            {meetings.map((meeting) => (
              <MeetingCard key={meeting._id} meeting={meeting} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingsPage;
