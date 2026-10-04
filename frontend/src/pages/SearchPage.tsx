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
    <div className="max-w-4xl mx-auto py-10 px-4 h-full flex flex-col">
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-serif text-8x-ink mb-4 tracking-tight leading-tight">Search your meetings</h1>
        <p className="text-8x-muted text-lg">Find meetings, transcript moments, and people.</p>
      </div>
      
      <form onSubmit={handleSearch} className="relative mb-10 max-w-3xl mx-auto w-full">
        <div className="relative flex items-center w-full shadow-sm rounded-2xl group">
          <Search className="absolute left-5 w-6 h-6 text-8x-muted group-focus-within:text-8x-ink transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords..."
            className="w-full pl-14 pr-14 py-5 rounded-2xl border border-8x-border/80 focus:outline-none focus:ring-4 focus:ring-8x-ink/10 focus:border-8x-ink text-xl transition-all text-8x-ink placeholder-8x-muted/70 bg-white"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 p-2 rounded-full hover:bg-8x-surface text-8x-muted hover:text-8x-ink transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      <div className="flex-1 overflow-y-auto pb-12 max-w-3xl mx-auto w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-8x-surface rounded-2xl border border-8x-border/50">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-8x-coral" />
            <p className="text-8x-muted font-medium">Searching your meetings...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100">
            <h3 className="font-bold text-lg mb-1">Search Error</h3>
            <p>{error}</p>
          </div>
        ) : results ? (
          results.length > 0 ? (
            <div className="space-y-5">
              <p className="text-xs font-bold text-8x-muted/70 tracking-widest uppercase mb-4 px-1">
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
              {results.map((result, idx) => (
                <button
                  key={`${result.meetingId}-${idx}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left bg-white p-6 rounded-2xl border border-8x-border/60 hover:border-8x-border hover:shadow-sm transition-all group"
                >
                  <h3 className="text-xl font-bold text-8x-ink mb-3 group-hover:text-8x-coral transition-colors">
                    {result.title}
                  </h3>
                  {result.matchType === 'transcript' ? (
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-8x-muted font-bold tracking-wide">
                        {result.speaker && <span>{result.speaker}</span>}
                        {result.speaker && result.timestamp !== null && <span className="mx-2 text-8x-border font-normal">|</span>}
                        {result.timestamp !== null && <span>{formatTimestamp(result.timestamp)}</span>}
                      </div>
                      <p className="text-8x-ink italic border-l-2 border-8x-coral pl-4 py-1 font-serif text-[15px] leading-relaxed">
                        "{result.snippet}"
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-8x-muted font-medium">
                      {result.snippet}
                    </p>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-8x-surface rounded-2xl border border-8x-border/50 border-dashed">
              <Search className="w-12 h-12 text-8x-muted/50 mb-4" />
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
