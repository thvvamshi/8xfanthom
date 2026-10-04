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
    <div className="w-full">
      <div className="mb-20">
        <span className="text-[12px] font-bold text-8x-muted uppercase tracking-widest mb-6 block">Search your meetings</span>
        <h1 className="text-5xl md:text-7xl font-serif text-8x-ink mb-10 tracking-tight leading-none">What are you<br/>looking for?</h1>
        
        <form onSubmit={handleSearch} className="relative max-w-3xl">
          <div className="relative flex items-center w-full group">
            <Search className="absolute left-0 w-8 h-8 text-8x-muted group-focus-within:text-8x-ink transition-colors" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search meetings..."
              className="w-full pl-12 pr-12 py-4 bg-transparent border-0 border-b-2 border-8x-border/80 focus:border-8x-ink focus:ring-0 text-3xl font-serif transition-all text-8x-ink placeholder-8x-muted/40"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-0 p-2 text-8x-muted hover:text-8x-ink transition-colors focus:outline-none"
              >
                <X className="w-8 h-8" />
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="flex-1 max-w-3xl w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-transparent">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-8x-coral" />
          </div>
        ) : error ? (
          <div className="bg-red-50/50 text-red-600 p-6 rounded-xl border border-red-100">
            <h3 className="font-bold text-lg mb-1">Search Error</h3>
            <p>{error}</p>
          </div>
        ) : results ? (
          results.length > 0 ? (
            <div className="space-y-0 border-t border-8x-border/40">
              {results.map((result, idx) => (
                <button
                  key={`${result.meetingId}-${idx}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left py-8 border-b border-8x-border/40 hover:bg-white/50 transition-colors group px-4 -mx-4 rounded-xl"
                >
                  <h3 className="text-2xl font-serif text-8x-ink mb-2 group-hover:text-8x-coral transition-colors">
                    {result.title}
                  </h3>
                  {result.matchType === 'transcript' ? (
                    <div className="space-y-2 mt-3">
                      <div className="flex items-center text-sm text-8x-muted font-bold tracking-wide">
                        {result.speaker && <span>{result.speaker}</span>}
                        {result.speaker && result.timestamp !== null && <span className="mx-2 font-normal text-8x-border/80">•</span>}
                        {result.timestamp !== null && <span>{formatTimestamp(result.timestamp)}</span>}
                      </div>
                      <p className="text-8x-ink italic border-l-2 border-8x-coral pl-4 py-1 font-serif text-lg leading-relaxed mt-2">
                        "{result.snippet}"
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-8x-muted font-medium mt-2">
                      {result.snippet}
                    </p>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="py-20 border-t border-8x-border/40">
              <h3 className="text-xl font-bold text-8x-ink mb-2 font-serif">No meetings found</h3>
              <p className="text-8x-muted">Try adjusting your search term.</p>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default SearchPage;
