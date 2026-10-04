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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading meeting...</p>
      </div>
    );
  }

  if (isNotFound || !meeting) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-400 shadow-sm">
            <VideoOff size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Meeting not found</h2>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed max-w-sm mx-auto">
            We couldn't find this meeting. It may have been removed or the link may be incorrect.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm w-full"
          >
            Go to 8xFathom
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Public Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg leading-none tracking-tighter">8x</span>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Fathom</span>
          </div>
          <Link 
            to={`/meetings/${meeting._id}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            Open in 8xFathom
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {/* Meeting Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{meeting.title}</h1>
          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600 font-medium">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
              {meeting.meetingType}
            </span>
            <div className="flex items-center">
              <Calendar size={18} className="mr-2 text-gray-400" />
              {formatDate(meeting.date)}
            </div>
            <div className="flex items-center">
              <Clock size={18} className="mr-2 text-gray-400" />
              {Math.floor(meeting.duration / 60)} min
            </div>
            <div className="flex items-center">
              <Users size={18} className="mr-2 text-gray-400" />
              {meeting.participants?.length || 0} participants
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Player & Transcript */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Player */}
            <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg border border-gray-800">
              <div className="aspect-video bg-black/60 rounded-xl mb-5 flex items-center justify-center border border-gray-700/50">
                <span className="text-gray-400 font-medium">Shared Recording View</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {isPlaying ? <Pause size={24} className="text-white fill-current" /> : <Play size={24} className="text-white fill-current ml-1" />}
                </button>
                
                <span className="text-sm font-medium w-14 text-center tabular-nums">{formatTime(currentTime)}</span>
                
                <input 
                  type="range" 
                  min="0" 
                  max={meeting.duration} 
                  value={currentTime}
                  onChange={handleSeekbarChange}
                  className="flex-1 h-2.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-colors"
                />
                
                <span className="text-sm font-medium w-14 text-center tabular-nums text-gray-400">{formatTime(meeting.duration)}</span>
              </div>
            </div>

            {/* Transcript */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6" ref={transcriptContainerRef}>
              <h3 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Transcript</h3>
              <div className="space-y-3">
                {meeting.transcript?.map((entry, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <div 
                      key={index} 
                      ref={isActive ? activeTranscriptRef : null}
                      className={`flex space-x-4 p-4 rounded-xl transition-all ${
                        isActive ? 'bg-indigo-50/50 border border-indigo-100 shadow-sm' : 'hover:bg-gray-50/80 border border-transparent'
                      }`}
                    >
                      <button 
                        onClick={() => handleSeek(entry.startTime)}
                        className={`text-sm font-semibold min-w-[3.5rem] text-left hover:underline tabular-nums mt-0.5 ${
                          isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-indigo-500'
                        }`}
                      >
                        {formatTime(entry.startTime)}
                      </button>
                      <div className="flex-1">
                        <div className={`text-sm font-bold mb-1.5 ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                          {entry.speaker}
                        </div>
                        <p className={`text-base leading-relaxed ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                          {entry.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Meeting Summary</h2>
            
            {!meeting.summary ? (
              <p className="text-gray-500 text-sm italic">No summary available.</p>
            ) : (
              <div className="space-y-8">
                {meeting.summary.overview && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Overview</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{meeting.summary.overview}</p>
                  </div>
                )}
                
                {/* Template-specific content */}
                {meeting.template === 'Executive' && meeting.summary.executive && (
                  <>
                    {meeting.summary.executive.strategicPriorities && meeting.summary.executive.strategicPriorities.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Strategic Priorities</h3>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed marker:text-gray-300">
                          {meeting.summary.executive.strategicPriorities.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    )}
                    {meeting.summary.executive.risks && meeting.summary.executive.risks.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Risks</h3>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed marker:text-gray-300">
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
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Customer Needs</h3>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed marker:text-gray-300">
                          {meeting.summary.sales.customerNeeds.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    )}
                    {meeting.summary.sales.painPoints && meeting.summary.sales.painPoints.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Pain Points</h3>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed marker:text-gray-300">
                          {meeting.summary.sales.painPoints.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    )}
                    {meeting.summary.sales.objections && meeting.summary.sales.objections.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Objections</h3>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed marker:text-gray-300">
                          {meeting.summary.sales.objections.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    )}
                    {meeting.summary.sales.buyingSignals && meeting.summary.sales.buyingSignals.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Buying Signals</h3>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed marker:text-gray-300">
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
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Candidate Strengths</h3>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed marker:text-gray-300">
                          {meeting.summary.interview.candidateStrengths.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    )}
                    {meeting.summary.interview.concerns && meeting.summary.interview.concerns.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Concerns</h3>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed marker:text-gray-300">
                          {meeting.summary.interview.concerns.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    )}
                    {meeting.summary.interview.technicalDiscussion && meeting.summary.interview.technicalDiscussion.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Technical Discussion</h3>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed marker:text-gray-300">
                          {meeting.summary.interview.technicalDiscussion.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    )}
                    {meeting.summary.interview.recommendation && (
                      <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Recommendation</h3>
                        <p className="text-sm text-gray-700 leading-relaxed">{meeting.summary.interview.recommendation}</p>
                      </div>
                    )}
                  </>
                )}

                {/* Standard template / Fallback */}
                {(!meeting.template || meeting.template === 'Standard') && meeting.summary.keyPoints && meeting.summary.keyPoints.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Key Points</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed marker:text-gray-300">
                      {meeting.summary.keyPoints.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                )}

                {meeting.summary.decisions && meeting.summary.decisions.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Decisions</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed marker:text-gray-300">
                      {meeting.summary.decisions.map((decision, i) => <li key={i}>{decision}</li>)}
                    </ul>
                  </div>
                )}

                {meeting.actionItems && meeting.actionItems.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Action Items</h3>
                    <ul className="space-y-3">
                      {meeting.actionItems.map(item => (
                        <li key={item._id} className="flex items-start text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div className={`h-4 w-4 rounded border mt-0.5 mr-3 flex-shrink-0 flex items-center justify-center ${item.completed ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}>
                            {item.completed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          <div className="flex-1">
                            <span className={`font-medium ${item.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{item.text}</span>
                            {item.assignee && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 ml-2">
                                {item.assignee}
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
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Highlights</h3>
                    <ul className="space-y-3">
                      {meeting.highlights.map(highlight => (
                        <li key={highlight._id} className="text-sm bg-yellow-50 p-4 rounded-xl border border-yellow-100/60">
                          <button 
                            onClick={() => handleSeek(highlight.startTime)}
                            className="text-yellow-700 hover:text-yellow-900 font-bold font-mono text-xs hover:underline cursor-pointer mb-2 inline-block"
                          >
                            {formatTime(highlight.startTime)}
                          </button>
                          <p className="text-gray-800 font-medium leading-relaxed">"{highlight.text}"</p>
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
