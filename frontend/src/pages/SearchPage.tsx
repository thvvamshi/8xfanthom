import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import { searchMeetings } from '../lib/api';
import type { SearchResult } from '../types/meeting';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (!queryParam.trim()) {
        setResults(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await searchMeetings(queryParam);
        setResults(data);
      } catch (err) {
        setError('Failed to load search results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [queryParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearchParams({});
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.timestamp !== null) {
      navigate(`/meetings/${result.meetingId}?t=${result.timestamp}`);
    } else {
      navigate(`/meetings/${result.meetingId}`);
    }
  };

  const formatTimestamp = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 h-full flex flex-col">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Search</h1>
      
      <form onSubmit={handleSearch} className="relative mb-8">
        <div className="relative flex items-center w-full">
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search meetings, transcripts, and people..."
            className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-lg transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      <div className="flex-1 overflow-y-auto pb-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Searching your meetings...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
            {error}
          </div>
        ) : results ? (
          results.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-500 mb-4 px-1">
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
              {results.map((result, idx) => (
                <button
                  key={`${result.meetingId}-${idx}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left bg-white p-5 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {result.title}
                  </h3>
                  {result.matchType === 'transcript' ? (
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500 font-medium">
                        {result.speaker && <span>{result.speaker}</span>}
                        {result.speaker && result.timestamp !== null && <span className="mx-2">·</span>}
                        {result.timestamp !== null && <span>{formatTimestamp(result.timestamp)}</span>}
                      </div>
                      <p className="text-gray-700 italic border-l-4 border-indigo-200 pl-3 py-1">
                        "{result.snippet}"
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 font-medium">
                      {result.snippet}
                    </p>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Search className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings found</h3>
              <p>Try adjusting your search term.</p>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Search className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search your meetings</h3>
            <p>Find meetings, transcript moments, and people.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
