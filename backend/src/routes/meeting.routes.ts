import { Router } from 'express';
import * as meetingController from '../controllers/meeting.controller';
const router = Router();

router.get('/', meetingController.getMeetings);
router.get('/search', meetingController.searchMeetings);
router.get('/:id', meetingController.getMeeting);
router.patch('/:id/action-items/:actionItemId', meetingController.updateActionItem);
router.post('/:id/highlights', meetingController.createHighlight);
router.put('/:id/intents', meetingController.updateIntents);
router.post('/:id/intents/reset', meetingController.resetIntents);
router.patch('/:id/completion', meetingController.updateCompletion);

export default router;
