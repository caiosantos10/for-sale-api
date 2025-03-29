import AppError from '@shared/errors/AppError';
import { Request, Response, NextFunction } from 'express';

const errorHandler = (
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction
) => {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message,
        });
    }

    return response.status(500).json({
        status: 500,
        message: 'Internal Server Error.',
    });
}

export default errorHandler;