import { Request, Response } from 'express';
import AppError from 'src/shared/errors/AppError';
import FindOnePurchaseService from '../services/FindOnePurchaseService';
import CreatePurchaseService from '../services/CreatePurchaseService';
import UpdatePurchaseService from '../services/UpdatePurchaseService';

export default class PurchaseController {
    public async show(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const showPurchaseService = new FindOnePurchaseService();
        const purchase = await showPurchaseService.execute({ id });

        return response.json(purchase);
    }

    public async create(request: Request, response: Response): Promise<Response> {
        try {
            const user_id = request.user.id;
            const { cart_id } = request.body;

            const createPurchaseService = new CreatePurchaseService();

            const purchase = await createPurchaseService.execute({
                user_id,
                cart_id,
            });

            return response.json(purchase);
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
            const { status } = request.body;
            
            const updatePurchaseService = new UpdatePurchaseService();
            
            const Purchase = await updatePurchaseService.execute({
                id,
                status,
            });
            
            return response.json(Purchase);
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