import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import routes from './config/routes';
import AppError from './shared/errors/AppError';
import './config/typeorm';
import { errors } from 'celebrate';
import { setupSwagger } from './swagger.config';

const app = express(); 

// Configuração do Swagger
setupSwagger(app);

app.use(cors());
app.use(express.json());

app.use(routes);

app.use(errors());

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: 'error',
            message: error.message,
        });
    }

    return response.status(500).json({
        status: 'error',
        message: 'Internal Server Error.',
    });
});

app.listen(3333, () => {
    console.log('Server started on port 3333.');
});