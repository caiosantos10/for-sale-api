import { Request, Response } from 'express';
import AppError from 'src/shared/errors/AppError';
import FindOneCartService from '../services/FindOneCartService';
import CreateCartService from '../services/CreateCartService';
import UpdateCartService from '../services/UpdateCartService';
import DeleteCartService from '../services/DeleteCartService';
import GetByUserCartService from '../services/GetByUserCartService';

export default class CartController {
    public async show(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const showCartService = new FindOneCartService();
        const cart = await showCartService.execute({ id });

        return response.json(cart);
    }

    public async findByUser(request: Request, response: Response): Promise<Response> {
        const id = request.user.id;
        const getByUserCartService = new GetByUserCartService();
        const cart = await getByUserCartService.execute({ user_id: id });

        return response.json(cart);
    }

    public async create(request: Request, response: Response): Promise<Response> {
        try {
            const user_id = request.user.id;
            const { productIds } = request.body;

            const createCartService = new CreateCartService();

            const cart = await createCartService.execute({
                user_id,
                product_ids: productIds,
            });

            return response.json(cart);
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
            const { productIds } = request.body;
            
            const updateCartService = new UpdateCartService();
            
            const cart = await updateCartService.execute({
                id,
                product_ids: productIds,
            });
            
            return response.json(cart);
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

        const deleteCartService = new DeleteCartService();

        await deleteCartService.execute({ id });

        return response.json([]);
    }
}