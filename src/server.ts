import app from './app';
import path from 'path';
import dotenv from 'dotenv';
import sequelize from './config/db';

dotenv.config({ path: path.resolve(__dirname, "./config/.env")});

const PORT = process.env.PORT || 3000;


sequelize.sync()
    .then( ()=>{
        console.log("Connection with database is created");
        app.listen(PORT, ()=>{
            console.log(`Server is running on http://localhost:${PORT}`);
        })
    })
    .catch( (err)=> console.log("Error on Connecting database", err));