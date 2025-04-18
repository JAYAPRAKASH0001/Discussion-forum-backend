import { Router } from "express";
import { getAllQuestions, getQuestionByTag } from "../controllers/questions.controller";

const router = Router();

router.get("/", (req, res)=> getAllQuestions(req,res));
router.get("/tag/:tag", (req, res)=> getQuestionByTag(req,res));

export default router; 