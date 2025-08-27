import { PageList } from "@shared/interfaces/page-list.interface";
import Product from "../entities/Product";
import ProductRepository from "../repositories/ProductRepository";

interface IRequest {
    page: number;
    perPage: number;
    name?: string;
    description?: string;
}

export default class ListProductsService {
    public async execute({ page, perPage, name, description }: IRequest): Promise<PageList<Product>> {
        const query = ProductRepository.createQueryBuilder("product");
        if (name) {
            query.andWhere("product.name ILIKE :name", { name: `%${name}%` });
        }
        if (description) {
            query.andWhere("product.description ILIKE :description", { description: `%${description}%` });
        }

        query.orderBy("product.name", "ASC");
        query.skip((page - 1) * perPage).take(perPage);

        const [products, total] = await query.getManyAndCount();
        return {
            data: products,
            total,
            page,
            lastPage: Math.ceil(total / perPage),
        };
    }
}