import { Request, Response } from "express";
import { Question } from "../models/questions.model";
import { Tags } from "../models/tags.model";
import { literal, Op } from "sequelize";
import { Answer } from "../models/answers.model";

const formatQuestion = (question: Question[]) => {
    return question.map(q => ({
        id: q.id,
        title: q.title,
        description: q.description,
        created_at: q.created_at,
        tags: q.tags.map(t => t.tag_name)
    }));
}

//Fetch all questions
export const getAllQuestions = async(req: Request, res: Response): Promise<void> => {
    try{
        const filter: string = req.query.filter as string || 'newest';
        const page: number = parseInt(req.query.page as string) || 1;
        const limit: number = parseInt(req.query.limit as string) || 10;
        const offset: number = (page-1)*limit;

        const queryOptions: any = {
            include: [{ model: Tags, through: { attributes: []} }],
            limit,
            offset,
            distinct: true
        };

        if(filter==='newest'){
            queryOptions.order = [['created_at', 'DESC']];
        }
        else if(filter==='oldest'){
            queryOptions.order = [['created_at', 'ASC']];
        }
        else if(filter==='unanswered'){
            queryOptions.include.push({ model: Answer, required: false });
            queryOptions.where = literal('(SELECT COUNT(*) FROM answers WHERE answers.question_id = Question.id)=0');
            queryOptions.subQuery = false;
        }
        else{
            queryOptions.order = [['created_at', 'DESC']];
        }

        const { count, rows: questions } = await Question.findAndCountAll(queryOptions);

        if(count===0){
            res.status(404).json({success: true, message: "No Questions found"});
            return;
        }

        const totalPages = Math.ceil(count/limit);
        const formattedResult = formatQuestion(questions);

        res.status(200).json({
            success: true,
            data: formattedResult,
            pagination: {
                totalQuestions: count,
                totalPages,
                currentPage: page,
                pageSize: limit,
                hasNextPage: page<totalPages,
                hasPrevPage: page>1
            }
        });
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
        });
        const formattedResult = formatQuestion(questionsWithTags);
        res.status(200).json(formattedResult);
    }
    catch(err){
        res.status(500).json({ success: false, message: 'Failed to fetch Questions by Tag', err});
    }
}

export const searchQuestion = async(req: Request, res: Response): Promise<void> => {
    try {
        const keyword = req.query.q as string;
        const page: number = parseInt(req.query.page as string) || 1;
        const limit: number = parseInt(req.query.limit as string) || 10;
        const offset: number = (page-1)*limit;

        if(!keyword || keyword.trim()===''){
            res.status(400).json({ success: false, message: 'Search keyword is required'});
            return;
        }

        const queryOptions: any = {
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${keyword}%`}} ,
                    { description: { [Op.like]: `%${keyword}%`}}
                ]
            },
            include: [{ model: Tags, through: { attributes: []} }],
            limit,
            offset,
            distinct: true
        };

        const {count, rows: questions} = await Question.findAndCountAll(queryOptions);
        if(questions.length === 0){
            res.status(404).json({success: false, message: 'No questions found for that keyword'});
            return;
        }

        const totalPages = Math.ceil(count/limit);
        const formattedResult = formatQuestion(questions);

        res.status(200).json({
            success: true,
            data: formattedResult,
            pagination: {
                totalQuestions: count,
                totalPages,
                currentPage: page,
                pageSize: limit,
                hasNextPage: page<totalPages,
                hasPrevPage: page>1
            }
        });
    }
    catch(err){
        res.status(500).json({ success: false, message: 'Failed to search question', err});
    }
}

export const getQuestionById = async(req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const question = await Question.findByPk(
            id, 
            { include: [{ 
                model: Tags, 
                through: {attributes: []}
            }]}
        );
        
        if(!question){
            res.status(404).json({ success: false, message: "No question exists with the id"});
            return;
        }
        const formattedResult = formatQuestion([question])[0];
        res.status(200).json(formattedResult);
    }
    catch(err){
        res.status(500).json({ success: false, message: 'Failed to fetch question by id', err});
    }
}