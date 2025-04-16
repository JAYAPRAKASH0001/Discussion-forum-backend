import app from './app';
import path from 'path';
import dotenv from 'dotenv';
import './config/db';

dotenv.config({ path: path.resolve(__dirname, "./config/.env")});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});