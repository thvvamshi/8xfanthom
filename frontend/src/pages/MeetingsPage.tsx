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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meeting History</h1>
          <p className="text-gray-600">All your recorded meetings and insights.</p>
        </div>
      </div>
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-gray-200">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading your meeting history...</p>
        </div>
      )}

      {error && (
        <div className="flex items-start space-x-3 bg-red-50 p-4 rounded-lg border border-red-100 mb-6">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {!isLoading && !error && meetings.length === 0 && (
        <div className="text-center py-20 bg-white rounded-lg border border-gray-200 border-dashed">
          <h3 className="text-lg font-medium text-gray-900 mb-1">No meetings yet</h3>
          <p className="text-gray-500 mb-6">You don't have any recorded meetings in your history.</p>
        </div>
      )}

      {!isLoading && !error && meetings.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-500 mb-2">
            Showing {meetings.length} meetings
          </div>
          <div className="flex flex-col gap-4">
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
