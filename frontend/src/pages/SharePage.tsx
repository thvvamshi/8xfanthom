import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Meeting } from '../types/meeting';
import { Play, Pause, Loader2, VideoOff, Calendar, Clock, Users, ArrowRight } from 'lucide-react';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const SharePage = () => {
  const { id } = useParams<{ id: string }>();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Refs for scrolling
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const activeTranscriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        setIsLoading(true);
        setIsNotFound(false);
        if (!id) {
          setIsNotFound(true);
          return;
        }

        const res = await fetch(`http://localhost:5000/api/meetings/${id}`);
        if (res.status === 404) {
          setIsNotFound(true);
          return;
        }
        if (!res.ok) {
          throw new Error('Failed to fetch meeting');
        }

        const data = await res.json();
        setMeeting(data);
        setCurrentTime(0);
        setIsPlaying(false);
      } catch (err) {
        setIsNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeeting();
  }, [id]);

  // Mock player timer
  useEffect(() => {
    let interval: number;
    if (isPlaying && meeting) {
      interval = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= meeting.duration) {
            setIsPlaying(false);
            return meeting.duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, meeting]);

  const activeIndex = meeting ? meeting.transcript.findIndex((entry, index) => {
    const isLast = index === meeting.transcript.length - 1;
    const nextTime = isLast ? meeting.duration : meeting.transcript[index + 1].startTime;
    return currentTime >= entry.startTime && currentTime < nextTime;
  }) : -1;

  useEffect(() => {
    if (activeTranscriptRef.current && transcriptContainerRef.current) {
      activeTranscriptRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeIndex]);

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  const handleSeekbarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(Number(e.target.value));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-8x-warm">
        <Loader2 className="h-10 w-10 text-8x-coral animate-spin mb-4" />
        <p className="text-8x-muted font-medium">Loading meeting...</p>
      </div>
    );
  }

  if (isNotFound || !meeting) {
    return (
      <div className="min-h-screen bg-8x-warm flex flex-col items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-8x-border/60 p-10 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-8x-surface border border-8x-border rounded-2xl flex items-center justify-center mx-auto mb-6 text-8x-muted shadow-sm">
            <VideoOff size={28} />
          </div>
          <h2 className="text-2xl font-bold text-8x-ink mb-3 font-serif">Meeting not found</h2>
          <p className="text-8x-muted mb-8 text-sm leading-relaxed max-w-sm mx-auto">
            We couldn't find this meeting. It may have been removed or the link may be incorrect.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-8x-ink hover:bg-8x-navy transition-colors shadow-sm w-full"
          >
            Go to 8xFathom
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-8x-warm flex flex-col">
      {/* Public Header */}
      <header className="bg-white border-b border-8x-border/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-3xl tracking-tight text-8x-ink">
              8x<span className="font-sans font-medium tracking-tight ml-1.5 text-xl">Fathom</span>
            </span>
          </div>
          <Link 
            to={`/meetings/${meeting._id}`}
            className="inline-flex items-center px-5 py-2.5 text-sm font-bold text-8x-ink bg-8x-surface hover:bg-8x-border/50 border border-8x-border/60 rounded-full transition-colors shadow-sm"
          >
            Open in 8xFathom
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-10">
        {/* Meeting Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-serif text-8x-ink mb-4 tracking-tight">{meeting.title}</h1>
          <div className="flex flex-wrap items-center gap-5 text-sm text-8x-muted font-medium">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-8x-border shadow-sm text-8x-ink">
              {meeting.meetingType}
            </span>
            <div className="flex items-center">
              <Calendar size={16} className="mr-2 text-8x-muted/70" />
              {formatDate(meeting.date)}
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-2 text-8x-muted/70" />
              {Math.floor(meeting.duration / 60)} min
            </div>
            <div className="flex items-center">
              <Users size={16} className="mr-2 text-8x-muted/70" />
              {meeting.participants?.length || 0} participants
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Player & Transcript */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Deep Dark Player */}
            <div className="bg-8x-ink text-white p-6 rounded-2xl shadow-sm border border-[#2A2D26]">
              <div className="aspect-video bg-[#0c0d0a] rounded-xl mb-5 flex items-center justify-center border border-[#2A2D26]">
                <span className="text-8x-muted font-medium tracking-wide">Shared Recording View</span>
              </div>
              
              <div className="flex items-center space-x-5">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 flex items-center justify-center bg-8x-coral hover:bg-[#D94F32] rounded-full transition-colors focus:outline-none"
                >
                  {isPlaying ? <Pause size={22} className="text-white fill-current" /> : <Play size={22} className="text-white fill-current ml-1" />}
                </button>
                
                <span className="text-sm font-medium w-12 text-center tabular-nums">{formatTime(currentTime)}</span>
                
                <input 
                  type="range" 
                  min="0" 
                  max={meeting.duration} 
                  value={currentTime}
                  onChange={handleSeekbarChange}
                  className="flex-1 h-2 bg-[#2A2D26] rounded-lg appearance-none cursor-pointer accent-8x-coral"
                />
                
                <span className="text-sm font-medium w-12 text-center text-8x-muted tabular-nums">{formatTime(meeting.duration)}</span>
              </div>
            </div>

            {/* Transcript Viewer */}
            <div className="bg-white rounded-2xl shadow-sm border border-8x-border/60 p-8" ref={transcriptContainerRef}>
              <h3 className="text-xl font-bold text-8x-ink mb-6 pb-4 border-b border-8x-border/50">Transcript</h3>
              <div className="space-y-2">
                {meeting.transcript?.map((entry, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <div 
                      key={index} 
                      ref={isActive ? activeTranscriptRef : null}
                      className={`flex space-x-4 p-4 rounded-xl transition-all ${
                        isActive ? 'bg-8x-surface/50 border border-8x-border/50 shadow-sm' : 'hover:bg-8x-surface/30 border border-transparent'
                      }`}
                    >
                      <button 
                        onClick={() => handleSeek(entry.startTime)}
                        className={`text-sm font-medium min-w-[3.5rem] text-left hover:underline tabular-nums mt-0.5 ${
                          isActive ? 'text-8x-coral' : 'text-8x-muted hover:text-8x-ink'
                        }`}
                      >
                        {formatTime(entry.startTime)}
                      </button>
                      <div className="flex-1">
                        <div className={`text-sm font-bold mb-1.5 flex justify-between items-center ${isActive ? 'text-8x-ink' : 'text-8x-ink/80'}`}>
                          <span>{entry.speaker}</span>
                        </div>
                        <p className={`text-base leading-relaxed ${isActive ? 'text-8x-ink font-medium' : 'text-8x-ink/70'}`}>
                          {entry.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: AI Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-8x-border/60 p-8 flex flex-col lg:sticky lg:top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <h2 className="text-xl font-bold text-8x-ink mb-8 pb-5 border-b border-8x-border/50">Meeting Summary</h2>
            
            {!meeting.summary ? (
              <p className="text-8x-muted text-sm italic">No summary available.</p>
            ) : (
              <div className="space-y-8 pr-2">
                {/* Overview */}
                {meeting.summary.overview && (
                  <div>
                    <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Overview</h3>
                    <p className="text-8x-ink text-sm leading-relaxed">{meeting.summary.overview}</p>
                  </div>
                )}
                
                {/* Template-specific content */}
                {meeting.template === 'Executive' && meeting.summary.executive && (
                  <>
                    {meeting.summary.executive.strategicPriorities && meeting.summary.executive.strategicPriorities.length > 0 && (
                      <div>
                        <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Strategic Priorities</h3>
                        <ul className="list-disc pl-5 space-y-1.5 text-sm text-8x-ink">
                          {meeting.summary.executive.strategicPriorities.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    )}
                    {meeting.summary.executive.risks && meeting.summary.executive.risks.length > 0 && (
                      <div>
                        <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Risks</h3>
                        <ul className="list-disc pl-5 space-y-1.5 text-sm text-8x-ink">
                          {meeting.summary.executive.risks.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    )}
                  </>
                )}

                {meeting.template === 'Sales Discovery' && meeting.summary.sales && (
                  <>
                    {meeting.summary.sales.customerNeeds && meeting.summary.sales.customerNeeds.length > 0 && (
                      <div>
                        <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Customer Needs</h3>
                        <ul className="list-disc pl-5 space-y-1.5 text-sm text-8x-ink">
                          {meeting.summary.sales.customerNeeds.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    )}
                    {meeting.summary.sales.painPoints && meeting.summary.sales.painPoints.length > 0 && (
                      <div>
                        <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Pain Points</h3>
                        <ul className="list-disc pl-5 space-y-1.5 text-sm text-8x-ink">
                          {meeting.summary.sales.painPoints.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    )}
                    {meeting.summary.sales.objections && meeting.summary.sales.objections.length > 0 && (
                      <div>
                        <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Objections</h3>
                        <ul className="list-disc pl-5 space-y-1.5 text-sm text-8x-ink">
                          {meeting.summary.sales.objections.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    )}
                    {meeting.summary.sales.buyingSignals && meeting.summary.sales.buyingSignals.length > 0 && (
                      <div>
                        <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Buying Signals</h3>
                        <ul className="list-disc pl-5 space-y-1.5 text-sm text-8x-ink">
                          {meeting.summary.sales.buyingSignals.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    )}
                  </>
                )}

                {meeting.template === 'Candidate Interview' && meeting.summary.interview && (
                  <>
                    {meeting.summary.interview.candidateStrengths && meeting.summary.interview.candidateStrengths.length > 0 && (
                      <div>
                        <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Candidate Strengths</h3>
                        <ul className="list-disc pl-5 space-y-1.5 text-sm text-8x-ink">
                          {meeting.summary.interview.candidateStrengths.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    )}
                    {meeting.summary.interview.concerns && meeting.summary.interview.concerns.length > 0 && (
                      <div>
                        <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Concerns</h3>
                        <ul className="list-disc pl-5 space-y-1.5 text-sm text-8x-ink">
                          {meeting.summary.interview.concerns.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    )}
                    {meeting.summary.interview.technicalDiscussion && meeting.summary.interview.technicalDiscussion.length > 0 && (
                      <div>
                        <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Technical Discussion</h3>
                        <ul className="list-disc pl-5 space-y-1.5 text-sm text-8x-ink">
                          {meeting.summary.interview.technicalDiscussion.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    )}
                    {meeting.summary.interview.recommendation && (
                      <div>
                        <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Recommendation</h3>
                        <p className="text-sm text-8x-ink">{meeting.summary.interview.recommendation}</p>
                      </div>
                    )}
                  </>
                )}

                {/* Standard template / Fallback */}
                {(!meeting.template || meeting.template === 'Standard') && meeting.summary.keyPoints && meeting.summary.keyPoints.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Key Points</h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-sm text-8x-ink">
                      {meeting.summary.keyPoints.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                )}

                {meeting.summary.decisions && meeting.summary.decisions.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Decisions</h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-sm text-8x-ink">
                      {meeting.summary.decisions.map((decision, i) => <li key={i}>{decision}</li>)}
                    </ul>
                  </div>
                )}

                {meeting.actionItems && meeting.actionItems.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-4">Action Items</h3>
                    <ul className="space-y-4">
                      {meeting.actionItems.map(item => (
                        <li key={item._id} className="flex items-start text-sm">
                          <div className={`h-4 w-4 rounded border mt-0.5 mr-3 flex-shrink-0 flex items-center justify-center ${item.completed ? 'bg-8x-coral border-8x-coral' : 'bg-white border-8x-border'}`}>
                            {item.completed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          <div className="flex-1">
                            <span className={`font-medium ${item.completed ? 'text-8x-muted line-through' : 'text-8x-ink'}`}>{item.text}</span>
                            {item.assignee && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-8x-surface text-8x-ink ml-2 border border-8x-border/60">
                                @{item.assignee}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {meeting.highlights && meeting.highlights.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-4">Highlights</h3>
                    <ul className="space-y-4">
                      {meeting.highlights.map(highlight => (
                        <li key={highlight._id} className="text-sm bg-8x-warm p-4 rounded-xl border-l-2 border-l-8x-coral border-y border-y-8x-border/40 border-r border-r-8x-border/40">
                          <button 
                            onClick={() => handleSeek(highlight.startTime)}
                            className="text-8x-coral hover:text-[#D94F32] font-bold font-mono text-xs hover:underline cursor-pointer mb-2 inline-block transition-colors"
                          >
                            {formatTime(highlight.startTime)}
                          </button>
                          <p className="text-8x-ink italic leading-relaxed font-serif text-[15px]">"{highlight.text}"</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SharePage;
