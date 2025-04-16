import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Question } from './questions.model';
import { Tags } from "./tags.model";

@Table({
    tableName: 'question_tags',
    timestamps: false
})
export class QuestionTags extends Model {
    @PrimaryKey
    @ForeignKey(()=> Question)
    @Column(DataType.INTEGER)
    question_id!: number;

    @PrimaryKey
    @ForeignKey(()=> Tags)
    @Column(DataType.INTEGER)
    tags_id!: number;
}