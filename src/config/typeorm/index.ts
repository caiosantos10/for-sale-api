import 'reflect-metadata';
import { DataSource } from "typeorm";
import { env } from '../../config/env';

export const AppDataSource = new DataSource({
    type: env.DB_TYPE,
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    entities: [
        "./src/modules/**/entities/*.ts"
    ],
    migrations: [
        "./src/migrations/*.ts"
    ],
    synchronize: false,
    logging: false,
});

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSource.initialize()
    .then(() => {
        console.log('Database connected with success on port 5432.');
    })
    .catch((error) => console.log(error))