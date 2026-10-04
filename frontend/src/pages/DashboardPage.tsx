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
    <div className="w-full">
      <div className="mb-20">
        <span className="text-[12px] font-bold text-8x-muted uppercase tracking-widest mb-6 block">Meeting Intelligence</span>
        <h1 className="text-5xl md:text-7xl font-serif text-8x-ink mb-6 tracking-tight leading-none">Your meetings,<br/>understood.</h1>
        <p className="text-lg text-8x-muted max-w-lg leading-relaxed">
          A clear view of every conversation,<br/>decision and follow-up.
        </p>
      </div>

      <div className="mb-12 border-t border-8x-border/40 pt-16">
        <h2 className="text-2xl font-bold text-8x-ink mb-10">Recent meetings</h2>
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 bg-transparent">
            <Loader2 className="h-10 w-10 text-8x-coral animate-spin mb-4" />
          </div>
        )}

        {error && (
          <div className="flex items-start space-x-3 bg-red-50/50 p-6 rounded-xl border border-red-100">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-bold">Error</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && meetings.length === 0 && (
          <div className="text-center py-20 border-b border-8x-border/40">
            <h3 className="text-lg font-bold text-8x-ink mb-2">No meetings yet</h3>
            <p className="text-8x-muted">Your recorded meetings will appear here.</p>
          </div>
        )}

        {!isLoading && !error && meetings.length > 0 && (
          <div className="flex flex-col border-t border-8x-border/40">
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
