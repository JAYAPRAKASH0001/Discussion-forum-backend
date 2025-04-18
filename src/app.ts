import express from 'express';
import cors from 'cors';
import questionRoutes from './routes/question.routes';

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/questions", questionRoutes);
export default app;