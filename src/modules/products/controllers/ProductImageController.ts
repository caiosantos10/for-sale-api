import { Request, Response } from 'express';
import UpdateProductImageService from '../services/UpdateProductImageService';
import AppError from 'src/shared/errors/AppError';

export default class ProductImageController {
    public async update(request: Request, response: Response): Promise<Response> {
        try {

            const { id } = request.params;
            const image = request.file?.filename as string;
            
            const updateProductImageService = new UpdateProductImageService();
            
            const product = await updateProductImageService.execute({
                imageFileName: image, 
                productId: id,
            });
            
            return response.json(product);
        } catch (error) {
            // Verifica se o erro é uma instância de AppError
            if (error instanceof AppError) {
                return response.status(error.statusCode).json({
                    message: error.message,
                });
            }

            throw error;

            // Caso seja um erro inesperado, retorne um erro genérico
            // return response.status(500).json({
            //     message: 'Internal server error',
            // });
        }
    }
}