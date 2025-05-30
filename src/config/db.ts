import { Sequelize } from "sequelize-typescript";
import path from "path";
import dotenv from "dotenv";
import { Question } from "../models/questions.model";
import { Tags } from "../models/tags.model";
import { QuestionTags } from "../models/question_tags.model";
import { Answer } from "../models/answers.model";


dotenv.config({ path: path.resolve(__dirname, "./.env")});

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false,
    models: [Question, Tags, QuestionTags,Answer],
});


export default sequelize;
