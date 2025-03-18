import { Request, Response } from 'express';
import AppError from 'src/shared/errors/AppError';
import UpdateProfileService from '../services/UpdateProfileService';

export default class ProfileController {
    public async update(request: Request, response: Response): Promise<Response> {
        try {

            const { id } = request.params;
            const {
                name,
                email,
                new_password,
                old_password,
            } = request.body;
            
            const updateProfileService = new UpdateProfileService();
            
            const user = await updateProfileService.execute({
                id,
                name,
                email,
                new_password,
                old_password,
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
