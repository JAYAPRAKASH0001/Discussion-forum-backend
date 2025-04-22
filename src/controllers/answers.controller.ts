import { Request, Response } from 'express';
import { Answer } from '../models/answers.model';
import { Question } from '../models/questions.model';
import { literal } from 'sequelize';





export const getAnswersByQuestionId = async (req: Request, res: Response): Promise<void> => {
  const questionId = req.params.id;

  try {
      const question = await Question.findByPk(questionId, {
          include: [{
            model: Answer,
            separate: true,
            order: [[literal('likes - dislikes'), 'DESC']]
          }]
      });

      if (!question) {
          res.status(404).json({
              success: false,
              message: 'Question not found.'
          });
          return; 
      }

      res.status(200).json({
          success: true,
          question: question.title,
          answers: question.answers
      });
  } catch (err) {
      console.error('Error fetching answers for question:', err);
      res.status(500).json({
          success: false,
          message: 'Failed to fetch answers.',
          err
      });
  }
};



export const createAnswer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { answer_text } = req.body;
    const question_id = Number(req.params.id);

    if (!question_id) {
      res.status(400).json({ success: false, message: "Question ID is required." });
      return;
    }

    // Check if the question exists
    const question = await Question.findByPk(question_id);
    if (!question) {
      res.status(404).json({ success: false, message: "Question not found." });
      return;
    }

    const newAnswer = await Answer.create({
      answer_text,
      question_id,
    });

    res.status(201).json({
      message: "Answer submitted successfully",
      answer: newAnswer.toJSON(),
    });
  } catch (err) {
    console.error("Error creating answer:", err);
    res.status(500).json({ success: false, message: "Failed to create answer", err });
  }
};




// Like an answer
export const likeAnswer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const answer = await Answer.findByPk(id);
    if (!answer) {
      res.status(404).json({ message: 'Answer not found' });
      return;
    }
    answer.likes += 1;
    await answer.save();
    res.status(200).json({ message: 'Answer liked', likes: answer.likes });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to like answer', err });
  }
};


//Dislikes an answer
export const disLikeAnswer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const answer = await Answer.findByPk(id);
    if (!answer) {
      res.status(404).json({ message: 'Answer not found' });
      return;
    }
    answer.dislikes += 1;
    await answer.save();
    res.status(200).json({ message: 'Answer disliked', dislikes: answer.dislikes });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to dislike answer', err });
  }
};

// Delete an answer by ID
export const deleteAnswer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Answer.destroy({ where: { id } });

    if (deleted === 0) {
      res.status(404).json({ success: false, message: 'Answer not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Answer deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete answer', err });
  }
};

