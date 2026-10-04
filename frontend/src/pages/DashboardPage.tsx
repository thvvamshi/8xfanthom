import { useEffect, useState } from 'react';
import { getMeetings } from '../lib/api';
import type { Meeting } from '../types/meeting';
import MeetingCard from '../components/MeetingCard';
import { Loader2, AlertCircle } from 'lucide-react';

const DashboardPage = () => {
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
        setError('Failed to load recent meetings. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12">
        <span className="text-xs font-bold text-8x-muted uppercase tracking-widest mb-4 block">Meeting Intelligence</span>
        <h1 className="text-5xl font-serif text-8x-ink mb-4 tracking-tight leading-tight">Your meetings,<br/>organized.</h1>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-8x-ink mb-6">Recent Meetings</h2>
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 bg-8x-surface rounded-2xl border border-8x-border/60">
            <Loader2 className="h-8 w-8 text-8x-coral animate-spin mb-4" />
            <p className="text-8x-muted font-medium">Loading your meetings...</p>
          </div>
        )}

        {error && (
          <div className="flex items-start space-x-3 bg-red-50 p-6 rounded-2xl border border-red-100">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-bold">Error</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && meetings.length === 0 && (
          <div className="text-center py-20 bg-8x-surface rounded-2xl border border-8x-border border-dashed">
            <h3 className="text-lg font-bold text-8x-ink mb-2">No meetings yet</h3>
            <p className="text-8x-muted">Your recorded meetings will appear here.</p>
          </div>
        )}

        {!isLoading && !error && meetings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {meetings.slice(0, 4).map((meeting) => (
              <MeetingCard key={meeting._id} meeting={meeting} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
