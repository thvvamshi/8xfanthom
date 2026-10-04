import { Request, Response } from 'express';
import mongoose from 'mongoose';
import * as meetingService from '../services/meeting.service';

export const getMeetings = async (req: Request, res: Response) => {
  try {
    const meetings = await meetingService.getMeetings();
    res.status(200).json(meetings);
  } catch (error) {
    console.error('Error in getMeetings controller:', error);
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
};

export const searchMeetings = async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    if (!q) {
      return res.status(200).json([]);
    }
    const results = await meetingService.searchMeetings(q);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error in searchMeetings controller:', error);
    res.status(500).json({ error: 'Failed to search meetings' });
  }
};

export const getMeeting = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    const meeting = await meetingService.getMeetingById(id);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    res.status(200).json(meeting);
  } catch (error) {
    console.error('Error in getMeeting controller:', error);
    res.status(500).json({ error: 'Failed to fetch meeting' });
  }
};

export const updateActionItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const actionItemId = req.params.actionItemId as string;
    const { completed } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(actionItemId)) {
      return res.status(404).json({ error: 'Meeting or Action Item not found' });
    }

    const meeting = await meetingService.updateActionItem(id, actionItemId, completed);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting or Action Item not found' });
    }
    
    const actionItem = meeting.actionItems.find((ai: any) => ai._id.toString() === actionItemId);
    res.status(200).json(actionItem);
  } catch (error) {
    console.error('Error in updateActionItem controller:', error);
    res.status(500).json({ error: 'Failed to update action item' });
  }
};

export const createHighlight = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { startTime, endTime, text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    if (startTime === undefined || endTime === undefined || !text) {
      return res.status(400).json({ error: 'Missing highlight data' });
    }

    const meeting = await meetingService.createHighlight(id, startTime, endTime, text);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    
    const highlight = meeting.highlights[meeting.highlights.length - 1];
    res.status(201).json(highlight);
  } catch (error) {
    console.error('Error in createHighlight controller:', error);
    res.status(500).json({ error: 'Failed to create highlight' });
  }
};
