import { useState } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import type { Meeting } from '../types/meeting';

interface MeetingIntentSetupProps {
  meetingId: string;
  initialIntents: NonNullable<Meeting['intents']>;
  onSave: (intents: NonNullable<Meeting['intents']>) => Promise<void>;
  onCancel: () => void;
}

export default function MeetingIntentSetup({ initialIntents, onSave, onCancel }: MeetingIntentSetupProps) {
  const [intents, setIntents] = useState(initialIntents.length > 0 ? initialIntents : [{ _id: 'new-1', text: '', status: 'pending' as const }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    if (intents.length < 5) {
      setIntents([...intents, { _id: `new-${Date.now()}`, text: '', status: 'pending' as const }]);
    }
  };

  const handleRemove = (id: string) => {
    setIntents(intents.filter(i => i._id !== id));
  };

  const handleChange = (id: string, text: string) => {
    setIntents(intents.map(i => i._id === id ? { ...i, text } : i));
  };

  const handleSave = async () => {
    const validIntents = intents.filter(i => i.text.trim().length > 0);
    setSaving(true);
    setError(null);
    try {
      await onSave(validIntents);
    } catch (err) {
      setError('Failed to save priorities. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-8x-surface/50 border border-8x-border/80 p-6 rounded-2xl mb-8">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-8x-ink/60 uppercase tracking-[0.15em] mb-2">Meeting Intent</h3>
        <h2 className="text-xl font-bold text-8x-ink mb-1">What do you need to accomplish?</h2>
        <p className="text-sm text-8x-muted">Define up to 5 priorities for this meeting. Focus on outcomes, not topics.</p>
        
        {error && (
          <div className="mt-3 p-2 bg-red-50 border border-red-100 rounded-md text-red-600 text-xs font-bold flex items-center">
            {error}
          </div>
        )}
      </div>

      <div className="space-y-3 mb-6">
        {intents.map((intent) => (
          <div key={intent._id} className="flex items-center space-x-3">
            <div className="flex-1 bg-8x-navbar border border-8x-border/80 rounded-lg overflow-hidden flex items-center px-4 py-2.5 focus-within:border-8x-ink focus-within:ring-1 focus-within:ring-8x-ink transition-all">
              <input
                type="text"
                value={intent.text}
                onChange={(e) => handleChange(intent._id, e.target.value)}
                placeholder="e.g. Confirm the renewal timeline"
                className="w-full bg-transparent border-none p-0 text-sm font-medium focus:ring-0 text-8x-ink placeholder-8x-muted/50"
              />
            </div>
            <button
              onClick={() => handleRemove(intent._id)}
              className="p-2 -mr-2 text-8x-muted hover:text-8x-coral hover:bg-8x-surface rounded-md transition-colors flex-shrink-0"
              title="Remove priority"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}

        {intents.length < 5 && (
          <button
            onClick={handleAdd}
            className="flex items-center justify-center w-full py-2.5 mt-2 text-sm font-bold text-8x-muted hover:text-8x-ink border border-dashed border-8x-border hover:border-8x-ink transition-colors rounded-lg bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add another priority
          </button>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-8x-border/40">
        <button
          onClick={onCancel}
          disabled={saving}
          className="px-4 py-2 text-sm font-bold text-8x-muted hover:text-8x-ink bg-transparent transition-colors rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 text-sm font-bold bg-8x-btn-primary text-8x-btn-primary-fg hover:bg-8x-btn-primary-hover rounded-lg transition-colors flex items-center"
        >
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save priorities
        </button>
      </div>
    </div>
  );
}
