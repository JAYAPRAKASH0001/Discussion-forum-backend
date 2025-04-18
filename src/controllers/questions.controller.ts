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
        res.status(200).json(questions);
    }
    catch(err){
        res.status(500).json({ success: false, message: 'Failed to fetch Questions',err});
    }
}

//Create the new question with tags.
export const createQuestion = async(req: Request, res: Response): Promise<void> => {
    try {
        const {title, description, tags} = req.body;
        const newQuestion = await Question.create({ title, description});

        const tagInstance = await Promise.all(
            tags.map( async(tagName: string)=> {
                const [tag] = await Tags.findOrCreate({ where: {tag_name: tagName} });
                return tag;
            })
        );

        //Automatically creates the association.
        await newQuestion.$set('tags',tagInstance);

        const createdQuestion = await Question.findByPk(newQuestion.id, { include: Tags });
        res.status(201).json({message: 'New Question created', question: createdQuestion?.toJSON()});
    }
    catch(err) {
        console.error('Error creating question:', err);
        res.status(500).json({ success: false, message: 'Failed to create question', err });
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
            attributes: ['id'],
            include: [{ 
                model: Tags, 
                where: { id: tag.id}, 
                attributes: [], 
                through: { attributes: []}
            }]
        });
        
        const questionsId = questions.map(q=> q.id);

        const questionsWithTags = await Question.findAll({
            where: {id: questionsId},
            include: [{
                model: Tags,
                through: { attributes: []}
            }]
        })
        res.status(200).json(questionsWithTags);
    }
    catch(err){
        res.send(500).json({ success: false, message: 'Failed to fetch Questions by Tag', err});
    }
}