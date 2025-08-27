import { PageList } from "@shared/interfaces/page-list.interface";
import Merchant from "../entities/Merchant";
import MerchantRepository from "../repositories/MerchantRepository";

interface IRequest {
    page: number;
    perPage: number;
    legal_name?: string;
}

export default class ListMerchantsService {
    public async execute({ page, perPage, legal_name }: IRequest): Promise<PageList<Merchant>> {
        const query = MerchantRepository.createQueryBuilder("Merchant");
        if (legal_name) {
            query.andWhere("Merchant.name ILIKE :legal_name", { legal_name: `%${legal_name}%` });
        }

        query.orderBy("Merchant.legal_name", "ASC");
        query.skip((page - 1) * perPage).take(perPage);

        const [merchants, total] = await query.getManyAndCount();
        return {
            data: merchants,
            total,
            page,
            lastPage: Math.ceil(total / perPage),
        };
    }
}