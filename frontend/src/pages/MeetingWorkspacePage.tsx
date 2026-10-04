import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import type { Meeting } from '../types/meeting';
import { ArrowLeft, Play, Pause, Loader2, AlertCircle, VideoOff, Highlighter } from 'lucide-react';
import { updateActionItem, createHighlight, updateIntents, updateMeetingCompletion } from '../lib/api';
import MeetingIntentSetup from '../components/MeetingIntentSetup';
import MeetingIntentPanel from '../components/MeetingIntentPanel';
import TemplateSelector from '../components/TemplateSelector';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const MeetingWorkspacePage = () => {
  const { id } = useParams<{ id: string }>();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('Standard');
  
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [scrollTrigger, setScrollTrigger] = useState(0);
  const [isEditingIntents, setIsEditingIntents] = useState(false);
  
  // Refs for scrolling
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const activeTranscriptRef = useRef<HTMLDivElement>(null);

  const [searchParams] = useSearchParams();
  const initialTimeParam = searchParams.get('t');

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        setIsLoading(true);
        setError(null);
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
        setSelectedTemplate(data.template || 'Standard');
        
        // Handle ?t= parameter for deep linking
        if (initialTimeParam && !isNaN(Number(initialTimeParam))) {
          setCurrentTime(Number(initialTimeParam));
        } else {
          setCurrentTime(0);
        }
        setIsPlaying(false);
      } catch (err) {
        setError('An unexpected error occurred while loading this meeting.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeeting();
  }, [id, initialTimeParam]);

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

  // Persist meeting completion state
  useEffect(() => {
    if (!meeting || meeting.completed) return;
    
    // For a 60m meeting, duration - 300 is 55:00. For shorter meetings, fallback to 90%
    const completionThreshold = Math.max(meeting.duration * 0.9, meeting.duration - 300);
    
    if (currentTime >= completionThreshold) {
      // Optimistically update local state so UI locks in completion instantly
      setMeeting(prev => prev ? { ...prev, completed: true } : null);

      // Persist to backend
      updateMeetingCompletion(meeting._id, true)
        .catch(err => {
          console.error('Failed to persist meeting completion', err);
          // Revert on failure
          setMeeting(prev => prev ? { ...prev, completed: false } : null);
        });
    }
  }, [currentTime, meeting]);


  // Determine active index
  const activeIndex = meeting ? meeting.transcript.findIndex((entry, index) => {
    const isLast = index === meeting.transcript.length - 1;
    const nextTime = isLast ? meeting.duration : meeting.transcript[index + 1].startTime;
    return currentTime >= entry.startTime && currentTime < nextTime;
  }) : -1;

  // Scroll active transcript into view when activeIndex changes or when explicitly triggered
  useEffect(() => {
    if (activeTranscriptRef.current && transcriptContainerRef.current) {
      activeTranscriptRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeIndex, scrollTrigger]);

  const handleSaveIntents = async (newIntents: any[]) => {
    if (!meeting) return;
    try {
      const savedIntents = await updateIntents(meeting._id, newIntents);
      setMeeting({ ...meeting, intents: savedIntents });
      setIsEditingIntents(false);
    } catch (err) {
      console.error('Failed to save intents', err);
      throw err;
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    setScrollTrigger(prev => prev + 1);
  };

  const handleSeekbarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(Number(e.target.value));
  };

  const handleActionItemToggle = async (actionItemId: string, currentCompleted: boolean) => {
    if (!meeting || !id) return;
    
    // Optimistic update
    setMeeting(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        actionItems: prev.actionItems.map(item => 
          item._id === actionItemId ? { ...item, completed: !currentCompleted } : item
        )
      };
    });

    try {
      await updateActionItem(id, actionItemId, !currentCompleted);
    } catch (err) {
      console.error('Failed to update action item', err);
      // Revert on failure
      setMeeting(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          actionItems: prev.actionItems.map(item => 
            item._id === actionItemId ? { ...item, completed: currentCompleted } : item
          )
        };
      });
    }
  };

  const handleHighlight = async (entry: any) => {
    if (!meeting || !id) return;

    try {
      const newHighlight = await createHighlight(id, {
        startTime: entry.startTime,
        endTime: entry.endTime,
        text: entry.text
      });

      setMeeting(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          highlights: [...(prev.highlights || []), newHighlight]
        };
      });
    } catch (err) {
      console.error('Failed to create highlight', err);
    }
  };

  const renderTemplateSpecificContent = () => {
    const sum = meeting?.summary;
    if (!sum) return null;

    if (selectedTemplate === 'Executive') {
      return (
        <>
          <div>
            <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Strategic Priorities</h3>
            {sum.executive?.strategicPriorities && sum.executive.strategicPriorities.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-8x-ink">
                {sum.executive.strategicPriorities.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : <p className="text-8x-muted text-sm italic">No strategic priorities captured.</p>}
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Risks</h3>
            {sum.executive?.risks && sum.executive.risks.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-8x-ink">
                {sum.executive.risks.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : <p className="text-8x-muted text-sm italic">No risks captured.</p>}
          </div>
        </>
      );
    }
    
    if (selectedTemplate === 'Sales Discovery') {
      return (
        <>
          <div>
            <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Customer Needs</h3>
            {sum.sales?.customerNeeds && sum.sales.customerNeeds.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-8x-ink">
                {sum.sales.customerNeeds.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : <p className="text-8x-muted text-sm italic">No customer needs captured.</p>}
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Pain Points</h3>
            {sum.sales?.painPoints && sum.sales.painPoints.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-8x-ink">
                {sum.sales.painPoints.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : <p className="text-8x-muted text-sm italic">No pain points captured.</p>}
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Objections</h3>
            {sum.sales?.objections && sum.sales.objections.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-8x-ink">
                {sum.sales.objections.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : <p className="text-8x-muted text-sm italic">No objections captured.</p>}
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Buying Signals</h3>
            {sum.sales?.buyingSignals && sum.sales.buyingSignals.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-8x-ink">
                {sum.sales.buyingSignals.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : <p className="text-8x-muted text-sm italic">No buying signals captured.</p>}
          </div>
        </>
      );
    }
    
    if (selectedTemplate === 'Candidate Interview') {
      return (
        <>
          <div>
            <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Candidate Strengths</h3>
            {sum.interview?.candidateStrengths && sum.interview.candidateStrengths.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-8x-ink">
                {sum.interview.candidateStrengths.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : <p className="text-8x-muted text-sm italic">No strengths captured.</p>}
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Concerns</h3>
            {sum.interview?.concerns && sum.interview.concerns.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-8x-ink">
                {sum.interview.concerns.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : <p className="text-8x-muted text-sm italic">No concerns captured.</p>}
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Technical Discussion</h3>
            {sum.interview?.technicalDiscussion && sum.interview.technicalDiscussion.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-8x-ink">
                {sum.interview.technicalDiscussion.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : <p className="text-8x-muted text-sm italic">No technical discussion captured.</p>}
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Recommendation</h3>
            {sum.interview?.recommendation ? (
              <p className="text-sm text-8x-ink">{sum.interview.recommendation}</p>
            ) : <p className="text-8x-muted text-sm italic">No recommendation captured.</p>}
          </div>
        </>
      );
    }
    
    // Standard template
    return (
      <div>
        <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Key Points</h3>
        {sum.keyPoints && sum.keyPoints.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-8x-ink">
            {sum.keyPoints.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        ) : <p className="text-8x-muted text-sm italic">No key points captured.</p>}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="h-10 w-10 text-8x-coral animate-spin mb-4" />
        <p className="text-8x-muted font-medium">Loading workspace...</p>
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center p-8">
        <div className="bg-8x-surface rounded-2xl shadow-sm border border-8x-border/60 p-10 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-8x-warm border border-8x-border rounded-2xl flex items-center justify-center mx-auto mb-6 text-8x-muted shadow-sm">
            <VideoOff size={28} />
          </div>
          <h2 className="text-2xl font-bold text-8x-ink mb-3 font-serif">Meeting not found</h2>
          <p className="text-8x-muted mb-8 text-sm leading-relaxed max-w-sm mx-auto">
            We couldn't find this meeting. It may have been removed or the link may be incorrect.
          </p>
          <Link 
            to="/meetings" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-8x-ink hover:bg-8x-navy transition-colors shadow-sm w-full"
          >
            Back to meetings
          </Link>
        </div>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <Link to="/meetings" className="inline-flex items-center text-8x-muted hover:text-8x-ink mb-6 font-medium text-sm transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to meetings
        </Link>
        <div className="flex items-start space-x-3 bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm">
          <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-bold text-lg">Server Error</h3>
            <p className="text-red-700 mt-1 text-sm">{error || 'Something went wrong.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-10 pb-8 border-b border-8x-border/40">
        <div className="flex items-center justify-between mb-8">
          <Link to="/meetings" className="inline-flex items-center text-8x-muted hover:text-8x-ink font-medium text-sm transition-colors">
            <ArrowLeft size={16} className="mr-1.5" />
            Back
          </Link>
          <div className="flex items-center space-x-4">
            <Link 
              to={`/share/${meeting._id}`}
              className="inline-flex items-center px-4 py-2 border border-8x-border text-sm font-semibold rounded-lg text-8x-ink hover:bg-8x-surface transition-colors"
            >
              Share Meeting
            </Link>
          </div>
        </div>
        
        <span className="text-xs font-bold text-8x-ink/60 uppercase tracking-[0.15em] mb-4 block">Meeting</span>
        <h1 className="text-4xl md:text-5xl font-serif text-8x-ink mb-6 tracking-tight leading-[1.05]">{meeting.title}</h1>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-8x-muted font-medium">
          <span>{formatDate(meeting.date)}</span>
          <span className="text-8x-border/80">•</span>
          <span>{meeting.participants?.length || 0} participants</span>
          <span className="text-8x-border/80">•</span>
          <span>{Math.floor(meeting.duration / 60)} min</span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Player & Transcript */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Deep Dark Player */}
          <div className="bg-8x-ink text-white p-6 rounded-2xl shadow-sm border border-[#2A2D26]">
            <div className="aspect-video bg-[#0c0d0a] rounded-xl mb-5 flex items-center justify-center border border-[#2A2D26]">
              <span className="text-8x-muted font-medium tracking-wide">Recording View</span>
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
          <div className="pt-4" ref={transcriptContainerRef}>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-8x-border/40">
              <h2 className="text-xl font-bold text-8x-ink">Transcript</h2>
            </div>
            <div className="space-y-4">
              {meeting.transcript?.map((entry, index) => {
                const isActive = index === activeIndex;

                return (
                  <div 
                    key={index} 
                    ref={isActive ? activeTranscriptRef : null}
                    className={`flex space-x-6 p-4 rounded-xl transition-all ${
                      isActive ? 'bg-8x-surface/50 border border-8x-border/40' : 'hover:bg-8x-surface/30 border border-transparent'
                    }`}
                  >
                    <button 
                      onClick={() => handleSeek(entry.startTime)}
                      className={`text-sm font-semibold min-w-[3.5rem] text-left tabular-nums mt-0.5 ${
                        isActive ? 'text-8x-coral' : 'text-8x-muted hover:text-8x-ink'
                      }`}
                    >
                      {formatTime(entry.startTime)}
                    </button>
                    <div className="flex-1 group">
                      <div className={`text-sm font-bold mb-1.5 flex justify-between items-center ${isActive ? 'text-8x-ink' : 'text-8x-ink/80'}`}>
                        <span>{entry.speaker}</span>
                        <button 
                          onClick={() => handleHighlight(entry)}
                          className={`text-8x-muted opacity-0 group-hover:opacity-100 p-2 -mr-2 rounded-lg hover:bg-8x-surface hover:text-8x-coral transition-all ${meeting.highlights?.some(h => h.startTime === entry.startTime && h.text === entry.text) ? 'opacity-100 text-8x-coral' : ''}`}
                          title="Highlight this moment"
                        >
                          <Highlighter size={16} />
                        </button>
                      </div>
                      <p className={`text-base leading-relaxed ${isActive ? 'text-8x-ink font-medium' : 'text-8x-ink/70'}`}>
                        {entry.text}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {(!meeting.transcript || meeting.transcript.length === 0) && (
                <div className="text-center py-12 text-8x-muted italic">
                  No transcript available for this meeting.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col lg:border-l lg:border-8x-border/40 lg:pl-8">
          
          {isEditingIntents ? (
            <MeetingIntentSetup
              meetingId={meeting._id}
              initialIntents={meeting.intents || []}
              onSave={handleSaveIntents}
              onCancel={() => setIsEditingIntents(false)}
            />
          ) : meeting.intents && meeting.intents.length > 0 ? (
            <div className="relative">
              <button 
                onClick={() => setIsEditingIntents(true)}
                className="absolute top-1 right-0 text-xs font-bold text-8x-muted hover:text-8x-ink transition-colors z-10"
              >
                Edit
              </button>
              <MeetingIntentPanel
                intents={meeting.intents}
                currentTime={currentTime}
                duration={meeting.duration}
                isCompleted={meeting.completed}
                onSeek={handleSeek}
              />
            </div>
          ) : (
            <div className="mb-8 pb-4 border-b border-8x-border/40 flex justify-end">
              <button 
                onClick={() => setIsEditingIntents(true)}
                className="text-xs font-bold text-8x-muted hover:text-8x-ink transition-colors"
              >
                + Add meeting priorities
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mb-8 pb-4 border-b border-8x-border/40">
            <h2 className="text-xl font-bold text-8x-ink">AI Summary</h2>
            <div className="flex flex-col items-end">
              <TemplateSelector
                value={selectedTemplate}
                onChange={setSelectedTemplate}
                options={['Standard', 'Executive', 'Sales Discovery', 'Candidate Interview']}
              />
            </div>
          </div>

          {!meeting.summary ? (
            <div className="py-16 flex items-center justify-center border-t border-8x-border/40">
              <p className="text-8x-muted text-sm font-bold">No summary available.</p>
            </div>
          ) : (
            <div className="space-y-8 pr-2">
              {/* Overview */}
              <div>
                <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Overview</h3>
                <p className="text-8x-ink text-sm leading-relaxed">{meeting.summary.overview || <span className="text-8x-muted italic">No overview provided.</span>}</p>
              </div>

              {/* Template-specific content */}
              {renderTemplateSpecificContent()}

              {/* Decisions */}
              <div>
                <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Decisions</h3>
                {meeting.summary.decisions && meeting.summary.decisions.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-8x-ink">
                    {meeting.summary.decisions.map((decision, i) => (
                      <li key={i}>{decision}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-8x-muted text-sm italic">No decisions captured.</p>
                )}
              </div>

              {/* Action Items */}
              <div>
                <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-4">Action Items</h3>
                {meeting.actionItems && meeting.actionItems.length > 0 ? (
                  <ul className="space-y-4">
                    {meeting.actionItems.map(item => (
                      <li key={item._id} className="flex items-start text-sm group">
                        <button 
                          onClick={() => handleActionItemToggle(item._id, item.completed)}
                          className={`h-5 w-5 rounded-md border mt-0.5 mr-4 flex-shrink-0 flex items-center justify-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-8x-coral ${item.completed ? 'bg-8x-coral border-8x-coral' : 'bg-8x-surface border-8x-border group-hover:border-8x-coral/50'}`}
                        >
                          {item.completed && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </button>
                        <div className="flex-1">
                          <span className={`font-medium ${item.completed ? 'text-8x-muted line-through' : 'text-8x-ink'}`}>{item.text}</span>
                          {item.assignee && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-8x-surface text-8x-ink ml-2 border border-8x-border/60">
                              @{item.assignee}
                            </span>
                          )}
                          {item.dueDate && (
                            <span className="inline-flex items-center text-[10px] font-medium text-8x-muted ml-2">
                              Due {new Date(item.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-8x-muted text-sm italic">No action items captured.</p>
                )}
              </div>

              {/* Highlights */}
              <div>
                <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-4">Highlights</h3>
                {meeting.highlights && meeting.highlights.length > 0 ? (
                  <ul className="space-y-6">
                    {meeting.highlights.map(highlight => (
                      <li key={highlight._id} className="text-sm pl-4 border-l-2 border-8x-coral">
                        <div className="flex items-center space-x-2 mb-2">
                          <button 
                            onClick={() => handleSeek(highlight.startTime)}
                            className="text-8x-coral hover:text-[#D94F32] font-bold font-mono text-xs hover:underline cursor-pointer transition-colors"
                          >
                            {formatTime(highlight.startTime)}
                          </button>
                        </div>
                        <p className="text-8x-ink italic leading-relaxed font-serif text-lg">"{highlight.text}"</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-8x-muted text-sm italic">No highlights captured.</p>
                )}
              </div>

              {/* Topics */}
              <div>
                <h3 className="text-[10px] font-bold text-8x-muted uppercase tracking-widest mb-3">Topics</h3>
                {meeting.summary.topics && meeting.summary.topics.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {meeting.summary.topics.map((topic, i) => (
                      <span key={i} className="inline-flex items-center px-3 py-1 rounded-full bg-8x-surface border border-8x-border/60 text-xs font-bold text-8x-ink shadow-sm tracking-wide">
                        {topic}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-8x-muted text-sm italic">No topics captured.</p>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MeetingWorkspacePage;
