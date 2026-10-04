import { useState } from 'react';
import { CheckCircle2, AlertTriangle, Circle, XCircle, ExternalLink, Copy, Check } from 'lucide-react';
import type { Meeting } from '../types/meeting';

interface MeetingIntentPanelProps {
  intents: NonNullable<Meeting['intents']>;
  currentTime: number;
  duration: number;
  isCompleted?: boolean;
  onSeek: (time: number) => void;
}

export default function MeetingIntentPanel({ intents, currentTime, isCompleted, onSeek }: Omit<MeetingIntentPanelProps, 'duration'>) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [followUpDraft, setFollowUpDraft] = useState<string | null>(null);
  const [createdFollowUps, setCreatedFollowUps] = useState<Set<string>>(new Set());

  if (!intents || intents.length === 0) return null;

  // Compute derived state based on simulated time
  const computedIntents = intents.map(intent => {
    if (isCompleted) {
      return {
        ...intent,
        computedStatus: intent.status,
        isAfterMeeting: true
      };
    }
    
    const hasEvidence = intent.evidenceTimestamp !== undefined && intent.evidenceTimestamp !== null;
    
    let computedStatus = 'pending';
    
    if (hasEvidence) {
      if (currentTime >= intent.evidenceTimestamp!) {
        computedStatus = intent.outcomeStatus || intent.status; // reveal the outcome
      }
    }

    return { ...intent, computedStatus, isAfterMeeting: false };
  });

  const addressedCount = computedIntents.filter(i => i.computedStatus === 'covered' || i.computedStatus === 'partial').length;
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateFollowUp = (intent: any) => {
    setFollowUpDraft(intent._id);
  };

  const handleCreateFollowUpSubmit = (intentId: string) => {
    setCreatedFollowUps(prev => new Set(prev).add(intentId));
    setFollowUpDraft(null);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mb-8 pb-8 border-b border-8x-border/40 mt-1">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-8x-ink mb-1">
          {isCompleted ? 'Meeting Outcome' : 'Meeting Priorities'}
        </h2>
        {isCompleted ? (
          <p className="text-sm text-8x-muted">
            {intents.length === 1 ? '1 priority' : `${intents.length} priorities`} &middot; {addressedCount} addressed
          </p>
        ) : (
          <p className="text-sm text-8x-muted">
            Tracking {intents.length === 1 ? '1 priority' : `${intents.length} priorities`}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {computedIntents.map(intent => (
          <div key={intent._id} className="flex items-start space-x-3">
            <div className="mt-0.5">
              {intent.computedStatus === 'covered' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
              {intent.computedStatus === 'partial' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
              {intent.computedStatus === 'missed' && <XCircle className="w-5 h-5 text-8x-coral" />}
              {intent.computedStatus === 'pending' && <Circle className="w-5 h-5 text-8x-border" />}
            </div>
            
            <div className="flex-1">
              <h4 className={`text-base font-bold mb-1 ${intent.computedStatus === 'pending' ? 'text-8x-muted' : 'text-8x-ink'}`}>
                {intent.text}
              </h4>
              
              {intent.computedStatus === 'pending' && (
                <p className="text-sm text-8x-muted">Not yet discussed</p>
              )}

              {intent.computedStatus === 'covered' && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-8x-muted font-medium">Discussed and clarified</p>
                  {intent.evidenceQuote && (
                    <div className="bg-8x-surface/40 p-3 rounded-lg border border-8x-border/40">
                      <p className="text-sm italic text-8x-ink/80 mb-2">"{intent.evidenceQuote}"</p>
                      <div className="flex items-center text-xs font-bold text-8x-muted">
                        <span className="text-8x-coral tabular-nums">{formatTime(intent.evidenceTimestamp!)}</span>
                        <span className="mx-2 font-normal text-8x-border/80">•</span>
                        <span>{intent.evidenceSpeaker}</span>
                        <button 
                          onClick={() => onSeek(intent.evidenceTimestamp!)}
                          className="ml-auto flex items-center text-8x-ink hover:text-8x-coral transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Open evidence
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {intent.computedStatus === 'partial' && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-8x-muted font-medium">Mentioned briefly, no conclusion</p>
                  {intent.evidenceQuote && (
                    <div className="bg-8x-surface/40 p-3 rounded-lg border border-8x-border/40">
                      <p className="text-sm italic text-8x-ink/80 mb-2">"{intent.evidenceQuote}"</p>
                      <div className="flex items-center text-xs font-bold text-8x-muted">
                        <span className="text-8x-coral tabular-nums">{formatTime(intent.evidenceTimestamp!)}</span>
                        <span className="mx-2 font-normal text-8x-border/80">•</span>
                        <span>{intent.evidenceSpeaker}</span>
                        <button 
                          onClick={() => onSeek(intent.evidenceTimestamp!)}
                          className="ml-auto flex items-center text-8x-ink hover:text-8x-coral transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Open evidence
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {intent.computedStatus === 'missed' && (
                <div className="mt-2">
                  <p className="text-sm text-8x-muted font-medium mb-3">Not discussed</p>
                  
                  {intent.isAfterMeeting ? (
                    createdFollowUps.has(intent._id) ? (
                      <div className="bg-8x-surface/40 p-3 rounded-lg border border-8x-border/40 flex items-center">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        <span className="text-sm font-bold text-8x-ink">Follow-up created</span>
                      </div>
                    ) : followUpDraft === intent._id ? (
                      <div className="bg-8x-surface/50 border border-8x-border p-4 rounded-xl">
                        <h5 className="text-xs font-bold uppercase tracking-widest text-8x-muted mb-3">Follow-Up Draft</h5>
                        <div className="space-y-2 mb-4">
                          <p className="text-sm"><span className="font-bold text-8x-ink">Topic:</span> {intent.text}</p>
                          <p className="text-sm"><span className="font-bold text-8x-ink">Context:</span> This was a priority for the previous meeting but was not addressed.</p>
                          <p className="text-sm"><span className="font-bold text-8x-ink">Suggested agenda:</span> {intent.suggestedQuestion || `Confirm ${intent.text.toLowerCase()} and next steps.`}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button onClick={() => handleCreateFollowUpSubmit(intent._id)} className="px-3 py-1.5 text-xs font-bold bg-8x-btn-primary text-8x-btn-primary-fg rounded-md">Create follow-up</button>
                          <button onClick={() => setFollowUpDraft(null)} className="px-3 py-1.5 text-xs font-bold text-8x-muted hover:text-8x-ink transition-colors">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleCreateFollowUp(intent)}
                        className="px-3 py-1.5 text-xs font-bold border border-8x-border text-8x-ink hover:border-8x-ink transition-colors rounded-lg bg-8x-navbar shadow-sm"
                      >
                        Create follow-up
                      </button>
                    )
                  ) : (
                    <>
                      <button 
                        onClick={() => setActiveModal(intent._id)}
                        className="px-3 py-1.5 text-xs font-bold border border-8x-border text-8x-ink hover:border-8x-ink transition-colors rounded-lg bg-8x-navbar shadow-sm"
                      >
                        Bring this up
                      </button>

                      {activeModal === intent._id && (
                        <div className="mt-3 bg-8x-navbar border border-8x-border p-4 rounded-xl shadow-lg relative animate-fade-in z-10">
                          <h5 className="text-xs font-bold uppercase tracking-widest text-8x-muted mb-2">Bring this up</h5>
                          <p className="text-sm text-8x-ink mb-3">You haven't covered: <span className="font-bold">{intent.text}</span></p>
                          
                          <div className="bg-8x-surface/50 p-3 rounded-lg mb-4">
                            <span className="text-xs font-bold text-8x-muted block mb-1">Suggested question:</span>
                            <p className="text-sm italic text-8x-ink font-medium">
                              "{intent.suggestedQuestion || `Before we wrap, can we make sure we cover: ${intent.text}?`}"
                            </p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleCopy(intent.suggestedQuestion || `Before we wrap, can we make sure we cover: ${intent.text}?`)}
                              className="px-3 py-1.5 text-xs font-bold bg-8x-btn-primary text-8x-btn-primary-fg rounded-md flex items-center"
                            >
                              {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                              Copy question
                            </button>
                            <button 
                              onClick={() => setActiveModal(null)}
                              className="px-3 py-1.5 text-xs font-bold text-8x-muted hover:text-8x-ink transition-colors"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
