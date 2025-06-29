import { Request, Response } from 'express';
import ListProductsService from '../services/ListProductsService';
import FindOneProductService from '../services/FindOneProductService';
import CreateProductService from '../services/CreateProductService';
import UpdateProductService from '../services/UpdateProductService';
import DeleteProductService from '../services/DeleteProductService';
import AppError from 'src/shared/errors/AppError';

export default class ProductController {
    public async index(request: Request, response: Response): Promise<Response> {
        const page = parseInt(request.query.page as string) || 1;
        const perPage = parseInt(request.query.perPage as string) || 10;

        const listProductsService = new ListProductsService();

        const products = await listProductsService.execute({ page, perPage });

        return response.json(products);
    }

    public async show(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const showProductService = new FindOneProductService();

        const product = await showProductService.execute({ id });

        return response.json(product);
    }

    public async create(request: Request, response: Response): Promise<Response> {
        try {
            const { name, description, price } = request.body;

            const createProductService = new CreateProductService();

            const product = await createProductService.execute({
                name,
                description,
                price,
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

    public async update(request: Request, response: Response): Promise<Response> {
        try {

            const { id } = request.params;
            const { name, description, price } = request.body;
            
            const updateProductService = new UpdateProductService();
            
            const product = await updateProductService.execute({
                id,
                name,
                description,
                price,
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

    public async delete(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const deleteProductService = new DeleteProductService();

        await deleteProductService.execute({ id });

        return response.json([]);
    }
}