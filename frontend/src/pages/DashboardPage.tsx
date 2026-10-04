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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your recent meetings and activity.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Meetings</h2>
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading your meetings...</p>
          </div>
        )}

        {error && (
          <div className="flex items-start space-x-3 bg-red-50 p-4 rounded-lg border border-red-100">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && meetings.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200 border-dashed">
            <h3 className="text-lg font-medium text-gray-900 mb-1">No meetings yet</h3>
            <p className="text-gray-500 mb-4">Your recorded meetings will appear here.</p>
          </div>
        )}

        {!isLoading && !error && meetings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
