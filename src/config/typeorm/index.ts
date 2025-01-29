import 'reflect-metadata';
import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "forsale",
    password: "admin",
    database: "forsale",
    entities: [
        "./src/modules/**/typeorm/entities/*.ts"
    ],
    migrations: [
        "./src/shared/typeorm/migrations/*.ts"
    ],
    synchronize: true,
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