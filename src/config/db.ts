import { Sequelize } from "sequelize-typescript";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "./.env")});

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false,
    models: [path.resolve(__dirname, "../models")]
});

sequelize.sync()
    .then( ()=> console.log("Connection with database is created"))
    .catch( (err)=> console.log("Error on Connecting database", err));

export default sequelize;