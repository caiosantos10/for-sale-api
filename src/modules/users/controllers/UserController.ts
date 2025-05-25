import { Request, Response } from 'express';
import AppError from 'src/shared/errors/AppError';
import ListUsersService from '../services/ListUsersService';
import FindOneUserService from '../services/FindOneUserService';
import CreateUserService from '../services/CreateUserService';
import UpdateUserService from '../services/UpdateUserService';
import DeleteUserService from '../services/DeleteUserService';

export default class UserController {
    public async index(request: Request, response: Response): Promise<Response> {
        const listUsersService = new ListUsersService();

        const users = await listUsersService.execute();

        return response.json(users);
    }

    public async show(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const showUserService = new FindOneUserService();

        const user = await showUserService.execute({ id });

        return response.json(user);
    }

    public async create(request: Request, response: Response): Promise<Response> {
        try {
            const {
                name,
                lastName,
                email,
                password,
                role
            } = request.body;

            const createUserService = new CreateUserService();

            const user = await createUserService.execute({
                name,
                lastName,
                email,
                password,
                role
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

    public async update(request: Request, response: Response): Promise<Response> {
        try {

            const { id } = request.params;
            const {
                name,
                lastName,
                email,
                password,
                role,
                addresses
            } = request.body;
            
            const updateUserService = new UpdateUserService();
            
            const user = await updateUserService.execute({
                id,
                name,
                lastName,
                email,
                password,
                role,
                addresses
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

    public async delete(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const deleteUserService = new DeleteUserService();

        await deleteUserService.execute({ id });

        return response.json([]);
    }
}