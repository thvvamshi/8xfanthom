const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

export const getMeetings = async () => {
  const res = await fetch(`${API_URL}/meetings`);
  if (!res.ok) throw new Error('Failed to fetch meetings');
  return res.json();
};

export const getMeeting = async (id: string) => {
  const res = await fetch(`${API_URL}/meetings/${id}`);
  if (!res.ok) throw new Error('Failed to fetch meeting');
  return res.json();
};

export const updateActionItem = async (meetingId: string, actionItemId: string, completed: boolean) => {
  const res = await fetch(`${API_URL}/meetings/${meetingId}/action-items/${actionItemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  if (!res.ok) throw new Error('Failed to update action item');
  return res.json();
};

export const createHighlight = async (meetingId: string, highlightData: { startTime: number, endTime: number, text: string }) => {
  const res = await fetch(`${API_URL}/meetings/${meetingId}/highlights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(highlightData)
  });
  if (!res.ok) throw new Error('Failed to create highlight');
  return res.json();
};

export const updateIntents = async (meetingId: string, intents: any[]) => {
  const res = await fetch(`${API_URL}/meetings/${meetingId}/intents`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ intents })
  });
  if (!res.ok) throw new Error('Failed to update intents');
  return res.json();
};

export const searchMeetings = async (query: string) => {
  const res = await fetch(`${API_URL}/meetings/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search meetings');
  return res.json();
};

export const updateMeetingCompletion = async (meetingId: string, completed: boolean) => {
  const res = await fetch(`${API_URL}/meetings/${meetingId}/completion`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  if (!res.ok) throw new Error('Failed to update meeting completion');
  return res.json();
};
