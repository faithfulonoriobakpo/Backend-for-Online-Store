import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const {
    POSTGRES_HOST,
    POSTGRES_DATABASE,
    POSTGRES_USERNAME,
    POSTGRES_PASSWORD
} = process.env;

const Client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DATABASE,
    user: POSTGRES_USERNAME,
    password: POSTGRES_PASSWORD
});

export default Client;
