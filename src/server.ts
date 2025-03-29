import { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import AppError from './shared/errors/AppError';
import './config/typeorm';
import app from './shared/http/app';

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