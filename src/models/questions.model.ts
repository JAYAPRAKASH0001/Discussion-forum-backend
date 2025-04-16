import { AutoIncrement, Column, CreatedAt, DataType, PrimaryKey, Table, Model, BelongsToMany } from "sequelize-typescript";
import { QuestionTags } from "./question_tags.model";
import { Tags } from "./tags.model";

@Table({
    tableName: 'questions',
    timestamps: false
})
export class Question extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column({ type: DataType.STRING, allowNull: false })
    title!: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    description!: string;

    @CreatedAt
    @Column(DataType.DATE)
    createdAt!: Date;

    @BelongsToMany(()=>Tags, ()=>QuestionTags)
    tags!: Tags[];
}