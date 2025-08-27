import { Request, Response } from 'express';
import ListMerchantsService from '../services/ListMerchantsService';
import FindOneMerchantService from '../services/FindOneMerchantService';
import CreateMerchantService from '../services/CreateMerchantService';
import UpdateMerchantService from '../services/UpdateMerchantService';
import DeleteMerchantService from '../services/DeleteMerchantService';
import AppError from 'src/shared/errors/AppError';

export default class MerchantController {
    public async index(request: Request, response: Response): Promise<Response> {
        const page = parseInt(request.query.page as string) || 1;
        const perPage = parseInt(request.query.perPage as string) || 10;

        const { legalName } = request.query;

        const listMerchantsService = new ListMerchantsService();

        const Merchants = await listMerchantsService.execute({
            page,
            perPage,
            legal_name: legalName as string,
        });

        return response.json(Merchants);
    }

    public async show(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const showMerchantService = new FindOneMerchantService();

        const Merchant = await showMerchantService.execute({ id });

        return response.json(Merchant);
    }

    public async create(request: Request, response: Response): Promise<Response> {
        try {
            const {
                legal_name,
                trade_name,
                cnpj,
                contact_email,
                phone
            } = request.body;

            const createMerchantService = new CreateMerchantService();

            const Merchant = await createMerchantService.execute({
                legal_name,
                trade_name,
                cnpj,
                contact_email,
                phone
            });

            return response.json(Merchant);
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
                legal_name,
                trade_name,
                cnpj,
                contact_email,
                phone
            } = request.body;


            const updateMerchantService = new UpdateMerchantService();

            const merchant = await updateMerchantService.execute({
                id,
                legal_name,
                trade_name,
                cnpj,
                contact_email,
                phone
            });

            return response.json(merchant);
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

        const deleteMerchantService = new DeleteMerchantService();

        await deleteMerchantService.execute({ id });

        return response.json([]);
    }
}