import Meeting from '../models/Meeting';

export const getMeetings = async () => {
  return await Meeting.find().sort({ date: -1 });
};

export const getMeetingById = async (id: string) => {
  return await Meeting.findById(id);
};

export const updateActionItem = async (meetingId: string, actionItemId: string, completed: boolean) => {
  return await Meeting.findOneAndUpdate(
    { _id: meetingId, 'actionItems._id': actionItemId },
    { $set: { 'actionItems.$.completed': completed } },
    { new: true }
  );
};

export const createHighlight = async (meetingId: string, startTime: number, endTime: number, text: string) => {
  return await Meeting.findByIdAndUpdate(
    meetingId,
    { $push: { highlights: { startTime, endTime, text } } },
    { new: true }
  );
};

export const updateIntents = async (meetingId: string, intents: any[]) => {
  return await Meeting.findByIdAndUpdate(
    meetingId,
    { $set: { intents } },
    { new: true }
  );
};

export const searchMeetings = async (query: string) => {
  const regex = new RegExp(query, 'i');
  
  const meetings = await Meeting.find({
    $or: [
      { title: regex },
      { 'participants.name': regex },
      { 'transcript.text': regex },
      { 'transcript.speaker': regex },
    ]
  }).sort({ date: -1 });

  const results: any[] = [];

  for (const meeting of meetings) {
    let titleMatched = regex.test(meeting.title);
    if (!titleMatched) {
      for (const p of meeting.participants) {
        if (regex.test(p.name)) {
          titleMatched = true;
          break;
        }
      }
    }

    if (titleMatched) {
      results.push({
        meetingId: meeting._id.toString(),
        title: meeting.title,
        matchType: 'title',
        snippet: 'Meeting title or metadata match',
        speaker: null,
        timestamp: null,
      });
    }

    for (const segment of meeting.transcript) {
      if (regex.test(segment.text) || regex.test(segment.speaker)) {
        let snippet = segment.text;
        if (snippet.length > 100) {
          const matchIndex = snippet.toLowerCase().indexOf(query.toLowerCase());
          if (matchIndex > -1) {
            const start = Math.max(0, matchIndex - 40);
            const end = Math.min(snippet.length, matchIndex + query.length + 40);
            snippet = (start > 0 ? '...' : '') + snippet.substring(start, end) + (end < snippet.length ? '...' : '');
          }
        }

        results.push({
          meetingId: meeting._id.toString(),
          title: meeting.title,
          matchType: 'transcript',
          snippet,
          speaker: segment.speaker,
          timestamp: segment.startTime,
        });
      }
    }
  }

  return results;
};

export const updateCompletion = async (id: string, completed: boolean) => {
  const meeting = await Meeting.findByIdAndUpdate(
    id,
    { completed },
    { new: true }
  );
  if (!meeting) throw new Error('Meeting not found');
  return meeting;
};

export const resetIntents = async (id: string) => {
  const meeting = await Meeting.findById(id);
  if (!meeting) throw new Error('Meeting not found');

  meeting.completed = false;
  if (meeting.intents) {
    meeting.intents.forEach(intent => {
      intent.status = 'pending';
      intent.evidenceTimestamp = undefined;
      intent.evidenceQuote = undefined;
      intent.evidenceSpeaker = undefined;
    });
  }

  return await meeting.save();
};
