import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const {
    POSTGRES_HOST,
    POSTGRES_DATABASE,
    POSTGRES_DATABASE_TEST,
    POSTGRES_USERNAME,
    POSTGRES_PASSWORD
} = process.env;

const Client = new Pool({
    host: POSTGRES_HOST,
    database: process.env.ENV == "dev"? POSTGRES_DATABASE: POSTGRES_DATABASE_TEST,
    user: POSTGRES_USERNAME,
    password: POSTGRES_PASSWORD
});

export default Client;
