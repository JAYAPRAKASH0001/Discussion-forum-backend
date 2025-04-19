import { Router } from 'express';
import {
  createAnswer,
  getAnswersByQuestionId,
  deleteAnswer,
  likeAnswer,
  disLikeAnswer,
} from '../controllers/answers.controller';

const router = Router();

router.get('/questions/:id/answers', getAnswersByQuestionId);
router.post('/questions/:id/answers', createAnswer);
router.delete('/answers/:id', deleteAnswer);
router.put('/answers/:id/reaction', likeAnswer);
router.put('/answers/:id/reactions',disLikeAnswer);

export default router;
