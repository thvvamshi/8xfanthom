import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import type { Meeting } from '../types/meeting';
import { ArrowLeft, Play, Pause, Loader2, AlertCircle, Users, Clock, Calendar, VideoOff, Highlighter } from 'lucide-react';
import { updateActionItem, createHighlight } from '../lib/api';

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

  // Determine active index
  const activeIndex = meeting ? meeting.transcript.findIndex((entry, index) => {
    const isLast = index === meeting.transcript.length - 1;
    const nextTime = isLast ? meeting.duration : meeting.transcript[index + 1].startTime;
    return currentTime >= entry.startTime && currentTime < nextTime;
  }) : -1;

  // Scroll active transcript into view ONLY when activeIndex changes
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
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Strategic Priorities</h3>
            {sum.executive?.strategicPriorities && sum.executive.strategicPriorities.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {sum.executive.strategicPriorities.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : <p className="text-gray-500 text-sm italic">No strategic priorities captured.</p>}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Risks</h3>
            {sum.executive?.risks && sum.executive.risks.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {sum.executive.risks.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : <p className="text-gray-500 text-sm italic">No risks captured.</p>}
          </div>
        </>
      );
    }
    
    if (selectedTemplate === 'Sales Discovery') {
      return (
        <>
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Customer Needs</h3>
            {sum.sales?.customerNeeds && sum.sales.customerNeeds.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {sum.sales.customerNeeds.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : <p className="text-gray-500 text-sm italic">No customer needs captured.</p>}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Pain Points</h3>
            {sum.sales?.painPoints && sum.sales.painPoints.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {sum.sales.painPoints.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : <p className="text-gray-500 text-sm italic">No pain points captured.</p>}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Objections</h3>
            {sum.sales?.objections && sum.sales.objections.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {sum.sales.objections.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : <p className="text-gray-500 text-sm italic">No objections captured.</p>}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Buying Signals</h3>
            {sum.sales?.buyingSignals && sum.sales.buyingSignals.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {sum.sales.buyingSignals.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : <p className="text-gray-500 text-sm italic">No buying signals captured.</p>}
          </div>
        </>
      );
    }
    
    if (selectedTemplate === 'Candidate Interview') {
      return (
        <>
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Candidate Strengths</h3>
            {sum.interview?.candidateStrengths && sum.interview.candidateStrengths.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {sum.interview.candidateStrengths.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : <p className="text-gray-500 text-sm italic">No strengths captured.</p>}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Concerns</h3>
            {sum.interview?.concerns && sum.interview.concerns.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {sum.interview.concerns.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : <p className="text-gray-500 text-sm italic">No concerns captured.</p>}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Technical Discussion</h3>
            {sum.interview?.technicalDiscussion && sum.interview.technicalDiscussion.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {sum.interview.technicalDiscussion.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : <p className="text-gray-500 text-sm italic">No technical discussion captured.</p>}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Recommendation</h3>
            {sum.interview?.recommendation ? (
              <p className="text-sm text-gray-700">{sum.interview.recommendation}</p>
            ) : <p className="text-gray-500 text-sm italic">No recommendation captured.</p>}
          </div>
        </>
      );
    }
    
    // Standard template
    return (
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Key Points</h3>
        {sum.keyPoints && sum.keyPoints.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            {sum.keyPoints.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        ) : <p className="text-gray-500 text-sm italic">No key points captured.</p>}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="h-10 w-10 text-gray-400 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading workspace...</p>
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-400 shadow-sm">
            <VideoOff size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Meeting not found</h2>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed max-w-sm mx-auto">
            We couldn't find this meeting. It may have been removed or the link may be incorrect.
          </p>
          <Link 
            to="/meetings" 
            className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-xl text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors shadow-sm w-full"
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
        <Link to="/meetings" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 font-medium text-sm transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to meetings
        </Link>
        <div className="flex items-start space-x-3 bg-red-50 p-6 rounded-xl border border-red-100 shadow-sm">
          <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-semibold text-lg">Server Error</h3>
            <p className="text-red-700 mt-1 text-sm">{error || 'Something went wrong.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link to="/meetings" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium text-sm">
          <ArrowLeft size={16} className="mr-1.5" />
          Back to meetings
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{meeting.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {meeting.meetingType}
          </span>
          <div className="flex items-center">
            <Calendar size={16} className="mr-1.5 text-gray-400" />
            {formatDate(meeting.date)}
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-1.5 text-gray-400" />
            {Math.floor(meeting.duration / 60)} min
          </div>
          <div className="flex items-center">
            <Users size={16} className="mr-1.5 text-gray-400" />
            {meeting.participants?.length || 0} participants
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Player & Transcript */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Mock Player */}
          <div className="bg-gray-900 text-white p-6 rounded-xl shadow-sm border border-gray-800">
            <div className="aspect-video bg-black/50 rounded-lg mb-4 flex items-center justify-center border border-gray-700">
              <span className="text-gray-400 font-medium">Recording View</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-500 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                {isPlaying ? <Pause size={20} className="text-white fill-current" /> : <Play size={20} className="text-white fill-current ml-1" />}
              </button>
              
              <span className="text-sm font-medium w-12 text-center">{formatTime(currentTime)}</span>
              
              <input 
                type="range" 
                min="0" 
                max={meeting.duration} 
                value={currentTime}
                onChange={handleSeekbarChange}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              
              <span className="text-sm font-medium w-12 text-center text-gray-400">{formatTime(meeting.duration)}</span>
            </div>
          </div>

          {/* Transcript Viewer */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" ref={transcriptContainerRef}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Transcript</h3>
            <div className="space-y-2">
              {meeting.transcript?.map((entry, index) => {
                const isActive = index === activeIndex;

                return (
                  <div 
                    key={index} 
                    ref={isActive ? activeTranscriptRef : null}
                    className={`flex space-x-4 p-3 rounded-lg transition-colors ${
                      isActive ? 'bg-blue-50/80 border border-blue-100' : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <button 
                      onClick={() => handleSeek(entry.startTime)}
                      className={`text-sm font-medium min-w-[3rem] text-left hover:underline ${
                        isActive ? 'text-blue-600' : 'text-blue-500 hover:text-blue-700'
                      }`}
                    >
                      {formatTime(entry.startTime)}
                    </button>
                    <div className="flex-1">
                      <div className={`text-sm font-bold mb-1 flex justify-between ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                        <span>{entry.speaker}</span>
                        <button 
                          onClick={() => handleHighlight(entry)}
                          className={`text-gray-400 hover:text-yellow-500 transition-colors ${meeting.highlights?.some(h => h.startTime === entry.startTime && h.text === entry.text) ? 'text-yellow-500' : ''}`}
                          title="Highlight this moment"
                        >
                          <Highlighter size={16} />
                        </button>
                      </div>
                      <p className={`text-base leading-relaxed ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                        {entry.text}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {(!meeting.transcript || meeting.transcript.length === 0) && (
                <div className="text-center py-10 text-gray-500 italic">
                  No transcript available for this meeting.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col sticky top-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">AI Summary</h2>
            <div className="flex flex-col items-end">
              <select
                id="template-select"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="block w-40 rounded-md border-gray-200 text-sm focus:border-gray-900 focus:ring-gray-900 py-1.5 pl-3 pr-8 shadow-sm cursor-pointer"
              >
                <option value="Standard">Standard</option>
                <option value="Executive">Executive</option>
                <option value="Sales Discovery">Sales Discovery</option>
                <option value="Candidate Interview">Candidate Interview</option>
              </select>
            </div>
          </div>

          {!meeting.summary ? (
            <div className="py-12 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 text-sm font-medium">No summary available.</p>
            </div>
          ) : (
            <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-12rem)] pr-2">
              {/* Overview */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Overview</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{meeting.summary.overview || <span className="text-gray-400 italic">No overview provided.</span>}</p>
              </div>

              {/* Template-specific content */}
              {renderTemplateSpecificContent()}

              {/* Decisions */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Decisions</h3>
                {meeting.summary.decisions && meeting.summary.decisions.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {meeting.summary.decisions.map((decision, i) => (
                      <li key={i}>{decision}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm italic">No decisions captured.</p>
                )}
              </div>

              {/* Action Items */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Action Items</h3>
                {meeting.actionItems && meeting.actionItems.length > 0 ? (
                  <ul className="space-y-3">
                    {meeting.actionItems.map(item => (
                      <li key={item._id} className="flex items-start text-sm">
                        <button 
                          onClick={() => handleActionItemToggle(item._id, item.completed)}
                          className={`h-4 w-4 rounded border mt-0.5 mr-2.5 flex-shrink-0 flex items-center justify-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-900 ${item.completed ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-300 hover:border-gray-400'}`}
                        >
                          {item.completed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </button>
                        <div className="flex-1">
                          <span className={`font-medium ${item.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{item.text}</span>
                          {item.assignee && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 ml-2 border border-gray-200">
                              @{item.assignee}
                            </span>
                          )}
                          {item.dueDate && (
                            <span className="inline-flex items-center text-[10px] text-gray-500 ml-2 border-l border-gray-200 pl-2">
                              Due: {new Date(item.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm italic">No action items captured.</p>
                )}
              </div>

              {/* Highlights */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Highlights</h3>
                {meeting.highlights && meeting.highlights.length > 0 ? (
                  <ul className="space-y-4">
                    {meeting.highlights.map(highlight => (
                      <li key={highlight._id} className="text-sm bg-yellow-50/50 p-3 rounded-lg border border-yellow-100/50">
                        <div className="flex items-center space-x-2 mb-1.5">
                          <button 
                            onClick={() => handleSeek(highlight.startTime)}
                            className="text-yellow-600 hover:text-yellow-800 font-medium font-mono text-xs hover:underline cursor-pointer"
                          >
                            {formatTime(highlight.startTime)}
                          </button>
                        </div>
                        <p className="text-gray-800 italic leading-relaxed">"{highlight.text}"</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm italic">No highlights captured.</p>
                )}
              </div>

              {/* Topics */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Topics</h3>
                {meeting.summary.topics && meeting.summary.topics.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {meeting.summary.topics.map((topic, i) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700 shadow-sm">
                        {topic}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic">No topics captured.</p>
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
