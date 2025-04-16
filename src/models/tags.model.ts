import { AutoIncrement, BelongsToMany, Column, DataType, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { Question } from "./questions.model";
import { QuestionTags } from "./question_tags.model";

@Table({
    tableName: 'tags',
    timestamps: false
})
export class Tags extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;
    
    @Unique
    @Column({ type: DataType.STRING(50), allowNull: false})
    tag_name!: string;

    @BelongsToMany(()=>Question, ()=>QuestionTags)
    questions!: Question[];
}