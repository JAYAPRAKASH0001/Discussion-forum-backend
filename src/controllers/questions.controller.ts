import { Request, Response } from "express";
import { Question } from "../models/questions.model";
import { Tags } from "../models/tags.model";


//Fetch all questions
export const getAllQuestions = async(req: Request, res: Response): Promise<void> => {
    try{
        const questions = await Question.findAll({
            include: [{ model: Tags, through: { attributes: [] } }]
        });
        const formattedResult = questions.map(q => ({
            id: q.id,
            title: q.title,
            description: q.description,
            created_at: q.created_at,
            tags: q.tags.map(t => t.tag_name)
        }));
        res.status(200).json(formattedResult);
    }
    catch(err){
        res.status(500).json({ success: false, message: 'Failed to fetch Questions',err});
    }
}

export const getQuestionByTag = async(req: Request, res: Response): Promise<void> => {
    const tagname = req.params.tag;
    try {
        const tag = await Tags.findOne({ where: { tag_name: tagname}, attributes: ['id'], raw: true});
        if(!tag){
            res.status(404).json({ success: false, message: 'Tag not found'});
            return;
        }
        const questions = await Question.findAll({
            include: [
                { model: Tags, where: { id: tag.id}, through: { attributes: []}}
            ]
        });
        res.status(200).json(questions);
    }
    catch(err){
        res.send(500).json({ success: false, message: 'Failed to fetch Questions by Tag', err});
    }
}