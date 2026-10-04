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
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-serif text-8x-ink mb-3 tracking-tight">Meetings Archive</h1>
          <p className="text-8x-muted">All your recorded meetings and insights.</p>
        </div>
      </div>
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 bg-8x-surface rounded-2xl border border-8x-border/60">
          <Loader2 className="h-10 w-10 text-8x-coral animate-spin mb-4" />
          <p className="text-8x-muted font-medium">Loading your meeting history...</p>
        </div>
      )}

      {error && (
        <div className="flex items-start space-x-3 bg-red-50 p-6 rounded-2xl border border-red-100 mb-8">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-bold">Error</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-bold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {!isLoading && !error && meetings.length === 0 && (
        <div className="text-center py-24 bg-8x-surface rounded-2xl border border-8x-border border-dashed">
          <h3 className="text-xl font-bold text-8x-ink mb-2">No meetings yet</h3>
          <p className="text-8x-muted mb-6">You don't have any recorded meetings in your history.</p>
        </div>
      )}

      {!isLoading && !error && meetings.length > 0 && (
        <div className="space-y-6">
          <div className="text-sm font-bold text-8x-muted/70 tracking-widest uppercase">
            Showing {meetings.length} meetings
          </div>
          <div className="grid grid-cols-1 gap-5">
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
