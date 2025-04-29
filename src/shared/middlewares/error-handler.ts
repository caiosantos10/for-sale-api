import AppError from '@shared/errors/AppError';
import { isCelebrateError } from 'celebrate';
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

    if (isCelebrateError(error)) {
        const validationBodyError = error.details.get('body');
        const validationQueryError = error.details.get('query');
        const validationParamsError = error.details.get('params');

        const details =
            validationBodyError?.details ??
            validationQueryError?.details ??
            validationParamsError?.details;

        const message = details?.[0]?.message ?? 'Validation error';

        return response.status(400).json({
            status: 400,
            message,
        });
    }

    return response.status(500).json({
        status: 500,
        message: 'Internal Server Error.',
    });
}

export default errorHandler;