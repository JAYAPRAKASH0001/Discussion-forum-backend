import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  BelongsTo,
} from 'sequelize-typescript';
import { Question } from './questions.model';

@Table({
  tableName: 'answers',
  timestamps: false,
})
export class Answer extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Question)
  @Column({ type: DataType.INTEGER, allowNull: false })
  question_id!: number;

  @BelongsTo(() => Question)
  question!: Question;

  @Column({ type: DataType.TEXT, allowNull: false })
  answer_text!: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  likes!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  dislikes!: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at!: Date;
}
