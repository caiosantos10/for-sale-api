import { PageList } from "@shared/interfaces/page-list.interface";
import Product from "../entities/Product";
import ProductRepository from "../repositories/ProductRepository";

const page = 1;
const perPage = 10;

export default class ListProductsService {
    // Ajustar tipagem do retorno para interface que tenha objeto e elementos da paginação
    public async execute(): Promise<PageList<Product>> {
        const [products, total] = await ProductRepository.findAndCount({
            skip: (page - 1) * perPage,
            take: perPage,
            order: { name: 'ASC' }, 
            // where: { active: true },
        });
        
        return {
            data: products,
            total,
            page,
            lastPage: Math.ceil(total / perPage),
        };
    }
}