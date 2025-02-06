import { Request, Response } from 'express';
import CreateSessionService from '../services/CreateSessionService';
import AppError from 'src/shared/errors/AppError';

export default class SessionsController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { email, password } = request.body;

        const createSessionService = new CreateSessionService();

        try {
            const user = await createSessionService.execute({
                email,
                password
            });
            
            return response.json(user);
        } catch (error) {
            // Verifica se o erro é uma instância de AppError
            if (error instanceof AppError) {
                return response.status(error.statusCode).json({
                    message: error.message,
                });
            }

            throw error;
        }
    }
}