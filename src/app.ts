import express from 'express';
import cors from 'cors';
import questionRoutes from './routes/question.routes';
import answerRoutes from './routes/answer.routes';

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/questions", questionRoutes);
app.use("/api", answerRoutes); 

export default app;

