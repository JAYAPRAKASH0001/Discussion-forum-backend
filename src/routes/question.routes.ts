import { Router } from "express";
import { createQuestion, getAllQuestions, getQuestionById, getQuestionByTag, searchQuestion } from "../controllers/questions.controller";

const router = Router();

router.get("/", (req, res)=> getAllQuestions(req,res));
router.get("/tag/:tag", (req, res)=> getQuestionByTag(req,res));
router.post("/new", (req, res)=> createQuestion(req,res));
router.get("/search", (req, res)=> searchQuestion(req,res));
router.get("/:id", (req, res)=> getQuestionById(req, res));

export default router; 